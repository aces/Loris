<?php
/**
 * This file contains the NDB_BVL_Instrument_mri_parameter_form
 * class
 *
 * PHP Version 5
 *
 * @category Instrument
 * @package  Initial_MRI
 * @author   David Blader <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
/**
 * Creates the form elements for the mri_parameter_form instrument
 *
 * @category Instrument
 * @package  Initial_MRI
 * @author   David Blader <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_BVL_Instrument_mri_parameter_form extends NDB_BVL_Instrument
{
    use LegacyInstrumentTrait;

    var $ValidityEnabled  = false;
    var $ValidityRequired = false;
    var $_doubleDataEntryDiffIgnoreColumns = array(
        'CommentID',
        'UserID',
        'Testdate',
        'Window_Difference',
        'Candidate_Age',
        'Data_entry_completion_status',
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
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->formType = 'XIN';
        $this->form     = new LorisForm('mri_parameter_form_form');
        $this->page     = $page;

        // set the object properties
        $this->testName  = 'mri_parameter_form'; // test_names.Test_name
        $this->table     = 'mri_parameter_form';
        $this->commentID = $commentID; // data keyed by commentID

        //The array of dates/timestamps to convert to database dates/timestamps
        //Any LorisForm date elements must be listed here
        $this->dateTimeFields = array(
            "Date_taken",
            "scan_date",
        );

        //The array of selects with multiple answers allowed
        //Any LorisForm multiple selects must be listed here
        //$this->_selectMultipleElements = array();

        // required fields for data entry completion status
        $this->_requiredElements = array(
            'Examiner',
            'CommentID',
        );

        $config            = NDB_Config::singleton();
        $this->dateOptions = array(
            'language'         => 'en',
            'format'           => 'YMd',
            'minYear'          => $config->getSetting('startYear'),
            'maxYear'          => $config->getSetting('endYear'),
            'addEmptyOption'   => true,
            'emptyOptionValue' => null,
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
            "/mri_parameter_form(_page[0-9]+)/",
            $this->page,
            $matches
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
        $this->addHeader("MRI Parameter Form");

        $this->_addMetadataFields();
    }

    /**
     * Page 1
     *
     * @throws DatabaseException
     *
     * @return void
     */
    function _page1()
    {
        // Header
        $this->addHeader("MRI Parameter Form");
        $this->addBasicText(
            'mri_dataset_name',
            'MRI Dataset Name:'
        );

        $typesOfData = array(
            null                => '',
            'participant'       => 'Participant',
            'human_phantom'     => 'Human Phantom',
            'geometric_phantom' => 'Geometric Phantom',
        );

        $this->addSelect(
            'type_of_data',
            'Type of Data:',
            $typesOfData
        );
        // Get Name and MRI Alias from sites table for select options

        $query    = "SELECT Name, CenterID FROM psc";
        $db       = Database::singleton();
        $sitesRaw = $db->pselect($query, array());
        $sites    = array(null => '');
        foreach ($sitesRaw as $i) {
            $sites[$i['CenterID']] = $i['Name'];
        }
        $this->addSelect(
            'site',
            'MRI Site Name:',
            $sites
        );

        $this->addLabel("Total Duration of Session");
        $this->addNumericElement(
            'total_duration_hours',
            $this->indent . $this->indent . 'Hours:'
        );

        $this->addNumericElement(
            'total_duration_minutes',
            $this->indent . $this->indent . 'Minutes:'
        );

        $this->addBasicText(
            'mri_operator_name',
            'MRI Operator Name:'
        );

        $scanDateOptions           = $this->dateOptions;
        $scanDateOptions['format'] = 'dMY';

        $this->addBasicDate(
            'scan_date',
            "Scan Date:",
            $scanDateOptions
        );

        $acquiredOptions = array(
            null      => '',
            'yes'     => 'Yes',
            'partial' => 'Partial',
            'no'      => 'No',
        );

        $scanTypes = array(
            '3d_t1w'   => '3D-T1w',
            '2d_flair' => 'FLAIR',
            'fieldmapBOLD' => 'BOLD',
            't1' => 'T1',
            't2' => 'T2',
            'fMRI' => 'FMRI',
            'dwi25' => 'DWI 25',
            'dwi65' => 'DWI 65',
            'fieldmapDWI' => 'Fieldmap DWI',
        );

        $group[] = $this->createLabel('Sequences');
        $group[] = $this->createLabel('Acquired?');
        $group[] = $this->createLabel('Number of attempts');
        $group[] = $this->createLabel(
            'Comments (e.g. subject woke up, repeated series #, motion, name of '.
            'additional add-on acquisition if applicable)'
        );

        $group[] = $this->createLabel("Number of directions (DTI only)");

        $this->addGroup(
            $group,
            null,
            null,
            $this->_GUIDelimiter,
            false
        );
        unset($group);
        foreach ($scanTypes as $k => $v) {
            $group[] = $this->createLabel($v);
            $group[] = $this->createSelect(
                $k."_Scan_Done",
                "",
                $acquiredOptions
            );
            $group[] = $this->createText(
                $k."_number_attempts",
                ''
            );
            $group[] = $this->createTextArea(
                $k.'_comments',
                ''
            );

            $this->XINRegisterRule(
                $k.'_comments',
                array($k.'_Scan_Done{@}!={@}yes'),
                'Please provide comments as to why the scan was either not '.
                'or partially acquired.',
                $k.'_group'
            );

            $this->addGroup(
                $group,
                $k.'_group',
                null,
                $this->_GUIDelimiter,
                false
            );

            $this->XINRegisterRule(
                $k.'_Scan_Done',
                array($k.'_Scan_Done{@}=={@}'),
                'Required.',
                $k.'_group'
            );
            $this->XINRegisterRule(
                $k.'_number_attempts',
                array($k.'_number_attempts{@}=={@}'),
                'Please enter number of attempts for this sequence',
                $k.'_group'
            );

            unset($group);

        }
        $this->form->addFormRule(array(&$this, 'validateNumerics'));
    }

    /**
     * Validates numeric elements
     *
     * @param array $values The values
     *
     * @return array
     */
    function validateNumerics($values)
    {
        $errors = array();
        $offset = 0 - strlen('_number_attempts');

        foreach ($values as $k => $v) {
            if (substr($k, $offset) == '_number_attempts'
                && !is_numeric($v) && !empty($v)
            ) {
                $id = substr($k, 0, strlen($k) + $offset);
                $errors[$id . "_group"]
                    = "Please enter a numeric value for number of attempts.";
            }
        }
        if (!empty($errors)) {
            return $errors;
        } else{
            return true;
        }
    }
}