<?php
/**
  * Document_repository module
  *
  * PHP Version 5
  *
  * @category Test
  * @package  Loris
  * @author   Loris Team <loris.info@mcin.ca>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
$user =& User::singleton();
if (!$user->hasPermission('document_repository_delete')) {
    header('HTTP/1.1 403 Forbidden');
    exit;
}

set_include_path(get_include_path().':../../project/libraries:../../php/libraries:');
require_once 'NDB_Client.class.inc';
require_once 'NDB_Config.class.inc';
require_once 'Email.class.inc';
$client = new NDB_Client();
$client->initialize('../../project/config.xml');
$factory = NDB_Factory::singleton();
$baseURL = $factory->settings()->getBaseURL();

$config = NDB_Config::singleton();

// create Database object
$DB =& Database::singleton();

$Notifier = new NDB_Notifier(
    'document_repository',
    'delete'
);

$rid = $_POST['id'];

$fileName = $DB->pselectOne(
    'SELECT File_name FROM document_repository WHERE record_id =:identifier',
    array(':identifier' => $rid)
);
$userName = $DB->pselectOne(
    'SELECT uploaded_by FROM document_repository WHERE record_id =:identifier',
    array(':identifier' => $rid)
);
$dataDir  = $DB->pselectOne(
    'SELECT Data_dir FROM document_repository WHERE record_id =:identifier',
    array(':identifier' => $rid)
);

$user =& User::singleton();

//if user has document repository delete permission
if ($user->hasPermission('document_repository_delete')) {
    $DB->delete('document_repository', array('record_id' => $rid));
    $msg_data['deleteDocument'] = $baseURL. '/document_repository/';
    $msg_data['document']       = $fileName;

    $Notifier->notify($msg_data);
}

$path = __DIR__ . '/../user_uploads/'.$dataDir;

if (file_exists($path)) {
    unlink($path);
}

?>
