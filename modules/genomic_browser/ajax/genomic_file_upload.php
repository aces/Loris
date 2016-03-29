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
sleep(1);

if ( ( empty($_POST['pscidColumn']) && empty($_POST['fileMapping']) ) || empty($_FILES['fileData'])) {
    die(json_encode(array('message' => 'Validation failed', 'progress' => 100, 'error' => true)));
// This require some more work
}


$fileType     = $_FILES["fileData"]["type"];
$fileName     = $_FILES["fileData"]["name"];
$temp_file    = $_FILES["fileData"]["tmp_name"];

$user         = $userSingleton->getData('UserID');
$type         = empty($_POST['fileType']) ? null : str_replace('_', ' ', $_POST['fileType']);
$pscidColumn  = empty($_POST['pscidColumn']) ? null : $_POST['pscidColumn'];
$description  = $_POST['description'];

// ----------------------------------------------------------------
// ------------------------ Step 2 --------------------------------
// ----------------------------------------------------------------
// 2. Copy files

$config = NDB_Config::singleton();
$genomic_data_dir = $config->getSetting('GenomicDataPath');
$DB =& Database::singleton();

reportProgress(5,"Copying file to $genomic_data_dir ");
sleep(1);

// *************************************************************
// *************************************************************
// Release notes :  $genomic_data_dir . 'genomic_uploader/ needs i
// to be created with www-data has a owner.
// *************************************************************
// *************************************************************
if (move_uploaded_file($temp_file, $genomic_data_dir . 'genomic_uploader/' . $fileName)) {

    // Inserting file record into database.
    $values = array(
        'FileName' => $fileName, 
        'Description' => $description, 
        'FileType' => $type, 
        'Date_inserted' => date("y:m:d h:i:s", time()),
        'InsertedByUserID' => $user, 
    );
    $DB->replace('genomic_files', $values);
  
    reportProgress(15,"File copied");
    sleep(1);

} else {
    die(json_encode(array('message' => 'File copy failed', 'progress' => 100, 'error' => true)));
}

// ----------------------------------------------------------------
// ------------------------ Step 3 --------------------------------
// ----------------------------------------------------------------
// 3. genomic_sample_candidate_rel
reportProgress(20,"Creating sample-candidate relations");
sleep(1);

if (!empty($_POST['pscidColumn']) && $_POST['pscidColumn'] == "on") {
    // Create the sample-candidate relations based on column headers
    $insert_count = 0;
    $failed_insert_count = 0;

    $stmt = 'INSERT IGNORE INTO genomic_sample_candidate_rel (sample_label, CandID) VALUES ';
    $rows = array();

    $f = fopen( $genomic_data_dir . 'genomic_uploader/' . $fileName, 'r');
    $line = fgets($f);
    fclose($f);

    $headers = explode(',', $line );
    array_shift($headers);

    $rows = array_map(function ($pscid) {
        $pscid = trim($pscid);
         return "( '$pscid', (SELECT CandID FROM candidate WHERE PSCID = '$pscid'))";
    }, $headers);

    $stmt .= join(',', $rows);
    try {
        $prep = $DB->prepare($stmt);
        $result = $DB->execute($prep, array(), array('nofetch' => true));
    } catch (Exception $e) {
        die(json_encode(array('message' => 'File copy failed; Can`t insert into the database.', 'progress' => 100, 'error' => true)));
    }
    // Report number on relation created (candidate founded)
} else {
    // Use the Mapping file to create the sample-candidate relations

    $mapfileType  = empty($_FILES["fileMapping"]["type"]) ? null : $_FILES["fileMapping"]["type"];
    $mapfileName  = $_FILES["fileMapping"]["name"];
    $maptemp_file = $_FILES["fileMapping"]["tmp_name"];

// TODO :: try to use a mapping file to create the realations.

    die(json_encode(array('message' => 'Mapping file not supported', 'progress' => 100, 'error' => true)));
    // Report number of relation created (candidate founded)
}

// ----------------------------------------------------------------
// ------------------------ Step 4 --------------------------------
// ----------------------------------------------------------------
// Assuming genomic_cpg_annotation have ialready been created.
// see: /module/genomic_browser/tool/human...
// 3. genomic_cpg
reportProgress(25,"Inserting beta-values");
sleep(1);

$f = fopen($genomic_data_dir . 'genomic_uploader/' . $fileName, "r");
if ($f) {

    $insert_count = 0;
    $failed_insert_count = 0;

    $stmt_prefix = 'INSERT IGNORE INTO genomic_cpg (sample_label, cpg_name, beta_value) VALUES ';

    $line = fgets($f);
    $headers = explode(',', $line );
    array_shift($headers);
    $headers = array_map( 'trim', $headers);

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
    // Report number of record created (candidate founded)

    fclose($f);
} else {
    die(json_encode(array('message' => 'Beta value file can`t be opened', 'progress' => 100, 'error' => true)));
} 


// 6. insert candidate_file_rel
reportProgress(50,"Creating file-candidate relations");
sleep(1);

//header("content-type:application/json");
//header("HTTP/1.1 200 OK");

reportProgress(100,"Complete");
sleep(1);
exit;

function reportProgress($progress, $message) 
{
    $response = array(
        'message' => $message,
        'progress' => $progress
    );
    error_log(print_r(JSON_encode($response), true));
    echo json_encode($response);
}
?>
