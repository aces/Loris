<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Module
 * @package    Main
 * @subpackage Parent Portal
 * @author     Sruthy Mathew <sruthy.mathew@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\parent_portal;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Module
 * @package    Main
 * @subpackage Parent Portal
 * @author     Sruthy Mathew <sruthy.mathew@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{

    /**
     * The parent portal module must be accessible publicly, so that non-logged in
     * users can access.
     *
     * @return true
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
        return "Parent Portal";
    }
}
