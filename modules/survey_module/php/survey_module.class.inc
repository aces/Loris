<?php
/**
 * Implements the main LORIS user login page to handle authentication
 * of users.
 *
 * PHP version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Survey
 * @author     Jordan Stirling <jstirling91@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
*/
namespace LORIS\survey_module;

/**
 * Implements the main LORIS user login page to handle authentication
 * of users.
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Survey
 * @author     Jordan Stirling <jstirling91@gmail.com>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Survey_Module extends \NDB_Page
{
    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */

    /**
     * Gathers JS dependecies and merge them with the parent
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory         = \NDB_Factory::singleton();
        $baseurl         = $factory->settings()->getBaseURL();
        $depends         = parent::getJSDependencies();

        return array_merge(
            $depends,
            array(
             $baseurl . "/survey_module/js/DirectEntry.js",
             $baseurl . "/survey_module/js/CheckInput.js",
            )
        );
    }
}
?>
