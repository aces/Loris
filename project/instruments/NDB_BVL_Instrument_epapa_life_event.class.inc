<?php
class NDB_BVL_Instrument_epapa_life_events extends NDB_BVL_Instrument
{


    // Questions group A
    var $questions_groupe_a = array( 
        '1'  => 'Have any children come to live in X’s home in the last three (3) months?',
        '2'  => 'Have you and your "partner" split up in the last three (3) months?',
        '3'  => 'If yes, has a divorce been finalized in the last three (3) months?',
        '4'  => 'Did a new" parent" move into your home in the last three (3) months?', 
        '5'  => 'Has X moved to a new place in the last three (3) months?',
        '6'  => 'Has X changed daycare/schools in the last three (3) months?',
        '7'  => 'Has X lost contact with someone s/he cared about in the last three (3) months because one of them moved?',
        '8'  => 'Has your family ever had a pet or has X ever had a pet? In the last three (3) months, has X had a pet die?',
        '9'  => 'Does s/he live or go to daycare/school in an unsafe place? Does s/he feel safe where s/he lives?',
        '10' => 'Has your family’s income been less than usual in the last three (3) months?',
        '11' => 'In the last three (3) months, have you and your child been forced to leave your home?',
        '12' => 'Have either you or his father been arrested in the last three (3) months? Have either of his/her "other parents" been arrested in the last three (3) months?',
        '13' => 'Have either you or your partner been evaluated at or admitted to a hospital in the last three (3) months?',
        '14' => 'In the last three (3) months has s/he from you (or parent #2)? Like you (or parent #2) having to go on an overnight business trip? Or out of town for overnight? Or has s/he had to go and stay away from home?'
    );
    
    // Questions group B
    var $questions_groupe_b = array( 
        '15' => 'Has s/he ever been in a serious accident?',
        '16' => 'Has s/he ever been struck by a car? Has s/he ever been struck by a bicycle?',
        '17' => 'Has X ever poisoned him/herself?',
        '18' => 'Has X ever been badly burned?',
        '19' => 'Has X ever been close to drowning?',
        '20' => 'Has X ever had a serious fall?',
        '21' => 'Has an animal ever attacked X?',
        '22' => 'Has X ever broken any bones?',
        '23' => 'Has s/he ever gotten very sick? Has s/he been in the hospital because of a physical ailment?',
        '24' => 'Has s/he ever been in the hospital for more than 24h?',
        '25' => 'Has anyone close to him/her died?',
        '26' => 'Has a friend of his/her ever died? Or one of his/her brothers or sisters or cousins?',
        '27' => 'Has s/he ever been in a terrible storm, tornado, or hurricane? Or an earthquake? Or a flood?',
        '28' => 'Has s/he ever been in a terrible fire?',
        '29' => 'Has s/he ever been in a war? Or somewhere where armies or terrorists were fighting?',
        '30' => 'Has s/he ever seen or heard something really terrible happen to anyone?',
        '31' => 'Has s/he or someone s/he was with ever hurt another person badly? Or caused another person to die?'
    );

    // Additional question for each question of group A or B that have been answered with "Yes".
    var $question_affected = 'If yes, in the last three (3) months, has this «life event» affected X including his/her behaviours and emotions?';

    
    // Answer choices for ePAPA test
    var $answer_options = array(
        ''             => null, 
        'no'           => 'No',
        'yes'          => 'Yes',
        'not_answered' => 'Not answered'
    );


    /**
    * sets up basic data, such as the HTML_Quickform object, and so on.
    *
    * @param string $commentID  the CommentID identifying the data to load
    * @param string $page       if a multipage form, the page to show
    * @return void
    * @access public
    */
    function setup($commentID, $page)
    {
        $this->formType       = 'XIN';
        $this->form           = new HTML_Quickform('test_form');
        $this->page           = $page;            // page label (number or
        // string - used by
        // user-defined child classes)
        
        // set the object properties
        $this->testName       = "epapa_life_events";           // test_names.Test_name
        $this->table          = 'epapa_life_events';              // name of table containing
        // data keyed by commentID
        $this->commentID      = $commentID;
        
        //The array of dates/timestamps to convert to database dates/timestamps
        $this->dateTimeFields = array("Date_taken");
        
        // required fields for data entry completion status
        $this->_requiredElements = array('Examiner');
       // setup the form
        $this->_setupForm();    
    }
    
    /**
    * Method to build the HTML_Quickform object into a paged form
    *
    * @return void
    * @access private
    */
    function _setupForm()
    {
    	if(preg_match("/(_page[0-9])$/", $this->page, $matches)) {
    		call_user_method($matches[1], $this);
    	} else {
    		$this->_main();
                $this->form->addFormRule(array($this,'XINValidate'));
    	}

    }

    /**
     * Main (top) instrument page
     */
    function _main() {
        // display test name
        $this->form->addElement('header', 'instrument_title', "Life Event");
        
        // add examiner & date of administration
        $this->_addMetadataFields();
    }
    
    function _page1() {
    	// Add header
        $this->form->addElement('header', null, 'Life Event - group A');
		  
        // Add each question with available answers
        foreach($this->questions_groupe_a as $number => $text) {
            $this->form->addElement('select', "group_a_${number}", "${number}.1 ) $text", $this->answer_options);
            $this->addRule(
                "group_a_$number",
                "You have to answer question $number",
                'required'
            );
            $this->form->addElement('select', "group_a_conditional_${number}", "${number}.2 ) $this->question_affected", $this->answer_options);
        }
    }        

    function _page2() {
    	// Add header
        $this->form->addElement('header', null, 'Life Event - group B');
		  
        // Add each question with available answers
        foreach($this->questions_groupe_b as $number => $text) {
            $this->form->addElement('select', "group_b_${number}", "${number}.1 ) $text", $this->answer_options);
            $this->addRule(
                "group_b_$number",
                "You have to answer question $number",
                'required'
            );
            $this->form->addElement('select', "group_b_conditional_${number}", "${number}.2 ) $this->question_affected", $this->answer_options);
        }
    }
}
?>
