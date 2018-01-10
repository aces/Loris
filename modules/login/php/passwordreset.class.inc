<?php
/**
 * Implements the password reset page for LORIS.
 *
 * PHP version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\login;

/**
 * Implements the password reset page for LORIS.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class PasswordReset extends \NDB_Form
{
    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        return true;
    }

    /**
     * CommonPageSetup sets up the common form elements which
     * are on the page, regardless of HTTP request method.
     *
     * @return none
     */
    function setup()
    {
        $this->tpl_data['page_title'] = 'Reset Password';
        $this->addBasicText("username", "");
    }


    /**
     * _validate validates the data that was submitted by the user. Validate
     * for password-reset only checks that a username was submitted, not that
     * it's valid, in order to prevent brute force phishing attacks.
     *
     * @param array $values The values that were submitted to the page.
     *
     * @return a (possibly empty) array of errors
     */
    function _validate($values)
    {
        // Only validate that the username was provided. Anything else gives
        // information to phishing attacks.
        if (empty($values['username'])) {
            return array('username' => 'Must enter a valid username');
        }
        return true;
    }

    /**
     * _process updates the password of the user to a temporary password, if
     * username is a valid account. If not, it will still claim success for
     * security reasons.
     *
     * @param array $values The values that were submitted to the page.
     *
     * @return void
     */
    function _process($values)
    {
        $DB         =& \Database::singleton();
        $resetLimit =10;

        // Always claim success to phishers.
        $this->tpl_data['success'] = 'Password reset. '
            . 'You should receive an email within a few minutes.';

        // Check how many reset requests this IP has made
        $userIP       = ip2long($_SERVER['REMOTE_ADDR']);
        $numberResets = intval(
            $DB->pselectOne(
                "SELECT COUNT(*) FROM password_recovery WHERE ip=:ip",
                array('ip' => $userIP)
            )
        );

        // create the user object
        $username = $values['username'];
        $user     =& \User::singleton($username);

        if (empty($user)) {
            // the user does not exist in the databse,
            // pretend like everything is fine
            return;
        }
        if ($numberResets>$resetLimit) {
            //Do something or nothing
            return;
        }

        $email  = $user->getData('Email');
        $name   = $user->getFullname();
        $userId = $user->getId();

        $length = 4;
        $token  = bin2hex(random_bytes($length));

        // TODO: problem, the insert below generate SQL FK errors because there
        // in no logged in user to track history. see database.class.inc line 895
        // user is being set to 'unknown' at this stage
        $DB->insert(
            'password_recovery',
            array(
             'ip'      => $userIP,
             'user_id' => $userId,
             'token'   => $token,
             'email'   => $email,
            )
        );

        try {
            // check that the email is valid
            if ($user->isEmailValid()) {
                $config = \NDB_Config::singleton();
                // generate a new password
                // Build reset url
                $baseURL =$config->getSetting('www');
                $url     = "$baseURL/login/authenticate-token/?token=$token";
                // send the user an email
                $msg_data['study']    = $config->getSetting('title');
                $msg_data['url']      = $url;
                $msg_data['realname'] = $name;
                $msg_data['baseurl']  = $baseURL;

                \Email::send($email, 'password_recovery.tpl', $msg_data);
            } else {
                error_log(
                    $_SERVER['REMOTE_ADDR']
                    . '(' . $_SERVER['HTTP_X_FORWARDED_FOR'] . ')'
                    . " attempted to reset password for $username"
                );
            }
        } catch(\Exception $e) {
            error_log("Unhandled exception in reset_password.");
        }
    }

}
?>
