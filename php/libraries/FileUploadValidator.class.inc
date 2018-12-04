<?php declare(strict_types=1);

use \Psr\Http\Message\UploadedFileInterface;
use \Zend\Diactoros\UploadedFile;

/**
 * This class provides validation for files being uploaded to LORIS. It should
 * serve as the ONLY way that files are uploaded so that all file uploading
 * functionality can occur on a well-tested foundation.
 *
 */
class FileUploadValidator
{

    public $uploadDirectory;
    public $permittedMIMETypes;
    private $responseCode = 500;

    /**
     *
     */
    public function __construct(
        string $uploadDirectory,
        array $permittedMIMETypes = array()
    ) {
        $this->uploadDirectory    = $uploadDirectory;
        $this->permittedMIMETypes = $permittedMIMETypes;
        $this->_validate();
    }

    /**
     * Validates the constructor by ensuring the upload path exists and is
     * writable.
     *
     * @throws \LorisException
     *
     * @return void
     */
    protected function _validate(): void
    {
        if (! is_dir($this->uploadDirectory)) {
            $this->_responseCode = 500;
            throw new \LorisException(
                'Upload directory is not a directory!'
            );
        }
        if (! is_writable($this->uploadDirectory)) {
            // Set _responseCode anyway in case some calling code decides to
            // catch this exception.
            $this->_responseCode = 403;
            throw new \LorisException(
                'Upload directory is not writable!'
            );
        }
        return;
    }

    /**
     * Given an array of files, validate them and upload them to the server.
     *
     * @param array $uploadedFiles
     * @param int   $permissions   A UNIX permissions string (e.g. 644). All files uploaded will have this permission string. If uploaded files are required to have  differing permissions, this must be done manually in the calling code after this  functions has executed.
     *                              uploaded will have this permission string.
     *                              If uploaded files are required to have
     *                              differing permissions, this must be done
     *                              manually in the calling code after this
     *                              functions has executed.
     *
     * @return bool Whether the file upload was successful. Modifies
     *                      $this->_responseCode as a side-effect.
     */
    public function upload(
        array $uploadedFiles,
        int $permissions
    ) : bool {
        if (empty($uploadedFiles)) {
            return false;
        }

        foreach ($uploadedFiles as $uploadedFile) {
            /* basename() is used here to prevent path traversal characters
            * from being used.
             */
            $targetPath = $this->uploadDirectory . basename(
                $uploadedFile->getClientFilename()
            );
            // If file exists, set response code to 'Conflict'
            if (file_exists($targetPath)) {
                $this->_responseCode = 409;
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
                    $this->_responseCode = 400;
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
                $this->_responseCode = 500;
                return false;
            }

            chmod($targetPath, $permissions);
        }

        // If all goes well, set response code to 'Created'
        $this->_responseCode = 201;
        return true;
    }

    public function getResponseCode(): int
    {
        return $this->_responseCode;
    }
}
