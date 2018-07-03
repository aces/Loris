<?php
class NDB_BVL_Instrument_XIN_Rule_Test extends NDB_BVL_Instrument
{
    /**
     * Sample SQL statement for test_names table and instrument subtests table
     *
     * INSERT INTO test_names(Test_name, Full_name,Sub_group,isDirectEntry) VALUES ('<TEST_NAME>','<INSTRUMENT_TITLE>',1, false);
     * INSERT INTO instrument_subtests(Test_name, Subtest_name, Description, Order_number) VALUES('<TEST_NAME>', '<TEST_NAME>_page1', 'Page1', 1);
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
        $this->testName = "XIN_Rule_Test";           // test_names.Test_name
        $this->table = 'XIN_Rule_Test';              // name of database table corresponding to instrument
        // data keyed by commentID
        $this->commentID = $commentID;

        //The array of dates/timestamps to convert to database dates/timestamps
        //Any HTML_Quickform date elements must be listed here
        $this->dateTimeFields=array("Date_taken");

        //The array of selects with multiple answers allowed
        //Any HTML_Quickform multiple selects must be listed here
        $this->_selectMultipleElements = array();

        // required fields for data entry completion status
        //$this->_requiredElements = array('Examiner', '<FIRST QUESTION OF EACH PAGE>');

        // setup the form
        $this->_setupForm();

    }

    //If the instrument is not paged, remove the switch from the _setupForm method and add all the form Elements in this function.

    /**
     * method to build the HTML_Quickform object into a paged form
     *
     * @return void
     * @access private
     */
    function _setupForm(){
        if(preg_match("/<XIN_Rule_Test>(_page[0-9]+)/",$this->page,$matches)){
            call_user_func(array($this, $matches[1]));
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
        $this->addHeader("XIN Rule Test");

        $q1Opts = array(
            null => "",
            "A" => "A",
            "B" => "B",
            "C" => "C",
            "D" => "D"
        );

        $this->addSelect(
            "q1",
            "Q1) Required by default",
            $q1Opts
        );

        $this->addSelect(
            "q2",
            "Q2) Never required",
            $q1Opts
        );

        $this->XINRegisterRule(
            "q2",
            array("q2{@}=={@}NEVER_REQUIRED"),
            "Not required."
        );

        $this->addTextElement(
            "q3",
            "Q3) Required if Q1 equals A"
        );

        $this->XINRegisterRule(
            "q3",
            array("q1{@}=={@}A"),
            "Required.",
            "q3_group"
        );

        $this->addTextElement(
            'q4',
            "Q4) Required if Q1 equals A, B, or C"
        );

        $this->XINRegisterRule(
            'q4',
            array('q1{@}=={@}A|B|C'),
            'Required.',
            "q4_group"
        );

        $this->addTextElement(
            'q5',
            'Q5) Required if Q1 equals A and Q2 equals D'
        );

        $this->XINRegisterRule(
            'q5',
            array('q1{@}=={@}A', 'q2{@}=={@}D'),
            'Required.',
            "q5_group"
        );

        $this->addTextElement(
            'q6',
            'Q6) Required if Q1 equals B or Q2 equals C'
        );

        $this->XINRegisterRule(
            'q6',
            array('q1{@}=={@}B|q2{@}=={@}C'),
            'Required',
            "q6_group"
        );
    }

}
?>
