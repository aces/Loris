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
print get_include_path();
require_once "../tools/generic_includes.php";
///get the log file-name

$data_source_file = getLatestLogFile();
while (true) {
    clearstatcache();
    if (file_get_contents($data_source_file) === '') {
        sleep(1);
        continue;
    }
    try {
    	print "data-source-file" . $data_source_file . "<BR>";
        $file = fopen($data_source_file, "r+");
        if (!$file) {
            throw new Exception("Could not open the log file!");
        } else {
            flock($file, LOCK_EX); 
            $data = file_get_contents($data_source_file);
            ftruncate($file, 0);
            flock($file, LOCK_UN);
            fclose($file);
        }
    } catch(Exception $e) {
        $data = "Error: " . $e->getMessage();
    }   
    echo $data;
    ob_flush();
    flush();
    break;
}

function getLatestLogFile() {
	
	//get the path from the config file
	$config =& NDB_Config::singleton();
	$paths = $config->getSetting('paths');
	if (empty($paths)) {
		print "config setting is missing";
    	error_log("ERROR: Config settings are missing");
	}
	$log_directory = $paths['base'] . "/" . $config->getSetting('log');
	print "log directory is " . $log_directory . "<BR>";
	//get the last file modified
	$files = glob($log_directory."/*MRI_upload*");
	$files = array_combine($files, array_map("filemtime", $files));
	arsort($files);
	$data_source_file = key($files);
	if (!file_exists($data_source_file)) {
		print "File doesn't exist";
	}
	print "data source file is" . $data_source_file;
	return $data_source_file;
}
?>