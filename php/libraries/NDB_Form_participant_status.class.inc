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
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // check that the $candID is passed b/c the profile needs to be opened
        if ($this->identifier != $_REQUEST['candID']) {
            return PEAR::raiseError(
                "NDB_Form_participant_status::_access: " 
                . "Candidate Profile Error ($this->identifier)"
            );
        }
        // check user permissions
        return ($user->hasPermission('data_entry'));
    }

    function _getDefaults()
    {

        $DB =& Database::singleton();
        $defaults = $DB->pselectRow(
            "SELECT * FROM participant_status WHERE CandID = :cid", 
            array('cid'=>$this->identifier)
        );
        return $defaults;
    }

    function _process($values)
    {
        if (!is_array($values) || count($values) ==0) {
            return true;
        }
        $DB =& Database::singleton();

        $values['CandID'] = $this->identifier;

        if (!(is_null($_SESSION['State']))) {
            $currentUser =& User::singleton($_SESSION['State']->getUsername());
            $id = $currentUser->getData("UserID");
            $values['entry_staff'] = $id;
        }


        // save the values
        //if it exists update it
        $ParticipantCount = $DB->pselectOne(
            "SELECT COUNT(*) FROM participant_status WHERE CandID = :cid", 
            array("cid"=>$values['CandID'])
        );
        if ($ParticipantCount > 0) {
            $success = $DB->update("participant_status", 
                $values,
                array("CandID"=>$values['CandID'])
            );
        } else {
        //insert it
            $success = $DB->insert("participant_status",$values);
        }

        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "NDB_Form_participant_status::_process: ".$success->getMessage()
            );
        }

        $this->tpl_data['success'] = true;
        $this->form->freeze();
    }

    function participant_status()
    {

        $this->tpl_data['candID'] = $this->identifier;

        $config =& NDB_Config::singleton();
        $DB =& Database::singleton();

        //header
        $this->form->addElement('header', null,"PARTICIPANT STATUS FORM");

        //entry staff info
        $this->form->addElement('static', 'entry_staff', 'Data Entry Staff');
        $this->tpl_data['element_list'][] = "entry_staff";

        $this->form->addElement('static', 'data_entry_date', 'Date of Data entry');
        $this->tpl_data['element_list'][] = "data_entry_date";
        $this->form->addElement('static', null, "<br />");

        $pscid = $DB->pselectone(
            'SELECT PSCID FROM candidate where CandID = :candid',
            array('candid'=>$this->identifier)
        );
        $this->form->addElement ('static', 'pscid', 'PSCID');
        $this->tpl_data['element_list'][] = "pscid";
        $this->tpl_data['pscid'] = $pscid;

        // Selections array (standard template for questions selections)
        $noYes = array(null=>'', "0_no"=>"0: No", "1_yes"=>"1: Yes");
        $notAns4 = array(
            "dnk"            => "Don't know", 
            "not_applicable" => "Not applicable",
            "refusal"        => "Refusal",
            "not_answered"   => "Not Answered"
        );

        $this->form->addElement('static', null, '<br /><br />');

        $options = $this->getPartcipant_status_options();

        $this->form->addElement(
            'select', 
            'participant_status', 
            "participant Status", 
            array('') + $options + $notAns4
        );
        $this->tpl_data['element_list'][] = "participant_status";

        $this->form->addElement('static', null, '<br /><br />');


        //ineligible text area
        $group[] = $this->form->createElement(
            'textarea', 'ineligible_others_specify'
        );
        $group[] = $this->form->createElement(
            "select",
            "ineligible_others_specify_status", 
            null, 
            array(null => null) + $notAns4
        );
        $this->form->addGroup(
            $group, 
            'ineligible_others_specify_group', 
            $this->indent . 'Please specify other reason for ineligible ', 
            null, 
            false
        );
        $this->tpl_data['element_list'][] = "ineligible_others_specify_group";
        unset($group);
        $this->form->addElement('static', null, '<br /><br />');


        //drop out
        $options = array(
            null                     => '', 
            "1_voluntary_withdrawal" => "1. Voluntary withdrawal", 
            "2_lost_follow_up"       => "2. Lost to follow up", 
            "3_others"               => "3. Others"
        );
        $this->form->addElement(
            'select', 
            'drop_out_reasons', 
            "If drop out, provide the reason", 
            $options
        );
        $this->tpl_data['element_list'][] = "drop_out_reasons";

        $group[] = $this->form->createElement(
            'textarea', 'drop_out_reasons_others_specify'
        );
        $group[] = $this->form->createElement(
            "select",
            "drop_out_reasons_others_specify_status",
            null,
            array(null => null) + $notAns4
        );
        $this->form->addGroup(
            $group,
            'drop_out_reasons_others_specify_group',
            $this->indent . 'Please specify other reason for drop out ',
            null, false
        );
        $this->tpl_data['element_list'][] = "drop_out_reasons_others_specify_group";
        unset($group);


        //others text area
        $group[] = $this->form->createElement('textarea', 'other_reasons');
        $group[] = $this->form->createElement(
            "select", "other_reasons_status", null, 
            array(null => null) + $notAns4
        );
        $this->form->addGroup(
            $group, 
            'other_reasons_group', 'If Others, specify the reason', 
            null, false
        );
        $this->tpl_data['element_list'][] = "other_reasons_group";
        unset($group);

        $this->form->addElement('static', null, '<br /><br />');

        $this->form->addElement('static', null, '<br/><br />');
        $this->form->addFormRule(array(&$this,'_validate'));
    }


    // this function is for miscellaneous validation (mainly dependency)

    function _validate($fields){


        $errors=array();
        $options = $this->getPartcipant_status_options();
        $date_taken_answered = $fields['Date_taken'];
        $date_taken_notanswered = $fields['Date_taken_status'];

        ////////////////////////////////
        ///////active or death is answered///////////////////
        ///////////////////////////////////
        if ((($fields['participant_status'])==0) 
            || empty($fields['participant_status'])
        ) {
            $errors['participant_status'] .= "Is required";
        }

        if ((($options[$fields['participant_status']])=='active') 
            || (($options[$fields['participant_status']])=='death')
        ) {

            //Others must be empty
            if ((!empty($fields['other_reasons']))
                || (!empty($fields['other_reasons_status']))) {
                $errors['other_reasons_group'] .= "Must be blank";
            }
            if ((!empty($fields['drop_out_reasons'])) 
                || (!empty($fields['drop_out_reasons_others_specify']))
                || (!empty($fields['drop_out_reasons_others_specify_status']))) {
                $errors['drop_out_reasons_others_specify_group'] .= "Must be blank";
            }
            if ((!empty($fields['ineligible_others_specify'])) 
                || (!empty($fields['ineligible_others_specify_status']))
            ) {
                $errors['ineligible_others_specify_group'] .= "Must be blank";
            }

        }
        ////////////////////////////////
        ///ineglible
        ////////////////////////////////
        if (($options[$fields['participant_status']])=='ineligible') {
            if (empty($fields['ineligible_others_specify'])) {
                $errors['ineligible_others_specify_group'] .= "required";
            }
            //Other fields must be empty
            if ((!empty($fields['other_reasons']))
                || (!empty($fields['other_reasons_status']))
            ) {
                $errors['other_reasons_group'] .= "Must be blank";
            }
            if ((!empty($fields['drop_out_reasons'])) 
                || (!empty($fields['drop_out_reasons_others_specify']))
                || (!empty($fields['drop_out_reasons_others_specify_status']))
            ) {
                $errors['drop_out_reasons_others_specify_group'] .= "Must be blank";
            }
        }

        ////////////////////////////////
        //if dropout is answered
        ////////////////////////////////
        if (($options[$fields['participant_status']])=='dropout') {
            //dropout is required
            if (empty($fields['drop_out_reasons_others_specify'])) {
                $errors['drop_out_reasons_others_specify_group'] .= "required";
            }

            //Other fields must be empty
            if ((!empty($fields['other_reasons']))
                || (!empty($fields['other_reasons_status']))
            ) {
                $errors['other_reasons_group'] .= "Must be blank";
            }

            if ((!empty($fields['ineligible_others_specify'])) 
                || (!empty($fields['ineligible_others_specify_status']))
            ) {
                $errors['ineligible_others_specify_group'] .= "Must be blank";
            }
        }

        ////////////////////////////////
        //if others is answered
        ////////////////////////////////
        if (($options[$fields['participant_status']])=='others') {
            //others is required
            if ((empty($fields['other_reasons'])) 
                && (empty($fields['other_reasons_group_status']))
            ) {
                $errors['other_reasons_group'] .= "required";
            }

            //Other fields must be empty
            if ((!empty($fields['drop_out_reasons'])) 
                || (!empty($fields['drop_out_reasons_others_specify']))
                || (!empty($fields['drop_out_reasons_others_specify_status']))
            ) {
                $errors['drop_out_reasons_others_specify_group'] .= "Must be blank";
            }

            if ((!empty($fields['ineligible_others_specify'])) 
                || (!empty($fields['ineligible_others_specify_status']))
            ) {
                $errors['ineligible_others_specify_group'] .= "Must be blank";
            }
        }
        return count( $errors ) > 0 ? $errors : true;
    }
/**
 * Gets the participant_status options from participant_status_options
 *getPartcipant_status_options()
 * @return unknown
 */
    function getPartcipant_status_options() {
        $DB =& Database::singleton();
        $options = $DB->pselect(
            "SELECT ID,Description FROM participant_status_options",
            array()
        );
        $option_array = array();
        foreach ($options as $option) {
            $option_array[$option['ID']] = $option['Description'];
        }
        return $option_array;
    }
}
?>
