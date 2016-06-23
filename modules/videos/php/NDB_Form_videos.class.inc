<?php
/**
 * This file contains the NDB_Form_videos
 * class
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Videos
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */

require_once "NDB_Form.class.inc";
require_once "Utility.class.inc";
require_once "HTML/QuickForm.php";
require_once 'HTML/QuickForm/Renderer/Default.php';

/**
 * Creates the form for NDB_Form_videos
 *
 * @category Loris
 * @package  Videos
 * @author   Alex Ilea <ailea.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/CCNA/
 */
class NDB_Form_videos extends NDB_Form
{

    /**
     * Returns video meta data based on information in database
     *
     * @return array
     * @throws DatabaseException
     */
    function _getDefaults()
    {
        $defaults = [];

        if (!empty($this->identifier)) {
            $db =& Database::singleton();
            $defaults = $db->pselectRow(
                "SELECT * FROM videos WHERE record_id = '{$this->identifier}'", []
            );

            // set hide video confirm button to same value as hide video
            $defaults += ['hide_video_confirm' => $defaults['hide_video']];
        }

        return $defaults;
    }

    /**
     * Check user permissions
     *
     * @return bool - has access
     *
     * @throws ConfigurationException
     * @throws Exception
     */
    function _hasAccess()
    {
        $user =& User::singleton();
        $site =& Site::singleton($user->getData('CenterID'));

        if ($site->isStudySite()) {
            return $user->hasPermission('video_upload');
        }

        return false;
    }

    /**
     * Process video uploading or deletion.
     * Executed when form is submitted.
     *
     * @param array $values form data
     *
     * @return void
     * @throws DatabaseException
     */
    function _process($values)
    {
        // Set hide video status
        if ($values['hide_video'] && $values['hide_video_confirm']) {
            $values['hide_video'] = true;
        } else {
            $values['hide_video'] = false;
        }
        // Not a real DB field -> unset before posting
        unset($values['hide_video_confirm']);

        // Upload/Delete/Update
        $uploadResult = $this->_saveFile($values);

        if ($uploadResult["success"]) {
            $this->tpl_data['uploadMessage'] = true;
            $this->form->freeze();
        }

        if ($uploadResult["update"]) {
            $this->tpl_data['updateMessage'] = true;
        }

        if ($uploadResult["errorMsg"]) {
            $this->tpl_data['errorMessage'] = $uploadResult["errorMsg"];
        }

    }

    /**
     * Save the file to the Database
     *
     * @param array $values the array of values from the form
     *
     * @return true on success, false othewise
     * @access private
     */
    function _saveFile($values)
    {
        $config =& NDB_Config::singleton();
        $result = [
            "success" => false,
            "update"  => false
        ];

        if (isset($values['Date_taken'])) {
            $dateTaken = $values['Date_taken'];
            $values['Date_taken'] = sprintf(
                "%04d-%02d-%02d",
                $dateTaken['Y'],
                $dateTaken['M'],
                $dateTaken['d']
            );
        }

        if (!empty($this->identifier)) {
            $db =& Database::singleton();
            $db->update('videos', $values, ['record_id' => $this->identifier]);
            $result["update"] = true;
            return $result;
        } else {
            include_once "File_Upload.class.inc";
            $file = new File_Upload;

            // Pass the existing form ($form) by reference to File_Upload,
            // and register the file_upload field names being used.
            $file->registerForm($this->form);

            //Tell File_Upload what file handlers to use.
            $file->setFileHandler("video_file", $this);
            $file->overwriteMode = "overwrite";

            // Set the target directory that you want files moved into once
            // they are validated and processed.
            $videosPath = $config->getSetting('VideosPath');
            $file->setBaseUploadDirectory($videosPath);

            //Set the prefix to prepend to the filenames
            //$file->setFilenamePrefix($timepoint->getVisitLabel().
            //"-".$this->testName."-");

            $user =& User::singleton();

            //set the the IDs to the handler functions.
            $file->setHandlerArgs(
                ["user_id" => $user->getUsername(), "values" => $values]
            );

            // If the form is validated, call File_Upload::processFiles()
            // which loops through the files and proccesses them
            // (including verify, move, and import steps)
            $file->processFiles();

            //echo error messages
            if (!empty($file->errorLog)) {
                while (list($fileType, $fileErrors) = each($file->errorLog)) {
                    foreach ($fileErrors AS $error) {
                        $result["errorType"] = $fileType;
                        $result["errorMsg"] = $error;
                    }
                }

                return $result;
            }

            $result["success"] = true;

            return $result;
        }

    }

    /**
     * Setup QuickForm
     *
     * @param string $name       name
     * @param string $page       page
     * @param string $identifier identifier
     * @param string $commentID  commentID
     * @param string $formname   name of the form
     *
     * @return void
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        $this->form = new HTML_QuickForm($formname);
        $this->name = $name;
        $this->page = $page;
        $this->identifier = $identifier;
        $this->commentID = $commentID;
        $this->defaults = [];
    }

    /**
     * Validate the form
     *
     * @param array $values form values
     *
     * @return array
     */
    function _validate($values)
    {
        $errors = [];
        if ($values['hide_video'] || $values['hide_video_confirm']) {
            if (
                empty($values['hide_video']) || empty($values['hide_video_confirm'])
            ) {
                $errors['hide_video'] = "Must check BOTH boxes to delete";
            }
        }

        error_log(print_r($errors, true));

        return $errors;
    }

    /**
     * Display generated HTML on the page
     *
     * @return string
     */
    function display()
    {
        if (!$this->form->isFrozen()) {
            // hidden values
            $this->addHidden('test_name', $this->name);
            $this->addHidden('subtest', $this->page);
            $this->addHidden('identifier', $this->identifier);
        }

        // get the defaults
        $localDefaults = $this->_getDefaults();
        if (!is_array($localDefaults)) {
            $localDefaults = [];
        }

        // set the quickform object defaults
        $this->_setDefaults(array_merge($this->defaults, $localDefaults));

        // trim all values
        $this->form->applyFilter('__ALL__', 'trim');

        // display the HTML_Quickform object
        $smarty = new Smarty_neurodb($this->name);
        $renderer = new HTML_QuickForm_Renderer_ArraySmarty($smarty);
        $this->form->accept($renderer);
        $smarty->ModuleName = $this->name;
        $smarty->assign('form', $renderer->toArray());

        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("form_$this->template.tpl");

        return $html;
    }

    /**
     * Additional js files
     *
     * @return array
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL . "/videos/js/editForm.js"
            ]
        );
    }

    /**
     * The getTargetDirectory retrieves info about where the file should be stored.
     *
     * The returned directory is added to the baseUploadDirectory property.
     * It should have a trailing slash.
     *
     * @param string $file The full filename including directory.
     * @param Array  $args The list of arguments
     *
     * @return bool  $success if operation succeeded
     */
    function getTargetDirectory(&$file, $args)
    {
        return '';
    }

    /**
     * Transfer file to the server
     *
     * @param string $file file to upload
     * @param array  $args options
     *
     * @return bool
     * @throws DatabaseException
     */
    function importFile(&$file, $args)
    {
        $filename = $file->getDestinationFileName();
        $values = [
            'File_type'   => 'video_file',
            'File_name'   => $filename,
            'Data_dir'    => $file->getDestinationDirectory(),
            'File_size'   => $file->fileInfo['size'],
            'Instrument'  => $args['values']['Instrument'],
            'PSCID'       => $args['values']['PSCID'],
            'uploaded_by' => $args['user_id'],
            'For_site'    => $args['values']['For_site'],
            'visitLabel'  => $args['values']['visitLabel'],
            'Date_taken'  => $args['values']['Date_taken'],
            'comments'    => $args['values']['comments']
        ];

        $db =& Database::singleton();

        // SQL to run to check if the file's already
        $stmt = "SELECT * FROM videos WHERE Instrument = " .
            "'{$values['Instrument']}' AND PSCID = " .
            "'{$values['PSCID']}' AND visitLabel = " .
            "'{$values['visitLabel']}'";

        $row = $db->pselectRow($stmt, []);

        if (empty($row)) {
            // insert the event
            $result = $db->insert('videos', $values);
        } else {
            // update the event

            // include instrument in where criteria only if its set
            $instrument = [];
            if ($args['values']['Instrument'] != "") {
                $instrument = ['Instrument' => $args['values']['Instrument']];
            }
            $whereCriteria = [
                    'PSCID'      => $args['values']['PSCID'],
                    'visitLabel' => $args['values']['visitLabel'],
                ] + $instrument;

            $values['hide_video'] = false;
            $result = $db->update('videos', $values, $whereCriteria);
        }

        return $result;
    }

    /**
     * Form valdation
     *
     * @param string $file file to upload
     * @param array  $args options
     *
     * @return array|bool
     * @throws DatabaseException
     */
    function isValid(&$file, $args)
    {
        $errors = [];
        $correct_filename = $args['values']['PSCID'] . '_' .
            $args['values']['candID'] . '_' .
            $args['values']['visitLabel'] . '_' .
            $args['values']['Instrument'];

        if (!preg_match("/^{$correct_filename}/i", $file->fileInfo['name'])) {
            $errors[] = "Incorrect Filename: Filename begin with: " .
                $correct_filename;
        }

        if (count($errors) > 0) {
            return $errors;
        }

        return true;
    }

    /**
     * Convert data fetched from database to format accepted by
     * form wrappers of <select> element
     *
     * @param array  $options options array
     * @param string $item    options value
     *
     * @return array
     */
    function toSelect($options, $item, $item2)
    {
        $selectOptions = [];

        $optionsValue = $item;
        if (isset($item2)) { $optionsValue = $item2; }

        foreach ($options as $key => $value) {
            $selectOptions[$options[$key][$optionsValue]] = $options[$key][$item];
        }

        return $selectOptions;
    }

    function edit_video()
    {

    }

    /**
     * Generate the form displayed on video_upload page
     *
     * @return void
     * @throws DatabaseException
     * @throws Exception
     * @throws LorisException
     */
    function video_upload()
    {
        // create user object
        $user =& User::singleton();
        $site =& Site::singleton($user->getData('CenterID'));
        $config =& NDB_Config::singleton();
        $db =& Database::singleton();

        $dateOptions = [
            'language'         => 'en',
            'format'           => 'YMd',
            'minYear'          => $config->getSetting('startYear'),
            'maxYear'          => $config->getSetting('endYear'),
            'addEmptyOption'   => true,
            'emptyOptionValue' => null
        ];

        $instruments = $db->pselect(
            "SELECT Test_name FROM test_names ORDER BY Test_name", []
        );
        $instruments = [null => ""] +
            $this->toSelect($instruments, "Test_name");

        $candidates = $db->pselect(
            "SELECT CandID, PSCID FROM candidate ORDER BY PSCID", []
        );

        $candidatesList = [null => ""] + $this->toSelect($candidates, "PSCID");

        // pass candidate ids to frontend for validation purposes
        $candIdList = $this->toSelect($candidates, "CandID", "PSCID");
        $this->tpl_data['candIDs'] = $candIdList;

        $visitList = [null => ""] + Utility::getVisitList();
        $siteList = [null => ""] + Utility::getSiteList(false);

        $readOnly = [];
        if ($this->identifier != "") {
            $readOnly = ['readonly' => 'readonly'];
        }

        $this->addSelect(
            "PSCID",
            "PSCID",
            $candidatesList,
            ['id' => 'candidateSelect'] + $readOnly
        );
        $this->addSelect(
            "visitLabel",
            "Visit Label",
            $visitList,
            ['id' => 'visitSelect'] + $readOnly
        );
        $this->addSelect(
            "Instrument",
            "Instrument",
            $instruments,
            ['id' => 'instrumentSelect'] + $readOnly
        );
        $this->addBasicDate(
            'Date_taken',
            'Date of Administration',
            $dateOptions
        );
        $this->addSelect(
            "For_site",
            "Site This File is Being Uploaded For",
            $siteList
        );
        $this->addBasicTextArea(
            "comments",
            "Comments (optional)",
            ['rows' => 5, 'cols' => 50]
        );

        if ($this->identifier) {
            $this->form->addElement(
                'static', 'File_name', 'File name', ["class" => "fileUpload"]
            );
        } else {
            $this->form->addElement(
                'file', 'video_file', 'File to Upload', ["class" => "fileUpload"]
            );
            $this->form->addRule('video_file', 'No file selected.', 'required');
        }

        $this->form->addRule('PSCID', 'PSCID required.', 'required');
        $this->form->addRule('visitLabel', 'Visit Label is required.', 'required');

        $this->form->addElement("checkbox", "hide_video", "Hide Video");
        $this->form->addElement("checkbox", "hide_video_confirm", "");

        $uploaded_by = $db->pselectOne(
            "SELECT uploaded_by FROM videos WHERE record_id=:identifier",
            [':identifier' => $this->identifier]
        );
        if ($uploaded_by == $user->getUsername()) {
            $this->tpl_data['has_delete_permission'] = true;
        }
        $this->form->addFormRule([&$this, '_validate']);
    }


}
