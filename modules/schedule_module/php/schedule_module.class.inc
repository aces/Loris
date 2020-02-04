<?php
/**
 * This class features the code for the menu portion of the Loris issue
 * tracker.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Shen Wang <shen.wang2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\schedule_module;
/**
 * Implements the user account page
 *
 * @category Main
 * @package  Behavioural
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class Schedule_Module extends \NDB_Page
{
    public $skipTemplate = true;
    /**
     * Gathers JS dependencies and merges them with the parent
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
                $baseURL . "/schedule_module/js/index.js",
            )
        );
    }
    /**
     * Include additional CSS files:
     *  1. dashboard.css
     *
     * @return array of css to be included
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/schedule_module/css/schedule_module.css")
        );
    }
}
