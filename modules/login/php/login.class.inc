<?php
/**
 * Implements the main LORIS user login page to handle authentication
 * of users.
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
 * Implements the main LORIS user login page to handle authentication
 * of users.
 *
 * @category LORIS_Module
 * @package  Login
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *             Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Login extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Include additional JS files
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
            array(
             $baseURL . '/login/js/loginIndex.js',
            )
        );
    }

}
