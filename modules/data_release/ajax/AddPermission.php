<?php

$DB =& Database::singleton();

if ($_POST['action'] == 'addpermission') {
        $userid = $_POST['userid'];
        $data_release_id = $_POST['data_release_id'];
        $success = $DB->insert('data_release_permissions',
                            array('userid'=>$userid,
                                  'data_release_id'=>$data_release_id, 
                            ));
            header("Location: ../main.php?test_name=data_release&addpermissionSuccess=true");
} else {
            echo "There was an error adding permissions";
}

?>
