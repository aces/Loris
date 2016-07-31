<?php
/**
 * Issue tracker
 *
 * Handles issue edits and returns data in response to a front end issue call.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Media
 * @author   Caitrin Armstrong <caitrin.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action == "getData") {
        echo json_encode(getIssueFields());
    }else if ($action == "edit"){
        echo editIssue();
    }
}

/**
 * Edits an issue.
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editIssue()
{
    $db   =& Database::singleton();
    $user =& User::singleton();

    //maybe check for some kind of permission here. otherwise delete that utility method.

    // Process posted data
    $issueID     = isset($_POST['issueID']) ? $_POST['issueID'] : null;
    $assignee    = isset($_POST['assignee']) ? $_POST['assignee'] : null;
    $status   = isset($_POST['status']) ? $_POST['status'] : null;
    $priority   = isset($_POST['priority']) ? $_POST['priority'] : null;
    $candID   = isset($_POST['PSCID']) ? $_POST['PSCID'] : null; //TODO: deal with adding DCCID
    $visitLabel   = isset($_POST['visitLabel']) ? $_POST['visitLabel'] : null;
    $centerID   = isset($_POST['centerID']) ? $_POST['centerID'] : null;
    $title = isset($_POST['title']) ? $_POST['title'] : null;
    $category = isset($_POST['category']) ? $_POST['category'] : null;
    $module = isset($_POST['module']) ? $_POST['module'] : null;


    $issueValues = [
        'assignee'   => $assignee,
        'status'     => $status,
        'priority'   => $priority,
        'candID'     => $candID,
        'visitLabel' => $visitLabel,
        'centerID'   => $centerID,
        'title'      => $title,
        'category'   => $category,
        'module'     => $module
    ];

    if (isset($issueID)) {
        $db->update('issue_tracker', $issueValues, ['issueID' => $issueID]);
    }
    else {
        $issueValues['reporter'] = $user->getData['UserID'];
        $issueValues['dateCreated'] = date('Y-m-d H:i:s'); //because mysql 5.56 //todo: check that this works.

        $db->insert('issue_tracker', $issueValues);
        $issueID = $db->getLastInsertId();
    }

    $issueValues['comments'] = updateComments($issueValues, $issueID);

    return $issueID;
}

function getChangedValues(){

    //here find the changed values that you want to add to the comment stream, or to the comment table. I think now you should have a comment table.
    //although you'd have to do a join everytime.
}

function updateComments() {

}

function getComments() {
    
    
}

/**
 * Returns a list of fields from database
 *
 * @return array
 * @throws DatabaseExceptionr
 */
function getIssueFields()
{

    $db =& Database::singleton();
    $user =& User::singleton();

    if ($user->hasPermission('issue_tracker_view_allsites')) {
        // get the list of study sites - to be replaced by the Site object
        $sites = Utility::getSiteList();
        if(is_array($sites)) $sites = array('' => 'All') + $sites;
    }
    else {
        // allow only to view own site data
        $site =& Site::singleton($user->getData('CenterID'));
        if ($site->isStudySite()) {
            $sites = array($user->getData('CenterID') => $user->getData('Site'));
            $sites[''] = 'All';
        }
    }

    $assignees = array('' => 'All');
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
        'urgent' => 'Urgent',
        'immediate' => 'Immediate'
    );

    $categories = array(
        '' => 'All',

    );
    $modules = $db->pselect(
        "SELECT Label FROM LorisMenu ORDER BY Label",
        []
    );

    //$visitList       = Utility::getVisitList();

    $issueData = null;
    if (isset($_GET['issueID'])) {
        $issueID = $_GET['issueID'];
        $issueData   = $db->pselectRow(
            "SELECT * FROM issue_tracker WHERE id = $issueID", //TODO: you actually need to join on candidate. and on site and call it site. also maybe watching
            []
        );
        $issueData['comment'] = getComments($issueID);
    }else{
        $issueData['reporter'] = $user->getData['UserID']; //these are what need to be displayed upon creation of a new issue, but before the user has saved it. the user cannot change these values.
        $issueData['dateCreated'] = date('Y-m-d H:i:s');
    }

    //temporary
        $issueData['PSCID'] = 123;
        $issueData['DCCID'] = 123;
        $issueData['site'] = 'DCC';

    $result = [
        'assignees' => $assignees,
        'sites' => $sites,
        'statuses' => $statuses,
        'priorities' => $priorities,
        'categories' => $categories,
        'modules' => $modules,
        'issueData'   => $issueData,
        'hasEditPermission' => $user->hasPermission('issue_tracker_can_assign'); @//todo: fix this when you decide on new permissions.
    ];

    return $result;
}