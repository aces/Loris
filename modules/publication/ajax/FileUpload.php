<?php
/**
 * Publication file upload & editing handler
 *
 * This processes and inserts data for publication uploads & editing
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Publication
 * @author   David <dblader.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
if (isset($_REQUEST['action'])) {
    $action = $_REQUEST['action'];
    if ($action === 'upload') {
        uploadPublication();
    } elseif ($action === 'editProject') {
        editProject();
    } else {
        header("HTTP/1.1 400 Bad Request");
    }
}

/**
 * Function for new publications
 *
 * @return null
 */
function uploadPublication()
{
    $db   = Database::singleton();
    $user = \User::singleton();
    if (!$user->hasPermission('publication_propose')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $titleRaw = isset($_REQUEST['title']) ? $_REQUEST['title'] : null;
    if (!$titleRaw) {
        showError('Title is empty');
    }
    // title that gets inserted is run through htmlspecialchars()
    // so need to query based on Processed title
    $titleProc = htmlspecialchars($titleRaw);

    // back end validation for title uniqueness constraint
    $exists = $db->pselectOne(
        "SELECT PublicationID " .
        "FROM publication " .
        "WHERE Title=:t",
        array('t' => $titleProc)
    );

    if ($exists) {
        showError('Submitted title already exists');
    }
    $desc            = isset($_REQUEST['description'])
        ? $_REQUEST['description'] : null;
    $leadInvest      = isset($_REQUEST['leadInvestigator'])
        ? $_REQUEST['leadInvestigator'] : null;
    $leadInvestEmail = isset($_REQUEST['leadInvestigatorEmail'])
        ? $_REQUEST['leadInvestigatorEmail'] : null;

    // check if lead investigator already exists in collaborator table
    // use ID if exists, else insert
    $leadInvID = $db->pselectOne(
        'SELECT PublicationCollaboratorID '.
        'FROM publication_collaborator '.
        'WHERE Name = :n AND Email = :e',
        array(
         'n' => $leadInvest,
         'e' => $leadInvestEmail,
        )
    );
    if (empty($leadInvID)) {
        $db->insert(
            'publication_collaborator',
            array(
             'Name'  => $leadInvest,
             'Email' => $leadInvestEmail,
            )
        );

        $leadInvID = $db->getLastInsertId();
    }
    if (!isset($desc) || !isset($leadInvest) || !isset($leadInvestEmail)) {
        showError('A mandatory field is missing!');
    }
    // INSERT INTO publication ...
    $uid   = $user->getId();
    $today = date('Y-m-d');
    // insert the titleRaw to avoid double escaping
    $fields = array(
               'UserID'             => $uid,
               'Title'              => $titleRaw,
               'Description'        => $desc,
               'LeadInvestigatorID' => $leadInvID,
               'DateProposed'       => $today,
              );

    $db->insert('publication', $fields);
    $pubID = $db->getLastInsertId();

    try {
        // process files
        processFiles($pubID);
        // INSERT INTO publication_collaborator
        insertCollaborators($pubID);
        // INSERT INTO publication_users_edit_perm_rel
        insertEditors($pubID);
        // INSERT INTO publication_keyword
        insertKeywords($pubID);
        // INSERT INTO publication_parameter_type_rel
        insertVOIs($pubID);
        // INSERT INTO publication_users_edit_perm_rel
    } catch (Exception $e) {
        cleanup($pubID);
        showError($e->getMessage());
    }

    notify($pubID, 'submission');
}

/**
 * Function for storing files and inserting file meta data into database
 *
 * @param int $pubID ID of Publication in publication table
 *
 * @return null
 */
function processFiles($pubID)
{
    if (empty($_FILES)) {
        return;
    }
    $db     = \Database::singleton();
    $config = \NDB_Config::singleton();

    $publicationPath = $config->getSetting('publication_uploads');

    if (!isset($publicationPath)) {
        showError(
            "Error! Publication path is not set in Loris Settings!"
        );
    }

    if (!file_exists($publicationPath)) {
        showError(
            "Error! The upload folder '$publicationPath' does not exist!'"
        );
    }

    foreach ($_FILES as $name => $values) {
        $fileName = preg_replace('/\s/', '_', $values["name"]);
        if (file_exists($publicationPath . $fileName)) {
            showError("File $fileName already exists!");
        }
        $extension = pathinfo($fileName)['extension'];
        $index     = preg_split('/_/', $name)[1];

        if (!isset($extension)) {
            showError(
                "Please make sure your file has a valid extension: " .
                $values['name']
            );
        }
        $pubTypeID       = isset($_REQUEST['publicationType_'.$index]) ?
            $_REQUEST['publicationType_'.$index] : null;
        $pubCitation     = isset($_REQUEST['publicationCitation_'.$index]) ?
            $_REQUEST['publicationCitation_'.$index] : null;
        $pubVersion      = isset($_REQUEST['publicationVersion_'.$index]) ?
            $_REQUEST['publicationVersion_'.$index] : null;
        $pubUploadInsert = array(
                            'PublicationID'           => $pubID,
                            'PublicationUploadTypeID' => $pubTypeID,
                            'URL'                     => $fileName,
                            'Citation'                => $pubCitation,
                            'Version'                 => $pubVersion,
                           );

        if (move_uploaded_file($values["tmp_name"], $publicationPath . $fileName)) {
            $db->insert('publication_upload', $pubUploadInsert);
        } else {
            showError("Could not upload the file. Please try again!");
        }
    }
}

/**
 * Insert new collaborators into collaborator table and/or put them in rel table
 * Does NOT include insert for lead investigator
 *
 * @param int $pubID the publication ID
 *
 * @return null
 */
function insertCollaborators($pubID)
{
    if (!$_REQUEST['collaborators']) {
        return;
    }
    $db = Database::singleton();

    $collaborators = json_decode($_REQUEST['collaborators'], true);
    foreach ($collaborators as $c) {
        $cid = $db->pselectOne(
            'SELECT PublicationCollaboratorID '.
            'FROM publication_collaborator '.
            'WHERE Name=:c',
            array('c' => $c['name'])
        );
        // if collaborator does not already exist in table, add them
        if (!$cid) {
            $collabInsert = array(
                             'Name'  => $c['name'],
                             'Email' => $c['email'],
                            );

            $db->insert(
                'publication_collaborator',
                $collabInsert
            );
            $cid = $db->pselectOne(
                'SELECT PublicationCollaboratorID ' .
                'FROM publication_collaborator ' .
                'WHERE Name=:c',
                array('c' => $c['name'])
            );
        }
        $collabRelInsert = array(
                            'PublicationID'             => $pubID,
                            'PublicationCollaboratorID' => $cid,
                           );
        $db->insertIgnore(
            'publication_collaborator_rel',
            $collabRelInsert
        );
    }
}

/**
 * Inserts users with edit access for the given publication project
 *
 * @param int $pubID publication ID
 *
 * @return null
 */
function insertEditors($pubID)
{
    if (empty($_REQUEST['usersWithEditPerm'])) {
        return;
    }

    $db = Database::singleton();
    $usersWithEditPerm = json_decode($_REQUEST['usersWithEditPerm']);
    foreach ($usersWithEditPerm as $uid) {
        $insert = array(
                   'PublicationID' => $pubID,
                   'UserID'        => $uid,
                  );

        $db->insertIgnore(
            'publication_users_edit_perm_rel',
            $insert
        );
    }
}

/**
 * Inserts keywords for the given publication project
 *
 * @param int $pubID publication ID
 *
 * @return null
 */
function insertKeywords($pubID)
{
    if (empty($_REQUEST['keywords'])) {
        return;
    }
    $db       = Database::singleton();
    $keywords = json_decode($_REQUEST['keywords']);
    foreach ($keywords as $kw) {
        // check if keyword exists
        $kwID = $db->pselectOne(
            'SELECT PublicationKeywordID ' .
            'FROM publication_keyword ' .
            'WHERE Label=:kw',
            array('kw' => $kw)
        );
        // if it doesn't, add it to keyword table and retrieve ID
        if (!$kwID) {
            $kwInsert = array('Label' => $kw);
            $db->insert(
                'publication_keyword',
                $kwInsert
            );
            $kwID = $db->getLastInsertId();
        }
        // add it pub_kw_rel table
        // get publication ID
        $pubKWRelInsert = array(
                           'PublicationID'        => $pubID,
                           'PublicationKeywordID' => $kwID,
                          );

        $db->insert(
            'publication_keyword_rel',
            $pubKWRelInsert
        );

    }
}

/**
 * Inserts Variables of Interest for the given publication project
 *
 * @param int $pubID publication ID
 *
 * @return null
 */
function insertVOIs($pubID)
{
    if (empty($_REQUEST['voiFields'])) {
        return;
    }
    $db        = Database::singleton();
    $testNames = $db->pselectColWithIndexKey(
        'SELECT ID, Test_name FROM test_names',
        array(),
        'ID'
    );

    $paramTypes = $db->pselectColWithIndexKey(
        'SELECT ParameterTypeID, Name FROM parameter_type',
        array(),
        'ParameterTypeID'
    );

    $voiFields = json_decode($_REQUEST['voiFields']);
    foreach ($voiFields as $vf) {
        // search test_names for value
        if (in_array($vf, $testNames)) {
            $pubTNRelInsert = array(
                               'TestNameID'    => array_search($vf, $testNames),
                               'PublicationID' => $pubID,
                              );
            $db->insertIgnore(
                'publication_test_names_rel',
                $pubTNRelInsert
            );
        } elseif (in_array($vf, $paramTypes)) {
            $ptID = array_search($vf, $paramTypes);
            $pubParamTypeRelInsert = array(
                                      'ParameterTypeID' => $ptID,
                                      'PublicationID'   => $pubID,
                                     );

            $db->insertIgnore(
                'publication_parameter_type_rel',
                $pubParamTypeRelInsert
            );
        } else {
            throw new LorisException("Unknown variable of interest: $vf");
        }
    }
}
/**
 * Deletes all inserted data if there is an exception thrown
 *
 * @param int $pubID publication ID
 *
 * @return null
 */
function cleanup($pubID)
{
    $db    = Database::singleton();
    $where = array('PublicationID' => $pubID);

    $tables = array(
               'publication_users_edit_perm_rel',
               'publication_parameter_type_rel',
               'publication_test_names_rel',
               'publication_collaborator_rel',
               'publication_keyword_rel',
               'publication',
              );

    foreach ($tables as $table) {
        $db->delete($table, $where);
    }

    $files = $db->pselectCol(
        'SELECT URL FROM publication_upload WHERE PublicationID=:PublicationID',
        $where
    );
    if (!empty($files)) {
        $conf = \NDB_Config::singleton();
        $base = $conf->getSetting('publication_uploads');
        foreach ($files as $f) {
            unlink($base . $f);
        }
        $db->delete('publication_upload', $where);
    }
}

/**
 * Send out email notifications for project submission
 *
 * @param int    $pubID publication ID
 * @param string $type  The notification type i.e., submission|edit|review
 *
 * @return null
 */
function notify($pubID, $type)
{
    $acceptedTypes = array(
                      'submission',
                      'edit',
                      'review',
                     );

    if (!in_array($type, $acceptedTypes)) {
        throw new LorisException("Unexpected notification type: $type");
    }

    $db        = \Database::singleton();
    $config    = \NDB_Config::singleton();
    $user      = \User::singleton();
    $emailData = array();

    $data = $db->pselectRow(
        "SELECT Title, DateProposed, pc.Email as LeadInvestigatorEmail " .
        "FROM publication p " .
        "LEFT JOIN publication_collaborator pc ".
        "ON p.LeadInvestigatorID=pc.PublicationCollaboratorID " .
        "WHERE PublicationID=:pubID",
        array('pubID' => $pubID)
    );
    $url  = $config->getSetting('url');

    $emailData['Title']       = $data['Title'];
    $emailData['Date']        = $data['DateProposed'];
    $emailData['User']        = $user->getFullname();
    $emailData['URL']         = $url . '/publication/view_project/?id='.$pubID;
    $emailData['ProjectName'] = $config->getSetting('prefix');

    $sendTo = $_REQUEST['notifyLead'] === 'true'
        ? array($data['LeadInvestigatorEmail']) : [];
    // get collaborators to notify
    $collaborators = isset($_REQUEST['collaborators'])
        ? json_decode($_REQUEST['collaborators'], true) : null;

    foreach ($collaborators as $c) {
        if ($c['notify']) {
            $sendTo[] = $c['email'];
        }
    }
    if (!empty($sendTo)) {
        $sendTo = implode(', ', $sendTo);
        Email::send(
            $sendTo,
            "notifier_publication_$type.tpl",
            $emailData
        );
    }
}

/**
 * Edits fields for an existing publication project
 *
 * @return null
 */
function editProject()
{
    $db = \Database::singleton();
    $id = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;

    if (isset($id)) {
        // double check that current user has edit access
        $user        = \User::singleton();
        $creatorUser = $db->pselectOne(
            'SELECT UserID FROM publication WHERE PublicationID=:id',
            array('id' => $id)
        );

        $editors = $db->pselectCol(
            'SELECT UserID FROM publication_users_edit_perm_rel '.
            'WHERE PublicationID=:id',
            array('id' => $id)
        );
        $uid     = $user->getId();
        if ($uid !== $creatorUser
            && !in_array($uid, $editors)
        ) {
            header("HTTP/1.1 403 Forbidden");
            exit;
        }
    } else {
        showError('No Publication ID provided');
    }

    $statusID         = isset($_REQUEST['status'])
        ? $_REQUEST['status'] : null;
    $rejectedReason   = isset($_REQUEST['rejectedReason'])
        ? $_REQUEST['rejectedReason'] : null;
    $description      = isset($_REQUEST['description'])
        ? $_REQUEST['description'] : null;
    $leadInvestigator = isset($_REQUEST['leadInvestigator'])
        ? $_REQUEST['leadInvestigator'] : null;
    $leadInvestigatorEmail = isset($_REQUEST['leadInvestigatorEmail'])
        ? $_REQUEST['leadInvestigatorEmail'] : null;

    $pubData = $db->pselectRow(
        'SELECT p.*, pc.Name as LeadInvestigator, ' .
        'pc.Email as LeadInvestigatorEmail ' .
        'FROM publication p ' .
        'LEFT JOIN publication_collaborator pc '.
        'ON p.LeadInvestigatorID=pc.PublicationCollaboratorID '.
        'WHERE PublicationID=:pid',
        array('pid' => $id)
    );

    // build array of changed values
    $toUpdate        = array();
    $leadInvToUpdate = array();
    if ($pubData['PublicationStatusID'] !== $statusID) {
        $toUpdate['PublicationStatusID'] = $statusID;
    }
    if ($pubData['RejectedReason'] !== $rejectedReason) {
        $toUpdate['RejectedReason'] = $rejectedReason;
    }
    if ($pubData['Description'] !== $description) {
        $toUpdate['Description'] = $description;
    }
    if ($pubData['LeadInvestigator'] !== $leadInvestigator) {
        $leadInvToUpdate['Name'] = $leadInvestigator;
    }
    if ($pubData['LeadInvestigatorEmail'] !== $leadInvestigatorEmail) {
        $leadInvToUpdate['Email'] = $leadInvestigatorEmail;
    }

    editEditors($id);
    editCollaborators($id);
    editKeywords($id);
    editVOIs($id);
    editUploads($id);
    processFiles($id);
    // if publication status is changed, send review email
    if (isset($toUpdate['PublicationStatusID'])) {
        notify($id, 'review');
    } else {
        // otherwise send edit email
        notify($id, 'edit');
    }
    if (!empty($toUpdate)) {
        $db->update(
            'publication',
            $toUpdate,
            array('PublicationID' => $id)
        );
    }
    if (!empty($leadInvToUpdate)) {
        $db->update(
            'publication_collaborator',
            $leadInvToUpdate,
            array('PublicationCollaboratorID' => $pubData['LeadInvestigatorID'])
        );
    }
}

/**
 * Edit users with edit permission
 *
 * @param int $id publication ID
 *
 * @return null
 */
function editEditors($id)
{
    $db = \Database::singleton();
    $usersWithEditPerm = isset($_REQUEST['usersWithEditPerm'])
        ? json_decode($_REQUEST['usersWithEditPerm']) : null;

    $currentUWEP = $db->pselectCol(
        'SELECT UserID '.
        'FROM publication_users_edit_perm_rel '.
        'WHERE PublicationID=:pid',
        array('pid' => $id)
    );

    if ($usersWithEditPerm != $currentUWEP) {
        // new UWEP will be in array_diff result of submitted vs stored
        $newUWEP = array_diff($usersWithEditPerm, $currentUWEP);
        // old UWEP who should be removed will appear in inverse operation
        $oldUWEP = array_diff($currentUWEP, $usersWithEditPerm);
    }

    if (!empty($newUWEP)) {
        insertEditors($id);
    }
    if (!empty($oldUWEP)) {
        foreach ($oldUWEP as $uid) {
            $db->delete(
                'publication_users_edit_perm_rel',
                array(
                 'UserID'        => $uid,
                 'PublicationID' => $id,
                )
            );
        }
    }
}

/**
 * Edit collaborators
 *
 * @param int $id Publication ID
 *
 * @return null
 */
function editCollaborators($id)
{
    $db = \Database::singleton();
    $submittedCollaborators = isset($_REQUEST['collaborators'])
        ? json_decode($_REQUEST['collaborators'], true) : null;

    $currentCollabs       = $db->pselectCol(
        'SELECT Name FROM publication_collaborator pc '.
        'LEFT JOIN publication_collaborator_rel pcr '.
        'ON pcr.PublicationCollaboratorID=pc.PublicationCollaboratorID '.
        'WHERE pcr.PublicationID=:pid',
        array('pid' => $id)
    );
    $currCollabNames      = array_values($currentCollabs);
    $submittedCollabNames = array_column($submittedCollaborators, 'name');
    if ($submittedCollabNames != $currCollabNames) {
        $newCollabs = array_diff($submittedCollabNames, $currCollabNames);
        $oldCollabs = array_diff($currentCollabs, $submittedCollabNames);
    }

    if (!empty($newCollabs)) {
        insertCollaborators($id);
    }
    if (!empty($oldCollabs)) {
        foreach ($oldCollabs as $name) {
            $cid = $db->pselectOne(
                'SELECT PublicationCollaboratorID '.
                'FROM publication_collaborator '.
                'WHERE Name=:n',
                array('n' => $name)
            );
            $db->delete(
                'publication_collaborator_rel',
                array(
                 'PublicationCollaboratorID' => $cid,
                 'PublicationID'             => $id,
                )
            );
        }
    }
    // update emails if any have changed
    $currentCollabs = $db->pselect(
        'SELECT Name, Email FROM publication_collaborator pc '.
        'LEFT JOIN publication_collaborator_rel pcr '.
        'ON pcr.PublicationCollaboratorID=pc.PublicationCollaboratorID '.
        'WHERE pcr.PublicationID=:pid',
        array('pid' => $id)
    );

    $currCollabEmails      = array_column($currentCollabs, 'email');
    $submittedCollabEmails = array_column($submittedCollaborators, 'email');
    $staleEmails           = array();
    if ($submittedCollabEmails != $currCollabEmails) {
        // only care about updated emails here
        $staleEmails = array_diff($currCollabEmails, $submittedCollabEmails);
    }
    if (!empty($staleEmails)) {
        $currentCollabs = array_combine(
            array_column($currentCollabs, 'email'),
            array_column($currentCollabs, 'name')
        );

        $submittedCollaborators = array_combine(
            array_column($submittedCollaborators, 'name'),
            array_column($submittedCollaborators, 'email')
        );
        foreach ($staleEmails as $s) {
            $name     = $currentCollabs[$s];
            $newEmail = $submittedCollaborators[$name];
            $db->update(
                'publication_collaborator',
                array('Email' => $newEmail),
                array('Name' => $name)
            );
        }
    }
}

/**
 * Edit keywords
 *
 * @param int $id if the legends are to be believed, this is the Publication ID...
 *
 * @return null
 */
function editKeywords($id)
{
    $db       = \Database::singleton();
    $keywords = isset($_REQUEST['keywords'])
        ? json_decode($_REQUEST['keywords']) : null;

    $currentKW = $db->pselectCol(
        'SELECT Label FROM publication_keyword pk '.
        'LEFT JOIN publication_keyword_rel pkr '.
        'ON pk.PublicationKeywordID=pkr.PublicationKeywordID '.
        'WHERE pkr.PublicationID=:pid',
        array('pid' => $id)
    );

    if ($currentKW != $keywords) {
        $newKWs = array_diff($keywords, $currentKW);
        $oldKWs = array_diff($currentKW, $keywords);
    }

    if (!empty($newKWs)) {
        insertKeywords($id);
    }
    if (!empty($oldKWs)) {
        foreach ($oldKWs as $kw) {
            $kid = $db->pselectOne(
                'SELECT PublicationKeywordID '.
                'FROM publication_keyword '.
                'WHERE Label=:kw',
                array('kw' => $kw)
            );

            $db->delete(
                'publication_keyword_rel',
                array(
                 'PublicationKeywordID' => $kid,
                 'PublicationID'        => $id,
                )
            );
        }
    }
}

/**
 * Edit Variables of Interest
 *
 * @param int $id Could be a publication ID, probably is, who knows for sure?
 *
 * @return null
 */
function editVOIs($id)
{
    $db  = \Database::singleton();
    $voi = isset($_REQUEST['voiFields'])
        ? json_decode($_REQUEST['voiFields']) : null;

    $fields    = $db->pselectCol(
        'SELECT pt.Name AS field ' .
        'FROM parameter_type pt '.
        'LEFT JOIN publication_parameter_type_rel pptr '.
        'ON pptr.ParameterTypeID=pt.ParameterTypeID '.
        'WHERE pptr.PublicationID=:pid',
        array('pid' => $id)
    );
    $testNames = $db->pselectCol(
        'SELECT Test_name '.
        'FROM publication_test_names_rel ptnr '.
        'LEFT JOIN test_names tn '.
        'ON tn.ID=ptnr.TestNameID '.
        'WHERE PublicationID=:pid',
        array('pid' => $id)
    );

    $currentVOI = array_merge($fields, $testNames);

    if ($currentVOI != $voi) {
        $newVOI = array_diff($voi, $currentVOI);
        $oldVOI = array_diff($currentVOI, $voi);
    }
    if (!empty($newVOI)) {
        insertVOIs($id);
    }
    if (!empty($oldVOI)) {
        foreach ($oldVOI as $ov) {
            $tnID = $db->pselectOne(
                'SELECT ID FROM test_names WHERE Test_name=:tn',
                array('tn' => $ov)
            );
            if ($tnID) {
                $db->delete(
                    'publication_test_names_rel',
                    array(
                     'PublicationID' => $id,
                     'TestNameID'    => $tnID,
                    )
                );
            } else {
                $ptID = $db->pselectOne(
                    'SELECT ParameterTypeID FROM parameter_type WHERE Name=:n',
                    array('n' => $ov)
                );
                $db->delete(
                    'publication_parameter_type_rel',
                    array(
                     'PublicationID'   => $id,
                     'ParameterTypeID' => $ptID,
                    )
                );
            }
        }
    }
}

/**
 * Edit file upload fields
 *
 * @param int $id publication ID
 *
 * @return null
 */
function editUploads($id)
{
    $db = \Database::singleton();

    $pubUploads = $db->pselectWithIndexKey(
        'SELECT * FROM publication_upload WHERE PublicationID=:pid',
        array('pid' => $id),
        'PublicationUploadID'
    );

    $toUpdate = array();
    foreach ($pubUploads as $puid => $data) {
        $citationIndex = 'existingUpload_publicationCitation_' . $puid;
        $versionIndex  = 'existingUpload_publicationVersion_' . $puid;

        $cit = isset($_REQUEST[$citationIndex]) ? $_REQUEST[$citationIndex] : null;
        $ver = isset($_REQUEST[$versionIndex]) ? $_REQUEST[$versionIndex] : null;

        if (htmlspecialchars($cit) !== $data['Citation']) {
            $toUpdate[$puid]['Citation'] = $cit;
        }
        if (htmlspecialchars($ver) !== $data['Version']) {
            $toUpdate[$puid]['Version'] = $ver;
        }
    }

    if (!empty($toUpdate)) {
        foreach ($toUpdate as $puid => $data) {
            $db->update(
                'publication_upload',
                $data,
                array('PublicationUploadID' => $puid)
            );
        }
    }
}
/**
 * Utility function to return errors from the server
 *
 * @param string $message error message to display
 *
 * @return void
 */
function showError($message)
{
    if (!isset($message)) {
        $message = 'An unknown error occurred!';
    }
    header('HTTP/1.1 500 Internal Server Error');
    header('Content-Type: application/json; charset=UTF-8');
    die(json_encode(['message' => $message]));
}
