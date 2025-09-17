<?php declare(strict_types=1);

/**
 * This script updates the cached DB record for disk space occupied by
 * projects. Intended to be run both periodically and via trigger
 *
 * Ex: 0 * * * * php /var/www/loris/project/tools/update_project_disk_space.php
 */

require_once __DIR__ . "/generic_includes.php";

$db     = \NDB_Factory::singleton()->database();
$config = \NDB_Config::singleton();

$dataDir  = $config->getSetting('dataDirBasepath');
$projects = Utility::getProjectList();

$projectData = [];

foreach ($projects as $pid => $project) {
    $projectDir = $db->pselectOne(
        "SELECT DISTINCT(
          SUBSTRING(SUBSTRING_INDEX(FilePath, '/', 2), 1)
        )
        FROM (
            SELECT FilePath, SessionID
            FROM physiological_file pf
        UNION
            SELECT File, SessionID as FilePath FROM files f
        ) file_table
        LEFT JOIN session s ON s.ID = file_table.SessionID
        WHERE FilePath LIKE 'bids_imports%'
        AND s.ProjectID=:PID LIMIT 1;",
        ['PID' => $pid]
    );
    if (!is_null($projectDir)) {
        $fullPath  = $dataDir . $projectDir;
        $dirSizeGB = round(
            getDirSize($fullPath) / pow(10, 9),
            1
        );
        $projectData[$project]['total'] = $dirSizeGB;
    }
}

$cachedDataTypeID = $db->pselectOneInt(
    "SELECT `CachedDataTypeID`
        FROM `cached_data_type`
        WHERE `Name` = 'projects_disk_space'",
    []
);

$rowExists = $db->pselectOne(
    "SELECT Value FROM cached_data
    WHERE CachedDataTypeID = :CDTID;",
    ['CDTID' => $cachedDataTypeID]
);

if ($rowExists) {
    $db->update(
        'cached_data',
        ['Value' => json_encode($projectData)],
        ['CachedDataTypeID' => $cachedDataTypeID]
    );
} else {
    $db->insert(
        'cached_data',
        [
            'CachedDataTypeID' => $cachedDataTypeID,
            'Value'            => json_encode($projectData)
        ]
    );
}

echo "cached_data:projects_disk_space updated\r\n";

/**
 * Calculate directory size, recursively, skipping .tgz files
 *
 * @param string $directory Target directory
 *
 * @return int
 */
function getDirSize(string $directory): int
{
    $size  = 0;
    $files = glob($directory . '/*');
    foreach ($files as $path) {
        if (!str_ends_with($path, '.tgz')) {
            is_file($path) && $size += filesize($path);
            is_dir($path)  && $size += getDirSize($path);
        }
    }
    return $size;
}
