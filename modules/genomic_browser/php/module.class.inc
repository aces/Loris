<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\genomic_browser;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category LORIS_Module
 * @package  Genomics
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
        public function getMenuItems() : array {
        return [
            new \LORIS\GUI\MenuItem("Genomics", "Genomic Browser", "genomic_browser/"),
        ];
    }

}
