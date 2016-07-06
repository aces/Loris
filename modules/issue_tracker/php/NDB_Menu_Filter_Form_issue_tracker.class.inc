<?php

/**
 * This class features the code for the menu portion of the Loris issue
 * tracker.
 *
 * PHP Version 5
 *
 *  @category   Behavioural
 *  @package    Main
 *  @subpackage Tools
 *  @author     Caitrin Armstrong <caitrin.armstrong@mail.mcgill.ca
 *  @license    @GPLv3
 *  @link       https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Provides the PHP code for the menu filter for the issue tracker
 *
 *  @category   Behavioural
 *  @package    Main
 *  @subpackage Tools
 *  @author     Caitrin Armstrong <caitrin.armstrong@mail.mcgill.ca>
 *  @license    @GPLv3
 *  @link       https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Menu_Filter_Form_Issue_Tracker extends NDB_Menu_Filter_Form
{
    //aka building-table-using-react module
    var $AjaxModule = true;

    /**
     * Set up the variables required by NDB_Menu_Filter class for constructing
     * a query
     *
     * @return null
     */
    function _setupVariables()
    {

        //adding gratuitous first statement in the where because I have nothing else to say
        //and as it stands I want everything
        $this->query = " FROM issues as i LEFT JOIN candidate c ON (i.candID=c.CandID) LEFT JOIN psc p ON (i.centerID=p.CenterID) WHERE i.status != 'closed'";

        $user =& User::singleton();
        $DB = Database::singleton();
        if (!$user->hasPermission('issue_tracker_view_allsites')) {
            $this->query .= " AND i.centerID=" . $DB->quote($user->getCenterID());
        }

        //TODO: change field names and add project into things
        //note that this needs to be in the same order as the headers array
        $this->columns = array(
            'i.issueID as Issue_ID',
            'p.Name as Site',
            'c.PSCID as PSCID',
            'i.candID as DCCID',
            'i.visitLabel as Visit_Label',
            'i.reporter as Reporter',
            'i.assignee as Assignee',
            'i.status as Status',
            'i.priority as Priority',
            'i.lastUpdate as Last_Update',
            'i.comment as Comment_Preview'
        );

        //TODO: figure out if you want to initially group by id or dateUodated
        $this->order_by = 'i.issueID DESC';
        $this->group_by = 'i.issueID'; //aka don't want to group by anything, right?
        //NDB filter will remove underscores
        $this->headers = array(
            'Issue_ID',
            'Site',
            'PSCID',
            'DCCID',
            'Visit_Label',
            'Reporter',
            'Assignee',
            'Status',
            'Priority',
            'Last_Update',
            'Comment_Preview'
        );
       
        $this->validFilters = array(
            'i.issueID',
            'c.PSCID',
            'i.visitLabel',
            'i.candID',
            'i.reporter',
            'i.assignee',
            'i.centerID',
            'watching',
            'i.status',
            'includeClosed',
            'i.projectID',
            'i.priority'
        );

        $this->formToFilter = array(
            'issueID' =>'i.issueID',
            'PSCID' => 'c.PSCID',
            'visitLabel' => 'i.visitLabel',
            'DCCID' => 'i.candID',
            'reporter' => 'i.reporter',
            'assignee' =>'i.assignee',
            'site' =>'i.centerID',
            'watching' =>'watching',
            'status' =>'i.status',
            'includeClosed' => 'includeClosed',
            'projectID' => 'i.projectID',
            'priority' => 'i.priority'
        );
        //TODO: figure out wtf this is for
        //$this->EqualityFilters = array('f.AcquisitionProtocolID');
        $this->EqualityFilters = array('i.issueID', 'i.centerID');
        $this->searchKeyword    = array();

        //TODO: and this
        $this->tpl_data['numTimepoints'] = 0;

    }

    /**
     * Setup $this->tpl_data for use by Smarty
     *
     * @return null
     */
    function _setFilterForm()
    {
        $user =& User::singleton();
        $DB = Database::singleton();

        if ($user->hasPermission('issue_tracker_view_allsites')) {
            // get the list of study sites - to be replaced by the Site object
            $list_of_sites = Utility::getSiteList();
            if(is_array($list_of_sites)) $list_of_sites = array('' => 'All') + $list_of_sites;
        }
        else {
            // allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if ($site->isStudySite()) {
                $list_of_sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        //could upgrade this to add "meee" at the top
        $reporters = array('' => 'All');
        $assignees = array('' => 'All');
        $reporter_expanded = $DB->pselect(
            "SELECT u.Real_name FROM issues i LEFT JOIN users u ON(i.reporter=u.UserID)",
            array()
        );
        foreach ($reporter_expanded as $r_row) {
            $reporter                   = $r_row['Real_name'];
            $reporters[$reporter] = $reporter;
        }

        $assignee_expanded = $DB->pselect(
            "SELECT u.Real_name FROM issues i LEFT JOIN users u ON(i.assignee=u.UserID)",
            array()
        );
        foreach ($assignee_expanded as $a_row) {
            $assignee                   = $a_row['Real_name'];
            $assignees[$assignee] = $assignee;
        }

        $statuses = array(
            '' => 'All',
            'new' => 'New',
            'acknowledged' => 'Acknowledged',
            'assigned' => 'Assigned',
            'resolved' => 'Resolved',
            'closed' => 'Closed'
        );

        $priorities = array(
            '' => 'All',
            'low' => 'Low',
            'normal' => 'Normal',
            'high' => 'High',
            'urgent' => 'Urgent'
        );
        $allAr = array('' => 'All');

        $this->addBasicText('issueID', 'Issue ID', array("size"=>10,"maxlength"=>25));
        $this->addBasicText('PSCID', 'PSCID', array("size"=>10,"maxlength"=>25));
        $this->addBasicText(
            'DCCID', 'DCCID', array('size' => 10, "maxlength" => 25)
        );
        $this->addBasicText(
            'visitLabel', 'Visit Label', array('size' => "5", "maxlength"=>"15")
        );

        $config =& NDB_Config::singleton();
        if ($config->getSetting('useProjects') === "true") {
            $list_of_projects = $allAr;
            $projectList = Utility::getProjectList();
            foreach ($projectList as $key => $value) {
                $list_of_projects[$key] =$value;
            }
            $this->addSelect('ProjectID', 'Project', $list_of_projects);
        }

        $this->addSelect('site', 'Site', $list_of_sites);
        $this->addSelect('reporter','Reporter', $reporters);
        $this->addSelect('assignee','Assignee', $assignees);
        $this->addSelect('status','Status', $statuses);
        $this->addSelect('priority','Priority', $priorities);


        //this will probably not be hooked up properly
        $this->addCheckbox('watching', 'Watching', array('value' => '1'));
        $this->addCheckbox('includeClosed', 'Include Closed', array('value' => '1'));

        $this->tpl_data['backURL'] = $_SERVER['REQUEST_URI'];
    }


    /**
     * Overwrites the function to add a customized filter
     * for Pending and New
     *
     * @param string $prepared_key filter key
     * @param string $field        filter field
     * @param string $val          filter value
     *
     * @return null
     */
    function _addValidFilters($prepared_key, $field, $val)
    {
        error_log($field . $val);
        $user =& User::singleton();
        $query = '';
        if ((!empty($val) || $val === '0') && $field != 'order') {
            if ($field != 'watching' && $field !='includeClosed') {
                if (in_array($field, $this->CheckboxFilters) && $val) {
                    $query .= " AND $field";
                } elseif (strtolower(substr($field, -8)) == 'centerid'
                        || strtolower(substr($field, -10)) == 'categoryid'
                        || strtolower(substr($field, -6)) == 'gender'
                        || (isset($this->EqualityFilters)
                        && in_array($field, $this->EqualityFilters))
                        ) {
                    $query .= " AND $field = :v_$prepared_key";
                    // $qparams["v_$prepared_key"] = $val;
                } else {
                    $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
                }
            } else if ($field == 'includeClosed' && $val == 1) {
                $query .= " OR i.status = 'closed'";
            }
            } else if ($field == 'watching' && $val ==1) { //double check this
                  $query .= " AND i.issueID in (SELECT issueID FROM issues_watching WHERE userID=" . $user->getData('CenterID') .")";
            }
        return $query;
    }


    /**
     * Include the column formatter
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies() {
        $factory = NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        return array_merge(
            parent::getJSDependencies(),
            array(
                $baseurl . "/issue_tracker/js/columnFormatter.js"
            )
        );
    }
}
