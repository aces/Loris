<?php
print "jnere";
class NDB_BVL_Instrument_ACEFamilyMedicalHistory extends NDB_BVL_Instrument
{
   var $indent = "&nbsp;&nbsp;&nbsp;&nbsp;";

 function setup($commentID, $page){

        $this->formType="XIN";
        $this->form = new HTML_Quickform('test_form');
        $this->page = $page;            // page label (number or
        // string - used by
        // user-defined child classes)

        // set the object properties
        $this->testName = "ACEFamilyMedicalHistory";           // test_names.Test_name
        $this->table = 'ACEFamilyMedicalHistory';             // name of table containing

        // data keyed by commentID
        $this->commentID = $commentID;

        //The array of dates/timestamps to convert to database dates/timestamps
        //Any HTML_Quickform date elements must be listed here
        //rathi updatethis

        $this->_requiredElements = array('Date_taken', 'Examiner','day1_child_sick');

        $config =& NDB_Config::singleton();
        $this->dateOptions = array(
        'language' => 'en',
        'format'   => 'YMd',
        'minYear'  => $config->getSetting('startYear'),
        'maxYear'  => $config->getSetting('endYear'),
        'addEmptyOption' => true,
        'emptyOptionValue' => null
        );

        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError ("Could not connect to database: ".$db->getMessage());
        }
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
        if(preg_match("/ACEFamilyMedicalHistory(_page[0-9]+)/",$this->page,$matches)){
            $this->_page($matches[1]);
            //call_user_method($matches[1], $this);
        } else {
            $this->_main();
        }

        //Defines the call back function for HTML Quickform to use when validating the form.
        $this->form->addFormRule(array(&$this,'XINValidate'));
    }
   /**
     * generates the main page of the form.
     *
     * @return void
     * @access private
     *
     */
    function _main(){
        $this->addHeader("ACE Family Medical History");
        $table_heading = array('mother'=>'Biological Mother', 'father'=>'Biological Father', 'sibling1'=>'Sibling 1', 'sibling2'=>'Sibling 2',
                       'sibling3'=>'Sibling 3','sibling4'=>'Sibling 4','sibling5'=>'Sibling 5');
        $questions = array('header'=>null,'relation'=>'Specify Relation','currentage'=>'Current age(months)','gender'=>'Sex: Male(M) or Female(F)',
                           'last_grade_completed'=>'Last Grade Completed','asd'=>'1. Austism Spectrum Disoder','autistic_disorder'=>'2. Autistic Disorder',
                           'asperger_syndrome'=>'3. Asperger Syndrome','rett_syndrome'=>'4. Rett Syndrome','pdd_nos'=>'5. PDD-NOS','history_speechdelay'=>'6. History Speech Delay',
                           'history_development_delay'=>'7. History Development Delay','history_learndisability'=>'8. History Learning Disability',
                           'seizure_epilepsy'=>'9. Seizure disorder/Epilepsy','cerebral_palsy'=>'10. Celebral Palsy','down_syndrome'=>'11. Down Syndrome',
                           'mental_retardation'=>'12. Intellectual Disability','tuberoussclerosis'=>'13. Tuber Sclerosis','fragilex'=>'14. FragileX', 
                           'neurofibomarosis'=>'15. Neurofibomarosis', 'congenitalblindness'=>'16. Congenital blindness','deafness'=>'17. Hearing impairement',
                           'hearingcorrect_aid'=>$this->indent.'a. Hearing corrected','bipolar'=>'18. Bipolar','depression'=>'19. Depression',
                           'anxiety'=>'20. Anxiety','ocd'=>'21. Obsessive Compulsive','schizophernai'=>'22. Schizophernia','selfinjuring'=>'23. Self injuring',
                           'adhd'=>'24. ADHD','eating_disorder'=>'25. Eating disorder','disrupted_sleeppatterns'=>'26. Disrupted sleep patterns', 
                            'tournette'=>'27. Tournette Syndrome');
        $options = array(''=>'','yes'=>'Yes','no'=>'No');
        $relation = array(""=>null,'full_sibling'=>'Full','maternal_half'=>'Maternal Half','paternal_half'=>'Paternal Half');
        $gender = array(''=>null,'male'=>'Male','female'=>'Female');
        foreach($questions as $key=>$val){
            $groupname = $key."_group";
           
	    foreach($table_heading as $k=>$v) {
		    if($key == 'header') {
			    $group[] =& $this->form->createElement("static",null,null,$v);             
		    } else {     
			    $field = $key."_".$k;
                            if($key == 'currentage') {
			        $group[] =& $this->form->createElement("text",$field,null);
                            } else if ($key == 'relation') {
                                if($k == 'mother' || $k == 'father') {
                                   $group[] =& $this->form->createElement("static",null,null, null);
                                 } else {
                                    $group[] =& $this->form->createElement("select",$field,null,$relation);
                                  }
                            } else if ($key == 'last_grade_completed') { 
                               if($k == 'mother' || $k == 'father') {
                                    $group[] =& $this->form->createElement("text",$field,null);
                                 } else {
                                    $group[] =& $this->form->createElement("static",null,null, null);
                                  }

                            } else {
                                if($key == 'gender') {
                                     $group[] =& $this->form->createElement("select",$field,null,$gender);
                                } else {
			             $group[] =& $this->form->createElement("select",$field,null,$options);
                                }
                           }
		    }
	    }
            $this->form->addGroup($group, $groupname, $val, $this->_GUIDelimiter, false);
            unset($group);

        }        

    }

}
?>
