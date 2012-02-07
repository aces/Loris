<?php
/**
 * @package mri
 * This file now controls the passing through of all mri qc related images.
 * It will prevent you from passing anything starting with a '/' or containing '..' or not being a '.jpg', '.raw_byte.gz', '.header' 
 * your config will need an entry like <imagePath>/export-01/innomed/mri-data/minc/</imagePath> in the path section
 */

// the usual neurodb calls
require_once "NDB_Client.class.inc"; 
$client =& new NDB_Client(); 
$client->initialize("../../../project/config.xml");

// create Database object
$DB =& Database::singleton(); 
if(PEAR::isError($DB)) { print "Could not connect to database: ".$DB->getMessage()."<br>\n"; die(); }

// user is logged in, let's continue with the show...
$user =& User::singleton(); 
if(PEAR::isError($user)) { die("Error creating user object: ".$user->getMessage()); }

// read the config
$config =& NDB_Config::singleton();

$blessPass = 0;
$blessPass = blessPassThrough($_GET['file']);

// passthrough of jpg and jiv images
if ($blessPass) {
    $imagePath  = $config->getSetting('imagePath');
    $imageFile = $imagePath."/".$_GET['file'];
    if(file_exists($imageFile)) {
        $pf = fopen($imageFile, 'r');
        fpassthru($pf);
        fclose($pf);
    }
} else {
    // If the file isn't blessed because it's the wrong type or starts with a /,
    // it's still available if it's under DownloadPath. We just check to make sure it doesn't
    // have ".." in it  so that the user can't escape DownloadPath.
    $downloadPath = $config->getSetting('DownloadPath');
    $downloadFile = $downloadPath.$_GET['file'];
    if(file_exists($downloadFile) && strrpos($_GET['file'], '..') === FALSE) {
        header("Content-type: application/x-minc");
        header("Content-Disposition: attachment; filename=\"".basename($_GET['file'])."\"");

        $pf = fopen($downloadFile, 'r');
        fpassthru($pf);
        fclose($pf);
        exit;
    } else {
        print "File not found\n";
    }
}

function blessPassThrough($toBless) {
    $bad  = '/';
    $bad1 = '..';
    if ((strpos($toBless, $bad1) !== FALSE) || ( strpos($toBless,$bad) == 0 ) ) { 
        return false;    
    }

    if (strrpos($toBless, '.jpg') || strrpos($toBless, '.raw_byte.gz') || strrpos($toBless, '.header') || strrpos($toBless, '.mnc')) {
        return true;
    } 
    
    return false; 
}


?>
