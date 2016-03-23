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
$p = 2;
$response = array(  
    'message' => "Validating...",
    'progress' => $p
);
echo json_encode($response);
sleep(1);

if ( ( empty($_POST['pscidColumn']) && empty($_POST['fileMapping']) ) || empty($_FILES['fileData'])) {
    die(json_encode(array('message' => 'Validation failed', 'progress' => 100)));
// This require some more work
}


$fileType     = $_FILES["fileData"]["type"];
$fileName     = $_FILES["fileData"]["name"];
$temp_file    = $_FILES["fileData"]["tmp_name"];

$mapfileType  = empty($_FILES["fileData"]["type"]) ? null : $_FILES["fileData"]["type"];
$mapfileName  = $_FILES["fileData"]["name"];
$maptemp_file = $_FILES["fileData"]["tmp_name"];

$user         = empty($_POST['user']) ? null : $_POST['user'];
$type         = empty($_POST['fileType']) ? null : str_replace('_', ' ', $_POST['fileType']);
$pscidColumn  = empty($_POST['pscidColumn']) ? null : $_POST['pscidColumn'];
$description  = $_POST['description'];


// fileData and fileMapping
//var_dump($_POST);
// pscidColumn == "on" then ...

// 1. Validate inputs
// - pcsidColumn
// - headers


// 2. Copy files

$config = NDB_Config::singleton();
$genomic_data_dir = $config->getSetting('GenomicDataPath');
$DB =& Database::singleton();

$p = 5;
$response = array(  
    'message' => "Copying file to $genomic_data_dir ",
    'progress' => $p
);
echo json_encode($response);
sleep(1);

if (move_uploaded_file($temp_file, $genomic_data_dir . 'genomic_uploader/' . $fileName)) {

    // Inserting file record into database.
    $values = array(
        'file_name' => $fileName, 
        'absolute_path' => $genomic_data_dir . 'genomic_uploader/',
        'description' => $description, 
        'genomic_file_type' => $type, 
        'date_inserted' => date("y:m:d h:i:s", time()),
        'user_inserted' => $user, 
    );
    $DB->replace('genomic_file', $values);
  
    $p = 15;
    $response = array(
        'message' => "File copied",
        'progress' => $p
    );
    echo json_encode($response);
    sleep(1);
} else {
    header("HTTP/1.1 500 Server Error");
    header('Content-Type: application/json; charset=UTF-8');
    die(json_encode(array('message' => 'File copy failed', 'progress' => 100)));
}



// 4. import mapping (as 1000 rows transactions) 
// -- INSERT INTO genomic_sample_candidate_rel (sample_label,candidate_id) SELECT $sample_label, (SELECT ID from candidate where PSCID = $pscid) ;
// OR
// -- INSERT INTO genomic_sample_candidate_rel (sample_label,candidate_id) SELECT $sample_label, (SELECT ID, PSCID from candidate where PSCID = $pscid) ;


$p = 20;
$response = array(
    'message' => "Creating sample-candidate relations",
    'progress' => $p
);
echo json_encode($response);
sleep(1);



if (!empty($_POST['pscidColumn']) && $_POST['pscidColumn'] == "on") {
    // Create the sample-candidate relations based on column headers
    $insert_count = 0;
    $failed_insert_count = 0;

    $stmt = 'INSERT IGNORE INTO genomic_sample_candidate_rel (sample_label, candidate_id) VALUES ';
    $rows = array();

    $f = fopen( $genomic_data_dir . 'genomic_uploader/' . $fileName, 'r');
    $line = fgets($f);
    fclose($f);

    $headers = explode(',', $line );
    array_shift($headers);

    $rows = array_map(function ($pscid) {
        $pscid = trim($pscid);
         return "( '$pscid', (SELECT ID FROM candidate WHERE PSCID = '$pscid'))";
    }, $headers);

    $stmt .= join(',', $rows);
    try {
        $prep = $DB->prepare($stmt);
        $result = $DB->execute($prep, array(), array('nofetch' => true));
    } catch (Exception $e) {
        header("HTTP/1.1 500 Server Error");
        header('Content-Type: application/json; charset=UTF-8');
        die(json_encode(array('message' => 'File copy failed', 'progress' => 100)));
    }
    // Report number on relation created (candidate founded)
} else {
    // Use the Mapping file to create the sample-candidate relations

// TODO

    // Report number on relation created (candidate founded)
}

// 5. import values (as 1000 rows transactions)
$p = 40;
$response = array(  
    'message' => "Inserting beta-values",
    'progress' => $p
);
echo json_encode($response);
sleep(1);

// 6. insert candidate_file_rel
$p = 50;
$response = array(  
    'message' => "Creating file-candidate relations",
    'progress' => $p
);
echo json_encode($response);
sleep(1);

//header("content-type:application/json");
//header("HTTP/1.1 200 OK");

$p = 100;
$response = array(  
    'message' => "Complete",
    'progress' => $p
);
echo json_encode($response);
sleep(1);
exit;
?>
