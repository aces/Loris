<?php
/**
 * POST request methods.
 *
 * Used to retrieve info & login by the login form.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Login
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\login;

use LORIS\Http\StringStream;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use SinglePointLogin;

/**
 * The NDB_Page for the POST requests.
 *
 * @category Loris
 * @package  Login
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class AjaxLogin extends \NDB_Page
{
    public $skipTemplate = true;
    public $AjaxModule   = true;

    /**
     * This function will return a json object for login.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     * @throws \LorisException
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        /**
         * Ensure POST request.
         */
        if ($request->getMethod() != 'POST') {
            return (new \LORIS\Http\Response())
                ->withHeader('Content-Type', 'application/json')
                ->withStatus(405)
                ->withHeader('Allow', 'POST')
                ->withBody(
                    new \LORIS\Http\StringStream(
                        'Only POST requests are allowed'
                    )
                );
        }
        /**
         * Parse POST request body.
         */
        $requestBody = $request->getParsedBody();

        /**
         * Response to reply.
         */
        $response = $this->processRequest($requestBody);

        return (new \LORIS\Http\Response())
            ->withHeader('Content-Type', 'application/json')
            ->withStatus(200)
            ->withHeader('Allow', 'POST')
            ->withBody(
                new StringStream(json_encode($response))
            );
    }

    /**
     * Processes the request values.
     *
     * @param array $values the user data received.
     *
     * @return array
     * @throws \LorisException
     */
    function processRequest(array $values) : array
    {
        if (isset($values['command']) && $values['command'] == 'initialize') {
            $response           = $this->initializeSetup($values);
            $response['status'] = 'success';
        } else if (isset($values['command']) && $values['command'] == 'reset') {
            $response           = $this->resetPassword($values);
            $response['status'] = 'success';
        } else {
            $response['status'] = 'error';
        }
        return $response;
    }
    /**
     * Initialize setup.
     *
     * @param array $values the user data received.
     *
     * @return array
     */
    function initializeSetup(array $values) : array
    {
        // Login Setup.
        $loginData = array();
        $login     = $_SESSION['State']->getProperty('login');
        if (!empty($login->_lastError)) {
            $loginData['error'] = $login->_lastError;
        }
        $config      =& \NDB_Config::singleton();
        $study_links = $config->getExternalLinks('Studylinks');
        foreach ($study_links as $label => $url) {
            $windowName           = md5($url);
            $loginData['links'][] = array(
                                     'url'        => $url,
                                     'label'      => $label,
                                     'windowName' => $windowName,
                                    );
        }
        $loginData['description'] = html_entity_decode(
            $config->getSetting('StudyDescription')
        );
        $loginData['title']       = $config->getSetting('title');
        $loginData['logo']        = $config->getSetting('studylogo');
        $values['login']          = $loginData;

        // Request Account Setup.
        $requestAccountData = array();
        $reCAPTCHAPrivate   = $config->getSetting('reCAPTCHAPrivate');
        $reCAPTCHAPublic    = $config->getSetting('reCAPTCHAPublic');
        // reCAPTCHA if both private and public keys are set
        if ($reCAPTCHAPrivate && $reCAPTCHAPublic) {
            $requestAccountData['captcha'] = $reCAPTCHAPublic; // captcha key.
        }
        $requestAccountData['site'] = \Utility::getSiteList();
        $values['requestAccount']   = $requestAccountData;

        return $values;
    }

    /**
     * Reset password.
     *
     * @param array $values the user data received.
     *
     * @return array
     * @throws \LorisException
     */
    function resetPassword(array $values) : array
    {
        // Always claim success to phishers.
        $values['success'] = 'Password reset. '
            . 'You should receive an email within a few minutes.';

        // Create the user object.
        $username = $values['username'];
        $user     =& \User::singleton($username);

        // Check if valid user.
        $email = $user->getData('Email');
        if (empty($email) || empty($user)) {
            $values['error'] = 'invalid';
            return $values;
        }

        try {
            // Check if valid email.
            if ($user->isEmailValid()) {
                $config = \NDB_Config::singleton();
                // Generate a new password.
                $password = \User::newPassword();
                // Reset the password in the database and
                // expire password so user must change it upon login.
                $user->updatePassword($password, '1990-09-18');
                // Send the user an email.
                $msg_data['study']    = $config->getSetting('title');
                $msg_data['url']      = $config->getSetting('url');
                $msg_data['realname'] = $user->getData('Real_name');
                $msg_data['password'] = $password;
                \Email::send($email, 'lost_password.tpl', $msg_data);
            } else {
                $values['error'] = 'invalid';
                error_log(
                    $_SERVER['REMOTE_ADDR']
                    . '(' . $_SERVER['HTTP_X_FORWARDED_FOR'] . ')'
                    . " attempted to reset password for $username"
                );
            }
        } catch(\Exception $e) {
            error_log('Unhandled exception in reset_password.');
            $values['error'] = 'invalid';
        }
        return $values;
    }
}
