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
    } else if ($action == "edit") {
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
    $db =& Database::singleton();
    $user =& User::singleton();

    //maybe check for some kind of permission here. otherwise delete that utility method.
    //need to remember to deal with watching

    $issueValues = array();
    $fields = array('assignee', 'status', 'priority', 'visitLabel', 'centerID', 'title', 'category', 'module'); //need to add in CANDID

    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            $issueValues[$field] = $_POST[$field];
        }
    }

    $issueID = $_POST['issueID'];
    $issueValues['lastUpdatedBy'] = $user->getData('UserID');

    if (!empty($issueID)) {
        $db->update('issues', $issueValues, ['issueID' => $issueID]);
    } else {
        $issueValues['reporter'] = $user->getData('UserID');
        $issueValues['dateCreated'] = date('Y-m-d H:i:s'); //because mysql 5.56 //todo: check that this works.
        $db->insert('issues', $issueValues);
        $issueID = $db->getLastInsertId();
    }

    //adding comment in now that I have an issueID for both new and old.
    if ($_POST['comment'] != "null") {
        $issueValues['comment'] = $_POST['comment'];
    }

    updateComments($issueValues, $issueID);

    return $issueID;
}

//this will call getChangedValues and concatenate everything onto the back of the comment. For now it just changes the comment.
function updateComments($issueValues, $issueID)
{
    $user =& User::singleton();
    $db =& Database::singleton();
    $undesiredFields = array('lastUpdatedBy');

    foreach ($issueValues as $key => $value) {
        if (in_array($key, $undesiredFields)) {
            continue;
        }
        if (!empty($value)) { //check that this actually counts as null
            $changedValues = [
                'newValue' => $value,
                'fieldChanged' => $key,
                'issueID' => $issueID,
                'whoChanged' => $user->getData('UserID')
            ];
            $db->insert('issues_comments', $changedValues);
        }
    }
}

//will be updated once you make a separate comments table.
// returns string
function getComments($issueID)
{
    $db =& Database::singleton();
    $unformattedComments = $db->pselect(
        "SELECT newValue, fieldChanged, dateAdded, whoChanged from issues_comments where issueID=:issueID ORDER BY dateAdded",
        array('issueID' => $issueID)
    );


    $commentHistory = '';
    foreach ($unformattedComments as $comment){
        $commentString = "";
        $commentString .= '[' . $comment['dateAdded'] . '] ';
        $commentString .= $comment['whoChanged']; //really should do a join and get real names here eh.
        if ($comment['fieldChanged'] === 'comment'){
            $commentString .=  ' commented ' . '<i>' . $comment['newValue'] . '</i>';
        }
        else {
            $commentString .= " updated the <b>" . $comment['fieldChanged'] . "</b> to <i>" . $comment['newValue'] . "</i>";
        }

        $commentHistory .= $commentString . '<br/>';
    }

    return $commentHistory;

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
        if (is_array($sites)) $sites = array('' => 'All') + $sites;
    } else {
        // allow only to view own site data
        $site =& Site::singleton($user->getData('CenterID'));
        if ($site->isStudySite()) {
            $sites = array($user->getData('CenterID') => $user->getData('Site'));
            $sites[''] = 'All';
        }
    }

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
        'Anonimyzer/Scheduler/ID (ASID)' => 'Anonimyzer/Scheduler/ID (ASID)',
        'API/Mobile' => 'API/Mobile',
        'Behavioural QC' => 'Behavioural QC',
        'CBRAIN hooks' => 'CBRAIN hooks',
        'Code fixes' => 'Code fixes',
        'Configurations' => 'Configurations',
        'Demo' => 'Demo',
        'DICOM archive' => 'DICOM archive',
        'Documentation' => 'Documentation',
        'DQT' => 'DQT',
        'Genomics' => 'Genomics',
        'GUI/Bootstrap' => 'GUI/Bootstrap',
        'Help section' => 'Help section',
        'Imaging Browser' => 'Imaging Browser',
        'Imaging preprocessing scripts' => 'Imaging preprocessing scripts',
        'Imaging Uploader' => 'Imaging Uploader',
        'Improvements' => 'Improvements',
        'Install Process' => 'Install Process',
        'Instrument Builder' => 'Instrument Builder',
        'LorisForm' => 'LorisForm',
        'Public Repositories' => 'Public Repositories',
        'Release process tasks' => 'Release process tasks',
        'Schema' => 'Schema',
        'Server/technical' => 'Server/technical',
        'Stand alone Scripts' => 'Stand alone Scripts',
        'Statistics' => 'Statistics',
        'Survey accounts' => 'Survey accounts',
        'Testing (Automated)' => 'Testing (Automated)',
        'Testing (Manual)' => 'Testing (Manual)',
        'User accounts/Permissions' => 'User accounts/Permissions'
    );

    $modules = array();
    $modules_expanded = $db->pselect(
        "SELECT DISTINCT Label FROM LorisMenu ORDER BY Label",
        []
    );

    foreach ($modules_expanded as $m_row) {
        $module = $m_row['Label'];
        $modules[$module] = $module;
    }

    //$visitList       = Utility::getVisitList();

    $issueData = null;
    if (!empty($_GET['issueID'])) {
        $issueID = $_GET['issueID'];
        $issueData = $db->pselectRow(
            "SELECT * FROM issues WHERE issueID = $issueID", //TODO: you actually need to join on candidate. and on site and call it site. also maybe watching
            []
        );

        $additionalIssueData = $db->pselectRow(
            "SELECT c.CandID, c.PSCID, p.Name FROM issues as i LEFT JOIN candidate c ON (i.candID=c.CandID) LEFT JOIN psc p ON (i.centerID=p.CenterID)",
            []
        );

        $issueData['DCCID'] = $additionalIssueData['CandID'];
        $issueData['PSCID'] = $additionalIssueData['PSCID'];
        $issueData['site'] = $additionalIssueData['Name'];

        $issueData['commentHistory'] = getComments($issueID);
    } else {

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
        $issueData['commentHistory'] = NULL;
        $issueData['watching'] = NULL;
        $issueData['visitLabel'] = NULL;
        $issueData['category'] = NULL;
        $issueData['lastUpdatedBy'] = NULL;
    }

    $issueData['watching'] = true;
    $issueData['comment'] = null;

    $result = [
        'assignees' => $assignees,
        'sites' => $sites,
        'statuses' => $statuses,
        'priorities' => $priorities,
        'categories' => $categories,
        'modules' => $modules,
        'issueData' => $issueData,
        'hasEditPermission' => $user->hasPermission('issue_tracker_can_assign') //todo: fix this when you decide on new permissions.
    ];

    return $result;
}