<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\help_editor;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category Behavioural
 * @package  Main
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Module extends \Module
{
                public function getMenuItems() : array {
        return [
            new \LORIS\GUI\MenuItem("Admin", "Help Editor", "help_editor/"),
        ];
    }
}
