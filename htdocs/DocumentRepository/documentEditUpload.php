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

    $fileSize = $_FILES["file"]["size"];
    $fileName = $_FILES["file"]["name"];
    $base_path = "../document_repository/";

    if (!file_exists($base_path . $user)) {
        mkdir($base_path . $user, 0777);
    }

    $target_path = $base_path  . $user . "/" . $fileName;  

    if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path))
    {
        $success = $DB->insert('document_repository', array('File_category'=>$category, 'For_site'=>$site, 'comments'=>$comments, 'version'=>$version, 'File_name'=>$fileName, 'File_size'=>$fileSize, 'Data_dir'=>$target_path, 'uploaded_by'=>$user)); 

        header("Location: ../main.php?test_name=document_repository&uploadSuccess=true");
    }

    else
    {
        echo "There was an error uploading the file";
    }

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
