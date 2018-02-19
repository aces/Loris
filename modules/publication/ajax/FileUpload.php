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



function uploadPublication() {
    $db = Database::singleton();

    $titleRaw = isset($_REQUEST['title']) ? $_REQUEST['title'] : null;
    if (!$titleRaw) {
        throw new LorisException('Title is empty');
    }
    // title that gets inserted is run through htmlspecialchars()
    // so need to query based on Processed title
    $titleProc = htmlspecialchars($titleRaw);

    // back end validation for title uniqueness constraint
    $exists = $db->pselectOne(
        "SELECT PublicationID ".
        "FROM publication ".
        "WHERE Title=:t",
        array('t' => $titleProc)
    );

    if ($exists) {
        throw new LorisException('Submitted title already exists');
    }

    $user = \User::singleton();
    $uid = $user->getId();
    $today = date('Y-m-d');
    $fields = array(
        'UserID'                => $uid,
        'Title'                 => $titleRaw, // insert titleRaw to avoid double escaping
        'Description'           => $_REQUEST['description'],
        'LeadInvestigator'      => $_REQUEST['leadInvestigator'],
        'LeadInvestigatorEmail' => $_REQUEST['leadInvestigatorEmail'],
        'DateProposed'          => $today,
    );

    $db->insert('publication', $fields);

    $pubID = $db->pselectOne(
        'SELECT PublicationID '.
        'FROM publication '.
        'WHERE Title=:t',
        array('t' => $titleProc)
    );

    $keywords = json_decode($_REQUEST['keywords']);
    foreach ($keywords as $kw) {
        // check if keyword exists
        $kwID = $db->pselectOne(
            'SELECT PublicationKeywordID '.
            'FROM publication_keyword '.
            'WHERE Label=:kw',
            array('kw' => $kw)
        );
        // if it doesn't, add it to keyword table and retrieve ID
        if (!$kwID) {
            $kwInsert = array('Label' => $kw);
            $db->insert('publication_keyword', $kwInsert);
            $kwID = $db->pselectOne(
                'SELECT PublicationKeywordID '.
                'FROM publication_keyword '.
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

        $db->insert('publication_keyword_rel', $pubKWRelInsert);
    }

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

                $db->insertIgnore('publication_parameter_type_rel', $pubParamTypeRelInsert);
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
    notifySubmission($pubID);

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
    Email::send(
        $data['LeadInvestigatorEmail'],
        'publication_submission_confirmation.tpl',
        $emailData
    );
}

function editProject() {
    $id = $_REQUEST['id'];
    $status = $_REQUEST['status'];

    $db = \Database::singleton();

    $statusID = $db->pselectOne(
        'SELECT PublicationStatusID FROM publication_status '.
        'WHERE Label=:stat',
        array('stat' => $status)
    );

    $db->update(
        'publication',
        array('PublicationStatusID' => $statusID),
        array('PublicationID' => $id)
    );
}