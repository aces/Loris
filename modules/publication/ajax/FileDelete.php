<?php
$uploadID = $_REQUEST['uploadID'];
$db     = \Database::singleton();
$user   = \User::singleton();
$config = \NDB_Config::singleton();

$query      = "SELECT * FROM publication_upload WHERE PublicationUploadID=:upid";
$uploadData = $db->pselectRow($query, array('upid' => $uploadID));

if (empty($uploadData)) {
    header("HTTP/1.1 400 Bad Request");
    exit;
}

$origUser = $db->pselectOne(
    'SELECT UserID FROM publication WHERE PublicationID=:pid',
    array('pid' => $uploadData['PublicationID'])
);

$editors = $db->pselectCol(
    'SELECT UserID FROM publication_users_edit_perm_rel WHERE PublicationID=:pid',
    array('pid' => $uploadData['PublicationID'])
);

if ($user->getId() !== $origUser && !in_array($user->getId(), $editors)) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$db->delete(
    'publication_upload',
    array('PublicationUploadID' => $uploadID)
);

$base = $config->getSetting('publication_uploads');

unlink($base . $uploadData['URL']);
