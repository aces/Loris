<?php declare(strict_types=1);

namespace LORIS\my_preferences;
use Selective\Base32\Base32;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Implements the 2FA configuration page.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class MFA extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * {@inheritDoc}
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb(
                dgettext("loris", "My Preferences"),
                '/my_preferences',
            ),
            new \LORIS\Breadcrumb(
                dgettext("my_preferences", "Configure MFA"),
                '/my_preferences/mfa',
            ),
        );
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'GET':
            return parent::handle($request);
        case 'POST':
            return $this->validateCodeAndSave(
                $request->getAttribute("user"),
                $request->getParsedBody()
            );
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET', 'POST']);

        }
    }

    /**
     * {@inheritDoc}
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/my_preferences/js/mfa.js",
            ]
        );
    }

    /**
     * Validates the code passed by the user matches the secret key that they
     * provided and save the secret key to the database if it matches
     *
     * @param \User $user   The user providing the 2FA code
     * @param array $values The parsed values submitted by the user
     *
     * @return ResponseInterface
     */
    function validateCodeAndSave(\User $user, array $values): ResponseInterface
    {
        if (!isset($values['code']) || !isset($values['secret'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Missing code or secret to validate'
            );
        }
        $base32Decoder = new Base32();
        $secret        = $base32Decoder->decode($values['secret']);
        $validator     = new \LORIS\Security\OTP\TOTP(secret: $secret);
            $counter   = $validator->getTimeCounter();
        $wantCode      = $validator->getCode($counter, 6);
        if ($wantCode !== strval($values['code'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Invalid code provided. MFA not registered.'
            );
        }
        $db = $this->loris->getDatabaseConnection();
        $db->_trackChanges = false;
        // We are dealing with binary data that never gets exposed to the user
        $db->unsafeUpdate(
            "users",
            ['TOTPSecret' => $secret],
            ['ID' => $user->getId()]
        );

        $login = $_SESSION['State']->getProperty('login');
        $login->setPassedMFA();
        return new \LORIS\Http\Response\JSON\OK(
            [
                'ok'      => 'success',
                'message' => dgettext(
                    'my_preferences',
                    'Successfully registered multifactor authenticator'
                )
            ]
        );
    }
}

