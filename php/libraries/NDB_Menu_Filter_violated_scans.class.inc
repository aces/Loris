<?php
require_once 'NDB_Menu_Filter.class.inc';
/**
 * @package main
 * 
 * 
 */
class NDB_Menu_violated_scans extends NDB_Menu_Filter
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
        $this->tpl_data['modification_permission']  = $user->hasPermission('mri_protocols_modifications');
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
        $this->columns = array('mpv.CandID','mpv.PSCID','mpv.time_run','mpv.series_description','mpv.minc_location','mpv.PatientName','mpv.TR_range','mpv.TE_range','mpv.TI_range','mpv.slice_thickness_range','mpv.xspace_range','mpv.yspace_range','mpv.zspace_range','mpv.xstep_range','mpv.ystep_range','mpv.zstep_range','mpv.time_range');
        $config=&NDB_Config::singleton();
        $this->validFilters = array('mpv.CandID','mpv.PSCID');
        $this->query = " FROM mri_protocol_violated_scans mpv WHERE 1=1";

        $this->formToFilter = array(
                'CandID' => 'mpv.CandID',
                'PSCID' => 'mpv.PSCID'
                );
        $this->tpl_data['mri_protocol_data']  = $this->getMRIProtocolData();
        $this->tpl_data['mri_protocol_header']  = array_keys($this->tpl_data['mri_protocol_data'][0]);
        return true;
    }


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

    function _setDataTableRows($count)
    {
        $x=0;
        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;
            $i = 1;
            foreach ($item as $key => $val) {
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;
                $i++;
            }
            $x++;
        }
        return true;
    }

    function getMRIProtocolData(){

        $db =& Database::singleton();
        $mri_protocols = $db->pselect("SELECT * FROM mri_protocol", array());
        return $mri_protocols;
    }
}
?>
