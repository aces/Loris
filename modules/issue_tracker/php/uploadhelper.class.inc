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
 * a user file from the issue_tracker for attachments.
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
                        'file'        => $files['file']['name'],
                        'uuid'        => $this->uuid4(),
                        'tmp_name'    => $files['file']['tmp_name'],
                        'size'        => round($this->_bytes / 1048576, 0),
                        'inserted_by' => $this->_user->getData('UserID'),
                        'description' => $this->_values['fileDescription'] ?? '',
                       );

        $this->setFullPath($this->_fileToUpload);

        $this->begin();
        $this->registerFile($this->_fileToUpload);
        $this->endWithSuccess();

        return array('message' => 'success');
    }

    /**
     * Sets $fileToUpload->full_path
     *
     * @param object $fileToUpload The file to upload
     *
     * @return void
     * @throws \LorisException
     */
    function setFullPath(&$fileToUpload) : void
    {
        $config = \NDB_Config::singleton();
        $attachment_data_dir = rtrim(
            $config->getSetting('IssueTrackerDataPath'),
            '/'
        );

        if (is_writable($attachment_data_dir)) {
            $fileToUpload->full_path = $attachment_data_dir .
                                       '/attachments/' .
                                       strval($this->_values['issueID']);
            if (!$fileToUpload->full_path) {
                mkdir($fileToUpload->full_path, 0770, true);
            }
        } else {
            throw new \LorisException(
                'Issue_Tracker attachments directory not writable.'
            );
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
                   'issueID'     => $this->_values['issueID'],
                   'file_uuid'   => $fileToUpload->uuid,
                   'date_added'  => date('Y-m-d h:i:s', time()),
                   'file_name'   => $fileToUpload->file,
                   'deleted'     => 0,
                   'user'        => $fileToUpload->inserted_by,
                   'description' => $fileToUpload->description,
                   'file_size'   => $fileToUpload->size,
                  );
        try {
            $DB->insert('issues_attachments', $values);
            // Move file from tmp to issue_tracker attachment directory.
            $path = $fileToUpload->full_path . '/' . $fileToUpload->uuid;
            move_uploaded_file($_FILES['file']['tmp_name'], $path);
        } catch (\DatabaseException $e) {
            $this->endWithFailure();
            error_log("DatabaseException: $e");
            $this->_response = json_encode(
                array(
                 'message' => 'File registration failed.
                    Is the description empty?',
                 'error'   => true,
                )
            );
        }
    }

    /**
     * Create a UUID v4 string.
     *
     * Source from comments:
     * http://php.net/manual/en/function.com-create-guid.php
     * Maybe move to Utilities class.
     *
     * @return string $version
     */
    function uuid4()
    {
        $data    = openssl_random_pseudo_bytes(16);
        $data[6] = chr(ord($data[6]) & 0x0f | 0x40); // set version to 0100
        $data[8] = chr(ord($data[8]) & 0x3f | 0x80); // set bits 6-7 to 10
        return vsprintf('%s%s-%s-%s-%s-%s%s%s', str_split(bin2hex($data), 4));
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
