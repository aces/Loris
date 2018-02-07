<?php
/**
 * Default class for handling file uploads in LORIS
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
 * Provides a default handler for files that were uploaded on a LORIS
 * web site using LorisForm.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class DefaultFilesUpload Handler implements FilesUploadHandler
{
    /**
     * Default directory to move the uploaded files to if none is explicitely
     * specified.
     */
    public static $DEFAULT_MOVE_DIR = __DIR__ . "../user_uploads";
    /**
     *  The LorisForm used to upload the file(s).
     */
    private $_lorisForm;
    /**
     * Directory to move the uploaded files to. Will be created if it does not
     * exist.
     */
    private $_moveDirPath;
    /**
     * When creating $_moveDirPath, these are the access rights to give it
     * (should be an octal number).
     */
    private $_dirPermissions;
    /**
     * When creating $_moveDirPath, give it this access group.
     */
    private $_dirGroup;
    /**
     * All the errors that occured either when the files are validated, moved to
     * their final locations or processed.
     */
    private $_errors;
    /**
     * The files and their final locations (if successfully moved). Each value
     * in this array is a SplFileInfo. Each key is the name of the LorisForm
     * field used to upload the file.
     */
    private $_movedFiles;
    /**
     * All the properties of the uploaded files. Equivalent to the $_FILES
     * superglobal.
     */
    private $_files = null;

    /**
     * Builds a new handler for uploaded files.
     *
     * @param LorisForm $lorisForm      the LorisForm used to upload the file(s).
     * @param int       $dirPermissions if directory $moveDirPath (see below) has
     *                                  to be created, it will have these access
     *                                  rights (should be an octal number).
     * @param string    $moveDirPath    where the files should be moved once they are
     *                                  uploaded. If this directory is specified and
     *                                  does not exist, it will be created
     *                                  automatically. If null, then the uploaded
     *                                  files will be moved to $DEFAULT_MOVE_DIR.
     * @param int       $dirGroup       if directory $moveDirPath has to be created
     *                                  it will have this access group.
     *
     * @return nothing.
     */
    public function __construct(
        LorisForm $lorisForm,
        int $dirPermissions,
        string $moveDirPath=null,
        string $dirGroup=null
    ) {
        $this->_lorisForm      = $lorisForm;
        $this->_moveDirPath    = is_null($moveDirPath)
            ? self::$DEFAULT_MOVE_DIR : $moveDirPath;
        $this->_dirPermissions = $dirPermissions;
        $this->_dirGroup       = $dirGroup;

        $this->_errors = array();
    }

    /**
     * Adds an error (any kind) to the set of current errors.
     *
     * @param string $key      name of the LorisForm field associated to the
     *                         uploaded file.
     * @param string $errorMsg error message text.
     *
     * @return nothing.
     */
    protected function addError(string $key, string $errorMsg)
    {
        $this->_errors[$key] = $errorMsg;
    }

    /**
     * Accessor for field $_errors. The keys are the names of the LorisForm
     * fields used for file uploads. Only fields with errors are stored in this
     * array.
     *
     * @return array array of all the errors found.
     */
    public function getErrors() : array
    {
        return $this->_errors;
    }

    /**
     * Accessor for field $_lorisForm.
     *
     * @return LorisForm the LorisForm associated with this handler.
     */
    public function getLorisForm() : \LorisForm
    {
        return $this->_lorisForm;
    }

    /**
     * Accessor for field $_dirPermissions.
     *
     * @return int value for field $_dirPermissions.
     */
    public function getDirPermissions() : int
    {
        return $this->_dirPermissions;
    }

    /**
     * Accessor for field $_moveDirPath.
     *
     * @return string value for field $_moveDirPath.
     */
    public function getMoveDirPath() : string
    {
        return $this->_moveDirPath;
    }

    /**
     * Accessor for field $_dirGroup.
     *
     * @return int value for field $_dirGroup.
     */
    public function getDirGroup() : string
    {
        return $this->_dirGroup;
    }

    /**
     * Accessor for field $_movedFiles.
     *
     * @return array the final location of all files uploaded on the
     *               server. Each key is the name of a LorisFirm field
     *               used to upload a file and its corresponding value is the final
     *               location for the uploaded file on the server.
     */
    public function getMovedFiles() : array
    {
        return $this->_movedFiles;
    }

    /**
     * Accessor for field $_dirPermissions.
     *
     * @return int value for field $_dirPermissions.
     */
    public function getFiles() : array
    {
        if (is_null($this->_files)) {
            $this->_files = array();
            foreach ($this->_lorisForm->getElements() as $element) {
                if ($element instanceof LorisFormFileElement) {
                    $this->_files[$element->getName()] = $element->getValue();
                }
            }
        }

        return $this->_files;
    }

    /**
     * Determines if the set of uploaded files is valid or not, updating the $_errors
     * array with the errors found. This method will look at all the fields of the
     * LorisForm associated to this handler and verify that the upload error code
     * found in the super global $_FILES for that field is UPLOAD_ERR_OK
     * (see documentation for $_FILES). If no file name was entered for a given field
     * in the LorisForm, then the upload is considered invalid and the error for that
     * field will be set to false. This method assumes that all the fields used for
     * file uploads have a value (i.e. no "optional" upload is allowed). This
     * behavior can be overridden bu subclasses should they need to.
     *
     * @return bool true if the uploaded file set is valid, false otherwise.
     */
    public function isValid() : bool
    {
        $valid = true;
        foreach ($this->getFiles() as $field => $file) {
            if ($file === false || $file['error'] != UPLOAD_ERR_OK) {
                $this->addError(
                    $field,
                    $file === false ? false : $file['error']
                );
                $valid = false;
            }
        }

        return $valid;
    }

    /**
     * Main method for this handler. Validates the uploaded files (i.e. make sure
     * that they are are present on the server) and moves them to their final
     * locations.
     *
     * @return nothing.
     */
    public function processAll()
    {
        try {
            if ($this->isValid()) {
                foreach ($this->getFiles() as $field => $file) {
                    if ($file !== false) {
                        $newFile = $this->getNewLocation($file['tmp_name']);
                        $newDir  = $newFile->getPath();

                        // Check to see if directory exists
                        if (!file_exists($newDir)) {
                            // Directory does not exist: try to create it
                            if (!mkdir($newDir, $this->_dirPermissions, true)) {
                                $this->addError(
                                    $field,
                                    "Cannot move {$file['tmp_name']} to $newDir:"
                                        . " directory $newDir could not be created"
                                );
                            } else {
                                if ($this->_dirGroup != '') {
                                    if (!chgrp($newDir, $this->_dirGroup)) {
                                        $this->addError(
                                            $field,
                                            "Command 'chgrp {$this->_dirGroup} "
                                                . "$newDir' failed"
                                        );
                                    }
                                }
                            }
                            // File name exists. Make sure it refers to a directory.
                        } else if (!is_dir($newDir)) {
                            $this->addError(
                                $field,
                                "Cannot move {$file['tmp_name']} to $newDir: "
                                    . "$newDir already exists and is not a directory"
                            );
                        }

                        // If everything went OK so far
                        if (!isset($this->_errors[$field])) {
                            // Move the file to its final location
                            $oldPath = $file['tmp_name'];
                            $newPath = $newFile->getPathname();
                            if (!move_uploaded_file($oldPath, $newPath)) {
                                $this->addError(
                                    $field,
                                    "Could not move $oldPath to $newPath"
                                );
                            } else {
                                $this->_movedFiles[$field] = $newFile;
                            }
                        }

                        // Signal that an attempt to move a file from its temporary
                        // location to its final location was made
                        $this->onFileMoveEvent(
                            $file['tmp_name'],
                            isset($this->_errors[$field])
                                ? null : $newFile->getRealPath(),
                            $this->_errors[$field] ?? null
                        );
                    }
                }
            }
        } finally {
            $this->processingDone();
        }
    }

    /**
     * Finds the new (final, permanent) location for an uploaded file.
     * This method only computes the new file path and does not actually
     * move the file.
     *
     * @param string $tmpFilePath temporary path (on the server) where the
     *               uploaded file is currently located.
     *
     * @return SplInfo the path information for the new file location.
     */
    public function getNewLocation(string $tmpFilePath) : SplFileInfo
    {
        foreach ($this->getFiles() as $formField => $file) {
            if ($file['tmp_name'] == $tmpFilePath) {
                // 1. Find the path that the file had on the client side
                // 2. Take the basename and prepend $this->_moveDirPath
                // 3. That's the new file path
                $clientFile = new SplFileInfo($file['name']);
                return new SplFileInfo(
                    $this->_moveDirPath . '/' . $clientFile->getBaseName()
                );
            }
        }

        throw new InvalidArgumentException(
            "Cannot find file with temporary upload path '$tmpFilePath'"
        );
    }

    /**
     * Method called when an attempt (either successful or unsuccessful) to move
     * a file from its temporary location to its final location is made. By
     * default this method does nothing but subclasses should override as needed
     * (update a DB table, launch a computation, etc...)
     *
     * @param string $oldPath temporary path the file had on the server
     *                        when it was uploaded by the client.
     * @param string $newPath final path the file has on the server after it was
     *                        moved to its final location (will be null if the file
     *                        was not successfully moved)
     * @param string $error   the error message describing why the file could not be
     *                        moved (null if the file was moved successfully).
     *
     * @return nothing.
     */
    public function onFileMoveEvent(
        string $oldPath, string $newPath=null, string $error=null
    ) {
        // Does nothing by default. Subclasses can override if needed.
    }

    /**
     * This method is called once all uploaded files have been processed. Does
     * nothing by default. Subclasses should override this method with any cleanup
     * code they require.
     *
     * @return nothing.
     */
    public function processingDone()
    {
        // Does nothing by default. Subclasses can override if needed.
    }
}

?>
