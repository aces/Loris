<?php
namespace LORIS\oidc;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

use \Firebase\JWT\JWK;
use \Firebase\JWT\JWT;
/**
 * Implements a page to handle the callback from an OpenID Connect
 * provider.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Callback extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Handle a callback from an existing OpenID Connect Identity Provider after
     * they have authorized the request.
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $params = $request->getQueryParams();
        if (!isset($params['code'])) {
            return new \LORIS\Http\Response\JSON\BadRequest("No code");
        }
        if (!isset($params['state'])) {
            return new \LORIS\Http\Response\JSON\BadRequest("Missing state");
        }
        $DB = $this->loris->getDatabaseConnection();

        // we trust the state passed (if it's in the DB) but use the nonce to
        // validate against CSRF attacks.
        $oidcstate = $DB->pselectRow(
            "SELECT OpenIDProviderID, Nonce
                 FROM openid_connect_csrf
             WHERE State=:thestate",
            ['thestate' => $params['state']]
        );
        if (empty($oidcstate)) {
            return new \LORIS\Http\Response\JSON\BadRequest("Invalid state");
        }
        $DB->delete('openid_connect_csrf', ['State' => $params['state']]);

        $code = $params['code'];

        $clientsettings = $DB->pselectRow(
            "SELECT
                BaseURI as urlbase,
                ClientID as client_id,
                ClientSecret as client_secret,
                RedirectURI as redirect_uri
            FROM openid_connect_providers WHERE OpenIDProviderID=:providerid
            ",
            ['providerid' => $oidcstate['OpenIDProviderID']]
        );
        if (empty($clientsettings)) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "Could not find provider settings"
            );
        }

        $client = new \GuzzleHttp\Client(
            [
                'base_uri' => $clientsettings['urlbase']
            ]
        );

        $openid_config = $this->_getOpenIDConfiguration($client);
        if ($openid_config == null) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "OpenID Identity Provider is missing discovery endpoint."
            );
        }
        if (!isset($openid_config['token_endpoint'])) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "OpenID Identity Provider is missing token_endpoint"
            );
        }

        $userinfo = $this->_getAuthorizationIDToken(
            $client,
            $openid_config['token_endpoint'],
            $openid_config['jwks_uri'],
            $clientsettings,
            $code,
            $oidcstate['Nonce']
        );
        if ($userinfo === null) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "Could not get token"
            );
        }
        if (isset($userinfo->email_verified) && $userinfo->email_verified == true) {
            $DB = $this->loris->getDatabaseConnection();

            $UserID = $DB->pselectOne(
                "SELECT UserID FROM users where Email=:useremail",
                ['useremail' => $userinfo->email],
            );

            if (!empty($UserID)) {
                $user = \User::factory($UserID);
                if ($user->isPendingApproval()) {
                    return new \LORIS\Http\Response\JSON\OK(
                        ["error" =>"Account is pending approval"],
                    );
                }

                $login = new \SinglePointLogin();
                $login->setLoggedInUser($user);
                $response = parent::handle($request)
                    ->withStatus(302)
                    ->withHeader("Location", "/");
                return $response;
            } else {
                // Redirect to request account with info pre-filled
                $response = parent::handle($request)
                    ->withStatus(302)
                    ->withHeader(
                        "Location",
                        "/login?page=request"
                            . "&firstname=" .urlencode($userinfo->given_name ?? '')
                            . "&lastname=" . urlencode($userinfo->family_name ?? '')
                            . "&email=" . urlencode($userinfo->email ?? '')
                    );
                return $response;
            }
        } else {
            // Not clear what the correct response here is. We can't trust the email,
            // but everything is configured correctly and the workflow worked..
            return new \LORIS\Http\Response\JSON\OK(
                ["error" => "Email not verified"],
            );
        }
    }

    /**
     * Get the .well-known/openid-configuration endpoint and parse the
     * results into an array.
     *
     * Client should already have the URL base set.
     *
     * @param \GuzzleHttp\Client $client The Guzzle client to use for openid
     *                                   configuration discovery.
     *
     * @return ?array
     */
    private function _getOpenIDConfiguration(\GuzzleHttp\Client $client) : ?array
    {
        $response = $client->request('GET', '/.well-known/openid-configuration');
        if ($this->_isOKResponse($response) == false) {
            return null;
        }

        $respjson = json_decode($response->getBody(), true);
        if ($respjson === false) {
            return null;
        }
        return $respjson;
    }

    /**
     * Get a decoded id_token from the OpenID Connect identity provider
     * for the code that they gave us and validate the nonce.
     *
     * @param \GuzzleHttp\Client $client         The Guzzle client to use
     *                                           to make requests.
     * @param string             $tokenendpoint  The OpenID endpoint to
     *                                           request tokens from.
     * @param string             $jwksendpoint   The location of the JWKS
     *                                           keys used to sign tokens.
     * @param array              $clientsettings The client settings used
     *                                           to make the request
     * @param string             $code           The code sent by the OIDC
     *                                           provider.
     * @param string             $nonce          The nonce we expect the token
     *                                           to have.
     *
     * @return ?object
     */
    private function _getAuthorizationIDToken(
        \GuzzleHttp\Client $client,
        string $tokenendpoint,
        string $jwksendpoint,
        array $clientsettings,
        string $code,
        string $nonce
    ) : ?object {
        $response = $client->request(
            'POST',
            $tokenendpoint,
            [
                'auth'        => [
                    $clientsettings['client_id'],
                    $clientsettings['client_secret'],
                ],
                'form_params' => [
                    'grant_type'   => 'authorization_code',
                    'code'         => $code,
                    'redirect_uri' => $clientsettings['redirect_uri'],
                ]
            ]
        );

        if ($this->_isOKResponse($response) == false) {
            return null;
        }
        $respjson = json_decode($response->getBody(), true);

        if (!is_array($respjson)) {
            return null;
        }
        // We don't actually care about this but it implies that something
        // went wrong.
        if ($respjson['token_type'] !== 'Bearer') {
            return null;
        }
        if (empty($respjson['access_token'])) {
            return null;
        }

        // Decode the id_token to get the user info instead of the access token.
        // We need to decode the id_token to get the nonce, but since we're decoding
        // it anyways this avoids a round trip to the userinfo endpoint to get the
        // profile information.
        $idtoken   = $respjson['id_token'];
        $jwks      = $client->request('GET', $jwksendpoint, []);
        $jwks_json = json_decode($jwks->getBody(), true);
        // JWK::parseKeySet requires a 'kid' parameter because it uses the
        // kid (key id) internally as a key in an associative array. The
        // parameter is not required by JWKS and some providers (ie. Globus)
        // don't provide it, so instead we manually try each key until
        // we find one that works.
        foreach ($jwks_json['keys'] ?? [] as $key) {
            try {
                $decoded = JWT::decode($idtoken, JWK::parseKey($key));
                if ($decoded->nonce != $nonce) {
                    // it was decoded but the nonce doesn't match, error out.
                    return null;
                }
                return $decoded;
            } catch (\Exception $e) {
                // it couldn't be decoded with this key, try the next.
            }
        }
        // No keys could decode the token.
        return null;
    }

    /**
     * Helper to make sure the response was in the Success range.
     *
     * @param \Psr\Http\Message\ResponseInterface $response The response to check
     *
     * @return bool
     */
    private function _isOKResponse(
        \Psr\Http\Message\ResponseInterface $response
    ) : bool {
        $code = $response->getStatusCode();
        return $code >= 200 && $code < 300;
    }
}
