<?php
$userSingleton =& User::singleton();
if (!$userSingleton->hasPermission('genomic_browser_view_site') && !$userSingleton->hasPermission('genomic_browser_view_allsites')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}
$DB =& Database::singleton();
$result = $DB->pselect('SELECT genomic_file_type FROM genomic_file_type_enum', array());
header('Content-Type: application/json; charset=UTF-8');
echo json_encode($result);
exit;
?>
