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
        $this->tpl_data['violated_scans_modifications']
            = $user->hasPermission('violated_scans_edit');
        return $user->hasAnyPermission(
            array(
                'violated_scans_view_allsites',
                'violated_scans_edit'
            )
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
        $this->columns      = array(
            'mpv.CandID',
            'mpv.PSCID',
            'mpv.time_run',
            'mpv.series_description',
            'mpv.minc_location',
            'mpv.PatientName',
            'mpg.Name',
            'mpv.TR_range',
            'mpv.TE_range',
            'mpv.TI_range',
            'mpv.slice_thickness_range',
            'mpv.xspace_range',
            'mpv.yspace_range',
            'mpv.zspace_range',
            'mpv.xstep_range',
            'mpv.ystep_range',
            'mpv.zstep_range',
            'mpv.time_range',
            'mpv.SeriesUID',
            'tarchive.TarchiveID',
        );
        $this->validFilters = array(
            'mpv.CandID',
            'mpv.PSCID',
            'mpv.PatientName',
            'mpv.SeriesUID',
            'mpv.series_description',
            'mpv.time_run',
        );
        $this->headers      = array(
            'CandID',
            'PSCID',
            'Time_Run',
            'Series_Description',
            'Minc_Location',
            'PatientName',
            'MRI_Protocol_Group',
            'TR',
            'TE',
            'TI',
            'Slice_Thickness',
            'Xspace',
            'Yspace',
            'Zspace',
            'Xstep',
            'Ystep',
            'Zstep',
            'Time',
            'SeriesUID',
            'TarchiveID',
        );
        $this->tpl_data['hiddenHeaders'] = json_encode(['TarchiveID']);
        $this->query        = " FROM mri_protocol_violated_scans mpv
                 LEFT JOIN mri_protocol_group mpg ON
                 (mpg.MriProtocolGroupID=mpv.MriProtocolGroupID)
                 LEFT JOIN tarchive ON
                (mpv.PatientName = tarchive.PatientName) WHERE 1=1";
        $this->formToFilter = array(
            'CandID'            => 'mpv.CandID',
            'PSCID'             => 'mpv.PSCID',
            'PatientName'       => 'mpv.PatientName',
            'SeriesUID'         => 'mpv.SeriesUID',
            'SeriesDescription' => 'mpv.series_description',
            'TimeRun'           => 'mpv.time_run',
        );
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
        $dateOptions = array(
            'language'       => 'en',
            'format'         => 'YMd',
            'addEmptyOption' => true,
            'minYear'        => $minYear,
            'maxYear'        => $maxYear,
        );

        $this->addBasicText('CandID', 'DCC-ID:');
        $this->addBasicText('PSCID', 'PSC-ID:');
        $this->addBasicText('PatientName', 'Patient-Name:');
        $this->addBasicText('SeriesUID', 'SeriesUID:');
        $this->addBasicText('SeriesDescription', 'Series Description:');
        $this->addBasicDate('TimeRun', 'Time Run', $dateOptions);
    }

    /**
     * Get the current MRI protocol to display to the user.
     *
     * @return array containing the data in the mri_protocol table. Each key
     *         is an MRI protocol group name and each value is the array of
     *         lines in the mri_protocol table for that protocol group.
     */
    function getMRIProtocolData()
    {
        $db =& \Database::singleton();
        // select all except Objective from mri_protocol
        // and add Scan_type from mri_scan_type
        // to mri_protocol's Scan_type
        $rows = $db->pselect(
            "SELECT p.ID, mpg.Name as 'Protocol Group', Center_name, ScannerID,
                    p.Scan_type, TR_min, TR_max, TE_min, TE_max, TI_min,
                    TI_max, slice_thickness_min, slice_thickness_max,
                    xspace_min, xspace_max, yspace_min, yspace_max, zspace_min,
                    zspace_max, xstep_min, xstep_max, ystep_min, ystep_max,
                    zstep_min, zstep_max, time_min, time_max,series_description_regex
             FROM mri_protocol as p
             LEFT JOIN mri_protocol_group mpg 
             ON (mpg.MriProtocolGroupID=p.MriProtocolGroupID)
             LEFT JOIN mri_scan_type as s
             ON p.Scan_type=s.ID
             ORDER BY mpg.MriProtocolGroupID ASC, p.Scan_type ASC",
            array()
        );

        $mri_protocols = array();
        foreach ($rows as $protocol) {
            // Strip trailing zeros in each column
            foreach ($protocol as $k => $v) {
                $protocol[$k] = preg_replace('/\.?0+$/', '', $v);
            }
            $mri_protocols[$protocol['Protocol Group']][] = $protocol;
        }

        return $mri_protocols;
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
            array(
                $baseURL .
               "/mri_violations/js/mri_protocol_violations_columnFormatter.js",
            )
        );
    }
}

