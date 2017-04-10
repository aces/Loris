<?php
    /**
     * Boilerplate for admin panel
     *
     * @category acknowledgements
     * @package  Loris
     * @author   anyhowstep <justin.ng.mcin@gmail.com>
     * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
     * @link     https://github.com/aces/Loris
     */

     require_once(__DIR__ . "/../model/require_once.php");
     
    /**
     * This class is just boilerplate
     *
     * @category acknowledgements
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
            $user    = User::singleton();
            $user_id = $user->userInfo["ID"];
            
            if (!isset($_GET["center_id"])) {
                return AcknowledgementPermission::CanAdministerForAtLeastOneCenter(
                    $user_id
                );
            }
            
            $center_id = $_GET["center_id"];
            if (!is_string($center_id) || !preg_match("/^\d+$/", $center_id)) {
                return false;
            }
            
            return AcknowledgementPermission::CanAdministerForCenter($user_id, $center_id);
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
            $this->query = " FROM acknowledgement WHERE FALSE";
            $this->columns = array();

            $config = NDB_Config::singleton();
            
            $this->tpl_data["valid_date_range"] = Acknowledgement::FetchValidDateRange();

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