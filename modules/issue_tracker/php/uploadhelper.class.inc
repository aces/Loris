<?php declare(strict_types=1);
/**
 * POST request method.
 *
 * Used for uploading attachment file for Issue Tracker.
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
 * This class provides the code to process uploading
 * a user file from the issue_tracker for saving attachments.
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
     * Setup uploading configurations.
     *
     * @param object $user   The user uploading.
     * @param array  $files  The $_FILES array content.
     * @param array  $values The post message array content.
     *
     * @return array
     */
    function setupUploading(Object $user, array $files, array $values) : array
    {
        // Check if post.ini max_post configured for the file_size.
        if (!isset($files['file']['tmp_name'])
            || empty($files['file']['tmp_name'])
        ) {
            return array(
                'error' =>
                    'The server is not configured to receive a file this large.'
            );
        }
        $this->_user   = $user;
        $this->_bytes  = $files['file']['size'];
        $this->_values = $values;

        $this->_fileToUpload
            = (object) array(
                'file'        => $files['file']['name'],
                'file_hash'   => $this->generateHash($files['file']['tmp_name']),
                'mime_type'   => $this->getFileMimeType($files['file']['name']),
                'tmp_name'    => $files['file']['tmp_name'],
                'size'        => $this->_bytes,
                'inserted_by' => $this->_user->getData('UserID'),
                'description' => $this->_values['fileDescription'] ?? '',
            );

        $this->setFullPath($this->_fileToUpload);

        $this->begin();
        $this->registerFile($this->_fileToUpload);
        $this->endWithSuccess();

        return array('success' => true);
    }

    /**
     * Sets $fileToUpload->full_path to be the full path
     * of where the attachment file will be stored.
     *
     * @param object $fileToUpload The file to upload
     *
     * @return void
     * @throws \LorisException
     */
    function setFullPath(Object &$fileToUpload) : void
    {
        $config = \NDB_Config::singleton();
        $attachment_data_dir = trim(
            rtrim(
                $config->getSetting('IssueTrackerDataPath'),
                '/'
            )
        );

        if (is_writable($attachment_data_dir)) {
            $fileToUpload->full_path = $attachment_data_dir .
                                       '/attachments';
            if (!is_dir($fileToUpload->full_path)) {
                mkdir($fileToUpload->full_path, 0770, true);
            }
        } else {
            throw new \LorisException(
                'Issue_Tracker attachments directory not writable.'
            );
        }

    }

    /**
     * This insert a record in the mysql
     * 'issues_attachments' table.
     *
     * @param object $fileToUpload The object containing
     *                             the $_FILES and the $_POST values.
     *
     * @return void
     */
    function registerFile(Object &$fileToUpload) : void
    {
        $DB     =& \Database::singleton();
        $values = array(
            'issueID'     => $this->_values['issueID'],
            'file_hash'   => $fileToUpload->file_hash,
            'date_added'  => date('Y-m-d h:i:s', time()),
            'file_name'   => $fileToUpload->file,
            'deleted'     => 0,
            'user'        => $fileToUpload->inserted_by,
            'description' => $fileToUpload->description,
            'file_size'   => $fileToUpload->size,
            'mime_type'   => $fileToUpload->mime_type
        );
        try {
            $DB->insert('issues_attachments', $values);
            // Move file from tmp to issue_tracker attachment directory.
            $path = $fileToUpload->full_path . '/' . $fileToUpload->file_hash;
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
     * Get mime_type details for the attachment file.
     *
     * @param string $file the file name with extension.
     *
     * @return string $mime_type
     */
    function getFileMimeType(string $file) : string
    {
        $known_mime_types = array(
            'htm'  => 'text/html',
            'csv'  => 'text/csv',
            'exe'  => 'application/octet-stream',
            'zip'  => 'application/zip',
            'doc'  => 'application/msword',
            'jpg'  => 'image/jpg',
            'php'  => 'text/plain',
            'xls'  => 'application/vnd.ms-excel',
            'ppt'  => 'application/vnd.ms-powerpoint',
            'gif'  => 'image/gif',
            'pdf'  => 'application/pdf',
            'txt'  => 'text/plain',
            'html' => 'text/html',
            'png'  => 'image/png',
            'jpeg' => 'image/jpg',
        );
        if (strpos($file, '.') !== false) {
            $file_extension = strtolower(substr(strrchr($file, '.'), 1));
            if (array_key_exists($file_extension, $known_mime_types)) {
                $mime_type = $known_mime_types[$file_extension];
            } else {
                $mime_type = 'application/force-download';
            }
        } else {
            $mime_type = 'application/force-download';
        }
        return $mime_type;
    }

    /**
     * Create a sha256 string from file_content.
     *
     * @param string $filePath the path to the file.
     *
     * @return string
     */
    function generateHash(string $filePath) : string
    {
        return hash_file('sha256', $filePath);
    }

    /**
     * Begins the transaction for the file attachment upload.
     *
     * @return void
     */
    function begin() : void
    {
        $DB = \Database::singleton();
        $DB->beginTransaction();
    }

    /**
     * Ends the transaction for the file attachment
     * upload with failure.
     *
     * @return void
     */
    function endWithFailure() : void
    {
        $DB = \Database::singleton();
        $DB->rollBack();
    }

    /**
     * Ends the transaction for the file attachment
     * upload with success.
     *
     * @return void
     */
    function endWithSuccess() : void
    {
        $DB = \Database::singleton();
        $DB->commit();
    }
}
