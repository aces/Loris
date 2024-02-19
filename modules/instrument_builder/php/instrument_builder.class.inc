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
     * Add Javascript dependencies
     *
     * @return array The list of Javascript files this page depends on
     */
    function getJSDependencies(): array
    {
        return [
            '/instrument_builder/js/instrument_builder.instrument.js',
            '/instrument_builder/js/instrument_builder.rules.js',
            '/instrument_builder/js/react.questions.js',
            '/instrument_builder/js/react.instrument_builder.js',
        ];
    }

    /**
     * Add CSS dependencies
     *
     * @return array The list of CSS files this page depends on
     */
    function getCSSDependencies(): array
    {
        return [
            '/instrument_builder/css/instrument_builder.css',
        ];
    }
}
