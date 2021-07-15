<?php
/**
 * Data Querying Module
 *
 * PHP Version 7
 *
 * @category Data_Querying_Module
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
$user =& User::singleton();
if (!$user->hasPermission('dataquery_view')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}
require_once __DIR__ . '/../../../vendor/autoload.php';
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize(__DIR__ . '/../../../project/config.xml');
header("Content-Type: application/json");

$config      = \NDB_Config::singleton();
$couchConfig = $config->getSetting('CouchDB');
$cdb         = \NDB_Factory::singleton()->couchDB(
    $couchConfig['dbName'],
    $couchConfig['hostname'],
    intval($couchConfig['port']),
    $couchConfig['admin'],
    $couchConfig['adminpass']
);
$cacheFile = 'statistics.json';

// 0) Get DQT updateTime
$update = $cdb->queryView(
    "DQG-2.0",
    "runlog",
    [
        "reduce"     => "false",
        "limit"      => "1",
        "descending" => "true",
    ]
);
$updateTime = isset($update[0]['key'])
    ? $update[0]['key']
    : '2019-11-11T14:42:21-05:00';
// 0.1) Use updateTime to check if we need new statistics
$dqt_path_dir = rtrim(
    $config->getSetting('DqtStatisticsDataPath'),
    '/'
);
$myFile      = null;
$fileContent = null;
if (is_writable($dqt_path_dir)) {
    $statisticsFile = $dqt_path_dir . '/' . $cacheFile;
    if (!file_exists($statisticsFile)) {
        $myFile = fopen($statisticsFile, 'w');
        $fileContent = '{"updateTime": "1990-09-18T14:03:11-06:30"}';
        fwrite($myFile, $fileContent);
    } else {
        $myFile = fopen($statisticsFile, 'r');
        $fileContent = fread($myFile, filesize($statisticsFile));
    }
    fclose($myFile);
}
$fileJson = json_decode($fileContent);
if ($fileJson->updateTime !== $updateTime) {
    // need to get new statistics and store in file

    // 1) Get the sessions from couchdb.
    $sessionResults = $cdb->queryView(
        "DQG-2.0",
        "sessions",
        [
            "reduce" => "true",
            "group"  => "true",
        ]
    );
    $sessions = array_map(
        function ($element) {
            return $element['key'];
        },
        $sessionResults
    );
    // 2) Get the demographics from couchdb.
    $category = 'demographics';
    $keys        = array_map(
        function ($row) use ($category) {
            return array_merge([$category], $row);
        },
        $sessions
    );
    $results     = $cdb->queryView(
        "DQG-2.0",
        "instruments",
        [
            "reduce"       => "false",
            "include_docs" => "true",
            "keys"         => $keys,
        ],
        false
    );
    // 3) parse the data for statistics
    $results    = array_column($results, 'doc'); // flatten by doc.
    $diseases   = [];
    $statistics = [];
    $sexes      = ['Female' => 0, 'Male' => 0, 'Other' => 0];
    $total      = 0;
    $sites      = [];
    $candidates = [];
    for ($i = 0; $i < count($results); $i++) {
        $item = $results[$i]['data'];
        if (isset($candidates[$item['ExternalID']])) {
            continue;
        }
        $candidates[$item['ExternalID']] = true;
        $diagnoses = explode(',', $item['Diagnoses']);
        $sex       = isset($item['Sex']) ? $item['Sex'] : 'Other';
        $site      = $item['Site'];
        foreach ($diagnoses as $diagnosis) {
            if (!in_array($diagnosis, $diseases)) {
                $diseases[] = $diagnosis;
                $statistics[$diagnosis] = ['Female' => 0, 'Male' => 0, 'Other' => 0];
                $statistics[$diagnosis][$sex] = 1;
            } else {
                $statistics[$diagnosis][$sex] = $statistics[$diagnosis][$sex] + 1;
            }
        }
        $sexes[$sex] = $sexes[$sex] + 1;
        if (!in_array($site, $sites)) {
            $sites[] = $site;
        }
    }
    $total = count($candidates);
    if (is_writable($dqt_path_dir)) {
        $statisticsFile = $dqt_path_dir . '/' . $cacheFile;
        $myFile = fopen($statisticsFile, 'w');
        $storeContent = [
            'updateTime' => $updateTime,
            'statistics' => $statistics,
            'total' => $total,
            'sexes' => $sexes,
            'sites' => $sites,
        ];
        $fileContent = json_encode($storeContent);
        fwrite($myFile, $fileContent);
        fclose($myFile);
    }

} else {
    // use saved statistics in file
    $statistics = json_decode(json_encode($fileJson->statistics), true);
    $total = json_decode(json_encode($fileJson->total), true);
    $sexes = json_decode(json_encode($fileJson->sexes), true);
    $sites = json_decode(json_encode($fileJson->sites), true);
}

print json_encode([
    'participants' => $total,
    'gender' => [
        ['label' => 'Female', 'total' => $sexes['Female']],
        ['label' => 'Male', 'total' => $sexes['Male']],
    ],
    'disease' => [
        'labels' => [
            'Amyotrophic Lateral Sclerosis',
            'Parkinson’s Disease',
            'Neuromuscular Disease',
            'Healthy Control'
        ],
        'datasets' => [
            'female' => [
                $statistics['Amyotrophic Lateral Sclerosis']['Female'],
                $statistics['Parkinson’s Disease']['Female'],
                $statistics['Neuromuscular Disease']['Female'],
                $statistics['Healthy Control']['Female']
            ],
            'male' => [
                $statistics['Amyotrophic Lateral Sclerosis']['Male'],
                $statistics['Parkinson’s Disease']['Male'],
                $statistics['Neuromuscular Disease']['Male'],
                $statistics['Healthy Control']['Male']
            ],
        ]
    ],
    'statistics' => $statistics,
    'sites' => $sites
]);
