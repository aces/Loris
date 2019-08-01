<?php
class NDB_BVL_Instrument_radiology_review extends NDB_BVL_Instrument
{
    use LegacyInstrumentTrait;

    var $ValidityEnabled = false;
    var $ValidityRequired = false;

    /**
     * sets up basic data, such as the HTML_Quickform object, and so on.
     *
     * @param  string $commentID the CommentID identifying the data to load
     * @param  string $page      if a multipage form, the page to show
     *
     * @return void
     * @access public
     */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->formType = "XIN";
        $this->form = new LorisForm('test_form');
        $this->page = $page;

        // set the object properties
        $this->testName = "radiology_review";  // test_names.Test_name
        $this->table = 'radiology_review';  // name of table containing

        // data keyed by commentID
        $this->commentID = $commentID;

        $this->_requiredElements = array(
            'Date_taken',
            'Examiner'
        );

        $this->dateTimeFields = array(
            'Date_taken',
            'MRI',
            'Review'
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
    function _setupForm()
    {
        //Defines the call back function for HTML Quickform to use when validating the form.
        $this->form->addFormRule([&$this, 'XINValidate']);

        // display test name
        $this->addHeader(
            "Radiology Review Form"
        );

        // automatically adds examiner & date of administration
        $this->_addMetadataFields();

        $yes_no_option = [
            null           => "",
            "no"           => "No",
            "yes"          => "Yes",
            "not_answered" => "Not Answered",
        ];
        $normal_option = [
            null           => "",
            "normal"       => "Normal",
            "abnormal"     => "Abnormal",
            "atypical"     => "Atypical",
            "not_answered" => "Not Answered",
        ];
        $exclusionaryOrNot = [
            null               => "",
            "exclusionary"     => "Exclusionary",
            "non_exclusionary" => "Non-Exclusionary",
            "not_answered"     => "Not Answered",
        ];

        $this->addHeader(
            '3D T1 MP-Rage'
        );
        $this->addSelect(
            'Scan_done',
            'Was an MRI performed?',
            $yes_no_option
        );
        $this->addLabel(
            'If Yes?'
        );

        $this->addDateElement(
            'MRI',
            'Date of MRI acquisition'
        );

        $this->XINRegisterRule(
            "MRI_date",
            ["Scan_done{@}=={@}yes"],
            "Please enter the scan information",
            "MRI_date_group"
        );
        $this->addDateElement(
            'Review',
            'Date of local radiology review'
        );
        $this->XINRegisterRule(
            "Review_date",
            ["Scan_done{@}=={@}yes"],
            "Please enter the scan information",
            "Review_date_group"
        );

        $this->addSelect(
            'Review_results',
            'Results of local radiology review?',
            $normal_option
        );
        $this->XINRegisterRule(
            "Review_results",
            ["Scan_done{@}=={@}yes"],
            "Please enter the scan information"
        );

        $this->addSelect(
            'abnormal_atypical_exclusionary',
            $this->indent . "If the results are ABNORMAL or ATYPICAL:",
            $exclusionaryOrNot
        );

        $this->XINRegisterRule(
            'abnormal_atypical_exclusionary',
            ['Review_results{@}=={@}abnormal|atypical'],
            "Please indicate if the Abnormal or Atypical review is Exclusionary or Not."
        );

        $this->addLabel(
            $this->indent . $this->indent .
            'If Abnormal or Atypical, describe incidental finding(s)'
        );
        $this->addTextAreaElement(
            'Incidental_findings',
            $this->indent . $this->indent .
            'Description of incidental findings:',
            ["Review_results{@}=={@}abnormal"],
            "Please describe the abnormality"
        );
    } // End Setup form
}