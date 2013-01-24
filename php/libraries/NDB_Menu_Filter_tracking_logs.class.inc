<?php
require_once 'NDB_Menu_Filter.class.inc';

/**
 * The menu for tracking logs
 * @package mri
 * @subpackage NIHPD
 */
class NDB_Menu_Filter_tracking_logs extends NDB_Menu_Filter
{

    var $centerIDMap;

    function _setupVariables()
    {
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // create the centerID map
        $db =& Database::singleton();
        $pscRows = array();
        $db->select("SELECT CenterID, Name FROM psc", $pscRows);
        foreach($pscRows AS $row) {
            $this->centerIDMap[$row['CenterID']] = $row['Name'];
        }


        // the base query
        $query = " FROM candidate,tracking_logs left outer join session on (tracking_logs.CandID=session.CandID and tracking_logs.Visit_label=session.Visit_label) WHERE tracking_logs.CandID=candidate.CandID ";

        // only view their own profiles, unless they have permission to see all
        if (!($user->hasPermission('tracking_logs_edit_all') || $user->hasPermission('access_all_profiles'))) {
            $query .= " AND candidate.centerID = '" . $user->getData('CenterID') . "' "; 
        }

        // set the class variables
        $this->columns = array('Tracking_log_ID', 'Subproject_ID AS Objective', 'IF(session.ID is null, candidate.CenterID, session.CenterID) AS Site', 'tracking_logs.CandID AS DCCID', 'tracking_logs.PSCID', 'candidate.Gender', 'tracking_logs.Visit_label', 'CONCAT(FLOOR((TO_DAYS(aMRI_date) - TO_DAYS(IF(Subproject_ID=2, candidate.EDC, candidate.DoB)))/365.25), ":", ROUND(((TO_DAYS(aMRI_date) - TO_DAYS(IF(Subproject_ID=2, candidate.EDC, candidate.DoB)))%365.25)/30), "(Y:M)") AS ApproxAge', 'aMRI_date', 'aMRI_done AS aMRI', 'Relaxometry_done AS Relaxometry', 'DTI_done AS DTI', 'Second_DC_done AS Second_DC','MRS_done AS MRS','MRSI_done AS MRSI','eDTI_done AS eDTI', 'Lock_record', 'Comments');

       


        $this->query = $query;
        $this->group_by = '';
        $this->order_by = 'tracking_logs.CandID, tracking_logs.Visit_label';
        $this->headers = array('Objective', 'Site', 'DCCID', 'PSCID', 'Gender', 'Visit_label', 'ApproxAge', 'aMRI_date', 'aMRI', 'Relaxometry', 'DTI', 'Second_DC', 'MRS','MRSI','eDTI','Lock_record','Comments');
        $this->validFilters = array('tracking_logs.Subproject_ID', 'candidate.CenterID', 'candidate.CandID', 'candidate.PSCID', 'candidate.Gender', 'tracking_logs.Visit_label', 'ApproxAge', 'tracking_logs.aMRI_done', 'tracking_logs.Relaxometry_done', 'tracking_logs.DTI_done', 'tracking_logs.Second_DC_done','tracking_logs.MRS_done', 'tracking_logs.MRSI_done', 'tracking_logs.eDTI_done', 'tracking_logs.Lock_record');

        $this->formToFilter = array(
                                    'Objective' => 'tracking_logs.Subproject_ID',
                                    'CenterID' => 'candidate.CenterID',
                                    'DCCID' => 'candidate.CandID',
                                    'PSCID' => 'candidate.PSCID',
                                    'Gender' => 'candidate.Gender',
                                    'Visit_label' => 'tracking_logs.Visit_label',
                                    'aMRI' => 'tracking_logs.aMRI_done',
                                    'Relaxometry' => 'tracking_logs.Relaxometry_done',
                                    'DTI' => 'tracking_logs.DTI_done',
                                    'Second_DC' => 'tracking_logs.Second_DC_done',
                                    'MRS' => 'tracking_logs.MRS_done',
                                    'MRSI' => 'tracking_logs.MRSI_done',
                                    'eDTI' => 'tracking_logs.eDTI_done',
                                    'Lock_record' => 'tracking_logs.Lock_record'
                                    );
        return true;
    }


    function _setFilterForm()
    {
    	// create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // PSC
        if ($user->hasPermission('access_all_profiles') || $user->hasPermission('tracking_logs_edit_all')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = Utility::getSiteList();
            if(PEAR::isError($list_of_sites)) {
                return PEAR::raiseError("DB Error: ".$list_of_sites->getMessage());
            }
            if(is_array($list_of_sites)) $list_of_sites = array('' => 'Any') + $list_of_sites;
        }
        else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (PEAR::isError($site)) {
                return PEAR::raiseError("DB Error: ".$site->getMessage());
            }
            if ($site->isStudySite()) {
                $list_of_sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        /// hack for Visit Labels... maybe get all the real visit labels from DB?
        $list_of_visit_labels = array_merge(array(null=>"Any") + Utility::getVisitList(); //array(null=>'','V1'=>'V1','V2'=>'V2','V3'=>'V3','V4'=>'V4','V5'=>'V5','V6'=>'V6','V7'=>'V7','V8'=>'V8','V9'=>'V9', 'V10'=>'V10');
        $scandone_options = array(null=>'', 'No'=>'No', 'Yes'=>'Yes','NA'=>'N/A');
        $subproject_options = Utility::getSubprojectList();
        $subproject_options = array(null=>'') + $subproject_options;
        $gender_options = array(null=>'', 'Male'=>'Male', 'Female'=>'Female');
        $lock_options = array(null=>'','Locked'=>'Locked','Unlocked'=>'Unlocked');

        // Form Elements
        $this->form->addElement('select', 'Objective', 'Objective:', $subproject_options);
        $this->form->addElement('select', 'CenterID', 'Site:', $list_of_sites);
        $this->form->addElement('text', 'DCCID', 'DCCID::', array("size"=>9, "maxlength"=>6));
        $this->form->addElement('text', 'PSCID', 'PSCID:', array("size"=>9, "maxlength"=>7));
        $this->form->addElement('select', 'Gender', 'Gender:', $gender_options);

        $this->form->addElement('select', 'Visit_label', 'Visit Label:', $list_of_visit_labels);
        $this->form->addElement('select', 'aMRI', 'aMRI Done:', $scandone_options);
        $this->form->addElement('select', 'Relaxometry', 'Relaxometry Done:', $scandone_options);
        $this->form->addElement('select', 'DTI', 'DTI Done:', $scandone_options);
        $this->form->addElement('select', 'Second_DC', '2nd DC Done:', $scandone_options);
        $this->form->addElement('select', 'MRS', 'MRS Done:', $scandone_options);
        $this->form->addElement('select', 'MRSI', 'MRSI Done:', $scandone_options);
        $this->form->addElement('select', 'eDTI', 'eDTI Done:', $scandone_options);
        $this->form->addElement('select', 'Lock_record', 'Lock_record:', $lock_options);
       
        return true;
    }

    function _setDataTableRows($count)
    {


        // print out
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            // $identifier = $item['Tracking_log_ID'];
            foreach ($item as $key => $val) {
                if ($key =='Tracking_log_ID') continue;
                if ($key == 'Visit_label') {
                    $this->tpl_data['items'][$x][$i]['Tracking_log_ID'] = $item['Tracking_log_ID'];
                }
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;
                if ($key == 'Site') {
                    $this->tpl_data['items'][$x][$i]['value'] = $this->centerIDMap[$item['Site']];
                }
                $i++;
            }
            $x++;
        }

        return true;
    }
}
?>
