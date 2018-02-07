<?php
/**
 * An interface containing methods for classes used to handle file
 * uploads from a client to a server.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Handles file uploads from a client to a server. The methods listed in this
 * interface were created in order to encapsulate the usual things that happen
 * when a set of files is uploaded to a server, namely:
 *
 * 1. Validation of all uploaded files
 * 2. Transfer of all files to a designated (permanent) location on the
 *    server.
 * 3. Actual processing of the uploaded files (e.g. update of database
 *    tables, etc...)
 *
 * @category Main
 * @package  Main
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
interface FilesUploadHandler
{
    /**
     * Returns the properties associated to each file uploaded on the
     * server in an array identical to $_FILES.
     *
     * @return array the properties for each file uploaded (one array for
     *         each uploaded file, see $_FILES).
     */
    public function getFiles() : array;

    /**
     * Validates the set of uploaded files. If a given file is invalid, the
     * validation message associated to it will be stored in the array returned
     * by getErrors().
     *
     * @return bool true if the set of files is valid and should be processed, false
     *         otherwise.
     */
    public function isValid() : bool;

    /**
     * Returns any validation or processing errors associated to each uploaded file.
     *
     * @return array list of error messages for each uploaded file.
     */
    public function getErrors() : array;

    /**
     * Main entry point for classes implementing this interface. Processes all
     * uploaded files.
     *
     * @return nothing.
     */
    public function processAll();

    /**
     * Gets the new path for a file that was uploaded to a temporary location on
     * the server. This function only computes the new path and does not actually
     * move the file.
     *
     * @param string $fileName temporary path on the server for a given uploaded
     *               file.
     *
     * @return SplFileInfo all the information regarding the new file location.
     */
    public function getNewLocation(string $fileName) : SplFileInfo;

    /**
     * This function is called each time a file is moved to its permanent location
     * on the server. This is where the actual processing of the uploaded file should
     * take place.
     *
     * @param string $oldPath  temporary path on the server for a given uploaded
     *               file.
     * @param string $newPath  new (permanent) path for the uploaded file. If
     *               the file could not actually be moved to this new location, the
     *               value of this parameter will be null.
     * @param string $errorMsg the error that occured during the move operation. If
     *               the file was successfully moved to its new location, the value
     *               for this parameter will be null.
     *
     * @return nothing.
     */
    public function onFileMoveEvent(
        string $oldPath, string $newPath=null, string $errorMsg=null
    );

    /**
     * This function is called once all the uploaded files have been processed
     * (i.e. at the very end of processAll()). Cleanup code typically is put into
     * this function.
     *
     * @return nothing.
     */
    public function processingDone();
}

?>
