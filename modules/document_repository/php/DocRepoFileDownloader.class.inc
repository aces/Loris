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
require_once '../php/libraries/GenericDownloader.class.inc';

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
class DocRepoFileDownloader extends GenericDownloader
{

    /**
     * Check `document_repository` database for the existence of a file.
     *
     * @param string $dataDirectory A string in the format username/filename.ext
     *
     * @return bool Whether the file exists in the database.
     */
    public function isFileInDatabase(string $dataDirectory): bool
    {
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

}
