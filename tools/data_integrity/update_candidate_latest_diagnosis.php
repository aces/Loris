<?php
/**
 * This script updates each candidate's latest diagnosis based on the
 * configured diagnosis evolution trajectory.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once __DIR__ . '/../generic_includes.php';

use LORIS\StudyEntities\Candidate\CandID;

$DB      = \NDB_Factory::singleton()->database();
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

$loris = new \LORIS\LorisInstance(
    $DB,
    \NDB_Factory::singleton()->config(),
    [
        "project/modules",
        "modules",
    ]
);

foreach ($candIDs as $candID) {
    $candidate         = \Candidate::singleton(new CandID($candID));
    $candidateVisits   = $candidate->getListOfVisitLabels();
    $candidateProjects = $DB->pselectColWithIndexKey(
        "SELECT DISTINCT Visit_label, ProjectID
        FROM session
        WHERE CandID=:candID",
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
                    WHERE f.SessionID=:sid
                    AND f.Test_name=:tn
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
                    $loris,
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
                        new SessionID($sessionID)
                    );
                    // Check for Visit Status 'Pass' and
                    // Approval Status at least 'In Progress'
                    // to check that Send To DCC already occurred
                    $confirmed = (
                        $timepoint->getVisitStatus() === 'Pass'
                        && $timepoint->getApprovalStatus() !== null
                    ) ? 'Y' : 'N';

                    $set = [
                        'CandID'        => $candID,
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
