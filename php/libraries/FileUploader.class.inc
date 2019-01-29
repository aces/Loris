<?php declare(strict_types=1);

/**
 * Class to upload files in a safe way.
 *
 * This class uploads files being uploaded to LORIS. It should
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

/**
 * Class to validate file uploads to LORIS.
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   John Saigle <john.saigle@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */
class FileUploader
{

    var $uploadDirectory;
    var $permittedMIMETypes;
    var $permissions;
    private $_responseCode = 500;

    /**
     * Create new instance of a File Uploader.
     *
     * @param SplFileInfo $uploadDirectory    The target parent directory of files
     *                              uploaded using this instance.
     * @param int         $permissions        A UNIX permissions octet (e.g. 0644)
     * @param bool        $overwrite          Whether existing files should be
     *                                      overwritten.
     * @param array       $permittedMIMETypes A whitelist of all MIME types that
     * be accepted by this instance. E.g. array('image/png', 'text/plain')
     *
     * @return void
     */
    public function __construct(
        \SplFileInfo $uploadDirectory,
        int $permissions,
        bool $overwrite,
        array $permittedMIMETypes = array()
    ) {
        $this->uploadDirectory    = $uploadDirectory;
        $this->permissions        = $permissions;
        $this->overwrite          = $overwrite;
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
        if (! $this->uploadDirectory->isDir()) {
            $this->_responseCode = 500;
            throw new \LorisException(
                'Upload directory is not a directory'
            );
        }
        if (! $this->uploadDirectory->isWritable()) {
            // Set __responseCode anyway in case some calling code decides to
            // catch this exception.
            $this->_responseCode = 500;
            throw new \LorisException(
                'Upload directory is not writable'
            );
        }
        if (count($this->permittedMIMETypes) < 1) {
            throw new \LorisException(
                'Array of permitted MIME types cannot be empty'
            );
        }
        return;
    }

    /**
     * Given an array of files, validate them and upload them to the server.
     *
     * The permission parameter is a UNIX file permissions octet.
     * All files uploaded will use these permissions. If uploaded files are
     * required to have differing permissions, this must be done
     * manually in the calling code after this function has executed.
     *
     * If the $overwrite parameter is set to true, existing files will be
     * overwritten.
     *
     * @param \Psr\Http\Message\UploadedFileInterface[] $uploadedFiles An array
     * of files uploaded to the server. These files must implement the PSR-7
     *                              UploadedFile interface.
     *
     * @return bool Whether the file upload was successful. Modifies
     *                      $this->__responseCode as a side-effect.
     */
    public function upload(
        array $uploadedFiles
    ) : bool {
        if (empty($uploadedFiles)) {
            return false;
        }

        foreach ($uploadedFiles as $uploadedFile) {
            //Ensure that the $uploadedFile uses the PSR7 UploadedFile
            //interface
            if (! $uploadedFile instanceof \Psr\Http\Message\UploadedFileInterface) {
                $this->_responseCode = 500;
                throw new \LorisException(
                    'File uploaded to File_Upload_Validator is not an ' .
                    'instance of PSR7 UploadedFile. Aborting upload.'
                );
            }
            /* basename() is used here to prevent path traversal characters
             * from being used.
             */
            $targetPath = $this->uploadDirectory . basename(
                $uploadedFile->getClientFilename()
            );
            /* If file exists, set response code to 'Conflict' unless the
             * calling code wants to overwrite the file.
             */
            if (file_exists($targetPath) && $this->overwrite === false) {
                $this->_responseCode = 409;
                return false;
            }
            // Validate that the MIME type of the file is allowed
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

            // Check that the file size does not exceed the upload limit
            $limit = \Utility::returnBytes(\Utility::getMaxUploadSize());
            if ($uploadedFile->getSize() > $limit) {
                error_log(
                    "Uploaded file size {$uploadedFile->getSize()} exceeds "
                    . "limit of $limit"
                );
                $this->_responseCode = 400;
                return false;
            }

            // Move the file to $targetPath
            try {
                $uploadedFile->moveTo($targetPath);
            } catch (\Exception $e) {
                error_log(
                    'Could not upload file. An exception occurred in ' .
                    'the UploadedFile object code: ' . $e
                );
                $this->_responseCode = 500;
                return false;
            }

            chmod($targetPath, $this->permissions);
        }

        // If all goes well, set response code to 'Created'
        $this->_responseCode = 201;
        return true;
    }

    /**
     * Returns the value of private int $_responseCode
     *
     * @return int The HTTP repsonse code corresponding to the upload status.
     */
    public function getResponseCode(): int
    {
        return $this->_responseCode;
    }
}
