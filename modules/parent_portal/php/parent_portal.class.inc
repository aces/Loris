<?php

/**
 * IBIS module.
 *
 * PHP Version 7
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
 * PHP Version 7
 *
 * @category   Module
 * @package    Main
 * @subpackage Parent_Portal
 * @author     Sruthy Mathew <sruthy.mathew@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Parent_Portal extends \NDB_Form
{
    public $skipTemplate = true;
    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies(): array
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [$baseURL . '/parent_portal/js/ParentPortalIndex.js']
        );
    }
}

