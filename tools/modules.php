#!/usr/bin/env php
<?php
require_once __DIR__ . "/../vendor/autoload.php";
require_once 'generic_includes.php';

$flags = getopt("n", ['add', 'remove', ]);

$currentModules = $DB->pselectCol(
    "SELECT Name FROM modules",
    []
);

$dryrun = isset($flags['n']);
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
    $moduledir = __DIR__ . "/../modules";
    $modules = scandir(__DIR__ . "/../modules");
    foreach ($modules as $module) {
        if(in_array($module, [".", ".."], true)) {
            continue;
        }
        if(!in_array($module, $currentModules, true)) {
            if(is_dir("$moduledir/$module")) {
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
