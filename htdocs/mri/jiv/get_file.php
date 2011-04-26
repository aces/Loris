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
    if(!file_exists($imageFile)) exit;
    $pf = fopen($imageFile, 'r');
    fpassthru($pf);
    fclose($pf);
}

function blessPassThrough($toBless) {
    $bad  = '/';
    $bad1 = '..';
    if ((strpos($toBless, $bad1) !== FALSE) || ( strpos($toBless,$bad) == 0 ) ) { 
        return false;    
    }

    if (strrpos($toBless, '.jpg') || strrpos($toBless, '.raw_byte.gz') || strrpos($toBless, '.header')) {
        return true;
    } 
    
    return false; 
}


?>
