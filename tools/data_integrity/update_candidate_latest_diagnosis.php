<?php declare(strict_types=1);

/**
 * This script updates each candidate's latest diagnosis based on the
 * configured diagnosis evolution trajectory.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once __DIR__ . '/../generic_includes.php';

use LORIS\StudyEntities\Candidate\CandID;

$candIDs = $DB->pselectCol(
    "SELECT CandID FROM candidate
    WHERE Entity_type='Human' AND Active='Y'",
    []
);

// get configured diagnosis trajectories in DESC order by project
$diagnosisTrajectories = $DB->pselect(
    "SELECT * FROM diagnosis_evolution
    ORDER BY orderNumber DESC",
    []
);

// if no diagnosis trajectories are defined, return null
if (is_null($diagnosisTrajectories)) {
    echo "There are no configured Diagnosis Trajectories. Nothing to update.\n";
    exit;
}

// Format trajectories by project
$diagnosisTrajectoryByProject = [];
foreach ($diagnosisTrajectories as $key => $data) {
    $diagnosisTrajectoryByProject[$data['ProjectID']][] = $data;
}

foreach ($candIDs as $candID) {
    $candidate         = \Candidate::singleton(new CandID(strval($candID)));
    $candidateVisits   = $candidate->getListOfVisitLabels();
    $candidateProjects = $DB->pselectColWithIndexKey(
        "SELECT DISTINCT s.Visit_label, s.ProjectID FROM session s
        JOIN candidate c ON (c.ID = s.CandidateID)
        WHERE c.CandID=:candID",
        ['candID' => $candID],
        'Visit_label'
    );

    foreach ($diagnosisTrajectoryByProject as $projectID => $projectTrajectories) {
        foreach ($projectTrajectories as $key => $data) {
            // search if candidate has a matching visit
            $sessionID = array_search(
                $data['visitLabel'],
                array_reverse($candidateVisits, true)
            );
            if ($sessionID) {
                // Check that projectID matches visit project
                if ($candidateProjects[$data['visitLabel']] != $projectID) {
                    continue;
                }

                $matchingVL = $candidateVisits[$sessionID];

                // Find instance of instrument
                $commentID = $DB->pselectOne(
                    "SELECT CommentID FROM flag f
                    JOIN test_names tn ON tn.ID = f.TestID
                    WHERE f.SessionID=:sid
                    AND tn.Test_name=:tn
                    AND CommentID NOT LIKE 'DDE%'",
                    [
                        'sid' => $sessionID,
                        'tn'  => $data['instrumentName'],
                    ]
                );

                // If instrument does not exist, go to next diagnosis track
                if (!$commentID) {
                    continue;
                }

                // get instrument instance data
                $instrument     = \NDB_BVL_Instrument::factory(
                    $lorisInstance,
                    $data['instrumentName'],
                    $commentID
                );
                $instrumentData = $instrument->getInstanceData();

                $diagnosis    = [];
                $sourceFields = explode(",", $data['sourceField']);
                foreach ($sourceFields as $k => $fieldName) {
                    if (!isset($instrumentData[$fieldName])) {
                        continue;
                    }
                    $diagnosis[$fieldName] = $instrumentData[$fieldName];
                }

                if (!empty($diagnosis)) {
                    $timepoint = \TimePoint::singleton(
                        new SessionID(strval($sessionID))
                    );
                    // Check for Visit Status 'Pass' and
                    // Approval Status at least 'In Progress'
                    // to check that Send To DCC already occurred
                    $confirmed = (
                        $timepoint->getVisitStatus() === 'Pass'
                        && $timepoint->getApprovalStatus() !== null
                    ) ? 'Y' : 'N';

                    $candidateID = $DB->pselectOne(
                        "SELECT ID FROM candidate WHERE CandID=:CandID",
                        ["CandID" => $candID]
                    );

                    $set = [
                        'CandidateID'   => $candidateID,
                        'DxEvolutionID' => $data['DxEvolutionID'],
                        'Diagnosis'     => json_encode($diagnosis),
                        'Confirmed'     => $confirmed
                    ];

                    print_r(
                        "\nUpdating Diagnosis Evolution: " .
                        $data['Name'] . " for CandID: $candID\n"
                    );
                    print_r("\t" . json_encode($diagnosis) . "\n");

                    $DB->unsafeInsertOnDuplicateUpdate(
                        'candidate_diagnosis_evolution_rel',
                        $set
                    );
                }
            }
        }
    }
}
