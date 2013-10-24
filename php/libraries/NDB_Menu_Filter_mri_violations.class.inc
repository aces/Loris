<?php
require_once 'NDB_Menu_Filter.class.inc';
/**
 * @package main
 * 
 * 
 */
class NDB_Menu_Filter_mri_violations extends NDB_Menu_Filter
{
    /**
     * overloading this method to allow access to site users (their own site only) and users w/ multisite privs
     * @note   overloaded function
     * @return bool
     * @access private
     */

    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // allow only to view own site data
        $site =& Site::singleton($user->getData('CenterID'));
        if (PEAR::isError($site)) {
            return PEAR::raiseError("DB Error: ".$site->getMessage());
        }
        $this->tpl_data['violated_scans_modifications']  = $user->hasPermission('violated_scans_modifications');
        return ($user->hasPermission('violated_scans'));
    }

    function _setupVariables()
    {
        // set the class variables
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        $this->columns = array('v.PatientName', 'v.TimeRun', 'v.MincFile', 'v.Series_Description as Series_Description_Or_Scan_Type', 'v.Problem');
        $config=&NDB_Config::singleton();
        $this->query = " FROM (select PatientName as PatientName, time_run as TimeRun, minc_location as MincFile, series_description as Series_Description, 'Could not identify scan type' as Problem FROM mri_protocol_violated_scans "
            .  " UNION " . 
            "select PatientName, TimeRun, MincFile, mri_scan_type.Scan_type, 'Protocol Violation' FROM mri_violations_log left join mri_scan_type ON (mri_scan_type.ID=mri_violations_log.Scan_type)"
            .  " UNION " . 
            "SELECT PatientName, TimeRun, MincFile, null, Reason FROM MRICandidateErrors"
         . ") as v WHERE 1=1";
        $this->order_by = 'v.TimeRun DESC';

        /* $this->formToFilter = array(
                'CandID' => 'mpv.CandID',
                'PSCID' => 'mpv.PSCID'
                );
         */
        return true;
    }


    /*
    function _setFilterForm()
    {
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        $this->form->addElement('text', 'CandID', 'DCC-ID:');
        $this->form->addElement('text', 'PSCID', 'PSC-ID:');

        return true;
    }

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
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;
                $i++;
            }
            $x++;
        }
        return true;
    }
}
?>
