#!/usr/bin/env php
<?php declare(strict_types=1);
/**
 * The modules.php script a database and automatically adds any new modules from
 * either the project/modules or loris/modules directory and maintains the
 * modules table based on the filesystem state.
 *
 * If the --add parameter is provided, it will add any new directories that
 * have a valid \Module descriptor to the modules table.
 *
 * If the --remove parameter is provided, it will remove anything in the
 * modules table that can not be instantiated with from the modules table.
 *
 * If the -n flag is provided, it will not actually add/delete from the
 * table, but only tell you what it would otherwise do.
 *
 * PHP Version 7
 *
 * @category   Data
 * @package    Main
 * @subpackage Data
 * @author     Dave MacFarlane <driusan@gmail.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */

require_once 'generic_includes.php';

$flags = getopt("nh", ['add', 'remove', 'dry-run', 'help']);


$dryrun = isset($flags['n']) || isset($flags['dry-run']);
$help   = isset($flags['h']) || isset($flags['help']);

if ($help) {
    usage();
    exit(0);
}

if (!isset($flags['add']) && !isset($flags['remove'])) {
    usage();
    fwrite(STDERR, "\nMust specify --add or --remove flag\n");
    exit(1);

}

$currentModules = $DB->pselectCol(
    "SELECT Name FROM modules",
    []
);
if (isset($flags['remove'])) {
    foreach ($currentModules as $module) {
        try {
            $lorisInstance->getModule($module);
        } catch (\LorisNoSuchModuleException | \LorisModuleMissingException $e) {
            print "Removing $module\n";
            if ($dryrun) {
                continue;
            }
        }
        try {
            // Attempt to delete the module
            $DB->delete("modules", ['Name' => $module]);
        } catch (\Exception $e) {
            // Handle the delete failure
            print "Failed to delete $module: " . $e->getMessage() . "\n";
        }
    }
}

if (isset($flags['add'])) {
    addDir(__DIR__ . "/../modules");
    addDir(__DIR__ . "/../project/modules");
}

/**
 * Adds a new entry to the `modules` table for any subdirectories under $moduledir
 * that are valid modules
 *
 * @param string $moduledir The path to a directory containing code for a
 *                          LORIS module.
 *
 * @return void
 */
function addDir(string $moduledir): void
{
    global $DB;
    global $lorisInstance;
    global $dryrun;
    global $currentModules;

    $modules = scandir($moduledir);
    foreach ($modules as $module) {
        if (in_array($module, [".", ".."], true)) {
            continue;
        }
        if (!in_array($module, $currentModules, true)) {
            if (is_dir("$moduledir/$module")) {
                try {
                    $lorisInstance->getModule($module);
                } catch (\LorisNoSuchModuleException
                    | \LorisModuleMissingException $e
                ) {
                    // Wasn't a valid module, so don't add it.
                    continue;
                }

                print "Adding $module\n";
                if ($dryrun) {
                    continue;
                }
                $DB->insert(
                    "modules",
                    [
                        'Name'   => $module,
                        'Active' => 'Y'
                    ]
                );
            }
        }
    }
}

/**
 * Prints help text for this tool.
 *
 * @return void
 */
function usage(): void
{
    global $argv;
    print <<<ENDHELP
usage: $argv[0] [-n] [--add] [--remove]

Options:
    -n/--dry-run  Do not make any changes to database, only print what would be done
    -h/--help     Show this screen
    --add         Add modules in modules directory not in modules table if they have
                  a valid module descriptor
    --remove      Remove any modules from modules table that can not be instantiated

ENDHELP;

}
