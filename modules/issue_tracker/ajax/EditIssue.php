<?php
/**
 * Issue tracker
 *
 * Handles issue edits and returns data in response to a front end call.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Media
 * @author   Caitrin Armstrong <caitrin.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

/**
 * Issue tracker
 *
 * Handles issue edits and returns data in response to a front end call.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Media
 * @author   Caitrin Armstrong <caitrin.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

require_once "Email.class.inc";

//TODO: or split it into two files... :P
if (isset($_GET['action'])) {
    $action = $_GET['action'];
    if ($action == "getData") {
        echo json_encode(getIssueFields());
    } else if ($action == "edit") {
        echo editIssue();
    }
}

/**
 * Either updates an old issue or adds a new one
 *
 * @throws DatabaseException
 *
 * @return void
 */
function editIssue()
{
    $db   =& Database::singleton();
    $user =& User::singleton();

    $issueValues = array(); //TODO: add PSCID and visitLabel
    $fields      = array(
                    'assignee',
                    'status',
                    'priority',
                    'visitLabel',
                    'centerID',
                    'title',
                    'category',
                    'module',
                    'watching',
                   );

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
        $issueValues['reporter']    = $user->getData('UserID');
        $issueValues['dateCreated'] = date('Y-m-d H:i:s');
        $db->insert('issues', $issueValues);
        $issueID = $db->getLastInsertId();
    }

    updateHistory($issueValues, $issueID);

    //adding comment in now that I have an issueID for both new and old.
    if ($_POST['comment'] != null) {
        $commentValues = array(
                          'issueComment' => $_POST['comment'],
                          'addedBy'      => $user->getData('UserID'),
                          'issueID'      => $issueID,
                         );
        $db->insert('issues_comments', $commentValues);

    }

    //adding editor to the watching table unless they don't want to be added.
    if ($_POST['watching'] != 'no') {
        $nowWatching = array(
                        'userID'  => $user->getData('UserID'),
                        'issueID' => $issueID,
                       );
        $db->replace('issues_watching', $nowWatching);
    } else if ($_POST['watching'] == 'no') {
        $db->delete(
            'issues_watching',
            array(
             'issueID' => $issueID,
             'userID'  => $user->getData('UserID'),
            )
        );
    }
    //sending email
    emailUser($issueID);

    return $issueID;
}

/**
 * Puts updated fields into the issues_history table.
 *
 * @param array  $issueValues the new values
 * @param string $issueID     the issue ID
 *
 * @throws DatabaseException
 *
 * @return void
 */
function updateHistory($issueValues, $issueID)
{
    $user =& User::singleton();
    $db   =& Database::singleton();
    $undesiredFields = array('lastUpdatedBy');

    foreach ($issueValues as $key => $value) {
        if (in_array($key, $undesiredFields)) {
            continue;
        }
        if (!empty($value)) { //check that all kinds of nulls are being dealt with
            $changedValues = [
                              'newValue'     => $value,
                              'fieldChanged' => $key,
                              'issueID'      => $issueID,
                              'addedBy'      => $user->getData('UserID'),
                             ];
            $db->insert('issues_history', $changedValues);
        }
    }
}

/**
 * Will keep track of comment edit history
 *
 * @param int    $issueCommentID  the comment that is being edited
 * @param string $newCommentValue the new comment
 *
 * @throws DatabaseException
 *
 * @return void
 */
function updateCommentHistory($issueCommentID, $newCommentValue)
{
    $user =& User::singleton();
    $db   =& Database::singleton();

    $changedValue = array(
                     'issueCommentID' => $issueCommentID,
                     'newValue'       => $newCommentValue,
                     'editedBy'       => $user->getData('UserID'),
                    );

    $db->insert('issues_comments_history', $changedValue);
}


/**
 * Gets the changes to values, and the comments relevant to the given issue
 *
 * @param int $issueID the issueID
 *
 * @throws DatabaseException
 *
 * @return string $commentHistory html
 */
function getComments($issueID)
{
    $db =& Database::singleton();
    $unformattedComments = $db->pselect(
        "SELECT newValue, fieldChanged, dateAdded, addedBy ".
        "FROM issues_history where issueID=:issueID " .
        "UNION " .
        "SELECT issueComment, 'comment', dateAdded, addedBy ".
        "FROM issues_comments where issueID=:issueID " .
        "ORDER BY dateAdded",
        array('issueID' => $issueID)
    );

    //todo: get real names as well

    $commentHistory = '';
    foreach ($unformattedComments as $comment) {
        $commentString  = "";
        $commentString .= '[' . $comment['dateAdded'] . '] ';
        $commentString .= $comment['addedBy'];
        if ($comment['fieldChanged'] === 'comment') {
            $commentString .= ' commented ' . '<i>' . $comment['newValue'] . '</i>';
        } else if ($comment['fieldChanged'] === 'module') {
            $module         = $db->pselectOne(
                "SELECT Label FROM LorisMenu WHERE ID=:module",
                array('module' => $comment['newValue'])
            );
            $commentString .= " updated the <b>" . $comment['fieldChanged'] .
                "</b> to <i>" . $module . "</i>";
        } else if ($comment['fieldChanged'] === 'centerID') {
            $site           = $db->pselectOne(
                "SELECT Name FROM psc WHERE CenterID=:centerID",
                array('centerID' => $comment['newValue'])
            );
            $commentString .= " updated the <b>" . "site" .
                "</b> to <i>" . $site . "</i>";
        } else {
            $commentString .= " updated the <b>" . $comment['fieldChanged'] .
                "</b> to <i>" . $comment['newValue'] . "</i>";
        }
        $commentHistory .= $commentString . '<br/>';
    }

    return $commentHistory;

}


/**
 * Emails all users that are watching the issue with the changes.
 *
 * @param int $issueID the issueID
 *
 * @return array
 * @throws DatabaseExceptionr
 */
function emailUser($issueID)
{

    $user =& User::singleton();
    $db   =& Database::singleton();

    $issue_change_emails = $db->pselect(
        "SELECT u.Email as Email, u.Real_name as realname ".
        "FROM users u INNER JOIN issues_watching w ON (w.userID = u.userID) WHERE ".
        "w.issueID=:issueID and u.UserID<>:uid",
        array(
         'issueID' => $issueID,
         'uid'     => $user->getUsername(),
        )
    );

    //not sure if this is necessary
    $factory = NDB_Factory::singleton();
    $baseurl = $factory->settings()->getBaseURL();

    $msg_data['realname'] = $issue_change_emails['realname'];
    $msg_data['url']      = $baseurl .
        "/issue_tracker/ajax/EditIssue.php?action=getData&issueID=" . $issueID;
    $msg_data['issueID']  = $issueID;

    foreach ($issue_change_emails as $email) {
        Email::send($email['Email'], 'issue_change.tpl', $msg_data);
    }
}

/**
 * Returns a list of fields from database, including issue data
 *
 * @return array
 * @throws DatabaseException
 */
function getIssueFields()
{

    $db   =& Database::singleton();
    $user =& User::singleton();

    //get field options
    $sites = array('' => 'All');
    if ($user->hasPermission('access_all_profiles')) {
        // get the list of study sites - to be replaced by the Site object
        $sites = Utility::getSiteList();
        if (is_array($sites)) {
            $sites = array('' => 'All') + $sites;
        }
    } else {
        // allow only to view own site data
        $site =& Site::singleton($user->getData('CenterID'));
        if ($site->isStudySite()) {
            $sites[$user->getData('CenterID')] = $user->getData('Site');
        }
    }

    $assignees         = array();
    $assignee_expanded = $db->pselect(
        "SELECT Real_name, UserID FROM users",
        array()
    );
    foreach ($assignee_expanded as $a_row) {
        $assignees[$a_row['UserID']] = $a_row['Real_name'];
    }

    $statuses = array(
                 'new'          => 'New',
                 'acknowledged' => 'Acknowledged',
                 'assigned'     => 'Assigned',
                 'feedback'     => 'Feedback',
                 'resolved'     => 'Resolved',
                 'closed'       => 'Closed',
                );

    $priorities = array(
                   'low'       => 'Low',
                   'normal'    => 'Normal',
                   'high'      => 'High',
                   'urgent'    => 'Urgent',
                   'immediate' => 'Immediate',
                  );

    $categories = array(
                   'Behavioural Instruments'           => 'Behavioural Instruments',
                   'Behavioural Battery'               => 'Behavioural Battery',
                   'Data Entry'                        => 'Data Entry',
                   'Database Problems'                 => 'Database Problems',
                   'Examiners'                         => 'Examiners',
                   'SubprojectID/Project/Plan Changes' => 'SubprojectID'.
                       '/Project/Plan Changes',
                  );

    $modules          = array();
    $modules_expanded = $db->pselect(
        "SELECT DISTINCT Label, ID FROM LorisMenu ORDER BY Label",
        []
    );
    foreach ($modules_expanded as $m_row) {
        $modules[$m_row['ID']] = $m_row['Label'];
    }

    //Now get issue values
    $issueData = null;
    if (!empty($_GET['issueID'])) { //if an existing issue
        $issueID   = $_GET['issueID'];
        $issueData = $db->pselectRow(
            "SELECT i.*, c.PSCID, s.Visit_label FROM issues as i " .
            "LEFT JOIN candidate c ON (i.candID=c.CandID)" .
            "LEFT JOIN session s ON (i.sessionID=s.ID) " .
            "WHERE issueID = $issueID",
            []
        );
        $issueData['commentHistory'] = getComments($issueID);

    } else { //just setting the default values
        $issueData['reporter']       = $user->getData('UserID');
        $issueData['dateCreated']    = date('Y-m-d H:i:s');
        $issueData['centerID']       = $user->getData('CenterID');
        $issueData['status']         = "new";
        $issueData['priority']       = "low";
        $issueData['issueID']        = null; //TODO: this is dumb
        $issueData['title']          = null;
        $issueData['lastUpdate']     = null;
        $issueData['PSCID']          = null;
        $issueData['assignee']       = null;
        $issueData['commentHistory'] = null;
        $issueData['watching']       = null;
        $issueData['visitLabel']     = null;
        $issueData['category']       = null;
        $issueData['lastUpdatedBy']  = null;
    }

    $isWatching = $db->pselectOne(
        "SELECT * FROM issues_watching WHERE issueID=:issueID AND userID=:userID",
        array(
         'issueID' => $issueID,
         'userID'  => $user->getData('UserID'),
        )
    );

    $issueData['watching'] = $isWatching;
    $issueData['comment']  = null;

    if ($issueData['userID'] == $user->getData('UserID')) {
        $isOwnIssue = true;
    } else {
        $isOwnIssue = false;
    }

    $result = [
               'assignees'         => $assignees,
               'sites'             => $sites,
               'statuses'          => $statuses,
               'priorities'        => $priorities,
               'categories'        => $categories,
               'modules'           => $modules,
               'issueData'         => $issueData,
               'hasEditPermission' => $user->hasPermission(
                   'issue_tracker_developer'
               ),
               'isOwnIssue'        => $isOwnIssue,
              ];

    return $result;
}