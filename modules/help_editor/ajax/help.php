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

try {
        /**
         * The link constructed from the front end sets the test_name
         * parameter, not the Module parameter.
         */
        if (isset($_REQUEST['test_name'])) {
		$mname = $_REQUEST['test_name'];
	}
	
	$m = Module::factory($mname);
} catch (Exception $e) {
	$m = '';
}
if (!empty($m)) {
	$page = !empty($_REQUEST['subtest']) ? $_REQUEST['subtest'] : $mname;
	$help['content'] = $m->getHelp($page);
	$help['format'] = 'markdown';
	print json_encode($help);
	ob_end_flush();
	exit(0);
}

// Wasn't a module, so fall back on the old style of DB lookup.
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
$data['content'] = trim($data['content']);

if (empty($data['updated']) ) {
    $data['updated'] = "-";
    // if document was never updated should display date created  
    if (!empty($data['created'])) {
        $data['updated'] = $data['created']; 
    }
}
print json_encode($data);
ob_end_flush();
