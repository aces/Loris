<?php
    /**
     * Boilerplate for admin panel
     *
     * PHP Version 5
     *
     * @category Acknowledgements
     * @package  Loris
     * @author   anyhowstep <justin.ng.mcin@gmail.com>
     * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
     * @link     https://github.com/aces/Loris
     */

     require_once __DIR__ . "/../model/require_once.php";

    /**
     * This class is just boilerplate
     *
     * @category Acknowledgements
     * @package  Loris
     * @author   anyhowstep <justin.ng.mcin@gmail.com>
     * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
     * @link     https://github.com/aces/Loris
     */

class NDB_Menu_Filter_Form_Admin extends NDB_Menu_Filter_Form
{

    /**
         * _has_access returns true
         * if the user has the specific permission
         *
         * @return boolean
         */
    function _hasAccess()
    {
        $user   = User::singleton();
        $userId = $user->userInfo["ID"];

        if (!isset($_GET["centerId"])) {
            return AcknowledgementPermission::canAdministerForAtLeastOneCenter(
                $userId
            );
        }

        $centerId = $_GET["centerId"];
        if (!is_string($centerId) || !preg_match("/^\d+$/", $centerId)) {
            return false;
        }

        return AcknowledgementPermission::canAdministerForCenter(
            $userId,
            $centerId
        );
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
        $baseUrl = $factory->settings()->getBaseURL();

        $baseDeps = parent::getJSDependencies();

        return array_merge(
            $baseDeps,
            array(
             $baseUrl . "/acknowledgements/js/admin_main.js",
            )
        );
    }
}
?>
