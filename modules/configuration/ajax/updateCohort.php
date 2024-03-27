<?php
/**
 * This file is used by the Configuration module to update
 * or insert values into the cohort table.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

$factory = NDB_Factory::singleton();
$user    = $factory->user();
if (!$user->hasPermission('config')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

require_once __DIR__ . "/../../../vendor/autoload.php";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$db         = $factory->database();
$CohortList = Utility::getCohortList();
$recTarget  = $_POST['RecruitmentTarget'];


// Basic validation
if (!Utility::valueIsPositiveInteger($recTarget)) {
    printAndExit(
        400,
        ['error' => 'Recruitment Target must be an integer greater than zero']
    );
}

// check if recruitmentTarget is greater than the associated Project's
// recruitmentTarget warning
    $recruitmentTargetWarning = false;
    $userCohortID    = $_POST['cohortID'] ?? null;
    $userTitle       = $_POST['title'] ?? null;
    $userRecruTarget = $_POST['RecruitmentTarget'] ?? null;

    $result = $db->pselect(
        "
        SELECT p.recruitmentTarget
        FROM Project p
        JOIN project_cohort_rel rel ON p.ProjectID = rel.ProjectID
        JOIN cohort c ON c.CohortID = rel.CohortID
        WHERE c.CohortID =:userCohortID or c.title =:userTitle
        ",
        [
            "userCohortID" => $userCohortID,
            'userTitle'    => $userTitle,
        ]
    );
    if ($result !== null && !empty($result)) {
        foreach ($result as $row) {
            $projectRecruTarget = $row["recruitmentTarget"];

            // Check if the input is greater than any Project's recruitmentTarget
            if ($userRecruTarget !== null
                && $userRecruTarget > $projectRecruTarget
            ) {
                $recruitmentTargetWarning = true;
                break; // Stop checking further projects
            }
        }
    }

    // Ends-check greater than the associated Project's recruitmentTarget

    if ($_POST['cohortID'] === 'new') {
        if (!in_array($_POST['title'], $CohortList) && !empty($_POST['title'])) {
            $db->insert(
                "cohort",
                [
                    "title"             => $_POST['title'],
                    "useEDC"            => $_POST['useEDC'],
                    "WindowDifference"  => $_POST['WindowDifference'],
                    "RecruitmentTarget" => $recTarget,
                ]
            );
        } else {
            printAndExit(409, ['error' => 'Conflict']);
        }
    } else {
        $db->update(
            "cohort",
            [
                "title"             => $_POST['title'],
                "useEDC"            => $_POST['useEDC'],
                "WindowDifference"  => $_POST['WindowDifference'],
                "RecruitmentTarget" => $recTarget,
            ],
            ["CohortID" => $_POST['cohortID']]
        );
    }
    // FIXME: This should probably be a 201 Created instead.
    if ($recruitmentTargetWarning) {
        printAndExit(
            200,
            ["ok" => "Cohort updated successfully,
		    but the Recruitment Target of Cohort is greater than
                     the Recruitment Target of the associated Project!"
            ]
        );
    }
    printAndExit(200, ["ok" => "Cohort updated successfully"]);

    /**
     * Prints a parameter converted to JSON-encoded string.
     *
     * @param int                  $code The HTTP Response Code.
     * @param array<string,string> $msg  A key-value pair representing the JSON to
     *                                   be returned from this file.
     *
     * @return void
     */
    function printAndExit(int $code, array $msg): void
    {
        http_response_code($code);
        print json_encode($msg);
        exit;
    }
