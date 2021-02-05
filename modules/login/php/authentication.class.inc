<?php declare(strict_types=1);

namespace LORIS\login;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;
use SinglePointLogin;
use State;

/**
 * GET & POST request methods for authentication.
 *
 * Used to login and retrieve authentication info
 * from the login form.
 *
 * @category Loris
 * @package  Login
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Authentication extends \NDB_Page implements ETagCalculator
{
    /**
     * This function will return a json object for login module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        case 'POST':
            return $this->_handlePOST($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Initialize setup of the login module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        $response = $this->initializeSetup($request);
        return new \LORIS\Http\Response\JsonResponse(
            $response
        );
    }

    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = json_decode((string) $request->getBody(), true);

        if (isset($values['command'])
            && $values['command'] === 'login'
        ) {
            // user attempting to login.
            return $this->login($request);
        }

        return new \LORIS\Http\Response\JSON\BadRequest(
            'Error'
        );
    }

    /**
     * Initialize setup.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return array
     */
    function initializeSetup(ServerRequestInterface $request) : array
    {
        // Parse GET query params.
        $values = $request->getQueryParams();

        // Login Setup.
        $loginData = [];
        $login     = $_SESSION['State']->getProperty('login');

        // Previous login failed.
        if (!empty($login->_lastError)) {
            $loginData['error'] = $login->_lastError;
        }
        $config      = \NDB_Factory::singleton()->config();
        $study_links = $config->getExternalLinks('Studylinks');
        foreach ($study_links as $label => $url) {
            $windowName           = md5($url);
            $loginData['links'][] = [
                'url'        => $url,
                'label'      => $label,
                'windowName' => $windowName,
            ];
        }
        $loginData['description'] = html_entity_decode(
            $config->getSetting('StudyDescription')
        );
        $loginData['title']       = $config->getSetting('title');
        $loginData['logo']        = $config->getSetting('studylogo');
        $values['login']          = $loginData;

        // Request Account Setup.
        $requestAccountData = [];
        $reCAPTCHAPrivate   = $config->getSetting('reCAPTCHAPrivate');
        $reCAPTCHAPublic    = $config->getSetting('reCAPTCHAPublic');
        // reCAPTCHA if both private and public keys are set
        if ($reCAPTCHAPrivate && $reCAPTCHAPublic) {
            $requestAccountData['captcha'] = $reCAPTCHAPublic; // captcha key.
        }
        $requestAccountData['site']    = \Utility::getSiteList();
        $requestAccountData['project'] = \Utility::getProjectList();
        $values['requestAccount']      = $requestAccountData;

        return $values;
    }

    /**
     * Processes login data submitted via login form.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    function login(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = json_decode((string) $request->getBody(), true) ?? [];

        $login   = new SinglePointLogin();
        $success = $login->passwordAuthenticate(
            $values['username'],
            $values['password'],
            false,
        );
        if ($success) {
            // login success.
            $values['status']  = 'success';
            $_SESSION['State'] =& State::singleton();
            $_SESSION['State']->setProperty('login', $login);
            $login->setState();
        } else if ($login->passwordChangeRequired()) {
            return new \LORIS\Http\Response\JSON\Conflict(
                'password expired'
            );
        } else {
            // login error.
            return new \LORIS\Http\Response\JSON\Conflict(
                (string) $login->_lastError
            );
        }

        // wipe the old data.
        unset($values['username']);
        unset($values['password']);

        return new \LORIS\Http\Response\JsonResponse(
            $values
        );
    }

    /**
     * An ETagCalculator provides the ability to calculate an ETag for
     * an incoming HTTP request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return string The value to use for the ETag header.
     */
    public function ETag(ServerRequestInterface $request): string
    {
        if ($request->getMethod() === 'POST') {
            return '';
        }
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return [
            'GET',
            'POST',
        ];
    }

    /**
     * Returns true if the user has permission to access
     * the Login module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

}
