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
 * @link     https://github.com/aces/Loris
 */

try {
    /**
     * The link constructed from the front end sets the testName
     * parameter, not the Module parameter.
     */
    if (isset($_REQUEST['testName'])) {
        $mname = $_REQUEST['testName'];
    }

    $m = Module::factory($mname);
} catch (Exception $e) {
    $m = '';
}
if (!empty($m)) {
    $page = !empty($_REQUEST['subtest']) ? $_REQUEST['subtest'] : $mname;
    $help = array(
             'content' => $m->getHelp($page),
             'format'  => 'markdown',
            );
    print json_encode($help);
    ob_end_flush();
    exit(0);
}

// Wasn't a module, so fall back on the old style of DB lookup.
require_once "helpfile.class.inc";

if (!empty($_REQUEST['testName'])) {
    if (empty($_REQUEST['subtest'])) {
        $helpID = \LORIS\help_editor\HelpFile::hashToID(md5($_REQUEST['testName']));
    } else {
        $helpID = \LORIS\help_editor\HelpFile::hashToID(md5($_REQUEST['subtest']));
    }
}

$help_file       = \LORIS\help_editor\HelpFile::factory($helpID);
$data            = $help_file->toArray();
$data['content'] = trim($data['content']);

if (empty($data['updated'])) {
    $data['updated'] = "-";
    // if document was never updated should display date created
    if (!empty($data['created'])) {
        $data['updated'] = $data['created'];
    }
}
print json_encode($data);
ob_end_flush();
