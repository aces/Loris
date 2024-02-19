<?php

namespace LORIS\login;
/**
 * Implements the main LORIS user login page to handle authentication
 * of users.
 *
 * @category LORIS_Module
 * @package  Login
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 *           Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Login extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Add Javascript dependencies
     *
     * @return array The list of Javascript files this page depends on
     */
    function getJSDependencies(): array
    {
        return [
            '/login/js/loginIndex.js',
        ];
    }

    /**
     * Add CSS dependencies
     *
     * @return array The list of CSS files this page depends on
     */
    function getCSSDependencies(): array
    {
        return [
            '/login/css/login.css',
        ];
    }
}
