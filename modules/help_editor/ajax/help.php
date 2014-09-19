<?php
/**
 * This file retrieves content for specific help section
 * and returns a json object 
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');

ob_start('ob_gzhandler');
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();

require_once "HelpFile.class.inc";

// create DB object
$DB =& Database::singleton();
if (Utility::isErrorX($DB)) {
    return PEAR::raiseError("Could not connect to database: ".
                             $DB->getMessage());
}

// store some request information
if (!empty($_REQUEST['helpID'])) {
    $helpID = $_REQUEST['helpID'];
} else {
    if (!empty($_REQUEST['test_name'])) {
        $helpID = HelpFile::hashToID(md5($_REQUEST['test_name']));

    }
    if (!empty($_REQUEST['test_name']) && !empty($_REQUEST['subtest']) ) {
        $helpID = HelpFile::hashToID(md5($_REQUEST['subtest']));
    }
}
$help_file       = HelpFile::factory($helpID);
$data            = $help_file->toArray();
$data['content'] = trim($data['content']);
if (empty($data['content'])) {
    $data['content'] = 'Under Construction';
}
if (empty($data['updated']) ) {
    $data['updated'] = "-";
    // if document was never updated should display date created  
    if (!empty($data['created'])) {
        $data['updated'] = $data['created']; 
    }
}
print json_encode($data);
ob_end_flush();
