<?php
/**
 * Handles utility tasks for Dicom fileset upload and processing
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Dumisizwe Vuyo Bhembe <dumisizwe@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API\Candidates\Candidate\Visit\Dicoms;
require_once __DIR__ . '/../../Visit.php';
require_once __DIR__ . '/../../../../../../modules/imaging_uploader/php/imaging_uploader.class.inc';
require_once __DIR__ . '/../../../../../../modules/imaging_uploader/php/module.class.inc';
/**
 * Handles utility tasks for Dicom fileset upload and processing
 *
 * @category Main
 * @package  API
 * @author   Dumisizwe Vuyo Bhembe <dumisizwe@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class DicomUploadHelper extends \LORIS\imaging_uploader\Imaging_Uploader
{
    // so we can use File_Upload::preProcessFile()
    var $info     = null;
    var $tmp_name = '';
    var $processDbId;
    /**
     * Construct a DicomUploadHelper class object
     */
    public function __construct()
    {

        $this->info          = array();
        $this->tmp_name      = '';
        $this->processDbId   = 0;
        $this->mri_upload_id = 0;

        //Instantiate a helper module so we can use Imaging_Uploader module
        //ApiImagingUploader is just a random string.
        //All other parametres to constructor are null
        $module = new \LORIS\imaging_uploader\Module("module", '');
        parent::__construct($module, '', '', '', 'ApiImagingUploader');

    }

    /**
     * Returns true if the _saveFile has successfully
     * completed
     * Overload Imaging_Uploader::_process()
     *
     * @param array $values           the array of values
     * @param bool  $trigger_pipeline Trigger imaging pipeline manually
     *
     * @return int ID (in the database) of the launched process
     * or false if processing was not attempted
     */
    function _process($values, $trigger_pipeline=false)
    {
        if ($this->_saveFile($values)) {
            // Save file succeeded. All that's left to do is launch the MRI
            // pipeline if the auto-launch switch is on
            $config = \NDB_Config::singleton();
            $ImagingUploaderAutoLaunch = $config->getSetting(
                'ImagingUploaderAutoLaunch'
            );
            if ($ImagingUploaderAutoLaunch || $trigger_pipeline) {
                // Instanciate the server process module to autoload
                // its namespace classes
                $spm_module = \Module::factory('server_processes_manager');
                // Perform the real upload on the server
                $serverProcessLauncher = new SP\ServerProcessLauncher();
                $this->processDbId     = $serverProcessLauncher->mriUpload(
                    $this->mri_upload_id,
                    $this->uploaded_file_path
                );
                return $this->processDbId;
            }
        }
        // Did not launch upload
        return false;
    }

    /**
     * Save the file to the DataBase by:
     * 1) registering the file handlers
     * 2) Calling the processFiles function which in return will call
     *   - isValid function
     *   - importFile Function
     * Overload Imaging_Uploader::_saveFile()
     *
     * @param array $values the array of values from the form
     *
     * @return true on success, false otherwise
     */
    function _saveFile($values)
    {
        //get the stored-file path
        $file   = new \File_Upload;
        $config = \NDB_Config::singleton();
        $paths  = $config->getSetting('paths');

        //@Note Overwrite defaults to 'reject'
        //'rename' or 'overwrite' modes can be set in $values['overwrite']
        //via HTTP PUT Header 'X-Overwrite'
        $file->setOverwriteMode($values['overwrite']);

        $file->fileMove   = false;
        $file->isCLImport = true;
        $file->addCLFile($values['mriFile']['tmp_name'], 'mriFile');

        //@NOTE File_Upload::addCLFile() needs method to set File_Upload::info
        $this->tmp_name = $values['mriFile']['tmp_name'];
        $file->CLFiles['mriFile']['info'] = $values['mriFile'];
        $file->CLFiles['mriFile']['file'] = $this;

        //Set the target directory that you want files moved
        //into once they are validated and processed.
        $MRIUploadIncomingPath = $config->getSetting('MRIUploadIncomingPath');
        if (($MRIUploadIncomingPath) && (is_dir($MRIUploadIncomingPath))
            && (is_writable($MRIUploadIncomingPath))
        ) {
             $file->fileMove = true;
             $file->setBaseUploadDirectory($MRIUploadIncomingPath);
        }
        //Tell File_Upload what file handlers to use.
        $file->setFileHandler(
            "mriFile",
            $this
        );
        $user = \User::singleton();
        //set the the IDs to the handler functions.
        $file->setHandlerArgs(array("values" => $values));
        //proccesses them (including verify, move, and import steps)
        $file->processFiles();
        return true;
    }

    /**
     * Moves the file to the destination directory after it's been uploaded
     * by the user and processed by the script.
     * Inspiration from /php/libraries/LorisForm.class.inc
     *
     * @param string $destinationDir      The directory to move the file into
     * @param string $destinationFileName The filename to use in that directory.
     *
     * @return void
     */
    function moveUploadedFile($destinationDir, $destinationFileName)
    {
        $dest = $destinationDir . $destinationFileName;
        return rename($this->tmp_name, $dest);
    }

}

?>
