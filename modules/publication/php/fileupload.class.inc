<?php declare(strict_types=1);

// @phan-file-suppress PhanUnusedProtectedMethodParameter
// Suppressed due to false-positive for doDownloadNotification function
// Unused parameter $file required to match parent signature

namespace LORIS\publication;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles managing files through the /files/* endpoint of the publication
 * module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class FileUpload extends \NDB_Page
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user accessing the file.
     *
     * @return bool
     */
    function _hasAccess(\User $user): bool
    {
        return $user->hasAnyPermission(
            [
                'publication_view',
                'publication_propose',
                'publication_approve',
            ]
        );      
    }
    /**
     * Handle a post form
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
public function handle(ServerRequestInterface $request): ResponseInterface
{
	$method = $request->getMethod();
	    error_log(print_r($_REQUEST,true));

    error_log(print_r($_FILES,true));

    switch ($method) {
        case 'POST': 
           $referer = $request->getHeaderLine('Referer');
	if (str_contains($referer, 'view_project')) {
		// Perform edit logic
		    $queryParams = $request->getQueryParams();
                    $id = $queryParams['id'] ?? null;
		    $this->editProject($id);
	} else {
		    // Perform upload logic
             $this->uploadPublication();
	} 
            break;

        default:
            $message = ['message' => 'Invalid method'];
            return (new \LORIS\Http\Response())
                ->withStatus(400)
                ->withHeader('Content-Type', 'application/json')
                ->withBody(new \LORIS\Http\StringStream(json_encode($message)));
    }

    return (new \LORIS\Http\Response())
        ->withStatus(200)
        ->withHeader("Content-Type", "application/json")
        ->withBody(new \LORIS\Http\StringStream(json_encode("OK")));
}

/**
 * Function for new publications
 *
 */
function uploadPublication()

{
    $factory = \NDB_Factory::singleton();
    $db      = $factory->database();
    $user    = $factory->user();
    $title = $_POST['title'] ?? null;

    // back end validation for title uniqueness constraint
    $exists = $db->pselectOne(
        "SELECT PublicationID " .
        "FROM publication " .
        "WHERE Title=:t",
        ['t' => $title]
    );

    if ($exists) {
    $this->showPublicationError("Title Exists", 500);
        exit;
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
    try {
        $db->insert(
        'publication_collaborator',
        [
            'Name'  => $leadInvest,
            'Email' => $leadInvestEmail,
        ]
        );
            $leadInvID = $db->getLastInsertId();
      } catch (\Exception $e) {
    // Catch any exception and show the error
          return $this->showPublicationError('Lead Investigator Email address already exists.', 400);
         }
    
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
        $this->processFiles($pubID);
        // INSERT INTO publication_collaborator
        $this->insertCollaborators($pubID);
        // INSERT INTO publication_users_edit_perm_rel
        $this->insertEditors($pubID);
        // INSERT INTO publication_keyword
        $this->insertKeywords($pubID);
        // INSERT INTO publication_parameter_type_rel
        $this->insertVOIs($pubID);
    } catch (Exception $e) {
        $this->cleanup($pubID);
        $this->showPublicationError($e->getMessage(), 500);
    }

    $this->notify($pubID, 'submission', $_POST['baseURL']);
        return (new \LORIS\Http\Response())
        ->withStatus(200)
        ->withHeader('Content-Type', 'application/json')
        ->withBody(new \LORIS\Http\StringStream(json_encode(['message' => 'Upload successful'])));
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
	error_log("processFiles");
    if (empty($_FILES)) {
        return;
    }
	        error_log("processFiles==========");
    error_log(print_r($_FILES,true));
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
        $this->showPublicationError("Unexpected notification type: $type", 400);
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
            error_log("notify333333");
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
 */
function editProject($id = null)
{
	error_log("editproject........");
    $db = \NDB_Factory::singleton()->database();

$title                  = $_REQUEST['title'] ?? null;
$statusID               = $_REQUEST['status'] ?? null;
$rejectedReason         = $_REQUEST['rejectedReason'] ?? null;
$description            = $_REQUEST['description'] ?? null;
$project                = $_REQUEST['project'] ?? null;
$publishingStatus       = $_REQUEST['publishingStatus'] ?? null;
$datePublication        = $_REQUEST['datePublication'] ?? null;
$journal                = $_REQUEST['journal'] ?? null;
$doi                    = $_REQUEST['doi'] ?? null;
$link                   = $_REQUEST['link'] ?? null;
$leadInvestigator       = $_REQUEST['leadInvestigator'] ?? null;
$leadInvestigatorEmail  = $_REQUEST['leadInvestigatorEmail'] ?? null;


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
    $exists = $db->pselectOne(
        "SELECT PublicationID " .
        "FROM publication " .
        "WHERE Title=:t AND PublicationID != :id",
        ['t' => $title, 'id' =>$id]
    );
    if (intval($exists)) {    
        $this->showPublicationError("Title Exists", 500);
        exit;
    }
    $this->editEditors($id);
    $this->editCollaborators($id);
    $this->editKeywords($id);
    $this->editVOIs($id);
    $this->editUploads($id);
    $this->processFiles($id);
    // if publication status is changed, send review email
    if (isset($toUpdate['PublicationStatusID'])) {
        $this->notify($id, 'review', $_REQUEST['baseURL']);
    } else {
        // otherwise send edit email
        $this->notify($id, 'edit', $_REQUEST['baseURL']);
    }
    if (!empty($toUpdate)) {
        $db->update(
            'publication',
            $toUpdate,
            ['PublicationID' => $id]
        );
    }
    try {    
        if (!empty($leadInvToUpdate)) {
            $db->update(
                'publication_collaborator',
                $leadInvToUpdate,
                ['PublicationCollaboratorID' => $pubData['LeadInvestigatorID']]
            );
        }
    } catch (\Exception $e) {
          return $this->showPublicationError('Lead Investigator Email address already exists.', 400);
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
    $usersWithEditPerm = isset($_REQUEST['usersWithEditPerm'])
        ? json_decode($_REQUEST['usersWithEditPerm']) : null;

    $currentUWEP = $db->pselectCol(
        'SELECT UserID '.
        'FROM publication_users_edit_perm_rel '.
        'WHERE PublicationID=:pid',
        ['pid' => $id]
    );

// Ensure $currentUWEP is an array
$currentUWEP = is_array($currentUWEP) ? $currentUWEP : [];

if ($usersWithEditPerm != $currentUWEP) {
    // Ensure $usersWithEditPerm is an array
    $usersWithEditPerm = is_array($usersWithEditPerm) ? $usersWithEditPerm : [];

    // new UWEP will be in array_diff result of submitted vs stored
    $newUWEP = array_diff($usersWithEditPerm, $currentUWEP);
    // old UWEP who should be removed will appear in inverse operation
    $oldUWEP = array_diff($currentUWEP, $usersWithEditPerm);
}
    if (!empty($newUWEP)) {
        $this->insertEditors(intval($id));
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
    $submittedCollaborators = isset($_REQUEST['collaborators'])
        ? json_decode($_REQUEST['collaborators'], true) : null;

    $currentCollabs       = $db->pselectCol(
        'SELECT Name FROM publication_collaborator pc '.
        'LEFT JOIN publication_collaborator_rel pcr '.
        'ON pcr.PublicationCollaboratorID=pc.PublicationCollaboratorID '.
        'WHERE pcr.PublicationID=:pid',
        ['pid' => $id]
    );

// Ensure $currentCollabs is an array
$currentCollabs = is_array($currentCollabs) ? $currentCollabs : [];

// Ensure $submittedCollaborators is an array
$submittedCollaborators = is_array($submittedCollaborators) ? $submittedCollaborators : [];

// Extract 'name' column from $submittedCollaborators
$submittedCollabNames = array_column($submittedCollaborators, 'name');

$currCollabNames = (array) $currCollabNames;  // Ensure it's an array
$submittedCollabNames = (array) $submittedCollabNames; // Ensure it's an array

if ($submittedCollabNames != $currCollabNames) {
    $newCollabs = array_diff($submittedCollabNames, $currCollabNames);
    $oldCollabs = array_diff($currCollabNames, $submittedCollabNames);
}
    if (!empty($newCollabs)) {
        $this->insertCollaborators(intval($id));
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
    $keywords = isset($_REQUEST['keywords'])
        ? json_decode($_REQUEST['keywords']) : null;

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
        $this->insertKeywords(intval($id));
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
    $voi = isset($_REQUEST['voiFields'])
        ? json_decode($_REQUEST['voiFields']) : null;

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
        $this->insertVOIs(intval($id));
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

        // Check if values exist in $_POST before applying htmlspecialchars
        $cit = isset($_REQUEST[$citationIndex]) ? $_REQUEST[$citationIndex] : null;
        $ver = isset($_REQUEST[$versionIndex]) ? $_REQUEST[$versionIndex] : null;

        // If they exist and differ, add them to the update array
        if ($cit !== null && htmlspecialchars($cit) !== $data['Citation']) {
            $toUpdate[$puid]['Citation'] = $cit;
        }
        if ($ver !== null && htmlspecialchars($ver) !== $data['Version']) {
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

    print(json_encode(['message' => $message]));
    exit(0);
}}
