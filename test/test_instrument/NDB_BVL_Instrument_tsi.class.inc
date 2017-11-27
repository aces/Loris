<?php

class NDB_BVL_Instrument_tsi extends NDB_BVL_Instrument
{
    var $ValidityEnabled = false;
    var $ValidityRequired = false;

	var $yesNo = array(null=>"", "yes"=>"Yes", "no"=>"No", "not_answered"=>"Not Answered");

	var $education_choices = array(null => "", "not_answered" => "Not Answered", "j_high" => "Junior High", "some_hs" => "Some Highschool", "some_college_12yr_degree" => "Some College 12yr Degree", "college_degree" => "College Degree", "some_grad_level" => "Some Graduate Level", "grad_degree" => "Graduate Degree");
	
	/*
	INSERT INTO test_names VALUES ('', 'tsi', 'Telephone Screening Interview', '0', '1');

	INSERT INTO instrument_subtests VALUES('', 'tsi', 'tsi_page1', 'Exclusionary Factors', 1);
	INSERT INTO instrument_subtests VALUES('', 'tsi', 'tsi_page2', 'Medical History or MRI/Sedation', 2);
	INSERT INTO instrument_subtests VALUES('', 'tsi', 'tsi_page3', 'Medical Records / Research Staff', 3);

	INSERT INTO test_battery VALUES ('', 'tsi', '150', '210', 'Y', 'Screening', '1');
	INSERT INTO test_battery VALUES ('', 'tsi', '300', '420', 'Y', 'Screening', '2');
	INSERT INTO test_battery VALUES ('', 'tsi', '150', '420', 'Y', 'Screening', '3');
	
	ALTER TABLE tsi ADD contact_date date;	
	ALTER TABLE tsi ADD contact_date_status enum('not_answered');
	
	ALTER TABLE tsi ADD contacted_by varchar(255);
	
	ALTER TABLE tsi ADD complications_birth enum('yes','no','not_answered');
	
	ALTER TABLE tsi ADD exc_inc_subject_meets_criteria enum('yes','no','not_answered');      
	
	*/

	/**
	 * Array of column names to be ignored by the double data entry conflict detector.
	 */
	/**
	 * sets up basic data, such as the HTML_Quickform object, and so on.
	 *
	 * @param string $commentID  the CommentID identifying the data to load
	 * @param string $page       if a multipage form, the page to show
	 * @return void
	 * @access public
	 */
	function setup($commentID, $page){
		$this->formType="XIN";
		$this->form = new LorisForm('test_form');
		$this->page = $page;            // page label (number or
		// string - used by
		// user-defined child classes)

		// set the object properties
		$this->testName = "tsi";           // test_names.Test_name
		$this->table = 'tsi';              // name of database table corresponding to instrument
		// data keyed by commentID
		$this->commentID = $commentID;

		//The array of dates/timestamps to convert to database dates/timestamps
		//Any HTML_Quickform date elements must be listed here
		$this->dateTimeFields=array("Date_taken");

		//The array of selects with multiple answers allowed
		//Any HTML_Quickform multiple selects must be listed here
		$this->_selectMultipleElements = array('candidate_race', 'mother_race', 'father_race');

		// required fields for data entry completion status
		$this->_requiredElements = array('Examiner', "ses_income", "neurological_problems_proband", "med_his_q_1_med_surgical_problems", "exc_inc_meets_criteria");
		$this->_doubleDataEntryDiffIgnoreColumns = array('CommentID', 'UserID', 'Testdate',  'Window_Difference', 'Candidate_Age',
			'Data_entry_completion_status',
			'in_utero_substance_proband',
			'in_utero_substance_amount_proband',
			'in_utero_time_exposure_proband',
			'asd_further_information',
			'med_his_q_3_surgery_describe',
			'med_his_q_5_medications_describe',
			'med_his_q_6_allergies_describe',
			'med_his_q_8_brain_MRI_results',
			'med_his_q_9_anethesia_problems',
			'med_his_q_10_nap',
			'med_his_q_11_nap_how_long',
			'further_information'
		);
		

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
		if(preg_match("/tsi(_page[0-9]+)/",$this->page,$matches)){
			call_user_method($matches[1], $this);
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
		// display test name
		$this->form->addElement('header', 'instrument_title', 
"Telephone Screening Interview");

		// automatically adds examiner & date of administration
		$this->_addMetadataFields();

		$this->form->addElement('header', null, "Identifying information");
		$this->form->addElement('header', null, "This type of identifying information should not be entered in the database");
		
		$config =& NDB_Config::singleton();

	        $this->dateOptions = array(
        	'language' => 'en',
        	'format'   => 'YMd',
        	'minYear'  => $config->getSetting('startYear') - 20, //allows for siblings up to 20 years older than candidate
        	'maxYear'  => $config->getSetting('endYear'),
        	'addEmptyOption' => true,
        	'emptyOptionValue' => null
	    	);
        
		$nonAskedQuestions = array("Subject's Name",
		"Subject ID:",
		"Date of Contact:", 
		"Date of Birth:",
        "Estimated Due Date: $this->indent Data entered during candidate registration",
		"Contacted By:",
		"Subject's Gender: $this->indent Subject's Age (in months):");
		foreach ($nonAskedQuestions as $field) {
		    if($field == "Date of Contact:"){
		        $this->addDateElement("contact", $field);
		    }
		    elseif($field == "Contacted By:"){
		        $this->form->addElement("text", "contacted_by", $field);
    	        $this->XINRegisterRule ( "contacted_by", array ("contact_date_status{@}!={@}not_answered"), "Please enter person who contacted" );

		    }
		    else{
		        $this->form->addElement('static', null, $field);
		    }
		}
        $this->form->addElement("select","is_infant_adopted","Is infant adopted?", $this->yesNo);
        $this->form->addElement("select","is_infant_twin","Is infant a twin?", $this->yesNo);
		//Ethnicity
		$this->form->addElement("select", "child_ethnicity", "Candidate Ethnicity:", array(null=>"", "hispanic"=>"Hispanic", "non_hispanic"=>"Non-Hispanic", "not_answered"=>"Not Answered"));

		$this->form->addElement("select", "mother_ethnicity", "Mother Ethnicity:", array(null=>"", "hispanic"=>"Hispanic", "non_hispanic"=>"Non-Hispanic", "not_answered"=>"Not Answered"));

		$this->form->addElement("select", "father_ethnicity", "Father Ethnicity:", array(null=>"", "hispanic"=>"Hispanic", "non_hispanic"=>"Non-Hispanic", "not_answered"=>"Not Answered"));
		

		//RACES
		$this->form->addElement("select", "candidate_race", "Candidate Race:", array("white"=>"White", "black_african_american"=>"Black or African American", "asian"=>"Asian", "unknown_not_reported"=>"Unknown or not Reported", "american_indian_alaska_native"=>"American Indian / Alaska Native", "native_hawaiian_pacific_islander"=>"Native Hawaiian / Other Pacific Islander", "more_than_one_race"=>"More than one race (select all applicable)"), "multiple");
        	$this->form->addRule("candidate_race", "Must answer this race question", 'required');
		
		$this->form->addElement("select", "mother_race", "Mother Race:", array("white"=>"White", "black_african_american"=>"Black or African American", "asian"=>"Asian", "unknown_not_reported"=>"Unknown or not Reported", "american_indian_alaska_native"=>"American Indian / Alaska Native", "native_hawaiian_pacific_islander"=>"Native Hawaiian / Other Pacific Islander", "more_than_one_race"=>"More than one race (select all applicable)"), "multiple");
        	$this->form->addRule("mother_race", "Must answer this race question", 'required');

        	$this->form->addElement("select", "father_race", "Father Race:", array("white"=>"White", "black_african_american"=>"Black or African American", "asian"=>"Asian", "unknown_not_reported"=>"Unknown or not Reported", "american_indian_alaska_native"=>"American Indian / Alaska Native", "native_hawaiian_pacific_islander"=>"Native Hawaiian / Other Pacific Islander", "more_than_one_race"=>"More than one race (select all applicable)"), "multiple");
       
        	$this->form->addRule("father_race", "Must answer this race question", 'required');
	        $this->addTextElement("primary_language", "Primary language spoken in the home:");	
		$this->form->addElement("static", null, "<b>Parent's Information:</b><br><br>");
		
		//Mother's Information
    	$this->form->addElement("static", null, "<b>Mother's Information</b><br>");
		
		/*
     	$this->addTextElement("mother_first_name", "First Name:");
     	$this->form->addElement("text", "mother_middle_name", "Middle Name:");
	    $this->addTextElement ("mother_last_name", "Last Name" );
        */
        
        $this->form->addElement("static", null, "First Name:<br>");
    	$this->form->addElement("static", null, "Middle Name: <br>");
    	$this->form->addElement("static", null, "Last Name: <br>");
    	
        $this->addTextElement("mother_occupation", "Occupation:");        
        
        $this->form->addElement("select", "mother_education", "Highest Level of Education", array(null => "", "not_answered" => "Not Answered", "j_high" => "Junior High", "some_hs" => "Some Highschool", "high_school"=> "High School", "some_college" => "Some College/2yr Degree", "college_degree" => "College Degree", "some_grad_level" => "Some Graduate Level", "grad_degree" => "Graduate Degree"));
    	
    	$this->XINRegisterRule ( "mother_education_rule", array ("mother_education{@}!={@}"), "Please enter the mother's education" );
        
    
    	$config =& NDB_Config::singleton();
        
        $this->dateOptions = array(
            'language' => 'en',
            'format'   => 'YMd',
            'minYear'  => $config->getSetting('startYear') -80, //allows for siblings up to 20 years older than candidate
            'maxYear'  => $config->getSetting('endYear'),
            'addEmptyOption' => true,
            'emptyOptionValue' => null
    	);
		
	   $this->addDateElement('mother_dob', "Date of Birth:");
       $this->addScoreColumn('mother_age_yrs', "Mother's age (in years) at time of candidate's<br> birth (Calculated)"); 
	    //Father's Information
	    
        $this->form->addElement("static", null, "<br><br><b>Father's Information</b><br>");
        
        $this->form->addElement("static", null, "First Name:<br>");
        $this->form->addElement("static", null, "Middle Name: <br>");
        $this->form->addElement("static", null, "Last Name: <br>");

        /*
        $this->addTextElement("father_first_name", "First Name:");
        $this->form->addElement("text", "father_middle_name", "Middle Name:");
    	$this->addTextElement ("father_last_name", "Last Name" );
        */
        
        $this->addTextElement("father_occupation", "Occupation:");        

        $this->form->addElement("select", "father_education", "Highest Level of Education", array(null => "", "not_answered" => "Not Answered", "j_high" => "Junior High", "some_hs" => "Some Highschool", "high_school"=> "High School", "some_college" => "Some College/2yr Degree", "college_degree" => "College Degree", "some_grad_level" => "Some Graduate Level", "grad_degree" => "Graduate Degree"));
        
        $this->XINRegisterRule ( "father_education_rule", array ("father_education{@}!={@}"), "Please enter the father's education" );

    	$config =& NDB_Config::singleton();

	$this->addDateElement('father_dob', "Date of Birth:");
    $this->addScoreColumn('father_age_yrs', "Father's age (in years) at time of candidate's<br> birth (Calculated)"); 
	
      	$this->form->addElement("static", null, "<br><br>");
      	
	$this->form->addElement("select", "ses_income", "SES:", array(null=>"", "less_than_25K"=>"less than $24,999", "25K-35K"=>"$25,000 - 34,999", "35K-50K"=>"$35,000 - 49,999", "50K-75K"=>"$50,000 - 74,999", "75K-100K"=>"$75,000 - 99,999", "100K-150K"=>"$100,000 - 149,999", "150K-200K"=>"$150,000 - 199,000", "over_200K"=>"over $200,000", "not_answered"=>"Not Answered"));

        $nonAskedQuestions = array("<br>Parent's Telephone:",
		"Parent's Address:",
		"$this->indent a) Older sibling",
		"$this->indent b) Other siblings");
		foreach ($nonAskedQuestions as $field) {
			$this->form->addElement('static', null, $field);
		}
         $this->form->addElement("static", null, "<br><br><b>Other siblings</b><br>");
         for($i = 1; $i<=10; $i++) {
            $this->addScoreColumn(null, "Sibling $i");
			$field = 'age_sibling'.$i; $label = $this->indent. 'Age (Please indicate age in years):';
			$group [] = $this->createText($field, $label);
			$this->addGroup($group, $field . "_group", $label, null, false);
			$this->XINRegisterRule($field,array("$field{@}=={@}NEVER_REQUIRED"), $field . "_group");
			unset($group);
			$this->addGroupRule($field . "_group", array(array(array("Value must be numeric.", 'numeric'))));
            $this->addTextElement("dx_sibling".$i, $this->indent . "Dx:");
            $this->XINRegisterRule("dx_sibling".$i,array("$field{@}!={@}"), "Specify diagnoses for sibling $i", "dx_sibling".$i."_group");
            $this->addSelect('relation_sibling'.$i, $this->indent. "Specify relationship:", 
                            array(''=>NULL,'half_sibling'=>'Half sibling', 'full_sibling'=>'Full sibling',
                                  'step_sibling'=>'Step sibling','not_answered'=>'Not Answered'));
            $this->XINRegisterRule("relation_sibling".$i, array("$field{@}!={@}"), "Specify relationship for sibling $i");
            $this->addSelect('live_at_home_sibling'.$i, $this->indent. "Live in home:", array(''=>NULL,'yes'=>'Yes','no'=>'No','part_time'=>'Part time','not_answered'=>'Not Answered')); 
            $this->XINRegisterRule("live_at_home_sibling".$i, array("$field{@}!={@}"), "Specify if sibling $i lives at home or not");
         }
         $this->form->addElement("static", null, "<br><br>");
         $this->form->addElement('static', null, "Nature of Referral:"); 
    }

	function _page1(){

		$this->form->addElement('header', null, "Exclusionary Factors - ASD PROBANDs only");

		$questionArray = array("neurological_problems_proband"=>"Any neurological problems such as cerebral palsy or tuberous sclerosis in PROBAND?",
		"genetic_conditions_proband"=>"Diagnosed/suspected genetic conditions or syndromes?",
	//	"relative_with_disorder"=>"1st degree relative w/ MR, schizophrenia, bipolar or psychosis?",
        "relative_mr" =>$this->indent."MR?",
        "relative_schizophrenia"=>$this->indent."Schizophrenia?",
        "relative_bipolar"=>$this->indent."Bipolar?",
        "relative_psychosis"=>$this->indent."Psychosis?",
        "relative_down_syndrome"=>$this->indent."Down Syndrome?",
		"cns"=>"CNS problem/injury such as a head injury or meningitis?",
		"tested_for_fragile_x"=>"Tested for Fragile X syndrome?",
        "premature_birth_proband"=>"Premature birth (< 37 weeks)?");
		foreach($questionArray as $field=>$label) {
			$this->form->addElement("select", $field, $label, $this->yesNo);
		}
        $this->addNumericElement("gestation_proband","Number of weeks of gestation");
        $this->form->addFormRule(array(&$this,'tsi_Rules'));

        $lb_options = array(null=>"",0=>"0 lbs",1=>"1 lbs",2=>"2 lbs",3=>"3 lbs",4=>"4 lbs",5=>"5 lbs",6=>"6 lbs",
                       7=>"7 lbs",8=>"8 lbs",9=>"9 lbs",10=>"10 lbs",11=>"11 lbs",12=>"12 lbs",13=>"13 lbs",14=>"14 lbs",15=>"15 lbs");
        $oz_options = array(null=>"",0=>"0 oz",1=>"1 oz",2=>"2 oz",3=>"3 oz",4=>"4 oz",5=>"5 oz",6=>"6 oz",
                       7=>"7 oz",8=>"8 oz",9=>"9 oz",10=>"10 oz",11=>"11 oz",12=>"12 oz",13=>"13 oz",14=>"14 oz",15=>"15 oz");

        $group[] =& $this->form->createElement("select", "birthweight_proband_lb", null, $lb_options);
		$group[] =& $this->form->createElement("select", "birthweight_proband_oz", null, $oz_options);
		$group[] =& $this->form->createElement("select", "birthweight_proband_lb_status", null, array(null=>"","not_answered"=>"Not Answered"));
        $this->form->addGroup($group,"weight_proband_group","Birth Weight? in lbs., oz.", $this->_GUIDelimiter, false);
        $this->XINRegisterRule("birthweight_proband_lb", array("birthweight_proband_lb_status{@}=={@}"),"Required lbs and oz","weight_proband_group");
        $this->XINRegisterRule("birthweight_proband_oz", array("birthweight_proband_lb_status{@}=={@}"),"Required lbs and oz.","weight_proband_group");
        unset($group);

        $this->form->addElement('select', "complications_birth_proband", "Complications at birth?(ex. vaccum extraction)", $this->yesNo);
        $this->form->addElement('select', "jaundice_proband", "Diagnosed with jaundice (hyperbilirubinemia)", $this->yesNo);
        $this->form->addElement('select', "lighttherapy_proband",$this->indent. "If yes, light therapy required?", $this->yesNo);
        $this->XINRegisterRule("lighttherapy_proband", array("lighttherapy_proband{@}=={@}NEVER_REQUIRED"));

        $this->addNumericElement('lighttherapy_days_proband', $this->indent."#days light therapy".$this->indent."<BR> (exclusionary if >3 days of lights; requiring transfusion;or due to maternal/fetal RH incompatibility?)");
        $this->XINRegisterRule("lighttherapy_days_proband", array("lighttherapy_days_proband{@}=={@}NEVER_REQUIRED"));

        $this->form->addElement('select', "in_utero_exposure_proband", "Exposure during pregnancy to meds,tobacco, alcohol, or drugs<BR>(Rx or not including herbal and prenatal vitamins)?", $this->yesNo);
		
        $questionArray = array("substance_proband"=>"Name of substance (get spelling):",
		"substance_amount_proband"=>"Amount of substance at one time:",
		"time_exposure_proband"=>"Time period of exposure (weeks of pregnancy):");
		foreach($questionArray as $field=>$label) {
			$this->addTextElement("in_utero_" . $field, $this->indent . $label, array("in_utero_exposure_proband{@}=={@}yes"), "This field is required if there was in-utero exposure");
		}
        $this->form->addElement('select', "breastfed_proband", "Was the proband breastfed?", $this->yesNo);
        $this->addNumericElement("breastfed_proband_months",$this->indent."If yes, how long? Months:");
        $this->XINRegisterRule("breastfed_proband_months", array("breastfed_proband_months{@}=={@}NEVER_REQUIRED"));

        $this->addNumericElement("breastfed_proband_weeks",$this->indent."Weeks:");
        $this->XINRegisterRule("breastfed_proband_weeks", array("breastfed_proband_weeks{@}=={@}NEVER_REQUIRED"));

        $this->form->addElement('select', "medication_in_breastfeed_proband", "Medications while breastfeeding(Rx or not including vitamins)?", $this->yesNo);

        $questionArray = array("substance_breastfed_proband"=>"Name of substance (get spelling):",
                "substance_breastfed_amount_proband"=>"Amount of substance at one time:",
                "time_exposure_breastfed_proband"=>"Time period of exposure (weeks of pregnancy):");
        foreach($questionArray as $field=>$label) {
            $this->addTextElement( $field, $this->indent . $label, array("medication_in_breastfeed_proband{@}=={@}yes"), "This field is required if there was taken during breast feeding");
        }

        
        $this->addTextAreaElement("asd_further_information", "If yes to any of the above, obtain further information.", array("typical_or_asd_subject{@}=={@}asd"));

		$this->form->addElement("header", null, "Exclusionary Factors - Infant subjects");
		$questionArray = array(
		"neurological_problems_subject"=>"Any neurological problems such as cerebral palsy or tuberous sclerosis in SUBJECT?",
		"genetic_conditions_subject"=>"Diagnosed/suspected genetic conditions or syndromes?",
		"seizures_or_neuro_disorder"=>"Do they have or have had they had seizures?",
		"cns_problems"=>"CNS problems/injury such as head injury or meningitis?",
		"congenital_heart_problems"=>"Congenital heart problems?",
		"hearing_vision_impairments"=>"Significant hearing/vision problems?",
		"diabetes"=>"Diabetes or gestational diabetes?",
        "pregnancy_complication_subject"=>"Any complication during pregnancy?<BR>(toxemia, high blood pressure, thyroid disorder)",
		"complications_birth" => "Any complications at birth?(Ex: vaccum extraction?)",
		"premature_birth"=>"Premature birth (<37 weeks )?",
        "jaundice_subject"=>"Diagnosed with jaundice(hyperbilirubinemia)?",
		"low_birth_weight"=>"Birth weight <4lbs. 6oz. (2000 grams)?",
	    "delivery_problems"=>"Problems during delivery?",
		"tested_for_fragile_x_subject"=>"Tested for Fragile X syndrome?");
		foreach($questionArray as $field=>$label) {
			$this->form->addElement("select", $field, $label, $this->yesNo);
			if ($field == 'premature_birth') {
			    $this->addTextElement('weeks_gestation', $this->indent . "Number of weeks gestation", array("premature_birth{@}=={@}yes"), "If premature, how many gestational weeks?");
			}
            if ($field == 'jaundice_subject') {
                $this->form->addElement("select",'lighttherapy_subject',$this->indent."If yes, light therapy required?", $this->yesNo);
                 $this->XINRegisterRule("lighttherapy_subject", array("lighttherapy_subject{@}=={@}NEVER_REQUIRED"));

                $this->addNumericElement('lighttherapy_days_subject', $this->indent . "# of days<BR>(exclusionary if >3days of lights;requiring transfusion;or due to maternal/fetal RH incompatibility)");
                 $this->XINRegisterRule("lighttherapy_days_subject", array("lighttherapy_days_subject{@}=={@}NEVER_REQUIRED"));

            }

		}
        $this->form->addElement('select', "pregnancy_exposure_subject", "Exposure during pregnancy to meds,tobacco, alcohol, or drugs<BR>(Rx or not including herbal and prenatal vitamins)?", $this->yesNo);

        $questionArray = array("substance_subject"=>"Name of substance (get spelling):",
                "substance_amount_subject"=>"Amount of substance at one time:",
                "time_exposure_subject"=>"Time period of exposure (weeks of pregnancy):");
        foreach($questionArray as $field=>$label) {
            $this->addTextElement("pregnancy_" . $field, $this->indent . $label, array("pregnancy_exposure_subject{@}=={@}yes"), "This field is required if there was exposure during pregnancy");
        }

        $this->form->addElement('select', "breastfed_subject", "Did you or are you breastfeeding your infant?", $this->yesNo);
        $this->addNumericElement("breastfed_subject_months",$this->indent."If yes, how long? Months:");
        $this->XINRegisterRule("breastfed_subject_months", array("breastfed_subject_months{@}=={@}NEVER_REQUIRED"));
        $this->addNumericElement("breastfed_subject_weeks",$this->indent."Weeks:");
        $this->XINRegisterRule("breastfed_subject_weeks", array("breastfed_subject_weeks{@}=={@}NEVER_REQUIRED"));

        $this->form->addElement('select', "medication_in_breastfeed_subject", "Medications while breastfeeding(Rx or not including vitamins)?", $this->yesNo);

        $questionArray = array("substance_breastfed_subject"=>"Name of substance (get spelling):",
                "substance_breastfed_amount_subject"=>"Amount of substance at one time:",
                "time_exposure_breastfed_subject"=>"Time period of exposure (weeks of pregnancy):");
        foreach($questionArray as $field=>$label) {
            $this->addTextElement($field, $this->indent . $label, array("medication_in_breastfeed_subject{@}=={@}yes"), "This field is required if medication was taken during breast feeding");
        }

		$this->addTextAreaElement("further_information", "If yes to any of the above, obtain further information.");
        $this->form->addFormRule(array(&$this, 'tsi_Rules'));

	}

	function _page2() {
		$this->form->addElement('header', null, "Medical History Pertaining to MRI/Sedation");
		$this->form->addElement("select", "med_his_q_1_med_surgical_problems", "1. Has X ever had any serious medical or surgical problems?", $this->yesNo);
		$this->form->addElement("select", "med_his_q_2_hospitalized", "2. Has X ever been hospitalized?", $this->yesNo);
		$this->form->addElement("select", "med_his_q_3_surgery", "3. Surgery of any type?", $this->yesNo);
		$this->addTextElement("med_his_q_3_surgery_describe", $this->indent . "Describe:", array("med_his_q_3_surgery{@}=={@}yes"), "This field is required if there was surgery");
		$this->form->addElement("select", "med_his_q_4_metal", "4. Does X have any metal plates, clips, etc. from surgery?", $this->yesNo);
		$this->form->addElement("select", "med_his_q_5_medications", "5. Has X taken any medications over the last 12 months?", $this->yesNo);
		$this->addTextElement("med_his_q_5_medications_describe", $this->indent . "If yes, list medications:", array("med_his_q_5_medications{@}=={@}yes"), "This field is required if there were medications");
		$this->form->addElement("select", "med_his_q_6_allergies", "6. Does X have any allergies to medicines?", $this->yesNo);
		$this->addTextElement("med_his_q_6_allergies_describe", $this->indent . "If yes, describe:", array("med_his_q_6_allergies{@}=={@}yes"), "This field is required if there are allergies");
		$this->form->addElement("select", "med_his_q_7_doctor", "7. Has X seen a doctor over the last 12 months?", $this->yesNo);
		$this->form->addElement("select", "med_his_q_8_brain_MRI", "8. Has X ever had an MRI of the brain?", $this->yesNo);
		$this->form->addElement("select","med_his_q_8_brain_MRI_results", $this->indent . "If yes, what were the results?", array(null=>"","typical"=>"Typical","atypical"=>"Atypical","not_answered"=>"Not Answered"));
        $this->XINRegisterRule ( "med_his_q_8_brain_MRI_results", array("med_his_q_8_brain_MRI{@}=={@}yes"),"Please specify results");
        $this->addTextElement("med_his_q_8_brain_MRI_notes", $this->indent . "Notes", array("med_his_q_8_brain_MRI_results{@}=={@}atypical"));
		$this->form->addElement("select", "med_his_q_9_anethesia", "9. Has X ever had anesthesia or other forms of sedation?", $this->yesNo);
		$this->form->addElement("select","med_his_q_9_anethesia_problems", $this->indent . "Problems with sedation?",$this->yesNo);
        $this->XINRegisterRule ( "med_his_q_9_anethesia_problems", array("med_his_q_9_anethesia{@}=={@}yes"),"Please specify results");
        $this->addTextElement("med_his_q_9_anethesia_notes", $this->indent . "Notes", array("med_his_q_9_anethesia_problems{@}=={@}yes"));

		$this->addTextElement("med_his_q_10_nap", "10. Does X nap during the day?");
		$this->addTextElement("med_his_q_11_nap_how_long", "11. When & how long?");
		$this->form->addElement("select", "med_his_q_12_likelihood_sleep", "12. On a scale of 1-10, please rate the likelihood of your child sleeping through a scan.", array(null=>"", 1=>"1", 2=>"2",  3=>"3", 4=>"4", 5=>"5", 6=>"6", 7=>"7", 8=>"8", 9=>"9", 10=>"10", "not_answered"=>"Not Answered"));
		
	}

	function _page3() {
		$this->form->addElement("header", null, "Medical Records");
		$this->addTextElement("city_of_birth", "City of Birth:");
        
		$this->form->addElement('header', null, "This type of identifying information should not be entered in the database");
		$this->form->addElement("static", null, "Any diagnoses, dates and locations:");
		$this->form->addElement("static", null, "Has X had any other cognitive/developmental testing?");
		$this->form->addElement("static", null, $this->indent . "If yes, where was evaluation done/who conducted the evaluation?");
		$this->form->addElement("static", null, "Is any member of your family participating in a research study at this time?");
		
		$this->form->addElement("header", null, "FOR RESEARCH STAFF TO COMPLETE");
		$this->form->addElement("static", null, "Exclusion/Inclusion");
		$this->form->addElement("select", "exc_inc_meets_criteria", "1. This proband meets any of the medical or neurological exclusion criteria for this study. (see Section A)", $this->yesNo);
		$this->form->addElement("select", "exc_inc_subject_meets_criteria", "2. This subject meets any of the medical or neurological exclusion criteria for this study. (see Section B)", $this->yesNo);
		$this->form->addElement("select", "exc_inc_contraindication", "3. This subject has evidence for contraindication to MRI. (see Section B)", $this->yesNo);
		$this->form->addElement("static", null, "Disposition");
		$this->form->addElement("select", "disposition", "Proceed to next level beyond screening?", $this->yesNo);
	}
    function tsi_Rules($values) {
        $errors = array();
        $gestation = intval ($values["gestation_proband"]);
        if($gestation < 0 || $gestation > 45){
            $errors['gestation_proband'] = 'Please enter value between 0-45';

        }
        if( ($values["lighttherapy_days_proband"] == null || $values["lighttherapy_days_proband"] == '')
            && ($values["lighttherapy_days_proband_status"] == null || $values["lighttherapy_days_proband_status"] == '')
            && $values["lighttherapy_proband"] == "yes") {
            $errors['lighttherapy_days_proband_group'] = 'Required' ;    
        }
        if(($values["lighttherapy_proband"] == null || $values["lighttherapy_proband"] == '')
                && $values["jaundice_proband"] === "yes") {
            $errors['lighttherapy_proband'] = 'Required' ;
        }
        
        if($values["breastfed_proband"] == "yes" &&
           ($values["breastfed_proband_months"] == null || $values["breastfed_proband_months"] == '') &&
           ($values["breastfed_proband_months_status"] == null || $values["breastfed_proband_months_status"] == '')) {
           $errors['breastfed_proband_months_group'] = 'Required';   
         }
        if($values["breastfed_proband"] == "yes" &&
           ($values["breastfed_proband_weeks"] == null || $values["breastfed_proband_weeks"] == '') &&
           ($values["breastfed_proband_weeks_status"] == null || $values["breastfed_proband_weeks_status"] == "")) {
            $errors['breastfed_proband_weeks_group'] = 'Required';
        }
        if($values["breastfed_subject"] == "yes" &&
           ($values["breastfed_subject_months"] == null || $values["breastfed_subject_months"] == "" )&&
           ($values["breastfed_subject_months_status"] == null || $values["breastfed_subject_months_status"] == "")) {
            $errors['breastfed_subject_months_group']  = 'Required';
        }
        if($values["breastfed_subject"] == "yes" &&
           ($values["breastfed_subject_weeks"] == null || $values["breastfed_subject_weeks"] == "") &&
           ($values["breastfed_subject_weeks_status"] == null || $values["breastfed_subject_weeks_status"] == "")) {
            $errors['breastfed_subject_weeks_group'] = 'Required';
        }
        if( ($values["lighttherapy_days_subject"] == null || $values["lighttherapy_days_subject"] == '')
             && ($values["lighttherapy_days_subject_status"] == null || $values["lighttherapy_days_subject_status"] == '')
             && $values["lighttherapy_subject"] == "yes") {
            $errors['lighttherapy_days_subject_group'] = 'Required' ;
        }
        if(($values["lighttherapy_subject"] == null || $values["lighttherapy_subject"] == '')
                && $values["jaundice_subject"] === "yes") {
            $errors['lighttherapy_subject'] = 'Required' ;
        }


        return $errors;
    }
    function score() {
        $db =& Database::singleton();

        // Get the item scores
        $record= $db->pselectRow("SELECT * FROM $this->table WHERE CommentID=:cid", array('cid'=>$this->getCommentID()));
        $score = array();

        if($record['relative_mr'] == 'yes' || $record['relative_schizophrenia']== 'yes' 
           || $record['relative_bipolar']=='yes' || $record['relative_psychosis']== 'yes')  {
            $score['relative_with_disorder'] = 'yes';
        } else {
            $score['relative_with_disorder'] = 'no';
        }
        //Find the candidate ID
        //set for med_records_recruit - so watch out needs to be fixed
        $candidate_dob = $db->pselectOne("SELECT c.DoB from session as s, flag as f, candidate c where f.sessionId = s.ID and
                                 s.CandID=c.CandID and f.CommentID=:cid", array('cid'=>$this->getCommentID())); 

        $score['mother_age_yrs'] = 'Unknown';$score['father_age_yrs'] = 'Unknown';
        $parents = array('mother','father');
        foreach ($parents as $parent) { 
            if (!empty($record[$parent.'_dob_date']) & !empty($candidate_dob) & 
                $record[$parent.'_dob_date']!='0000-00-00' 
               ) {
                $age = Utility::calculateAge($record[$parent.'_dob_date'],
                        $candidate_dob);
                $score[$parent.'_age_yrs'] = $age['year'] + round($age['mon']/12,2) +
                    round($age['day']/365, 2);
            }
        }
        $result = $db->update($this->table, $score, array('CommentID'=>$this->getCommentID()));
   }

}
?>
