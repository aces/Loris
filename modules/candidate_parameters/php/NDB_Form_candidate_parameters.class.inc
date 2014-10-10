<?php
/**
 * This file contains code for edit candidate profile page
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once "NDB_Form.class.inc";
require_once "Utility.class.inc";

/**
 * A class for holding a set of functions to update candidate 
 * info page.
 *
 * @category Main
 * @package  Loris
 * @author   Various <example@example.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

class NDB_Form_candidate_parameters extends NDB_Form
{
    var $relationType =  array(null=>'','full_sibling'=>'Full Sibling',
                               'half_sibling'=>'Half Sibling',
                               '1st_cousin'=>'First Cousin');
    var $indent       = "&nbsp;&nbsp;&nbsp;&nbsp;";

     /**
     * Determine if user has permission to access this page
     *
     * @return boolean true if access is permitted
     */

    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // check that the $candID is passed b/c the profile needs to be opened
        if ($this->identifier != $_REQUEST['candID']) {
            return PEAR::raiseError("NDB_Form_candidate_parameters::_access: 
                       Candidate Profile Error (".$_REQUEST['candID']."): ");
        }

        $candidate =& Candidate::singleton($this->identifier);
        if (Utility::isErrorX($candidate)) {
            return PEAR::raiseError("Candidate Error 
                           ($this->identifier): ".$candidate->getMessage());
        }

        // check user permissions
        return ($user->hasPermission('data_entry') 
                && $user->getData('CenterID') == $candidate->getData('CenterID') 
                && $user->hasPermission('unsend_to_dcc'));
    }
     /**
      * Returns default values for all candidate parameters
      *
      * @return default array
      */
    function _getDefaults()
    {
        $DB =& Database::singleton();
        //Get the default values
        $value_results = $DB->pselect("SELECT ParameterTypeID, Value FROM 
                         parameter_candidate WHERE CandID=:CaID", 
                         array('CaID' => $this->identifier));
       
        $proband_info['ProbandGUID'] = $DB->pselectOne("SELECT ProbandGUID FROM 
                                       candidate WHERE CandID=:CandidateID", 
                                       array('CandidateID' => $this->identifier));
        $defaults['ProbandGUID']     = $proband_info['ProbandGUID'];

        $proband_info['ProbandDoB'] = $DB->pselectOne("SELECT ProbandDoB FROM 
                                       candidate WHERE CandID=:CandidateID", 
                                       array('CandidateID' => $this->identifier));
        if ($proband_info['ProbandDoB']=== '0000-00-00') {
            $proband_info['ProbandDoB'] = '';
        }
        $proband_info['ProbandGender'] = $DB->pselectOne("SELECT ProbandGender FROM 
                                         candidate WHERE CandID=:CandidateID", 
                                         array('CandidateID' => $this->identifier));
        $candidate_dob                 = $DB->pselectOne("SELECT DoB FROM candidate 
                                         WHERE CandID=:CandidateID", 
                                         array('CandidateID' => $this->identifier));

        $age                           = Utility::calculateAge(
                                       $proband_info['ProbandDoB'], $candidate_dob); 
        if (Utility::isErrorX($age)) {
            $defaults['Age_Difference'] = 'Could not calculate age';
        } else {
            $defaults['Age_Difference'] = $age['year']*12 + $age['mon'] + 
                                          round($age['day']/30, 2);
        }
        $this->tpl_data['proband_info'] = $proband_info;
        foreach ($proband_info as $key=>$val) {
            $defaults[$key] = $val;
            if ($key == 'ProbandDoB') {
                $defaults[$key."2"] = $proband_info[$key];
            }
        }

        $familyid = $DB->pselectOne("SELECT FamilyID from family WHERE 
                                    CandID=:CandidateID",
                                    array('CandidateID'=>$this->identifier));
        if (Utility::isErrorX($familyid)) {
            $relations = $DB->pselect("SELECT Relation_CandID, Relation_code FROM 
                         family WHERE CandID=:CandidateID", 
                         array('CandidateID'=> $this->identifier));

        } else {
            $this->tpl_data['familyID'] = $familyid;
            $relations                  = $DB->pselect("SELECT CandID, Relationship_type 
                                          FROM family WHERE FamilyID=:fam_id AND 
                                          CandID <> '$this->identifier'",
                                          array('fam_id'=> $familyid));

        }
        $this->tpl_data['sibling_list'] = array();
        foreach ($relations as $relation) {
            $relation['Relationship_type']    = $this->relationType[$relation['Relationship_type']];
            $this->tpl_data['sibling_list'][] = $relation;
        }
       
        $emptor_info = $DB->pselectRow("SELECT flagged_caveatemptor,flagged_reason,flagged_other
                                        FROM candidate WHERE CandID=:CandidateID",
                                        array('CandidateID' => $this->identifier));
        foreach ($emptor_info as $key=>$val) {
            if ($key == 'flagged_reason') {
                $reason = $DB->pselectOne("SELECT Description AS Reason FROM candidate c 
                                           JOIN caveat_options o ON (o.ID = c.flagged_reason) 
                                           WHERE CandID=:CandidateID",
                                           array('CandidateID' => $this->identifier));
                if (!empty($reason)) {
                   $cand_info['flagged_reason'] = $reason; 
                }
            } else {
                $cand_info[$key]= $val;
            }
         
         }
 
        $DB->select("SELECT ParameterTypeID, Value FROM parameter_candidate 
                     WHERE CandID='".$this->identifier."'", $value_results);
        foreach ($value_results AS $vresult) {
            if (!empty($vresult['Value'])) {
                $cand_info["PTID_".$vresult['ParameterTypeID']] = $vresult['Value'];
            }
        }
        $this->tpl_data['params_list'] = $cand_info;
        foreach ($cand_info as $key=>$val) {
            if ($key == 'flagged_reason') {
                $defaults[$key] = $emptor_info[$key];
            } else {
                $defaults[$key] = $val;
            }
        }
 
       // Getting participant status default values
        $ps_info = $DB->pselectRow("SELECT study_consent,study_consent_date,study_consent_withdrawal,
                                    ndar_consent,ndar_consent_date,ndar_consent_withdrawal,reason_specify,
                                    participant_status,participant_suboptions FROM participant_status 
                                    WHERE CandID = :cid", array('cid'=>$this->identifier));
        if (empty ($ps_info['participant_status'])) {
            //set candidate to active by default
          $this->tpl_data['pstat'] = $DB->pselectOne("SELECT ID FROM participant_status_options WHERE
                                                        Description=:desc", array('desc'=>'Active'));

        } else {
           $this->tpl_data['pstat']     = $ps_info['participant_status'];
           $this->tpl_data['pstat_sub'] = $ps_info['participant_suboptions'];
        }
        foreach ($ps_info as $key => &$val) {

            if ($val === '0000-00-00') {
                $val = '';
            }
            if (!empty($ps_info[$key])) {
                $consent_info[$key] = $val;
            }
        }
 
	foreach ($consent_info as $key=>$val) {
		$defaults[$key] = $val;
		if(strpos($key,"_date") !== FALSE || strpos($key,"_withdrawal") !== FALSE) {
			$defaults[$key."2"] = $consent_info[$key];
		}
	}

        $config                            =& NDB_Config::singleton();
        $consent                           = $config->getSetting('ConsentModule');
        $this->tpl_data['display_consent'] = false;
        if ($consent['useConsent'] === 'true') {
            $this->tpl_data['display_consent'] = true;
        }
        $this->tpl_data['display_proband'] = false;
        if ($config->getSetting('useProband') === 'true') {
            $this->tpl_data['display_proband'] = true;
        }
        $this->tpl_data['display_family'] = false;
        if ($config->getSetting('useFamilyID') === 'true') {
            $this->tpl_data['display_family'] = true;
        }
        $this->tpl_data['consent_info'] = $consent_info;
        $result                         = $DB->pselect("SELECT participant_status, entry_staff, 
                                          data_entry_date FROM participant_status_history
                                          WHERE CandID=:cid", array('cid'=>$this->identifier));
        for ($i=0; $i < sizeof($result); $i++) {
            $row                                       = $result[$i];
            $desc                                      = $DB->pselectOne("SELECT Description FROM participant_status_options 
                                                         WHERE ID=:pid", array('pid'=>$row['participant_status']));
            $this->participant_history["status".$i]    = $desc;
            $this->participant_history["staff".$i]     = $row['entry_staff'];
            $this->participant_history["timestamp".$i] = $row['data_entry_date'];
        }
        return $defaults;
    }

    function _process($values)
    {   
        if(!is_array($values) || count($values) ==0) {
        	return true;
        }
        $DB               =& Database::singleton();
        $values['CandID'] = $this->identifier;
        unset($values['ProbandDoB2']);
 
        $config  =& NDB_Config::singleton();
        $consent = $config->getSetting('ConsentModule');
        if ($consent['useConsent'] === 'true') {

            foreach (Utility::asArray($consent['Consent']) as $question) {
                unset($values[$question['name'].'_date2']);
                unset($values[$question['name'].'_withdrawal2']);
            }
        }
        if (!(is_null($_SESSION['State']))) {
            $currentUser           =& User::singleton($_SESSION['State']->getUsername());
            $id                    = $currentUser->getData("UserID");
            $values['entry_staff'] = $id;
        }

        while (list($key, $value) = each($values)) {
        	$set="";
            if (strpos($key, "PTID_") === 0) {
                $set['ParameterTypeID'] = str_replace("PTID_","",$key);
                $set['CandID']          = $this->identifier;
                $set['Value']           = $value;
                $set['InsertTime']      = time();
                
                //delete old values
                $DB->delete("parameter_candidate", array("CandID"=>$this->identifier,
                            "ParameterTypeID"=>$set['ParameterTypeID']));
                //insert new values
                $DB->insert("parameter_candidate", $set);
            } else if($key == "ProbandGUID" || $key == 'ProbandDoB' || $key == 'ProbandGender'
                      || $key =='flagged_caveatemptor' || $key == 'flagged_reason' || $key == 'flagged_other'
                      || $key == 'flagged_other_status') {
                if($key == 'ProbandDoB') {
                    $value = $this->_getDatabaseDate($value);
                }
                if(!empty($value)) {
                    $DB->update("candidate", array($key => $value), array('CandID' => $this->identifier));
                }
                if ($key == 'ProbandDoB') {
                    $tests = $DB->pselect(
                        "SELECT f.CommentID, f.Test_name 
                        FROM flag f JOIN session s ON (f.SessionID=s.ID)
                        JOIN candidate c ON (c.CandID=s.CandID)
                        WHERE
                        c.CandID=:CaID AND f.Test_name LIKE '%proband'", array('CaID' => $this->identifier)
                    );
                    foreach ($tests as $test) {
                        $inst     = NDB_BVL_Instrument::factory($test['Test_name'], $test['CommentID'], null, false);
                        $setValue = array('Date_taken' => $inst->getFieldValue('Date_taken'));
                        $inst->_saveCandidateAge($setValue);
                        $DB->update($test['Test_name'], $setValue, array('CommentID' => $test['CommentID']));
                    }

                }
            }
           
        }

       if (isset($values['FamilyMemberID'])) { 
           $fid = $DB->pselectOne("SELECT FamilyID FROM family WHERE CandID=:CaID", array('CaID' => $this->identifier));
           if (Utility::isErrorX($fid)) {
               return PEAR::raiseError("Could not family id: ".$fid->getMessage());
           }
           if (empty($fid)) {
               $famID = $DB->pselectOne("SELECT max(FamilyID) from family");
               if (Utility::isErrorX($famID)) {
                   return PEAR::raiseError("Could not family id: ".$famID->getMessage());
               }
               if (empty($famID)) {
                   $famID = 0;
               }
               $fid = $famID+1;
               $success = $DB->insert('family', array('CandID'=>$this->identifier, 'FamilyID'=>$fid,
                           'Relationship_type'=>$values['relation_type']));
               if (Utility::isErrorX($success)) {
                   return PEAR::raiseError("DB Error: ".$success->getMessage());
               }

           }

           $value   = $values['FamilyMemberID'];
           $success = $DB->insert('family', array('CandID'=>$value,'FamilyID'=>$fid,
                                  'Relationship_type'=>$values['relation_type']));
           if (Utility::isErrorX($success)) {
               return PEAR::raiseError("DB Error: ".$success->getMessage());
           }
          
       }
       // updating participant status
       if (isset($values['participant_status']) || isset($values['reason_specify'])
          || isset($values['reason_specify_status']) || isset($values['participant_suboptions'])) {
           $participant_vals                       = array();
           $participant_vals['participant_status'] = $values['participant_status'];
           $sub_reasonID                           = $DB->pselectOne("SELECT ID FROM participant_status_options 
                                                     WHERE Description=:sub_desc", 
                                                     array('sub_desc' =>$values['participant_suboptions']));
           if (empty($sub_reasonID)) {
               $participant_vals['participant_suboptions'] = NULL;
           } else {
               $participant_vals['participant_suboptions'] = $sub_reasonID;
           }
           $participant_vals['participant_suboptions']= $values['participant_suboptions']; 
           $participant_vals['entry_staff']           = $id;
           $participant_vals['reason_specify']        = $values['reason_specify'];
           $participant_vals['reason_specify_status'] = $values['reason_specify_status'];
           $participant_vals['CandID']                = $values['CandID'];
          
           //if it exists update it
           $ParticipantCount = $DB->pselectOne(
                   "SELECT COUNT(*) FROM participant_status WHERE CandID = :cid", 
                   array("cid"=>$values['CandID'])
                   );
           if ($ParticipantCount > 0) {
               $success = $DB->update(
                       "participant_status", 
                       $participant_vals,
                       array("CandID"=>$values['CandID'])
                       );
           } else {
               //insert it
               $success = $DB->insert("participant_status",$participant_vals);
           }

           if (Utility::isErrorX($success)) {
               return PEAR::raiseError(
                       "NDB_Form_candidate_parameters::_process: ".$success->getMessage()
                       );
           }

           $current_status = $DB->pselectOne("SELECT participant_status FROM participant_status_history
                                              WHERE CandID = :cid ORDER BY data_entry_date DESC", 
                                              array("cid"=>$values['CandID']) );
           if($current_status != $participant_vals['participant_status']) {
               $success = $DB->insert("participant_status_history", 
                          array('participant_status'=>$participant_vals['participant_status'], 
                                'participant_suboptions'=>$participant_vals['participant_suboptions'],
                                'entry_staff'=>$participant_vals['entry_staff'],
                                'CandID' => $participant_vals['CandID'],
                                'reason_specify'=>$participant_vals['reason_specify'],
                                'reason_specify_status'=>$participant_vals['reason_specify_status']));
               if (Utility::isErrorX($success)) {
                   return PEAR::raiseError(
                           "NDB_Form_candidate_parameters::_process: ".$success->getMessage()
                           );
               }

           }
          
       }

       //updating consent information
       $config  =& NDB_Config::singleton();
       $consent = $config->getSetting('ConsentModule');
       if ($consent['useConsent'] === 'true') {

           $participant_vals = array();
           foreach (Utility::asArray($consent['Consent']) as $question) {
               $participant_vals[$question['name']] = $values[$question['name']];
               $consent_dates = array($question['name'].'_date',$question['name'].'_withdrawal');
               foreach($consent_dates as $field) {
                   $value = $this->_getDatabaseDate($values[$field]);
                   if($value === '--') {
                       $value = '';
                   }
                   $participant_vals[$field] = $value;  
               }
           }
           $participant_vals['entry_staff'] = $id;
           $participant_vals['CandID']      = $values['CandID'];
           //if it exists update it
           $ParticipantCount = $DB->pselectOne(
                   "SELECT COUNT(*) FROM participant_status WHERE CandID = :cid", 
                   array("cid"=>$values['CandID'])
                   );
           if ($ParticipantCount > 0) {
               $success = $DB->update(
                       "participant_status", 
                       $participant_vals,
                       array("CandID"=>$values['CandID'])
                       );
           } else {
               //insert it
               $participant_vals['participant_status'] = 1; // 1 is Active which should be default
               $success = $DB->insert("participant_status",$participant_vals);
           }

           if (Utility::isErrorX($success)) {
               return PEAR::raiseError(
                       "NDB_Form_candidate_parameters::_process: ".$success->getMessage()
                       );
           }

           $success = $DB->insert("consent_info_history", $participant_vals); 
           if (Utility::isErrorX($success)) {
               return PEAR::raiseError(
                       "NDB_Form_candidate_parameters::_process: ".$success->getMessage()
                       );
           }
       }
       $this->tpl_data['success'] = true;

        // freeze it, just in case
        $this->form->freeze();
    }


    function _getInstrumentInfo($instrument, $param) {
        $DB  =& Database::singleton();

        $ret = $DB->selectOne("SELECT t.$param FROM flag f JOIN $instrument t ON (t.CommentID=f.CommentID) 
                               JOIN session s ON (f.SessionID=s.ID) WHERE 
                               s.CandID=" . $DB->quote($this->identifier) . ' 
                               AND f.test_name=' . $DB->quote($instrument) . ' 
                               AND t.CommentID NOT LIKE \'DDE_%\'');
        if ($ret == array()) {
            return;
        }
        return $ret;
    }

    function candidate_parameters()
    {
        $DB =& Database::singleton();
        $config =& NDB_Config::singleton();

        $ethnicityList = array(null=>'');
        $success = Utility::getEthnicityList();
        if (Utility::isErrorX($success)) {
        	return PEAR::raiseError("Utility::getEthnicityList error: ".$success->getMessage());
        }
        $ethnicityList = array_merge($ethnicityList,$success);
        unset($success);
        
        $candidate =& Candidate::singleton($this->identifier);
        if (Utility::isErrorX($candidate)) {
            return PEAR::raiseError("Candidate Error ($this->identifier): ".$candidate->getMessage());
        }

        // candID
        $this->tpl_data['candID'] = $candidate->getData('CandID');

        $this->addScoreColumn('flagged_caveatemptor','Caveat Emptor flag for Candidate');
        $this->addScoreColumn('flagged_reason',$this->indent.'Reason for Caveat Emptor flag');
        $this->addScoreColumn('flagged_other', $this->indent.'Additional Comments for flag');

 		//Extract the fields from the parameter_type table
        $DB->select("SELECT pt.ParameterTypeID, pt.Name, pt.Type, Description 
                     FROM parameter_type as pt, parameter_type_category as ptc, parameter_type_category_rel as ptcr 
                     WHERE pt.ParameterTypeID=ptcr.ParameterTypeID AND ptcr.ParameterTypeCategoryID=ptc.ParameterTypeCategoryID 
                     AND ptc.Name='Candidate Parameters' ORDER BY pt.ParameterTypeID, pt.name ASC", $field_results);
        //If there are no defined fields print a message to that effect
        if (empty($field_results)) {
            $this->addScoreColumn("static", "No candidate parameters have been defined for this study");
            return;
        }
        
        //Loop through the fields and add them appropriately
        foreach ($field_results AS $fresult) {
            $this->addScoreColumn("PTID_".$fresult['ParameterTypeID'], $fresult['Description']);
        }
        
        $this->addScoreColumn('ProbandGUID', 'Proband GUID:');
        $this->addScoreColumn('ProbandDoB', 'DoB Proband:');
        $this->addScoreColumn('ProbandGender', 'Proband gender:');
        $this->addScoreColumn('Age_Difference','Age Difference between candidate<BR> and proband (in months):');

        $this->addScoreColumn('SiblingcID','Family Member ID:'); 
        $this->addScoreColumn('relation_type','Relationship:');
        //participant status 

        //entry staff info
        $this->addScoreColumn('entry_staff', 'Data Entry Staff');
        $this->addScoreColumn('data_entry_date', 'Date of last Data entry');

        $pscid = $DB->pselectone(
                'SELECT PSCID FROM candidate where CandID = :candid',
                array('candid'=>$this->identifier)
                );

        $this->addScoreColumn('pscid', 'PSCID');
        $this->tpl_data['pscid'] = $pscid;

        $options = $this->getParticipantStatusOptions();
        $options = array('') + $options;
        $this->tpl_data['pstatus_options'] = $options;
        $this->tpl_data['pstat'] = $_REQUEST['participant_status'];
        $this->addTextAreaGroup('reason_specify',"Comments",array(null=>'','not_answered'=>'Not Answered'));
        
        //Consent Information
        $result = $DB->pselect("SELECT po.Description,ps.Description as Details, entry_staff, data_entry_date,reason_specify
                FROM participant_status_history p join participant_status_options po on (po.ID = p.participant_status)
                left join participant_status_options ps on (ps.ID = p.participant_subOptions)
                WHERE CandID=:cid", array('cid'=>$this->identifier));
        for ($i = 0; $i< sizeof($result); $i++) {
            if($result[$i]['Description'] =='Active' && empty($result[$i]['entry_staff']))
            {
                $result[$i]['entry_staff'] = 'Enrollment';
            }

        }
        $this->tpl_data['history_list'] = $result;
        $config                         =& NDB_Config::singleton();
        $consent                        = $config->getSetting('ConsentModule');
        if ($consent['useConsent'] === 'true') {
            foreach (Utility::toArray($consent['Consent']) as $question) {
                $consentQuestion = array($question['name']=> $question['label'],
                                         $question['name'] . '_date' => "Date of <BR> $question[label]",
                                         $question['name'] . '_withdrawal' => "Date of withdrawal <BR> of $question[label]",
                                         'data_entry_date' =>'Date Updated',
                                         'entry_staff'=>'Data Entry Staff');
                $fields = $question['name'].', '.$question['name'] . '_date, '.$question['name'] . '_withdrawal, ';
                $study_consent = $DB->pselect("SELECT $fields entry_staff,data_entry_date 
                                               FROM consent_info_history WHERE CandID=:cid", 
                                               array('cid'=>$this->identifier));
                for ($i=0; $i<sizeof($study_consent); $i++ ) {
                    foreach ($study_consent[$i] as $key=>$value) {
                        if ($key == $question['name'] && empty($study_consent[$i][$question['name']])) {
                            break;    
                        }
                        if (!empty($study_consent[$i][$question['name']])) {
                           $study_consent_hist[$i][$key] = $value;   
                        }    
                    }
                }
            $this->tpl_data['consent_list'][$question['name']] = array('label'=>$consentQuestion, 
                                                                       'history'=>$study_consent_hist);    
            }
        }
        $this->form->addFormRule(array(&$this,'_validate'));
    }

    /* This is taken from NDB_BVL_Instrument. It should be moved to NDB_Page once NDB_Page is merged. */

    function _getDatabaseDate ($formDateValue) {
        if (!empty($formDateValue)) {
            // check if it's already formatted correctly
            if (is_string($formDateValue) && preg_match("/^[\d]{4}-[\d]{2}-[\d]{2}$/", $formDateValue)) {
                return $formDateValue;
            }
            if (count($formDateValue)==2) {
                $databaseValue = "$formDateValue[H]:$formDateValue[i]";  //handle time (HH:MM:SS)
            } else {
                $databaseValue = "$formDateValue[Y]-$formDateValue[M]-$formDateValue[d]";  //handle date (YYYY/MM/DD)
            }
        }
        return $databaseValue;
    }

    function add_family() {
        $DB =& Database::singleton();

        $pscid = $DB->pselectone(
                'SELECT PSCID FROM candidate where CandID = :candid',
                array('candid'=>$this->identifier)
                );
        $this->addScoreColumn('pscid', 'PSCID');
        $this->tpl_data['candID'] = $this->identifier;

        $this->tpl_data['pscid']  = $pscid;

        $this->addBasicText('FamilyMemberID','Family Member ID:<BR/> (Enter DCCID)' );
        $this->addSelect('relation_type','Relation Type', $this->relationType);
        $this->form->addFormRule(array(&$this, '_validate_add_family'));
        $this->tpl_data['candID'] = $this->identifier; 


    }

    function update_participant_status() { 
        $DB =& Database::singleton();
        $pscid = $DB->pselectone(
                'SELECT PSCID FROM candidate where CandID = :candid',
                array('candid'=>$this->identifier)
                );
        $this->addScoreColumn('pscid', 'PSCID');
        $this->tpl_data['candID'] = $this->identifier;

        $this->tpl_data['pscid'] = $pscid;
        $parentID = $DB->pselectOne('SELECT participant_status FROM participant_status Where CandID = :candid',
                                     array('candid'=>$this->identifier));
        $sub_options = $this->getParticipantStatusSubOptions($parentID);
        $sub_options = array('') + $sub_options;
        $options = $this->getParticipantStatusOptions();
      //  $options = array('') + $options;
        $this->tpl_data['pstatus_options'] = $options;
        $this->tpl_data['pstatus_suboptions'] = $sub_options;
        //$this->tpl_data['pstat'] = $_REQUEST['participant_status'];
        $this->addSelect('participant_status', "Participant Status", $options);
        $this->addSelect('participant_suboptions', "Specify Reason for status<BR>(Required only for status Inactive/Incomplete)", $sub_options);
        $this->addTextAreaGroup('reason_specify',"Comments",array(null=>'','not_answered'=>'Not Answered'));
        
        
    } 

    function update_candidate_info() {
        
        $DB =& Database::singleton();
        $pscid = $DB->pselectone(
                'SELECT PSCID FROM candidate where CandID = :candid',
                array('candid'=>$this->identifier)
                );
        $this->addScoreColumn('pscid', 'PSCID');
        $this->tpl_data['candID'] = $this->identifier;

        $this->tpl_data['pscid'] = $pscid;

        $caveat_options = array(''=>null);
        $options = $DB->pselect("SELECT ID, Description FROM caveat_options");
        foreach($options as $row) {
            $caveat_options[$row['ID']] = $row['Description'];
        }
        $this->addSelect('flagged_caveatemptor','Caveat Emptor flag for candidate', 
                                 array(''=>'','true'=>'True','false'=>'False'));
        $this->addSelect('flagged_reason',$this->indent.'Reason for Caveat Emptor flag',
                                $caveat_options);
        $this->addTextAreaGroup('flagged_other',$this->indent.'If Other, please specify',
                                          array(null=>'','not_answered'=>'Not Answered'));
        //Extract the fields from the parameter_type table
        $DB->select("SELECT pt.ParameterTypeID, pt.Name, pt.Type, Description FROM parameter_type as pt, 
                     parameter_type_category as ptc, parameter_type_category_rel as ptcr 
                     WHERE pt.ParameterTypeID=ptcr.ParameterTypeID AND ptcr.ParameterTypeCategoryID=ptc.ParameterTypeCategoryID 
                     AND ptc.Name='Candidate Parameters' ORDER BY pt.ParameterTypeID, pt.name ASC", $field_results);
        //If there are no defined fields pritn a message to that effect
        if (empty($field_results)) {
        	$this->addScoreColumn("static", "No candidate parameters have been defined for this study");
        	return;
        }
        
        //Loop through the fields and add them appropriately
        foreach ($field_results AS $fresult) {
        	switch(substr($fresult['Type'],0,3)) {
        		case "enu":
        			$options = substr($fresult['Type'],4);
        			$options = trim($options,"()");
        			$options = Utility::explodeEncapsulated(",", "'", $options);
                    $elOptions = array('' => '');
                    foreach ($options as $option) {
                        $elOptions[$option] = $option;
                    }
        			$this->addSelect("PTID_".$fresult['ParameterTypeID'], $fresult['Description'], $elOptions);
        		break;
        		
        		case "dat":
        			$this->addBasicDate("PTID_".$fresult['ParameterTypeID'], $fresult['Description'], $dateOptions);
        		break;
        		
        		case "int":
        		case "var":
        		case "tex":
            default:
        			$this->addBasicTextArea("PTID_".$fresult['ParameterTypeID'], $fresult['Description']);
        		
        	}
        	$this->tpl_data['elements_list'][]="PTID_".$fresult['ParameterTypeID'];
        }
        $this->form->addFormRule(array(&$this,'_validate'));

    }
 
    function update_proband_info() {

        $DB =& Database::singleton();
        $pscid = $DB->pselectone(
                'SELECT PSCID FROM candidate where CandID = :candid',
                array('candid'=>$this->identifier)
                );
        $this->addScoreColumn('pscid', 'PSCID');
        $this->tpl_data['candID'] = $this->identifier;

        $this->tpl_data['pscid'] = $pscid;
        
        $this->addBasicText('ProbandGUID', 'Proband GUID:');
        
        $config             =& NDB_Config::singleton();
        $probandDateOptions = array(
            'language' => 'en',
            'format'   => 'YMd',
            'minYear'  => $config->getSetting('startYear') - 20, //allows for proband siblings up to 20 years older than candidate
            'maxYear'  => $config->getSetting('endYear'),
            'addEmptyOption' => true,
            'emptyOptionValue' => null
        );

        $this->addBasicDate('ProbandDoB', 'DoB Proband:', $probandDateOptions);
        $this->addBasicDate('ProbandDoB2', 'Confirm DoB Proband:', $probandDateOptions);
        $this->addSelect('ProbandGender', 'Proband gender:', array('' => '','Male' => 'Male', 'Female' => 'Female') );
        
        $this->form->addFormRule(array(&$this,'_validate'));
    }
    function update_consent_info() {
        $DB =& Database::singleton();
        $pscid = $DB->pselectone(
                'SELECT PSCID FROM candidate where CandID = :candid',
                array('candid'=>$this->identifier)
                );
        $this->addScoreColumn('pscid', 'PSCID');
        $this->tpl_data['candID'] = $this->identifier;

        $this->tpl_data['pscid']  = $pscid;
       
       // Add questions about consent
        $config =& NDB_Config::singleton();
        $consent = $config->getSetting('ConsentModule');
        if ($consent['useConsent'] === 'true') {
            $config =& NDB_Config::singleton();
            $dateOptions = array(
                    'language' => 'en',
                    'format'   => 'YMd',
                    'minYear'  => $config->getSetting('startYear'),
                    'maxYear'  => $config->getSetting('endYear'),
                    'addEmptyOption' => true,
                    'emptyOptionValue' => null
                    );

            $consentQuestions = array();
            foreach (Utility::asArray($consent['Consent']) as $question) {
                $yesno = $this->addSelect($question['name'], $question['label'], 
                        array('' => '',
                            'yes' => 'yes',
                            'no' => 'no')
                        ); 
                $withdrew = $this->addBasicDate($question['name'] . '_date', 
                        "Date of $question[label] (required)", $dateOptions);
                $withdrew2 = $this->addBasicDate($question['name'] . '_date2', 
                        "Confirmation Date of $question[label] (required)", $dateOptions);

                $withdrew = $this->addBasicDate($question['name'] . '_withdrawal', 
                        "Date of withdrawal of $question[label] (optional)", $dateOptions);
                $withdrew2 = $this->addBasicDate($question['name'] . '_withdrawal2', 
                        "Confirmation Date of withdrawal of $question[label] (optional)", $dateOptions);
                $consentQuestions[] = array(
                        $question['name'],
                        $question['name'] . '_date',
                        $question['name'] . '_date2',
                        $question['name'] . '_withdrawal',
                        $question['name'] . '_withdrawal2'
                        );
            }
            $this->tpl_data['consent'] = $consentQuestions;
        }
        $this->form->addFormRule(array(&$this,'_validate'));

    }
   
    function _validate_add_family($values)
    {   
        if (!is_array($values) || count($values) ==0) {
            return true;
        }
        $cand = $values['FamilyMemberID'];
        $DB =& Database::singleton();
        $errors = array();
        $results = $DB->pselect("SELECT CandID from candidate where Active='Y'" ,array());
        $activeCandidates = array();
        foreach ($results as $row) {
            $activeCandidates[] = $row['CandID'];
        }
        if (!in_array($cand, $activeCandidates)){
            $errors['FamilyMemberID']= 'Candidate should be part of study. Please enter correct CandID';
        }
        $familyID = $DB->pselectOne("SELECT FamilyID from family WHERE CandID=:cid",array('cid'=>$this->identifier));
        $relatives = $DB->pselect("SELECT CandID from family WHERE FamilyID=:fid",array('fid'=>$familyID));
        $active_family = array();
        foreach ($relatives as $relative){
            $active_family[] = $relative['CandID'];    
        }
        if (in_array($cand, $active_family)){
            $errors['FamilyMemberID'] = 'CandID already entered as Sibling';    
        }
        if (empty($values['relation_type'])) {
            $errors['relation_type'] = 'Please specify relationship type';    
        }
        if (empty($values['FamilyMemberID'])) {
            $errors['relation_type'] = 'Please specify DCCID of family member';    
        }
        return $errors;
    }
    

    /** 
     * This function is for validation of user input, depending on
     * the questions answered.
     *
     * @param array $fields The list of input to the form submitted by
     *                      smarty.
     *
     * @return array An array of elements with errors. An empty array if
     *               all elements are valid.
     */
    function _validate($fields)
    { 
        $config =& NDB_Config::singleton();
        $errors=array();
        $options = $this->getParticipantStatusOptionsVerbose();

        $DB =& Database::singleton();
        if($fields['ProbandDoB']['M'] != $fields['ProbandDoB2']['M'] ||
                $fields['ProbandDoB']['d'] != $fields['ProbandDoB2']['d'] ||
                $fields['ProbandDoB']['Y'] != $fields['ProbandDoB2']['Y'])
        { 
            $errors['ProbandDoB'] = 'Date of Birth Proband fields must match.';
        }

             // consent requirements
        $consent = $config->getSetting('ConsentModule');
        if ($consent['useConsent'] === 'true') {
            foreach (Utility::asArray($consent['Consent']) as $consenttype) {
                $fieldname         = $consenttype['name'];
                $consentVal        = $fields[$fieldname];
                $consentDate       = $fields[$fieldname . '_date'];
                $consentWithdrawal = $fields[$fieldname . '_withdrawal'];
                $consent           = date_create();
                $today             = date('Y-m-d'); 
                $consent->setDate($consentDate['Y'], $consentDate['M'], $consentDate['d']);
                $consent = $consent->format('Y-m-d'); 
                if ($consent > $today) {
                    $errors[$fieldname.'_date'] = 'Cannot be later than today';

                }

                if (
                        $consentVal === 'yes' && (
                            empty($consentDate)
                            || empty($consentDate['Y'])
                            || empty($consentDate['M'])
                            || empty($consentDate['d'])
                            )
                   ) {
                    $errors[$fieldname . '_date'] = 'Required';
                }
                if (
                        !empty($consentWithdrawal['Y'])
                        && !empty($consentWithdrawal['M'])
                        && !empty($consentWithdrawal['d'])
                   ) {
                    $withdrawal = date_create();

                    $withdrawal->setDate($consentWithdrawal['Y'], $consentWithdrawal['M'], $consentWithdrawal['d']);
                    $withdrawal = $withdrawal->format('Y-m-d'); 
                    $diff = date_diff($withdrawal, $consent);                   
                    if ($withdrawal < $consent) {
                        $errors[$fieldname . '_withdrawal'] = 'Must be after date of consent';
                    } else if ($withdrawal > $today) {
                        $errors[$fieldname . '_withdrawal'] = 'Cannot be later than today';

                    } 
                }
                if ($fields[$fieldname.'_withdrawal']['M'] != $fields[$fieldname.'_withdrawal2']['M'] ||
                        $fields[$fieldname.'_withdrawal']['d'] != $fields[$fieldname.'_withdrawal2']['d'] ||
                        $fields[$fieldname.'_withdrawal']['Y'] != $fields[$fieldname.'_withdrawal2']['Y'])
                {
                    $errors[$fieldname.'_withdrawal'] = 'Date of withdrawal fields must match.';
                }
                if ($fields[$fieldname.'_date']['M'] != $fields[$fieldname.'_date2']['M'] ||
                        $fields[$fieldname.'_date']['d'] != $fields[$fieldname.'_date2']['d'] ||
                        $fields[$fieldname.'_date']['Y'] != $fields[$fieldname.'_date2']['Y'])
                {
                    $errors[$fieldname.'_date'] = 'Date of consent fields must match.';
                }


            }
        }
        if ($fields['flagged_caveatemptor']=='true' && empty($fields['flagged_reason'])) {
            $errors['flagged_reason'] = 'Please provide additional information for 
                                         flagging candidate as Caveat Emptor';    
        }
        $fields['flagged_other'] =trim($fields['flagged_other']);
        if ($fields['flagged_reason']== 3 && empty($fields['flagged_other'])) {
            $errors['flagged_other_group'] = 'If Other, please specify details for cavear emptor';
        }

        if ($options[$fields['participant_status']]['Required'] == true) {
            $fields['participant_suboptions'] = trim($fields['participant_suboptions']);
            if (empty($fields['participant_suboptions'])) {
                $errors['participant_suboptions'] = "Please specify the status";
            }        
        }
        return $errors;
    }

    /**
     * Gets the participant_status options from participant_status_options
     * getParticipantStatusOptions()
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    function getParticipantStatusOptions()
    {
        $DB =& Database::singleton();
        $options = $DB->pselect(
                "SELECT ID,Description FROM participant_status_options WHERE parentID IS NULL",
                array()
                );
        $option_array = array();
        foreach ($options as $option) {
            $option_array[$option['ID']] = $option['Description'];
        }
        return $option_array;
    }

    /**
     * Get the participant_status options as an array, where each row
     * is an array
     *
     * @return array An array of options, where each row is an array containing
     *               the entire row from participant_status_options instead of
     *               only the description
     */
    function getParticipantStatusOptionsVerbose()
    {
        $DB =& Database::singleton();
        $options = $DB->pselect(
                "SELECT * FROM participant_status_options",
                array()
                );

        $option_array = array();
        foreach ($options as $option) {
            $ID = $option['ID'];
            unset($option['ID']);
            $option_array[$ID] = $option;
        }
        return $option_array;
    }
    
   /**
     * Gets the participant_status options suboptions from participant_status_options
     * getParticipantStatusSubOptions()
     *
     * @return array Options array suitable for use in QuickForm select
     *               element
     */
    function getParticipantStatusSubOptions($parentID)
    {
        $DB =& Database::singleton();
        $options = $DB->pselect(
                "SELECT ID,Description FROM participant_status_options WHERE parentID=:pid",
                array('pid'=>$parentID)
                );
        $option_array = array();
        foreach ($options as $option) {
            $option_array[$option['ID']] = $option['Description'];
        }
        return $option_array;
    }

}
?>
