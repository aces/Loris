<?php
require_once "NDB_Form.class.inc";

/**
 * @package main
 * Must run 
 * php Populate_data_integrity_flag.php > Populate_data_integrity_flag.sql
 * m < Populate_data_integrity_flag.sql
 * 
 * ISSUES----------
 * 1) Additional sortable option
 * 2) Page breakdown ( can be added if neccessary)
 */

class NDB_Form_data_integrity_flag extends NDB_Form
{

	function _hasAccess()
	{
		// create user object
		$user =& User::singleton();
		if(PEAR::isError($user)) {
			return PEAR::raiseError("User Error: ".$user->getMessage());
		}
		return ($user->hasPermission('fieldname_integrity'));
	}


	function _getDefaults()
	{

		$defaults = array();
		$DB =& Database::singleton();
		$extra_where .= $this->AddWhere("p.sourcefrom", 'instrument');
		$extra_where .= $this->AddWhere("p.Name", 'FieldName');
		$orderby = " Order by p.sourceFrom,p.sourceField";

		//construct the query
		if (($extra_where) !=null){
			$query = "select distinct d.Visit_label,d.initial_check_date,p.sourceFrom,p.sourceField,d.Name, d.initial_check, p.description,d.Comment,d.percent_completed,d.Last_access from data_integrity_flag d
			join parameter_type p on (d.Name = p.Name) WHERE 1=1 $extra_where";
			$DB->select($query,  $info);
			foreach ($info as $data){
				$inial_check = $data['Name'] . ":" . $data['Visit_label'] . ":" . 'initial_check';
				$comment = $data['Name'] . ":" . $data['Visit_label'] . ":" . 'Comment';
				$date = $data['Name'] . ":" . $data['Visit_label'] . ":" . 'date_flag';
				$percent_completed = $data['Name'] . ":" . $data['Visit_label'] .":" . 'percent_completed';
				$Last_access = $data['Name'] . ":" . $data['Visit_label'] . ":" . 'Last_access';
				//set the default values for the different variables
				$defaults[$inial_check] = $data['initial_check'];
				$defaults[$comment] = $data['Comment'];
				$defaults[$date] = $this->_getQuickformDate( $data['initial_check_date']); //converts the mysql date (2011-01-09 toArray ( [Y] => 2009 [M] => 01 [d] => 01)
				$defaults[$percent_completed] = $data['percent_completed'];
				$defaults[$Last_access] = $data['Last_access'];
			}
		}

		$defaults["initial_check"] = $_REQUEST['initial_check'];
		$defaults["feedback_status"] = $_REQUEST['feedback_status'];
		$defaults["completion_status"] = $_REQUEST['completion_status'];
		$defaults["sent_to_dcc_status"] = $_REQUEST['sent_to_dcc_status'];
		$defaults["instrument"] = $_REQUEST['instrument'];
		$defaults["FieldName"] = $_REQUEST['FieldName'];
		$defaults["visit_label"] = $_REQUEST['visit_label'];

		return $defaults;

	}

	function _process($values)
	{

		if(!is_array($values) || count($values) ==0) {
			return true;
		}

		/////////initialization///////
		$where = array();
		$instrument = Utility::getTestNameUsingFullName($_REQUEST['instrument']);
		$update = array();
		$DB =& Database::singleton();
		$user =& User::singleton();
		if(PEAR::isError($user)) {
			return PEAR::raiseError("User Error: ".$user->getMessage());
		}

		$visit_label = $_REQUEST['visit_label'];
		foreach($values AS $key=>$val) {
			if(($val != 'none') && ($val !='')){

				if ((is_array($val)) && ($val['Y'] == '')){
					continue;
				}
				//////////////////////////////////////////////////////////////
				//////////////////initial_check/////////////////////////////
				//////////////////////////////////////////////////////////////
				if (preg_match('/initial_check/',$key,$matches)){
					$element_chopped = substr($key, 0, -14);//with visit_label bdi_data_entry_date_pregnancy_26week
					$update['initial_check'] = $val;
				}

				//////////////////////////////////////////////////////////////
				//////////////////comment/////////////////////////////
				//////////////////////////////////////////////////////////////
				if (preg_match('/Comment/',$key,$matches)){
					$element_chopped = substr($key, 0, -8);//with visit_label bdi_data_entry_date_pregnancy_26week
					$update['Comment'] = $val;
				}

				//////////////////////////////////////////////////////////////
				//////////////////date_flag/////////////////////////////
				//////////////////////////////////////////////////////////////
				if (preg_match('/date_flag/',$key,$matches)){
					$date = sprintf("%04d-%02d-%02d", $val['Y'], $val['M'], $val['d']);
					if($date == '0000-00-00') {
						$date = NULL;
					}
					$element_chopped = substr($key, 0, -10);//with visit_label bdi_qn1_pregnancy
					$update['initial_check_date'] = $date;
				}

				///////////////////////////////////////////////////////////////////////////////////////////
				////////////////////Extract the Visit_lable and NAME////////////////////////////////////
				///////////////////////////////////////////////////////////////////////////////////////////

				if (($element_chopped!=null)&&($update!=null)){
					list($name,$visit_label) = split(":", $element_chopped);
					$percent_completed = $this->getData($name,$visit_label,"percent_completed"); //gets the current value for the percent_completed
					$initial_check_database = $this->getData($name,$visit_label,"initial_check"); //gets the current value for the percent_completed
					$initial_check_broswer = $values[$name . ":" . $visit_label . ":initial_check"]; //initial_check value
					if (($initial_check_broswer !=null) && ($initial_check_broswer!=$initial_check_database)) {
						$percet_completed = $this->_getPercentCompleted($instrument,$visit_label);		//save the percentage in the database...at the time of saving
						$date = date("Y-m-d H:i:s");
						$update['Last_access'] = $date;
						$update['percent_completed'] = $percet_completed;
					}

					$where = array_merge($where,array('Visit_label'=>$visit_label,'Name'=>$name)); //construct the where clause
					$success = $DB->update("data_integrity_flag", $update, $where);
					if(PEAR::isError($success)) {
						return PEAR::raiseError("NDB_Form_data_integrity_flag::_process: ".$success->getMessage());
					}
					$update =null;
				}
			}
		}
		$this->tpl_data['success'] = true;
	}


	function data_integrity_flag()
	{

		//initializations
		$DB =& Database::singleton();
		$extra_where = '';
		$conflicts = array();
		$smarty = new Smarty_neurodb();

		$config =& NDB_Config::singleton();
		$study = $config->getSetting('study');

		$dateOptions = array(
		'language'        => 'en',
		'format'          => 'YMd',
		'addEmptyOption'  => true,
		'minYear'         => $study['startYear'],
		'maxYear'         => $study['endYear']
		);

		$this->form->addFormRule(array(&$this,'_validate'));
		$instrument = Utility::getTestNameUsingFullName($_REQUEST['instrument']);//Converts the full_name into the test_name

		//construct the instrument drop down..
		$instruments = Utility::getSourcefrom(); //get the fullnames from the test_names
		$this->tpl_data['instrument'] = $instruments;
		$this->tpl_data['visit_label'] = $_REQUEST['visit_label'];
		$this->tpl_data['FieldName'] = $_REQUEST['FieldName'];
		$this->tpl_data['test_name'] = $instrument;

		//initial_check drop down
		$this->form->addElement("select", 'initial_check', 'Check Stage', array("all_flags"=>"All Flags","1"=>'1- Validation/Completion',"2"=>'2- Statistical Verification', "3"=>'3- Finalization'));
		//status drop down
		$this->form->addElement("select", 'feedback_status', 'Feedback Status', array("all" => "All Status","comment"=>"Comment","opened"=>'Opened',"closed"=>'Closed'));
		//completion status
		$this->form->addElement("select", 'completion_status', 'Completion Status', array("any" => "Any","Complete"=>"Complete","In Progress"=>'In Progess'));
		//sent to dcc drop down
		$this->form->addElement("select", 'sent_to_dcc_status', 'Visit stage status', array("any" =>"Any",'Not Started'=>'Not Started','Screening'=>'Screening','Visit'=>'Visit','Approval'=>'Sent to dcc','not_sent_to_dcc'=>"Not Sent to DCC",'Recycling Bin'=>'Recycling Bin'));

		//Percentage completed for the given instrument
		if ($instrument !=null){
			$percet_completed = $this->_getPercentCompleted($instrument,$_REQUEST['visit_label']);
			print "percent completed is $percet_completed" ;
			$this->tpl_data['percent_completed'] = $percet_completed;
		}

		//Constructs the where clause...
		$extra_where .= $this->AddWhere("p.sourcefrom", 'instrument');
		$extra_where .= $this->AddWhere("p.Name", 'FieldName');
		$extra_where .= $this->AddWhere("d.initial_check", 'initial_check');
		$extra_where .= $this->AddWhere("f.data_entry", 'completion_status');
		$extra_where .= $this->AddWhere("s.Current_stage", 'sent_to_dcc_status');
		$extra_where .= $this->AddWhere("d.Visit_label", 'visit_label');

		//$extra_where .= $this->AddWhere("bt.status", 'feedback_status');
		$orderby = " Order by p.sourceFrom,p.sourceField";
		//construct the query
		if (($extra_where) !=null){
			$query = "select distinct p.sourceFrom,p.sourceField,d.Visit_label,d.Name,d.Last_access, d.initial_check,d.initial_check_date,percent_completed, p.description,d.Comment from session s
			join flag f on (f.sessionid = s.id)
			join parameter_type p on (p.sourceFrom=f.test_name)
		    join data_integrity_flag d on (d.Name = p.Name) 
			join candidate c on (c.CandID = s.CandID)
			join psc on (s.CenterID = psc.CenterID)
			WHERE s.candid = c.candid and s.Active = 'Y' And  c.Active = 'Y' AND psc.Centerid!= '1' $extra_where $orderby";
			$DB->select($query,  $info);
		}

		///////////////////////////////////////////////////////////////
		///Show the number of generated results...
		///////////////////////////////////////////////////////////////
		//If there are no data print a message to that effect
		if(empty($info)){
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

			$name = $data['Name'];

			$List_of_feedbacks = $this->getFeedbacks($data['sourceField'],$data['sourceFrom'],$data['Visit_label']);

			$initial_check = $data['Name'] . ":" . $data['Visit_label'] . ':initial_check'; //create a unique variable name..
			$comment = $data['Name'] . ":" .  $data['Visit_label'] . ':Comment'; //create a unique variable name..
			$date = $data['Name'] . ":" . $data['Visit_label'] . ':date_flag';
			$percent_completed = $data['Name'] . ":" . $data['Visit_label'] . ':percent_completed';
			$Last_access = $data['Name'] . ":" . $data['Visit_label'] . ':Last_access';

			///create the quickform elements
			$this->form->addElement("select", $initial_check, 'initial check', array(''=>'',"1"=>'1- Validation/Completion',"2"=>'2- Statistical Verification', "3"=>'3- Finalization'));
			$this->form->addElement("textarea", $comment, 'Comment',array('rows' => 2, 'cols' => 20));//comment box
			$this->form->addElement("static", "instrument", $data['sourceFrom']);//comment box
			$this->form->addElement('date', $date, "Date of initial check", $dateOptions); //date drop down
			$this->form->addElement('hidden',$data['Name'], $data['Name']); //date drop down
			$this->form->addElement('static', $Last_access, 'DAte of Flag Change'); //Date of flag Change
			$this->form->addElement('static', $percent_completed, '% completed');//%completion

			//template data...
			$this->tpl_data['elements_list_names'][] = $data['Name'];//contains the list of data field names...
			$this->tpl_data['Visit_label_list'][] = $data['Visit_label'];//contains the visit_label for each element...
			$this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['sourcefield'] = $data['sourceField'];
			$this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['sourcefrom'] = $data['sourceFrom'];
			$this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['visit_label'] = $data['Name'] . "_" . $data['Visit_label'];
			$this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['Description'] =$data['description'];
			$this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['initial_check'] = $initial_check;
			$this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['Comment'] = $comment;
			$this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['date'] = $date;
			$this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['percent_completed'] = $percent_completed;
			$this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['Last_access'] = $Last_access;
			$this->tpl_data['elements_array'][$data['Name']][$data['Visit_label']]['Name'] = $data['Name'];

			if ($List_of_feedbacks !=null){
				$counter =0;
				foreach($List_of_feedbacks as $feedback){
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
 * _validate
 *
 * @param unknown_type $fields
 * @return unknown
 */
	function _validate($fields){
		$errors=array();
		global $DB;
		$is_error_set = false;
		$test_name = Utility::getTestNameUsingFullName($_REQUEST['instrument']);
		$array = $this->getIncompleteCandidates($test_name);
		foreach ($fields as $field=>$value){
			/*

			if (preg_match('/initial_check/',$field,$matches)){

			$name = substr($field, 0, -14); // returns "abcde"
			$DB->selectRow("select * from data_integrity_flag where Name = '$name'",$flag_info); //get the current data for the given NAME from the data_integrity_flag table

			$parameter_type_info =Utility::getSourcefields(null,null,$name);

			$field_name = $parameter_type_info['SourceField'];

			if ($value !=null){
			//if the flag '2' or '3' are selected
			if  ($value=='2') {
			if (($flag_info['initial_check'] ==null) || $flag_info['initial_check']!= '1'){
			$errors[$field]  .= "$field_name: The Vadition/Completion flag for field $field_name is not set yet <BR>";
			}
			}

			//if the flag '2' or '3' are selected
			if  ($value=='3') {
			if (($flag_info['initial_check'] ==null) || $flag_info['initial_check']!= '2'){
			$errors[$field]  .= "$field_name: The Statical Verification flag for field $field_name is not set yet<BR>";
			}
			}

			if ((is_array($array)) && count($array)>0){
			//if ($is_error_set == false){
			$errors[$field] .= "$field_name: All the instances of the instrument $test_name must be set to complete first (refer to Incomplete Candidate list)<BR>";
			//$is_error_set = true;
			//}
			}
			//if ($this->InstrumentInConflict($test_name)){
			if ($this->FieldInConflict($test_name,$field_name)){
			$errors[$field] .= "$field_name: There are unresolved conflicts for $field_name (refer to column Conflcit)<BR>";
			}

			if ($DB->selectOne("select count(*) from feedback_bvl_thread where FieldNAme = '$field_name' and Status!='Closed'")>0){
			$errors[$field] .= "$field_name: There are currently feedbacks for $field_name not yet closed (refer to Link to BVL feedback)<BR>";
			}
			}

			//value is null
			else{

			if ($flag_info['initial_check'] !=null){
			$errors[$field] .= "$field_name: A flag is already set for $field_name cannot be nulled <BR>";
			}

			}
			}*/

			if (preg_match('/date_flag/',$field,$matches)){
				if ($value !=null){
					// if not answered is not selected, time cannot be empty

					$field_name = substr($field,0,-10);

					if((($value['Y'] != "")||($value['M'] != "")||($value['d'] != ""))){
						if($value['Y'] == ""){
							$errors[$field] .= "$field_name: Please fill in the administration date for all 3 fields";
						} else if($value['M'] == ""){
							$errors[$field] .= "$field_name: Please fill in the administration date for all 3 fields";
						} else if($value['d'] == ""){
							$errors[$field] .= "$field_name: Please fill in the administration date for all 3 fields";
						}
					}

					elseif ((($value['Y'] != "")&&($value['M'] != "")&&($value['d'] != ""))){
						if(!(checkdate($value['M'], $value['d'], $value['Y']))){
							$errors[$field]= 'Date is not a valid date';
						}
					}
					else{}
				}
			}

			return count($errors) > 0 ? $errors : true;
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
	function getFeedbacks($field_name,$test_name=null,$visit_label=null){
		$DB =& Database::singleton();
		$feedback_status = $_REQUEST['feedback_status'];
		$query = "select f.test_name,s.visit_label,f.commentid,c.CandID,c.PSCID,s.id,bt.feedbackid,bt.Status from session s
		join flag f on (s.ID = f.SessionID)
		join feedback_bvl_thread bt on (bt.commentid = f.commentid)
		join candidate c on (c.Candid = s.Candid)
		join psc on (s.CenterID = psc.CenterID)
		where c.PSCID not like '%999-99999%' AND c.Active = 'Y' and	s.Active = 'Y' and 	bt.FieldName ='$field_name' and f.test_name = '$test_name' AND psc.Centerid!= '1'";

		if (isset($feedback_status) && $feedback_status!= "all"){
			$where .= " And bt.status = '$feedback_status'" ;
		}

		if (($visit_label !=null)&&($visit_label!='All Visits')){
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

	function AddWhere($Column, $Filter) {
		if(!empty($_REQUEST[$Filter]) && $_REQUEST[$Filter] !=='All Fields' && (strtolower($_REQUEST[$Filter]) !=='any') && ($_REQUEST[$Filter] !=='All Visits') && $_REQUEST[$Filter] !=='all_flags')  {
			global $DB;

			if ($Filter == 'instrument'){
				$test_name = Utility::getTestNameUsingFullName($_REQUEST[$Filter]); //converts the full_name into the test_name
				return " AND $Column LIKE " . $DB->quote($test_name);
			}
			if ($_REQUEST[$Filter] == 'not_sent_to_dcc'){
				return " AND $Column Not LIKE '%Approval%'";
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
	function InstrumentInConflict($test_name){
		global $DB;
		$conflicts = array();

		//if test_name display exists
		if (Utility::ColumnExists($test_name , 'Test_name_display')){
			$query = "SELECT distinct s.CandID,ca.PSCID, c.FieldName,c.TableName,t.test_name_display,s.visit_label FROM conflicts_unresolved c
		LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
		LEFT JOIN session s ON (f.SessionID=s.ID)
		LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
		JOIN test_battery t on (t.test_name = f.test_name)
		JOIN psc on (s.CenterID = psc.CenterID)
		WHERE t.visit_label = s.Visit_label and TableName LIKE '$test_name%' and ca.PSCID not like '%999-99999%' AND ca.Active = 'Y' and s.Active = 'Y' AND psc.Centerid!= '1'";

		}
		else{
			$query = "SELECT distinct s.CandID,ca.PSCID, c.FieldName,c.TableName,t.full_name as test_name_display,s.visit_label FROM conflicts_unresolved c
		LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
		LEFT JOIN session s ON (f.SessionID=s.ID)
		LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
		JOIN test_names t on (t.test_name = f.test_name)
	    JOIN psc on (s.CenterID = psc.CenterID)
		WHERE TableName LIKE '$test_name%' and ca.PSCID not like '%999-99999%' AND ca.Active = 'Y' and s.Active = 'Y' AND psc.Centerid!= '1'";
			$DB->select($query,$conflicts);
			return $conflicts;
		}
	}



	function FieldInConflict($test_name,$field_name){
		//Do for each instrument....one shot....
		//And then extract the specific info through template..
		global $DB;
		$conflicts = array();

		if (Utility::ColumnExists($test_name , 'Test_name_display')){

			$query = "SELECT distinct s.CandID, ca.PSCID, c.FieldName,c.TableName,t.test_name_display,s.visit_label FROM conflicts_unresolved c
		LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
		LEFT JOIN session s ON (f.SessionID=s.ID)
		LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
		JOIN test_battery t on (t.test_name = f.test_name)
		JOIN psc on (s.CenterID = psc.CenterID)
		WHERE t.visit_label = s.Visit_label and TableName LIKE '$test_name%' and c.FieldName = '$field_name' and ca.PSCID not like '%999-99999%' AND ca.Active = 'Y' and s.Active = 'Y' AND psc.Centerid!= '1'";
		}

		else{
			$query = "SELECT distinct s.CandID, ca.PSCID, c.FieldName,c.TableName,t.full_name as test_name_display,s.visit_label FROM conflicts_unresolved c
		LEFT JOIN flag f ON (c.CommentId1=f.CommentID)
		LEFT JOIN session s ON (f.SessionID=s.ID)
		LEFT JOIN candidate ca ON (ca.CandID=s.CandID)
		JOIN psc on (s.CenterID = psc.CenterID)
		Join test_names t on (t.test_name = f.test_name)
		WHERE TableName LIKE '$test_name%' and c.FieldName = '$field_name' and ca.PSCID not like '%999-99999%' AND ca.Active = 'Y' and s.Active = 'Y' AND psc.Centerid!= '1'";
		}

		$DB->select($query,$conflicts);
		return $conflicts;
	}

	
	function getIncompleteCandidates($test_name,$visit_label=null){
		global $DB;

		$query = "select distinct s.ID,s.visit_label, c.PSCID,s.candid, f.test_name,f.data_entry,f.commentid from session s
		join flag f on (f.sessionid = s.id) 
		join candidate c on (c.candid = s.candid)
		join psc on (s.CenterID = psc.CenterID)	";

		$where = " WHERE s.Active = 'Y' And c.Active = 'Y' AND f.test_name LIKE '$test_name' and coalesce(f.data_entry,'In Progress') = 'In Progress' AND psc.Centerid!= '1' ";

		//filter for visit
		if (($visit_label !=null)&&($visit_label!='All Visits')){
			$where.= " And s.visit_label = '$visit_label'";
		}
		$order_by = " order by f.commentid ";

		$query = $query . $where . $order_by;
		$DB->select($query,$results);
		return $results;
	}


	function getInstrumentCount($test_name,$visit_label=null){
		global $DB;


		$query = "SELECT count(*) FROM $test_name as i
		join flag f on (f.CommentID=i.CommentID)
		join session s on (s.ID = f.SessionID)
		join candidate c on (c.CandID = s.CandID)
		join psc on (s.CenterID = psc.CenterID)	";

		$where =" WHERE s.Active='Y'
                AND s.Current_stage <> 'Recycling Bin'
                AND f.CommentID not like '%DDE%'
                AND psc.Centerid!= '1'";

		if (($visit_label !=null)&&($visit_label!='All Visits')){
			$where.= " And s.Visit_label = '$visit_label'";
		}
		$query.= $where;
		$count =$DB->selectOne($query);
		return $count;
	}


	function getCompleteInstrumentCount($test_name,$visit_label=null){
		global $DB;

		$query = "SELECT count(*) FROM $test_name as i
		
		join flag f on (f.CommentID=i.CommentID)
		join session s on (s.ID = f.SessionID)
		join candidate c on (c.CandID = s.CandID)
		join psc on (s.CenterID = psc.CenterID)	";

		$where =" WHERE s.Active='Y'
		AND c.Active='Y'
		AND s.Current_stage <> 'Recycling Bin'
		AND f.CommentID not like '%DDE%'
		AND f.Administration <> 'None'
		AND f.Data_entry = 'Complete'
		AND psc.Centerid!= '1'";

		if (($visit_label !=null)&&($visit_label!='All Visits')){
			$where.= " And s.Visit_label = '$visit_label'";
		}
		$query.= $where;

		$count =$DB->selectOne($query);
		return $count;
	}


	// }}}
	// {{{ _getQuickformDate()
	/**
     * Convert a database date or timestamp into a QuickForm acceptable date or time
     *
     * @param string  $databaseValue        the date or timestamp from the database
     * @return array   $formDateValue       the quickform date/timestamp array
     * @access private
     */

	function _getQuickformDate($databaseValue/*,$date_reference*/){
		if(!empty($databaseValue)){
			if(strstr($databaseValue,":")){
				$formDateValue=explode(":",$databaseValue);
				$formDateValue=array("H"=>$formDateValue[0],"i"=>$formDateValue[1]);  //handle time
			} else {
				// split mysql Date_taken field into array
				$formDateValue = explode('-', $databaseValue);
				$formDateValue = array('Y'=>$formDateValue[0], 'M'=>$formDateValue[1], 'd'=>$formDateValue[2]);  //handle date
			}
		}
		return $formDateValue;
	}
	/**
 * _getPercentCompleted($instrument)
 *
 * Returns the percent completed for the given instrument
 * @param unknown_type $instrument
 * @return unknown
 */

	function _getPercentCompleted($instrument,$visit_label=null){
		$percet_completed =0;
		$total_count  = $this->getInstrumentCount($instrument,$visit_label);

		$complete_count = $this->getCompleteInstrumentCount($instrument,$visit_label);
		if ($complete_count !=0){
			$percet_completed = round($complete_count / $total_count , 2) * 100 ;
		}
		
		return $percet_completed;
	}

	
	/**
    * **
    * Extract value from the data_integrity flag
    */
	function getData($name,$visit_label,$field){
		global $DB;
		$query = "select $field from data_integrity_flag where Name = '$name' and Visit_label = '$visit_label'";
		$field_value =$DB->selectOne($query);
		return $field_value;

	}
}
?>
