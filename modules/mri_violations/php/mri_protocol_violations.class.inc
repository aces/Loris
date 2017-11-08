<?php
/**
 * Implements a menu filter which acts as a front end to all the different
 * table which logs the mri_protocol table violations. This means that the
 * Loris MRI scripts could not identify the scan type, so we must display
 * all the header information that was used for that purpose as well as
 * a table on top which shows what the valid protocols for this study are
 *
 * PHP Version 5
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
     * @return bool true if they have access to this page
     */
    function _hasAccess()
    {
        // create user object
        $user =& \User::singleton();

        $this->tpl_data['violated_scans_modifications']
            = $user->hasPermission('violated_scans_edit');
        return ($user->hasPermission('violated_scans_view_allsites'));
    }

    /**
     * Set up the class variables and query to generate the menu filter
     *
     * @return none but as a side-effect modify internal class variables
     */
    function _setupVariables()
    {
        // set the class variables
        // create user object
        $user          =& \User::singleton();
        $this->columns = array(
                          'mpv.CandID',
                          'mpv.PSCID',
                          'mpv.time_run',
                          'mpv.series_description',
                          'mpv.minc_location',
                          'mpv.PatientName',
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
        $config        =&\NDB_Config::singleton();
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
                               'TR_Range',
                               'TE_Range',
                               'TI_Range',
                               'Slice_Thickness_Range',
                               'Xspace_Range',
                               'Yspace_Range',
                               'Zspace_Range',
                               'Xstep_Range',
                               'Ystep_Range',
                               'Zstep_Range',
                               'Time_Range',
                               'SeriesUID',
                               'TarchiveID',
                              );
        $this->tpl_data['hiddenHeaders'] = json_encode(['TarchiveID']);
        $this->query        = " FROM mri_protocol_violated_scans mpv
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
        $this->tpl_data['mri_protocol_data']   = $this->getMRIProtocolData();
        $this->tpl_data['mri_protocol_header']
            = array_keys($this->tpl_data['mri_protocol_data'][0]);
        return true;
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return none
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);
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
        return true;
    }

    /**
     * Get the current MRI protocol to display to the user
     *
     * @return array of current mri_protocol, one row per scan type
     */
    function getMRIProtocolData()
    {
        $db =& \Database::singleton();
        // select all except Objective from mri_protocol
        // and add Scan_type from mri_scan_type
        // to mri_protocol's Scan_type
        $mri_protocols = $db->pselect(
            "SELECT p.ID, Center_name, ScannerID, CONCAT(
                p.Scan_type, 
                IF(s.Scan_type<>'', CONCAT(' (', s.Scan_type, ')'), '')
            ) as Scan_type, TR_range, TE_range, TI_range, 
            slice_thickness_range, FoV_x_range, FoV_y_range, 
            xspace_range, yspace_range, zspace_range, 
            xstep_range, ystep_range, zstep_range, 
            time_range, series_description_regex 
            FROM mri_protocol as p 
            LEFT JOIN mri_scan_type as s 
            ON p.Scan_type=s.ID",
            array()
        );
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
?>
