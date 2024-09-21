<?php
/**
 * Publication data retriever
 *
 * This retrieves data for publication uploads & editing
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
    $factory = \NDB_Factory::singleton();
    $db      = $factory->database();
    $user    = $factory->user();
    $action  = $_REQUEST['action'];
    $message = ['message' => null];

    if ($action === 'getData') {
        if (userCanGetData($db, $user)) {
            header('Content-Type: application/json');
            exit(json_encode(getData($db)));
        } else {
            http_response_code(403);
            $message['message']
                = 'You do not have access to the publication module.';
            exit(json_encode($message));

        }
    } elseif ($action === 'getProjectData') {
        $id = intval($_REQUEST['id']);
        if (userCanGetData($db, $user, $id)) {
            header('Content-Type: application/json');
            exit(json_encode(getProjectData($db, $user, $id)));
        } else {
            http_response_code(403);
            $message['message'] = 'You do not have access to this project.';
            exit(json_encode($message));
        }
    } else {
        http_response_code(400);
        exit;
    }
}
/**
 * Gets publication and parameter_type data from database
 *
 * @param Database $db Database instance
 *
 * @return array Array of general publication data
 */
function getData($db) : array
{
    $data   = [];
    $titles = $db->pselectCol(
        'SELECT Title FROM publication',
        []
    );

    // for selecting behavioural variables of interest
    $bvlVOIs = iterator_to_array(
        $db->pselect(
            "SELECT pt.Name, pt.SourceFrom FROM parameter_type pt 
	    JOIN test_names tn ON tn.Test_name=pt.SourceFrom
	    ORDER BY pt.SourceFrom",
            []
        )
    );

    $rawProject = $db->pselect(
        'SELECT ProjectID, Name FROM Project',
        []
    );

    $projectOptions = [];
    foreach ($rawProject as $dataProject) {
        $projectOptions[$dataProject['ProjectID']] = $dataProject['Name'];
    }

    // merge variables and test names into one array
    $bvlVOIs = array_merge(
        array_column($bvlVOIs, 'Name'),
        array_unique(array_column($bvlVOIs, 'SourceFrom'))
    );
    sort($bvlVOIs);

    // sets keys and values to be equal
    $allVOIs = [];
    $allVOIs['Behavioural'] = array_combine($bvlVOIs, $bvlVOIs);

    // imaging VoIs -- filter out non-human readable DICOM tags
    $imgVOIs = $db->pselectCol(
        "SELECT DISTINCT p.Name FROM parameter_type p
         JOIN parameter_type_category_rel ptcr
         ON p.ParameterTypeID=ptcr.ParameterTypeID
         JOIN parameter_type_category ptc
         ON ptc.ParameterTypeCategoryID=ptcr.ParameterTypeCategoryID
         WHERE ptc.Name='MRI Variables'",
        []
    );

    sort($imgVOIs);

    // sets keys and values to be equal
    $allVOIs['Imaging'] = array_combine($imgVOIs, $imgVOIs);

    $users = $db->pselectColWithIndexKey(
        "SELECT ID, Real_name FROM users ".
        "WHERE Active='Y' AND Pending_approval='N' ".
        "ORDER BY Real_name",
        [],
        'ID'
    );

    $kws = $db->pselectCol(
        'SELECT Label FROM publication_keyword',
        []
    );
    $kws = array_combine($kws, $kws);

    $collabs = $db->pselectCol(
        'SELECT Name FROM publication_collaborator',
        []
    );
    $collabs = array_combine($collabs, $collabs);

    $data['projectOptions'] = $projectOptions;
    $data['users']          = $users;
    $data['uploadTypes']    = getUploadTypes();
    $data['existingTitles'] = $titles;
    $data['allVOIs']        = $allVOIs;
    $data['allKWs']         = $kws;
    $data['allCollabs']     = $collabs;
    return $data;
}

/**
 * Gets Data for a specific PublicationID
 *
 * @param Database $db   Database instance
 * @param User     $user User instance
 * @param int      $id   Publication ID
 *
 * @return array Array of data for a specific project
 */
function getProjectData($db, $user, $id) : array
{
    $query  = 'SELECT Title, Description, ' .
        'p.project as project, pr.Name as projectName, datePublication, '.
        'journal, link, publishingStatus, DateProposed, '.
        'pc.Name as LeadInvestigator, pc.Email as LeadInvestigatorEmail, '.
        'PublicationStatusID, UserID, RejectedReason  '.
        'FROM publication p '.
        'LEFT JOIN publication_collaborator pc '.
        'ON p.LeadInvestigatorID = pc.PublicationCollaboratorID '.
        'LEFT JOIN Project pr '.
        'ON p.project = pr.ProjectID '.
        'WHERE p.PublicationID=:pid ';
    $result = $db->pselectRow(
        $query,
        ['pid' => $id]
    );

    if (!$result) {
        throw new LorisException('Invalid publication ID!');
    } else {
        $result['VOIs']          = getVOIs($id);
        $result['files']         = getFiles($id);
        $result['Keywords']      = getKeywords($id);
        $result['collaborators'] = getCollaborators($id);

        // allow edit access for user if user is original proposer
        $userIDs = $db->pselectCol(
            'SELECT pu.UserID as ID '.
            'FROM publication_users_edit_perm_rel pu '.
            'WHERE PublicationID=:p',
            ['p' => $id]
        );

        $userCanEdit = (
            $user->getId() === $result['UserID'] ||
            in_array($user->getId(), $userIDs)
        );

        $usersWithEditPerm = $userIDs;

        $title           = htmlspecialchars_decode($result['Title'] ?? '');
        $description     = htmlspecialchars_decode($result['Description'] ?? '');
        $datePublication = htmlspecialchars_decode($result['datePublication'] ?? '');
        $journal         = htmlspecialchars_decode($result['journal'] ?? '');
        $link            = htmlspecialchars_decode($result['link'] ?? '');

        $publishingStatus = htmlspecialchars_decode(
            $result['publishingStatus']
            ?? ''
        );
        $rejectedReason   = htmlspecialchars_decode($result['RejectedReason'] ?? '');

        $pubData = [
            'title'                 => $title,
            'description'           => $description,
            'project'               => $result['project'],
            'projectName'           => $result['projectName'],
            'datePublication'       => $datePublication,
            'journal'               => $journal,
            'link'                  => $link,
            'publishingStatus'      => $publishingStatus,
            'leadInvestigator'      => $result['LeadInvestigator'],
            'leadInvestigatorEmail' => $result['LeadInvestigatorEmail'],
            'status'                => $result['PublicationStatusID'],
            'rejectedReason'        => $rejectedReason,
            'voi'                   => $result['VOIs'],
            'keywords'              => $result['Keywords'],
            'collaborators'         => $result['collaborators'],
            'files'                 => $result['files'],
            'usersWithEditPerm'     => $usersWithEditPerm,
            'userCanEdit'           => $userCanEdit,
            'statusOpts'            => getStatusOptions(),
            'uploadTypes'           => getUploadTypes(),
        ];

        // if user can edit, retrieve getData() options to allow modifications
        if ($userCanEdit) {
            return array_merge($pubData, getData($db));
        } else {
            return $pubData;
        }
    }
}
/**
 * Gets Variables of Interest for a given publication ID
 *
 * @param int $id the PublicationID
 *
 * @return array Array of VoIs
 */
function getVOIs($id) : array
{
    $db        = \NDB_Factory::singleton()->database();
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
    $vois      =  array_merge($testNames, $fields);
    return $vois;
}
/**
 * Gets Keywords for a given publication ID
 *
 * @param int $id the PublicationID
 *
 * @return array Array of keywords
 */
function getKeywords($id) : array
{
    $db  = \NDB_Factory::singleton()->database();
    $kws = $db->pselectCol(
        'SELECT pk.Label FROM publication_keyword pk '.
        'LEFT JOIN publication_keyword_rel pkr '.
        'ON pkr.PublicationKeywordID=pk.PublicationKeywordID '.
        'WHERE pkr.PublicationID=:pid',
        ['pid' => $id]
    );

    return $kws;
}

/**
 * Gets Collaborators for a given publication ID
 *
 * @param int $id the PublicationID
 *
 * @return array Array of collaborators
 */
function getCollaborators($id) : array
{
    $db = \NDB_Factory::singleton()->database();

    $collaborators = iterator_to_array(
        $db->pselect(
            'SELECT Name as name, Email as email FROM publication_collaborator pc '.
            'LEFT JOIN publication_collaborator_rel pcr '.
            'ON pc.PublicationCollaboratorID=pcr.PublicationCollaboratorID '.
            'WHERE pcr.PublicationID=:pid',
            ['pid' => $id]
        )
    );

    return $collaborators;
}

/**
 * Gets file uploads for a given publication ID
 *
 * @param int $id the PublicationID
 *
 * @return array Array of file (meta) data
 */
function getFiles($id) : array
{
    $db = \NDB_Factory::singleton()->database();

    $files = $db->pselect(
        'SELECT * FROM publication_upload WHERE PublicationID=:pid',
        ['pid' => $id]
    );

    $results = [];
    foreach ($files as $key => $f) {
        $val = [];
        $val['Citation'] = htmlspecialchars_decode($f['Citation']);
        $val['Version']  = htmlspecialchars_decode($f['Version']);

        $results[$key] = $val;
    }

    return $results;
}

/**
 * Gets options for setting the approval status for projects
 *
 * @return array Array of status options
 */
function getStatusOptions() : array
{
    $db        = \NDB_Factory::singleton()->database();
    $rawStatus = $db->pselect(
        'SELECT * FROM publication_status',
        []
    );

    $statusOpts = [];
    foreach ($rawStatus as $rs) {
        $statusOpts[$rs['PublicationStatusID']] = $rs['Label'];
    }

    return $statusOpts;
}

/**
 * Gets different types of uploads
 *
 * @return array Array of upload types
 */
function getUploadTypes() : array
{
    $db = \NDB_Factory::singleton()->database();

    return $db->pselectColWithIndexKey(
        'SELECT PublicationUploadTypeID, Label FROM publication_upload_type',
        [],
        'PublicationUploadTypeID'
    );
}

/**
 * Permission check
 *
 * @param Database $db    database
 * @param User     $user  user
 * @param int      $pubID publication ID
 *
 * @return bool
 */
function userCanGetData($db, $user, $pubID = null) : bool
{
    $retVal = true;
    if (is_null($pubID) && !$user->hasPermission('publication_view')) {
        $retVal = false;
    }

    $origUser = $db->pselectOne(
        'SELECT UserID FROM publication WHERE PublicationID=:p',
        ['p' => $pubID]
    );

    $userIDs = $db->pselectCol(
        'SELECT pu.UserID as ID '.
        'FROM publication_users_edit_perm_rel pu '.
        'WHERE PublicationID=:p',
        ['p' => $pubID]
    );

    $userCanEdit = (
        $user->getId() === $origUser ||
        in_array($user->getId(), $userIDs)
    );

    if (!$userCanEdit && !$user->hasPermission('publication_view')) {
        $retVal = false;
    }

    return $retVal;
}
