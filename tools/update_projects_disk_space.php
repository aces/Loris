<?php

/**
 *
 * This script updates the cached DB record for disk space occupied by
 * projects. Intended to be run both periodically and via trigger
 *
 * Ex: 0 * * * * php /var/www/loris/project/tools/update_project_disk_space.php
 *
 */

require_once __DIR__ . "/generic_includes.php";

$db = \NDB_Factory::singleton()->database();
$config = \NDB_Config::singleton();

$dataDir = $config->getSetting('dataDirBasepath');
$list_of_projects = Utility::getProjectList();

$project_data = [];
// NOTE: Below is EEGNet specific. Other projects may want to use 'files'
// or a different query
foreach ($list_of_projects as $pid => $project) {
    $project_directory = $db->pselectOne(
        "SELECT DISTINCT(
          SUBSTRING(SUBSTRING_INDEX(FilePath, '/', 2), 1)
        )
        FROM physiological_file pf
        LEFT JOIN session s ON s.ID = pf.SessionID
        WHERE s.ProjectID=:PID LIMIT 1;",
        ['PID' => $pid]
    );
    if (str_starts_with($project_directory, 'bids_imports')) {
        $full_path = $dataDir . $project_directory;
        $dir_size_gb = round(
            get_dir_size($full_path) / pow(10, 9),
            1
        );
        $project_data[$project]['total'] = $dir_size_gb;
    }
}

$cached_data_type_id = $db->pselectOneInt(
    "SELECT `CachedDataTypeID`
        FROM `cached_data_type`
        WHERE `Name` = 'projects_disk_space'",
    []
);

$row_exists = $db->pselectOne(
    "SELECT Value FROM cached_data
    WHERE CachedDataTypeID = :CDTID;",
    ['CDTID' => $cached_data_type_id]
);

if ($row_exists) {
    $db->update(
        'cached_data',
        ['Value' => json_encode($project_data)],
        ['CachedDataTypeID' => $cached_data_type_id]
    );
} else {
    $db->insert(
        'cached_data',
        [
            'CachedDataTypeID' => $cached_data_type_id,
            'Value' => json_encode($project_data)
        ]
    );
}

echo "Disk space updated\r\n";


/**
 * Calculate directory size, recursively, skipping .tgz files
 *
 * @return int
 */
function get_dir_size($directory){
    $size = 0;
    $files = glob($directory . '/*');
    foreach($files as $path){
        if (!str_ends_with($path, '.tgz')) {
            is_file($path) && $size += filesize($path);
            is_dir($path)  && $size += get_dir_size($path);
        }
    }
    return $size;
}
