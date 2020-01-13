#!/usr/bin/env php
<?php
/**
 * The modules.php script a database and automatically adds any new modules from
 * either the project/modules or loris/modules directory and maintains the
 * modules table based on the filesystem state.
 *
 * If the --add parameter is provided, it will add any new directories that
 * have a valid \Module descriptor to the modules table.
 *
 * If the --remove parameter is provided, it will remove anything in the
 * modules table that can not be instantiated with Module::factory from
 * the modules table.
 *
 * If the -n flag is provided, it will not actually add/delete from the
 * table, but only tell you what it would otherwise do.
 *
 * PHP Version 7
 */

require_once 'generic_includes.php';

$flags = getopt("n", ['add', 'remove', 'dry-run']);

$currentModules = $DB->pselectCol(
    "SELECT Name FROM modules",
    []
);

$dryrun = isset($flags['n']) || isset($flags['dry-run']);

if(isset($flags['remove'])) {
    foreach($currentModules as $module) {
        try {
            Module::factory($module);
        } catch(\LorisModuleMissingException $e) {
            print "Removing $module\n";
            if($dryrun) {
                continue;
            }
            $DB->delete("modules", [ 'Name' => $module]);
        }
    }
}

if(isset($flags['add'])) {
    addDir(__DIR__ . "/../modules");
    addDir(__DIR__ . "/../project/modules");
}

function addDir(string $moduledir) {
    global $DB;
    global $dryrun;
    global $currentModules;

    $modules = scandir($moduledir);
    foreach ($modules as $module) {
        if(in_array($module, [".", ".."], true)) {
            continue;
        }
        if(!in_array($module, $currentModules, true)) {
            if(is_dir("$moduledir/$module")) {
                try {
                    Module::factory($module);
                } catch(\LorisModuleMissingException $e) {
                    // Wasn't a valid module, so don't add it.
                    continue;
                }

                print "Adding $module\n";
                if($dryrun) {
                    continue;
                }
                $DB->insert(
                    "modules",
                    [
                        'Name' => $module,
                        'Active' => 'Y'
                    ]
                );
            }
        }
    }
}
