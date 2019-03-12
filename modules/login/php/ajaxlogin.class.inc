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
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        /**
         * Ensure it's a POST request.
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
     */
    function processRequest(array $values) : array
    {
        if (isset($values['command']) && $values['command'] == 'initialize') {
            $response           = $this->initializeSetup($values);
            $response['status'] = 'success';
        } else if (isset($values['command']) && $values['command'] == 'reset') {
            // $response           = $this->login($values);
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
        $login = $_SESSION['State']->getProperty('login');
        if (!empty($login->_lastError)) {
            $values['error'] = $login->_lastError;
        }
        $config =& \NDB_Config::singleton();

        $study_links = $config->getExternalLinks('Studylinks');
        foreach ($study_links as $label => $url) {
            $WindowName = md5($url);
            $values['studylinks'][] = array(
                                       'url'        => $url,
                                       'label'      => $label,
                                       'windowName' => $WindowName,
                                      );
        }
        $values['study_description'] = html_entity_decode(
            $config->getSetting('StudyDescription')
        );

        $values['study_title'] = $config->getSetting('title');
        $values['study_logo']  = $config->getSetting('studylogo');

        return $values;
    }

    /**
     * reset password.
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

        // create the user object
        $username = $values['username'];
        $user     =& \User::singleton($username);

        $email = $user->getData('Email');
        // check that it is a valid user
        if (empty($email) || empty($user)) {
            return $values;
        }

        try {
            // check that the email is valid
            if ($user->isEmailValid()) {
                $config = \NDB_Config::singleton();
                // generate a new password
                $password = \User::newPassword();
                // reset the password in the database
                // expire password so user must change it upon login
                $user->updatePassword($password, '1999-01-01');
                if ($success === false) {
                    error_log("Could not update password for $username");
                    return $values;
                }
                // send the user an email
                $msg_data['study']    = $config->getSetting('title');
                $msg_data['url']      = $config->getSetting('url');
                $msg_data['realname'] = $user->getData('Real_name');
                $msg_data['password'] = $password;
                \Email::send($email, 'lost_password.tpl', $msg_data);

            } else {
                error_log(
                    $_SERVER['REMOTE_ADDR']
                    . '(' . $_SERVER['HTTP_X_FORWARDED_FOR'] . ')'
                    . " attempted to reset password for $username"
                );
            }
        } catch(\Exception $e) {
            error_log('Unhandled exception in reset_password.');
        }

        return $values;
    }
}
