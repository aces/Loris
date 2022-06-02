<?php
/**
 * Implements a menu filter which acts as a front end to all the different
 * table which logs the mri_protocol table violations. This means that the
 * Loris MRI scripts could not identify the scan type, so we must display
 * all the header information that was used for that purpose as well as
 * a table on top which shows what the valid protocols for this study are
 *
 * PHP Version 7
 *
 * @category MRI
 * @package  Main
 * @author   Zia Mohadesz <zia.mohades@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\mri_violations;
/**
 * Implements the menu filter for the mri protocol violation log table
 *
 * @category MRI
 * @package  Main
 * @author   Zia Mohadesz <zia.mohades@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class Mri_Protocol_Violations extends \NDB_Menu_Filter
{
    /**
     * Tie the access to a new violated_scans permission, with a separate
     * violated_scans_modifications permission if they're allowed to modify
     * the mri_protocol table
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if they have access to this page
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'violated_scans_view_allsites',
                'violated_scans_view_ownsite'
            ]
        );
    }

    /**
     * Set up the class variables and query to generate the menu filter
     *
     * @return void but as a side-effect modify internal class variables
     */
    function _setupVariables()
    {
        // set the class variables
        $this->columns      = [
            'stif.CandID',
            'stif.PSCID',
            'stif.TimeRun',
            'stif.ScanLocation',
            'stif.PatientName',
            'stpg.ScanTypeParameterGroupName',
            'stif.SeriesUID',
            'stif.HeaderName',
            'stif.Value',
            'tarchive.TarchiveID',
        ];
        $this->validFilters = [
            'stif.CandID',
            'stif.PSCID',
            'stif.PatientName',
            'stif.SeriesUID',
            'stif.TimeRun',
        ];
        $this->headers      = [
            'CandID',
            'PSCID',
            'Time_Run',
            'Scan_Location',
            'PatientName',
            'MRI_Protocol_Group',
            'SeriesUID',
            'Header_Name',
            'Value',
            'TarchiveID',
        ];
        $this->tpl_data['hiddenHeaders'] = json_encode(['TarchiveID']);
        $this->query        = " FROM scan_type_identification_failure stif
                 LEFT JOIN scan_type_parameter_group stpg ON
                 (stpg.ScanTypeParameterGroupID=stif.ScanTypeParameterGroupID)
                 LEFT JOIN tarchive ON
                (stif.PatientName = tarchive.PatientName) WHERE 1=1";
        $this->formToFilter = [
            'CandID'      => 'stif.CandID',
            'PSCID'       => 'stif.PSCID',
            'PatientName' => 'stif.PatientName',
            'SeriesUID'   => 'stif.SeriesUID',
            'TimeRun'     => 'stif.time_run',
        ];
        $this->tpl_data['mri_protocol_data'] = $this->getMRIProtocolData();
        $protocolGroupIDs = array_keys($this->tpl_data['mri_protocol_data']);
        $this->tpl_data['mri_protocol_header'] = array_keys(
            $this->tpl_data['mri_protocol_data'][$protocolGroupIDs[0]][0]
        );
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        $config      =& \NDB_Config::singleton();
        $minYear     = $config->getSetting('startYear')
            - $config->getSetting('ageMax');
        $maxYear     = $config->getSetting('endYear');
        $dateOptions = [
            'language'       => 'en',
            'format'         => 'YMd',
            'addEmptyOption' => true,
            'minYear'        => $minYear,
            'maxYear'        => $maxYear,
        ];

        $this->addBasicText('CandID', 'DCC-ID:');
        $this->addBasicText('PSCID', 'PSC-ID:');
        $this->addBasicText('PatientName', 'Patient-Name:');
        $this->addBasicText('SeriesUID', 'SeriesUID:');
        $this->addBasicDate('TimeRun', 'Time Run', $dateOptions);
    }

    /**
     * Converts this menu filter to an array of the form
     *
     * Headers => (string array)
     * Data => (array of arrays of row data)
     *
     * Suitable for serializing to JSON, CSV, etc..
     *
     * @return array
     */
    function toArray()
    {
        // get list of distinct header to display
        $headers_to_display = $this->getDistinctHeadersToDisplay();
        $data_to_display    = $this->getViolationsToDisplay($headers_to_display);

        $headers = [
            'CandID',
            'PSCID',
            'PatientName',
            'MRI_Protocol_Group',
            'Scan_Location',
            'SeriesUID',
            'TarchiveID',
            'Time_Run',
        ];

        $additionalHeaders = array_map(
            function ($header) {
                return ucwords(str_replace('_', ' ', $header['HeaderName']));
            },
            $headers_to_display
        );
        sort($additionalHeaders);
        $headers = array_merge($headers, $additionalHeaders);

        $MappedData = [];
        foreach ($data_to_display as $row) {
            $MappedData[] = array_values($row);
        }

        return [
            'Headers'      => $headers,
            'Data'         => $MappedData,
            'fieldOptions' => $this->fieldOptions,
        ];
    }

    /**
     * Get the current MRI protocol to display to the user.
     *
     * @return array containing the data in the mri_protocol table. Each key
     *         is an MRI protocol group name and each value is the array of
     *         lines in the mri_protocol table for that protocol group.
     */
    function getMRIProtocolData(): array
    {
        $db = $this->loris->getDatabaseConnection();

        // select all except Objective from mri_protocol
        // and add Scan_type from mri_scan_type
        // to mri_protocol's Scan_type
        $rows = $db->pselect(
            "SELECT s.Scan_type, stpg.ScanTypeParameterGroupName as 'Protocol Group',
                    psc.Name as CenterName, ScannerID,
                    p.ScanType, p.HeaderName, p.ValidMin, p.ValidMax, p.ValidRegex
             FROM scan_type_parameter as p
             LEFT JOIN scan_type_parameter_group stpg
             ON (stpg.ScanTypeParameterGroupID=p.ScanTypeParameterGroupID)
             LEFT JOIN scan_type_parameter_group_target gt
             ON (gt.ScanTypeParameterGroupID=stpg.ScanTypeParameterGroupID)
             LEFT JOIN mri_scan_type as s
             ON p.ScanType=s.ID
             LEFT JOIN psc ON psc.CenterID=gt.CenterID
             ORDER BY stpg.ScanTypeParameterGroupID ASC, p.ScanType ASC",
            []
        );

        $tmp_prot = [];
        foreach ($rows as $protocol) {
            $prot_grp    = $protocol['Protocol Group'];
            $scan_type   = $protocol['Scan_type'];
            $header_name = $protocol['HeaderName'];
            $center_name = $protocol['CenterName'];
            $scanner_id  = $protocol['ScannerID'];

            // Strip trailing zeros in each column
            foreach ($protocol as $k => $v) {
                $protocol[$k] = preg_replace('/\.?0+$/', '', $v);
            }
            $tmp_prot[$prot_grp][$scan_type]['Center Name']    = $center_name;
            $tmp_prot[$prot_grp][$scan_type]['Protocol Group'] = $prot_grp;
            $tmp_prot[$prot_grp][$scan_type]['Scanner ID']     = $scanner_id;
            $tmp_prot[$prot_grp][$scan_type]['Scan Type']      = $scan_type;
            if ($protocol['ValidRegex']) {
                $header = $header_name . "_regex";
                $value  = $protocol['ValidRegex'];
                $tmp_prot[$prot_grp][$scan_type][$header] = $value;
            }
            if ($protocol['ValidMin'] or $protocol['ValidMax']) {
                $header_range = $header_name . "_range";
                $value_min    = $protocol['ValidMin'];
                $value_max    = $protocol['ValidMax'];
                $value_range  = "$value_min - $value_max";
                // If one min or max was set, then modify the range to be
                // higher than or lower than value set
                if (!$value_min and $value_max) {
                    $value_range = "< $value_max";
                } elseif ($value_min and !$value_max) {
                    $value_range = "> $value_min";
                }
                $tmp_prot[$prot_grp][$scan_type][$header_range] = $value_range;
            }
        }

        $protocols          = [];
        $headers_to_display = $this->getDistinctHeadersToDisplay();
        foreach (array_keys($tmp_prot) as $prot_grp) {
            foreach ($tmp_prot[$prot_grp] as $scan_type_info) {
                foreach ($headers_to_display as $row) {
                    $header = $row['HeaderNameType'];
                    if (!in_array($header, array_keys($scan_type_info))) {
                        $scan_type_info[$header] = null;
                    }
                }
                ksort($scan_type_info);
                $protocols[$prot_grp][] = $scan_type_info;
            }
        }

        return $protocols;
    }

    /**
     * Get the distinct headers present in scan_type_identification to display
     * to the user.
     *
     * @return array containing the list of header to display with their type
     *               (_range or _regex)
     */
    function getDistinctHeadersToDisplay(): array
    {
        $db = $this->loris->getDatabaseConnection();

        $rows = $db->pselect(
            "SELECT DISTINCT(HeaderName) FROM scan_type_parameter",
            []
        );

        $headers_list = [];
        foreach ($rows as $header) {
            $value_rows = $db->pselect(
                "SELECT ValidMin, ValidMax, ValidRegex
                FROM scan_type_parameter
                WHERE HeaderName = :headerName LIMIT 1",
                ['headerName' => $header['HeaderName']]
            );
            if ($value_rows[0]['ValidMin'] or $value_rows[0]['ValidMax']) {
                array_push(
                    $headers_list,
                    [
                        'HeaderName'     => $header['HeaderName'],
                        'HeaderNameType' => $header['HeaderName'] . "_range"
                    ]
                );
            } elseif ($value_rows[0]['ValidRegex']) {
                array_push(
                    $headers_list,
                    [
                        'HeaderName'     => $header['HeaderName'],
                        'HeaderNameType' => $header['HeaderName'] . "_regex"
                    ]
                );
            }
        }

        return $headers_list;
    }

    /**
     * Get the violated scans present in scan_type_identification_failure
     * to display to the user.
     *
     * @param array $headers_to_display list of header names that will be displayed
     *
     * @return array containing the list of violated scans and their header
     *               values to be displayed
     */
    function getViolationsToDisplay($headers_to_display): array
    {
        $db = $this->loris->getDatabaseConnection();

        $rows = $db->pselect(
            "SELECT stif.CandID, stif.PSCID, stif.TimeRun, stif.ScanLocation,
                    stif.PatientName, stif.SeriesUID, tarchive.TarchiveID,
                    stpg.ScanTypeParameterGroupName as 'Protocol Group',
                    stif.HeaderName, stif.Value
                FROM scan_type_identification_failure as stif
                LEFT JOIN scan_type_parameter_group stpg
                ON (stpg.ScanTypeParameterGroupID=stif.ScanTypeParameterGroupID)
                LEFT JOIN tarchive ON (stif.PatientName = tarchive.PatientName)
                WHERE HeaderName IN (
                    SELECT DISTINCT(HeaderName) FROM scan_type_parameter
                )
            ORDER BY stif.ScanLocation ASC",
            []
        );

        $tmp_data = [];
        foreach ($rows as $row) {
            $scanLocation = $row['ScanLocation'];
            $headerName   = $row['HeaderName'];
            $value        = $row['Value'];
            $scanBaseData = [
                'CandID'         => $row['CandID'],
                'PSCID'          => $row['PSCID'],
                'TimeRun'        => $row['TimeRun'],
                'ScanLocation'   => $row['ScanLocation'],
                'PatientName'    => $row['PatientName'],
                'SeriesUID'      => $row['SeriesUID'],
                'TarchiveID'     => $row['TarchiveID'],
                'Protocol Group' => $row['Protocol Group'],
            ];
            if (!$tmp_data) {
                $tmp_data[$scanLocation] = $scanBaseData;
            } elseif (!array_key_exists($scanLocation, $tmp_data)) {
                $tmp_data[$scanLocation] = $scanBaseData;
            }
            $tmp_data[$scanLocation][$headerName] = $value;
        }

        // Fill in missing headers with NULL value for the table display
        $data = [];
        foreach ($tmp_data as $scan_data) {
            foreach ($headers_to_display as $header_info) {
                $header = $header_info['HeaderName'];
                if (!array_key_exists($header, $scan_data)) {
                    $scan_data[$header] = null;
                }
            }
            ksort($scan_data);
            $data[] = $scan_data;
        }

        return $data;
    }

    /**
     * Gathers JS dependecies and merge them with the parent
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            [
                $baseURL .
               "/mri_violations/js/mri_protocol_violations_columnFormatter.js",
            ]
        );
    }
}

