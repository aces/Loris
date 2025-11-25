<?php declare(strict_types=1);

/**
 * This script updates the Login_Summary_Statistics table in the database
 * based on the queries that are pinned to the login page in the dataquery module,
 * and on the SQL queries in the project/tools/Login_Summary_Statistics folder,
 * or if that does not exist, the SQL/Login_Summary_Statistics folder.
 * Pinned DQT Queries must include the Project column. SQL query files must return a
 * result with columns ProjectName and count. Here is an example SQL query that
 * counts the number of sites:
 *
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 * SELECT
 * IFNULL(Project.Name, 'All Projects') as ProjectName,
 * COUNT(DISTINCT CenterID) AS count
 * FROM psc
 * JOIN session s ON s.CenterID = psc.CenterID
 * JOIN Project ON s.ProjectID = Project.ProjectID
 * WHERE Project.showSummaryOnLogin = 1
 * GROUP BY Project.Name WITH ROLLUP
 * ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
 *
 * Usage: php update_login_summary_statistics.php
 * Can be added to a project's cron to update the table regularly.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Saagar Arya <saagar.arya@mcin.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 */

require_once "generic_includes.php";
require_once __DIR__
    . "/../modules/dataquery/php/query.class.inc";
require_once __DIR__
    . "/../modules/dataquery/php/endpoints/queries/query/run.class.inc";
require_once __DIR__
    . "/../modules/dataquery/php/queryrun.class.inc";
require_once __DIR__
    . "/../modules/dataquery/php/querydataprovisioner.class.inc";
require_once __DIR__
    . "/../modules/dataquery/php/querydataprovisioner.class.inc";
require_once __DIR__
    . "/../modules/dataquery/php/provisioners/studyqueries.class.inc";

// Get list of projects
$projects = $DB->pselectCol(
    "SELECT Name FROM Project
    WHERE showSummaryOnLogin='1'",
    []
);

$pinnedqueries = $DB->pselectWithIndexKey(
    "SELECT dq.QueryID, Query, dsq.Name
    FROM dataquery_queries dq
        LEFT JOIN dataquery_study_queries_rel dsq ON
            (dq.QueryID=dsq.QueryID)
    WHERE dsq.PinType=:pintype
    GROUP BY QueryID, Query, dsq.Name
    ORDER BY QueryID",
    ['pintype' => 'loginpage'],
    'QueryID'
);
$user          = (new \User())->factory('admin');
$data          = ['All Projects' => []];
$DB->run("DELETE FROM Login_Summary_Statistics", []);
foreach ($projects as $project) {
    $data[$project] = [];
}
$order        = 0;
$queryToOrder = [];
foreach ($pinnedqueries as $pin) {
    $queryInProjects = [];
    $queryID         = $pin['QueryID'];
    $queryName       = $pin['Name'];
    $queryToOrder[$queryName] = $order;
    $order++;

    // Initialize the counts
    $data['All Projects'][$queryName] = -1;
    foreach ($projects as $project) {
        $data[$project][$queryName] = 0;
    }

    // Get the data of the query
    $runner = new \LORIS\dataquery\endpoints\Queries\query\Run(
        $lorisInstance,
        $queryID
    );

    $response = $runner->runQuery($user, $queryID)->getBody();
    $result   = [];
    while ($response->eof() == false) {
        $next = $response->read(1024);
        if (!empty($next)) {
            $result[]   = $next;
            $inAProject = false;
            foreach ($projects as $project) {
                if (strpos($next, $project) !== false) {
                    $data[$project][$queryName] += 1;
                    $inAProject = true;
                    $queryInProjects[$project] = $project;
                }
            }
            // Only add to All Projects if the query is in at least one project
            if ($inAProject) {
                $data['All Projects'][$queryName] += 1;
            }
        }
    }
    // If the query only has data in one project, remove from the All Projects tab
    if (count($queryInProjects) == 1) {
        unset($data['All Projects'][$queryName]);
    } else if (count($queryInProjects) == 0) {
        print_r(
            "--- ERROR: Query $queryName has no data in any project. Please delete "
            . "this query, and re-save with the Project column selected.\n"
        );
    }
    $order++;
}

// Try to get SQL queries from ../project/tools/Login_Summary_Statistics
// Otherwise get them from SQL/Login_Summary_Statistics
// Filename should be the desired name of the query, with a "#_" infront
// Example: 01_Site.sql where 01 means it is the first query
$folder = __DIR__ . "/../project/tools/Login_Summary_Statistics/";
if (!is_dir($folder)) {
    print_r(
        "Folder $folder does not exist, "
        . "using ../SQL/Login_Summary_Statistics instead \n"
    );
    $folder = __DIR__ . "/../SQL/Login_Summary_Statistics/";
}

$files = scandir($folder);
foreach ($files as $file) {
    if (is_file($folder . $file)) {
        print_r("Reading SQL File $file\n");
        $result     = $DB->pselect(file_get_contents($folder . $file), []);
        $queryName  = pathinfo($file, PATHINFO_FILENAME);
        $queryOrder = explode("_", $queryName)[0];
        $queryName  = explode("_", $queryName)[1];
        $queryToOrder[$queryName] = $queryOrder;
        foreach ($result as $row) {
            $data[$row['ProjectName']][$queryName] = $row['count'];
        }
    }
}

print_r($data);
foreach ($data as $project => $values) {
    foreach ($values as $title => $value) {
        $DB->insertOnDuplicateUpdate(
            'Login_Summary_Statistics',
            [
                'Project'    => $project,
                'Title'      => $title,
                'value'      => $value,
                'QueryOrder' => $queryToOrder[$title]
            ]
        );
    }
}
