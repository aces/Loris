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

require_once __DIR__ . '/Imaging_Session_ControlPanel.class.inc';
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
    var $AjaxModule = false;
    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        $user =& User::singleton();

        // allow only to view own site data
        $site =& Site::singleton($user->getData('CenterID'));

        return ($user->hasPermission('issue_tracker_view_allsites') || ($site->isStudySite() && $user->hasPermission('issue_tracker_view_site')));
    }

    /**
     * Determine whether the user has permission to assign issues
     *
     * @return bool whether the user has the ability
     */
    function canAssign()
    {
        $user =& User::singleton();

        return ($user->hasPermission('issue_tracker_can_assign'));
    }

    /**
     * Determine whether the user has permission to change issue status
     *
     * @return bool whether the user has the ability
     */
    function canChangeStatus()
    {
        $user =& User::singleton();

        return ($user->hasPermission('issue_tracker_change_status'));
    }

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
        $this->query = " FROM issues as i
            LEFT JOIN candidate c ON (i.candID=c.CandID)
            LEFT JOIN psc p ON (i.centerID=p.CenterID)
            WHERE issueID != NULL";

        $user =& User::singleton();
        $DB = Database::singleton();
        if (!$user->hasPermission('issue_tracker_view_allsites')) {
            $this->query .= " AND i.centerID=" . $DB->quote($user->getCenterID());
        }

        $this->columns = array(
            'i.issueID as Issue_ID',
            'c.PSCID as PSCID',
            'i.visitLabel as Visit_Label',
            'i.candID as DCCID',
            'i.reporter as Reporter',
            'i.assignee as Assignee',
            'p.Name as Site',
            'i.status as Status',
            'i.lastUpdate as Last_Update',
            'i.comment as Comment_Preview',
            'i.priority as Priority'
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
            'Last_Update',
            'Comment_Preview',
            'Priority'
        );
       
        $this->validFilters = array(
            'i.issueID',
            'c.PSCID',
            'i.visitLabel',
            'i.candID',
            'i.reporter',
            'i.assignee',
            'p.Name',
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
            'site' =>'p.Name',
            'watching' =>'watching',
            'status' =>'i.status',
            'includeClosed' => 'includeClosed',
            'projectID' => 'i.projectID',
            'priority' => 'i.priority'
        );
        //TODO: figure out wtf this is for
        //$this->EqualityFilters = array('f.AcquisitionProtocolID');
        $this->EqualityFilters = array(i.issueID);
        $this->searchKeyword    = array();

        //TODO: and this
        $this->tpl_data['numTimepoints'] = 0;

        // This variable will be used by the columnFormatter javascript
        // to set the default hidden columns in the data table.
//        $this->tpl_data['hiddenHeaders'] = json_encode(
//            array_map(
//                function ($header) {
//                        return ucwords(str_replace('_', ' ', $header));
//                },
//                array('sessionID')
//            )
//        );
    }

    /**
     * Setup $this->tpl_data for use by Smarty
     *
     * @return null
     */
    function _setFilterForm()
    {
        // create user object
        $user =& User::singleton();
        
        // PSC
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

        //could upgrade this to add "meee"
        $reporters = array('' => 'All');
        $assignees = array('' => 'All');
        $reporter_expanded = $DB->pselect(
            "SELECT u.Real_name FROM issues i LEFT JOIN users u ON(i.reporter=u.UserID)",
            array()
        );
        foreach ($reporter_expanded as $r_row) {
            $reporter                   = $r_row['reporter'];
            $reporters[$reporter] = $reporter;
        }
        $assignee_expanded = $DB->pselect(
            "SELECT u.Real_name FROM issues i LEFT JOIN users u ON(i.assignee=u.UserID",
            array()
        );
        foreach ($assignee_expanded as $a_row) {
            $assignee                   = $a_row['assignee'];
            $assignees[$assignee] = $assignee;
        }
        $statuses = array(
            'new' => 'New',
            'acknowledged' => 'Acknowledged',
            'assigned' => 'Assigned',
            'resolved' => 'Resolved',
            'closed' => 'Closed'
        );

        $priorities = array(
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
            'visitLabel', 'Visit Label', array('size' => "10", "maxlength"=>"25")
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


    //TODO: change this instead to be watching and new and include_closed
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
            } else if ($field == 'includeClosed' && $val != 1) {
                $query .= " AND i.status!='closed'";
            }
            } else if ($field == 'watching' && $val ===1) { //double check this
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
