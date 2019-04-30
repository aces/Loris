<?php
/**
 * This is a file called used by the behavioural qc browser
 * auto-complete to retrieve candidates for a given
 * instrument and/or visit.
 *
 * PHP Version 7
 *
 * @category Behavioural
 * @package  Loris
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\data_team_helper;
/**
 * Dashboard: displays recruitment and study progression charts,
 * user tasks and document repository notifications
 *
 * @category Behavioural
 * @package  Loris
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class Data_Team_Helper extends \NDB_Form
{

    /**
     * Class that returns the data team helper.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('data_team_helper'));
    }

    /**
     * Sets up main parameters
     *
     * @return void
     */
    function setup()
    {
        //initializations
        parent::setup();
        $DB       =& \Database::singleton();
        $user     =& \User::singleton();
        $config   =& \NDB_Config::singleton();
        $sanitize = array_map('htmlspecialchars', $_REQUEST);

        $instrument   = $this->getTestNameusingMappedName(
            $sanitize['instrument'] ?? null
        );
        $site_default =$this->getDefaultSite();
        //construct the instrument drop down..
        $this->tpl_data['visit_label'] = $sanitize['visit_label'] ?? null;
        $this->tpl_data['FieldName']   = $sanitize['FieldName'] ?? null;
        $this->tpl_data['project']     = $sanitize['project'] ?? null;
        $this->tpl_data['site']        = $sanitize['site'] ?? null;
        if (isset($sanitize['PSCID']) && !empty($sanitize['PSCID'])) {
            $this->tpl_data['PSCID'] = $sanitize['PSCID'];
        } elseif (isset($sanitize['candidate']) && !empty($sanitize['candidate'])) {
            $this->tpl_data['candID'] = $sanitize['candidate'];
        } else {
            $this->tpl_data['candidate'] = null;
        }
        $this->tpl_data['test_name'] = $instrument;

        $candID = null;
        if (isset($sanitize['PSCID']) && !empty($sanitize['PSCID'])
            && (isset($sanitize['candidate'])) && !empty($sanitize['candidate'])
        ) {
            $candID = ($sanitize['candidate']);
        } elseif (isset($sanitize['candidate']) && !empty($sanitize['candidate'])) {
            $candID = $sanitize['candidate'];
        } elseif (isset($sanitize['PSCID']) && !empty($sanitize['PSCID'])) {
            $query   = "SELECT CandID FROM candidate WHERE PSCID = :PID";
            $qparams = (array('PID' => $sanitize['PSCID']));
            $candID  = $DB->pselectOne($query, $qparams);
        }

        //Percentage completed for the given instrument
        $percent_completed = $this->_getPercentCompleted(
            $instrument,
            $sanitize['visit_label'] ?? null,
            $candID,
            $sanitize['site'] ?? $site_default,
            $sanitize['project'] ?? null
        );
        $this->tpl_data['percent_completed'] = $percent_completed;

        /* Visit_labels
         */
        $visit_array   =\Utility::getExistingVisitLabels();
        $visit_array   = array_combine($visit_array, $visit_array);
        $list_of_sites = array();
        $this->tpl_data['visitLabels'] = $visit_array;
        if ($user->hasPermission('access_all_profiles')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites      = \Utility::getSiteList();
            $default_site_array =array('All Sites' => 'All Sites');
            if (is_array($list_of_sites)) {
                $list_of_sites = $default_site_array + $list_of_sites;
            }
        } else {
            // allow only to view own study site data
            $list_of_sites      = $user->getStudySites();
            $default_site_array =array('All User Sites' => 'All User Sites');
            $list_of_sites      = $default_site_array + $list_of_sites;
        }
        $this->tpl_data['siteList'] = $list_of_sites;
        // Project list, if applicable

        $projectList = \Utility::getProjectList();
        $this->tpl_data['projectList'] = $projectList;

        $incompleteCandidates = $this->getIncompleteCandidates(
            $instrument,
            $sanitize['visit_label'] ?? null,
            $candID,
            $sanitize['site'] ?? $site_default,
            $sanitize['project'] ?? null
        );

        $this->tpl_data['Incomplete_candidates']
            = json_encode($incompleteCandidates);

        $this->tpl_data['Incomplete_candidates_length']
            = count($incompleteCandidates);

        $conflicts = $this->instrumentInConflict(
            $instrument,
            $sanitize['visit_label'] ?? null,
            $candID,
            $sanitize['site'] ?? $site_default,
            $sanitize['project'] ?? null
        );

        $this->tpl_data['Conflicts'] =  json_encode($conflicts);

        $this->tpl_data['Conflicts_length'] = count($conflicts);

        $bvlFeedback = $this->getFeedbacks(
            $instrument,
            $candID,
            $sanitize['visit_label'] ?? null,
            $sanitize['site'] ?? $site_default,
            $sanitize['project'] ?? null
        );

        $this->tpl_data['Bvl_Feedback'] = json_encode($bvlFeedback);

        $this->tpl_data['Bvl_Feedback_length'] = count($bvlFeedback);

        $this->tpl_data['percent_complete'] = $this->_getPercentCompleted(
            $instrument,
            $sanitize['visit_label'] ?? null,
            $candID,
            $sanitize['site'] ?? $site_default,
            $sanitize['project'] ?? null
        );

    }
    /**
     * Returns the default site value.
     *
     * @return string
     * @throws \DatabaseException
     */
    function getDefaultSite()
    {
        $user =& \User::singleton();
        if ($user->hasPermission('access_all_profiles')) {
            $site_default ='All Sites';
        } else {
            $site_default = 'All User Sites';
        }
        return $site_default;
    }
    /**
     * GetFeedbacks
     * Return all the existing feedbackid threads for the given fieldname
     * In  addition to other secific info (the test_name,commentid,
     * candid,session id).
     *
     * In the case of no instrument, candidate or visit set we return
     * all the feedback at all levels. In the case of just a candidate
     * set we return all feedbacks at every level for that candidate.
     *
     * @param null       $test_name   the value of test name
     * @param null       $candID      the value of candidate ID
     * @param null       $visit_label the value of visit label
     * @param int|string $site        the id or default value of the site
     * @param int|null   $project     the id of the project or can be null
     *
     * @return   Array containing a list of feedbacks for
     * the appropriate feedback level.
     * @throws   \DatabaseException
     * @internal param unknown_type $field_name
     */
    function getFeedbacks($test_name = null,
        $candID=null,
        $visit_label=null,
        $site=null,
        $project=null
    ) {

        $DB      =& \Database::singleton();
        $qparams = array();

        $select = "SELECT fb.FeedbackID, fb.CandID, fb.SessionID,
                      fb.CommentID, fb.Feedback_level, f.Test_name, fb.FieldName,
                      tn.Full_name, s.Visit_label, ca.PSCID 
                      FROM feedback_bvl_thread AS fb
                      JOIN candidate ca ON (ca.CandID = fb.CandID)
                      JOIN session s ON (s.ID = fb.SessionID)
                      JOIN psc ON (s.CenterID = psc.CenterID)
                      JOIN project_subproject_rel psr 
                          ON (s.SubprojectID = psr.SubprojectID)
                      LEFT JOIN flag f ON (fb.CommentID = f.CommentID)
                      LEFT JOIN test_names tn ON (tn.Test_name = f.Test_name)";

        $where = " WHERE fb.Public = 'Y'
                    AND fb.Status = 'opened'
                    AND fb.active= 'Y'";

        if (isset($candID) && !empty($candID)) {
            $where        .= " AND fb.CandID = :CI";
            $qparams['CI'] = $candID;
        }

        if (isset($visit_label) && $visit_label !="All Visits") {
            $where        .= " AND s.Visit_label = :VL";
            $qparams['VL'] = $visit_label;
        }
        if ($site!='All Sites') {
            if ($site == 'All User Sites') {
                $user           = \User::singleton();
                $siteID         = $user->getCenterIDs();
                $where         .= " AND FIND_IN_SET(psc.CenterID, :CID)";
                $qparams['CID'] = implode(',', $siteID);
            } else {
                $where         .= " AND s.CenterID = :CID";
                $qparams['CID'] = $site;
            }
        }

        if (($project !=null)&&($project!='All Projects')) {
            $where         .= " AND pr.ProjectID = :PID";
            $qparams['PID'] = $project;
        }

        if (isset($test_name) && $test_name !='All Instruments'
            && $test_name!=null
        ) {

            $where      .= " AND FieldName = :FN";
            $field_names = \Utility::getSourcefields($test_name);

            $query = $select . $where;

            $results = array();
            foreach ($field_names as $field) {
                $qparams['FN'] = $field["SourceField"];
                $result        = $DB->pselect($query, $qparams);
                array_push($results, $result);
            }

            //after the results are all fetched we want to flatten the array
            $flattened_result = call_user_func_array('array_merge', $results);
        } else {
            $query            = $select . $where;
            $flattened_result = $DB->pselect($query, $qparams);
        }

        // Search for null instruments and remove them
        foreach ($flattened_result as $k => $v) {
            if ($v['Feedback_level'] == 'instrument'
                && !isset($v['Test_name'])
            ) {
                unset($flattened_result[$k]);
            }
        }
        $flattened_result = array_values($flattened_result);
        return $flattened_result;
    }

    /**
     * AddWhere
     * Constructs the query....
     *
     * @param string $Column the value of cloumn
     * @param string $Filter the value fo filter
     *
     * @return string
     */
    function addWhere($Column, $Filter)
    {
        $sanitize = array_map('htmlspecialchars', $_REQUEST);
        if (!empty($sanitize[$Filter])
            && $sanitize[$Filter] !=='All Fields'
            && (strtolower($sanitize[$Filter]) !=='any')
            && ($sanitize[$Filter] !=='All Visits')
            && $sanitize[$Filter] !=='all_flags'
            && ($sanitize[$Filter] !=='All Instruments')
        ) {
            global $DB;
            if ($Filter == 'instrument') {
                $test_name = $this->getTestNameusingMappedName(
                    $sanitize[$Filter]
                );
                return " AND $Column LIKE " . $DB->quote($test_name);
            }
            if ($sanitize[$Filter] == 'not_sent_to_dcc') {
                return " AND $Column NOT LIKE '%Approval%'";
            }
            return " AND $Column LIKE " . $DB->quote($sanitize[$Filter]);
        }
        return '';
    }
    /**
     * InstrumentInConflict
     * Get the list of fieldnames in conflict for the given test_name
     * from conflict_unresolved
     *
     * @param string     $test_name   the value of test name
     * @param string     $visit_label the value of visit label
     * @param string     $candidate   the value of candidate
     * @param int|string $site        the id or default value of the site
     * @param int|null   $project     the id of the project or can be null
     *
     * @return array
     */
    function instrumentInConflict(string $test_name,
        $visit_label=null,
        $candidate=null,
        $site=null,
        $project=null
    ) {

        global $DB;
        $conflicts = array();
        //if test_name exists and candidate is not set

        $qparams = array();

        if ($DB->ColumnExists($test_name, 'Test_name_display')) {
            $query = "SELECT DISTINCT s.CandID,ca.PSCID, c.FieldName,
                c.TableName,t.test_name_display, s.visit_label
                FROM conflicts_unresolved c
                LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
                LEFT JOIN session s ON (f.SessionID=s.ID)
                LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
                JOIN test_battery t ON (t.test_name = f.test_name)
                JOIN psc ON (s.CenterID = psc.CenterID)";

            $where = " WHERE t.visit_label = s.Visit_label
                AND ca.Active = 'Y'
                AND s.Active = 'Y'
                AND psc.Centerid!= '1'
                AND ca.Entity_type != 'Scanner'";

        } else {
            $query = "SELECT distinct s.CandID,ca.PSCID, c.FieldName,
                c.TableName,t.full_name AS test_name_display, s.visit_label
                FROM conflicts_unresolved c
                LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
                LEFT JOIN session s ON (f.SessionID=s.ID)
                LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
                JOIN test_names t ON (t.test_name = f.test_name)
                JOIN psc ON (s.CenterID = psc.CenterID)";
            $where = " WHERE ca.Active = 'Y' AND s.Active = 'Y'".
                " AND psc.Centerid!= '1' AND ca.Entity_type != 'Scanner'";
        }

        //filter for testname
        if (($test_name !=null)&&($test_name!='All Instruments')) {
            $where        .= " AND TableName LIKE CONCAT(:TN, '%')";
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
        //filter for sites
        if ($site!='All Sites') {
            if ($site == 'All User Sites') {
                $user           = \User::singleton();
                $siteID         = $user->getCenterIDs();
                $where         .= " AND FIND_IN_SET(psc.CenterID, :CID)";
                $qparams['CID'] = implode(',', $siteID);
            } else {
                $where         .= " AND s.CenterID = :CID";
                $qparams['CID'] = $site;
            }
        }
        //filter for candidate
        if (($project !=null)&&($project!='All Projects')) {
            $where         .= " AND ca.ProjectID = :PID";
            $qparams['PID'] = $project;
        }

        $query     = $query . $where;
        $conflicts = $DB->pselect($query, $qparams);
        return $conflicts;
    }
    /**
     * FieldInConflict function
     *
     * @param string $test_name  the value of test name
     * @param string $field_name the value of field name
     *
     * @return array
     */
    function fieldInConflict($test_name,$field_name)
    {
        //Do for each instrument....one shot....
        //And then extract the specific info through template..
        global $DB;
        $conflicts = array();
        if ($DB->ColumnExists($test_name, 'Test_name_display')) {

            $query = "SELECT DISTINCT s.CandID, ca.PSCID, c.FieldName,
                c.TableName,t.test_name_display, s.visit_label
                FROM conflicts_unresolved c
                LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
                LEFT JOIN session s ON (f.SessionID=s.ID)
                LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
                JOIN test_battery t ON (t.test_name = f.test_name)
                JOIN psc ON (s.CenterID = psc.CenterID)
                WHERE t.visit_label = s.Visit_label
                AND TableName LIKE CONCAT(:TN, '%')
                AND c.FieldName = :FN
                AND ca.Active = 'Y'
                AND s.Active = 'Y'
                AND psc.Centerid!= '1'
                AND ca.Entity_type != 'Scanner'";
        } else {
            $query = "SELECT DISTINCT s.CandID, ca.PSCID, c.FieldName,
                c.TableName,t.full_name AS test_name_display, s.visit_label
                FROM conflicts_unresolved c
                LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
                LEFT JOIN session s ON (f.SessionID=s.ID)
                LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
                JOIN psc ON (s.CenterID = psc.CenterID)
                JOIN test_names t ON (t.test_name = f.test_name)
                WHERE TableName LIKE CONCAT(:TN, '%')
                AND c.FieldName = :FN
                AND ca.Active = 'Y'
                AND s.Active = 'Y'
                AND psc.Centerid!= '1'
                AND ca.Entity_type != 'Scanner'";
        }
        $conflicts = $DB->pselect(
            $query,
            array(
             'TN' => $test_name,
             'FN' => $field_name,
            )
        );
        return $conflicts;
    }

    /**
     * GetIncompleteCandidates function
     *
     * @param string     $test_name   the value of test name
     * @param string     $visit_label the value of visit label
     * @param string     $candidate   the value of candidate
     * @param int|string $site        the id or default value of the site
     * @param int|null   $project     the id of the project or can be null
     *
     * @return array
     */
    function getIncompleteCandidates($test_name,
        $visit_label=null,
        $candidate=null,
        $site=null,
        $project=null
    ) {
        $config         =& \NDB_Config::singleton();
        $ddeInstruments = $config->getSetting('DoubleDataEntryInstruments');
        for ($i=0; $i<count($ddeInstruments); ++$i) {
            $ddeInstruments[$i] = \Database::singleton()->quote($ddeInstruments[$i]);
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
        if ($site!='All Sites') {
            if ($site == 'All User Sites') {
                $user           = \User::singleton();
                $siteID         = $user->getCenterIDs();
                $where         .= " AND FIND_IN_SET(psc.CenterID, :CID)";
                $qparams['CID'] = implode(',', $siteID);
            } else {
                $where         .= " AND s.CenterID = :CID";
                $qparams['CID'] = $site;
            }
        }
        if (($project !=null)&&($project!='All Projects')) {
            $where         .= " AND c.ProjectID = :PID";
            $qparams['PID'] = $project;
        }

        $order_by = " ORDER BY f.commentid ";

        $query   = $query . $where . $order_by;
        $results = $DB->pselect($query, $qparams);
        return $results;
    }


    /**
     * GetInstrumentCount function
     *
     * @param string     $test_name   the value of test name
     * @param string     $visit_label the value of visit label
     * @param string     $candidate   the value of candidate
     * @param int|string $site        the id or default value of the site
     * @param ?int       $project     the id of the project or can be null
     *
     * @return int
     */
    function getInstrumentCount($test_name,
        $visit_label=null,
        $candidate=null,
        $site=null,
        $project=null
    ) {
        global $DB;

        if ($test_name != null) {
            $query = "SELECT COUNT(*) FROM $test_name AS i
            JOIN flag f ON (f.CommentID=i.CommentID)
            JOIN session s ON (s.ID = f.SessionID)
            JOIN candidate c ON (c.CandID = s.CandID)
            JOIN psc ON (s.CenterID = psc.CenterID)	";
        } else {
            $query = "SELECT COUNT(*) FROM session s
            JOIN flag f ON (f.sessionid = s.id)
            JOIN candidate c ON (c.candid = s.candid)
            JOIN test_names t ON (t.Test_name = f.Test_name)
            JOIN psc ON (s.CenterID = psc.CenterID)	";
        }

        $qparams = array();

        $where =" WHERE s.Active='Y'
            AND s.Current_stage <> 'Recycling Bin'
            AND f.CommentID NOT LIKE '%DDE%'
            AND psc.Centerid!= '1'";

        //filter for visit
        if (($visit_label !=null)&&($visit_label!='All Visits')) {
            $where        .= " AND s.Visit_label = :VL";
            $qparams['VL'] = $visit_label;
        }
        //filter for candidate
        if ($candidate !=null) {
            $where        .= " AND s.candID = :CI";
            $qparams['CI'] = $candidate;
        }
        if ($site!='All Sites') {
            if ($site == 'All User Sites') {
                $user           = \User::singleton();
                $siteID         = $user->getCenterIDs();
                $where         .= " AND FIND_IN_SET(psc.CenterID, :CID)";
                $qparams['CID'] = implode(',', $siteID);
            } else {
                $where         .= " AND s.CenterID = :CID";
                $qparams['CID'] = $site;
            }
        }
        if (($project !=null)&&($project!='All Projects')) {
            $where         .= " AND c.ProjectID = :PID";
            $qparams['PID'] = $project;
        }

        $query .= $where;
        $count  =$DB->pselectOne($query, $qparams);
        return $count;
    }

    /**
     * GetCompleteInstrumentCount function
     *
     * @param string     $test_name   the value of test name
     * @param string     $visit_label the value of visit label
     * @param string     $candidate   the value of candidate
     * @param int|string $site        the id or default value of the site
     * @param ?int       $project     the id of the project or can be null
     *
     * @return int
     */
    function getCompleteInstrumentCount($test_name,
        $visit_label=null,
        $candidate=null,
        $site=null,
        $project=null
    ) {
        global $DB;

        if ($test_name != null) {
            $query = "SELECT COUNT(*) FROM $test_name AS i
            JOIN flag f ON (f.CommentID=i.CommentID)
            JOIN session s ON (s.ID = f.SessionID)
            JOIN candidate c ON (c.CandID = s.CandID)
            JOIN psc ON (s.CenterID = psc.CenterID)	";
        } else {
            $query = "SELECT COUNT(*) FROM session s
            JOIN flag f ON (f.sessionid = s.id)
            JOIN candidate c ON (c.candid = s.candid)
            JOIN test_names t ON (t.Test_name = f.Test_name)
            JOIN psc ON (s.CenterID = psc.CenterID)";
        }

        $where   =" WHERE s.Active='Y'
            AND c.Active='Y'
            AND s.Current_stage <> 'Recycling Bin'
            AND f.CommentID not like '%DDE%'
            AND f.Administration <> 'None'
            AND f.Data_entry = 'Complete'
            AND psc.Centerid!= '1'
            AND c.Entity_type != 'Scanner'";
        $qparams = array();

        if (($visit_label !=null)&&($visit_label!='All Visits')) {
            $where        .= " AND s.Visit_label = :VL";
            $qparams['VL'] = $visit_label;
        }
        if ($candidate !=null) {
            $where        .= " AND s.candID = :CI";
            $qparams['CI'] = $candidate;
        }
        if ($site!='All Sites') {
            if ($site == 'All User Sites') {
                $user           = \User::singleton();
                $siteID         = $user->getCenterIDs();
                $where         .= " AND FIND_IN_SET(psc.CenterID, :CID)";
                $qparams['CID'] = implode(',', $siteID);
            } else {
                $where         .= " AND s.CenterID = :CID";
                $qparams['CID'] = $site;
            }
        }
        if (($project !=null)&&($project!='All Projects')) {
            $where         .= " AND c.ProjectID = :PID";
            $qparams['PID'] = $project;
        }

        $query .= $where;
        $count  =$DB->pselectOne($query, $qparams);
        return $count;
    }


    /**
     * _getPercentCompleted($instrument)
     *
     * Returns the percent completed for the given instrument
     *
     * @param int        $instrument  the value of instrument
     * @param string     $visit_label the value of visit lable
     * @param string     $candidate   the value of candidate
     * @param int|string $site        the value of the site
     * @param ?int       $project     the id of the project or can be null
     *
     * @return int
     */
    function _getPercentCompleted($instrument,
        $visit_label=null,
        $candidate=null,
        $site=null,
        $project=null
    ) {

        $percent_completed =0;
        $total_count       = $this->getInstrumentCount(
            $instrument,
            $visit_label,
            $candidate,
            $site,
            $project
        );

        $complete_count = $this->getCompleteInstrumentCount(
            $instrument,
            $visit_label,
            $candidate,
            $site,
            $project
        );

        if ($complete_count !=0) {
            $percent_completed
                = round($complete_count / $total_count, 2) * 100;
        }
        return $percent_completed;
    }

    /**
     * GetTestNameusingMappedName
     * returns the Test_name and its corresponding visit_label..
     * using the full_name  and/or subprojectID ..
     *
     * @param string|null $full_name    the value of full name
     * @param string|null $subprojectID the value of subproject ID
     *
     * @return string
     * @throws \DatabaseException
     */
    function getTestNameusingMappedName($full_name, $subprojectID = null): string
    {
        $DB     =& \Database::singleton();
        $values = array();

        $test_name = '';
        if ((!(is_null($full_name)))) {
            if ($DB->ColumnExists('test_battery', 'Test_name_display')) {
                $sqlSelectOne = "SELECT Test_name".
                    " FROM test_battery".
                    " WHERE Test_name_display=:display";
                $test_name    = $DB->pselectOne(
                    $sqlSelectOne,
                    array('display' => $full_name)
                );
            } else {
                $test_name = \Utility::getTestNameUsingFullName($full_name);
            }
        }
        return $test_name;
    }

    /**
     * Get all the instruments for the given visit...
     *
     * @param string $visit_label the value of visit label
     *
     * @return   array
     * @throws   \DatabaseException
     * @internal param unknown_type $visit
     */
    static function getVisitInstruments($visit_label)
    {
        $DB =& \Database::singleton();

        if ($DB->ColumnExists('test_battery', 'Test_name_display')) {
            $sqlSelect  = "SELECT distinct Test_name_display".
                " from test_battery where Visit_label =:vl";
            $test_names = $DB->pselect($sqlSelect, array('vl' => $visit_label));
        } else {
            $test_names = $DB->pselect(
                "SELECT DISTINCT t.Full_name as Test_name_display 
                        FROM session s
			JOIN candidate c ON (c.candid=s.candid)
			JOIN psc ON (s.CenterID = psc.CenterID)
			JOIN flag f ON (f.sessionid=s.id)
			JOIN test_names t ON (f.test_name=t.Test_name)
			WHERE c.Active='Y' AND s.Active='Y' 
                        AND s.Visit_label =:vl
                        AND psc.CenterID != '1'
                        AND c.Entity_type != 'Scanner'
                        ORDER BY t.Full_name ",
                array('vl' => $visit_label)
            );
        }

        return $test_names;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/data_team_helper/js/data_team.js",
            )
        );
    }

    /**
     * Include additional CSS files:
     *  1. data_team_helper
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
            [$baseURL . "/data_team_helper/css/data_team_helper.css"]
        );
    }
}
