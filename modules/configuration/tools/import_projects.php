<?php
/**
 * This script should be used to migrate existing ProjectIDs and
 * SubprojectIDs from the config.xml to the subprojects table, so that
 * they can be managed from the frontend.
 *
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

$factory  = NDB_Factory::singleton();
$config   = $factory->config(__DIR__ . "/../../../project/config.xml");
$subprojs = $config->getSettingFromXML("subprojects");
$db       = $factory->database();
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
    if ($row['options']['useEDC'] === '1' || $row['options']['useEDC'] === 'true') {
        $ins['useEDC'] = 1;
    }
    Utility::nullifyEmpty($ins, 'WindowDifference');
    Utility::nullifyEmpty($ins, 'useEDC');
    $db->insert('subproject', $ins);
}
?>
