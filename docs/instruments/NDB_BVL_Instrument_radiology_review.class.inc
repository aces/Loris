<?php
class NDB_BVL_Instrument_radiology_review extends NDB_BVL_Instrument
{
    var $ValidityEnabled = false;
    var $ValidityRequired = false;

    /**
    * sets up basic data, such as the HTML_Quickform object, and so on.
    *
    * @param string $commentID  the CommentID identifying the data to load
    * @param string $page       if a multipage form, the page to show
    * @return void
    * @access public
    */
    function setup($commentID = NULL, $page = NULL){
        $this->formType="XIN";
        $this->form = new LorisForm('test_form');
        $this->page = $page;            // page label (number or
                                        // string - used by
                                        // user-defined child classes)

        // set the object properties
        $this->testName = "radiology_review";           // test_names.Test_name
        $this->table = 'radiology_review';             // name of table containing


        // data keyed by commentID
        $this->commentID = $commentID;

        //$this->_requiredElements = array('Date_taken', 'Examiner');
        
        $this->dateTimeFields=array("Date_taken");
        
        // setup the form
        $this->_setupForm();
    }

    /**
    * method to build the HTML_Quickform object into a paged form
    *
    * @return void
    * @access private
    */
    function _setupForm(){

        //Defines the call back function for HTML Quickform to use when validating the form.
        $this->form->addFormRule(array(&$this,'XINValidate'));

        // display test name
        $this->form->addElement('header', 'instrument_title', "Radiology Review Form");

        // automatically adds examiner & date of administration
        $this->_addMetadataFields();

        $yes_no_option= array(NULL=>"", "no"=>"No", "yes"=>"Yes", "not_answered"=>"Not Answered");
    	$normal_option= array(NULL=>"", "normal"=>"Normal","abnormal"=>"Abnormal", "atypical"=>"Atypical", "not_answered"=>"Not Answered");
    	$exclusionaryOrNot = array(NULL=>"", "exclusionary"=>"Exclusionary", "non_exclusionary"=>"Non-Exclusionary", "not_answered"=>"Not Answered");

        $this->form->addElement('header', null, '3D T1 MP-Rage');
        $this->form->addElement('select', 'Scan_done', 'Was an MRI performed?', $yes_no_option);
       	$this->form->addElement('static', null, 'If Yes?'); 

       	//These date fields were first not added to $this->dateTimeFields so they weren't saving.
//      $this->form->addElement('date', 'MRI_date', 'Date of MRI acquisition');
//	    $this->form->addElement('date', 'Review_date', 'Date of local radiology review');

        $this->addDateElement('MRI', 'Date of MRI acquisition');
        $this->XINRegisterRule("MRI_date", array("Scan_done{@}=={@}yes"), "Please enter the scan information", "MRI_date_group");
        $this->addDateElement('Review', 'Date of local radiology review');
        $this->XINRegisterRule("Review_date", array("Scan_done{@}=={@}yes"), "Please enter the scan information", "Review_date_group");

        $this->form->addElement('select', 'Review_results', 'Results of local radiology review?', $normal_option);
        $this->XINRegisterRule("Review_results", array("Scan_done{@}=={@}yes"), "Please enter the scan information");

        $this->form->addElement('select', 'abnormal_atypical_exclusionary', $this->indent . "If the results are ABNORMAL or ATYPICAL:", $exclusionaryOrNot);
        $this->XINRegisterRule('abnormal_atypical_exclusionary', array('Review_results{@}=={@}abnormal|atypical'), "Please indicate if the Abnormal or Atypical review is Exclusionary or Not.");
        
       	$this->form->addElement('static', null, $this->indent . $this->indent . 'If Abnormal or Atypical, describe incidental finding(s)'); 
//        $this->form->addElement('textarea', 'Incidental_findings', 'Description of incidental findings:');
        $this->addTextAreaElement('Incidental_findings', $this->indent . $this->indent . 'Description of incidental findings:', array("Review_results{@}=={@}abnormal"), "Please describe the abnormality");
    } // End Setup form

/**
    * adds metadata fields (such as Examiner and Date_taken) to the
    * current form
    *
    * @return void
    * @access private
    */
    function _addMetadataFields()
    {
        $config =& NDB_Config::singleton();
        $this->dateOptions = array(
        'language' => 'en',
        'format'   => 'YMd',
        'minYear'  => $config->getSetting('startYear'),
        'maxYear'  => $config->getSetting('endYear'),
        'addEmptyOption' => true,
        'emptyOptionValue' => null
        );

        $this->form->addElement('date', 'Date_taken', 'Date of Administration', $this->dateOptions);

        $examiners = $this->_getExaminerNames();
        $this->form->addElement('select', 'Examiner', 'Radiologist', $examiners);

     	$this->form->addRule('Date_taken', 'Date of Administration is required', 'required');

        $this->form->addRule('Examiner', 'Examiner is required', 'required');
    }
}
?>
