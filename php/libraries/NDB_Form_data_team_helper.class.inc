<?php
require_once "NDB_Form.class.inc";

/**
 * @package main
 */

class NDB_Form_data_team_helper extends NDB_Form
{

    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if(Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        return true;
    }

    function _getDefaults()
    {
        $defaults = array();
        $DB =& Database::singleton();
        $extra_where .= $this->AddWhere("p.sourceFrom", 'instrument');
        $extra_where .= $this->AddWhere("p.Name", 'FieldName');
        $orderby = " ORDER BY p.sourceFrom,p.sourceField";

        //construct the query
        if (($extra_where) !=null) {
            $query = "SELECT DISTINCT p.sourceFrom,p.sourceField FROM
                parameter_type p WHERE 1=1 $extra_where";
            $DB->select($query,  $info);
            foreach ($info as $data){
                $percent_completed = $data['Name'] . ":" . $data['Visit_label'] .":" . 'percent_completed';
                $defaults[$percent_completed] = $data['percent_completed'];
            }
        }
        $defaults["feedback_status"] = $_REQUEST['feedback_status'];
        $defaults["completion_status"] = $_REQUEST['completion_status'];
        $defaults["sent_to_dcc_status"] = $_REQUEST['sent_to_dcc_status'];
        $defaults["instrument"] = $_REQUEST['instrument'];
        $defaults["FieldName"] = $_REQUEST['FieldName'];
        $defaults["visit_label"] = $_REQUEST['visit_label'];
        return $defaults;
    }


    function data_team_helper()
    {
        //initializations
        $DB =& Database::singleton();
        $extra_where = '';
        $conflicts = array();
        $smarty = new Smarty_neurodb();

        $config =& NDB_Config::singleton();
        $study = $config->getSetting('study');

        $instrument = $this->getTestNameusingMappedName($_REQUEST['instrument']); //converts the full_name into the test_name

        //construct the instrument drop down..
        $this->tpl_data['visit_label'] = $_REQUEST['visit_label'];
        $this->tpl_data['FieldName'] = $_REQUEST['FieldName'];
        $this->tpl_data['test_name'] = $instrument;

        //Percentage completed for the given instrument
        if ($instrument !=null) {
            $percent_completed = $this->_getPercentCompleted($instrument,$_REQUEST['visit_label']);
            $this->tpl_data['percent_completed'] = $percent_completed;
        }

        //Constructs the where clause...
        $extra_where .= $this->AddWhere("p.sourcefrom", 'instrument');
        $extra_where .= $this->AddWhere("p.Name", 'FieldName');
        $extra_where .= $this->AddWhere("f.data_entry", 'completion_status');
        $extra_where .= $this->AddWhere("s.Current_stage", 'sent_to_dcc_status');
        $extra_where .= $this->AddWhere("s.Visit_label", 'visit_label');


        //$extra_where .= $this->AddWhere("bt.status", 'feedback_status');
        $orderby = " ORDER BY p.sourceFrom,p.sourceField";
        //construct the query
        if (($extra_where) !=null) {
            $query = "SELECT DISTINCT p.sourceFrom,p.Name, s.Visit_label, p.sourceField, p.description FROM session s
                JOIN flag f ON (f.sessionid = s.id)
                JOIN parameter_type p ON (p.sourceFrom=f.test_name)
                JOIN candidate c ON (c.CandID = s.CandID)
                JOIN psc ON (s.CenterID = psc.CenterID)
                WHERE s.candid = c.candid AND s.Active = 'Y' AND  c.Active = 'Y' AND psc.Centerid!= '1' AND p.Queryable = '1' AND c.pscid NOT LIKE '%999-99999%' AND c.PSCID NOT LIKE '%scanner%' $extra_where $orderby";
            $DB->select($query,  $info);
        }
        /**
         * 
         * Visit_labels
         */
        $visit_array=Utility::getExistingVisitLabels();
        $visit_array = array_combine($visit_array,$visit_array);
        $this->tpl_data['visitLabels'] = $visit_array;


        ///////////////////////////////////////////////////////////////
        ///Show the number of generated results...
        ///////////////////////////////////////////////////////////////
        //If there are no data print a message to that effect
        if(empty($info)) {
            $this->form->addElement('static', "status", "No matching criteria found.");
            return;
        } else {
            $this->form->addElement('static', 'total', 'Total number of results:', sizeof($info));
        }

        $this->tpl_data['Incomplete_candidates'] =  $this->getIncompleteCandidates($instrument,$_REQUEST['visit_label']);
        $conflicts= $this->InstrumentInConflict($instrument);
        $this->tpl_data['Conflicts'] =  $conflicts;
        //Loop through the conflicts and add a row per
        foreach($info AS $data) {

            $this->tpl_data['Visit_label_list'][] = $data['Visit_label'];//contains the visit_label for each element...
            $name = $data['Name'];
            $List_of_feedbacks = $this->getFeedbacks($data['sourceField'],$data['sourceFrom'],$data['Visit_label']);
            $percent_completed = $data['Name'] . ":" . $data['Visit_label'] . ':percent_completed';
            $Last_access = $data['Name'] . ":" . $data['Visit_label'] . ':Last_access';

            ///create the quickform elements
            $this->form->addElement("textarea", $comment, 'Comment',array('rows' => 2, 'cols' => 20));//comment box
            $this->form->addElement("static", "instrument", $data['sourceFrom']);//comment box
            $this->form->addElement('static', $percent_completed, '% completed');//%completion

            //template data...
            $this->tpl_data['elements_list_names'][] = $data['Name'];//contains the list of data field names...
            $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['sourcefield'] = $data['sourceField'];
            $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['sourcefrom'] = $data['sourceFrom'];
            $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['visit_label'] = $data['Name'] . "_" . $data['Visit_label'];
            $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['Description'] =$data['description'];
            $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['percent_completed'] = $percent_completed;
            $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['Name'] = $data['Name'];

            if ($List_of_feedbacks !=null) {
                $counter =0;
                foreach($List_of_feedbacks as $feedback) {
                    $fb = NDB_BVL_Feedback::singleton(null,$feedback['CandID'],$feedback['id'], $feedback['commentid']);
                    $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['FeedbackList'][$counter]['commentid'] = $feedback['commentid'];
                    $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['FeedbackList'][$counter]['commentid'] = $feedback['commentid'];
                    $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['FeedbackList'][$counter]['CandID'] = $feedback['CandID'];
                    $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['FeedbackList'][$counter]['PSCID'] = $feedback['PSCID'];
                    $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['FeedbackList'][$counter]['session_id'] = $feedback['id'];
                    $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['FeedbackList'][$counter]['feedbackid'] = $feedback['feedbackid'];
                    $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['FeedbackList'][$counter]['visit_label'] = $feedback['visit_label'];
                    $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['FeedbackList'][$counter]['Status'] = $feedback['Status'];
                    $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['FeedbackList'][$counter]['QC_color'] = $fb->getThreadColor($feedback['Status']);
                    $this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['FeedbackList'][$counter]['test_name'] =$data['sourceFrom'];
                    $counter++;
                }
            }
        }
    }

    /**
     * getFeedbacks
     * Return all the existing feedbackid threads for the given fieldname
     * IN addition to other secific info (the test_name,commentid,candid,session id)
     *
     * @param unknown_type $field_name
     * @return unknown
     */
    function getFeedbacks($field_name,$test_name=null,$visit_label=null) 
    {
        $DB =& Database::singleton();
        $feedback_status = $_REQUEST['feedback_status'];
        $query = "SELECT f.test_name,s.visit_label,f.commentid,c.CandID,c.PSCID,s.id,bt.feedbackid,bt.Status FROM session s
            JOIN flag f ON (s.ID = f.SessionID)
            JOIN feedback_bvl_thread bt ON (bt.commentid = f.commentid)
            JOIN candidate c ON (c.Candid = s.Candid)
            JOIN psc ON (s.CenterID = psc.CenterID)
            WHERE c.PSCID NOT LIKE '%999-99999%' AND c.Active = 'Y' AND	s.Active = 'Y' AND bt.FieldName ='$field_name' AND f.test_name = '$test_name' AND psc.Centerid!= '1' AND c.PSCID NOT LIKE '%scanner%'";

        if (isset($feedback_status) && $feedback_status!= "all") {
            $where .= " And bt.status = '$feedback_status'" ;
        }

        if (($visit_label !=null)&&($visit_label!='All Visits')) {
            $where .= " And s.visit_label = '$visit_label'";
        }
        $query = $query. $where;
        $DB->select($query,$results);
        return $results;

    }

    /**
     * AddWhere
     * Constructs the query....
     *
     * @param unknown_type $Column
     * @param unknown_type $Filter
     * @return unknown
     */

    function AddWhere($Column, $Filter) 
    {
        if(!empty($_REQUEST[$Filter]) && $_REQUEST[$Filter] !=='All Fields' && (strtolower($_REQUEST[$Filter]) !=='any') && ($_REQUEST[$Filter] !=='All Visits') && $_REQUEST[$Filter] !=='all_flags') {
            global $DB;
            if ($Filter == 'instrument') {
                $test_name = $this->getTestNameusingMappedName($_REQUEST[$Filter]); //converts the full_name into the test_name
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
     * @param unknown_type $test_name
     * @return unknown
     */
    function InstrumentInConflict($test_name) 
    {
        global $DB;
        $conflicts = array();
        //if test_name display exists
        if (Utility::ColumnExists($test_name , 'Test_name_display')) {
            $query = "SELECT DISTINCT s.CandID,ca.PSCID, c.FieldName,c.TableName,t.test_name_display, s.visit_label FROM conflicts_unresolved c
                LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
                LEFT JOIN session s ON (f.SessionID=s.ID)
                LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
                JOIN test_battery t ON (t.test_name = f.test_name)
                JOIN psc ON (s.CenterID = psc.CenterID)
                WHERE t.visit_label = s.Visit_label AND TableName LIKE '$test_name%' AND ca.PSCID NOT LIKE '%999-99999%' AND ca.Active = 'Y' AND s.Active = 'Y' AND psc.Centerid!= '1' AND ca.PSCID not like '%scanner%'";

        } else {
            $query = "SELECT distinct s.CandID,ca.PSCID, c.FieldName,c.TableName,t.full_name AS test_name_display, s.visit_label FROM conflicts_unresolved c
                LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
                LEFT JOIN session s ON (f.SessionID=s.ID)
                LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
                JOIN test_names t ON (t.test_name = f.test_name)
                JOIN psc ON (s.CenterID = psc.CenterID)
                WHERE TableName LIKE '$test_name%' AND ca.PSCID NOT LIKE '%999-99999%' AND ca.Active = 'Y' AND s.Active = 'Y' AND psc.Centerid!= '1' AND ca.PSCID NOT LIKE '%scanner%'";
            $DB->select($query,$conflicts);
            return $conflicts;
        }
    }

    function FieldInConflict($test_name,$field_name) 
    {
        //Do for each instrument....one shot....
        //And then extract the specific info through template..
        global $DB;
        $conflicts = array();
        if (Utility::ColumnExists($test_name , 'Test_name_display')) {

            $query = "SELECT DISTINCT s.CandID, ca.PSCID, c.FieldName,c.TableName,t.test_name_display, s.visit_label FROM conflicts_unresolved c
                LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
                LEFT JOIN session s ON (f.SessionID=s.ID)
                LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
                JOIN test_battery t ON (t.test_name = f.test_name)
                JOIN psc ON (s.CenterID = psc.CenterID)
                WHERE t.visit_label = s.Visit_label AND TableName LIKE '$test_name%' AND c.FieldName = '$field_name' AND ca.PSCID NOT LIKE '%999-99999%' AND ca.Active = 'Y' AND s.Active = 'Y' AND psc.Centerid!= '1' AND ca.PSCID NOT LIKE '%scanner%'";
        } else {
            $query = "SELECT DISTINCT s.CandID, ca.PSCID, c.FieldName,c.TableName,t.full_name AS test_name_display, s.visit_label FROM conflicts_unresolved c
                LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
                LEFT JOIN session s ON (f.SessionID=s.ID)
                LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
                JOIN psc ON (s.CenterID = psc.CenterID)
                JOIN test_names t ON (t.test_name = f.test_name)
                WHERE TableName LIKE '$test_name%' AND c.FieldName = '$field_name' AND ca.PSCID NOT LIKE '%999-99999%' AND ca.Active = 'Y' AND s.Active = 'Y' AND psc.Centerid!= '1' AND ca.PSCID NOT LIKE '%scanner%'";
        }
        $DB->select($query,$conflicts);
        return $conflicts;
    }


    function getIncompleteCandidates($test_name,$visit_label=null) 
    {
        global $DB;
        $query = "SELECT DISTINCT s.ID, s.visit_label, c.PSCID,s.candid, f.test_name,f.data_entry,f.commentid FROM session s
            JOIN flag f ON (f.sessionid = s.id) 
            JOIN candidate c ON (c.candid = s.candid)
            JOIN psc ON (s.CenterID = psc.CenterID)	";

        $where = " WHERE s.Active = 'Y' AND c.Active = 'Y' AND f.test_name LIKE '$test_name' AND coalesce(f.data_entry,'In Progress') = 'In Progress' AND psc.Centerid!= '1' AND c.pscid NOT LIKE '%999-99999%' AND c.candid NOT LIKE '%scanner%'";

        //filter for visit
        if (($visit_label !=null)&&($visit_label!='All Visits')) {
            $where.= " AND s.visit_label = '$visit_label'";
        }
        $order_by = " ORDER BY f.commentid ";

        $query = $query . $where . $order_by;
        $DB->select($query,$results);
        return $results;
    }


    function getInstrumentCount($test_name,$visit_label=null) 
    {
        global $DB;
        $query = "SELECT COUNT(*) FROM $test_name AS i
            JOIN flag f ON (f.CommentID=i.CommentID)
            JOIN session s ON (s.ID = f.SessionID)
            JOIN candidate c ON (c.CandID = s.CandID)
            JOIN psc ON (s.CenterID = psc.CenterID)	";

        $where =" WHERE s.Active='Y'
            AND s.Current_stage <> 'Recycling Bin'
            AND f.CommentID NOT LIKE '%DDE%'
            AND psc.Centerid!= '1'";

        if (($visit_label !=null)&&($visit_label!='All Visits')) {
            $where.= " And s.Visit_label = '$visit_label'";
        }
        $query.= $where;
        $count =$DB->selectOne($query);
        return $count;
    }


    function getCompleteInstrumentCount($test_name,$visit_label=null) 
    { 
        global $DB;
        $query = "SELECT COUNT(*) FROM $test_name AS i
            JOIN flag f ON (f.CommentID=i.CommentID)
            JOIN session s ON (s.ID = f.SessionID)
            JOIN candidate c ON (c.CandID = s.CandID)
            JOIN psc ON (s.CenterID = psc.CenterID)	";

        $where =" WHERE s.Active='Y'
            AND c.Active='Y'
            AND s.Current_stage <> 'Recycling Bin'
            AND f.CommentID not like '%DDE%'
            AND f.Administration <> 'None'
            AND f.Data_entry = 'Complete'
            AND psc.Centerid!= '1'
            AND c.PSCID NOT LIKE '%999-99999%'
            AND c.PSCID NOT LIKE '%scanner%'";

        if (($visit_label !=null)&&($visit_label!='All Visits')) {
            $where.= " AND s.Visit_label = '$visit_label'";
        }
        $query.= $where;
        $count =$DB->selectOne($query);
        return $count;
    }


    /**
     * _getPercentCompleted($instrument)
     *
     * Returns the percent completed for the given instrument
     * @param unknown_type $instrument
     * @return unknown
     */

    function _getPercentCompleted($instrument,$visit_label=null) 
    {
        $percent_completed =0;
        $total_count  = $this->getInstrumentCount($instrument,$visit_label);
        $complete_count = $this->getCompleteInstrumentCount($instrument,$visit_label);
        if ($complete_count !=0) {
            $percent_completed = round($complete_count / $total_count , 2) * 100 ;
        }
        return $percent_completed;
    }

    /**
     * getTestNameusingMappedName
     * returns the Test_name and its corresponding visit_label.. using the full_name  and/or subprojectID ..
     */

    function getTestNameusingMappedName ($full_name, $subprojectID = null) 
    {
        $DB =& Database::singleton();
        $values = array();
        if ((!(is_null($full_name)))) {
            if (Utility::ColumnExists('test_battery' , 'Test_name_display')) {
                $test_name = $DB->pselectOne("SELECT Test_name FROM test_battery WHERE Test_name_display=:display",array('display'=>$full_name));
            } else {
                $test_name = Utility::getTestNameUsingFullName($full_name);
            }
        }
        return 	$test_name;
    }
    
	/**
	 * *
	 * get all the instruments for the given visit...
	 * @param unknown_type $visit
	 * @return unknown
	 */
	static function getVisitInstruments($visit_label){
		$DB =& Database::singleton();
	
		if (Utility::ColumnExists('test_battery', 'Test_name_display')) {
			$test_names = $DB->pselect("SELECT distinct Test_name_display from test_battery where Visit_label =:vl",array('vl'=>$visit_label));
		} else {
			 $test_names= $DB->pselect("SELECT DISTINCT t.Full_name as Test_name_display FROM session s
			JOIN candidate c ON (c.candid=s.candid)
			JOIN psc ON (s.CenterID = psc.CenterID)
			JOIN flag f ON (f.sessionid=s.id)
			JOIN test_names t ON (f.test_name=t.Test_name)
			WHERE c.Active='Y' AND s.Active='Y' AND s.Visit_label =:vl AND psc.CenterID != '1' AND c.PSCID != '%scanner%' ORDER BY t.Full_name ",array('vl'=>$visit_label));
		}
		
		if (Utility::isErrorX($test_names)) {
			return PEAR::raiseError("DB Error: ".$instruments->getMessage());
		}
		return $test_names;
	}
}
?>
