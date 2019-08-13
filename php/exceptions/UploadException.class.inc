<?php declare(strict_types=1);
/**
 * This class is a wrapper that takes an upload error code
 * and adds the appropriate message to the exception.
 *
 * PHP Version 7
 *
 * @category Errors
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

/**
 * The UploadException class
 *
 * @category Errors
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class UploadException extends \LorisException
{
    /**
     * Contructor that takes the upload error code to generate the message.
     *
     * @param int $code The error code
     *
     * @see http://php.net/manual/en/features.file-upload.errors.php
     */
    public function __construct(int $code)
    {
        $message = $this->_codeToMessage($code);
        parent::__construct($message, $code);
    }

    /**
     * Mapper function to retrieve the corresponding error message.
     *
     * @param int $code The error code
     *
     * @return string
     */
    private function _codeToMessage(int $code) : string
    {
        switch ($code) {
        case UPLOAD_ERR_INI_SIZE:
            $message = 'The uploaded file exceeds the upload_max_filesize ' .
                       'directive in php.ini';
            break;
        case UPLOAD_ERR_FORM_SIZE:
            $message = 'The uploaded file exceeds the MAX_FILE_SIZE ' .
                       'directive that was specified in the HTML form';
            break;
        case UPLOAD_ERR_PARTIAL:
            $message = 'The uploaded file was only partially uploaded';
            break;
        case UPLOAD_ERR_NO_FILE:
            $message = 'No file was uploaded';
            break;
        case UPLOAD_ERR_NO_TMP_DIR:
            $message = 'Missing a temporary folder';
            break;
        case UPLOAD_ERR_CANT_WRITE:
            $message = 'Failed to write file to disk';
            break;
        case UPLOAD_ERR_EXTENSION:
            $message = 'File upload stopped by extension';
            break;

        default:
            $message = 'Unknown upload error';
            break;
        }
        return $message;
    }
}

