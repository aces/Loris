<?php
require_once "NDB_Client.class.inc";
$client =& new NDB_Client();
$client->initialize("../../project/config.xml");

// create Database object
$DB =& Database::singleton();
if(PEAR::isError($DB)) { 
    print "Could not connect to database: ".$DB->getMessage()."<br>\n"; die(); 
}


$action = $_POST['action'];

if ($action == 'upload')
{

    $user = $_POST['user'];
    $category = $_POST['category'];
    $site = $_POST['site'];
    $instrument = $_POST['instrument'];
    $pscid = $_POST['pscid'];
    $visit = $_POST['visit'];
    $comments = $_POST['comments'];
    $version = $_POST['version'];

    $fileName = $_FILES["file"]["name"];
    $base_path = "document_repository";
    $target_path = $base_path; 

    if (!file_exists($base_path . $user))
        mkdir("document_repository/" . $user, 0777);

    $target_path = $target_path . "/" . $user ."/" . $fileName;  
    chmod($target_path, 0777);

    $success = $DB->insert('document_repository', array('File_category'=>$category, 'For_site'=>$site, 'comments'=>$comments, 'version'=>$version, 'File_name'=>$fileName, 'Data_dir'=>$target_path, 'uploaded_by'=>$user)); 

    header("Location: http://132.216.67.69:7080/main.php?test_name=document_repository&uploadSuccess=true");

}


elseif ($action == 'edit')
{
    $id = $_POST['idEdit'];
    $category = $_POST['categoryEdit'];
    $instrument = $_POST['nameEdit'];
    $site = $_POST['siteEdit'];
    $pscid = $_POST['pscidEdit'];
    $visit = $_POST['visitEdit'];
    $comments = $_POST['commentsEdit'];
    $version = $_POST['versionEdit'];

    $values = array('File_category' => $category, 'Instrument' => $instrument, 'For_site' => $site, 'PSCID' => $pscid, 'visitLabel' => $visit, 'comments' => $comments, 'version' => $version); 
    $DB->update('document_repository', $values, array('record_id'=>$id));

}

?>
