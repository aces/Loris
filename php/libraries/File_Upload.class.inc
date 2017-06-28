<?php
/**
 * This file contains a wrapper for managing and verifying files that are
 * uploaded through LorisForm and handles putting them in the correct place,
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Behavioural
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class File_Upload
{
    private $errorLog;
    private $destinationFilename;
    private $destinationDirectory;
    private $baseUploadDirectory;

    /**
     * Construct the File_Upload class. This sets the default parameters
     * for a file which can be overwritten by calling the set* methods
     */
    public function __construct()
    {
        // TODO: fileMove should be removed after imaging uploader is refactored
        // It is not a private variable because imaging_uploader currently
        // changes its value manually.
        // @see imaging_uploader/php/NDB_Menu_Filter_imaging_uploader.class.inc#L212
        $this->fileMove          = true;
        $this->errorLog          = array();
        $this->fieldName = '';
        $this->fieldNames = '';
        $this->destinationFilename = '';
        $this->destinationDirectory = '';
        $this->baseUploadDirectory = '';
    }


    /**
     * Loops through the uploaded files running the full suit of functions against
     * them.
     *
     * @return boolean True on success False on failure
     */
    public function processFiles()
    {
        //Loop through fields.
        if (empty($this->fieldNames) || !is_array($this->fieldNames)) {
            $this->setError(
                "",
                "No files to process! Register handlers first."
            );
            return false;
        }

        foreach ($this->fieldNames as $field) {
            $this->fieldName =$field;
            if (!$this->preprocessFile()) {
                $this->setError(
                    $field,
                    "Could not upload file. Max file size is "
                    . ini_get("upload_max_filesize") . "."
                );
                continue;
            }

            //Determine appropriate file handler class
            if (empty($this->fileHandlers[$field])) {
                //If a field type is set use that.
                $this->setError(
                    $field,
                    "No file handler registered for field '$field'"
                );
                continue;
            }

            //Test the handler to ensure it exists and all methods are intact
            if ($this->isValidFileHandler($field)) {
                //Validate using the isValid method of the handler class
                $errors = $this->callFileHandler($field, 'verify');
                // The above function call returns an array if something goes wrong,
                // and returns true otherwise.
                // @see imaging_uploader/php/NDB_Menu_Filter_imaging_uploader.class.inc#L265
                if (is_array($errors)) {
                    $this->setError($field, $errors);
                    continue;
                }

                //If we are going to move the file, figure out what its new name
                //will be before the import step, so we can save the new filename
                //to the database.
                // @TODO: Remove this check after imaging uploader is refactored
                if ($this->fileMove) {
                    // Note: The only implementation of the below gets the username
                    // @see imaging_uploader/php/NDB_Menu_Filter_imaging_uploader.class.inc#L529
                    $newTargetDirectory =$this->callFileHandler($field, 'move');
                    if (!$this->getNewDirectory($newTargetDirectory)) {
                        continue;
                    }
                    $this->moveFile());
                }

                //Import the file using the importFile method of the handler
                //class.
                $fileImported =$this->callFileHandler($field, 'import');
                if (is_array($fileImported)) {
                    $this->setError($field, $fileImported);
                    continue;
                }
            }
        }
        return true;
    }


    /**
     * Initializes the necessary file handling properties and ensures
     * the file was uploaded succesfully.
     *
     * This function calls the QuickForm getElement function to get a handle on the
     * file ($this->file), and checks to ensure that it was uploaded correctly. It
     * then registers the file info in the $this->fileInfo property.
     *
     * @return bool    $success        if operation succeeded
     */
    private function preprocessFile()
    {
        $this->file =& $this->form->getElement($this->fieldName);
        if (!method_exists($this->file, "isUploadedFile")) {
            return false;
        }
        if ($this->file->isUploadedFile()) {
            $this->fileInfo = $this->file->getValue();
            return true;
        }
        return false;
    }


    /**
     * Calls an external method of a class to verify whether
     * the file is valid.
     *
     * @param string $field  The name of the class to call.
     * @param string $action The name of the method to call.
     *
     * @return boolean true if operation succeeded
     */
    public function callFileHandler($field, $action)
    {
        $class  =$this->fileHandlers[$field]['class'];
        $method =$this->fileHandlers[$field]['methods'][$action];
        $args   =array();

        //If handlerArgs are being passed, include them
        if (is_array($this->handlerArgs)) {
            $args =array_merge($args, $this->handlerArgs);
        }

        //Call the method
        $func = array(
                 $class,
                 $method,
                );
        $args = array(
                 &$this,
                 $args,
                );

        $output = call_user_func_array($func, $args);
        return $output;
    }


    /**
     * Moves the file from the tmp directory to its final destination.
     *
     * @return bool    status of operation
     */
    public function moveFile()
    {
        // Prepare the name before moving
        $this->normalizeDestinationFilename();
        // Move the file
        if (!$this->file->moveUploadedFile(
            $this->destinationDirectory,
            $this->destinationFilename
        )) {
            $this->setError(
                $this->fieldName,
                "Could not move file to "
                . $this->destinationDirectory
                . $this->destinationFilename
            );
            return false;
        }
        chmod("$this->destinationDirectory$this->destinationFilename", 0666);
        return true;
    }


    /**
     * Builds the final directory for the file.
     *
     * @param string $destination_dir The name of the destination directory.
     *
     * @return bool    if operation succeeded
     */
    public function getNewDirectory($destination_dir="")
    {
        $dest_dir =$this->baseUploadDirectory.$destination_dir;

        //Make sure the dir ends with a trailing slash
        if (substr($dest_dir, -1, 1) != "/") {
            $dest_dir .="/";
        }
        //Make sure the dir exists, if necessary (and
        //$this->createDirectories==true) then create it.
        if (file_exists($dest_dir) && !is_dir($dest_dir)) {
            $this->setError(
                $this->fieldName,
                "A file named '$dest_dir' exists in your chosen upload root. "
                . "Could not create directory with same name."
            );
            return false;
        } else if (!file_exists($dest_dir)) {
            $config = NDB_Config::singleton();
            mkdir($dest_dir, 0775);
            $grp = $config->getSetting('FileGroup');
            if (!empty($grp)) {
                chgrp($dest_dir, $grp);
            }
        } else if (!file_exists($dest_dir)) {
            $this->setError(
                $this->fieldName,
                "Destination directory '$dest_dir' does not exist"
            );
            return false;
        }
        if (!is_writable($dest_dir)) {
            $this->setError(
                $this->fieldName,
                "Destination directory '$dest_dir' is not writeable"
            );
            return false;
        }

        $this->destinationDirectory =$dest_dir;
        return true;
    }


    /**
     * Remove unwanted characters from filename and add
     * numeric suffix to prevent duplication.
     *
     * @return void
     */
    public function normalizeDestinationFilename()
    {
        //Strip out any unwanted characters from the filename
        $safe_name = $this->nameToSafe($this->fileInfo['name']);

        // If there is already a file with this name in the target directory
        // add a numeric suffix to avoid overwriting
        if (file_exists($this->destinationDirectory . $safe_name)) {
            $safe_name = $this->nameToIncremental($dest_dir, $safe_name);
        }

        $this->destinationFilename = $safe_name;
    }



    /**
     * Tests the handler to ensure the class and its methods
     * exist.
     *
     * @param string $field The field whose handler we should test.
     *
     * @return boolean True if the class is valid.
     * @see    File_Upload::processFiles()
     */
    private function isValidFileHandler($field)
    {
        $class =&$this->fileHandlers[$field]['class'];
        if (is_object($class)) {
            $test =&$class;
        } else if (class_exists($class)) {
            $test =new $class;
        } else {
            $this->setError($field, "$class does not exist.");
            return false;
        }
        //Test each method
        foreach ($this->fileHandlers[$field]['methods'] as $method) {
            if (!method_exists($test, $method)) {
                $this->setError(
                    $field,
                    "Method '$method' of object does not exist."
                );
                return false;
            }
        }
        if (!is_object($class)) {
            unset($test);
        }
        return true;
    }

    /**
     * Registers a quickform object and the file fields you want to use with it.
     *
     * @param object $quickform The quickform object to register with File_Upload
     *
     * @return true
     */
    public function registerForm(&$quickform)
    {
        $this->form =&$quickform;
        return true;
        //@TODO Should test to see if form is valid and if not return an error.
    }

    /**
    * Sets the field file types.
    *
    * This is used by processFiles to determine which handler class to use for
    * each field.
    *
    * @param string $fieldName The name of the field in the quickform to associate
    *                          with
    * @param string $className The name of the class in the quickform to associate
    *                          with
    * @param array  $methods   An array of methods to assign to the field.
    *                          The keys must be the name of the action to
    *                          associate with the method, either verify,
    *                          import, or move.  If any (or all) of these
    *                          are empty the defaults will be used.
    *
    * @return boolean true
    * @see    File_Upload::processFiles()
    * @cleanup
    */
    public function setFileHandler($fieldName, $className, $methods="")
    {
        // TODO: There is no implementation of this function that uses
        // custom methods. The function signature should be changed
        $default_methods =array(
                           "verify" => "isValid",
                           "import" => "importFile",
                           "move"   => "getTargetDirectory",
                          );
        $methods =$default_methods;
        $this->fileHandlers[$fieldName]['class']   =$className;
        $this->fileHandlers[$fieldName]['methods'] =$methods;
        $this->fieldNames[] =$fieldName;
        return true;
    }


    /**
     * Sets arguments to provide the File Handlers.
     *
     * This is used to pass the handler objects any user arguments,
     * like candID or SessionID.
     *
     * @param array $args An associative array.
     *
     * @return boolean true
     * @see    File_Upload::processFiles()
     */
    public function setHandlerArgs($args)
    {
        if (!is_array($args)) {
            return false;
        }
        $this->handlerArgs =$args;
        return true;
    }


    /**
     * Formats a file name to be safe (No longer than 250 characters and
     * only contains alphanumeric characters, plus ",", ".", "_", "+", "(",
     * ")", or "-")
     *
     * @param string $name   The string file name
     * @param int    $maxlen Maximun permited string lenght
     *
     * @return string Valid file name
     * @see    File_Upload::moveFile()
     */
    private function nameToSafe($name, $maxlen=250)
    {
        // Non-permitted chars are replaced with "_"
        return preg_replace('/[^a-zA-Z0-9,._\+\()\-]/', '_', $name);
    }

     /**
      * Splits a filename into name and extension
      *
      * @param string $name The string file name
      *
      * @return string split file name
      * @see    File_Upload::nameToIncremental()
      */
    private function getSplitFilename($name)
    {
        if (strstr($name, ".")) {
            $extpos       =strrpos($name, ".");
            $file['name'] =substr($name, 0, $extpos);
            $file['ext']  =substr($name, $extpos);
        } else {
            $file['name'] =$name;
        }
        return $file;
    }

    /**
     * Adds a numeric extension to the filename in order
     * to ensure it does not overwrite an exisitng file of the same name.
     *
     * The numeric extension is in the .XXX format starting with .000 and
     * incrementing by one for each additional file.
     *
     * @param string $dir  The target directory for the file.
     * @param int    $name The proposed name for the file.
     *
     * @return string New filename
     * @see    File_Upload::moveFile()
     */
    private function nameToIncremental($dir, $name)
    {
        $done =false;
        $i    =0;
        while ($done==false) {
            $ext      =str_pad($i, 3, "0", STR_PAD_LEFT);
            $filename =$this->getSplitFilename($name);
            $new_name =$filename['name']."-".$ext.$filename['ext'];
            if (!file_exists($dir.$new_name)) {
                $done =true;
            }
            $i++;
        }
        return $new_name;
    }

    /**
     * Sets the base directory to move validated files into.
     * This directory may be added to by individual class handlers.
     *
     * @param string $dir The desired directory.  Use a trailing slash.
     *
     * @return void
     * @see    File_Upload::moveFile()
     */
    public function setBaseUploadDirectory($dir)
    {
        if (substr($dir, -1, 1) != "/") {
            $dir .="/";
        }
        $this->baseUploadDirectory = $dir;
    }

    /**
    * Gets the final destination directory for the uploaded file
    *
    * @return string directory
    * @see    File_Upload::getNewFilename()
    */
    public function getDestinationDirectory()
    {
        return $this->destinationDirectory;
    }


    /**
    * Gets the final filename for the uploaded file
    *
    * @see    File_Upload::getNewFilename()
    * @return string filename
    */
    public function getDestinationFilename()
    {
        return $this->destinationFilename;
    }

    /**
    * Adds an error to the error log
    *
    * @param string       $field The field to attach the error to.
    * @param string|array $msg   The string or array of error messages to add.
    *
    * @return void
    */
    private function setError($field, $msg)
    {
        if (!is_array($this->errorLog[$field])) {
            $this->errorLog[$field] = array();
        }
        if (is_array($msg)) {
            $this->errorLog[$field] =array_merge($this->errorLog[$field], $msg);
        } else {
            $this->errorLog[$field][] =$msg;
        }
    }


    /**
    * Gets the array of errors
    *
    * @see    File_Upload::setError()
    * @return array   errors
    */
    function getErrors()
    {
        return $this->errorLog;
    }
}

?>
