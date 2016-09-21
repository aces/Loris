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
require_once "HelpFile.class.inc";

if (!empty($_REQUEST['test_name'])) {
    if (empty($_REQUEST['subtest'])) {
        $helpID = HelpFile::hashToID(md5($_REQUEST['test_name']));
    } else {
        $helpID = HelpFile::hashToID(md5($_REQUEST['subtest']));
    }
}

$help_file       = HelpFile::factory($helpID);
$data            = $help_file->toArray();
$data['content'] = utf8_encode(trim($data['content']));
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
