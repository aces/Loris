<?php
/**
 * Implements the ViewDetails subpage of the dicom_archive module.
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
 * Implements the ViewDetails subpage of the dicom_archive module.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class LostPassword extends \NDB_Page
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

    function __construct()
    {
        if (isset($_POST['username'])) {
            // create the user object
            $user =& \User::singleton($_POST['username']);

            $email = $user->getData('Email');

            // check that it is a valid user
            if (!empty($email)) {

                // check that the email is valid
                if ($user->isEmailValid()) {
		    $config = \NDB_Config::singleton();
                    // generate a new password
                    $password = \User::newPassword();

                    // reset the password in the database
                    // expire password so user must change it upon login
                    $success = $user->updatePassword($password, '0000-00-00');

                    // send the user an email
                    $msg_data['study']    = $config->getSetting('title');
                    $msg_data['url']      = $config->getSetting('url');
                    $msg_data['realname'] = $user->getData('Real_name');
                    $msg_data['password'] = $password;
			error_log("Sending email" . print_r($msg_data, true));
                    // Email::send($email, 'lost_password.tpl', $msg_data);

                    $this->tpl_data['confirm'] = $user->getData('Real_name')
                        .', you should receive an email within a few minutes.';
                } else {
                    $this->tpl_data['error_message'] = 'That user has an invalid email address.';
                }
            } else {
                $this->tpl_data['error_message'] = 'That user is not in the system.';
            }
        }
    }
}
?>
