<?php
if (isset($_REQUEST['action'])) {
    $action = $_REQUEST['action'];
    if ($action === 'getData') {
        echo json_encode(getData());
    } elseif ($action === 'upload') {
        uploadPublication();
    } elseif($action === 'getProjectData') {
        echo json_encode(getPublicationData());
    } else {
        header("HTTP/1.1 400 Bad Request");
    }
}

// Gets publication data from database
// for now just titles to ensure uniqueness upon submission
function getData() {
    $db = Database::singleton();

    $data = array();
    $titles = $db->pselectCol(
        'SELECT Title FROM publication',
        array()
    );

    $varsOfInterest = $db->pselect(
        "SELECT pt.Name, pt.SourceFrom FROM parameter_type pt ".
        "JOIN test_names tn ON tn.Test_name=pt.SourceFrom ORDER BY pt.SourceFrom",
        array()
    );


    $data['titles'] = $titles;
    $data['varsOfInterest'] = $varsOfInterest;
    return $data;
}


// Gets Data for a specific PublicationID
function getPublicationData() {
    $id = $_GET['id'];

    $db = Database::singleton();

    $query = 'SELECT p.Title as Title, p.Description as Description, DateProposed, '.
        'LeadInvestigator, LeadInvestigatorEmail, ps.Label, '.
        'GROUP_CONCAT(DISTINCT pt.Name) as VOIs, '.
        'GROUP_CONCAT(DISTINCT pk.Label) as Keywords '.
        'FROM publication p '.
        'LEFT JOIN publication_status ps '.
        'ON p.PublicationStatusID=ps.PublicationStatusID '.
        'LEFT JOIN publication_parameter_type_rel pptr '.
        'ON pptr.PublicationID=p.PublicationID ' .
        'LEFT JOIN parameter_type pt '.
        'ON pt.ParameterTypeID=pptr.ParameterTypeID '.
        'LEFT JOIN publication_keyword_rel pkr '.
        'ON pkr.PublicationID=p.PublicationID '.
        'LEFT JOIN publication_keyword pk '.
        'ON pkr.PublicationKeywordID=pk.PublicationKeywordID '.
        'WHERE p.PublicationID=1 '.
        'GROUP BY p.PublicationID';
    error_log($query);
    $result = $db->pselectRow(
        $query,
        //array('pid' => $id)
        []
    );

    if (!$result) {
        showError('Invalid publication ID!');
        return;
    } else {
        return array(
            'title' => $result['Title'],
            'description' => $result['Description'],
            'leadInvestigator' => $result['LeadInvestigator'],
            'leadInvestigatorEmail' => $result['LeadInvestigatorEmail'],
            'status' => $result['Label'],
            'voi' => $result['VOIs'],
            'keywords' => $result['Keywords']
        );
    }
}

function uploadPublication() {
    $db = Database::singleton();

    // back end validation for title uniqueness constraint
    $exists = $db->pselectOne(
        "SELECT PublicationID FROM publication WHERE Title=:t",
        array('t' => $_REQUEST['title'])
    );

    if ($exists) {
        throw new LorisException('Submitted title already exists');
    }
    $today = date('Y-m-d');
    $fields = array(
        'Title'                 => $_REQUEST['title'],
        'Description'           => $_REQUEST['description'],
        'LeadInvestigator'      => $_REQUEST['leadInvestigator'],
        'LeadInvestigatorEmail' => $_REQUEST['leadInvestigatorEmail'],
        'DateProposed'          => $today
    );

    $db->insert('publication', $fields);

    $pubID = $db->pselectOne(
        'SELECT PublicationID '.
        'FROM publication '.
        'WHERE Title=:t',
        array('t' => $_REQUEST['title'])
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
}