<?php
require_once 'NDB_Menu_Filter.class.inc';

/**
 * The menu for user accounts
 *
 * this menu can be accessed from several locations, so the _setup
 * @package mri
 * @subpackage NIHPD
 */
class NDB_Menu_Filter_mri_safety extends NDB_Menu_Filter
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        // everyone has access to the menu
        return ($this->_hasDataEntryAccess($user->getData('CenterID')) || $this->_hasReviewAccess());
    }

    function _hasDataEntryAccess($centerID=null)
    {
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        // only data entry personnel can access the form
        return ($user->hasPermission('data_entry') && $user->getData('CenterID') == $centerID);
    }

    function _hasReviewAccess()
    {
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        // only users with this permission can access the review part of the form
        return $user->hasPermission('mri_safety');
    }


    function _setFilterForm()
    {
        if (!empty($_REQUEST['candID'])) {
            return true;
        }
        
        // grant access
        $this->tpl_data['showFilterForm']=true;

        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // PSC
        if ($user->hasPermission('mri_safety')) {
            // get the list of study sites
            $list_of_sites =& Utility::getSiteList();
            if(PEAR::isError($list_of_sites)) {
                return PEAR::raiseError("DB Error: ".$list_of_sites->getMessage());
            }
            if(is_array($list_of_sites)) $list_of_sites = array('' => 'Any') + $list_of_sites;
        } else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if (PEAR::isError($site)) {
                return PEAR::raiseError("DB Error: ".$site->getMessage());
            }
            if ($site->isStudySite()) {
                $list_of_sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        $findingsConfirmedOptions = array(null=>"", "In Progress"=>"In Progress", "Included"=>"Scan Normal, Included", "Included_flagged"=>"Included but flagged", "Excluded"=>"Excluded");

        // add form elements
        $this->form->addElement('select', 'centerID', 'Site:', $list_of_sites);
        $this->form->addElement('text', 'DCCID', 'DCC-ID:', 'maxlength=6');
        $this->form->addElement('text', 'PSCID', 'PSC-ID:', 'maxlength=7');
        $this->form->addElement('select', 'reported', null, array(null=>'', 'Y'=>'Yes'));
        $this->form->addElement('select', 'findings_confirmed', null, $findingsConfirmedOptions);
        $this->form->addElement('text', 'acquisition_date', null);

        return true;
    }

    function _setupVariables()
    {
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $this->headers = array('Action', 'PSC', 'DCCID', 'PSCID', 'Visit_label', 'Acquisition_date', 'Review_date', 'Adverse_events', 'Incidental_findings', 'DCC_comment', 'Medical_review', 'Reviewers_comment');
        // common/shared columns
        $this->columns = array("IF(mri_safety.ID IS NULL, 'new', mri_safety.ID) AS RecordID", 'session.CenterID', 'session.ID as SessionID', "IF((mri_safety.Check_adverse='Y' OR mri_safety.Check_incidental='Y'), 'Y', 'N') AS Reported", "'' AS Action", 'psc.Name AS PSC', 'candidate.CandID AS DCCID', 'candidate.PSCID AS PSCID', 'session.Visit_label', "DATE_FORMAT(mri_safety.Acquisition_date, '%Y-%m-%d') AS Acquisition_date", "DATE_FORMAT(mri_safety.Date_review, '%Y-%m-%d') AS Review_date", 'mri_safety.Check_adverse as Adverse_events', 'mri_safety.Check_incidental AS Incidental_findings', 'mri_safety.Comment as DCC_comment', 'mri_safety.Findings_confirmed as Medical_review', 'mri_safety.Findings_comment as Reviewers_comment');
        
        $this->group_by = 'candidate.CandID, session.ID';
        $this->order_by = 'psc.Name, candidate.CandID, session.Visit_label';

        if (!empty($_REQUEST['candID'])) {

            // when inside the candidate profile
            $this->columns = array_merge(array("DATE_FORMAT(parameter_file.Value, '%Y-%m-%d') AS Scan_date"),$this->columns);
            $this->group_by .= ",DATE_FORMAT(parameter_file.Value, '%Y-%m-%d')";
            $this->order_by .= ",DATE_FORMAT(parameter_file.Value, '%Y-%m-%d')";
            // the base query, select records for all existing dates of acquisition
            $query = " FROM
            psc,
            candidate
            LEFT JOIN session USING (CandID) 
            LEFT JOIN files ON (session.ID=files.SessionID) 
            LEFT JOIN parameter_file USING (FileID) 
            LEFT JOIN parameter_type USING (ParameterTypeID) 
            LEFT JOIN mri_safety ON (session.ID = mri_safety.SessionID AND DATE_FORMAT(parameter_file.Value, '%Y-%m-%d')=mri_safety.Acquisition_date) 
            WHERE 
            psc.CenterID = session.CenterID AND candidate.Active='Y' AND session.Active='Y' AND session.Cancelled='N' AND candidate.Entity_type='Human' 
            AND parameter_file.ParameterTypeID = 29 AND DATE_FORMAT(parameter_file.Value, '%Y-%m-%d')<> '0000-00-00' AND parameter_file.Value IS NOT NULL
            AND candidate.CandID = '".$_REQUEST['candID']."' ";

        } else {

            $this->validFilters = array('session.CenterID', 'candidate.CandID', 'candidate.PSCID', 'mri_safety.Acquisition_date', 'mri_safety.Findings_confirmed', "IF((mri_safety.Check_adverse='Y' OR mri_safety.Check_incidental='Y'), 'Y', 'N')");
            $this->group_by .= ',mri_safety.Acquisition_date';
            $this->order_by .= ',mri_safety.Acquisition_date';
            $this->formToFilter = array(
            'centerID' => 'session.CenterID',
            'DCCID' => 'candidate.CandID',
            'PSCID' => 'candidate.PSCID',
            'acquisiton_date' => 'mri_safety.Acquisition_date',
            'findings_confirmed' => 'mri_safety.Findings_confirmed',
            'reported' => "IF((mri_safety.Check_adverse='Y' OR mri_safety.Check_incidental='Y'), 'Y', 'N')"
            );
            // the base query, select existing records only
            $query = " FROM
            psc,
            candidate
            LEFT JOIN session USING (CandID) 
            LEFT JOIN mri_safety ON (session.ID = mri_safety.SessionID) 
            WHERE
            psc.CenterID = session.CenterID 
            AND candidate.Active='Y' AND session.Active='Y' AND session.Cancelled='N' AND candidate.Entity_type='Human'
            AND mri_safety.ID IS NOT NULL
            ";
        }
        
        $this->query = $query;
        return true;
    }

    /*
    * Overload the _getList function so that we can restrict access
    */
    function _getList()
    {
        // if the last-selected subject/timepoint is not in the newly filtered list do not return the data list
        if (!empty($_REQUEST['candID'])) {
            return parent::_getList();
        }

        if (is_array($this->filter) && count($this->filter)>0) {
            return parent::_getList();
        }

        return array();
    }

    /**
    * Sets the template data for the data table's rows
    *
    * @note            Can be overloaded
    * @param  int      Page offset
    * @return void
    * @access private
    */
    function _setDataTableRows($count)
    {
        // print out
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                // only pass the selected columns to the tpl array
                if (!in_array($key, $this->headers)) continue;

                $this->tpl_data['items'][$x][$i]['name'] = $key;

                //primary identifier for the form
                $identifier = $item['RecordID'];

                if ($key == 'Action') {
                    
                    if ($this->_hasDataEntryAccess($item['CenterID'])) {

                        // test for new, non-existent form
                        if ($item['RecordID']=="new") {
                        	$actionDisplay = "Add[".$item['Scan_date']."]";
                        	$identifier .= "&acquisition_date=".$item['Scan_date']."&mriSafetyCandID=".$item['DCCID']."&mriSafetySessionID=".$item['SessionID'];
                        } else {
                        	$actionDisplay = "Edit";
                        }
                        // when accessing from the profile
                        if (!empty($_REQUEST['candID'])) {
                        	$identifier .= "&candID=".$_REQUEST['candID'];
                        }
                        
                        // construct the URL for data entry access link
                        $this->tpl_data['items'][$x][$i]['value'] .= "<a href='main.php?test_name=mri_safety&subtest=mri_safety_data_entry&identifier=$identifier'>$actionDisplay</a>";
                        
                    }
                    
                    // if the user has the review access, display the link to the review form
                    if (($item['Incidental_findings']=='Y' || $item['Adverse_events']=='Y') && $this->_hasReviewAccess()) {
                        if (!empty($this->tpl_data['items'][$x][$i]['value'])) {
                            $this->tpl_data['items'][$x][$i]['value'] .= " | ";
                        }
                        $this->tpl_data['items'][$x][$i]['value'] .= "<a href='main.php?test_name=mri_safety&subtest=mri_safety_review&identifier=$identifier'>Review</a>";
                    }
                    
                } else {
                    $this->tpl_data['items'][$x][$i]['value'] = $val;
                }
                
                //unset vars
                unset($actionDisplay);
                unset($identifier);

                $i++;
            }
            $x++;
        }

        return true;
    }
}
?>