<?php
/**
 * This file contains the Medical History Instrument class
 *
 * PHP Version 5
 *
 * @category Instrument
 * @package  TEMPLATE
 * @author   Stella Lee <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/loris/
 */

/**
 * Creates the form elements for the Medical History Instrument
 *
 * @category Instrument
 * @package  TEMPLATE
 * @author   Stella Lee <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/loris/
 */

class NDB_BVL_Instrument_medical_history extends NDB_BVL_Instrument
{

    var $ValidityEnabled  = false;
    var $ValidityRequired = false;

    /**
     * Sets up basic data, such as the HTML_Quickform object, and so on.
     *
     * @param string $commentID the CommentID identifying the data to load
     * @param string $page      if a multipage form, the page to show
     *
     * @return void
     * @access public
     */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->formType ='XIN';
        $this->form     = new LorisForm('test_form');
        $this->page     = $page; // page label

        // set the object properties
        $this->testName  = 'medical_history'; // test_names.Test_name
        $this->table     = 'medical_history'; // database table
        $this->commentID = $commentID; // data keyed by commentID

        //The array of dates/timestamps to convert to database dates/timestamps
        //Any HTML_Quickform date elements must be listed here
        $this->dateTimeFields = array("Date_taken");

        //The array of selects with multiple answers allowed
        //Any HTML_Quickform multiple selects must be listed here
        $this->_selectMultipleElements = array('current_concussion_symptoms');

        // required fields for data entry completion status
        $this->_requiredElements = array(
                                    'Examiner',
                                    'arthritis',
                                    'hypertension',
                                    'concussion_or_head_trauma',
                                   );

        $this->_doubleDataEntryDiffIgnoreColumns = array(
                                                    'CommentID',
                                                    'UserID',
                                                    'Testdate',
                                                    'Window_Difference',
                                                    'Candidate_Age',
                                                    'Data_entry_completion_status',
                                                    'pulmonary_issues_specific',
                                                    'concussion_1_description',
                                                    'concussion_2_description',
                                                    'concussion_3_description',
                                                   );

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
        if (preg_match("/medical_history(_page[0-9]+)/", $this->page, $matches)) {
            call_user_func(array($this, $matches[1]));
        } else {
            $this->_main();
        }
        // Defines the call back function for HTML Quickform to use in validation
        $this->form->addFormRule(array(&$this, 'XINValidate'));

        //Defines the call back function for HTML Quickform to use
        $this->form->addFormRule(array(&$this, 'XINValidate'));
    }

    /**
     * Generates the main page of the form.
     *
     * @return void
     * @access private
     */
    function _main()
    {
        // display test name
        $this->addHeader("Medical History");

        // automatically adds examiner & date of administration
        $this->_addMetadataFields();
    }

    /**
     * Arthritis/Respiratory
     *
     * @return void
     */
    function _page1()
    {

        // Header
        $this->addHeader("A. Arthritis");

        // Questions

        $yesNoOptions = array(
                         null  => "",
                         "yes" => "Yes",
                         "no"  => "No",
                        );

        // Question 1

        $this->addSelect(
            "arthritis",
            "1. Do you have any type of arthritis?",
            $yesNoOptions
        );

        $this->addNumericElement(
            "arthritis_age",
            "$this->indent $this->indent Age:"
        );

        $this->XINRegisterRule(
            "arthritis_age",
            array("arthritis{@}=={@}yes"),
            "Required.",
            "arthritis_age_group"
        );

        // Header
        $this->addHeader("B. Respiratory");

        // Questions

        $yesNoOptions = array(
                         null  => "",
                         "yes" => "Yes",
                         "no"  => "No",
                        );

        // Question 2

        $this->addSelect(
            "pulmonary_issues",
            "2. Do you currently have, or have you ever had any pulmonary issues?",
            $yesNoOptions
        );

        $this->addBasicText(
            "pulmonary_issues_specific",
            "$this->indent $this->indent If YES, please specify:"
        );

        $this->XINRegisterRule(
            "pulmonary_issues_specific",
            array("pulmonary_issues{@}=={@}yes"),
            "Required."
        );

    }

    /**
     * Cardiac/Cardiovascular
     *
     * @return void
     */
    function _page2()
    {

        // Header
        $this->addHeader("C. Cardiac/Cardiovascular");

        // Questions

        $yesNoOptions = array(
                         null  => "",
                         "yes" => "Yes",
                         "no"  => "No",
                        );

        // Question 7

        $this->addSelect(
            "hypertension",
            "7. Do you have hypertension?",
            $yesNoOptions
        );

        $this->addSelect(
            "hypertension_while_pregnant",
            "$this->indent $this->indent" .
            "If YES + FEMALE, were you pregnant " .
            "when you were diagnosed with hypertension?",
            $yesNoOptions
        );

        $this->XINRegisterRule(
            "hypertension_while_pregnant",
            array("hypertension_while_pregnant{@}=={@}NEVER_REQUIRED"),
            "Required."
        );

        $this->form->addFormRule(array(&$this, 'areFemaleQuestionsRequired'));

        $this->addNumericElement(
            "hypertension_while_pregnant_age",
            "$this->indent $this->indent $this->indent $this->indent Age:"
        );

        $this->XINRegisterRule(
            "hypertension_while_pregnant_age",
            array("hypertension_while_pregnant{@}=={@}yes"),
            "Required.",
            "hypertension_while_pregnant_age_group"
        );

    }

    /**
     * Neurological
     *
     * @return void
     */
    function _page3()
    {

        // Header
        $this->addHeader("D. Neurological");

        // Questions

        $yesNoOptions = array(
                         null  => "",
                         "yes" => "Yes",
                         "no"  => "No",
                        );

        // Question 21

        $this->addSelect(
            "concussion_or_head_trauma",
            "21. Have you ever had a concussion?",
            $yesNoOptions
        );

        $this->addLabel(
            "$this->indent" .
            "If YES, please fill out the table below, indicating:\n" .
            "a) How many concussions have you experienced in your lifetime?\n" .
            "b) For each incident, were you hospitalized?\n" .
            "c) For each incident, how old were you?"
        );

        // Concussion table headers

        $group[] = $this->form->createElement(
            "static",
            null,
            null,
            "Incident"
        );

        $group[] = $this->form->createElement(
            "static",
            null,
            null,
            "Hospitalized?"
        );

        $group[] = $this->form->createElement(
            "static",
            null,
            null,
            "Age"
        );

        $this->form->addGroup(
            $group,
            "concussion_titles",
            null,
            $this->_GUIDelimiter,
            false
        );

        unset($group);

        for ($i = 1; $i < 4; $i++) {

            $group[] = $this->createText(
                "concussion_" . $i . "_description",
                "Incident"
            );

            $this->XINRegisterRule(
                "concussion_" . $i . "_description",
                array("concussion_" . $i . "_description{@}=={@}NEVER_REQUIRED"),
                "Required."
            );

            $group[] = $this->createSelect(
                "concussion_" . $i . "_hospitalized",
                "Hospitalized?",
                $yesNoOptions
            );

            $this->XINRegisterRule(
                "concussion_" . $i . "_hospitalized",
                array("concussion_" . $i . "_hospitalized{@}=={@}NEVER_REQUIRED"),
                "Required."
            );

            $group[] = $this->createText(
                "concussion_" . $i . "_age",
                "Age"
            );

            $this->XINRegisterRule(
                "concussion_" . $i . "_age",
                array("concussion_" . $i . "_age{@}=={@}NEVER_REQUIRED"),
                "Required."
            );

            $this->form->addGroup(
                $group,
                "concussion_table_" . $i,
                null,
                $this->_GUIDelimiter,
                false
            );

            unset($group);
        }

        $concussionOptions = array(
                              null              => "",
                              "headaches"       => "Headaches",
                              "dizziness"       => "Dizziness",
                              "memory_problems" => "Memory problems",
                             );

        $this->addSelect(
            "current_concussion_symptoms",
            "$this->indent" .
            "d) Are you currently experiencing any problems " .
            "that you think might be related to a concussion?",
            $concussionOptions,
            array('multiple')
        );

    }

    /**
     * Determines whether the question specific to female participants are required.
     *
     * @param array $values Array containing all the form values
     *
     * @return array
     */
    function areFemaleQuestionsRequired($values)
    {
        $errors = array();
        $candID = isset($_REQUEST['candID']) ? $_REQUEST['candID'] : '';
        if ($values['hypertension'] == 'yes' && $this->isCandidateFemale($candID)) {
            $errors['hypertension_while_pregnant'] = 'Required';
        }
        return $errors;
    }

    /**
     * Given the CandID, determines if the candidate is female
     *
     * @param string $candID CandID
     *
     * @return boolean
     */
    function isCandidateFemale($candID)
    {
        $DB     = Database::singleton();
        $gender = $DB->pselectOne(
            "SELECT Gender from candidate WHERE CandID=:candID",
            array('candID' => $candID)
        );
        if ($gender == 'female') {
            return true;
        }
        return false;
    }
}