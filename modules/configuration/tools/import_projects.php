<?php
/**
 * This script should be used to migrate existing ProjectIDs and
 * SubprojectIDs from the config.xml to the subprojects table, so that
 * they can be managed from the frontend.
 *
 * Usage: php import_project.php [-option]
 *
 * It has three options:
 *     -s -> Imports only the subprojects from the XML.
 *
 *     -p -> Imports only the projects from the XML.
 *
 *     -a -> Imports both the subprojects and the projects
 *           from the XML.
 * PHP Version 5
 *
 * @category Loris
 * @package  Configuration
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . "/../../../vendor/autoload.php";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();
$factory   = NDB_Factory::singleton();
$config    = $factory->config(__DIR__ . "/../../../project/config.xml");
$subprojs  = $config->getSettingFromXML("subprojects");
$db        = $factory->database();
$optionpos = 1; //The position of the option in the command line.

if (is_null($argv[$optionpos])
) {
    echo ("The script needs an argument. The arguments are -s,-p or -a.\r\n");
    echo ("-s -> Imports only the subprojects from the XML.\r\n");
    echo ("-p -> Imports only the projects from the XML.\r\n");
    echo ("-a -> Imports both the subprojects and the projects \r\n");
    echo ("      from the XML.\r\n");
    exit(2);
}
if ((isset($argv[$optionpos]) && $argv[$optionpos] === "-s")
    || (isset($argv[$optionpos]) && $argv[$optionpos] === "-a")
) {
    foreach ($subprojs['subproject'] as $row) {
        $windowDiff = "optimal";
        if (isset($row['options']) && isset($row['options']['WindowDifference'])) {
            $windowDiff = $row['options']['WindowDifference'];
        }
        $ins = array(
                'SubprojectID'     => $row['id'],
                'title'            => $row['title'],
                'useEDC'           => 0,
                'WindowDifference' => $windowDiff,
               );
        if ($row['options']['useEDC'] === '1'
            || $row['options']['useEDC'] === 'true'
        ) {
            $ins['useEDC'] = 1;
        }
        $ins = Utility::nullifyEmpty($ins, 'WindowDifference');
        $ins = Utility::nullifyEmpty($ins, 'useEDC');
        $db->insert('subproject', $ins);
    }
}
if ((isset($argv[$optionpos]) && $argv[$optionpos] === "-p")
    || (isset($argv[$optionpos]) && $argv[$optionpos] === "-a")
) {
    $config   = $factory->config(__DIR__ . "/../../../project/config.xml");
    $projects = $config->getSettingFromXML("Projects");
    $db       = $factory->database();
    foreach ($projects['project'] as $row) {
        $insert = array(
                   'ProjectID'         => $row['id'],
                   'Name'              => $row['title'],
                   'recruitmentTarget' => $row['recruitmentTarget'],
                  );
        $insert = Utility::nullifyEmpty($insert, 'recruitmentTarget');
        $db->insert('Project', $insert);
    }
}
exit(0);

