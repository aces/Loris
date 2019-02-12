<?php
/**
 * This file contains a wrapper for managing and verifying files that are
 * uploaded through PHP QuickForm and handles putting them in the correct place,
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Behavioural
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

/**
 * Class for managing file uploads
 *
 * This class interoperates with HTML_QuickForm to allow easy verification and
 * manipulation of uploaded files.
 *
 * @category Main
 * @package  Behavioural
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class File_Upload
{
    /**
     * Construct the File_Upload class. This sets the default parameters
     * for a file which can be overwritten by calling the set* methods
     */
    function __construct()
    {
        //Set Defaults
        $this->renameMode        = "incremental";
        $this->overwriteMode     = "rename";
        $this->fileMove          = true;
        $this->fileVerify        = true;
        $this->fileImport        = true;
        $this->filenamePrefix    = "";
        $this->createDirectories = true;
        $this->errorLog          = array();
        $this->moveOrCopy        = "move";
        $this->isCLImport        = false;
    }


    /**
     * Loops through the uploaded files running the full suit of functions against
     * them.
     *
     * @return boolean True on success False on failure
     */
    function processFiles()
    {
        //Loop through fields.
        if (empty($this->fieldNames) || !is_array($this->fieldNames)) {
            $this->setError(
                "",
                "No files to process!  Register handlers first."
            );
            return false;
        }

        foreach ($this->fieldNames AS $field) {
            $this->fieldName =$field;
            if (!$this->preProcessFile()) {
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
                //Verify the file
                if ($this->fileVerify) {
                    //Validate the file using the isValid method of the handler
                    //class.
                    $fileVerified =$this->callFileHandler($field, 'verify');
                    if (is_array($fileVerified)) {
                        $this->setError($field, $fileVerified);
                        continue;
                    }
                }

                //If we are going to move the file, figure out what its new name
                //will be before the import step, so we can save the new filename
                //to the database.
                if ($this->fileMove) {
                    $newTargetDirectory =$this->callFileHandler($field, 'move');
                    if (!$this->getNewDirectory($newTargetDirectory)) {
                        continue;
                    }
                    if (!$this->getNewFilename()) {
                        continue;
                    }
                }

                //Import the file
                if ($this->fileImport) {
                    //Import the file using the importFile method of the handler
                    //class.
                    $fileImported =$this->callFileHandler($field, 'import');
                    if (is_array($fileImported)) {
                        $this->setError($field, $fileImported);
                        continue;
                    }
                }

                //Move the file (comes before import so that import knows the
                //name of the filename for storing int he database)
                if ($this->fileMove) {
                    $fileMoved =$this->moveFile();  //Move the file
                    if (is_array($fileMoved)) {
                        continue;
                    }
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
    function preProcessFile()
    {
        if (!$this->isCLImport) {
            $this->file = $this->form->getElement($this->fieldName);
            if (!method_exists($this->file, "isUploadedFile")) {
                return false;
            }
            if ($this->file->isUploadedFile()) {
                $this->fileInfo = $this->file->getValue();
                return true;
            } else {
                return false;
            }
        } else {
            //@NOTE: $this->file needs to be a class object with a
            //moveUploadedFile() method. So it cannot be an array
            //This needs discussion with Loris team!!
            //$this->file     =$this->CLFiles[$this->fieldName];
            //$this->fileInfo =$this->file['info'];
            $this->file     = $this->CLFiles[$this->fieldName]['file'];
            $this->fileInfo = $this->CLFiles[$this->fieldName]['info'];
            return true;
        }
    }


    /**
     * Calls an external method of a class to verify whether
     * the file is valid.
     *
     * @param string $field  The name of the class to call.
     * @param string $action The name of the method to call.
     *
     * @return boolean true if operation succeeded
     * @access public
     */
    function callFileHandler($field, $action)
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

        $output =call_user_func_array($func, $args);

        return $output;
    }


    /**
     * Moves the file from the tmp directory to its final destination.
     *
     * @return bool    $success        if operation succeeded
     * @access public
     */
    function moveFile()
    {
        if ($this->moveOrCopy=="move") {
            if (!$this->file->moveUploadedFile(
                $this->destinationDirectory,
                $this->destinationFilename
            )
            ) {
                $this->setError(
                    $this->fieldName,
                    "Could not move file to "
                    . $this->destinationDirectory
                    . $this->destinationFilename
                );
            }
        } else if ($this->moveOrCopy=="copy") {
            copy(
                $this->fileInfo['tmp_name'],
                $this->destinationDirectory.$this->destinationFilename
            );
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
     * @access public
     */
    function getNewDirectory($destination_dir="")
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
        } else if (!file_exists($dest_dir) && $this->createDirectories) {
            $config = NDB_Config::singleton();
            mkdir($dest_dir, 0775);
            $grp = $config->getSetting('FileGroup');
            if (!empty($grp)) {
                chgrp($dest_dir, $grp);
            }
        } else if (!file_exists($dest_dir) && $this->createDirectories) {
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
     * Builds the final filename for the file.
     *
     * @return bool    if operation succeeded
     * @access public
     */
    function getNewFilename()
    {
        $dest_dir =$this->destinationDirectory;

        //Strip out any unwanted characters from the filename
        $safe_name =$this->filenamePrefix.$this->nameToSafe($this->fileInfo['name']);

        //If there is already a file with this name in the target directory either
        //overwrite, rename, or reject.
        if (file_exists($dest_dir.$safe_name)) {
            switch($this->overwriteMode){
            case "rename":
                if ($this->renameMode=="incremental") {
                    $safe_name =$this->nameToIncremental($dest_dir, $safe_name);
                } elseif ($this->renameMode=="unique"
                    || $this->renameMode=="unique-random"
                ) {
                    $safe_name =$this->nameToUniqueRandom($safe_name);
                } elseif ($this->renameMode=="unique-timestamp") {
                    $safe_name =$this->nameToUniqueTimestamp($safe_name);
                }
                break;
            case "reject":
                $this->setError($this->fieldName, "File Exists, rejecting");
                return false;
                break;
            }
        }

        $this->destinationFilename =$safe_name;
        return true;
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
    function isValidFileHandler($field)
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
        foreach ($this->fileHandlers[$field]['methods'] AS $method) {
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
    function registerForm(&$quickform)
    {
        $this->form =&$quickform;
        return true;
        //@todo Should test to see if form is valid and if not return an error.
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
     */
    function setFileHandler($fieldName, $className, $methods="")
    {
        $default_methods =array(
                           "verify" => "isValid",
                           "import" => "importFile",
                           "move"   => "getTargetDirectory",
                          );
        if (!empty($methods) && is_array($methods)) {
            $methods =array_merge($default_methods, $methods);
        } else {
            $methods =$default_methods;
        }
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
    function setHandlerArgs($args)
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
     * @return string Formatted file name
     * @see    File_Upload::moveFile()
     */
    function nameToSafe($name, $maxlen=250)
    {
        $noalpha = '???????????????????????????????????????????@';
        $alpha   = 'aeiouaeiouaeiouAEIOUAEIOUAEIOUaeiouAEIOUncCa';
        $name    = substr($name, 0, $maxlen);
        $name    = strtr($name, $noalpha, $alpha);
        // not permitted chars are replaced with "_"
        return preg_replace('/[^a-zA-Z0-9,._\+\()\-]/', '_', $name);
    }

     /**
      * Splits a filename into name and extension
      *
      * @param string $name The string file name
      *
      * @return string split file name
      * @see    File_Upload::nameToIncremental()
      * @see    File_Upload::nameToUniqueRandom()
      * @see    File_Upload::nameToUniqueTimestamp()
      */
    function getSplitFilename($name)
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
    function nameToIncremental($dir, $name)
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
      * Gets unique file names in the form:
      *     9022210413b75410c28bef.html
      *
      * @param string $name The target directory for the file.
      *
      * @return string New filename
      * @see    File_Upload::moveFile()
      */
    function nameToUniqueRandom($name)
    {
        $filename =$this->getSplitFilename($name);
        if (! $this->_seeded) {
            srand((double) microtime() * 1000000);
            $this->_seeded = 1;
        }
        $name =$filename['name']."-".uniqid(rand()).$filename['ext'];
        return $name;
    }

    /**
     * Adds the timestamp to the filename in order to make it unique
     *
     * @param int $name The proposed name for the file.
     *
     * @return string $new_name   New filename
     * @see    File_Upload::moveFile()
     */
    function nameToUniqueTimestamp($name)
    {
        $filename =$this->getSplitFilename($name);
        $new_name =$filename['name']."-".time().$filename['ext'];
        return $new_name;
    }

    /**
     * Sets the action to take if moveFile finds discovers an
     * existing file with the same name as the one it is trying to move.
     *
     * The options are:
     * - overwrite:  This overwrites any existing file
     * - rename   :  This renames the file.  Use File_Upload::setRenameMode() to
     *               choose the renaming scheme.
     * - reject   :  This raises an error and does not move the file in any form
     *               to the new directory.
     * Default: rename
     *
     * @param string $mode The desired mode.
     *
     * @return boolean true if overwriting, false on invalid argument
     * @see    File_Upload::moveFile()
     */
    function setOverwriteMode($mode)
    {
        if ($mode=="overwrite"
            || $mode=="reject"
            || $mode=="rename"
        ) {
            $this->overwriteMode =$mode;
            return true;
        } else {
            return false;
        }
    }


    /**
     * Determines how to rename a file if an existing file of the original
     * filename is discovered in the target directory.
     *
     * Used in conjuction with File::setOverwriteMode('rename').  The options are:
     * - incremental        :  This adds a numeric extension to the file which is
     *                         incremented until it does not match an existing file.
     * - unique             :  This adds a unique random string to the end of the
     *                         filename.
     * - unique-random      :  Same as above.
     * - unique-timestamp   :  This adds the current UNIX timestamp to the end of the
     *                         filename.
     * Default: incremental
     *
     * @param string $mode The desired mode.
     *
     * @return boolean true if renaming, false if invalid argument
     * @see    File_Upload::moveFile()
     */
    function setRenameMode($mode)
    {
        if ($mode=="incremental"
            || $mode=="unique"
            || $mode=="unique-timestamp"
            || $mode=="unique-random"
        ) {
            $this->renameMode =$mode;
            return true;
        } else {
            return false;
        }
    }

    /**
     * Turns on/off verifying of files.
     *
     * @param boolean $mode The desired mode.
     *
     * @return void
     * @see    File_Upload::moveFile()
     */
    function setFileVerify($mode)
    {
        $this->fileVerify =$mode;
    }

    /**
     * Turns on/off importing of files.
     *
     * @param boolean $mode The desired mode.
     *
     * @return void
     * @see    File_Upload::moveFile()
     */
    function setFileImport($mode)
    {
        $this->fileImport =$mode;
    }

    /**
     * Turns on/off moving of files.
     *
     * @param boolean $mode The desired mode.
     *
     * @return void
     * @see    File_Upload::moveFile()
     */
    function setFileMove($mode)
    {
        $this->fileMove =$mode;
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
    function setBaseUploadDirectory($dir)
    {
        if (substr($dir, -1, 1) != "/") {
            $dir .="/";
        }
        $this->baseUploadDirectory =$dir;
    }

    /**
     * Sets prefix to be prepended to new filenames
     *
     * @param string $prefix The desired prefix.
     *
     * @return void
     * @see    File_Upload::moveFile()
     */
    function setFilenamePrefix($prefix)
    {
        $this->filenamePrefix =$prefix;
    }


    /**
     * Gets the final destination directory for the uploaded file
     *
     * @return string directory
     * @see    File_Upload::getNewFilename()
     */
    function getDestinationDirectory()
    {
        return $this->destinationDirectory;
    }


    /**
     * Gets the final filename for the uploaded file
     *
     * @see    File_Upload::getNewFilename()
     * @return string filename
     */
    function getDestinationFilename()
    {
        return $this->destinationFilename;
    }

    /**
     * Turns on/off creation of upload directories.
     *
     * @param boolean $mode The desired mode.
     *
     * @see    File_Upload::moveFile()
     * @return null
     */
    function setCreateDirectories($mode)
    {
        $this->createDirectories =$mode;
    }


    /**
     * Adds an error to the error log
     *
     * @param string       $field The field to attach the error to.
     * @param string|array $msg   The string or array of error messages to add.
     *
     * @return void
     */
    function setError($field, $msg)
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


    /**
     * This function registers a file to be used instead of a quickform file.
     *
     * @param string $fileName the full filename including path of the file
     * @param string $fileType the type of the file.  Used to determine which
     *                         importers, etc to run on it.  Same as quickform
     *                         fieldname.
     *
     * @see File_Upload::preProcessFile()
     *
     * @return null
     */
    function addCLFile($fileName, $fileType)
    {
        $this->CLFiles[$fileType]['info']['tmp_name'] =$fileName;
        $this->CLFiles[$fileType]['info']['name']     =basename($fileName);
    }
}

?>
