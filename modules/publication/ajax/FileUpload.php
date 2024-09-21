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
        http_response_code(400);
        exit;
    }
}

/**
 * Function for new publications
 *
 * @return void
 */
function uploadPublication() : void
{
    $factory = \NDB_Factory::singleton();
    $db      = $factory->database();
    $user    = $factory->user();
    if (!$user->hasPermission('publication_propose')
        || !$user->hasPermission('publication_view')
    ) {
        showPublicationError("You do not have permission to propose a project", 403);
        return;
    }

    $title = $_POST['title'] ?? null;
    if (!$title) {
        showPublicationError('Title is empty', 400);
    }

    // back end validation for title uniqueness constraint
    $exists = $db->pselectOne(
        "SELECT PublicationID " .
        "FROM publication " .
        "WHERE Title=:t",
        ['t' => $title]
    );

    if ($exists) {
        showPublicationError('Submitted title already exists', 400);
    }
    $desc    = $_POST['description'] ?? null;
    $project = $_POST['project'] ?? null;
    $publishingStatus = $_POST['publishingStatus'] ?? null;
    $datePublication  = $_POST['datePublication'] ?? null;
    $journal          = $_POST['journal'] ?? null;
    $doi        = $_POST['doi'] ?? null;
    $link       = $_POST['link'] ?? null;
    $leadInvest = $_POST['leadInvestigator'] ?? null;
    $leadInvestEmail = $_POST['leadInvestigatorEmail'] ?? null;

    // check if lead investigator already exists in collaborator table
    // use ID if exists, else insert
    $leadInvID = $db->pselectOne(
        'SELECT PublicationCollaboratorID '.
        'FROM publication_collaborator '.
        'WHERE Name = :n AND Email = :e',
        [
            'e' => $leadInvestEmail,
            'n' => $leadInvest,
        ]
    );
    if (empty($leadInvID)) {
        $db->insert(
            'publication_collaborator',
            [
                'Name'  => $leadInvest,
                'Email' => $leadInvestEmail,
            ]
        );

        $leadInvID = $db->getLastInsertId();
    }
    if (!isset($desc, $leadInvest, $leadInvestEmail)) {
        showPublicationError('A mandatory field is missing!', 400);
    }
    // INSERT INTO publication ...
    $uid   = $user->getId();
    $today = date('Y-m-d');
    // insert the title to avoid double escaping
    $fields = [
        'UserID'             => $uid,
        'Title'              => $title,
        'Description'        => $desc,
        'project'            => $project,
        'publishingStatus'   => $publishingStatus,
        'datePublication'    => $datePublication,
        'journal'            => $journal,
        'doi'                => $doi,
        'link'               => $link,
        'LeadInvestigatorID' => $leadInvID,
        'DateProposed'       => $today,
    ];

    $db->insert('publication', $fields);
    $pubID = intval($db->getLastInsertId());

    // give creator permission to edit
    $db->insert(
        'publication_users_edit_perm_rel',
        [
            'PublicationID' => $pubID,
            'UserID'        => $uid,
        ]
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
    } catch (Exception $e) {
        cleanup($pubID);
        showPublicationError($e->getMessage(), 500);
    }

    notify($pubID, 'submission', $_POST['baseURL']);
}

/**
 * Function for storing files and inserting file meta data into database
 *
 * @param int $pubID ID of Publication in publication table
 *
 * @return void
 */
function processFiles($pubID) : void
{
    if (empty($_FILES)) {
        return;
    }
    $factory = \NDB_Factory::singleton();
    $db      = $factory->database();
    $config  = \NDB_Config::singleton();

    $publicationPath = $config->getSetting('publication_uploads');

    if (!is_dir($publicationPath)) {
        throw new ConfigurationException(
            "Error! The upload folder '$publicationPath' does not exist!"
        );
    }

    // append trailing slash if trailing slash isn't present in configured directory
    $publicationPath .= substr($publicationPath, -1) === '/' ? '' : '/';
    foreach ($_FILES as $name => $values) {
        $fileName = preg_replace('/\s/', '_', $values["name"]);
        if (file_exists($publicationPath . $fileName)) {
            throw new LorisException("File $fileName already exists!");
        }

        if (!isset(pathinfo($fileName)['extension'])) {
            throw new LorisException(
                "Please make sure your file has a valid extension: " .
                $values['name']
            );
        }

        $index = preg_split('/_/', $name)[1];

        $pubTypeID       = $_POST['publicationType_'.$index] ?? null;
        $pubCitation     = $_POST['publicationCitation_'.$index] ?? null;
        $pubVersion      = $_POST['publicationVersion_'.$index] ?? null;
        $pubUploadInsert = [
            'PublicationID'           => $pubID,
            'PublicationUploadTypeID' => $pubTypeID,
            'Filename'                => basename($fileName),
            'Citation'                => $pubCitation,
            'Version'                 => $pubVersion,
        ];

        if (move_uploaded_file($values["tmp_name"], $publicationPath . $fileName)) {
            $db->insert('publication_upload', $pubUploadInsert);
        } else {
            throw new LorisException(
                "Could not upload the file. Please try again!"
            );
        }
    }
}

/**
 * Insert new collaborators into collaborator table and/or put them in rel table
 * Does NOT include insert for lead investigator
 *
 * @param int $pubID the publication ID
 *
 * @return void
 */
function insertCollaborators(int $pubID) : void
{
    if (!isset($_POST['collaborators'])) {
        return;
    }
    $db = \NDB_Factory::singleton()->database();

    $collaborators = json_decode($_POST['collaborators'], true);
    foreach ($collaborators as $c) {
        $cid = $db->pselectOne(
            'SELECT PublicationCollaboratorID '.
            'FROM publication_collaborator '.
            'WHERE Name=:c',
            ['c' => $c['name']]
        );
        // if collaborator does not already exist in table, add them
        if (!$cid) {
            $collabInsert = [
                'Name'  => $c['name'],
                'Email' => $c['email'],
            ];

            $db->insert(
                'publication_collaborator',
                $collabInsert
            );
            $cid = $db->pselectOne(
                'SELECT PublicationCollaboratorID ' .
                'FROM publication_collaborator ' .
                'WHERE Name=:c',
                ['c' => $c['name']]
            );
        }
        $collabRelInsert = [
            'PublicationID'             => $pubID,
            'PublicationCollaboratorID' => $cid,
        ];
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
 * @return void
 */
function insertEditors(int $pubID) : void
{
    if (empty($_POST['usersWithEditPerm'])) {
        return;
    }

    $db = \NDB_Factory::singleton()->database();
    $usersWithEditPerm = json_decode($_POST['usersWithEditPerm']);
    foreach ($usersWithEditPerm as $uid) {
        $insert = [
            'PublicationID' => $pubID,
            'UserID'        => $uid,
        ];

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
 * @return void
 */
function insertKeywords(int $pubID) : void
{
    if (empty($_POST['keywords'])) {
        return;
    }
    $db       = \NDB_Factory::singleton()->database();
    $keywords = json_decode($_POST['keywords']);
    foreach ($keywords as $kw) {
        // check if keyword exists
        $kwID = $db->pselectOne(
            'SELECT PublicationKeywordID ' .
            'FROM publication_keyword ' .
            'WHERE Label=:kw',
            ['kw' => $kw]
        );
        // if it doesn't, add it to keyword table and retrieve ID
        if (empty($kwID)) {
            $kwInsert = ['Label' => $kw];
            $db->insert(
                'publication_keyword',
                $kwInsert
            );
            $kwID = $db->getLastInsertId();
        }
        // add it pub_kw_rel table
        // get publication ID
        $pubKWRelInsert = [
            'PublicationID'        => $pubID,
            'PublicationKeywordID' => $kwID,
        ];

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
 * @return void
 */
function insertVOIs(int $pubID) : void
{

    if (empty($_POST['voiFields'])) {
        return;
    }
    $db        = \NDB_Factory::singleton()->database();
    $testNames = $db->pselectColWithIndexKey(
        'SELECT ID, Test_name FROM test_names',
        [],
        'ID'
    );

    $paramTypes = $db->pselectColWithIndexKey(
        'SELECT ParameterTypeID, Name FROM parameter_type',
        [],
        'ParameterTypeID'
    );

    $voiFields = json_decode($_POST['voiFields']);
    foreach ($voiFields as $vf) {
        // search test_names for value
        if (in_array($vf, $testNames, true)) {
            $pubTNRelInsert = [
                'TestNameID'    => array_search($vf, $testNames),
                'PublicationID' => $pubID,
            ];
            $db->insertIgnore(
                'publication_test_names_rel',
                $pubTNRelInsert
            );
        } elseif (in_array($vf, $paramTypes, true)) {
            $ptID = array_search($vf, $paramTypes, true);
            $pubParamTypeRelInsert = [
                'ParameterTypeID' => $ptID,
                'PublicationID'   => $pubID,
            ];

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
 * @return void
 */
function cleanup(int $pubID) : void
{
    $db    = \NDB_Factory::singleton()->database();
    $where = ['PublicationID' => $pubID];

    $tables = [
        'publication_users_edit_perm_rel',
        'publication_parameter_type_rel',
        'publication_test_names_rel',
        'publication_collaborator_rel',
        'publication_keyword_rel',
    ];

    foreach ($tables as $table) {
        $db->delete($table, $where);
    }

    $files = $db->pselectCol(
        'SELECT Filename FROM publication_upload WHERE PublicationID=:PublicationID',
        $where
    );
    if (!empty($files)) {
        $config = \NDB_Config::singleton();
        $src    = $config->getSetting('publication_uploads');
        $dest   = $config->getSetting('publication_deletions');
        foreach ($files as $f) {
            rename($src . $f, $dest . $f);
        }
        $db->delete('publication_upload', $where);
    }
    $db->delete('publication', $where);
}

/**
 * Send out email notifications for project submission
 *
 * @param int    $pubID   publication ID
 * @param string $type    The notification type i.e., submission|edit|review
 * @param string $baseURL the base URL of the loris site
 *
 * @return void
 */
function notify($pubID, $type, $baseURL) : void
{
    $acceptedTypes = [
        'submission',
        'edit',
        'review',
    ];

    if (!in_array($type, $acceptedTypes)) {
        showPublicationError("Unexpected notification type: $type", 400);
    }

    $factory   = \NDB_Factory::singleton();
    $db        = $factory->database();
    $config    = \NDB_Config::singleton();
    $user      = $factory->user();
    $emailData = [];

    $data = $db->pselectRow(
        "SELECT Title, DateProposed, pc.Email as LeadInvestigatorEmail " .
        "FROM publication p " .
        "LEFT JOIN publication_collaborator pc ".
        "ON p.LeadInvestigatorID=pc.PublicationCollaboratorID " .
        "WHERE PublicationID=:pubID",
        ['pubID' => $pubID]
    );
    if (is_null($data)) {
        error_log(
            'No data found for publication with ID $pudID. Cannot send '
            . 'email.'
        );
        throw new \LorisException('Invalid publication ID specified.');
    }

    $emailData['Title']       = $data['Title'];
    $emailData['Date']        = $data['DateProposed'];
    $emailData['User']        = $user->getFullname();
    $emailData['URL']         = $baseURL . '/publication/view_project/?id='.$pubID;
    $emailData['ProjectName'] = $config->getSetting('prefix');
    $Notifier = new \NDB_Notifier(
        "publication",
        $type
    );
    $msg_data = [
        'URL'         => $emailData['URL'],
        'Title'       => $emailData['Title'],
        'User'        => $emailData['User'],
        'ProjectName' => $emailData['ProjectName'],
        'Date'        => $emailData['Date']
    ];
    $Notifier->notify($msg_data);
    $sendTo = isset($_POST['notifyLead']) && $_POST['notifyLead'] === 'true'
        ? [$data['LeadInvestigatorEmail']] : [];
    // get collaborators to notify
    $collaborators = isset($_POST['collaborators'])
        ? json_decode($_POST['collaborators'], true) : [];

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
 * @return void
 */
function editProject() : void
{
    $db = \NDB_Factory::singleton()->database();
    $id = isset($_REQUEST['id']) ? intval($_REQUEST['id']) : null;

    if (isset($id)) {
        // double check that current user has edit access
        $factory     = \NDB_Factory::singleton();
        $user        = $factory->user();
        $creatorUser = $db->pselectOne(
            'SELECT UserID FROM publication WHERE PublicationID=:id',
            ['id' => $id]
        );

        $editors = $db->pselectCol(
            'SELECT UserID FROM publication_users_edit_perm_rel '.
            'WHERE PublicationID=:id',
            ['id' => $id]
        );
        $uid     = $user->getId();
        if ($uid !== $creatorUser
            && !in_array($uid, $editors)
            && !$user->hasPermission('publication_approve')
        ) {
            showPublicationError(
                "You do not have edit or approval access for this project!",
                403
            );
        }
    } else {
        showPublicationError('No Publication ID provided', 400);
    }

    $title            = $_POST['title'] ?? null;
    $statusID         = $_POST['status'] ?? null;
    $rejectedReason   = $_POST['rejectedReason'] ?? null;
    $description      = $_POST['description'] ?? null;
    $project          = $_POST['project'] ?? null;
    $publishingStatus = $_POST['publishingStatus'] ?? null;
    $datePublication  = $_POST['datePublication'] ?? null;
    $journal          = $_POST['journal'] ?? null;
    $doi  = $_POST['doi'] ?? null;
    $link = $_POST['link'] ?? null;
    $leadInvestigator      = $_POST['leadInvestigator'] ?? null;
    $leadInvestigatorEmail = $_POST['leadInvestigatorEmail'] ?? null;

    $pubData = $db->pselectRow(
        'SELECT p.*, pc.Name as LeadInvestigator, ' .
        'pc.Email as LeadInvestigatorEmail ' .
        'FROM publication p ' .
        'LEFT JOIN publication_collaborator pc '.
        'ON p.LeadInvestigatorID=pc.PublicationCollaboratorID '.
        'WHERE PublicationID=:pid',
        ['pid' => $id]
    );
    if (empty($pubData)) {
        throw new \LorisException(
            'Could not find publication data for specified ID'
        );
    }

    // build array of changed values
    $toUpdate        = [];
    $leadInvToUpdate = [];
    if ($pubData['Title'] !== $title) {
        $toUpdate['Title'] = $title;
    }
    if ($pubData['PublicationStatusID'] !== $statusID) {
        $toUpdate['PublicationStatusID'] = $statusID;
    }
    if ($pubData['RejectedReason'] !== $rejectedReason) {
        $toUpdate['RejectedReason'] = $rejectedReason;
    }
    if ($pubData['Description'] !== $description) {
        $toUpdate['Description'] = $description;
    }
    if ($pubData['project'] !== $project) {
        $toUpdate['project'] = $project;
    }
    if ($pubData['publishingStatus'] !== $publishingStatus) {
        $toUpdate['publishingStatus'] = $publishingStatus;
    }
    if ($pubData['datePublication'] !== $datePublication) {
        $toUpdate['datePublication'] = $datePublication;
    }
    if ($pubData['journal'] !== $journal) {
        $toUpdate['journal'] = $journal;
    }
    if ($pubData['doi'] !== $doi) {
        $toUpdate['doi'] = $doi;
    }
    if ($pubData['link'] !== $link) {
        $toUpdate['link'] = $link;
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
        notify($id, 'review', $_POST['baseURL']);
    } else {
        // otherwise send edit email
        notify($id, 'edit', $_POST['baseURL']);
    }
    if (!empty($toUpdate)) {
        $db->update(
            'publication',
            $toUpdate,
            ['PublicationID' => $id]
        );
    }
    if (!empty($leadInvToUpdate)) {
        $db->update(
            'publication_collaborator',
            $leadInvToUpdate,
            ['PublicationCollaboratorID' => $pubData['LeadInvestigatorID']]
        );
    }
}

/**
 * Edit users with edit permission
 *
 * @param int $id publication ID
 *
 * @return void
 */
function editEditors($id) : void
{
    $db = \NDB_Factory::singleton()->database();
    $usersWithEditPerm = isset($_POST['usersWithEditPerm'])
        ? json_decode($_POST['usersWithEditPerm']) : null;

    $currentUWEP = $db->pselectCol(
        'SELECT UserID '.
        'FROM publication_users_edit_perm_rel '.
        'WHERE PublicationID=:pid',
        ['pid' => $id]
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
                [
                    'UserID'        => $uid,
                    'PublicationID' => $id,
                ]
            );
        }
    }
}

/**
 * Edit collaborators
 *
 * @param int $id Publication ID
 *
 * @return void
 */
function editCollaborators($id) : void
{
    $db = \NDB_Factory::singleton()->database();
    $submittedCollaborators = isset($_POST['collaborators'])
        ? json_decode($_POST['collaborators'], true) : null;

    $currentCollabs       = $db->pselectCol(
        'SELECT Name FROM publication_collaborator pc '.
        'LEFT JOIN publication_collaborator_rel pcr '.
        'ON pcr.PublicationCollaboratorID=pc.PublicationCollaboratorID '.
        'WHERE pcr.PublicationID=:pid',
        ['pid' => $id]
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
                ['n' => $name]
            );
            $db->delete(
                'publication_collaborator_rel',
                [
                    'PublicationCollaboratorID' => $cid,
                    'PublicationID'             => $id,
                ]
            );
        }
    }
    // update emails if any have changed
    $currentCollabs = iterator_to_array(
        $db->pselect(
            'SELECT Name, Email FROM publication_collaborator pc '.
            'LEFT JOIN publication_collaborator_rel pcr '.
            'ON pcr.PublicationCollaboratorID=pc.PublicationCollaboratorID '.
            'WHERE pcr.PublicationID=:pid',
            ['pid' => $id]
        )
    );

    $currCollabEmails      = array_column($currentCollabs, 'email');
    $submittedCollabEmails = array_column($submittedCollaborators, 'email');
    $staleEmails           = [];
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
                ['Email' => $newEmail],
                ['Name' => $name]
            );
        }
    }
}

/**
 * Edit keywords
 *
 * @param int $id if the legends are to be believed, this is the Publication ID...
 *
 * @return void
 */
function editKeywords($id) : void
{
    $db       = \NDB_Factory::singleton()->database();
    $keywords = isset($_POST['keywords'])
        ? json_decode($_POST['keywords']) : null;

    $currentKW = $db->pselectCol(
        'SELECT Label FROM publication_keyword pk '.
        'LEFT JOIN publication_keyword_rel pkr '.
        'ON pk.PublicationKeywordID=pkr.PublicationKeywordID '.
        'WHERE pkr.PublicationID=:pid',
        ['pid' => $id]
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
                ['kw' => $kw]
            );

            $db->delete(
                'publication_keyword_rel',
                [
                    'PublicationKeywordID' => $kid,
                    'PublicationID'        => $id,
                ]
            );
        }
    }
}

/**
 * Edit Variables of Interest
 *
 * @param int $id Could be a publication ID, probably is, who knows for sure?
 *
 * @return void
 */
function editVOIs($id) : void
{
    $db  = \NDB_Factory::singleton()->database();
    $voi = isset($_POST['voiFields'])
        ? json_decode($_POST['voiFields']) : null;

    $fields    = $db->pselectCol(
        'SELECT pt.Name AS field ' .
        'FROM parameter_type pt '.
        'LEFT JOIN publication_parameter_type_rel pptr '.
        'ON pptr.ParameterTypeID=pt.ParameterTypeID '.
        'WHERE pptr.PublicationID=:pid',
        ['pid' => $id]
    );
    $testNames = $db->pselectCol(
        'SELECT Test_name '.
        'FROM publication_test_names_rel ptnr '.
        'LEFT JOIN test_names tn '.
        'ON tn.ID=ptnr.TestNameID '.
        'WHERE PublicationID=:pid',
        ['pid' => $id]
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
                ['tn' => $ov]
            );
            if ($tnID) {
                $db->delete(
                    'publication_test_names_rel',
                    [
                        'PublicationID' => $id,
                        'TestNameID'    => $tnID,
                    ]
                );
            } else {
                $ptID = $db->pselectOne(
                    'SELECT ParameterTypeID FROM parameter_type WHERE Name=:n',
                    ['n' => $ov]
                );
                $db->delete(
                    'publication_parameter_type_rel',
                    [
                        'PublicationID'   => $id,
                        'ParameterTypeID' => $ptID,
                    ]
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
 * @return void
 */
function editUploads($id) : void
{
    $db = \NDB_Factory::singleton()->database();

    $pubUploads = $db->pselectWithIndexKey(
        'SELECT * FROM publication_upload WHERE PublicationID=:pid',
        ['pid' => $id],
        'PublicationUploadID'
    );

    $toUpdate = [];
    foreach ($pubUploads as $puid => $data) {
        $citationIndex = 'existingUpload_publicationCitation_' . $puid;
        $versionIndex  = 'existingUpload_publicationVersion_' . $puid;

        $cit = $_POST[$citationIndex] ?? null;
        $ver = $_POST[$versionIndex] ?? null;

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
                ['PublicationUploadID' => $puid]
            );
        }
    }
}
/**
 * Utility function to return errors from the server
 *
 * @param string $message error message to display
 * @param int    $code    HTTP response code
 *
 * @return void
 */
function showPublicationError($message, $code = 500) : void
{
    if (!isset($message)) {
        $message = 'An unknown error occurred!';
    }

    http_response_code($code);
    header('Content-Type: application/json; charset=UTF-8');
    exit(json_encode(['message' => $message]));
}
