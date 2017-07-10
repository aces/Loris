<?php
/**
 * This file contains the NDB_Menu_Filter_quality_control_behavioral class
 *
 * PHP Version 5
 *
 * @category Module
 * @package  Quality Control
 * @author   Liza Levitis <lthomas.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */

/**
 * Behavioural QC Class
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
     * GetIncompleteCandidates function
     *
     * @param unknown_type $test_name   the value of test name
     * @param string       $visit_label the value of visit label
     * @param string       $candidate   the value of candidate
     * @param int|null     $site        the id of of the site or can be null
     * @param int|null     $project     the id of the project or can be null
     *
     * @return unknown
     */
    function getIncompleteCandidates($test_name,
                                     $visit_label=null,
                                     $candidate=null,
                                     $site=null,
                                     $project=null
    ) {
        $config         =& NDB_Config::singleton();
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
        for ($i=0; $i<count($ddeInstruments); ++$i) {
            $ddeInstruments[$i] = Database::singleton()->quote($ddeInstruments[$i]);
        }

        global $DB;
        $query = "SELECT DISTINCT s.ID, s.visit_label, c.PSCID,s.candid,".
            " f.SessionID, f.test_name,f.data_entry,f.commentid,".
            " t.Full_name FROM session s".
            " JOIN flag f ON (f.sessionid = s.id) JOIN candidate c".
            " ON (c.candid = s.candid)".
            " JOIN test_names t ON (t.Test_name = f.Test_name)".
            " JOIN psc ON (s.CenterID = psc.CenterID)";

        $where = " WHERE s.Active = 'Y' AND c.Active = 'Y'".
            " AND coalesce(f.data_entry,'In Progress') = 'In Progress'".
            " AND psc.Centerid!= '1' AND c.Entity_type != 'Scanner'";

        if (count($ddeInstruments) > 0) {
            $ddeInstruments = implode(",", $ddeInstruments);
            $where         .= "
                AND (f.test_name IN ($ddeInstruments) OR
                f.commentid NOT LIKE 'DDE_%')
            ";
        } else {
            $where .= "
                AND (f.commentid NOT LIKE 'DDE_%')
            ";
        }
        $qparams = array();

        //filter for testname
        if (($test_name !=null)&&($test_name!='All Instruments')) {
            $where        .= " AND f.test_name = :TN";
            $qparams['TN'] = $test_name;
        }

        //filter for visit
        if (($visit_label !=null)&&($visit_label!='All Visits')) {
            $where        .= " AND s.visit_label = :VL";
            $qparams['VL'] = $visit_label;
        }
        //filter for candidate
        if ($candidate !=null) {
            $where        .= " AND s.candID = :CI";
            $qparams['CI'] = $candidate;
        }
        if (($site !=null)&&($site!='All Sites')) {
            $where         .= " AND c.CenterID = :CID";
            $qparams['CID'] = $site;
        }
        if (($project !=null)&&($project!='All Projects')) {
            $where         .= " AND c.ProjectID = :PID";
            $qparams['PID'] = $project;
        }

        $order_by = " ORDER BY f.commentid ";

        $query   = $query . $where . $order_by;
        $results = $DB->pselect($query, $qparams);
        $this->results = $results;
        return true;
    }


    /**
     * Build a list of behavioural QC to display in Data Table
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

