<?php
/**
 * This page implements a front end which is used to unify all
 * of the different MRI violation types (could not identify scan,
 * header violation in the scan after identifying scan type, mislabeled 
 * scan, etc) and link to the appropriate module to further investigate
 * why a scan was excluded by the imaging pipeline scripts.
 *
 * PHP Version 5
 *
 * @category MRI
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once 'NDB_Menu_Filter.class.inc';
/**
 * Implement the menu filter for searching through all violated scans
 *
 * @category MRI
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Menu_Filter_Mri_Violations extends NDB_Menu_Filter_Form
{
    /**
     * Check if user should be allowed to see this page.
     *
     * @return boolean true if the user is permitted to see violated scans
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        $this->tpl_data['violated_scans_modifications'] 
            = $user->hasPermission('violated_scans_edit');
        return ($user->hasPermission('violated_scans_view_allsites'));
    }

    /**
     * Set up the class and smarty variables to use for the menu filter to 
     * generate the proper query for the menu filter
     * 
     * @return none
     */
    function _setupVariables()
    {
        // set the class variables
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $this->columns = array('v.PatientName',
            'v.TimeRun',
            'v.MincFile',
            'v.Series_Description as Series_Description_Or_Scan_Type',
            'v.Problem',
            'v.SeriesUID',
            'v.Resolved'
        );

        $this->query = " FROM (
            SELECT PatientName as PatientName,
                time_run as TimeRun,
                minc_location as MincFile,
                series_description as Series_Description,
                'Could not identify scan type' as Problem, 
                SeriesUID,
                violations_resolved.Resolved as Resolved
            FROM mri_protocol_violated_scans 
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mri_protocol_violated_scans.ID 
            AND violations_resolved.TypeTable='mri_protocol_violated_scans')"
            . " UNION " . 
            "SELECT PatientName,
                TimeRun,
                MincFile,
                mri_scan_type.Scan_type,
                'Protocol Violation',
                SeriesUID,
                violations_resolved.Resolved as Resolved
            FROM mri_violations_log 
            LEFT JOIN mri_scan_type 
            ON (mri_scan_type.ID=mri_violations_log.Scan_type)
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=mri_violations_log.LogID 
            AND violations_resolved.TypeTable='mri_violations')"
            . " UNION " . 
            "SELECT PatientName,
                TimeRun,
                MincFile,
                null,
                Reason, 
                SeriesUID,
                violations_resolved.Resolved as Resolved
            FROM MRICandidateErrors
            LEFT JOIN violations_resolved
            ON (violations_resolved.ExtID=MRICandidateErrors.ID 
            AND violations_resolved.TypeTable='MRICandidateErrors')"
         . ") as v WHERE 1=1";
        $this->order_by = 'v.TimeRun DESC';

        $this->formToFilter = array(
                'PatientName' => 'v.PatientName',
                'TimeRun' => 'v.TimeRun',
                'ProblemType' => 'v.Problem',
                'Filename' => 'v.MincFile',
                'Description' => 'v.Series_Description',
                'SeriesUID' => 'v.SeriesUID',
                'Resolved' => 'v.Resolved'
        );
        $this->validFilters = array(
            'v.PatientName',
            'v.TimeRun',
            'v.MincFile',
            'v.Problem',
            'v.Series_Description',
            'v.SeriesUID',
            'v.Resolved'
        );
        return true;
    }

    /**
     * Generate the quickform elements necessary for filter form
     *
     * @return none, but as a side-effect sets up QuickForm variables
     */
    function _setFilterForm()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        $this->addBasicText('PatientName', 'Patient Name');
        $this->addBasicText('Description', 'Series Description or Scan Type');
        $this->addBasicText('TimeRun', 'Time Run');
        $this->addBasicText('Filename', 'File name');
        $this->addBasicText('SeriesUID', 'Series UID');
        $this->addSelect(
            "ProblemType",
            "Type of problem",
            array(
                '' => 'Any',
                'CandID and PSCID do not match database' 
                    => 'Candidate Mismatch',
                'Could not identify scan type'
                    => 'Could not identify scan type',
                'Protocol Violation'
                    => 'MRI Protocol Check violation'
            )
        );
        // conflict resolved
        $this->addSelect(
            'Resolved', 
            'Violation resolved', 
            array(
                '0' => 'Unresolved',
                '1' => 'Resolved'
                )
            );
        // sites
        $this->addSelect(
            'Site', 
            'Site', 
            array(
                '0' => 'one',
                '1' => 'two',
                '2' => 'three',
                )
            );

        return true;
    }

    /**
     * Overwrite the setDataTableRows function to exclude fields
     * which were only selected for generating a link, and aren't
     * used for display to the user
     *
     * @param integer $count Offset of page that filter starts on
     *
     * @return none but as a side-effect populates $this->tpl_data['items']
     */
    function _setDataTableRows($count)
    {
        $x=0;
        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;
            $i = 1;
            foreach ($item as $key => $val) {
                if ($key === 'PatientName') {
                    $this->tpl_data['items'][$x]['PatientName'] = $val;
                }
                if ($key === 'SeriesUID') {
                    $this->tpl_data['series'] = $val;
                } else {		 
                    $this->tpl_data['items'][$x][$i]['name'] = $key;
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                }            
                $i++;
            }
            $options = array('0'=>'Unresolved', '1'=>'Resolved');
            $this->addCheckbox(($x + $count), "", $options);
            //$this->addSelect(($x + $count), "", $options);
        
            $x++;
        }

        //var_dump($this);                    
        return true;
    }

    function _process($values)
    {
        echo "PROCESSING...<BR>";

        if (!is_array($values) || count($values) ==0) {
            return true;
        }
        
        $DB =& Database::singleton();
        
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        var_dump($values);

        $this->tpl_data['success'] = true;
    }
}
?>
