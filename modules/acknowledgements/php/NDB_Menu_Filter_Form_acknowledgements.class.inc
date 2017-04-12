<?php
/**
 * This class provides the code to create the menu filter form that allows
 * for data entry of entities that should be acknowledged in publications
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Justin Kat <justin.kat@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

 require_once __DIR__ . "/../model/require_once.php";

/**
 * This class provides the code to create the menu filter form that allows
 * for data entry of entities that should be acknowledged in publications
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Justin Kat <justin.kat@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class NDB_Menu_Filter_Form_Acknowledgements extends NDB_Menu_Filter_Form
{

    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @return boolean
     */
    function _hasAccess()
    {
        $user    = User::singleton();
        $user_id = $user->userInfo["ID"];

        if (!isset($_GET["center_id"])) {
            return AcknowledgementPermission::canViewForAtLeastOneCenter(
                $user_id
            );
        }

        $center_id = $_GET["center_id"];
        if (!is_string($center_id) || !preg_match("/^\d+$/", $center_id)) {
            return false;
        }

        return AcknowledgementPermission::canViewForCenter($user_id, $center_id);
    }

    /**
     * Processes the submitted form
     *
     * @param array $values Array of submitted values
     *
     * @return boolean
     */
    function _process($values)
    {
        return false;
    }

    /**
     * Sets up all the class variables needed for the
     * acknowledgements menu filter
     *
     * @return true on success
     */
    function _setupVariables()
    {
        $this->query   = " FROM acknowledgement WHERE FALSE";
        $this->columns = array();

        $config = NDB_Config::singleton();

        $this->tpl_data["valid_date_range"] = Acknowledgement::fetchValidDateRange();
        $this->tpl_data['citation_policy']  = $config->getSetting('citation_policy');

        return true;
    }

    /**
     * Create the form for the acknowledgements menu page
     *
     * @return true
     */
    function _setFilterForm()
    {
        return true;
    }

    /**
     * Add dependency on default acknowledgements.js
     *
     * @return array of javascript files to be included
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();

        $baseDeps = parent::getJSDependencies();

        return $baseDeps;
    }
}
?>
