<?php

//ob_implicit_flush(true);
//ob_end_flush();

$userSingleton =& User::singleton();
if (!$userSingleton->hasPermission('genomic_browser_view_site') && !$userSingleton->hasPermission('genomic_browser_view_allsites')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}


header('Content-Type: application/json; charset=UTF-8');

// Set output mode to allow XHR request progress
set_time_limit(0); 
ob_implicit_flush(true);
ob_end_flush();

// ----------------------------------------------------------------
// ------------------------ Step 1 --------------------------------
// ----------------------------------------------------------------
// Validate inputs


reportProgress(1,'Validating...');

$fileToUpload = (object) array(
    'file_type' => $_FILES["fileData"]["type"],
    'file_name' => $_FILES["fileData"]["name"],
    'tmp_name'  => $_FILES["fileData"]["tmp_name"],
    'inserted_by' => $userSingleton->getData('UserID'),
    'genomic_file_type' => empty($_POST['fileType']) ? null : str_replace('_', ' ', $_POST['fileType']),
    'description' => $_POST['description'],
);

switch ($fileToUpload->genomic_file_type) {
    case 'Methylation beta-values':
        validateRequest();
        moveFileToFS($fileToUpload);
        registerFile($fileToUpload);
        insertMethylationData($fileToUpload);
    break;
    case 'Other':
        moveFileToFS($fileToUpload);
        registerFile($fileToUpload);
    break;
    default:
        die(json_encode(array('message' => "Unsupported filetype: $fileToUpload->genomic_file_type", 'progress' => 100, 'error' => true)));
}

// 6. insert candidate_file_rel
reportProgress(50,"Creating file-candidate relations");

//header("content-type:application/json");
//header("HTTP/1.1 200 OK");

reportProgress(100,"Complete");
exit;

function validateRequest() {
    if ( ( empty($_POST['pscidColumn']) && empty($_POST['fileMapping']) ) || empty($_FILES['fileData'])) {
        die(json_encode(array('message' => 'Validation failed : Missing inputs', 'progress' => 100, 'error' => true)));
    // This require some more work
    // Should compare the header and existing dats to inform the user about predicted no-insertion.
    }
    reportProgress(4,"Validation completed");
}

function moveFileToFS(&$fileToUpload) {

    $config = NDB_Config::singleton();
    $genomic_data_dir = $config->getSetting('GenomicDataPath');
    $DB =& Database::singleton();

    reportProgress(5,"Copying file to $genomic_data_dir ");
    if (move_uploaded_file($fileToUpload->tmp_name, $genomic_data_dir . 'genomic_uploader/' . $fileToUpload->file_name)) {
        reportProgress(5,"File copied to $genomic_data_dir ");
    } else {
        die(json_encode(array('message' => 'File copy failed', 'progress' => 100, 'error' => true)));
    }
}

function registerFile(&$fileToUpload) {
    // *************************************************************
    // *************************************************************
    // Release notes :  $genomic_data_dir . 'genomic_uploader/ needs i
    // to be created with www-data has a owner.
    // *************************************************************
    // *************************************************************
    
    // Inserting file record into database.
    $DB =& Database::singleton();

    $values = array(
        'FileName' => $fileToUpload->file_name, 
        'Description' => $fileToUpload->description, 
        'FileType' => $fileToUpload->genomic_file_type, 
        'Date_inserted' => date("y:m:d h:i:s", time()),
        'InsertedByUserID' => $fileToUpload->inserted_by, 
    );  
    try {

        $DB->replace('genomic_files', $values);
        $fileToUpload->date_inserted = $values['Date_inserted'];

    } catch (DatabaseException $e) {
        die(json_encode(array('message' => 'File registration failed', 'progress' => 100, 'error' => true)));
    }
    reportProgress(15,"File copied");
    
}

function createSampleCandidateRelations(&$fileToUpload) {

    reportProgress(20,"Creating sample-candidate relations");

    $config = NDB_Config::singleton();
    $genomic_data_dir = $config->getSetting('GenomicDataPath');
    $DB =& Database::singleton();

    $stmt = 'INSERT IGNORE INTO genomic_sample_candidate_rel (sample_label, CandID) VALUES ';
    $rows = array(); 

    $f = fopen( $genomic_data_dir . 'genomic_uploader/' . $fileToUpload->file_name, 'r');
    $line = fgets($f);
    fclose($f);
    
    $headers = explode(',', $line );
    array_shift($headers);

    $sample_label_prefix = $fileToUpload->date_inserted;
    array_walk($headers, function (&$item, $key, $prefix) {
        $item = $prefix . '_' . trim($item);
    }, $sample_label_prefix);

    $rows = array_map(function ($pscid) {
         return "( '$pscid', (SELECT CandID FROM candidate WHERE PSCID = '" . explode('_',$pscid)[1] . "'))";
    }, $headers);

    $stmt .= join(',', $rows);
    try {
        $prep = $DB->prepare($stmt);
        $result = $DB->execute($prep, array(), array('nofetch' => true));
        // Report number on relation created (candidate founded)
        reportProgress(24,"Relation created");

    } catch (Exception $e) {
        die(json_encode(array('message' => 'Can`t insert into the database.', 'progress' => 100, 'error' => true)));
    }
}

function insertBetaValues(&$fileToUpload) {

    reportProgress(25,"Inserting beta-values");
    // Assuming genomic_cpg_annotation have ialready been created.
    // see: /module/genomic_browser/tool/human...

    $config = NDB_Config::singleton();
    $genomic_data_dir = $config->getSetting('GenomicDataPath');
    $DB =& Database::singleton();

    $f = fopen($genomic_data_dir . 'genomic_uploader/' . $fileToUpload->file_name, "r");
    if ($f) {

        $stmt_prefix = 'INSERT IGNORE INTO genomic_cpg (sample_label, cpg_name, beta_value) VALUES ';
    
        $line = fgets($f);
        $headers = explode(',', $line );
        array_shift($headers);
   
        $sample_label_prefix = $fileToUpload->date_inserted;
        array_walk($headers, function (&$item, $key, $prefix) {
            $item = $prefix . '_' . trim($item);
        }, $sample_label_prefix);
 
        $sample_count = count($headers);
    
        while (($line = fgets($f)) !== false) {
            $stmt = '';
    
            $values = explode(',', $line);
            $values = array_map( 'trim', $values);
            $probe_id = $values[0];
            // TODO validate probe value
    
            array_shift($values);
            $rows = array();
            foreach ($values as $key => $value) {
                $row = "('$headers[$key]', '$probe_id', $value)";
                array_push($rows, $row);
            }
    
            $stmt .= join(',', $rows);

            try {
                $prep = $DB->prepare($stmt_prefix . $stmt);
                $result = $DB->execute($prep, array(), array('nofetch' => true));
            } catch (Exception $e) {
                die(json_encode(array('message' => 'Beta values can`t be inserted into the database.', 'progress' => 100, 'error' => true)));
            }
        }
        fclose($f);
    } else {
        die(json_encode(array('message' => 'Beta value file can`t be opened', 'progress' => 100, 'error' => true)));
    }
}

function insertMethylationData(&$fileToUpload) {
    createSampleCandidateRelations($fileToUpload);
    insertBetaValues($fileToUpload);
}

function reportProgress($progress, $message) 
{
    $response = array(
        'message' => $message,
        'progress' => $progress
    );
    error_log(print_r(JSON_encode($response), true));
    echo json_encode($response);
    sleep(1);
}
?>
