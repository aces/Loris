<?php

/**
 * script to read messages written by mri_upload
 *
 * PHP version 5
 *
 * @category Script
 * @package  Main
 * @author   Olga Tsibulevskaya  <olgatsib@gmail.com>
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
*/



header("Cache-Control: no-store, no-cache, must-revalidate");
require_once "../tools/generic_includes.php";


///////////////////////////////////////////////////////////////////////////////
//////////////////////////////get the log file-name////////////////////////////
///////////////////////////////////////////////////////////////////////////////
$data_source_file = getLatestLogFile();

/**
 * Create a temp file to avoid the original file to be truncated
 * 
 */
$temp_data_source_file = $data_source_file . ".tmp";

///file doesn't exist create it
if (file_exists($temp_data_source_file)) {
    if (!file_exists($temp_data_source_file)) {
        if (!copy($data_source_file,$temp_data_source_file)) {
            print "cannot be copied";
        }
    }
}


clearstatcache();

///create a new temp file for the info



$file = fopen($temp_data_source_file, "r+");

////if the file is opened
if ($file) {
    ////////Lock the file
    if(flock($file, LOCK_EX)){
        
        $data = fread($file, filesize($temp_data_source_file));//get the data from the file
        ftruncate($file, 0);//truncate the file
        fflush($file); //writes the buffered output to the file
        flock($file, LOCK_UN);  //locks the file
        echo $data;
    } else {
        echo "could not lock file";
    }
}

//}
/**
 * get the last changed log file using in the 
 * $paths['base'] . "/" . $paths['log']."/MRI_upload" directory
 *
 * @return String latest log file
 */

function getLatestLogFile() {
	
	$config = NDB_Config::singleton();
	$paths = $config->getSetting('paths');
    ///////////////////////////////////////////////////////////////////////////
	///////////////////get the path from the config file///////////////////////
	///////////////////////////////////////////////////////////////////////////
	if (empty($paths)) {
		print "config setting is missing";
    	error_log("ERROR: Config settings are missing");
	}
	
	///////////////////////////////////////////////////////////////////////////
	//////////////////////Get the directory name///////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	$log_directory = $paths['base'] . "/" . $paths['log']."/MRI_upload";
	//print "log directory " . $log_directory . "<BR>";
	
	//get the last file modified
	///////////////////////////////////////////////////////////////////////////
	////////////////find the file last changed/////////////////////////////////
	///////////////////////////////////////////////////////////////////////////
	$files = glob($log_directory."/*MRI_upload*");
	$files = array_combine($files, array_map("filemtime", $files));
	arsort($files);
	$data_source_file = key($files);
	if (!file_exists($data_source_file)) {
		print "File doesn't exist";
	}
	return $data_source_file;
}
?>
