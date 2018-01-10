<?php
/**
 * Implements the token authentication for LORIS.
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
 * Implements the token authentication for LORIS.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class AuthenticateToken extends \NDB_Form
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
     * Checks if token is valid and redirects to correct page if so
     *
     * @return none
     */
    function setup()
    {
        $DB       =& \Database::singleton();
        $factory  = \NDB_Factory::singleton();
        $settings = $factory->settings();
        $baseURL  = $settings->getBaseURL();

        $token = $_GET['token'] ?? '';

        //validate token and load password change page
        $validToken = $DB->pselectRow(
            'SELECT *, TIMESTAMPDIFF(HOUR,time,CURRENT_TIMESTAMP) as token_age 
              FROM password_recovery 
              WHERE token=:tok',
            array('tok' => $token)
        );

        if (!empty($validToken)) {
            header("Location: {$baseURL}/login/password-change/?token=$token");
        } else {
            header("Location: {$baseURL}/");
        }
    }
}
?>
