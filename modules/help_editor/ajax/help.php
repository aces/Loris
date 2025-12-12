<?php declare(strict_types=1);

/**
 * This file retrieves content for specific help section
 * and returns a json object
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */

$factory  = \NDB_Factory::singleton();
$user     = $factory->user();
$editable = $user->hasPermission('context_help');
try {

    $moduleName  = $_REQUEST['testName'] ?? null;
    $subpageName = $_REQUEST['subtest'] ?? null;
    $m           = $loris->getModule($moduleName);
    // Load help data. Try to load subpage first as its more specific and
    // will only be present some of the time. Fallback to the module name if
    // no subpage present.
    $help = [
        'content'  => $m->getHelp($subpageName ?? $moduleName),
        'source'   => 'helpfile',
        'editable' => $editable,
    ];
    print json_encode($help);
    if (ob_get_level() > 0) {
        ob_end_flush();
    }

    exit(0);
} catch (Exception $e) {

    // Wasn't a module, so fall back on the old style of DB lookup.
    include_once "helpfile.class.inc";

    if (!empty($moduleName)) {
        try {
            $helpID = \LORIS\help_editor\HelpFile::hashToID(
                md5($subpageName ?? $moduleName)
            );

                    $help_file = \LORIS\help_editor\HelpFile::factory($helpID);
                    $data      = $help_file->toArray();
        } catch (\NotFound $e) {
            // Send data with empty strings so that the content can be edited
            $data = [
                'content' => '',
                'topic'   => '',
                'updated' => '',
            ];
        }

        $data['content']  = trim($data['content']);
        $data['editable'] = $editable;
        $data['source']   = 'db';

        if (empty($data['updated'])) {
            // if document was never updated should display date created
            if (!empty($data['created']) && isset($data['created'])) {
                $data['updated'] = $data['created'];
            } else {
                $data['updated'] = "-";
            }
        }
        print json_encode($data);
        ob_end_flush();
    }
}
