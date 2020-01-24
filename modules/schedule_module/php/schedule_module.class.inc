<?php
namespace LORIS\schedule_module;
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

class schedule_module extends \NDB_Page {
    public $skipTemplate = true;


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
