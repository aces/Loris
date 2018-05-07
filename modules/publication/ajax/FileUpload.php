<?php
if (isset($_REQUEST['action'])) {
    $action = $_REQUEST['action'];
    if ($action === 'upload') {
        uploadPublication();
    }  elseif ($action === 'editProject') {
        editProject();
    } else {
        header("HTTP/1.1 400 Bad Request");
    }
}

function uploadPublication()
{
    $db = Database::singleton();
    $user = \User::singleton();
    if (!$user->hasPermission('publication_propose')) {
        header("HTTP/1.1 403 Forbidden");
        exit;
    }

    $titleRaw = isset($_REQUEST['title']) ? $_REQUEST['title'] : null;
    if (!$titleRaw) {
        throw new LorisException('Title is empty');
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
        throw new LorisException('Submitted title already exists');
    }

    // INSERT INTO publication ...
    $uid = $user->getId();
    $today = date('Y-m-d');
    $fields = array(
        'UserID' => $uid,
        'Title' => $titleRaw, // insert titleRaw to avoid double escaping
        'Description' => $_REQUEST['description'],
        'LeadInvestigator' => $_REQUEST['leadInvestigator'],
        'LeadInvestigatorEmail' => $_REQUEST['leadInvestigatorEmail'],
        'DateProposed' => $today,
    );

    $db->insert('publication', $fields);

    $pubID = $db->pselectOne(
        'SELECT PublicationID ' .
        'FROM publication ' .
        'WHERE Title=:t',
        array('t' => $titleProc)
    );
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
        header("HTTP/1.1 400 Bad Request");
        cleanup($pubID);
        echo $e->getMessage();
    }

    notifySubmission($pubID);
}

function insertFiles($pubID) {
    if (empty($_FILES)) {
        return;
    }
    $db = Database::singleton();
    // TODO: make configurable
    $publicationPath = "/data/publication_uploads/";

    if (!isset($publicationPath)) {
        throw new LorisException("Error! Publication path is not set in Loris Settings!");
    }

    if (!file_exists($publicationPath)) {
        throw new LorisException("Error! The upload folder '$publicationPath' does not exist!'");
    }

    foreach ($_FILES as $name => $values){
        $fileName  = preg_replace('/\s/', '_', $values["name"]);
        $fileType  = $_FILES["file"]["type"];
        $extension = pathinfo($fileName)['extension'];
        $index     = preg_split('/_/', $name)[1];

        if (!isset($extension)) {
            throw new LorisException("Please make sure your file has a valid extension!");
        }

        $pubUploadInsert = array(
            'PublicationID'           => $pubID,
            'PublicationUploadTypeID' => $_REQUEST['publicationType_'.$index],
            'URL'                     => $fileName,
            'Citation'                => $_REQUEST['publicationCitation_'.$index],
            'Version'                 => $_REQUEST['publicationVersion_'.$index],
        );

        if (move_uploaded_file($values["tmp_name"], $publicationPath . $fileName)) {
            $db->insert('publication_upload', $pubUploadInsert);
        } else {
            throw new LorisException("Could not upload the file. Please try again!");
        }
    }
}

function insertCollaborators($pubID) {
    if (!$_REQUEST['collaborators']) {
        return;
    }
    $db = Database::singleton();

    $collaborators = json_decode($_REQUEST['collaborators']);
    foreach ($collaborators as $c) {
        $cid = $db->pselectOne(
            'SELECT PublicationCollaboratorID '.
            'FROM publication_collaborator '.
            'WHERE Name=:c',
            array('c' => $c)
        );
        // if collaborator does not already exist in table, add them
        if (!$cid) {
            $collabInsert = array('Name' => $c);
            $cEnc = preg_replace('/\.|\s/', '_', $c); // .'s and spaces get converted to underscores
            $collabInsert['Email'] = isset($_REQUEST['collabEmail'.$cEnc]) ? $_REQUEST['collabEmail'.$cEnc] : null;

            $db->insert(
                'publication_collaborator',
                $collabInsert
            );
            $cid = $db->pselectOne(
                'SELECT PublicationCollaboratorID ' .
                'FROM publication_collaborator ' .
                'WHERE Name=:c',
                array('c' => $c)
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

function insertEditors($pubID) {
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

function insertKeywords($pubID) {
    if (empty($_REQUEST['keywords'])) {
        return;
    }
    $db = Database::singleton();
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
            $kwID = $db->pselectOne(
                'SELECT PublicationKeywordID ' .
                'FROM publication_keyword ' .
                'WHERE Label=:kw',
                array('kw' => $kw)
            );
        }
        // add it pub_kw_rel table
        // get publication ID
        $pubKWRelInsert = array(
            'PublicationID' => $pubID,
            'PublicationKeywordID' => $kwID,
        );

        $db->insert(
            'publication_keyword_rel',
            $pubKWRelInsert
        );

    }
}

function insertVOIs($pubID) {
    if (empty($_REQUEST['voiFields'])) {
        return;
    }
    $db = Database::singleton();
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
        } elseif (in_array($vf, $paramTypes)){
            $pubParamTypeRelInsert = array(
                'ParameterTypeID' => array_search($vf, $paramTypes),
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

function cleanup($pubID) {
    $db    = Database::singleton();
    $where = array(
        'PublicationID' => $pubID
    );

    $tables = array(
        'publication_users_edit_perm_rel',
        'publication_upload',
        'publication_parameter_type_rel',
        'publication_collaborator_rel',
        'publication_keyword_rel',
        'publication',
    );

    foreach ($tables as $table) {
        $db->delete($table, $where);
    }

    // TODO: delete uploaded files
}

function notifySubmission($pubID) {
    $db = \Database::singleton();
    $config = \NDB_Config::singleton();
    $emailData = array();

    $data = $db->pselectRow(
        "SELECT Title, DateProposed, LeadInvestigatorEmail ".
        "FROM publication ".
        "WHERE PublicationID=:pubID",
        array('pubID' => $pubID)
    );
    $url = $config->getSetting('url');

    $emailData['Title'] = $data['Title'];
    $emailData['Date'] = $data['DateProposed'];
    $emailData['URL'] = $url . '/publication/view_project/?id='.$pubID;

    $cc = json_decode($_REQUEST['toNotify']);
    /*$notify = new NDB_Notifier('publication', 'submission', $emailData);
    $notify->notify();*/
    Email::send(
        $data['LeadInvestigatorEmail'],
        'publication_submission.tpl',
        $emailData,
        '', // reply_to
        '', // from
        $cc
    );
}

function editProject() {
    $user = \User::singleton();

    $id                     = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;
    $statusID               = isset($_REQUEST['status']) ? $_REQUEST['status'] : null;
    $rejectReason           = isset($_REQUEST['rejectReason']) ? $_REQUEST['rejectReason'] : null;
    $description            = isset($_REQUEST['description']) ? $_REQUEST['description'] : null;
    $leadInvestigator       = isset($_REQUEST['leadInvestigator']) ? $_REQUEST['leadInvestigator'] : null;
    $leadInvestigatorEmail  = isset($_REQUEST['leadInvestigatorEmail']) ? $_REQUEST['leadInvestigatorEmail'] : null;
    $usersWithEditPerm      = isset($_REQUEST['usersWithEditPerm']) ? json_decode($_REQUEST['usersWithEditPerm']) : null;
    $collaborators          = isset($_REQUEST['collaborators']) ? json_decode($_REQUEST['collaborators']) : null;
    $keywords               = isset($_REQUEST['keywords']) ? json_decode($_REQUEST['keywords']) : null;


    $db = \Database::singleton();

    $pubData = $db->pselectRow(
        'SELECT * FROM publication WHERE PublicationID=:pid',
        array('pid' => $id)
    );

    // build array of changed values
    $toUpdate = array();

    if ($pubData['Description'] !== $description) {
        $toUpdate['Description'] = $description;
    }
    if ($pubData['LeadInvestigator'] !== $leadInvestigator) {
        $toUpdate['LeadInvestigator'] = $leadInvestigator;
    }
    if ($pubData['LeadInvestigatorEmail'] !== $leadInvestigatorEmail) {
        $toUpdate['LeadInvestigatorEmail'] = $leadInvestigatorEmail;
    }

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
        foreach($oldUWEP as $uid) {
            $db->delete(
                'publication_users_edit_perm_rel',
                array('UserID' => $uid)
            );
        }
    }

    $currentCollabs = $db->pselectCol(
        'SELECT Name FROM publication_collaborator pc '.
        'LEFT JOIN publication_collaborator_rel pcr '.
        'ON pcr.PublicationCollaboratorID=pc.PublicationCollaboratorID '.
        'WHERE pcr.PublicationID=:pid',
        array('pid' => $id)
    );
    
    if ($collaborators != $currentCollabs) {
        $newCollabs = array_diff($collaborators, $currentCollabs);
        $oldCollabs = array_diff($currentCollabs, $collaborators);
    }
    if (!empty($newCollabs)) {
        insertCollaborators($id);
    }
    if (!empty($oldCollabs)) {
        foreach($oldCollabs as $name) {
            $uid = $db->pselectOne(
                'SELECT PublicationCollaboratorID '.
                'FROM publication_collaborator '.
                'WHERE Name=:n',
                array('n' => $name)
            );
            $db->delete(
                'publication_collaborator_rel',
                array('PublicationCollaboratorID' => $uid)
            );
        }
    }
    if(!empty($toUpdate)) {
        $db->update(
            'publication',
            $toUpdate,
            array('PublicationID' => $id)
        );
    }
}
