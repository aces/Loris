<?php
/**
 * This file contains the NDB_Menu_Filter_media class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality Control
 * @author   Leo Thomas <lthomas.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */

/**
 * Main class for media module corresponding to /media/ URL
 * Child or Clinical section of the LorisMenu.
 *
 * Displays a list of media files and control panel to search them and upload
 * new ones.
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality Control
 * @author   Leo Thomas <lthomas.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_Menu_Filter_Quality_Control extends NDB_Menu_Filter
{
    public $hasWritePermission = false;
    public $AjaxModule         = true;

    /**
     * Check user permissions
     *
     * @return bool
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        //create user object
        $user =& User::singleton();
        return $user->hasPermission('superuser');
    }

    /**
     * Override default behaviour, since the page is loaded from mediaIndex.js
     *
     * @return void
     * @access public
     */
    function display()
    {
        return null;
    }

    /**
     * Create a form to filter media by various criteria
     *
     * @return bool
     * @throws ConfigurationException
     * @throws DatabaseException
     * @throws Exception
     */
    function _setFilterForm()
    {
        $user =& User::singleton();
        $db   = Database::singleton();

        $siteList  = array();
        $visitList = Utility::getVisitList();

        // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles')) {
            $siteList = Utility::getSiteList(false);
            // Index sites using their names (used to filter react tables)
            foreach ($siteList as $key => $site) {
                unset($siteList[$key]);
                $siteList[$site] = $site;
            }
        } else {
            // allow only to view own site data
            $siteIDs = $user->getData('CenterIDs');
            foreach ($siteIDs as $val) {
                $site = &Site::singleton($val);
                if ($site->isStudySite()) {
                    $siteList[$site->getCenterName()] = $site->getCenterName();
                }
            }
        }

        $instrumentList   = [];
        $instrumentsQuery = $db->pselect(
            "SELECT Test_name, Full_name FROM test_names ORDER BY Test_name",
            []
        );
        foreach ($instrumentsQuery as $instrument) {
            $instrumentList[$instrument['Full_name']] = $instrument['Full_name'];
        }

        $fileTypeList  = [];
        $fileTypeQuery = $db->pselect("SELECT file_type FROM media", []);
        foreach ($fileTypeQuery as $filetype) {
            $fileTypeList[$filetype['file_type']] = $filetype['file_type'];
        }

        // Form Elements
        $this->addBasicText('pSCID', 'PSCID', ["size" => 9, "maxlength" => 7]);
        $this->addBasicText('fileName', 'File Name');
        $this->addSelect('fileType', 'File type', $fileTypeList);
        $this->addSelect('visitLabel', 'Visit Label', $visitList);
        $this->addSelect('site', 'For Site', $siteList);
        $this->addBasicText('uploadedBy', 'Uploaded By');
        $this->addSelect('instrument', 'Instrument', $instrumentList);

        $this->tpl_data["hasWritePermission"] = $this->hasWritePermission;

        return true;
    }

    /**
     * Build a list of media to display in Data Table
     *
     * @return bool
     * @throws DatabaseException
     */
    function _setupVariables()
    {
        $user =& User::singleton();
        // the base query
        $query  = "FROM quality_control";

        $this->query = $query;

        // Set header as hidden from the data table
        $this->tpl_data['hiddenHeaders'] = json_encode(['Cand ID', 'Session ID']);

        // Add Edit field if user has permissions
        if ($this->hasWritePermission) {
            array_push($this->headers, 'Edit Metadata');
        }
        return true;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result         = $this->toArray();
        $result['form'] = $this->form->form;

        return json_encode($result);
    }

    /**
     * Include additional JS files
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/quality_control/js/qualityControlIndex.js",
            )
        );
    }
}

