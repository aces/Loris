<?php
/**
 * This file contains the NDB_Menu_Filter_quality_control_behavioral class
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
 * @author   Liza Levitis <lthomas.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_Menu_Filter_Quality_Control_Behavioral extends NDB_Menu_Filter
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
        return $user->hasPermission('data_team_helper');
    }

    /**
     * Override default behaviour, since the page is loaded from qualityControlIndex.js
     *
     * @return void
     * @access public
     */
    function display()
    {
        return null;
    }

    /**
     * Create a form to filter behavioral QC by various criteria
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

        $projectList = Utility::getProjectList();


        // Form Elements

        $this->addSelect('visitLabels', 'Visit Label', $visitList);
        $this->addSelect('instruments', 'Instruments', $instrumentList);
        $this->addBasicText('DCCID', 'DCCID', ["size" => 9, "maxlength" => 7]);
        $this->addBasicText('pSCID', 'PSCID', ["size" => 9, "maxlength" => 7]);
        $this->addSelect('site', 'Site', $siteList);
        $this->addSelect('project', 'Project',$projectList);


       // $this->tpl_data["hasWritePermission"] = $this->hasWritePermission;

        return true;
    }

    /**
     * Build a list of media to display in Data Table
     *
     * @return bool
     * @throws DatabaseException
     */

    /*
    function _setupVariables()
    {
        $user =& User::singleton();
        // the base query
        $query  = " FROM media m LEFT JOIN session s ON m.session_id = s.ID".
        " LEFT JOIN candidate c ON c.CandID=s.CandID";
        $query .= " WHERE m.hide_file = FALSE";

        // set the class variables
        $this->columns
            = [
               'm.file_name',
               '(SELECT PSCID from candidate WHERE CandID=s.CandID) as pscid',
               's.Visit_label as visit_label',
               '(SELECT Full_name FROM test_names WHERE Test_name=m.instrument)',
               '(SELECT name FROM psc WHERE CenterID=s.CenterID) as site',
               'm.uploaded_by',
               'm.date_taken',
               'substring(m.comments, 1, 50) as comments',
               'm.date_uploaded',
               'm.file_type',
               's.CandID as cand_id',
               's.ID as session_id',
               'm.id',
              ];

        $this->query = $query;

        if (!$user->hasPermission('access_all_profiles')) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND c.CenterID IN (" . $site_arr . ")";
        }

        $this->group_by = '';
        $this->order_by = 'm.instrument';
        $this->headers  = [
                           'File Name',
                           'PSCID',
                           'Visit Label',
                           'Instrument',
                           'Site',
                           'Uploaded By',
                           'Date Taken',
                           'Comments',
                           'Date Uploaded',
                           'File Type',
                           'Cand ID',
                           'Session ID',
                          ];

        // Set header as hidden from the data table
        $this->tpl_data['hiddenHeaders'] = json_encode(['Cand ID', 'Session ID']);

        // Add Edit field if user has permissions
        if ($this->hasWritePermission) {
            array_push($this->headers, 'Edit Metadata');
        }

        $this->validFilters = [
                               'c.PSCID',
                               'm.instrument',
                               's.Visit_label',
                               's.CenterID',
                              ];
        $this->formToFilter = [
                               'pscid'       => 'c.PSCID',
                               'instrument'  => 'm.instrument',
                               'visit_label' => 's.Visit_label',
                               'for_site'    => 's.CenterID',
                              ];

        return true;
    } */

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

