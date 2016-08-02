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
        error_log("here");
        error_log(json_encode(getIssueFields()));
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

    error_log("post assignee");
    error_log($_POST['assignee']);
    // Process posted data
    $issueID     = isset($_POST['issueID']) ? $_POST['issueID'] : NULL;
    $assignee    = isset($_POST['assignee']) ? $_POST['assignee'] : NULL;
    $status   = isset($_POST['status']) ? $_POST['status'] : NULL;
    $priority   = isset($_POST['priority']) ? $_POST['priority'] : NULL;
    $candID   = isset($_POST['PSCID']) ? $_POST['PSCID'] : NULL; //TODO: deal with adding DCCID and validating
    $visitLabel   = isset($_POST['visitLabel']) ? $_POST['visitLabel'] : NULL;
    $centerID   = isset($_POST['centerID']) ? $_POST['centerID'] : NULL;
    $title = isset($_POST['title']) ? $_POST['title'] : NULL;
    $category = isset($_POST['category']) ? $_POST['category'] : NULL;
    $module = isset($_POST['module']) ? $_POST['module'] : NULL;
    $comment = isset($_POST['comment']) ? $_POST['comment'] : NULL;

    //validate candID here
    $issueValues = [
        'assignee'   => $assignee,
        'status'     => $status,
        'priority'   => $priority,
  //      'candID'     => $candID,
        'visitLabel' => $visitLabel,
        'centerID'   => $centerID,
        'title'      => $title,
        'category'   => $category,
        'module'     => $module
    ];

    
    foreach ($issueValues as $key => $value) {
    	    if ($value == "null") {  
	    $issueValues[$key] = NULL;	
	    }
	   }

    error_log(json_encode($issueValues));
    if($issueID == "null") {
        $issueID = NULL;
    }

    if (!empty($issueID)) {
        $db->update('issues', $issueValues, ['issueID' => $issueID]);
        error_log("why am I here?");
    }
    else {
        $issueValues['reporter'] = $user->getData('UserID');
	$issueValues['dateCreated'] = date('Y-m-d H:i:s'); //because mysql 5.56 //todo: check that this works.
        error_log("at new issue submission");
        $db->insert('issues', $issueValues);
        $issueID = $db->getLastInsertId();
    }

    updateComments($issueValues, $issueID, $comment);

    return $issueID;
}

function getChangedValues(){

    //here find the changed values that you want to add to the comment stream, or to the comment table. I think now you should have a comment table.
    //although you'd have to do a join everytime.
}

//this will call getChangedValues and concatenate everything onto the back of the comment. For now it just changes the comment.
function updateComments($issueValues, $issueID, $comment) {
    $db   =& Database::singleton();

    if ($comment == "null"){
       $comment = NULL;
    }

    $commentValue = [
        'comment' => $comment;
    ];

    $db->update('issues', $commentValue, ['issueID' => $issueID]);
}

//will be updated once you make a separate comments table.
function getComments() {
    $db   =& Database::singleton();
    $db->pselect(
        "SELECT comment FROM issues",
        array()
    );    
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
    error_log(json_encode($sites));


    $assignees = array();

//    $assignee_expanded = $db->pselect("SELECT assignee from issues");
    $assignee_expanded = $db->pselect(
        "SELECT Real_name, UserID FROM users",
        array()
    );
    foreach ($assignee_expanded as $a_row) {
        $assignees[$a_row['UserID']] = $a_row['Real_name'];
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
        'urgent' => 'Urgent',
        'immediate' => 'Immediate'
    );

    $categories = array(
        'configuration' => 'Configuration',
        'code fix' => 'Code Fix',
        'sql error' => 'SQL Error',
        'documentation' => 'Documentation'
    );

    $modules = array();
    $modules_expanded = $db->pselect(
        "SELECT DISTINCT Label FROM LorisMenu ORDER BY Label",
        []
    );

    foreach ($modules_expanded as $m_row) {
        $module                  = $m_row['Label'];
        $modules[$module] = $module;
    }

    //$visitList       = Utility::getVisitList();

    $issueData = null;
    if (!empty($_GET['issueID'])) {
        $issueID = $_GET['issueID'];
        $issueData   = $db->pselectRow(
            "SELECT * FROM issues WHERE issueID = $issueID", //TODO: you actually need to join on candidate. and on site and call it site. also maybe watching
            []
        );

        $additionalIssueData = $db->pselectRow(
            "SELECT c.CandID, c.PSCID, p.Name FROM issues as i LEFT JOIN candidate c ON (i.candID=c.CandID) LEFT JOIN psc p ON (i.centerID=p.CenterID)",
            []
        );

        error_log("additional");
        error_log(json_encode($additionalIssueData));
        $issueData['DCCID'] = $additionalIssueData['CandID'];
        $issueData['PSCID'] = $additionalIssueData['PSCID'];
        $issueData['site'] = $additionalIssueData['Name'];

        //$issueData['comment'] = getComments($issueID);
    }else{

        $issueData['reporter'] = $user->getData('UserID'); //these are what need to be displayed upon creation of a new issue, but before the user has saved it. the user cannot change these values.
        $issueData['dateCreated'] = date('Y-m-d H:i:s');
        $issueData['site'] = $user->getData('Site');
	$issueData['issueID'] = NULL;
	$issueData['title'] = NULL;
	$issueData['lastUpdate'] = NULL;
	$issueData['centerID'] = NULL;
	$issueData['PSCID'] = NULL;
	$issueData['DCCID'] = NULL;
	$issueData['assignee'] = NULL;
	$issueData['status'] = "new";
	$issueData['priority'] = "low";
	$issueData['comment'] = NULL;
	$issueData['watching'] = NULL;
	$issueData['visitLabel'] = NULL;
	$issueData['category'] = NULL;	 
	$issueData['lastUpdatedBy'] = NULL;
    }

        $issueData['watching'] = true;

    $result = [
        'assignees' => $assignees,
        'sites' => $sites,
        'statuses' => $statuses,
        'priorities' => $priorities,
        'categories' => $categories,
        'modules' => $modules,
        'issueData'   => $issueData,
        'hasEditPermission' => $user->hasPermission('issue_tracker_can_assign') //todo: fix this when you decide on new permissions.
    ];

    error_log("result");
    return $result;
}