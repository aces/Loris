<?php
/**
 * Class to provide file downloading functionality for the Document Repository
 * module in LORIS.
 *
 * PHP Version 7
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   John Saigle <john.saigle@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */

require_once '../tools/generic_includes.php';
require_once '../php/libraries/AttachmentResponse.class.inc';

/**
 * Extension of the GenericDownloader in the LORIS core libraries.  Queries the
 * `document_repository` database for the existence of a file before attempting
 * to serve the file.
 *
 * PHP Version 7
 *
 *  @category Main
 *  @package  Behavioural
 *  @author   John Saigle <john.saigle@mcgill.ca>
 *  @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 *  @link     https://www.github.com/aces/Loris
 */
class DocRepoAttachment extends AttachmentResponse
{

    /**
     * Check `document_repository` table for the existence of a file.
     *
     * @return bool Whether the file exists in the table.
     */
    public function isFileInDatabase(): bool
    {
        // Format of $dataDirectory is user/filename.ext. Below we get the
        $dataDirectory = \User::singleton()->getUsername()
            . '/'
            . basename($this->path);
        error_log($dataDirectory);
        // Ensure file exists in the document_repository table before serving
        $db     =& Database::singleton();
        $record = $db->pselectOne(
            "SELECT record_id FROM document_repository WHERE "
            . "Data_dir=:dd",
            array('dd' => $dataDirectory)
        );
        // True if record exists, false otherwise.
        return !empty($record);
    }

    /**
     * {@inheritdoc}
     *
     * @return void
     */
    function validate(): void
    {
        parent::validate();
        if (!$this->isFileInDatabase()) {
            http_response_code(404);
        }
    }

}
