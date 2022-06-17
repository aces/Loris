<?php
/**
 * This script is written for a one time use only to insert into the
 * scan_type_parameter table entries based on what is present in
 * the mri_protocol table.
 *
 * Affected table: scan_type_parameter
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

// Select all entries present in the mri_protocol table
$protocols_list = [];
try {
    $protocols_list = selectMriProtocols();
} catch (Exception $e) {
    echo 'Caught exception: ', $e->getMessage(), '\n';
}


// Loop through all MRI protocols and insert them into scan_type_parameter
foreach ($protocols_list as $protocol_details) {
    insertIntoScanTypeParameter($protocol_details);
}

/**
 * Selects all MRI protocols present in table mri_protocol
 *
 * @return array of protocols
 * @throws DatabaseException
 */
function selectMriProtocols(): array
{
    $db = NDB_Factory::singleton()->database();

    $query = "SELECT Scan_type,
            TR_min, TR_max,
            TE_min, TE_max,
            TI_min, TI_max,
            slice_thickness_min, slice_thickness_max,
            xspace_min, xspace_max,
            yspace_min, yspace_max,
            zspace_min, zspace_max,
            xstep_min, xstep_max,
            ystep_min, ystep_max,
            zstep_min, zstep_max,
            time_min, time_max,
            image_type,
            series_description_regex,
            MriProtocolGroupID
        FROM mri_protocol
    ";

    return $db->pselect($query, []);
}

/**
 * Insert rows in scan_type_parameter for each row found in mri_protocol.
 *
 * @param array $protocol_details Protocol details (one row of mri_protocol)
 *
 * @return void
 */
function insertIntoScanTypeParameter(array $protocol_details)
{
    $db = NDB_Factory::singleton()->database();

    $minMaxFieldBaseNames = [
        'TR'     => 'repetition_time',
        'TE'     => 'echo_time',
        'TI'     => 'inversion_time',
        'xspace' => 'xspace',
        'yspace' => 'yspace',
        'zspace' => 'zspace',
        'xstep'  => 'xstep',
        'ystep'  => 'ystep',
        'zstep'  => 'zstep',
        'time'   => 'time',
    ];

    $regexFieldNames = [
        'image_type'               => 'image_type',
        'series_description_regex' => 'series_description',
    ];

    foreach ($minMaxFieldBaseNames as $fieldBaseName => $headerName) {
        $fieldMin = $protocol_details[$fieldBaseName . "_min"];
        $fieldMax = $protocol_details[$fieldBaseName . "_max"];

        $data_to_insert = [
            'ScanTypeParameterGroupID' => $protocol_details['MriProtocolGroupID'],
            'ScanType'                 => $protocol_details['Scan_type'],
            'HeaderName'               => $headerName,
            'ValidMin'                 => $fieldMin,
            'ValidMax'                 => $fieldMax,
        ];

        if ($fieldMin or $fieldMax) {
            $db->insert('scan_type_parameter', $data_to_insert);
        }
    }

    foreach ($regexFieldNames as $fieldName => $headerName) {
        $data_to_insert = [
            'ScanTypeParameterGroupID' => $protocol_details['MriProtocolGroupID'],
            'ScanType'                 => $protocol_details['Scan_type'],
            'HeaderName'               => $headerName,
            'ValidRegex'               => $protocol_details[$fieldName],
        ];

        if ($protocol_details[$fieldName]) {
            $db->insert('scan_type_parameter', $data_to_insert);
        }
    }
}
