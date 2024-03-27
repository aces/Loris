<?php



/**
 * This script is written for a one time use only to update the hashes
 * stored in the violations_resolved table with proper hashes that
 * use the PhaseEncodingDirection, EchoNumber and EchoTime fields in
 * addition to the SeriesUID and TimeRun to create the hashes.
 *
 * This script updates the hash field violations_resolved based on the
 * hash produced by the combo of SeriesUID/EchoNumber/EchoTime/TimeRun
 * for each resolved violations.
 *
 * affected table:
 * - violations_resolved
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';

// select all violations resolved with new hash from violations_resolved
// on table mri_protocol_violated_scans
$db = $lorisInstance->getDatabaseConnection();
$resolvedViolationsList = selectViolationsResolved($db);
// loop through all resolved violations and update the hash in violations_resolved
foreach ($resolvedViolationsList as $violationArr) {
    $db->update(
        'violations_resolved',
        ['hash' => $violationArr['new_hash']],
        ['ID' => $violationArr['ViolResolvedID']]
    );
}

/**
 * Selects all violations resolved and new hash.
 *
 * @param Database $db database handler
 *
 * @return array of violation resolved and new hash details
 * @throws DatabaseException
 */
function selectViolationsResolved($db)
{
    $query = "(
                SELECT vr.ID AS ViolResolvedID, hash, md5(
                         concat_WS(
                           ':',minc_location,PatientName,SeriesUID,time_run,
                           PhaseEncodingDirection,TE_range,EchoNumber
                         )
                       ) AS new_hash
                FROM mri_protocol_violated_scans AS mpvs
                  JOIN violations_resolved vr ON (
                    vr.ExtID=mpvs.ID
                    AND vr.TypeTable='mri_protocol_violated_scans'
                  )
              ) UNION (
                SELECT vr.ID AS ViolResolvedID, hash, md5(
                         concat_WS(
                           ':',MincFile,PatientName,SeriesUID,TimeRun,
                           PhaseEncodingDirection,EchoTime,EchoNumber
                         )
                       ) AS new_hash
                FROM mri_violations_log AS mvl
                  JOIN violations_resolved vr ON (
                    vr.ExtID=mvl.LogID
                    AND vr.TypeTable='mri_violations_log'
                  )
              ) UNION (
                SELECT vr.ID AS ViolResolvedID, hash, md5(
                         concat_WS(
                           ':',MincFile,PatientName,SeriesUID,TimeRun,
                           PhaseEncodingDirection,EchoTime,EchoNumber
                         )
                       ) AS new_hash
                FROM MRICandidateErrors AS mce
                  JOIN violations_resolved vr ON (
                    vr.ExtID=mce.ID
                    AND vr.TypeTable='mri_violations_log'
                  )
              )";

    return $db->pselect($query, []);
}
