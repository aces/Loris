<?php
/**
 * This file contains the NDB_BVL_Instrument_EEG_Acquisition
 * class
 *
 * PHP Version 5
 *
 * @category Instrument
 * @package  EEG_Acquisition
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/loris/
 */

/**
 * Creates the form elements for the Boston_Diagnostic_Aphasia_Exam instrument
 *
 * @category Instrument
 * @package  EEG_Acquisition
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/loris/
 */
class NDB_BVL_Instrument_EEG_Acquisition extends NDB_BVL_Instrument
{
    use \LorisFormDictionaryImpl;


    function getFullName(): ?string
    {
        return $this->testName;
    } 
    
    function getSubtestList() : array
    {
        return [];
    }

    /**
     * Sets up basic data.
     *
     * @param string $commentID the CommentID identifying the data to load
     * @param string $page      if a multipage form, the page to show
     *
     * @return void
     * @access public
     */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $formName       = 'EEG_Acquisition';
        $this->formType = "XIN";
        $this->form     = new LorisForm($formName);
        $this->page     = $page; // page label

        // set the object properties
        // Corresponds to the Test_name column in test_names table
        $this->testName  = $formName;
        // name of database table corresponding to instrument
        $this->table     = $formName;
        // data keyed by commentID
        $this->commentID = $commentID;

        //The array of selects with multiple answers allowed
        $this->selectMultipleElements = array();

        //The array of dates/timestamps to convert to database dates/timestamps
        //Any LorisForm date elements must be listed here
        // $this->dateTimeFields = array("Date_taken");
        $config               = \NDB_Config::singleton();
        $this->dateOptions    = array(
            'language'         => 'en',
            'format'           => 'YMd',
            'minYear'          => $config->getSetting('startYear'),
            'maxYear'          => $config->getSetting('endYear'),
            'addEmptyOption'   => true,
            'emptyOptionValue' => null,
        );

        // required fields for data entry completion status
        $this->_requiredElements = array(
            'Date_taken',
        );

        // mulitple select elements
        $this->selectMultipleElements = [];

        // setup the form
        $this->_setupForm();

    }

    /**
     * Builds the object into a paginated form
     *
     * @return void
     * @access private
     */
    function _setupForm()
    {
        if (preg_match("/EEG_Acquisition(_page[0-9]+)/", $this->page, $matches)) {
            call_user_func(array($this, $matches[1]));
        } else {
            $this->_main();
        }
        // Defines the call back function to use in validation
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

        $yesNoOnlyOptions = [
            "yes" => "Yes",
            "no"  => "No"
        ];

        $textAreaOptions = [
            'cols'=>25, 
            'rows'=>4
        ];

        $attemptsOptions = [
            null          => "",
            "1"           => "1",
            "2"           => "2",
            "3"           => "3",
            "4"           => "4",
            "more_than_5" => "More than 5"
        ];

        $moodRatingOptions = [
            null=> "",
            "1" => "1 - Screaming, fussed out",
            "2" => "2",
            "3" => "3",
            "4" => "4",
            "5" => "5 - Very calm the whole time"
        ];

        // display test name
        $this->addHeader("EEG Acquisition");

        // automatically adds examiner & date of administration
        $this->_addMetadataFields();

        // =============================
        // ==== A. General informations
        $this->form->addStatic(
            null, 
            "<b><h3>General informations</h3></b>"
        );

        // Research staff
        // at least one required
        $this->addBasicText(
            'research_staff_one', 
            'Research staff 1 initials'
        );
        
        $this->addBasicText(
            'research_staff_two', 
            'Research staff 2 initials'
        );
        $this->XINRegisterRule(
            'research_staff_two', 
            ["research_staff_two{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );
        
        $this->addBasicText(
            'research_staff_three', 
            'Research staff 3 initials'
        );
        $this->XINRegisterRule(
            'research_staff_three', 
            ["research_staff_three{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );

        // Testing room
        $this->addBasicText(
            "session_testing_room",
            "Testing room information"
        );
        $this->XINRegisterRule(
            'session_testing_room', 
            ["session_testing_room{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );

        // behavioural assistance
        $this->addSelect(
            "subject_behavioral_assistant_present",
            "Is there a behavioral assistant?",
            $yesNoOnlyOptions
        );

        $this->addBasicText(
            "subject_behavioral_assistant",
            $this->indent . "Subject Behavioral assistant initials"
        );
        $this->XINRegisterRule(
            'subject_behavioral_assistant', 
            ['subject_behavioral_assistant_present{@}=={@}yes'], 
            'Required if there is a behavioural assistant'
        );

        // medication
        $this->addSelect(
            "subject_medication",
            "Is subject under medication?",
            $yesNoOnlyOptions
        );
        $this->addBasicTextArea(
            "subject_medication_dosage",
            $this->indent . "Describe the medication and dosage",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'subject_medication_dosage', 
            ['subject_medication{@}=={@}yes'], 
            'Required if there is an ongoing medication'
        );

        // head measurement
        $this->addSelect(
            "head_measurement_unit",
            "What is the unit used for head measurement?",
            [
                "cm" => "Centimeters (cm)",
                "in"  => "Inches (in)"
            ]
        );

        $this->addNumericElement(
            "head_measurement",
            "What is the head measurement value?"
        );

        // EKG collected?
        $this->addSelect(
            "ekg_collected",
            "EKG Collected?",
            $yesNoOnlyOptions
        );
        
        // distance from monitor
	    $this->addSelect(
            "participant_away_60cm_from_monitor",
            "Participant is 60cm away from monitor?", 
            $yesNoOnlyOptions
        );
        $this->addBasicTextArea(
            "participant_away_60cm_from_monitor_reason",
            $this->indent . "If No, please explain the reason",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'participant_away_60cm_from_monitor_reason', 
            ['participant_away_60cm_from_monitor{@}=={@}no'], 
            'Required if participant cannot be 60cm away from montior'
        );


        // =============================
        // ==== B. Net informations
        $this->form->addStatic(
            null, 
            "<b><h3>Net informations</h3></b>"
        );

        // Net id
        $this->addBasicText(
            "net_id",
            "What is the net identifier?",
        );

        // impedance
        $this->addSelect(
            "impedance_measured_before_netting",
            "Impedances measure before netting?",
            $yesNoOnlyOptions
        );
        $this->addBasicText(
            "impedance_measure",
            $this->indent . "Register the impedance measured"
        );
        $this->XINRegisterRule(
            'impedance_measure', 
            ['impedance_measured_before_netting{@}=={@}yes'], 
            'Required when impedance is measured'
        );

        // bad channels
        $this->addSelect(
            "bad_channels_measured_after_netting",
            "Bad channels measured after netting?",
            $yesNoOnlyOptions
        );
        $this->addBasicTextArea(
            "bad_channels",
            $this->indent . "Register all bad channels",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'bad_channels', 
            ['bad_channels_measured_after_netting{@}=={@}yes'], 
            'Required when bad channels are present'
        );

        // net placement quality
        $this->form->addElement(
            'static', 
            null, 
            "<h6>For net placement question:<br/>
                <b>Excellent</b> - meets all criteria for proper net placement.<br/>
                <b>Average</b> - any 1-2cm shift from proper placement (1 pinky finger width distance).<br/>
                <b>Poor</b> - any >2 cm shift from proper placement (>1 pinky finger width distance).
            </h6>"
        );

        $this->addSelect(
            "net_placement",
            "Net placement",
            [
                "na"        => "n/a",
                "excellent" => "Excellent",
                "average"   => "Average" ,
                "poor"      => "Poor"
            ]
        );

        $this->addBasicTextArea(
            "net_placement_comment",
            $this->indent . "Any comment on net placement",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'net_placement_comment', 
            ['net_placement{@}=={@}na'], 
            'Required when net placement is not available'
        );

        // photos of the net placement
        $this->addSelect(
            "net_placement_photos_taken",
            "Placement photos taken?",
            $yesNoOnlyOptions
        );


        // Electrodes

        // acquisition software
        $this->addSelect(
            "acquisition_software",
            "Acquisition software used",
            [
                "eemagine"              => "Eemagine",
                "neuro_scan"            => "(Neuro)scan",
                "insep"                 => "InsEP",
                "biosemi"               => "BioSemi",
                "netstation"            => "NetStation",
                "brain_vision_recorder" => "Brain Vision Recorder",
                "emotiv"                => "Emotiv",
                "actiview605_lores"     => "ActiView605-Lores",
                "eeprobe"               => "EEProbe",
                "tmsi"                  => "TMSi",
                "other"                 => "Other"
            ]
        );
        $this->addBasicText(
            "acquisition_software_other",
            $this->indent . "If other, please specify"
        );
        $this->XINRegisterRule(
            'acquisition_software_other', 
            ['acquisition_software{@}=={@}other'], 
            'Required when acquisition software is other'
        );


        // recording reference
        $this->addSelect(
            "recording_reference",
            "Recording reference used",
            [
                "left_mastoid"                      => "left mastoid",
                "right_mastoid"                     => "right mastoid",
                "left_earlobe"                      => "left earlobe",
                "right_earlobe"                     => "right earlobe",
                "physically_linked_mastoids"        => "physically linked mastoids",
                "physically_linked_earlobes"        => "physically linked earlobes",
                "cz"                                => "Cz",
                "tip_nose"                          => "tip of the nose",
                "balanced_non_cephalic_reference"   => "balanced non-cephalic reference",
                "other"                             => "Other"
            ]
        );
        $this->addBasicText(
            "recording_reference_other",
            $this->indent . "If other, please specify"
        );
        $this->XINRegisterRule(
            'recording_reference_other', 
            ['recording_reference{@}=={@}other'], 
            'Required when recording reference is other'
        );

        // number of active channels
        $this->addNumericElement(
            "number_active_channels",
            "Number of active channels"
        );

        // EOG channles
        $this->addSelect(
            "eog_channels",
            "EOG channels",
            [
                "no_eog_channels"            => "no EOG channels",
                "two_heog_channels_only"     => "two HEOG channels only",
                "two_veog_channels_only"     => "two VEOG channels only",
                "two_heog_two_veog_channels" => "two HEOG and two VEOG channels",
                "other"                      => "Other"
            ]
        );
        $this->addBasicText(
            "eog_channels_other",
            $this->indent . "If other, please specify"
        );
        $this->XINRegisterRule(
            'eog_channels_other', 
            ['eog_channels{@}=={@}other'], 
            'Required when EOG channels is other'
        );

        // number of active channels
        $this->addBasicTextArea(
            "artefacted_channels",
            "Artefacted channels",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'artefacted_channels', 
            ["artefacted_channels{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );


        // =============================
        // ==== C. EEG Acquisition
        $this->form->addStatic(
            null, 
            "<b><h3>EEG Acquisition</h3></b>"
        );

        // bad channels
        $this->addSelect(
            "bad_electrodes_present",
            "Were there any bad electrodes during impedances?",
            $yesNoOnlyOptions
        );
        $this->addBasicTextArea(
            "bad_electrodes",
            $this->indent . "If Yes, please register all bad electrodes",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'bad_electrodes',
            ['bad_electrodes_present{@}=={@}yes'], 
            'Required when bad electrodes are present'
        );


        // hardware filters
        $this->addBasicTextArea(
            "hardware_filters_applied",
            "What hardware filters were applied before acquisition?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'hardware_filters_applied', 
            ["hardware_filters_applied{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );

        // software filters
        $this->addBasicTextArea(
            "software_filters_applied",
            "What software filters were applied during acquisition?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'software_filters_applied', 
            ["software_filters_applied{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );

        // timing
        $this->addHourMinElement(
            "eeg_session_start_time", 
            "EEG session Start time"
        );

        $this->addHourMinElement(
            "eeg_session_end_time", 
            "EEG session End time"
        );
        
        /// ==== REST STATE

        $this->form->addStatic(
            null, 
            "<h3>Resting state task</h3>"
        );

        $this->form->addElement(
            'static', 
            null, 
            "<h6>*scroll through <u>all channels</u> to check for good signal after starting video<br/>
            (if bad signal: pause task, continue task when signal looks good in recording)</h6>"
        );

        // resting state acquired
        $this->addSelect(
            "resting_state_eeg_acquired", 
            "Resting State EEG Acquired?",
            [
                null          => "",
                "not_started" => "Not Started",
                "complete"    => "Complete",
                "incomplete"  => "Incomplete",
            ]
        );
        $this->addBasicTextArea(
            "resting_state_eeg_incomplete_reason",
            $this->indent . "If Incomplete, why were you unable to complete the task?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'resting_state_eeg_incomplete_reason', 
            ['resting_state_eeg_acquired{@}=={@}incomplete'], 
            'Required when resting state acquiring is incomplete'
        );

        // number of attempts
        $this->addSelect(
            "resting_state_attempts",
            "Number of attempts",
            $attemptsOptions
        );

        // mood
        $this->addSelect(
            "resting_state_eeg_mood_rating", 
            $this->indent . "Resting State EEG Mood Rating",
            $moodRatingOptions
        );
        $this->addBasicTextArea(
            "resting_state_eeg_mood_rating_comments",
            $this->indent . "Any comment on the mood?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'resting_state_eeg_mood_rating_comments', 
            ["resting_state_eeg_mood_rating_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );

        // comments
        $this->addBasicTextArea(
            "resting_state_comments",
            $this->indent . "Any comment on the resting state?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'resting_state_comments', 
            ["resting_state_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );




        /// ==== VEP task

        $this->form->addStatic(
            null, 
            "<h3>VEP task</h3>"
        );

        $this->addSelect(
            "paradigm_vep_used",
            "VEP paradigm used?",
            $yesNoOnlyOptions
        );

        $this->form->addElement(
            'static', 
            null, 
            "<h6>*scroll through <u>all channels</u> to check for good signal after starting video<br/>
            (if bad signal: pause task, continue task when signal looks good in recording)</h6>"
        );

        // resting state acquired
        $this->addSelect(
            "vep_eeg_acquired", 
            "VEP EEG Acquired?",
            [
                null          => "",
                "not_started" => "Not Started",
                "complete"    => "Complete",
                "incomplete"  => "Incomplete",
            ]
        );
        $this->XINRegisterRule(
            'vep_eeg_acquired',
            ['paradigm_vep_used{@}=={@}yes'], 
            'Required when VEP is used'
        );

        $this->addBasicTextArea(
            "vep_eeg_incomplete_reason",
            $this->indent . "If Incomplete, why were you unable to complete the task?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'vep_eeg_incomplete_reason', 
            ['vep_eeg_acquired{@}=={@}incomplete'], 
            'Required when VEP acquiring is incomplete'
        );

        // number of attempts
        $this->addSelect(
            "vep_attempts",
            "Number of attempts",
            $attemptsOptions
        );
        $this->XINRegisterRule(
            'vep_attempts',
            ['paradigm_vep_used{@}=={@}yes'], 
            'Required when VEP is used'
        );

        // mood
        $this->addSelect(
            "vep_eeg_mood_rating", 
            $this->indent . "VEP EEG Mood Rating",
            $moodRatingOptions
        );
        $this->XINRegisterRule(
            'vep_eeg_mood_rating',
            ['paradigm_vep_used{@}=={@}yes'], 
            'Required when VEP is used'
        );
        $this->addBasicTextArea(
            "vep_eeg_mood_rating_comments",
            $this->indent . "Any comment on the mood?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'vep_eeg_mood_rating_comments', 
            ["vep_eeg_mood_rating_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );

        // comments
        $this->addBasicTextArea(
            "vep_comments",
            $this->indent . "Any comment on the VEP task?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'vep_comments', 
            ["vep_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );



        /// ==== AEP task

        $this->form->addStatic(
            null, 
            "<h3>AEP task</h3>"
        );

        $this->addSelect(
            "paradigm_aep_used",
            "AEP paradigm used?",
            $yesNoOnlyOptions
        );

        $this->form->addElement(
            'static', 
            null, 
            "<h6>*scroll through <u>all channels</u> to check for good signal after starting video<br/>
            (if bad signal: pause task, continue task when signal looks good in recording)</h6>"
        );

        // resting state acquired
        $this->addSelect(
            "aep_eeg_acquired", 
            "AEP EEG Acquired?",
            [
                null          => "",
                "not_started" => "Not Started",
                "complete"    => "Complete",
                "incomplete"  => "Incomplete",
            ]
        );
        $this->XINRegisterRule(
            'aep_eeg_acquired',
            ['paradigm_aep_used{@}=={@}yes'], 
            'Required when AEP is used'
        );
        $this->addBasicTextArea(
            "aep_eeg_incomplete_reason",
            $this->indent . "If Incomplete, why were you unable to complete the task?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'aep_eeg_incomplete_reason', 
            ['aep_eeg_acquired{@}=={@}incomplete'], 
            'Required when AEP acquiring is incomplete'
        );

        // number of attempts
        $this->addSelect(
            "aep_attempts",
            "Number of attempts",
            $attemptsOptions
        );
        $this->XINRegisterRule(
            'aep_attempts',
            ['paradigm_aep_used{@}=={@}yes'], 
            'Required when AEP is used'
        );

        // mood
        $this->addSelect(
            "aep_eeg_mood_rating", 
            $this->indent . "AEP EEG Mood Rating",
            $moodRatingOptions
        );
        $this->XINRegisterRule(
            'aep_eeg_mood_rating',
            ['paradigm_aep_used{@}=={@}yes'], 
            'Required when AEP is used'
        );
        $this->addBasicTextArea(
            "aep_eeg_mood_rating_comments",
            $this->indent . "Any comment on the mood?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'aep_eeg_mood_rating_comments', 
            ["aep_eeg_mood_rating_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );

        // comments
        $this->addBasicTextArea(
            "aep_comments",
            $this->indent . "Any comment on the AEP task?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'aep_comments', 
            ["aep_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );




        /// ==== MMN task

        $this->form->addStatic(
            null, 
            "<h3>MMN task</h3>"
        );

        $this->addSelect(
            "paradigm_mmn_used",
            "MMN paradigm used?",
            $yesNoOnlyOptions
        );

        $this->form->addElement(
            'static', 
            null, 
            "<h6>*scroll through <u>all channels</u> to check for good signal after starting video<br/>
            (if bad signal: pause task, continue task when signal looks good in recording)</h6>"
        );

        // resting state acquired
        $this->addSelect(
            "mmn_eeg_acquired", 
            "MMN EEG Acquired?",
            [
                null          => "",
                "not_started" => "Not Started",
                "complete"    => "Complete",
                "incomplete"  => "Incomplete",
            ]
        );
        $this->XINRegisterRule(
            'mmn_eeg_acquired',
            ['paradigm_mmn_used{@}=={@}yes'], 
            'Required when MMN is used'
        );
        $this->addBasicTextArea(
            "mmn_eeg_incomplete_reason",
            $this->indent . "If Incomplete, why were you unable to complete the task?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'mmn_eeg_incomplete_reason', 
            ['mmn_eeg_acquired{@}=={@}incomplete'], 
            'Required when AEP acquiring is incomplete'
        );

        // number of attempts
        $this->addSelect(
            "mmn_attempts",
            "Number of attempts",
            $attemptsOptions
        );
        $this->XINRegisterRule(
            'mmn_attempts',
            ['paradigm_mmn_used{@}=={@}yes'], 
            'Required when MMN is used'
        );

        // mood
        $this->addSelect(
            "mmn_eeg_mood_rating", 
            $this->indent . "MMN EEG Mood Rating",
            $moodRatingOptions
        );
        $this->XINRegisterRule(
            'mmn_eeg_mood_rating',
            ['paradigm_mmn_used{@}=={@}yes'], 
            'Required when MMN is used'
        );
        $this->addBasicTextArea(
            "mmn_eeg_mood_rating_comments",
            $this->indent . "Any comment on the mood?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'mmn_eeg_mood_rating_comments', 
            ["mmn_eeg_mood_rating_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );

        // comments
        $this->addBasicTextArea(
            "mmn_comments",
            $this->indent . "Any comment on the MMN task?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'mmn_comments', 
            ["mmn_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );





        /// ==== Faces task

        $this->form->addStatic(
            null, 
            "<h3>Faces task</h3>"
        );

        $this->addSelect(
            "paradigm_faces_used",
            "Human Faces paradigm used?",
            $yesNoOnlyOptions
        );

        $this->form->addElement(
            'static', 
            null, 
            "<h6>*scroll through <u>all channels</u> to check for good signal after starting video<br/>
            (if bad signal: pause task, continue task when signal looks good in recording)</h6>"
        );

        // resting state acquired
        $this->addSelect(
            "faces_eeg_acquired", 
            "Faces EEG Acquired?",
            [
                null          => "",
                "not_started" => "Not Started",
                "complete"    => "Complete",
                "incomplete"  => "Incomplete",
            ]
        );
        $this->XINRegisterRule(
            'faces_eeg_acquired',
            ['paradigm_faces_used{@}=={@}yes'], 
            'Required when Faces is used'
        );
        $this->addBasicTextArea(
            "faces_eeg_incomplete_reason",
            $this->indent . "If Incomplete, why were you unable to complete the task?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'faces_eeg_incomplete_reason', 
            ['faces_eeg_acquired{@}=={@}incomplete'], 
            'Required when Faces acquiring is incomplete'
        );

        // number of attempts
        $this->addSelect(
            "faces_attempts",
            "Number of attempts",
            $attemptsOptions
        );
        $this->XINRegisterRule(
            'faces_attempts',
            ['paradigm_faces_used{@}=={@}yes'], 
            'Required when Faces is used'
        );

        // mood
        $this->addSelect(
            "faces_eeg_mood_rating", 
            $this->indent . "Faces EEG Mood Rating",
            $moodRatingOptions
        );
        $this->XINRegisterRule(
            'faces_eeg_mood_rating',
            ['paradigm_faces_used{@}=={@}yes'], 
            'Required when Faces is used'
        );
        $this->addBasicTextArea(
            "faces_eeg_mood_rating_comments",
            $this->indent . "Any comment on the mood?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'faces_eeg_mood_rating_comments', 
            ["faces_eeg_mood_rating_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );

        // comments
        $this->addBasicTextArea(
            "faces_comments",
            $this->indent . "Any comment on the Faces task?",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'faces_comments', 
            ["faces_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );

        // =============================
        // ==== D. General comments
        $this->form->addStatic(
            null, 
            "<b><h3>General session comments and notes</h3></b>"
        );

        // general notes and comments
        $this->addBasicTextArea(
            "general_comments",
            "General session notes, any important details (e.g. technical error, issue with net, etc.)",
            $textAreaOptions
        );
        $this->XINRegisterRule(
            'general_comments', 
            ["general_comments{@}=={@}NEVER_REQUIRED"], 
            "Not Required"
        );
    }
}
