<?php
/**
 * Implements the user password change page for LORIS.
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
 * Implements the user password change page for LORIS.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class PasswordChange extends \NDB_Form
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
        $this->tpl_data['page_title'] = 'Update Password';
        $factory  = \NDB_Factory::singleton();
        $settings = $factory->settings();
        $baseURL  = $settings->getBaseURL();
        $DB       =& \Database::singleton();

        // If token is not set, redirect to login page immediately
        $token      = $_GET['token'] ?? '';
        $validToken = $DB->pselectRow(
            'SELECT *, TIMESTAMPDIFF(HOUR,time,CURRENT_TIMESTAMP) as token_age 
              FROM password_recovery 
              WHERE token=:tok',
            array('tok' => $token)
        );
        if (empty($validToken)) {
            header("Location: {$baseURL}/");
        }

        $username = \User::getUsernameFromId($validToken['user_id']);

        $this->addPassword(
            "password",
            "",
            array(
             "placeholder" => "New Password",
             "class"       => "form-control input-sm",
            )
        );
        $this->addPassword(
            "confirm",
            "",
            array(
             "placeholder" => "Confirm Password",
             "class"       => "form-control input-sm",
            )
        );

        $this->addHidden('token', $_GET['token']);
        $this->addHidden('username', $username);
        $this->form->addFormRule(array(&$this, '_validate'));

    }


    /**
     * _validate validates the data that was submitted by the user. Checks if the
     * password strength rules are respected.
     *
     * @param array $values The values that were submitted to the page.
     *
     * @throws \LorisException when the user and token do not match (hack attempt)
     *
     * @return array a (possibly empty) array of errors
     */
    function _validate($values)
    {
        $DB     =& \Database::singleton();
        $errors = array();

        // set-up user
        $user =& \User::factory($values['username']);
        $data = $user->getData();

        //crossmatch on token to make sure
        $passedToken = $values['token'];
        $dbUserId    = $DB -> pselectOne(
            'SELECT user_id 
              FROM password_recovery 
              WHERE token=:tok',
            array('tok' => $passedToken)
        );

        if ($user->getId() !== $dbUserId) {
            throw new \LorisException(
                "Reset token does not match user."
            );
        }

        // check password strength
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
            $errors['password'] = 'The password is weak, or the passwords 
                do not match';
        }

        if (password_verify($_POST['password'], $data['Password_hash'])) {
            $errors['password'] = 'You cannot keep the same password';
        }

        return $errors;
    }

    /**
     * _process updates the password of the user to the value submitted
     *
     * @param array $values The values that were submitted to the page.
     *
     * @return void
     */
    function _process($values)
    {
        $factory  = \NDB_Factory::singleton();
        $settings = $factory->settings();
        $baseURL  = $settings->getBaseURL();
        $user     =& \User::factory($values['username']);

        $user->updatePassword($_POST['password']);

        header("Location: {$baseURL}/");
    }
}
?>
