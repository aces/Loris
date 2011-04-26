<?php
/**
 * @package main
 * This file now controls the passing through of report files and all other stuff people should not be able to get without permission
 * It will prevent you from passing anything starting with a '/' or containing '..' or not being a '.xls'
 * your config will need an entry like <reports>/export-01/innomed/mri-data/minc/</reports> in the path section
 */

// the usual neurodb calls
require_once "NDB_Client.class.inc"; 
$client =& new NDB_Client(); 
$client->initialize("../project/config.xml");

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
$contentType='application/octet-stream';

// passthrough of reports
if ($blessPass) {
    $reportsPath  = $config->getSetting('reports');
    $reportsFile = $reportsPath."/".$_GET['file'];

    if(!file_exists($reportsFile)) exit;
    
    header("Pragma: ");
    header("Cache-Control: ");
    header("Content-type: $contentType");
    header("Content-Disposition: attachment; filename=\"".$_GET['file']."\"");
    header("Content-length:".(string)(filesize($reportsFile)));
    $pf = fopen($reportsFile, 'r');
    fpassthru($pf);
    fclose($pf);
}

function blessPassThrough($toBless) {
    $bad  = '/';
    $bad1 = '..';
    if ( (strpos($toBless, $bad1) !== FALSE) || ( strpos($toBless,$bad) == 0 && strpos($toBless,$bad) !== FALSE ) ) { 
        
        return false;    
    }
    if (strrpos($toBless, '.xls') ) {
        return true;
    } 
    
    return false; 
}


?>
