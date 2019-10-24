<?php declare(strict_types=1);
/**
 * POST request method.
 *
 * Used for uploading file with Issue Tracker.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Issue_Tracker
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\issue_tracker;

/**
 * The UploadHelper Class.
 *
 * This class provides the php code to process uploading
 * a user file from the issue_tracker.
 *
 * @category Loris
 * @package  Issue_Tracker
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UploadHelper
{
    /**
     * The file uploaded from the user.
     */
    private $_fileToUpload;

    /**
     * The bytes of the file.
     */
    private $_bytes;

    /**
     * The user uploading the file.
     */
    private $_user;

    /**
     * The 'post message' array content.
     */
    private $_values;

    /**
     * The response of file uploading (success|error).
     */
    private $_response;

    /**
     * Setup uploading configurations.
     *
     * @param object $user   The user uploading.
     * @param array  $files  The $_FILES array content.
     * @param array  $values The post message array content.
     *
     * @return array
     */
    function setupUploading($user, $files, $values) : array
    {
        $this->_user   = $user;
        $this->_bytes  = $files['file']['size'];
        $this->_values = $values;

        $this->_fileToUpload
            = (object) array(
            'file_type'         => $files['file']['type'],
            'file_name'         => $files['file']['name'],
            'tmp_name'          => $files['file']['tmp_name'],
            'size'              => round($this->_bytes / 1048576, 0),
            'inserted_by'       => $this->_user->getData('UserID'),
            'description'       => $this->_values['fileDescription'],
        );

        $this->setFullPath($this->_fileToUpload);

        $this->begin();
        $this->registerFile($this->_fileToUpload);
        $this->moveFileToFS($this->_fileToUpload);
        $this->endWithSuccess();

        return array(
            'message'  => 'success',
        );
    }

    /**
     * This moves the file from php tmp dir to the genomic data
     * directory specified in the configSettings.
     *
     * @param object $fileToUpload The object containing the $_FILES
     *               and the $_POST values.
     *
     * @return void
     */
    function moveFileToFS(&$fileToUpload) : void
    {
        $dest_dir = dirname($fileToUpload->full_path);
        // file system validation
        try {
            if (!file_exists($fileToUpload->tmp_name)) {
                throw new \Exception(
                    "Some parts of path $fileToUpload->tmp_name does not exist."
                );
            } else if (!is_dir($dest_dir)) {
                throw new \Exception(
                    "$dest_dir exists but is not a directory."
                );
            } else if (!is_writable($dest_dir)) {
                throw new \Exception(
                    "$dest_dir is not writable by web user."
                );
            }
        } catch (\Exception $ex){
            error_log("Cannot move file: $ex");
            $this->endWithFailure();
            $this->_response = json_encode(
                array(
                    'message'  => 'File copy failed',
                    'error'    => true,
                )
            );
        }
    }

    /**
     * Sets $fileToUpload->full_path
     *
     * @param object $fileToUpload The file to upload
     *
     * @return void
     */
    function setFullPath(&$fileToUpload) : void
    {
        $config           = \NDB_Config::singleton();
        $attachment_data_dir = rtrim($config->getSetting('IssueTrackerDataPath'), '/')
            . '/issue_tracker/';

        $fileToUpload->full_path = $attachment_data_dir
            . $fileToUpload->file_name;

        $collision_count = 0;
        $collision_max   = 100;

        while (file_exists($fileToUpload->full_path)) {
            ++$collision_count;
            if ($collision_count > $collision_max) {
                $this->_response = json_encode(
                    array(
                        'message'  => 'That file already exists, '
                            . 'could not generate a non-colliding name',
                        'error'    => true,
                    )
                );
            }
            $ext = pathinfo($fileToUpload->file_name, PATHINFO_EXTENSION);
            $nme = pathinfo($fileToUpload->file_name, PATHINFO_FILENAME);
            $fileToUpload->full_path = $attachment_data_dir
                . $nme . '-' . $collision_count . '.' .$ext;
        }
    }

    /**
     * This insert a record in the issues_file_collection table
     *
     * @param object $fileToUpload The object containing the $_FILES
     *               and the $_POST values.
     *
     * @return void
     */
    function registerFile(&$fileToUpload) : void
    {
        $DB     =& \Database::singleton();
        $values = array(
            'FileName'         => $fileToUpload->full_path,
            'Description'      => $fileToUpload->description,
            'FileType'         => $fileToUpload->file_type,
            'FileSize'         => $fileToUpload->size,
            'Date_inserted'    => date('Y-m-d h:i:s', time()),
            'InsertedByUserID' => $fileToUpload->inserted_by,
        );
        try {
            $DB->replace('genomic_files', $values);
            $last_id = $DB->pselectOne(
                'SELECT MAX(GenomicFileID) AS last_id
           FROM genomic_files',
                array()
            );
            $fileToUpload->GenomicFileID = $last_id;

            $fileToUpload->date_inserted = $values['Date_inserted'];

        } catch (\DatabaseException $e) {
            $this->endWithFailure();
            error_log("DatabaseException: $e");
            $this->_response = json_encode(
                array(
                    'message'  => 'File registration failed. 
                    Is the description empty?',
                    'error'    => true,
                )
            );
        }
    }

    /**
     * Begins the transaction for the file upload
     *
     * @return void
     */
    function begin() : void
    {
        $DB = \Database::singleton();
        $DB->beginTransaction();
    }

    /**
     * Ends the transaction for the file upload with failure
     *
     * @return void
     */
    function endWithFailure() : void
    {
        $DB = \Database::singleton();
        $DB->rollBack();
    }

    /**
     * Ends the transaction for the file upload with success
     *
     * @return void
     */
    function endWithSuccess() : void
    {
        $DB = \Database::singleton();
        $DB->commit();
    }
}
