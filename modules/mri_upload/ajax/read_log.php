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

require_once 'NDB_Config.class.inc';
header("Cache-Control: no-store, no-cache, must-revalidate");
$data_source_file = getTheLoGfile();  //get the latest log file

while (true) {
    clearstatcache();
    if (file_get_contents($data_source_file) === '') {
        sleep(1);
        continue;
    }
    try {
        $file = fopen($data_source_file, "r+");
        if (! $file) {
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

function getTheLoGfile() {
	
	$config =& NDB_Config::singleton();
	$log_location = $config->getSetting('log');
	$base_path = $config->getSetting('base');
        $log_path = $base_path . "/" . $log_location;
	$files = glob($log_path. "/MRI_upload*");
	$files = array_combine($files, array_map("filemtime", $files));
	arsort($files);
	$data_source_file = key($files);
	return $data_source_file;
}	

?>
