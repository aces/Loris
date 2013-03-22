<?php
require_once "NDB_Form.class.inc";

/**
 * The forms for the tracking log menu
 * @package mri
 * @subpackage NIHPD
 */
class NDB_Form_tracking_logs extends NDB_Form
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }
       
        if(!empty($this->identifier)) {
            $query = "SELECT psc.CenterID FROM tracking_logs, candidate, psc WHERE tracking_logs.CandID=candidate.CandID AND candidate.CenterID=psc.CenterID AND tracking_logs.Tracking_log_ID='$this->identifier'";
            $recordCenterID = $DB->selectOne($query);
            
            return ($user->hasPermission('tracking_logs')
                    && ($user->hasPermission('tracking_logs_edit_all')
                        || ($user->getData('CenterID') == $recordCenterID)));

        } else {
            return ($user->hasPermission('tracking_logs'));
        }
    }

    function _getDefaults()
    {
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $DB->select("SELECT * FROM tracking_logs", $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
               
        if (!empty($this->identifier)) { 
            
            // set the tracking log event details
            $DB->selectRow("SELECT Subproject_ID, CandID, PSCID, Visit_label, aMRI_date, aMRI_done, Relaxometry_done, DTI_done, Second_DC_done, MRS_done, MRSI_done, eDTI_done, Lock_record, Comments FROM tracking_logs WHERE Tracking_log_ID = $this->identifier", $row);
            if (Utility::isErrorX($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }

            // Set the defaults
            $defaults['Subproject_ID'] = $row['Subproject_ID'];
            $defaults['CandID'] = $row['CandID'];
            $defaults['PSCID'] = $row['PSCID'];
            $defaults['Visit_label'] = $row['Visit_label'];
            $defaults['aMRI_done'] = $row['aMRI_done'];
            $defaults['Relaxometry_done'] = $row['Relaxometry_done'];
            $defaults['DTI_done'] = $row['DTI_done'];
            $defaults['Second_DC_done'] = $row['Second_DC_done'];
            $defaults['MRS_done'] = $row['MRS_done'];
            $defaults['MRSI_done'] = $row['MRSI_done'];
            $defaults['eDTI_done'] = $row['eDTI_done'];
            $defaults['Lock_record'] = $row['Lock_record'];
            $defaults['Comments'] = $row['Comments'];

            // Set the date
            $date = explode('-', $row['aMRI_date']);
            $defaults['aMRI_date']['Y'] = $date[0];
            $defaults['aMRI_date']['M'] = $date[1];
            $defaults['aMRI_date']['d'] = $date[2];

        }

        return $defaults;
    }

    function _process($values)
    {
        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        // format the date of Scan
        $aMRI_date = sprintf("%04d-%02d-%02d", $values['aMRI_date']['Y'], $values['aMRI_date']['M'], $values['aMRI_date']['d']);

        if($aMRI_date == "0000-00-00") {
            $aMRI_date = null;
        }

        $user =& User::singleton();
        // if(!$user->hasPermission('tracking_logs_edit_all')) {
        //    $values['Lock_record'] = 'Locked';
        // }
              
        if (empty($this->identifier)) { 
            
            // insert the event
            $success = $DB->insert('tracking_logs', array(
                                                          'Subproject_ID' => $values['Subproject_ID'], 
                                                          'CandID' => $values['CandID'], 
                                                          'PSCID' => $values['PSCID'],
                                                          'Visit_label' => $values['Visit_label'],
                                                          'aMRI_date'=> $aMRI_date,
                                                          'aMRI_done' => $values['aMRI_done'],
                                                          'Relaxometry_done' => $values['Relaxometry_done'],
                                                          'DTI_done' => $values['DTI_done'],
                                                          'Second_DC_done' => $values['Second_DC_done'],
                                                          'MRS_done' => $values['MRS_done'],
                                                          'MRSI_done' => $values['MRSI_done'],
                                                          'eDTI_done' => $values['eDTI_done'],
                                                          'Lock_record' => $values['Lock_record'],
                                                          'Comments' => $values['Comments']
                                                          ));
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
            $this->identifier = $DB->lastInsertID;
        } else {
            // update the event
            $success = $DB->update('tracking_logs', array(
                                                          'Subproject_ID' => $values['Subproject_ID'], 
                                                          'CandID' => $values['CandID'], 
                                                          'PSCID' => $values['PSCID'],
                                                          'Visit_label' => $values['Visit_label'],
                                                          'aMRI_date' => $aMRI_date,
                                                          'aMRI_done' => $values['aMRI_done'],
                                                          'Relaxometry_done' => $values['Relaxometry_done'],
                                                          'DTI_done' => $values['DTI_done'],
                                                          'Second_DC_done' => $values['Second_DC_done'],
                                                          'MRS_done' => $values['MRS_done'],
                                                          'MRSI_done' => $values['MRSI_done'],
                                                          'eDTI_done' => $values['eDTI_done'],
                                                          'Lock_record' => $values['Lock_record'],
                                                          'Comments' => $values['Comments']
                                                          ), array('Tracking_log_ID' => $this->identifier));
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError("DB Error: ".$success->getMessage());
            }
        }

        $this->form->freeze();
        $this->tpl_data['success'] = true;
    }

    function tracking_logs()
    {
        $this->redirect = "test_name=$this->name"; // what does this do?
        
        //------------------------------------------------------------
        $config =& NDB_Config::singleton();
        $study = $config->getSetting('study');
        $dateOptions = array(
                             'language'        => 'en',
                             'format'          => 'YMd',
                             'addEmptyOption'  => true,
                             'minYear'         => $study['startYear'],
                             'maxYear'         => $study['endYear']
                             );

        $DB =& Database::singleton();
        if(Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }

        $user =& User::singleton();

        $DB->select("SELECT Name FROM psc", $result);
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
       
        $pscOptions[0] = '';
        foreach ($result as $row) {
            $pscOptions[$row['Name']] = $row['Name'];
        }
       
       
        $subproject_options = Utility::getSubprojectList();
        $subproject_options = array(null=>'') + $subproject_options;
        $lock_options = array(null=>'','Locked'=>'Locked','Unlocked'=>'Unlocked');
        $scandone_options = array(null=>'','No'=>'No', 'Yes'=>'Yes','NA'=>'N/A');
    
        // Subproject ID
        $this->form->addElement('select', 'Subproject_ID', 'Subproject ID', $subproject_options);
        $this->form->addRule("Subproject_ID","Objective is Required",'required', null);
        
        // CID
        $this->form->addElement('text', 'CandID', 'DCCID', array("size"=>9, "maxlength"=>6));
        $this->form->addRule("CandID","DCCID is Required",'required', null);

        // PSCID
        $this->form->addElement('text', 'PSCID', 'PSCID', array("size"=>9, "maxlength"=>7));
        $this->form->addRule("PSCID","PSCID is Required",'required', null);

        // Visit Label
        $this->form->addElement('text', 'Visit_label', 'Visit label', array("size"=>4, "maxlength"=>3));
        $this->form->addRule("Visit_label","Visit Label is Required",'required', null);

        // Date of Scan
        $this->form->addElement('date', 'aMRI_date', 'Date of Scan', $dateOptions);
      
        // Relaxometry Done
        $this->form->addElement('select', 'aMRI_done', 'aMRI Done', $scandone_options);

        // Relaxometry Done
        $this->form->addElement('select', 'Relaxometry_done', 'Relaxometry Done', $scandone_options);

        // DTI Done
        $this->form->addElement('select', 'DTI_done', 'DTI Done', $scandone_options);

        // 2nd DC Done
        $this->form->addElement('select', 'Second_DC_done', '2nd DC Done', $scandone_options);

        // MRS Done
        $this->form->addElement('select', 'MRS_done', 'MRS Done', $scandone_options);

        // MRSI Done
        $this->form->addElement('select', 'MRSI_done', 'MRSI Done', $scandone_options);

        // EDTI Done
        $this->form->addElement('select', 'eDTI_done', 'eDTI Done', $scandone_options);

        // Comments
        $this->form->addElement('text', 'Comments', 'Comments', array("size"=>80));

        // Lock the screen
        if($user->hasPermission('tracking_logs_edit_all')) {
            $this->form->addElement('select', 'Lock_record', 'Lock this record:', $lock_options);
        }

        // form rule to check for invalid DCCID
        $this->form->addFormRule(array(&$this, '_validate'));
       
        // If this record is locked then, freeze the screen for all regular users 
        $is_locked = $DB->selectOne("SELECT IF(Lock_record='Locked',1,0) from tracking_logs WHERE tracking_logs.Tracking_log_ID='$this->identifier'");

        if($is_locked && !$user->hasPermission('tracking_logs_edit_all')){
            $this->form->freeze();
        }


        $this->tpl_data['user']['permissions']['tracking_logs_edit_all'] = ($user->hasPermission('tracking_logs_edit_all') ? 'true' : '');

    } // End function tracking_log
      
    function _validate($values)
    {
        $DB =& Database::singleton();
        $query = "SELECT count(*) AS counter FROM candidate WHERE CandID='$values[CandID]' and PSCID='$values[PSCID]'";
        $recordsFound = $DB->selectOne($query);
        $errors = array();

        if($recordsFound < 1) {
            $errors['CandID'] = "Specified DCCID and PSCID do not exist or do not match.";
        }

        return $errors;
    }

}
?>
