<?php
$DB =& Database::singleton();
if ($_POST['action'] == 'upload') {
        $fileName = $_FILES["file"]["name"];
        $version = $_POST['version'];
        $upload_date = date('Y-m-d');
        $base_path = __DIR__ . "/../user_uploads/";
        if (!file_exists($base_path)) {
            mkdir($base_path, 0777);
        }
        $target_path = $base_path . $fileName;
        if (move_uploaded_file($_FILES["file"]["tmp_name"], $target_path)) {
            $success = $DB->insert('data_release',
                            array('file_name'=>$fileName,
                                  'version'=>$version, 
                                  'upload_date'=>$upload_date,
                            ));
        }
            header("Location: ../main.php?test_name=data_release&uploadSuccess=true");
} else {
            echo "There was an error uploading the file";
}
?>
