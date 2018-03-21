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
        processCollaborators($pubID);
        // INSERT INTO publication_users_edit_perm_rel
        processEditors($pubID);
        // INSERT INTO publication_keyword
        processKeywords($pubID);
        // INSERT INTO publication_parameter_type_rel
        processVOIs($pubID);
    } catch (Exception $e) {
        cleanup($pubID);
        echo $e->getMessage();
    }

    notifySubmission($pubID);
}

function processFiles($pubID) {
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

function processCollaborators($pubID) {
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
        $db->insert(
            'publication_collaborator_rel',
            $collabRelInsert
        );
    }
}

function processEditors($pubID) {
    if (empty($_REQUEST['usersWithEditPerm'])) {
        return;
    }

    $db = Database::singleton();
    $usersWithEditPerm = json_decode($_REQUEST['usersWithEditPerm']);
    foreach ($usersWithEditPerm as $u) {
        $uid = $db->pselectOne(
            'SELECT ID FROM users WHERE UserID=:u',
            array('u' => $u)
        );

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

function processKeywords($pubID) {
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

function processVOIs($pubID) {
    if (empty($_REQUEST['voiFields'])) {
        return;
    }
    $db = Database::singleton();
    $voiFields = json_decode($_REQUEST['voiFields']);
    foreach ($voiFields as $vf) {
        // if AllFields option is selected, grab all entries for provided instrument
        if (substr($vf, -strlen('_AllFields')) === '_AllFields') {
            $inst = substr($vf, 0, strlen($vf) - strlen('_AllFields'));
            $varIDs = $db->pselectCol(
                'SELECT ParameterTypeID FROM parameter_type WHERE SourceFrom=:src',
                array('src' => $inst)
            );

            foreach ($varIDs as $v) {
                $pubParamTypeRelInsert = array(
                    'PublicationID' => $pubID,
                    'ParameterTypeID' => $v
                );

                $db->insertIgnore(
                    'publication_parameter_type_rel',
                    $pubParamTypeRelInsert
                );
            }
        } else {
            $varID = $db->pselectOne(
                "SELECT ParameterTypeID FROM parameter_type WHERE Name=:n",
                array('n' => $vf)
            );

            $pubParamTypeRelInsert = array(
                'PublicationID' => $pubID,
                'ParameterTypeID' => $varID
            );

            $db->insertIgnore('publication_parameter_type_rel', $pubParamTypeRelInsert);
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
    $id           = isset($_REQUEST['id']) ? $_REQUEST['id'] : null;
    $statusID     = isset($_REQUEST['status']) ? $_REQUEST['status'] : null;
    $rejectReason = isset($_REQUEST['rejectReason']) ? $_REQUEST['rejectReason'] : null;
    $db = \Database::singleton();

    $pubData = $db->pselectRow(
        'SELECT * FROM publication WHERE PublicationID=:pid',
        array('pid' => $id)
    );

    // build array of changed values
    $toUpdate = array();

    if ($pubData['Description'] !== $_REQUEST['description']) {
        $toUpdate['Description'] = $_REQUEST['description'];
    }
    if ($pubData['LeadInvestigator'] !== $_REQUEST['leadInvestigator'] ) {
        $toUpdate['LeadInvestigator'] = $_REQUEST['leadInvestigator'];
    }
    if ($pubData['LeadInvestigatorEmail'] !== $_REQUEST['leadInvestigatorEmail']) {
        $toUpdate['LeadInvestigatorEmail'] = $_REQUEST['leadInvestigatorEmail'];
    }

    $collaborators = json_decode($_REQUEST['collaborators']);
    $currentCollabs = $db->pselectCol(
        'SELECT Name FROM publication_collaborator pc '.
        'LEFT JOIN publication_collaborator_rel pcr '.
        'ON pcr.PublicationCollaboratorID=pc.PublicationCollaboratorID '.
        'LEFT JOIN publication p ON p.PublicationID=pcr.PublicationID '.
        'WHERE p.PublicationID=:pid',
        array('pid' => $id)
    );
    
    if ($collaborators != $currentCollabs) {
        // new collaborators will be in array_diff result of entered vs stored
        $newCollabs = array_diff($collaborators, $currentCollabs);

        // collaborators who should be removed will appear in inverse operation
        $oldCollabs = array_diff($currentCollabs, $collaborators);
        error_log(print_r($oldCollabs, true));
    }

    /*$db->update(
        'publication',
        $toUpdate,
        array('PublicationID' => $id)
    );*/
}