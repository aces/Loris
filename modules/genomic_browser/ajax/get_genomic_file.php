<?php
/**
 * Used by genomic_browser modules for accessing genomic_files
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  MRI
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

// Checks that config settings are set
$config =& NDB_Config::singleton();
$path   = $config->getSetting('GenomicDataPath');

// Basic config validation
if (empty($path) || !is_dir($path)) {
    error_log("ERROR: Config setting GenomicDataPath $path is invalid");
    header("HTTP/1.1 500 Internal Server Error");
    exit(1);
}


// Now get the file and do file validation
if (empty($_GET['GenomicFileID'])) {
    error_log("Missing required parameters for request");
    header("HTTP/1.1 400 Bad Request");
    exit(2);
}

$DB      =& Database::singleton();
$results = $DB->pselect(
    'SELECT 
         FileName,
         FileType
     FROM 
         genomic_files 
     WHERE 
         GenomicFileID = :v_file_id',
    array('v_file_id' => $_GET['GenomicFileID'])
);

if (count($results) < 1) {
    error_log("ERROR: GenomicFileID $_GET[GenomicFileID] does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(5);
}

$file      = $results[0];
$full_path = $file['FileName'];
$file_name = basename($full_path);

if (!file_exists($full_path) || !is_readable($full_path)) {
    error_log("ERROR: File $full_path does not exist");
    header("HTTP/1.1 404 Not Found");
    exit(5);
}


$fp   = fopen($full_path, 'r');
$size = filesize($full_path);

header("Content-Disposition: attachment; filename=$file_name");
header("Content-length: $size");

fpassthru($fp);
fclose($fp);
