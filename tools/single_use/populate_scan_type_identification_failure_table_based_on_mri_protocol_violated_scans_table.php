<?php
/**
 * This script is written for a one time use only to insert into the
 * scan_type_identification_failure table entries based on what is present in
 * the mri_protocol_violated_scans table.
 *
 * Affected table: scan_type_identification_failure
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  Loris License
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ . '/../generic_includes.php';
require_once 'Database.class.inc';

// Select all entries present in the mri_protocol_violated_scans table
$violated_protocols_list = [];
try {
    $violated_protocols_list = selectMriProtocolViolatedScans();
} catch (Exception $e) {
    echo 'Caught exception: ', $e->getMessage(), '\n';
}


// Loop through all violated protocols and insert them into
// scan_type_identification_failure
foreach ($violated_protocols_list as $violated_protocol_details) {
    insertIntoScanTypeIdentificationFailure($violated_protocol_details);
}

/**
 * Selects all MRI protocols violations present in table mri_protocol_violated_scans
 *
 * @return array of protocols
 * @throws DatabaseException
 */
function selectMriProtocolViolatedScans(): array
{
    $db = NDB_Factory::singleton()->database();

    $query = "SELECT
           CandID,       PSCID,        TarchiveID,   series_description,
           time_run,     PatientName,  SeriesUID,    minc_location,
           TR_range,     TE_range,     TI_range,     slice_thickness_range,
           xspace_range, yspace_range, zspace_range, time_range,
           xstep_range,  ystep_range,  zstep_range,  image_type,
           MriProtocolGroupID
       FROM mri_protocol_violated_scans
    ";

    return $db->pselect($query, []);
}

/**
 * Insert rows in scan_type_identification_failure
 * for each row found in mri_protocol_violated_scans.
 *
 * @param array $viol_details Violated protocol details
 *
 * @return void
 */
function insertIntoScanTypeIdentificationFailure(array $viol_details)
{
    $db = NDB_Factory::singleton()->database();

    $fieldNames = [
        "TR_range"              => "repetition_time",
        "TE_range"              => "echo_time",
        "TI_range"              => "inversion_time",
        "slice_thickness_range" => "slice_thickness",
        "xspace_range"          => "xspace",
        "yspace_range"          => "yspace",
        "zspace_range"          => "zspace",
        "time_range"            => "time",
        "xstep_range"           => "xstep",
        "ystep_range"           => "ystep",
        "zstep_range"           => "zstep",
        "image_type"            => "image_type",
    ];

    foreach ($fieldNames as $field_name => $header_name) {
        $data_to_insert = [
            'ScanTypeParameterGroupID' => $viol_details['MriProtocolGroupID'],
            'TarchiveID'               => $viol_details['TarchiveID'],
            'CandID'                   => $viol_details['CandID'],
            'PSCID'                    => $viol_details['PSCID'],
            'SeriesUID'                => $viol_details['SeriesUID'],
            'TimeRun'                  => $viol_details['time_run'],
            'ScanLocation'             => $viol_details['minc_location'],
            'PatientName'              => $viol_details['PatientName'],
            'HeaderName'               => $header_name,
            'Value'                    => $viol_details[$field_name],
        ];

        if ($viol_details[$field_name]) {
            $db->insert('scan_type_identification_failure', $data_to_insert);
        }
    }
}
