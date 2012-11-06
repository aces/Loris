<?php
require_once 'NDB_Form.class.inc';

/**
 * The forms for the start next stage menu
 * @package main
 */
class NDB_Form_next_stage extends NDB_Form
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();

        $timePoint =& TimePoint::singleton($this->identifier);

        // check user permissions
    	if (!$user->hasPermission('data_entry') || $user->getData('CenterID') != $timePoint->getData('CenterID')) {
            return false;
        }
		
        return $timePoint->isStartable();
    }
    
    
    function _process($values)
    {
        $timePoint =& TimePoint::singleton($this->identifier);
        
        // figure out what the next stage should be
        $newStage = $timePoint->getNextStage();
        
        // start that stage
        $timePoint->startStage($newStage);
        
        // set the date for the new stage
        $timePoint->setData("Date_".$newStage, $values['date1']['Y'].'-'.$values['date1']['M'].'-'.$values['date1']['d']);
        
        // set SubprojectID if applicable
        if(isset($values['SubprojectID'])) {
            $timePoint->setData('SubprojectID', $values['SubprojectID']);
        }
        
        // set scan done if applicable
        if(isset($values['scan_done'])) {
            $timePoint->setData('Scan_done', $values['scan_done']);
        }
        
        // create a new battery object && new battery
        $battery =& new NDB_BVL_Battery;

        // select a specific time point (sessionID) for the battery
        $battery->selectBattery($timePoint->getData('SessionID'));

        // add instruments to the time point (lower case stage)
        $battery->createBattery($timePoint->getSubprojectID(), $newStage, $timePoint->getVisitLabel(), $timePoint->getCenterID());
        
        //------------------------------------------------------------

        $this->tpl_data['success'] = true;
        $this->tpl_data['sessionID'] = $this->identifier;
        $this->tpl_data['candID'] = $timePoint->getCandID();
        
        // freeze it, just in case
        //$this->form->freeze();
    }

    function next_stage()
    {
        $timePoint =& TimePoint::singleton($this->identifier);
        $config =& NDB_Config::singleton();
        
        $study = $config->getSetting('study');
        $dateOptions = array(
                             'language'        => 'en',
                             'format'          => 'YMd',
                             'addEmptyOption'  => true,
                             'minYear'         => $study['startYear'],
                             'maxYear'         => $study['endYear']
                             );

        $this->form->addElement('hidden', 'candID', $timePoint->getData('CandID'));
        $this->form->addElement('hidden', 'sessionID', $timePoint->getData('SessionID'));

        $stage = $timePoint->getNextStage();
        $this->tpl_data['stage'] = $stage;

        // add form elements
        if ($stage == 'Visit' && $config->getSetting('useScanDone')!='false') {
            $this->form->addElement('select', 'scan_done', 'Scan Done', array(null => null, 'Y' => 'Yes', 'N' => 'No'));
            $this->form->addRule('scan_done', 'Scan done is required', 'required');
        }

        // add dates
        $this->form->addElement('date', 'date1', "Date of $stage", $dateOptions);
        $this->form->addElement('date', 'date2', "Retype Date of $stage", $dateOptions);

        // let user select subproject *only* if subprojectid is not > 0
        if(!($timePoint->getSubprojectID() > 0)) {
            $list_of_objectives =& Utility::getSubprojectList();
            $this->form->addElement('select', 'SubprojectID', 'Objective', array('' => '') + $list_of_objectives);
            $this->form->addRule('SubprojectID', 'Required', 'required');
        }

        // add date rules
        $this->form->addRule('date1', 'Date is required', 'required');
        $this->form->addRule(array('date1', 'date2'), 'Date fields must match', 'compare');

        $this->form->addFormRule(array(&$this, '_validate'));
    }

    function _validate($values)
    {
        $config =& NDB_Config::singleton();

        $timePoint =& TimePoint::singleton($this->identifier);
        $candID = $timePoint->getCandID();

        $candidate =& Candidate::singleton($candID);

        

        $errors = array();
        // check date pairs
        if (empty($values['date1']['M']) && empty($values['date1']['d']) && empty($values['date1']['Y'])) {
            $errors['date1'] .= "Date is required. \n";
        }
        elseif (!_checkDate($values['date1'])) {
            $errors['date1'] .= "Date is not a valid date. \n";
        }

        if ($values['date1']['M']!= ($values['date2']['M']) || 	$values['date1']['d']!=($values['date2']['d']||	$values['date1']['Y'])!=$values['date2']['Y']) {
            $errors['date1'] .= "Both Date fields must match. \n";
        }

        // get candidate's DOB or EDC according to SubprojectID
        $candidateBirthDate = $timePoint->getEffectiveDateOfBirth();

        //Determine the next stage, and validate accordingly
        $stage = $timePoint->getNextStage();
        if ($stage == 'Visit') {
            // compare the dates date of MRI must be > DOB - ONLY WHEN starting Visit stage
            $date = sprintf("%04d-%02d-%02d", $values['date1']['Y'], $values['date1']['M'], $values['date1']['d']);

            if (empty($values['scan_done']) && $config->getSetting('useScanDone')!='false') {
                $errors['scan_done'] = 'Scan done is required';
            }
            if ($config->getSetting('useScreening')=="true" && $config->getSetting('screeningAfterVisit')!="true" && strcmp($date, $timePoint->getData('Date_screening')) < 0) {
                $errors['date1'] .= "Date of Visit is less than Date of Screening. \n";
            }
            if ($config->getSetting('allowPrenatalTimepoints')!="true" && strcmp($date, $candidateBirthDate) < 1) {
                $errors['date1'] .= "Date of Visit is less than Date of Birth/EDC. \n";
            }
        } 

        if(empty($errors)) return true;
        return $errors;
    }
}
?>

