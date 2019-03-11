<?php
/**
 * Implements the user password expiry page in LORIS, to reset
 * expired passwords.
 *
 * PHP version 5
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
 * Implements the user password expiry page for LORIS.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class PasswordExpiry extends \NDB_Form
{
    /**
     * The username that we're displaying the password expired page for.
     * This is used for validation.
     */
    private $_username;

    /**
     * The user object. This is not populated until after the validation
     * is done, but is stored locally so we don't need to get a new copy of
     * it in _process to call updatePassword.
     */
    private $_user;

    /**
     * Setup sets up the LorisForm elements for the page, and redirects
     * to the main LORIS page if the PasswordExpiredForUser session variable
     * hasn't been set in SinglePointLogin (which means it shouldn't be on
     * the password expiry page.)
     *
     * @return void
     */
    function setup()
    {
        if (empty($_SESSION['PasswordExpiredForUser'])) {
            // HACK ALERT: If the server didn't set the variable in the PHP session
            // in SinglePointLogin, we shouldn't be here, so redirect to the main
            // page and cry.
            header("HTTP/1.1 303 See Other");
            header("Location: /");
            // HACK ALERT #2: hard exiting is always the wrong thing to do.
            exit(0);
        }
        $this->_username = $_SESSION['PasswordExpiredForUser'];
        $this->addBasicText("password", "");

        // HACK ALERT #3: The old password expiry page required the fields
        // username/password to be present so that SinglePointLogin would
        // properly be authenticated after changing the password, otherwise
        // it'll go to the login page instead of logging in after updating
        // the password.
        //
        // (This is also why the form element for the new password needs to
        // be named "password" and why there's a hidden element named "login"
        // in the smarty template.)
        $this->tpl_data['username'] = $this->_username;
        $this->form->addFormRule(array(&$this, '_validate'));
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
        if (empty($values['password'])) {
            // FIXME: The way error_message is displayed in the template is inherited
            // from before this page was a "real" LORIS page, when it was all done
            // from SinglePointLogin. As a result, the usual way of displaying errors
            // by returning them in an array with the key of the element with the
            // problem doesn't work.
            $this->tpl_data['error_message'] = 'Can not use an empty password';

            // But we'll pretend it does anyways, so that validation still fails.
            return array('password' => 'Can not use an empty password');
        }

        $this->_user = \User::factory($this->_username);
        $data        = $this->_user->getData();

        if (password_verify($_POST['password'], $data['Password_hash'])) {
            $this->tpl_data['error_message'] = 'You cannot keep the same password';
            return array('password' => 'You cannot keep the same password');
        }

        if (!\User::isPasswordStrong(
            $_POST['password'],
            array(
             $_POST['confirm'],
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
            $this->tpl_data['error_message'] = 'The password is weak, or'
                . ' the passwords do not match';
            return array('password' => 'Weak password.');
        }

        return true;
    }

    /**
     * _process updates the password of the user and then redirects to the
     * dashboard.
     *
     * @param array $values The values that were submitted to the page.
     *
     * @return void
     */
    function _process($values)
    {
        $this->_user->updatePassword($values['password']);
        // The password is no longer expired after updating it.
        unset($_SESSION['PasswordExpiredForUser']);

        // Redirect to the dashboard
        header("HTTP/1.1 307 Temporary Redirect");
        header("Location: /");
        // Hard exiting is still always wrong but still required for now.
        exit(0);
    }

}
