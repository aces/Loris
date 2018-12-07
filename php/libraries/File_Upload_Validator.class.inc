<?php declare(strict_types=1);

/**
 * Class to upload files in a safe way.
 *
 * This class provides validation for files being uploaded to LORIS. It should
 * serve as the ONLY way that files are uploaded so that all file uploading
 * functionality can occur on a well-tested foundation.
 *
 * PHP Version 7
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   John Saigle <john.saigle@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */

use \Psr\Http\Message\UploadedFileInterface;
use \Zend\Diactoros\UploadedFile;

/**
 * Class to validate file uploads to LORIS.
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   John Saigle <john.saigle@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */
class File_Upload_Validator
{

    public $uploadDirectory;
    public $permittedMIMETypes;
    private $_responseCode = 500;

    /**
     * Create new instance of a File Upload Validator.
     *
     * @param string $uploadDirectory    The target parent directory of files
     *                              uploaded using this instance.
     * @param array  $permittedMIMETypes A whitelist of all MIME types that can
     * be accepted by this instance. E.g. array('image/png', 'text/plain')
     *
     * @return void
     */
    public function __construct(
        string $uploadDirectory,
        array $permittedMIMETypes = array()
    ) {
        $this->uploadDirectory    = $uploadDirectory;
        $this->permittedMIMETypes = $permittedMIMETypes;
        $this->validate();
    }

    /**
     * Validates the constructor by ensuring the upload path exists and is
     * writable.
     *
     * @throws \LorisException
     *
     * @return void
     */
    protected function validate(): void
    {
        if (! is_dir($this->uploadDirectory)) {
            $this->__responseCode = 500;
            throw new \LorisException(
                'Upload directory is not a directory!'
            );
        }
        if (! is_writable($this->uploadDirectory)) {
            // Set __responseCode anyway in case some calling code decides to
            // catch this exception.
            $this->__responseCode = 403;
            throw new \LorisException(
                'Upload directory is not writable!'
            );
        }
        return;
    }

    /**
     * Given an array of files, validate them and upload them to the server.
     *
     * @param array $uploadedFiles An array of files uploaded to the server.
     *                              These files must implement the PSR-7
     *                              UploadedFile interface.
     * @param int   $permissions   A UNIX permissions string (e.g. 644). All files
     *                              uploaded will have this permission string.
     *                              If uploaded files are required to have
     *                              differing permissions, this must be done
     *                              manually in the calling code after this
     *                              functions has executed.
     *
     * @return bool Whether the file upload was successful. Modifies
     *                      $this->__responseCode as a side-effect.
     */
    public function upload(
        array $uploadedFiles,
        int $permissions
    ) : bool {
        if (empty($uploadedFiles)) {
            return false;
        }

        foreach ($uploadedFiles as $uploadedFile) {
            //Ensure that the $uploadedFile uses the PSR-7 UploadedFile
            //interface
            if (! $uploadedFile instanceof \UploadedFile) {

                error_log(
                    'File uploaded to File_Upload_Validator is not an ' .
                    'instance of PSR-7 UploadedFIle. Aborting upload.'
                );
                $this->__responseCode = 500;
                return false;
            }
            /* basename() is used here to prevent path traversal characters
             * from being used.
             */
            $targetPath = $this->uploadDirectory . basename(
                $uploadedFile->getClientFilename()
            );
            // If file exists, set response code to 'Conflict'
            if (file_exists($targetPath)) {
                $this->__responseCode = 409;
                return false;
            }
            // Validate theat the MIME type of the file is allowed
            if (!empty($this->permittedMIMETypes)) {
                if (!in_array(
                    $uploadedFile->getClientMediaType(),
                    $this->permittedMIMETypes,
                    true
                )
                ) {
                    $this->__responseCode = 400;
                    return false;
                }
            }

            // Try to move the file to $targetPath
            try {
                $uploadedFile->moveTo($targetPath);
            } catch (\Exception $e) {
                /* If an error occurs during moving, set response code to
                 * 'Internal Server Error'.
                 *
                 * This covers file size checks as well as other errors that
                 * can occur in the process of performing
                 * `move_uploaded_file().
                 *
                 * See \Zend\Diactoros\UploadedFile for more information on
                 * these errors.
                 */
                error_log($e->getMessage());
                $this->__responseCode = 500;
                return false;
            }

            chmod($targetPath, $permissions);
        }

        // If all goes well, set response code to 'Created'
        $this->__responseCode = 201;
        return true;
    }

    /**
     * Returns the value of private int $_responseCode
     *
     * @return int The HTTP repsonse code corresponding to the upload status.
     */
    public function getResponseCode(): int
    {
        return $this->__responseCode;
    }
}
