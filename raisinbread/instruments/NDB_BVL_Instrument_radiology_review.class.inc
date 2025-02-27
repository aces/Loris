<?php
class NDB_BVL_Instrument_radiology_review extends NDB_BVL_Instrument
{
    use LegacyInstrumentTrait;
    use \LorisFormDictionaryImpl;

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
            $this->getLangLabel('header')
        );

        // automatically adds examiner & date of administration
        $this->_addMetadataFields();

        $yes_no_option = $this->getLangLabel('yes_no_option');

        $normal_option = $this->getLangLabel('normal_option');
        $exclusionaryOrNot = $this->getLangLabel('exclusionaryOrNot');

        $this->addHeader(
            $this->getLangLabel('3d_t1_mp_rage')
        );
        $this->addSelect(
            'Scan_done',
            $this->getLangLabel('Scan_done'),
            $yes_no_option
        );
        $this->addLabel(
            $this->getLangLabel('if_yes')
        );

        $this->addDateElement(
            'MRI',
            $this->getLangLabel('MRI_date')
        );

        $this->XINRegisterRule(
            "MRI_date",
            ["Scan_done{@}=={@}yes"],
            $this->getLangLabel('enter_scan_info'),
            "MRI_date_group"
        );
        $this->addDateElement(
            'Review',
            $this->getLangLabel('Review_date')
        );
        $this->XINRegisterRule(
            "Review_date",
            ["Scan_done{@}=={@}yes"],
            $this->getLangLabel('enter_scan_info'),
            "Review_date_group"
        );

        $this->addSelect(
            'Review_results',
            $this->getLangLabel('Review_results'),
            $normal_option
        );
        $this->XINRegisterRule(
            "Review_results",
            ["Scan_done{@}=={@}yes"],
            $this->getLangLabel('enter_scan_info')
        );

        $this->addSelect(
            'abnormal_atypical_exclusionary',
            $this->indent . $this->getLangLabel('abnormal_atypical_exclusionary'),
            $exclusionaryOrNot
        );

        $this->XINRegisterRule(
            'abnormal_atypical_exclusionary',
            ['Review_results{@}=={@}abnormal|atypical'],
            $this->getLangLabel("abnormal_atypical_exclusionary_rule")
        );

        $this->addLabel(
            $this->indent . $this->indent .
            $this->getLangLabel('Incidental_findings_message')
        );
        $this->addTextAreaElement(
            'Incidental_findings',
            $this->indent . $this->indent .
            $this->getLangLabel('Incidental_findings'),
            ["Review_results{@}=={@}abnormal"],
            $this->getLangLabel("describe_abnormality")
        );
    } // End Setup form
}
