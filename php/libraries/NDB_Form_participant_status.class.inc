<?php
require_once "NDB_Form.class.inc";

/**
 * The forms for the new profile menu
 * @package main
 */
class NDB_Form_participant_status extends NDB_Form
{
	var $indent = "&nbsp;&nbsp;&nbsp;&nbsp;";

	function _hasAccess()
	{
		// create user object
		$user =& User::singleton();
		if(PEAR::isError($user)) {
			return PEAR::raiseError("User Error: ".$user->getMessage());
		}

		// check that the $candID is passed b/c the profile needs to be opened
		if ($this->identifier != $_REQUEST['candID']) {
			return PEAR::raiseError("NDB_Form_participant_status::_access: Candidate Profile Error (".$_REQUEST['candID']."): ");
		}
		// check user permissions
		return ($user->hasPermission('data_entry'));
	}

	function _getDefaults()
	{

		$DB =& Database::singleton();
		$defaults = $DB->pselectRow("SELECT * FROM participant_status WHERE CandID = :cid", array('cid'=>$this->tpl_data['candID']));
		return $defaults;
	}

	function _process($values)
	{
		if(!is_array($values) || count($values) ==0) {
			return true;
		}
		$DB =& Database::singleton();

		$values['CandID'] = $this->identifier;

		if (!(is_null($_SESSION['State']))){
			$currentUser =& User::singleton($_SESSION['State']->getUsername());
			$id = $currentUser->getData("UserID");
			$values['entry_staff'] = $id;

		}

		// save the values
		$success = $DB->update("participant_status", $values,array("CandID"=>$values['CandID']));
		if(PEAR::isError($success)) {
			return PEAR::raiseError("NDB_Form_participant_status::_process: ".$success->getMessage());
		}
		$this->tpl_data['success'] = true;
		$this->form->freeze();
	}

	function participant_status()
	{
		$this->tpl_data['candID'] = $_REQUEST['candID'];

		$config =& NDB_Config::singleton();
		$DB =& Database::singleton();
		
		//header
		$this->form->addElement('header', 'instrument_title', "<p style=\"margin-top:-3px; font-size:12px;\">PARTICIPANT STATUS FORM</p>");

		//entry staff info
		$this->form->addElement('static', 'entry_staff', 'Data Entry Staff');
		$this->tpl_data['element_list'][] = "entry_staff";

		$this->form->addElement('static', 'data_entry_date', 'Date of Data entry');
		$this->tpl_data['element_list'][] = "data_entry_date";
		$this->form->addElement('static', null, "<br />");
		
		$ssid = $DB->pselectone('SELECT PSCID FROM candidate where CandID = :canid',array('candid'=>$this->identifier));
		$this->form->addElement ('static', 'ssid', 'SSID');
		$this->tpl_data['element_list'][] = "ssid";
		$this->tpl_data['ssid'] = $ssid;

		// Selections array (standard template for questions selections)
		$noYes = array(null=>'', "0_no"=>"0: No", "1_yes"=>"1: Yes");
		$notAns4 = array("dnk"=>"Don't know", "not_applicable"=>"Not applicable","refusal"=>"Refusal", "not_answered"=>"Not Answered");

		$this->form->addElement('static', null, '<br /><br />');

		$options = array(null=>"","active"=>"1. Active", "ineligible"=>"2. Ineligible",  "dropout"=>"3. Dropout","death"=>"4. Death","others"=>"5. Others");
		$this->form->addElement('select', 'qn_2_participant_status', "participant Status", $options + $notAns4);
		$this->tpl_data['element_list'][] = "qn_2_participant_status";

		$this->form->addElement('static', null, '<br /><br />');

		
		//ineligible text area
		$group[] = $this->form->createElement('textarea', 'qn_4_others_specify_text');
		$group[] = $this->form->createElement("select","qn_4_others_specify_text_not_answered", null, array(null => null) + $notAns4);
		$this->form->addGroup($group, 'qn_4_others_specify_text_group', $this->indent . 'Please specify other reason for ineligible ', null, false);
		$this->tpl_data['element_list'][] = "qn_4_others_specify_text_group";
		unset($group);
		$this->form->addElement('static', null, '<br /><br />');


		$options = array(null=>'', "1_voluntary_withdrawal"=>"1. Voluntary withdrawal", "2_lost_follow_up"=>"2. Lost to follow up", "3_others"=>"3. Others");
		$this->form->addElement('select', 'qn_5_drop_out_reasons', "If drop out, provide the reason", $options);
		$this->tpl_data['element_list'][] = "qn_5_drop_out_reasons";

		$group[] = $this->form->createElement('textarea', 'qn_5_others_specify_text');
		$group[] = $this->form->createElement("select","qn_5_others_specify_text_not_answered", null, array(null => null) + $notAns4);
		$this->form->addGroup($group, 'qn_5_others_specify_text_group', $this->indent .'Please specify other reason for drop out ', null, false);
		$this->tpl_data['element_list'][] = "qn_5_others_specify_text_group";
		unset($group);



		//others text area
		$group[] = $this->form->createElement('textarea', 'other_reasons');
		$group[] = $this->form->createElement("select","other_reasons_not_answered", null, array(null => null) + $notAns4);
		$this->form->addGroup($group, 'other_reasons_group', 'If Others, specify the reason', null, false);
		$this->tpl_data['element_list'][] = "other_reasons_group";
		unset($group);

		$this->form->addElement('static', null, '<br /><br />');

		// Comments
		$group[] = $this->form->createElement('textarea', 'comments');
		$this->form->addGroup($group, 'comments_group', 'General Comment if any', null, false);
		$this->tpl_data['element_list'][] = "comments_group";
		unset($group);

		$this->form->addElement('static', null, '<br/><br />');
		$this->form->addFormRule(array(&$this,'_validate'));
	}

	
	// this function is for miscellaneous validation (mainly dependency)

	function _validate($fields){

		$errors=array();
		$date_taken_answered = $fields['Date_taken'];
		$date_taken_notanswered = $fields['Date_taken_not_answered'];


		if(empty($fields['qn_1_cohort'])) {
			$errors['qn_1_cohort']  .= 'Required';
		}

		if (($fields['qn_2_participant_status'])=='ineligible'){
			if ($fields['qn_5_drop_out_reasons'] !==''){
				$errors['qn_5_drop_out_reasons'] .= "Must be blank";
			}
			//if others is not empty
			if (($fields['other_reasons'] !=='')||($fields['other_reasons_not_answered'] !=='')){
				$errors['other_reasons_group'] .= "Must be blank";
			}
		}

		//if dropout is answered
		if (($fields['qn_2_participant_status'])=='dropout'){
			//dropout is required
			if (empty($fields['qn_5_drop_out_reasons'])){
				$errors['qn_5_drop_out_reasons'] .= "required";
			}
			//if others is not empty
			if (($fields['other_reasons'] !=='')||($fields['other_reasons_not_answered'] !=='')){
				$errors['other_reasons_group'] .= "Must be blank";
			}
		}

		//if death is answered
		if (($fields['qn_2_participant_status'])=='death'){
			
			//if others is not empty
			if (($fields['other_reasons'] !=='')||($fields['other_reasons_not_answered'] !=='')){
				$errors['other_reasons_group'] .= "Must be blank";
			}

			//if dropout is not empty
			if (($fields['qn_5_drop_out_reasons'] !=='')){
				$errors['qn_5_drop_out_reasons'] .= "Must be blank";
			}
		}

		//if others is answered
		if (($fields['qn_2_participant_status'])=='others'){
			//others is required
			if ((empty($fields['other_reasons'])) && (empty($fields['other_reasons_group_not_answered']))) {
				$errors['other_reasons_group'] .= "required";
			}
	
			//if dropout is not empty
			if (($fields['qn_5_drop_out_reasons'] !=='')){
				$errors['qn_5_drop_out_reasons'] .= "Must be blank";
			}
		}


		if(empty($fields['qn_2_participant_status'])) {
			$errors['qn_2_participant_status'] .= 'Required';
		}

		if($fields['qn_5_drop_out_reasons'] == '3_others') {
			if($fields['qn_5_others_specify_text'] == NULL && empty($fields['qn_5_others_specify_text_not_answered'])) {
				$errors['qn_5_others_specify_text_group'] .= 'Required if  3: Others';
			}
		}

		return count( $errors ) > 0 ? $errors : true;
	}
}
?>
