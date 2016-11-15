<?php
/**
 * This is a file called used by the behavioural qc browser
 * auto-complete to retrieve candidates for a given
 * instrument and/or visit.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Loris
 * @author   Evan McIlroy <evanmcilroy@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

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
class NDB_Form_data_team_helper extends NDB_Form
{
    /**
     * Class that returns the data team helper.
     *
     * @return bool|object
     * @throws ConfigurationException
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        return ($user->hasPermission('data_team_helper'));
    }
    /**
     * Returns the defaults.
     *
     * @return array
     * @throws DatabaseException
     */
    function _getDefaults()
    {
        $defaults     = array();
        $DB           =& Database::singleton();
        $extra_where .= $this->AddWhere("p.sourceFrom", 'instrument');
        $extra_where .= $this->AddWhere("p.Name", 'FieldName');
        $orderby      = " ORDER BY p.sourceFrom,p.sourceField";

        //construct the query
        if (($extra_where) !=null) {
            $query = "SELECT DISTINCT p.sourceFrom,p.sourceField FROM
                parameter_type p WHERE 1=1 $extra_where";
            $DB->select($query,  $info);
            foreach ($info as $data) {
                $percent_completed            = $data['Name']
                    . ":" . $data['Visit_label']
                    .":" . 'percent_completed';
                $defaults[$percent_completed] = $data['percent_completed'];
            }
        }
        $defaults["feedback_status"]    = $_REQUEST['feedback_status'];
        $defaults["completion_status"]  = $_REQUEST['completion_status'];
        $defaults["sent_to_dcc_status"] = $_REQUEST['sent_to_dcc_status'];
        $defaults["instrument"]         = $_REQUEST['instrument'];
        $defaults["FieldName"]          = $_REQUEST['FieldName'];
        $defaults["candidate"]          = $_REQUEST['candidate'];
        $defaults["visit_label"]        = $_REQUEST['visit_label'];
        $this->tpl_data['instrumentvalue'] = $_REQUEST['instrument'];
        return $defaults;
    }
    /**
     * Returns data team helper.
     *
     * @return null
     * @throws DatabaseException
     */
    function data_team_helper()
    {
        //initializations
        $DB        =& Database::singleton();
        $conflicts = array();
        $smarty    = new Smarty_neurodb();

        $config =& NDB_Config::singleton();

        $instrument = $this->getTestNameusingMappedName($_REQUEST['instrument']);
        //construct the instrument drop down..
        $this->tpl_data['visit_label'] = $_REQUEST['visit_label'];
        $this->tpl_data['FieldName']   = $_REQUEST['FieldName'];
        if ($_REQUEST['PSCID'] && !empty($_REQUEST['PSCID'])) {
            $this->tpl_data['candidate'] = $_REQUEST['PSCID'];
        } elseif ($_REQUEST['candidate'] && !empty($_REQUEST['candidate'])) {
            $this->tpl_data['candidate']
                = Candidate::singleton($_REQUEST['candidate'])->getPSCID();
        } else {
            $this->tpl_data['candidate'] = null;
        }
        $this->tpl_data['test_name'] = $instrument;

        if (isset($_REQUEST['PSCID']) && !empty($_REQUEST['PSCID'])
            && (isset($_REQUEST['candidate'])) && !empty($_REQUEST['candidate'])
        ) {
            $candID = ($_REQUEST['candidate']);
        } elseif (isset($_REQUEST['candidate']) && !empty($_REQUEST['candidate'])) {
                $candID = $_REQUEST['candidate'];
        } elseif (isset($_REQUEST['PSCID']) && !empty($_REQUEST['PSCID'])) {
            $query   = "SELECT CandID FROM candidate WHERE PSCID = :PID";
            $qparams = (array('PID' => $_REQUEST['PSCID']));
            $candID  = $DB->pselectOne($query, $qparams);
        }

        //Percentage completed for the given instrument
            $percent_completed = $this->_getPercentCompleted(
                $instrument,
                $_REQUEST['visit_label'],
                $candID
            );
            $this->tpl_data['percent_completed'] = $percent_completed;

         /* Visit_labels
         */
        $visit_array =Utility::getExistingVisitLabels();
        $visit_array = array_combine($visit_array, $visit_array);
        $this->tpl_data['visitLabels'] = $visit_array;

        $incompleteCandidates = $this->
            getIncompleteCandidates($instrument, $_REQUEST['visit_label'], $candID);

        $this->tpl_data['Incomplete_candidates']
            = json_encode($incompleteCandidates);

        $this->tpl_data['Incomplete_candidates_length']
            = count($incompleteCandidates);

        $conflicts = $this->
            InstrumentInConflict($instrument, $_REQUEST['visit_label'], $candID);

        $this->tpl_data['Conflicts'] =  json_encode($conflicts);

        $this->tpl_data['Conflicts_length'] = count($conflicts);

        $bvlFeedback = $this
            ->getFeedbacks($instrument, $candID, $_REQUEST['visit_label']);
        

        $this->tpl_data['Bvl_Feedback'] = json_encode($bvlFeedback);

        $this->tpl_data['Bvl_Feedback_length'] = count($bvlFeedback);

        $this->tpl_data['percent_complete'] = $this
            ->_getPercentCompleted($instrument, $_REQUEST['visit_label'], $candID);

    }

    /**
     * getFeedbacks
     * Return all the existing feedbackid threads for the given fieldname
     * In  addition to other secific info (the test_name,commentid,
     * candid,session id).
     *
     * In the case of no instrument, candidate or visit set we return
     * all the feedback at all levels. In the case of just a candidate
     * set we return all feedbacks at every level for that candidate.
     *
     * @param null $test_name
     * @param null $candID
     * @param null $visit_label
     *
     * @return   Array containing a list of feedbacks for the appropriate feedback level.
     * @throws   DatabaseException
     * @internal param unknown_type $field_name
     */
    function getFeedbacks($test_name = null, $candID=null, $visit_label=null)
    {

        $DB      =& Database::singleton();
        $qparams = array();

        $select = "SELECT fb.FeedbackID, fb.CandID, fb.SessionID,
                      fb.CommentID, fb.Feedback_level, f.Test_name, fb.FieldName,
                      tn.Full_name, s.Visit_label FROM feedback_bvl_thread AS fb
                      JOIN session s ON (s.ID = fb.SessionID)
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

        if (isset($test_name) && $test_name !='All Instruments' ) {

            $where      .= " AND FieldName = :FN";
            $field_names = Utility::getSourcefields($test_name);

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
                && !isset($v['Test_name'])) {
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
     * @param  unknown_type $Column
     * @param  unknown_type $Filter
     * @return unknown
     */
    function AddWhere($Column, $Filter)
    {
        if (!empty($_REQUEST[$Filter])
            && $_REQUEST[$Filter] !=='All Fields'
            && (strtolower($_REQUEST[$Filter]) !=='any')
            && ($_REQUEST[$Filter] !=='All Visits')
            && $_REQUEST[$Filter] !=='all_flags'
            && ($_REQUEST[$Filter] !=='All Instruments')
        ) {
            global $DB;
            if ($Filter == 'instrument') {
                $test_name = $this->getTestNameusingMappedName($_REQUEST[$Filter]);
                return " AND $Column LIKE " . $DB->quote($test_name);
            }
            if ($_REQUEST[$Filter] == 'not_sent_to_dcc') {
                return " AND $Column NOT LIKE '%Approval%'";
            }
            return " AND $Column LIKE " . $DB->quote($_REQUEST[$Filter]);
        }
        return '';
    }
    /**
     * InstrumentInConflict
     * Get the list of fieldnames in conflict for the given test_name from conflict_unresolved
     *
     * @param unknown_type $test_name
     * @param $visit_label
     * @param candidate
     *
     * @return unknown
     */
    function InstrumentInConflict($test_name, $visit_label=null, $candidate=null)
    {
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
            $where = " WHERE ca.Active = 'Y' AND s.Active = 'Y' AND psc.Centerid!= '1' AND ca.Entity_type != 'Scanner'";
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

        $query     = $query . $where;
        $conflicts = $DB->pselect($query, $qparams);
        return $conflicts;
    }

    function FieldInConflict($test_name,$field_name)
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
        $conflicts = $DB->pselect($query, array('TN' => $test_name, 'FN' => $field_name));
        return $conflicts;
    }


    function getIncompleteCandidates($test_name,$visit_label=null, $candidate=null)
    {
        global $DB;
        $query = "SELECT DISTINCT s.ID, s.visit_label, c.PSCID,s.candid, f.SessionID, f.test_name,f.data_entry,f.commentid, t.Full_name FROM session s
            JOIN flag f ON (f.sessionid = s.id)
            JOIN candidate c ON (c.candid = s.candid)
            JOIN test_names t ON (t.Test_name = f.Test_name)
            JOIN psc ON (s.CenterID = psc.CenterID)	";

        $where   = " WHERE s.Active = 'Y' AND c.Active = 'Y' AND coalesce(f.data_entry,'In Progress') = 'In Progress' AND psc.Centerid!= '1' AND c.Entity_type != 'Scanner'";
        $qparams = array();

        //filter for testname
        if(($test_name !=null)&&($test_name!='All Instruments')) {
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

        $order_by = " ORDER BY f.commentid ";

        $query   = $query . $where . $order_by;
        $results = $DB->pselect($query, $qparams);
        return $results;
    }



    function getInstrumentCount($test_name, $visit_label=null, $candidate=null)
    {
        global $DB;

        if($test_name != null) {
            $query = "SELECT COUNT(*) FROM $test_name AS i
            JOIN flag f ON (f.CommentID=i.CommentID)
            JOIN session s ON (s.ID = f.SessionID)
            JOIN candidate c ON (c.CandID = s.CandID)
            JOIN psc ON (s.CenterID = psc.CenterID)	";
        }

        else{
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

        $query .= $where;
        $count  =$DB->pselectOne($query, $qparams);
        return $count;
    }


    function getCompleteInstrumentCount($test_name,$visit_label=null, $candidate=null)
    {
        global $DB;
        if($test_name != null) {
            $query = "SELECT COUNT(*) FROM $test_name AS i
            JOIN flag f ON (f.CommentID=i.CommentID)
            JOIN session s ON (s.ID = f.SessionID)
            JOIN candidate c ON (c.CandID = s.CandID)
            JOIN psc ON (s.CenterID = psc.CenterID)	";
        }
        else{
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

        $query .= $where;
        $count  =$DB->pselectOne($query, $qparams);
        return $count;
    }


    /**
     * _getPercentCompleted($instrument)
     *
     * Returns the percent completed for the given instrument
     *
     * @param  unknown_type $instrument
     * @param  null         $visit_label
     * @param  null         $candidate
     * @return unknown
     */

    function _getPercentCompleted($instrument,$visit_label=null, $candidate=null)
    {
        $percent_completed =0;
        $total_count       = $this
            ->getInstrumentCount($instrument, $visit_label, $candidate);

        $complete_count    = $this
            ->getCompleteInstrumentCount($instrument, $visit_label, $candidate);

        if ($complete_count !=0) {
            $percent_completed = round($complete_count / $total_count, 2) * 100 ;
        }
        return $percent_completed;
    }

    /**
     * getTestNameusingMappedName
     * returns the Test_name and its corresponding visit_label.. using the full_name  and/or subprojectID ..
     * @param $full_name
     * @param null      $subprojectID
     * @return mixed|Non
     * @throws DatabaseException
     */

    function getTestNameusingMappedName($full_name, $subprojectID = null)
    {
        $DB     =& Database::singleton();
        $values = array();
        if ((!(is_null($full_name)))) {
            if ($DB->ColumnExists('test_battery', 'Test_name_display')) {
                $test_name = $DB->pselectOne("SELECT Test_name FROM test_battery WHERE Test_name_display=:display", array('display' => $full_name));
            } else {
                $test_name = Utility::getTestNameUsingFullName($full_name);
            }
        }
        return     $test_name;
    }

    /**
     * *
     * get all the instruments for the given visit...
     * @param $visit_label
     * @return unknown
     * @throws DatabaseException
     * @internal param unknown_type $visit
     */
    static function getVisitInstruments($visit_label)
    {
        $DB =& Database::singleton();

        if ($DB->ColumnExists('test_battery', 'Test_name_display')) {
            $test_names = $DB->pselect("SELECT distinct Test_name_display from test_battery where Visit_label =:vl", array('vl' => $visit_label));
        } else {
            $test_names = $DB->pselect(
                "SELECT DISTINCT t.Full_name as Test_name_display FROM session s
			JOIN candidate c ON (c.candid=s.candid)
			JOIN psc ON (s.CenterID = psc.CenterID)
			JOIN flag f ON (f.sessionid=s.id)
			JOIN test_names t ON (f.test_name=t.Test_name)
			WHERE c.Active='Y' AND s.Active='Y' AND s.Visit_label =:vl AND psc.CenterID != '1' AND c.Entity_type != 'Scanner' ORDER BY t.Full_name ",
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
        $factory = NDB_Factory::singleton();
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
           $factory = NDB_Factory::singleton();
           $baseURL = $factory->settings()->getBaseURL();
           $deps    = parent::getCSSDependencies();
           return array_merge(
               $deps,
               [$baseURL . "/data_team_helper/css/data_team_helper.css"]
           );
       }
}
