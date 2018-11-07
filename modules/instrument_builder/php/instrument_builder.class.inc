<?php
/**
 * Instrument_builder
 * Stub class.. all this does is check permissions, since everything else is
 * done in the template/javascript
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\instrument_builder;
/**
 * Instrument_builder
 * Stub class.. all this does is check permissions, since everything else is
 * done in the template/javascript
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Instrument_Builder extends \NDB_Form
{
    /**
     * Tests that, when loading the Instrument builder module, some
     * text appears in the body.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('instrument_builder');
    }

    /**
     * Include additional CSS files:
     *  1. instrument_builder.css
     *
     * @return array of CSS to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/instrument_builder/css/instrument_builder.css"]
        );
    }

    /**
     * Include additional JS files
     *
     * @return array of JS to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = parent::getJSDependencies();
        return array_merge(
            $depends,
            array(
             $baseurl . "/instrument_builder/js/instrument_builder.instrument.js",
             $baseurl . "/instrument_builder/js/instrument_builder.rules.js",
             $baseurl . "/instrument_builder/js/react.questions.js",
             $baseurl . "/instrument_builder/js/react.instrument_builder.js",
            )
        );
    }
}

