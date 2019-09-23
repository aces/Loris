<?php
/**
 * This script is used to move mri violations to the resolved tab in bulk.
 * This is the first step for a project that wants to insert scans that were
 * previously excluded.
 * Just modify the where clause and test on the front end with same filter first.
 *
 * Usage: php mri_violations_resolver.php [confirm]
 *
 * PHP Version 5
 *
 * @category MRI
 * @package  Main
 * @author   Gregory Luneau <gregory.luneau@mcgill.ca>
 * @license  Loris License
 * @link     https://www.github.com/aces/Loris/
 */

set_include_path(get_include_path().":../project/libraries:../php/libraries:");

// path to config file
$configFile = "../project/config.xml";

require_once __DIR__ . "/../vendor/autoload.php";
require_once "NDB_Client.class.inc";


$confirm = false;
if (isset($argv[1]) && $argv[1] === "confirm") {
    $confirm = true;
}

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);

$DB =& Database::singleton();

// Query as it is in the mri violation module
// It is complete as it apears in the module for two reasons:
//   1. for reproducibility, this tools expects that you have validated your search
//      in LORIS front end first.
//   2. for future feature improvements that will use currently unused part of this
//      query.
$query = "SELECT v.PatientName, v.Project, v.Subproject, v.Site, v.TimeRun,
          v.MincFile, v.Series_Description as Series_Description_Or_Scan_Type,
          v.Problem, v.SeriesUID, v.hash, v.join_id, v.Resolved FROM (
            SELECT PatientName as PatientName,
                time_run as TimeRun,
                s.ProjectID as Project,
                s.SubprojectID as Subproject,
                minc_location as MincFile,
                series_description as Series_Description,
                'Could not identify scan type' as Problem,
                SeriesUID,
            md5(concat_WS(':',minc_location,PatientName,SeriesUID,time_run)) as hash,
                mri_protocol_violated_scans.ID as join_id,
                p.CenterID as Site,
                violations_resolved.Resolved as Resolved
            FROM mri_protocol_violated_scans
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mri_protocol_violated_scans.ID
            AND violations_resolved.TypeTable='mri_protocol_violated_scans')
            LEFT JOIN candidate c
            ON (mri_protocol_violated_scans.CandID = c.CandID)
            LEFT JOIN session s
            ON (mri_protocol_violated_scans.CandID = s.CandID)
            LEFT JOIN psc p
            ON (p.CenterID = s.CenterID)
            WHERE Resolved is NULL UNION SELECT PatientName,
                TimeRun,
                s.ProjectID as Project,
                s.SubprojectID as Subproject,
                MincFile,
                mri_scan_type.Scan_type,
                'Protocol Violation',
                SeriesUID,
                md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)) as hash,
                mri_violations_log.LogID as join_id,
                p.CenterID as Site,
                violations_resolved.Resolved as Resolved
            FROM mri_violations_log
            LEFT JOIN mri_scan_type
            ON (mri_scan_type.ID=mri_violations_log.Scan_type)
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mri_violations_log.LogID
            AND violations_resolved.TypeTable='mri_violations_log')
            LEFT JOIN candidate c
            ON (mri_violations_log.CandID=c.CandID)
            LEFT JOIN session s
            ON (mri_violations_log.CandID = s.CandID)
            LEFT JOIN psc p
            ON (p.CenterID = s.CenterID)
            WHERE Resolved is NULL UNION SELECT PatientName,
                TimeRun,
                s.ProjectID as Project,
                s.SubprojectID as Subproject,
                MincFile,
                null,
                Reason,
                SeriesUID,
                md5(concat_WS(':',MincFile,PatientName,SeriesUID,TimeRun)) as hash,
                MRICandidateErrors.ID as join_id,
                p.CenterID as Site,
                violations_resolved.Resolved as Resolved
            FROM MRICandidateErrors
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=MRICandidateErrors.ID
            AND violations_resolved.TypeTable='MRICandidateErrors')
            LEFT JOIN candidate c
            ON (SUBSTRING_INDEX(MRICandidateErrors.PatientName,'_',1)=c.PSCID)
            LEFT JOIN session s
            ON (c.CandID = s.CandID)
            LEFT JOIN psc p
            ON (p.CenterID = s.CenterID)
            WHERE Resolved is NULL)
            as v WHERE
            v.problem = :pr and
            v.series_description like :sd
            ORDER BY v.TimeRun DESC";

// Filter values to modify
$where   = array(
            'pr' => 'Protocol Violation',
            'sd' => '%t1%',
           );
$results = $DB->pselect($query, $where);

foreach ($results AS $result) {

    $newlyResolved         = array();
    $newlyResolved['hash'] = $result['hash'];
    $newlyResolved['Resolved']   = 'inserted_flag';
    $newlyResolved['User']       = get_current_user();
    $newlyResolved['ChangeDate'] = date("Y-m-d H:i:s");
    $newlyResolved['TypeTable']  = 'mri_violations_log';
    $newlyResolved['ExtID']      = $result['join_id'];

    // Does a hash and a ExtID already exists?
    $row = $DB->pselectRow(
        "SELECT * FROM violations_resolved
        WHERE hash = :ha and ExtID = :ex ",
        array(
         'ha' => $result['hash'],
         'ex' => $result['join_id'],
        )
    );

    // Insert if new
    if (empty($row)) {
        if ($confirm) {
            $DB->insert('violations_resolved', $newlyResolved);
            print "inserting\t";
        }
        print_r($newlyResolved);
    } else {
        print "skip\n";
    }

}
