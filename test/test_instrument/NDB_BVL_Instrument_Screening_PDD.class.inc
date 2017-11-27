<?php
/**
 * This file contains the NDB_BVL_Instrument_Screening_PDD
 * class
 *
 * PHP Version 5
 *
 * @category Instrument
 * @package  Screening
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
/**
 * Creates the form elements for the Screening_PDD instrument
 *
 * @category Instrument
 * @package  Screening
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_BVL_Instrument_Screening_PDD extends NDB_BVL_Instrument
{
    var $ValidityEnabled = false;
    var $ValidityRequired = false;
    var $_doubleDataEntryDiffIgnoreColumns = array(
        'CommentID',
        'UserID',
        'Testdate',
        'Window_Difference',
        'Candidate_Age',
        'Data_entry_completion_status',
        'screen_pdd_incl_outcome',
        'screen_pdd_excl_outcome'
    );

    /**
     * Sets up basic data, such as the LorisForm object, and so on.
     *
     * @param string $commentID the CommentID identifying the data to load
     * @param string $page      if a multipage form, the page to show
     *
     * @return void
     * @access public
     */
    function setup($commentID, $page)
    {
        $this->formType = 'XIN';
        $this->form = new LorisForm('Screening_PDD_form');
        $this->page = $page;
        // set the object properties
        $this->testName = 'Screening_PDD';
        $this->table = 'Screening_PDD';
        $this->commentID = $commentID; // data keyed by commentID
        //The array of dates/timestamps to convert to database dates/timestamps
        //Any LorisForm date elements must be listed here
        $this->dateTimeFields = array("Date_taken");
        //The array of selects with multiple answers allowed
        //Any LorisForm multiple selects must be listed here
        //$this->_selectMultipleElements = array();
        // required fields for data entry completion status
        $this->_requiredElements = array('Examiner', 'CommentID', 'screen_pdd_incl_1');
        $config = NDB_Config::singleton();
        $this->dateOptions = array(
            'language' => 'en',
            'format' => 'YMd',
            'minYear' => $config->getSetting('startYear'),
            'maxYear' => $config->getSetting('endYear'),
            'addEmptyOption' => true,
            'emptyOptionValue' => null
        );
        // setup the form
        $this->_setupForm();
    }
    /**
     * Method to build the LorisForm object into a paged form
     *
     * @return void
     * @access private
     */
    function _setupForm()
    {
        //determine page to display
        if (preg_match(
            "/Screening_PDD(_page[0-9]+)/",
            $this->page, $matches
        )) {
            call_user_func(array($this, $matches[1]));
        } else {
            $this->_main();
        }
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
        $this->addHeader(
            "Parkinson’s Disease Dementia (PDD) Screening"
        );
        // automatically adds examiner & date of administration
        $this->_addMetadataFields();
        $this->addLabel('<h3>Screening outcome</h3>');
        $this->addScoreColumn(
            'screen_pdd_incl_outcome',
            "Parkinson's Disease dementia - Inclusion",
            'No value yet.'
        );
        $this->addScoreColumn(
            'screen_pdd_excl_outcome',
            "Parkinson's Disease dementia - Exclusion",
            'No value yet.'
        );
    }
    /**
     * Parkinson’s Disease Dementia (PDD) screening
     * page 1
     *
     * @return void
     */
    function _page1()
    {
        // Header
        $this->addHeader(
            "Parkinson’s Disease Dementia (PDD) Screening"
        );

        $this->addLabel(
            "Inclusion (response must be YES to qualify)"
        );

        $this->addYesNoElement(
            "screen_pdd_incl_1",
            "1. Has the candidate been diagnosed with Parkinson’s disease based ".
            "on the International Parkinson and Movement Disorder Society (MDS) ".
            "clinical diagnostic criteria (2015)?"
        );

        $this->addYesNoElement(
            "screen_pdd_incl_2",
            "2. Has the candidate demonstrated a gradual decline, in the context ".
            "of established PD, in cognitive ability reported by either the ".
            "patient or study partner, or observed by the clinician?"
        );

        $this->addYesNoElement(
            "screen_pdd_incl_3",
            "3. Does the candidate have a MoCA score between 13-20 (inclusive) (p. 8)?"
        );

        $this->addYesNoElement(
            "screen_pdd_incl_4",
            "4. Are the cognitive deficits severe enough to impair daily ".
            "life (social, occupational, or personal care), independent of the ".
            "impairment ascribable to motor or autonomic symptoms (p. 9)?"
        );

        $this->addLabel(
            "5. Does the candidate show impaired cognition, defined by abnormal ".
            "results on the MoCA for two or more of the following?"
        );


        $this->addYesNoElement(
            "screen_pdd_incl_5a",
            "a) Serial 7s (backwards)."
        );

        $this->addYesNoElement(
            "screen_pdd_incl_5b",
            "b) Lexical fluency or clock drawing."
        );

        $this->addYesNoElement(
            "screen_pdd_incl_5c",
            "c) Figure copy."
        );

        $this->addYesNoElement(
            "screen_pdd_incl_5d",
            "d) Recall < 3 words on the 5-word recall."
        );

        $this->addLabel(
            "<strong>Exclusion</strong> (response must be NO to qualify)<br>"
        );

        $this->addYesNoElement(
            "screen_pdd_excl_1",
            "1. Are there any other primary explanations for the cognitive ".
            "impairment (e.g., delirium, stroke, major depression, metabolic ".
            "abnormalities, adverse effects of medication, or head trauma)?"
        );

        $this->addYesNoElement(
            "screen_pdd_excl_2",
            "2. Does the candidate have other PD-associated comorbid conditions ".
            "(e.g., motor impairment or severe anxiety, depression, excessive ".
            "daytime sleepiness, or psychosis) that, in the opinion of the ".
            "clinician, significantly influence cognitive testing (pp. 30-39)?"
        );
    }
    /**
     * Screening_ score function
     *
     * @return void
     */
    function score()
    {
        if ($this->_determineDataEntryCompletionStatus() == "Incomplete") {
            return;
        }
        //holds calculated
        $db =& Database::singleton();
        //Get raw questions point values
        $query = "SELECT * FROM " . $this->table .
            " WHERE CommentID='" . $this->getCommentID() . "'";
        $record = $db->pselectRow($query, null);
        $score = array(
            'screen_pdd_incl_outcome' => null,
            'screen_pdd_excl_outcome' => null
        );
        //pdd inclusion
        // set to true. all inclusion items must be yes or flip to false.
        $score['screen_pdd_incl_outcome'] = 'True';
        if ($record['screen_pdd_incl_1'] <> 'yes') {
            $score['screen_pdd_incl_outcome'] = 'False';
        }
        if ($record['screen_pdd_incl_2'] <> 'yes') {
            $score['screen_pdd_incl_outcome'] = 'False';
        }
        if ($record['screen_pdd_incl_3'] <> 'yes') {
            $score['screen_pdd_incl_outcome'] = 'False';
        }
        if ($record['screen_pdd_incl_4'] <> 'yes') {
            $score['screen_pdd_incl_outcome'] = 'False';
        }
        $twoOrMore = 0;
        if ($record['screen_pdd_incl_5a'] == 'yes') {
            $twoOrMore++;
        }
        if ($record['screen_pdd_incl_5b'] == 'yes') {
            $twoOrMore++;
        }
        if ($record['screen_pdd_incl_5c'] == 'yes') {
            $twoOrMore++;
        }
        if ($record['screen_pdd_incl_5d'] == 'yes') {
            $twoOrMore++;
        }
        if ($twoOrMore<2) {
            $score['screen_pdd_incl_outcome'] = 'False';
        }

        //pdd exclusion
        // set to false. if any are true, set true.
        $score['screen_pdd_excl_outcome'] = 'False';
        if ($record['screen_pdd_excl_1'] == 'yes') {
            $score['screen_pdd_excl_outcome'] = 'True';
        }
        if ($record['screen_pdd_excl_2'] == 'yes') {
            $score['screen_pdd_excl_outcome'] = 'True';
        }
        // save the scores
        $db->update(
            $this->table,
            $score,
            array('CommentID'=>$this->getCommentID())
        );
    }
}
