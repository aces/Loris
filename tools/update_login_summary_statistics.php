<?php declare(strict_types=1);

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

// TODO: delete. This would return a query object instead of
// queryIDs and it was really difficult to try to get it to run
// $provisioner = (
//     new \LORIS\dataquery\Provisioners\StudyQueries($lorisInstance, 'loginpage')
// );
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
foreach ($pinnedqueries as $pin) {
    $queryInProjects = [];
    $queryID         = $pin['QueryID'];
    $queryName       = $pin['Name'];

    // TODO: delete. Commented out after changing from
    // hardcoded queryID to pinned queries
    // Get the query Name
    // $query = new \LORIS\dataquery\Query($lorisInstance, $queryID);
    // $query->loadQueryMetadata($user);
    // $queryName = $query->getQueryName();

    // Initialize the count at 0
    $data['All Projects'][$queryName] = 0;
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
            // TODO: for some reason the last one which
            // is empty gets added too so it is + 1 for All Projects
            // TODO: add as a OBJECT not string somehow
            $result[]   = $next;
            $inAProject = false;
            // TODO: this processes as string by looking for the project name.
            // Change to something better when it is an object.
            foreach ($projects as $project) {
                if (strpos($next, $project) !== false) {
                    $data[$project][$queryName] += 1;
                    $inAProject = true;
                    $queryInProjects[$project] = $project;
                }
            }
            // Only add to All Projects for projects that are included in the query
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
            "--- ERROR: Query $queryName has no data in any project. "
            . "Please delete this query, and re-save with the Project column selected.\n"
        );
    }
}

print_r($data);
foreach ($data as $project => $values) {
    foreach ($values as $title => $value) {
        $DB->insertOnDuplicateUpdate(
            'Login_Summary_Statistics',
            [
                'Project' => $project,
                'Title'   => $title,
                'value'   => $value
            ]
        );
    }
}