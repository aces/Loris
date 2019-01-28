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
    $db      = \Database::singleton();
    $user    = \User::singleton();
    $action  = $_REQUEST['action'];
    $message = array('message' => null);

    if ($action === 'getData') {
        if (userCanGetData($db, $user)) {
            echo json_encode(getData($db));
            exit;
        } else {
            http_response_code(403);
            $message['message']
                = 'You do not have access to the publication module.';
            echo json_encode($message);
            exit;
        }
    } elseif ($action === 'getProjectData') {
        $id = $_REQUEST['id'];
        if (userCanGetData($db, $user, $id)) {
            echo json_encode(getProjectData($db, $user, $id));
            exit;
        } else {
            http_response_code(403);
            $message['message'] = 'You do not have access to this project.';
            echo json_encode($message);
            exit;
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
    $data   = array();
    $titles = $db->pselectCol(
        'SELECT Title FROM publication',
        array()
    );

    // for selecting behavioral variables of interest
    $bvlVOIs = $db->pselect(
        "SELECT pt.Name, pt.SourceFrom FROM parameter_type pt ".
        "JOIN test_names tn ON tn.Test_name=pt.SourceFrom ORDER BY pt.SourceFrom",
        array()
    );

    // merge variables and test names into one array
    $bvlVOIs = array_merge(
        array_column($bvlVOIs, 'Name'),
        array_unique(array_column($bvlVOIs, 'SourceFrom'))
    );
    sort($bvlVOIs);

    // sets keys and values to be equal
    $allVOIs['Behavioral'] = array_combine($bvlVOIs, $bvlVOIs);

    // imaging VoIs -- filter out non-human readable DICOM tags
    $imgVOIs = $db->pselectCol(
        "SELECT DISTINCT p.Name FROM parameter_type p 
         JOIN parameter_type_category_rel ptcr 
         ON p.ParameterTypeID=ptcr.ParameterTypeID 
         JOIN parameter_type_category ptc 
         ON ptc.ParameterTypeCategoryID=ptcr.ParameterTypeCategoryID 
         WHERE ptc.Name='MRI Variables'",
        array()
    );

    sort($imgVOIs);

    // sets keys and values to be equal
    $allVOIs['Imaging'] = array_combine($imgVOIs, $imgVOIs);

    $users = $db->pselectColWithIndexKey(
        "SELECT ID, Real_name FROM users ".
        "WHERE Active='Y' AND Pending_approval='N' ".
        "ORDER BY Real_name",
        array(),
        'ID'
    );

    $kws = $db->pselectCol(
        'SELECT Label FROM publication_keyword',
        array()
    );
    $kws = array_combine($kws, $kws);

    $collabs = $db->pselectCol(
        'SELECT Name FROM publication_collaborator',
        array()
    );
    $collabs = array_combine($collabs, $collabs);

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
    $query  = 'SELECT Title, Description, DateProposed, '.
        'pc.Name as LeadInvestigator, pc.Email as LeadInvestigatorEmail, '.
        'PublicationStatusID, UserID, RejectedReason  '.
        'FROM publication p '.
        'LEFT JOIN publication_collaborator pc '.
        'ON p.LeadInvestigatorID = pc.PublicationCollaboratorID '.
        'WHERE p.PublicationID=:pid ';
    $result = $db->pselectRow(
        $query,
        array('pid' => $id)
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
            array('p' => $id)
        );

        $userCanEdit = (
            $user->getId() === $result['UserID'] ||
            in_array($user->getId(), $userIDs)
        );

        $usersWithEditPerm = $userIDs;

        $title          = htmlspecialchars_decode($result['Title']);
        $description    = htmlspecialchars_decode($result['Description']);
        $rejectedReason = htmlspecialchars_decode($result['RejectedReason']);

        $pubData = array(
                    'title'                 => $title,
                    'description'           => $description,
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
                   );

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
    $db        = \Database::singleton();
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
    $db  = \Database::singleton();
    $kws = $db->pselectCol(
        'SELECT pk.Label FROM publication_keyword pk '.
        'LEFT JOIN publication_keyword_rel pkr '.
        'ON pkr.PublicationKeywordID=pk.PublicationKeywordID '.
        'WHERE pkr.PublicationID=:pid',
        array('pid' => $id)
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
    $db = \Database::singleton();

    $collaborators = $db->pselect(
        'SELECT Name as name, Email as email FROM publication_collaborator pc '.
        'LEFT JOIN publication_collaborator_rel pcr '.
        'ON pc.PublicationCollaboratorID=pcr.PublicationCollaboratorID '.
        'WHERE pcr.PublicationID=:pid',
        array('pid' => $id)
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
    $db = \Database::singleton();

    $files = $db->pselect(
        'SELECT * FROM publication_upload WHERE PublicationID=:pid',
        array('pid' => $id)
    );

    foreach ($files as $key => $f) {
        $files[$key]['Citation'] = htmlspecialchars_decode($f['Citation']);
        $files[$key]['Version']  = htmlspecialchars_decode($f['Version']);
    }

    return $files;
}

/**
 * Gets options for setting the approval status for projects
 *
 * @return array Array of status options
 */
function getStatusOptions() : array
{
    $db        = \Database::singleton();
    $rawStatus = $db->pselect(
        'SELECT * FROM publication_status',
        array()
    );

    $statusOpts = array();
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
    $db = \Database::singleton();

    return $db->pselectColWithIndexKey(
        'SELECT PublicationUploadTypeID, Label FROM publication_upload_type',
        array(),
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
        array('p' => $pubID)
    );

    $userIDs = $db->pselectCol(
        'SELECT pu.UserID as ID '.
        'FROM publication_users_edit_perm_rel pu '.
        'WHERE PublicationID=:p',
        array('p' => $pubID)
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
