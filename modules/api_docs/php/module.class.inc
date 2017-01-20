<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Documentation
 * @package    Main
 * @subpackage API
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\api_docs;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Documentation
 * @package    Main
 * @subpackage API
 * @author     Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * Returns true if this module should be publicly available to people who
     * are not logged in to LORIS.
     *
     * @note Function override
     *
     * @return true: not that this is not currently possible because main.php
     *         checks that the user is logged in before it calls NDB_Caller.
     */
    public function isPublicModule()
    {
        return true;
    }
}
