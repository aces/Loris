<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category   Core
 * @package    Main
 * @subpackage BVL_Feedback
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\bvl_feedback;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Core
 * @package    Main
 * @subpackage BVL_Feedback
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Module extends \Module
{
    public function getLongName() : string {
        return "Behavioural Feedback";
    }
}
