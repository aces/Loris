<?php
require_once 'NDB_Menu_Filter.class.inc';
require_once 'TimePoint_Flag.class.inc';

/**
* The menu for timepoint flags
*
* this is the GUI front-end to the parameter_flag class. It lists the flags in a user-friendly color-coded way. 
* The module also dislays a form for each record that allows users to review and set flags (ON/OFF), enter comments and mark pending-issues...
* for detailes on methods called by this module:
* @see  TimePoint_Flag.class.inc
* this class contains a custom data form to update flag (records) status and store comments
*
* @package timepoint_flag
*/
class NDB_Menu_Filter_timepoint_flag extends NDB_Menu_Filter
{
    /**
    * array of candIDs that were select using the filter form
    */
    var $subjectFilterArray = array();

    /**
    * array of error flags (per flag/sessionID)
    * @access private
    */
    var $_showDataEntryError = array();

    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        return $user->hasPermission('timepoint_flag') || $user->hasPermission('timepoint_flag_evaluate');
    }

    /**
    * Calls other member functions to do all the work necessary to create the menu
    * Overwriting this menu to call the _save method b/c this menu containg a form
    *
    * @return void
    * @throws PEAR_Error
    * @access public
    */
    function setup()
    {
        // setup the menu's variables
        $success = $this->_save();
        if (PEAR::isError($success)) {
            return PEAR::raiseError("NDB_Menu_Filter::_save(): ".$success->getMessage());
        }

        // setup the menu's variables
        $success = $this->_setupVariables();
        if (PEAR::isError($success)) {
            return PEAR::raiseError("NDB_Menu_Filter::setup() setup: ".$success->getMessage());
        }

        // set the headers if necessary
        if (!is_array($this->headers) || count($this->headers) == 0) {
            foreach ($this->columns as $value) {
                preg_match('/[0-9A-Za-z_]+$/', $value, $match);
                $this->headers[] = $match[0];
            }
        }

        // start the filter form
        $this->form = new HTML_QuickForm('filter');

        // set the filters
        $this->_setupFilters();

        // build the menu
        $success = $this->_build();
        if (PEAR::isError($success)) {
            return PEAR::raiseError("NDB_Menu_Filter::setup() build: ".$success->getMessage());
        }

        return true;
    }

    function _setupVariables()
    {
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // set the class variables
        $columns = array('session.ID AS sessionID', 'session.CenterID AS centerID', 'parameter_timepoint_flag.Flag_name AS flag', 'parameter_timepoint_flag.Flag_label AS flagLabel', 'ft.Name AS flagType', 'fc.CategoryID AS flagCategory');

        // mode switch
        switch ($this->mode) {
            case 'subject':
            $headers = array('flag');
            $this->order_by = 'parameter_timepoint_flag.Flag_name';
            $this->validFilters = array('session.CenterID', 'session.SubprojectID', 'candidate.CandID', 'session.ID');
            break;

            case 'flag':
            default:
            $columns = array_merge($columns, array('psc.Name AS PSC', 'candidate.CandID AS DCCID', 'session.Visit_label'));
            $headers = array('PSC', 'DCCID', 'Visit_label');
            $this->order_by = 'psc.Name, candidate.CandID DESC, session.ID';
            $this->validFilters = array('session.CenterID', 'session.SubprojectID', 'parameter_timepoint_flag.CategoryID', 'parameter_timepoint_flag.Flag_name');
            break;
	    default:
	    $headers = array();
	
        }
        
        // set headers
        $this->headers = array_merge($headers, array('objective', 'status', 'comment', 'last change', 'issues', 'comment on issues', 'triggers', 'review fields'));

        // set the class variables
        $this->columns = array_merge($columns, array('session.SubprojectID', 'parameter_timepoint_flag_session.Flag_status AS status', 'parameter_timepoint_flag_session.Comment AS comment_text', "IF(parameter_timepoint_flag_session.Last_change IS NULL, '', CONCAT(parameter_timepoint_flag_session.Last_change, ' by ', IF(users.Real_name IS NULL, '', users.Real_name))) AS last_change", 'parameter_timepoint_flag_session.Pending_issue as pending_issue', 'parameter_timepoint_flag_session.Comment_pending as comment_pending_text'));

        $this->query = " FROM session, psc, candidate, parameter_timepoint_flag_type as ft, parameter_timepoint_flag_category as fc, parameter_timepoint_flag, parameter_timepoint_flag_session LEFT JOIN users USING(UserID) WHERE session.CandID = candidate.CandID AND candidate.Entity_type = 'Human' AND candidate.Cancelled = 'N' AND candidate.Active = 'Y' AND session.CenterID = psc.CenterID AND session.ID = parameter_timepoint_flag_session.SessionID AND parameter_timepoint_flag_session.Flag_name = parameter_timepoint_flag.Flag_name AND parameter_timepoint_flag_session.TypeID = ft.TypeID AND parameter_timepoint_flag.CategoryID = fc.CategoryID";

        $this->formToFilter = array(
        'centerID' => 'session.CenterID',
        'subject' => array('candidate.CandID', 'session.ID'),
        'subprojectID' => array('session.SubprojectID'),
        'flag' => array('parameter_timepoint_flag.CategoryID', 'parameter_timepoint_flag.Flag_name')
        );

        return true;
    }

    function _setFilterForm()
    {
        $db =& Database::singleton();
        if(PEAR::isError($db)) {
            return PEAR::raiseError("Could not connect to database: ".$db->getMessage());
        }

        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // add the mode select
        $this->form->setDefaults(array('mode' => $this->mode));
        $this->form->addElement('select', 'mode', 'Mode:', array('' => 'Select one', 'subject' => 'Subject', 'flag' => 'Flag'), array("onchange"=>"parameterTimepointFilterForm.submit()"));

        // add the mode select
        $this->form->setDefaults(array('subprojectID' => $this->mode));
        $this->form->addElement('select', 'subprojectID', null, array('%' => 'All', '1' => 'Objective 1', '2' => 'Objective 2'));

        // get the list of study sites - to be replaced by the Site object
        $list_of_sites =& Utility::getSiteList();
        if (PEAR::isError($list_of_sites)) {
            return PEAR::raiseError("DB Error: ".$list_of_sites->getMessage());
        }
        $this->form->addElement('select', 'centerID', 'Site:', array(null=>'All')+$list_of_sites);

        switch ($this->mode) {

            case 'subject':

            $this->form->addElement('select', 'last_change', 'Show Subjects:', array(''=>'All', 'evaluated'=>'With timepoint evaluated', 'reviewed'=>'With all flags reviewed', 'non_reviewed'=>'With non-reviewed flags'), array("onchange"=>"parameterTimepointFilterForm.submit()"));


            // DCCID / Visit
            // this query includes only the subject w/ existing flags
            $query = "SELECT c.CandID, s.Visit_label, s.ID
            FROM candidate AS c, session AS s, parameter_timepoint_flag_session as p
            WHERE c.CandID = s.CandID AND p.SessionID = s.ID AND c.Entity_type = 'Human' AND c.Cancelled = 'N' AND c.Active = 'Y'";
            if (!empty($_REQUEST['centerID'])) $query .= " AND s.CenterID = '".$this->filter['session.CenterID']."'";
            if (!empty($_REQUEST['subprojectID'])) $query .= " AND s.SubprojectID like '".$_REQUEST['subprojectID']."'";
            if ($_REQUEST['last_change'] == 'evaluated') {
                $query .= " AND s.BVLQCExclusion IS NOT NULL"; 
            } elseif ($_REQUEST['last_change'] == 'reviewed') {
                $query .= " AND s.BVLQCExclusion IS NULL AND p.Flag_status IS NOT NULL";
            } elseif ($_REQUEST['last_change'] == 'non_reviewed') {
                $query .= " AND s.BVLQCExclusion IS NULL AND p.Flag_status IS NULL";
            }
            $query .= " GROUP BY c.CandID, s.Visit_label ORDER BY c.CandID DESC, s.Visit_label";

            $db->select($query, $result);
            if (PEAR::isError($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }

            // intialize arrays
            $candIdOptions = array(null => 'Select one');
            foreach ($result as $row) {

                // when selecting subjects w/ all flag reviewed
                // the $result also includes the subjects w/ partially reviewed flags, i.e. some are still NULL
                // check if the current subject/timepoint has any non-reviewed flags and if yes, exclude from array
                if ($_REQUEST['last_change'] == 'reviewed') {
                    $result1 = array();
                    $query = "SELECT COUNT(ID) as count FROM parameter_timepoint_flag_session WHERE SessionID = '".$row['ID']."' AND Flag_status IS NULL GROUP BY SessionID";
                    $db->selectRow($query, $result1);
                    if (PEAR::isError($result1)) {
                        return PEAR::raiseError("DB Error: ".$result1->getMessage());
                    }
                    // skip to next subject/timepoint if there are non-reviewed flags
                    if (!empty($result1['count']) || $result1['count'] > 0) continue;
                }

                // assign subject data
                $candIdOptions[$row['CandID']] = $row['CandID'];
                $visitOptions[$row['CandID']][$row['ID']] = $row['Visit_label'];
                // build the subject array
                $this->subjectFilterArray[] = $row['CandID'];
            }

            $subject =& $this->form->addElement('hierselect', 'subject', 'DCCID / Visit:');
            $subject->setOptions(array($candIdOptions, $visitOptions));

            break;

            case 'flag':
            // Category / Flag
            $query = "SELECT f.Flag_name, f.Flag_label, fc.CategoryID, fc.Name 
            FROM parameter_timepoint_flag AS f, parameter_timepoint_flag_category AS fc 
            WHERE f.CategoryID = fc.CategoryID";
            if (!empty($_REQUEST['subprojectID'])) $query .= " AND f.SubprojectID like '".$this->filter['session.SubprojectID']."'";
            $query .= " ORDER BY fc.Name, f.ID";
            $db->select($query, $result);
            if (PEAR::isError($result)) {
                return PEAR::raiseError("DB Error: ".$result->getMessage());
            }

            foreach ($result as $row) {
                $categoryIdOptions[$row['CategoryID']] = $row['Name'];
                $flagNameOptions[$row['CategoryID']][$row['Flag_name']] = $row['Flag_label'];
            }

            $flag =& $this->form->addElement('hierselect', 'flag', 'Flag:');
            $flag->setOptions(array($categoryIdOptions, $flagNameOptions));

            break;
        }

        return true;
    }

    /*
    * Overload the _getList function so that we can restrict access
    */
    function _getList()
    {
        switch ($this->mode) {
            case 'subject':
            // if the last-selected subject/timepoint is not in the newly filtered list do not return the data list
            if (is_array($this->subjectFilterArray) && in_array($this->filter['candidate.CandID'], $this->subjectFilterArray) && !empty($this->filter['session.ID'])) {
                return parent::_getList();
            }
            break;

            case 'flag':
            if (!empty($this->filter['parameter_timepoint_flag.CategoryID']) && !empty($this->filter['parameter_timepoint_flag.Flag_name'])) {
                return parent::_getList();
            }
            break;
        }

        return array();
    }

    function _setDataTableRows($count)
    {
                
        // when selecting subjects in the filter form
        // if the visit label (SessionID) was not specified, do not select flag data
        if ($_REQUEST['submit'] == 'Show Data' && empty($_REQUEST['subject'][1])) {
            return true;
        }

        // set the pageID
        if (!empty($_REQUEST['pageID'])) {
            $this->tpl_data['pageID'] = $_REQUEST['pageID'];
        }

        // The overall timepoint exclusion flag table
        // display the table only when viewing a subject/timepoint
        if ($_REQUEST['mode']=='subject' && is_array($this->subjectFilterArray) && in_array($this->filter['candidate.CandID'], $this->subjectFilterArray) && !empty($this->filter['candidate.CandID']) && !empty($this->filter['session.ID'])) {
            // display the table
            $success = $this->_displayEvaluateTimepoint($this->filter['session.ID']);
            if (PEAR::isError($success)) {
                return PEAR::raiseError("NDB_Menu_Filter_timepoint_flag::_setDataTableRows: ".$success->getMessage());
            }
        }

        // print out data rows
        $x = 0;
        foreach ($this->list as $item) {

            //count column
            $this->tpl_data['items'][$x][0]['name'] = 'rowCount';
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            // create timepoint flag object
            $timepointFlag =& TimePoint_Flag::singleton($item['sessionID']);
            if (PEAR::isError($timepointFlag)) {
                return PEAR::raiseError("TimePoint Flag Error (".$item['sessionID']."): ".$timepointFlag->getMessage());
            }
            // get the current Excusion QC status, and lock the data table form if the status is set
            $currentStatus = $timepointFlag->getBVLQCExclusion();
            if (PEAR::isError($currentStatus)) {
                return PEAR::raiseError("NDB_Menu_Filter_timepoint::_setDataTableRows: ".$currentStatus->getMessage());
            }

            // set the flag to show the form fields if the exclusion flag was not set
            if (empty($currentStatus)) {
                $this->tpl_data['items'][$x]['showLink'] = 1;
            }
            // raise error flag if the error was captured in _save()
            unset($errorCheck);
            if ($this->_showDataEntryError[$item['flag']][$item['sessionID']]==1) {
                $errorCheck = 1;
            }

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {

                // assign values from the query to the tpl_data array
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;

                if ($key == 'flag') {
                    $type = $timepointFlag->getFlagType($val);
                    $description = $timepointFlag->getFlagDescription($val);
                    if (PEAR::isError($type)) {
                        return PEAR::raiseError("NDB_Menu_Filter_timepoint::_setDataTableRows: ".$type->getMessage());
                    }
                    $this->tpl_data['items'][$x][$i]['class'] = $type;
                }
                // save the class info for the label/item field as well
                if ($key=='flagLabel') {
                	$this->tpl_data['items'][$x][$i]['class'] = $type;
                	$this->tpl_data['items'][$x][$i]['desc'] = $description;
                    unset($description);
                }
                // get the subject info
                if ($key=='DCCID') {
                    if (!is_null($timepointFlag->getBVLQCExclusion())) {
                        $description = "Stage: ".$timepointFlag->getCurrentStage();
                        $description .= " - ".$timepointFlag->getCurrentStatus();
                        $description .= "; Excl. Review: ".$timepointFlag->getBVLQCExclusion();
                    }
                    $this->tpl_data['items'][$x][$i]['desc'] = $description;
                    unset($description);
                }

                // if the errors were reported
                if ($errorCheck==1) {

                    // overwrite the values for the Status and Pending_issue field to preserve passed values
                    if (in_array($key, array('status', 'pending_issue'))) {
                        $this->tpl_data['items'][$x][$i]['value'] = $_REQUEST['dataSet'][$item['flag']][$item['sessionID']][$key];
                    }
                    // add error msg is status is set to OFF w/o comment
                    if ($key=='comment_text') {
                        $this->tpl_data['items'][$x][$i]['errorMessage'] = "Comment missing, flag status not saved";
                        // preserve new comment entry
                        $this->tpl_data['items'][$x][$i]['comment_text_new'] = $_REQUEST['dataSet'][$item['flag']][$item['sessionID']]['comment_text_new'];
                    }
                    if ($key=='comment_pending_text') {
                        // preserve new comment entry
                        $this->tpl_data['items'][$x][$i]['comment_pending_text_new'] = $_REQUEST['dataSet'][$item['flag']][$item['sessionID']]['comment_pending_text_new'];
                    }
                }   
                $i++;
            }

            // set the flag name
            $flag = ($this->mode == 'subject') ? $item['flag'] : $this->filter['parameter_timepoint_flag.Flag_name'];

            // get flag triggers
            $triggers = $timepointFlag->getFlagTriggersFieldValues($flag);
            if (PEAR::isError($triggers)) {
                return PEAR::raiseError("NDB_Menu_Filter_timepoint::_setDataTableRows(): ".$triggers->getMessage());
            }

            // add trigger columns
            $j = 0;
            $this->tpl_data['items'][$x][$i]['name'] = 'triggers';
            foreach ($triggers as $key => $value) {
                $this->tpl_data['items'][$x][$i]['headers'][$j] = $key;
                $this->tpl_data['items'][$x][$i]['items'][$j] = $value;
                $j++;
            }

            // next item
            $i++;

            // get flag review fields
            $reviewFields = $timepointFlag->getFlagReviewFieldsValues($flag);
            if (PEAR::isError($reviewFields)) {
                return PEAR::raiseError("NDB_Menu_Filter_timepoint::_setDataTableRows: ".$reviewFields->getMessage());
            }

            // add review field columns
            $j = 0;
            $this->tpl_data['items'][$x][$i]['name'] = 'review fields';
            if (is_array($reviewFields) && count($reviewFields) > 0) {
                foreach ($reviewFields as $key => $value) {
                    $this->tpl_data['items'][$x][$i]['headers'][$j] = $key;
                    $this->tpl_data['items'][$x][$i]['items'][$j] = $value;
                    $j++;
                }
            }

            $x++;
        }

        return true;
    }


    /**
    * saves form entries
    * checks the form element and if the status was set/changed updates the record
    *
    * @return void
    * @throws PEAR_Error
    * @access public
    */
    function _save()
    {
        $user =& User::singleton();
        if (PEAR::isError($user)) {
            return PEAR::raiseError($user->getMessage());
        }
        $userID = $user->getUsername();


        // save timepoint evaluation
        if (isset($_REQUEST['setBVLQCExclusionFlag'])) {

            //timepoint object
            $timepointFlag =& TimePoint_Flag::singleton($_REQUEST['setBVLQCExclusionFlag_SessionID']);
            if (PEAR::isError($timepointFlag)) {
                return PEAR::raiseError("Timepoint_Flag error: ".$timepointFlag->getMessage());
            }

            $success = $timepointFlag->setBVLQCExclusion($_REQUEST['setBVLQCExclusionFlag']);
            if (PEAR::isError($success)) {
                return PEAR::raiseError("NDB_Menu_Filter_timepoint_flag::_save: ".$success->getMessage());
            }
        }

        /**
        * data rows
        */
        // array with data passed from the form
        $dataSet = $_REQUEST['dataSet'];

        // skip the save if nothing is submitted
        if (!is_array($dataSet) && count($dataSet) == 0) {
            return true;
        }

        foreach ($dataSet as $flagName => $timepoints) {
            foreach ($timepoints as $sessionID => $record) {

                $currentFlagInfo = $this->_getCurrentFlagInfo($sessionID, $flagName);
                if (PEAR::isError($currentFlagInfo)) {
                    return PEAR::raiseError("NDB_Menu_Timepoint_Flag::_save: ".$currentFlagInfo->getMessage());
                }

                // reset the array element
                unset($this->_showDataEntryError[$flagName][$sessionID]);
                unset($newComment);
                unset($newStatus);
                unset($newPending);
                unset($newPendingComment);

                // if no comment and no new status, skip to next, do not update
                if ((empty($record['status']) || $record['status']==$currentFlagInfo['Flag_status'])
                && empty($record['comment_text_new']) && $record['comment_text']==$currentFlagInfo['Comment']
                && empty($record['comment_pending_text_new']) && $record['comment_pending_text']==$currentFlagInfo['Comment_pending']
                && (empty($record['pending']) || $record['pending']==$currentFlagInfo['Pending_issue'])) {
                    continue;
                }

                if (!empty($record['status']) && $record['status']!=$currentFlagInfo['Flag_status']) {
                    // comment has to be entered when setting the flag to ON
                    if (empty($record['comment_text_new']) && $record['status'] == 'OFF') {
                        // raise the error flag and skip the update
                        $this->_showDataEntryError[$flagName][$sessionID] = 1;
                        continue;
                    }
                    // set the status to NULL
                    if ($record['status']=='NULLme') $newStatus = TIMEPOINT_FLAG_NULL_STATUS;
                    // set the new status
                    else $newStatus = $record['status'];
                }
                if (!empty($record['pending_issue']) && $record['pending_issue']!=$currentFlagInfo['Pending_issue']) {
                    $newPending = $record['pending_issue'];
                }

                if (!empty($record['comment_text_new']) || $record['comment_text']!=$currentFlagInfo['Comment']) {
                    $newComment  = "[".$user->getData('Real_name')."] ";
                    if (!empty($record['comment_text_new'])) $newComment .= $record['comment_text_new']."; ";
                    $newComment .= $record['comment_text'];
                }
                if (!empty($record['comment_pending_text_new'])) {
                    $newPendingComment  = "[".$user->getData('Real_name')."] ";
                    if (!empty($record['comment_pending_text_new'])) $newPendingComment .= $record['comment_pending_text_new']."; ";
                    $newPendingComment .= $currentFlagInfo['Comment_pending'];
                }

                //  timepoint flag object
                $timepointFlag = TimePoint_Flag::singleton($sessionID);
                if (PEAR::isError($timepointFlag)) {
                    return PEAR::raiseError("TimePoint_Flag error: ".$timepointFlag->getMessage());
                }

                // update the flag record
                $success = $timepointFlag->updateFlag($flagName, $userID, $newStatus, $newComment, $newPending, $newPendingComment);
                if (PEAR::isError($success)) {
                    return PEAR::raiseError("NDB_Menu_Timepoint_Flag::_save: ".$success->getMessage());
                }
            }
        }

        return true;
    }

    /**
    * returns the flag's current info
    * @param int SessionID
    * @param string name of the flag
    * @return array flag info
    * @throws PEAR_error
    * @access private
    */
    function _getCurrentFlagInfo($sessionID, $flagName)
    {
        // get the current flag info
        $currentFlag = TimePoint_Flag::getFlag($sessionID, $flagName);
        if (PEAR::isError($currentFlag)) {
            return PEAR::raiseError("NDB_Menu_Filter_timepoint::_checkFlagCurrentStatus(): ".$currentFlag->getMessage());
        }
        return $currentFlag;
    }

    /**
    * generates tpl_data elements for the talbe with the flag to evaluate timepoint exclusions
    * @return bool
    * @access private
    * @throws PEAR_Error
    */
    function _displayEvaluateTimepoint($sessionID)
    {
        $hasAccess = $this->_hasAccess_EvaluateTimepoint();
        if (PEAR::isError($hasAccess)) {
            return PEAR::raiseError("NDB_Menu_Filter_timepoint_flag::_displayEvaluateTimepoint: ".$hasAccess->getMessage());
        }

        // timepoint object
        $timepointFlag =& TimePoint_Flag::singleton($sessionID);
        if (PEAR::isError($timepointFlag)) {
            return PEAR::raiseError("Timepoint_Flag error: ".$timepointFlag->getMessage());
        }

        // pass the sessionID
        $this->tpl_data['timepoint_flag_evaluate_ID'] = $sessionID;

        // get the current Excusion QC status, and lock the data table form if the status is set
        $currentStatus = $timepointFlag->getBVLQCExclusion();
        if (PEAR::isError($currentStatus)) {
            return PEAR::raiseError("NDB_Menu_Filter_timepoint::_displayEvaluateTimepoint: ".$currentStatus->getMessage());
        }
        // lock the data table form if the status is set
        if (!empty($currentStatus)) {
            $this->tpl_data['timepoint_flag_evaluate_lock_data'] = true;
        }

        // show links only if user has proper privileges and all flags are reviewed
        if ($hasAccess) {
            // set access privileges
            $showLinks = 1;
            // get the list of flag for the timepoint
            $list = $timepointFlag->getTimepointFlags();
            if (PEAR::isError($list)) {
                return PEAR::raiseError("NDB_Menu_Filter_timepoint::_displayEvaluateTimepoint: ".$list->getMessage());
            }

            foreach ($list as $val) {
                if (empty($val['Flag_status'])) unset($showLinks);
            }
            unset($list);
        }

        $i = 0;
        foreach ($timepointFlag->getBVLQCExclusionStatusList() as $status) {
            // set the label and icon
            $this->tpl_data['timepoint_flag_evaluate'][$i]['value'] = $status;
            $this->tpl_data['timepoint_flag_evaluate'][$i]['label'] = (empty($status)) ? 'Not Done' : $status;
            if ($status == $currentStatus) {
                $this->tpl_data['timepoint_flag_evaluate'][$i]['icon'] = 'selected';
            } else {
                if (!empty($showLinks)) {
                    // show links only when viewing a subject/timepoint w/ all flags viewed
                    $this->tpl_data['timepoint_flag_evaluate'][$i]['icon'] = 'default';
                    // show links for nonselected options only if the type was selected
                    $this->tpl_data['timepoint_flag_evaluate'][$i]['showlink'] = true;
                }
            }
            $i++;
        }

        return $hasAccess;
    }

    /**
    * returns true if the user has a permission to evaluate timepoint overall exclusion
    * @return bool
    * @throws PEAR_Error
    */
    function _hasAccess_EvaluateTimepoint()
    {
        // create user object
        $user =& User::singleton();
        if(PEAR::isError($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        return $user->hasPermission('timepoint_flag_evaluate');
    }
}
?>
