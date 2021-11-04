<?php
/**
 * This file retrieves content for specific help section
 * and returns a json object
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */

try {
    $moduleName  = $_REQUEST['testName'] ?? null;
    $subpageName = $_REQUEST['subtest'] ?? null;
    $m           = Module::factory($moduleName);
    // Load help data. Try to load subpage first as its more specific and
    // will only be present some of the time. Fallback to the module name if
    // no subpage present.
    $help = [
        'content' => $m->getHelp($subpageName ?? $moduleName),
        'format'  => 'markdown',
    ];
    print json_encode($help);
    ob_end_flush();
    exit;
} catch (Exception $e) {

    // Wasn't a module, so fall back on the old style of DB lookup.
    include_once "helpfile.class.inc";

    if (!empty($moduleName)) {
        try {
            $helpID    = \LORIS\help_editor\HelpFile::hashToID(
                md5($subpageName ?? $moduleName)
            );
            $help_file = \LORIS\help_editor\HelpFile::factory($helpID);
            $data      = $help_file->toArray();
        } catch (\NotFound $e) {
            // Send data with empty strings so that the content can be edited
            $data = [
                'content' => '',
                'topic'   => '',
                'updated' => ''
            ];
        }

        $data['content'] = trim($data['content']);

        if (empty($data['updated'])) {
            // if document was never updated should display date created
            if (!empty($data['created']) && isset($data['created'])) {
                $data['updated'] = $data['created'];
            } else {
                $data['updated'] = "-";
            }
        }
    }
    print json_encode($data);
    ob_end_flush();
}
