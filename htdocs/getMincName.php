<?php
ini_set('default_charset', 'utf-8');
require_once "../tools/generic_includes.php";
require_once "Utility.class.inc";


$query = "select File from files where FileID = :MincID";
$m = $DB->pselectOne($query, array('MincID' => $_REQUEST['minc_id']));
//echo json_encode(($m));
$m = substr( $m, strrpos($m, '/') + 1);
echo ($m);
?>
