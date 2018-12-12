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

/**
 * Class to validate file uploads to LORIS.
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   John Saigle <john.saigle@mcin.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */
class FileUploadValidator
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
        if (empty($this->uploadDirectory)) {
            throw new \InvalidArgumentException(
                'Upload directory cannot be empty'
            );
        }
        if (! is_dir($this->uploadDirectory)) {
            $this->_responseCode = 500;
            throw new \LorisException(
                'Upload directory is not a directory'
            );
        }
        if (! is_writable($this->uploadDirectory)) {
            // Set __responseCode anyway in case some calling code decides to
            // catch this exception.
            $this->_responseCode = 500;
            throw new \LorisException(
                'Upload directory is not writable'
            );
        }
        return;
    }

    /**
     * Given an array of files, validate them and upload them to the server.
     *
     * The permission paramaeter is a UNIX file permissions octet.
     * All files uploaded will use these permissions. If uploaded files are
     * required to have differing permissions, this must be done
     * manually in the calling code after this function has executed.
     *
     * If the $overwrite parameter is set to true, existing files will be
     * overwritten.
     *
     * @param UploadedFile[] $uploadedFiles An array of files uploaded to the
     *                              server. These files must implement the PSR-7
     *                              UploadedFile interface.
     * @param int            $permissions   A UNIX permissions octet (e.g. 0644)
     * @param bool           $overwrite     Whether existing files should be
     *                                      overwritten.
     *
     * @return bool Whether the file upload was successful. Modifies
     *                      $this->__responseCode as a side-effect.
     */
    public function upload(
        array $uploadedFiles,
        int $permissions,
        bool $overwrite = false
    ) : bool {
        if (empty($uploadedFiles)) {
            return false;
        }

        foreach ($uploadedFiles as $uploadedFile) {
            //Ensure that the $uploadedFile uses the PSR-7 UploadedFile
            //interface
            if (! $uploadedFile instanceof \Zend\Diactoros\UploadedFile) {

                $this->_responseCode = 500;
                throw new \LorisException(
                    'File uploaded to File_Upload_Validator is not an ' .
                    'instance of PSR-7 UploadedFIle. Aborting upload.'
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
            if (file_exists($targetPath) && $overwrite === false) {
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

            // Check that the file size does not exceed the upload limit
            $limit = $this->fileUploadMaxSize();
            if ($uploadedFile->getSize() > $limit) {
                error_log(
                    "Uploaded file size {$uploadedFile->getSize} exceeds "
                    . "limit of $limit"
                );
                $this->_responseCode = 400;
                return false;
            }

            // Move the file to $targetPath
            $uploadedFile->moveTo($targetPath);

            chmod($targetPath, $permissions);
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

    /**
     * Returns a file size limit in bytes based on the PHP upload_max_filesize
     * and post_max_size.
     *
     * @return int The smaller of PHP's upload_max_filesize and post_max_size
     *                  settings.
     */
    function fileUploadMaxSize(): int
    {
        static $max_size = -1;

        if ($max_size < 0) {
            // Start with post_max_size.
            $post_max_size = $this->parseSize(ini_get('post_max_size'));
            if ($post_max_size > 0) {
                $max_size = $post_max_size;
            }

            // If upload_max_size is less, then reduce. Except if upload_max_size is
            // zero, which indicates no limit.
            $upload_max = $this->parseSize(ini_get('upload_max_filesize'));
            if ($upload_max > 0 && $upload_max < $max_size) {
                $max_size = $upload_max;
            }
        }
        return $max_size;
    }

    /**
     * Parse a PHP size string such as "4G" into an integer equivalent to the
     * number of bytes that string represents.
     *
     * @param string $size A string representing an amount of memory.
     *
     * @return int An integer corresponding to the number of bytes in the
     *              byte string
     */
    function parseSize(string $size): int
    {
        // Remove the non-unit characters from the size.
        $unit = preg_replace('/[^bkmgtpezy]/i', '', $size);
        // Remove the non-numeric characters from the size.
        $size = preg_replace('/[^0-9\.]/', '', $size);
        if ($unit) {
            /* Find the position of the unit in the ordered string which is
             * the power of magnitude to multiply a kilobyte by.
             *
             * phan thinks that the arguments to stripos are in the wrong
             * order but this is a false positive.
             */
            // @phan-suppress-next-line PhanParamSuspiciousOrder
            return round($size * pow(1024, stripos('bkmgtpezy', $unit[0])));
        } else {
            return round($size);
        }
    }
}
