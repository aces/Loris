<?php

namespace LORIS\login;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category LORIS_Module
 * @package  Login
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * Returns true if this module should be publicly available to people who
     * are not logged in to LORIS.
     *
     * @return bool true
     */
    public function isPublicModule()
    {
        return true;
    }

    /**
     * {@inheritDoc}
     *
     * @return string The human readable name for this module
     */
    public function getLongName() : string
    {
        return 'Login';
    }
}
