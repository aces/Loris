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
<<<<<<< HEAD
     * @throws \LorisException
=======
>>>>>>> 5ed82d2805b8290456bd6133fea6119bb010e963
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
<<<<<<< HEAD
     * @throws \LorisException
     */
    function processRequest(array $values) : array
    {
=======
     */
    function processRequest(array $values) : array
    {
        $response = array();
>>>>>>> 5ed82d2805b8290456bd6133fea6119bb010e963
        if (isset($values['command']) && $values['command'] == 'initialize') {
            // initialize - setup form data to return.
            $response           = $this->initializeSetup($values);
            $response['status'] = 'success';
        } else if (isset($values['command']) && $values['command'] == 'reset') {
            // reset - password reset request by user.
            $response           = $this->resetPassword($values);
            $response['status'] = 'success';
        } else if (isset($values['command']) && $values['command'] == 'request') {
            // request - account request by user.
            $response           = $this->requestAccount($values);
            $response['status'] = 'success';
        } else if (isset($values['command']) && $values['command'] == 'login') {
            // login - user attempting to login.
            $response = $this->login($values);
        } else if (isset($values['command']) && $values['command'] == 'expired') {
            // login - expired password update
            $response = $this->expiredPassword($values);
<<<<<<< HEAD
        } else {
            $response['status'] = 'error';
=======
>>>>>>> 5ed82d2805b8290456bd6133fea6119bb010e963
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

        // Previous login failed.
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
<<<<<<< HEAD
     * @throws \LorisException
=======
>>>>>>> 5ed82d2805b8290456bd6133fea6119bb010e963
     */
    function resetPassword(array $values) : array
    {
        // Always claim success to avoid providing user info to attackers.
        $values['success'] = 'Password reset. '
            . 'You should receive an email within a few minutes.';

        // Create the user object.
        $username = $values['username'];
        $user     =& \User::singleton($username);

        // Check if valid user.
        $email = $user->getData('Email');
        if (empty($email)) {
            $values['error'] = 'Not a valid user';
            return $values;
        }

        try {
            // Check if valid email.
            if ($user->isEmailValid()) {
                $config = \NDB_Config::singleton();
                // Generate a new password.
<<<<<<< HEAD
                $password = \User::newPassword();
                // Reset the password in the database and
                // expire password so user must change it upon login.
                $user->updatePassword($password, '1999-01-01');
                // Send the user an email.
                $msg_data['study']    = $config->getSetting('title');
                $msg_data['url']      = $config->getSetting('url');
=======
                $password = \Utility::randomString();
                // Reset the password in the database and
                // expire password so user must change it upon login.
                \User::updatePassword(
                    new \Password($password),
                    new \DateTime('1999-01-01')
                );
                // Send the user an email.
                $msg_data          = array();
                $msg_data['study'] = $config->getSetting('title');
                $msg_data['url']   = $config->getSetting('url');
>>>>>>> 5ed82d2805b8290456bd6133fea6119bb010e963
                $msg_data['realname'] = $user->getData('Real_name');
                $msg_data['password'] = $password;
                \Email::send($email, 'lost_password.tpl', $msg_data);
            } else {
                $values['error'] = 'Sending reset email failed.';
                error_log(
                    $_SERVER['REMOTE_ADDR']
                    . '(' . $_SERVER['HTTP_X_FORWARDED_FOR'] . ')'
                    . ' attempted to reset password for ' . $username
                );
            }
        } catch(\LorisException $e) {
            error_log($e->getMessage());
            $values['error'] = 'Sending reset email failed.';
        }
        return $values;
    }

    /**
     * Process request account form.
     *
     * @param array $values the user data received.
     *
     * @return array
<<<<<<< HEAD
     * @throws \DatabaseException
=======
>>>>>>> 5ed82d2805b8290456bd6133fea6119bb010e963
     */
    function requestAccount(array $values) : array
    {
        $config           =& \NDB_Config::singleton();
        $reCAPTCHAPrivate = $config->getSetting('reCAPTCHAPrivate');

        // Verify reCAPTCHA
        if (isset($values['g-recaptcha-response']) && isset($reCAPTCHAPrivate)) {
            $recaptcha = new \ReCaptcha\ReCaptcha($reCAPTCHAPrivate);
            $resp      = $recaptcha->verify(
                $values['g-recaptcha-response'],
                $_SERVER['REMOTE_ADDR']
            );
            if (!$resp->isSuccess()) {
                $values['error'] = 'Please complete the reCaptcha!';
                return $values;
            }
        }

        $DB       = \Database::singleton();
        $name     = htmlspecialchars($values['firstname'], ENT_QUOTES);
        $lastname = htmlspecialchars($values['lastname'], ENT_QUOTES);
        $from     = htmlspecialchars($values['email'], ENT_QUOTES);
        $site     = $values['site'];
        $fullname = $name . ' ' . $lastname;

        $vals = array(
                 'UserID'           => $from,
                 'Real_name'        => $fullname,
                 'First_name'       => $name,
                 'Last_name'        => $lastname,
                 'Pending_approval' => 'Y',
                 'Email'            => $from,
                );

        // Check email address' uniqueness
        $result = $DB->pselectOne(
            "SELECT COUNT(*) FROM users WHERE Email = :VEmail",
            array('VEmail' => $from)
        );

        $user_id = null;

        if ($result == 0) {
            // insert into DB only if email address doesn't exist
            $DB->insert('users', $vals);
            // Get the ID of the new user and insert into user_psc_rel
            $user_id = $DB->getLastInsertId();

            $DB->insert(
                'user_psc_rel',
                array(
                 'UserID'   => $user_id,
                 'CenterID' => $site,
                )
            );

            if ($values['examiner'] == 'true') {
                $rad = 0;
                if ($values['radiologist'] == 'true') {
                    $rad = 1;
                }
                //insert in DB as inactive until account approved
                $examinerID = $DB->pselect(
                    "SELECT e.examinerID
                     FROM examiners e
                     WHERE e.full_name=:fn",
                    array("fn" => $fullname)
                );

                // If examiner not in table add him
                if (empty($examinerID)) {
                    $DB->insert(
                        'examiners',
                        array(
                         'full_name'   => $fullname,
                         'radiologist' => $rad,
                         'userID'      => $user_id,
                        )
                    );
                    $examinerID = $DB->getLastInsertID();
                    $DB->insert(
                        'examiners_psc_rel',
                        array(
                         'examinerID'       => $examinerID,
                         'centerID'         => $site,
                         'active'           => 'Y',
                         'pending_approval' => 'Y',
                        )
                    );
                }
            }
        }
        // Show success message even if email already exists for security reasons
        $values['success'] = true;
        return $values;
    }

    /**
     * Processes login data submitted via login form.
     *
     * @param array $values the user data received.
     *
     * @return array
     */
    function login(array $values) : array
    {

        $login   = new SinglePointLogin();
        $success = $login->passwordAuthenticate(
            $values['username'],
            $values['password'],
            false
        );
        if ($success) {
            // login success.
            $values['status'] = 'success';
        } else {
            // login failed.
            $values['error'] = $login->_lastError;
        }
        // wipe the old data.
        $values['username'] = $values['password'] = '';

        if (isset($_SESSION['PasswordExpiredForUser'])) {
            $values['expired'] = true;
            $values['error']   = 'Password expired for user.';
        }

        return $values;
    }

    /**
     * Expired password update.
     *
     * @param array $values the user data received.
     *
     * @return array
<<<<<<< HEAD
     * @throws \LorisException
=======
>>>>>>> 5ed82d2805b8290456bd6133fea6119bb010e963
     */
    function expiredPassword(array $values) : array
    {
        // Check if password is not empty.
        if (empty($values['password']) || empty($values['confirm'])) {
            $values['error'] = 'Can not use an empty password';
        }
        // Update the user password.
        if (isset($_SESSION['PasswordExpiredForUser'])) {
            $user = \User::factory($_SESSION['PasswordExpiredForUser']);
            $data = $user->getData();
            // Check if new password is same as old password.
            if (password_verify($_POST['password'], $data['Password_hash'])) {
                $values['error'] = 'You cannot keep the same password';
                return $values;
            }
<<<<<<< HEAD
            // Check if password meets strength requirement.
            if (!\User::isPasswordStrong(
                $values['password'],
                array(
                 $values['confirm'],
                 $data['UserID'],
                 $data['Email'],
                ),
                array(
                 '==',
                 '!=',
                 '!=',
                )
            )
            ) {
                $values['error'] = 'The password is weak, or'
                    . ' the passwords do not match.';
                return $values;
            }
=======
>>>>>>> 5ed82d2805b8290456bd6133fea6119bb010e963
            // Update password
            $user->updatePassword($values['password']);
            unset($_SESSION['PasswordExpiredForUser']);
            $values['status'] = 'success';
        } else {
            $values['error'] = 'Server encountered an error.';
        }
        return $values;
    }
}
