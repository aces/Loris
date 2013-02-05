<?php   
require_once "NDB_Form.class.inc";
require_once "Email.class.inc";

/**
 * The forms for the user accounts menu
 * this menu's identifier is an associative array
 * @package mri
 * @subpackage NIHPD
 */
class NDB_Form_mri_safety extends NDB_Form
{

    /**
    * array of fields that can be updated
    * @access private
    */
    var $_settableValues = array('Check_adverse', 'Check_incidental', 'Acquisition_date', 'Date_review', 'Comment', 'Findings_confirmed', 'Findings_comment');
    
    /**
    * email of the person to receive notification about reported findings\
    * @access private
    */
    var $_emailAddress = array('rozie@bic.mni.mcgill.ca');
    
    function _hasAccess()
    {
        // create DB object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError("Could not connect to database: ".$db->getMessage());
        }

        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $site =& Site::singleton($user->getData('CenterID'));
        if (PEAR::isError($site)) {
            return PEAR::raiseError("Site error: ".$site->getMessage());
        }

        // disable access in case invalid parameters were passed
        if (empty($this->identifier)) {
        	return false;
        }
        
        // if creating a new form
        if ($this->identifier=="new") {
            $timepoint =& TimePoint::singleton($_REQUEST['mriSafetySessionID']);
            if (PEAR::isError($timepoint)) {
            	return PEAR::raiseError("Candidate Error: ".$timepoint->getMessage());
            }
            // verify candidate profile
            if ($_REQUEST['mriSafetyCandID']!=$_REQUEST['candID'] || $timepoint->getCandID()!=$_REQUEST['mriSafetyCandID']) {
            	return PEAR::raiseError("NDB_Form_mri_safety::_hasAccess: Invalid set of arguments");
            }
            // test the access perms
            return $site->isStudySite() && $user->getData('CenterID') == $timepoint->getCenterID() && $user->hasPermission('data_entry') && !empty($_REQUEST['candID']);
        }

        // get the centerID of the record to change
        // also select review status for the test below
        $query = "SELECT s.CenterID, m.Findings_confirmed FROM session as s, mri_safety as m WHERE s.ID=m.SessionID AND m.ID = '".$this->identifier."'";
        $result = array();
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
        	return PEAR::raiseError("NDB_Form_mri_safety::_hasAccess".$result->getMessage());
        }
        $recordCenterID = $result['CenterID'];
        $recordFindings_confirmed = $result['Findings_confirmed'];

        // allow access to but freeze the data entry form in case it has been reviewed
        // freeze the form if the review is done
        if (!empty($recordFindings_confirmed) && $recordFindings_confirmed != "In Progress") {
            $this->tpl_data['success'] = true;
            $this->form->freeze();
        }

        // test access perms: non-PSC users, access only exising forms w/ access permission to review and/or edit
        return (
        $_REQUEST['subtest']=='mri_safety_review' && $user->hasPermission('mri_safety')
        ||
        $_REQUEST['subtest']=='mri_safety_data_entry' && $user->getData('CenterID') == $recordCenterID && $user->hasPermission('data_entry') && $site->isStudySite()
        );
    }

    function _getDefaults()
    {
        // create DB object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError("Could not connect to database: ".$db->getMessage());
        }

        $result = array();

        $this->tpl_data['identifier'] = $this->identifier;
        if (!empty($_REQUEST['candID'])) {
            $this->tpl_data['candID']=$_REQUEST['candID'];
        }

        if ($this->identifier == 'new') {
            
            $defaults = array("Acquisition_date"=>$_REQUEST['acquisition_date']);
            
        } else {
            
            $query = "SELECT * FROM mri_safety WHERE ID = '".$this->identifier."'";
            $result=array();
            $db->selectRow($query, $result);
            if (PEAR::isError($result)) {
                	return ("NDB_Form_mri_safety::_getDefaults: ".$result->getMessage());
            }
            
            foreach ($result as $key=>$val) {
                if (!empty($val) && in_array($key, $this->_settableValues)) {
                	$defaults[$key]=$val;
                }
            }
        }
        return $defaults;
    }

    function _process($values)
    {
        if(!is_array($values) || count($values) ==0) {
        	return true;
        }
        
        if (is_array($values['Date_review'])) {
            $values['Date_review'] = sprintf("%04d-%02d-%02d", $values['Date_review']['Y'], $values['Date_review']['M'], $values['Date_review']['d']);
            if($values['Date_review'] == '0000-00-00') {
                $values['Date_review'] = NULL;
            }
        }
        
        // map to array of values to insert/update
        foreach ($values as $key=>$val) {
            if (in_array($key, $this->_settableValues)) {
                $setArray[$key] = $val;
            }
        }
        
        // create DB object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError("Could not connect to database: ".$db->getMessage());
        }
        
        // update/insert DB record
        if ($this->identifier=='new') {
            
            // set array
            $setArray = array_merge(array("SessionID"=>$_REQUEST['mriSafetySessionID'], "Acquisition_date"=>$_REQUEST['acquisition_date']), $setArray);
            // insert a new record
            $success = $db->insert('mri_safety', $setArray);
            // check for db errors
            if (PEAR::isError($success)) {
                return ("NDB_Form_mri_safety::_process: ".$success->getMessage());
            }
            
            // get the new ID
            $query = "SELECT max(ID) as RecordID from mri_safety";
            $db->selectRow($query, $result);
            if (PEAR::isError($result)) {
                return PEAR::raiseError($result->getMessage());
            }
            $this->identifier=$result['RecordID'];
            unset($result);
            unset($query);

        } else {

            // update the existing record
            $success = $db->update('mri_safety', $setArray, array('ID'=>$this->identifier));
            // check for db errors
            if (PEAR::isError($success)) {
                return ("NDB_Form_mri_safety::_process: ".$success->getMessage());
            }
        }

        // get the modified record from db
        $query = "SELECT p.Name, s.CandID, s.Visit_label, ms.Acquisition_date FROM psc as p, session as s left join mri_safety as ms on (s.ID=ms.SessionID) WHERE p.CenterID=s.CenterID AND ms.ID = '".$this->identifier."'";

        // run the query
        $result=array();
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
            return PEAR::raiseError($result->getMessage());
        }

        // reset the identifier
        $this->tpl_data['identifier'] = $this->identifier;

        // send the user an email if findings reported
        if ($setArray["Check_adverse"]=='Y' || $setArray["Check_incidental"]=='Y') {
            
            // create an instance of the config object
            $config =& NDB_Config::singleton();

            // send the user an email
            $msg_data['myStudy'] = $config->getSetting('title');
            $msg_data['mySite'] = $result['Name'];
            $msg_data['myCandidate'] = $result['CandID'];
            $msg_data['myVisitLabel'] = $result['Visit_label'];
            $msg_data['myAcquisitionDate'] = $result['Acquisition_date'];

            $template = 'mri_safety.tpl';

            foreach ($this->_emailAddress as $currEmail) {
                Email::send($currEmail, $template, $msg_data);
            }
        }

        $this->tpl_data['success'] = true;
        $this->form->freeze();
    }

    function mri_safety_data_entry()
    {
        if (empty($this->identifier) || $this->identifier=="new" && empty($_REQUEST['acquisition_date'])) {
        	return PEAR::raiseError("NDB_Form_mri_safety::mri_safety_data_entry: Unable to display the form, Date of Scan is missing \n");
        }
        
        // make local instances of objects
        $config =& NDB_Config::singleton();
        if (PEAR::isError($config)) {
        	return PEAR::raiseError($config->getMessage());
        }

        $optionsArray = array(null=>"", "Y"=>"Yes", "N"=>"No");
    	$currentYear = date("Y");
    	
        $dateOptions =  array(
        'language' => 'en',
        'format'   => 'YMd',
        'minYear'  => $config->getSetting('startYear'),
        'maxYear'  => $currentYear,
        'addEmptyOption' => true,
        'emptyOptionValue' => null
        );

        if ($this->identifier == 'new') {
        	$this->tpl_data['mriSafetyCandID']=$_REQUEST['mriSafetyCandID'];
        	$this->tpl_data['mriSafetySessionID']=$_REQUEST['mriSafetySessionID'];
        	$this->tpl_data['acquisition_date']=$_REQUEST['acquisition_date'];
        }
        
        // existing record
        $this->addScoreColumn('Acquisition_date', null);
        $this->addSelect('Check_adverse', null, $optionsArray);
        $this->form->addElement('date', 'Date_review', null, $dateOptions);
        $this->addSelect('Check_incidental', null, $optionsArray);
        $this->addScoreColumn('Comment');
        $this->addScoreColumn('Findings_confirmed');
        $this->addScoreColumn('Findings_comment');

        $this->form->addRule('Date_review', 'Required', 'required');
        $this->form->addRule('Check_adverse', 'Adverse findings required', 'required');
        $this->form->addRule('Check_incidental', 'Incidental findings required', 'required');

        // unique key and password rules
        $this->form->addFormRule(array(&$this, '_validate_data_entry'));
    }

    function mri_safety_review()
    {
        if (empty($this->identifier) || $this->identifier=="new") {
        	return PEAR::raiseError("NDB_Form_mri_safety::mri_safety_review: Unable to display the form \n");
        }

        $findingsConfirmedOptions = array(null=>"", "In Progress"=>"In Progress", "Included"=>"Scan Normal, Included", "Included_flagged"=>"Included but flagged", "Excluded"=>"Excluded");
    	
        // create DB object
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError("Could not connect to database: ".$db->getMessage());
        }

        // for the reviewer, select candidate profile info to display in the title bar
        $query = "SELECT c.CandID, c.PSCID, s.Visit_label FROM candidate as c, session as s, mri_safety as m WHERE c.CandID = s.CandID AND s.ID=m.SessionID AND m.ID = '".$this->identifier."'";
        $result = array();
        $db->selectRow($query, $result);
        if (PEAR::isError($result)) {
        	return PEAR::raiseError("NDB_Form_mri_safety::_hasAccess".$result->getMessage());
        }
        $this->tpl_data['CandID'] = $result['CandID'];
        $this->tpl_data['PSCID'] = $result['PSCID'];
        $this->tpl_data['Visit_label'] = $result['Visit_label'];
        
        // existing record
        $this->addScoreColumn('Acquisition_date', null);
        $this->addScoreColumn('Check_adverse', null);
        $this->addScoreColumn('Date_review', null);
        $this->addScoreColumn('Check_incidental', null);
        $this->addBasicTextArea('Comment', null, array("cols"=>60, "rows"=>5, "wrap"=>"soft"));
        $this->addSelect('Findings_confirmed', null, $findingsConfirmedOptions);
        $this->addBasicTextArea('Findings_comment', null, array("cols"=>60, "rows"=>5, "wrap"=>"soft"));

        $this->form->addRule('Findings_confirmed', 'Findings Confirmation is required', 'required');
    }

    function _validate_data_entry($values)
    {
        $errors = array();

        // check date of review
        if (empty($values['Date_review']['M']) && empty($values['Date_review']['d']) && empty($values['Date_review']['Y'])) {
            $errors['Date_review'] .= "Date of Review is required. \n";
        } elseif (!_checkDate($values['Date_review'])) {
            $errors['Date_review'] = 'Date of Review is not a valid date';
        }
    
        return $errors;
    }
}
?>
