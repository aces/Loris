<?php
/**
 * This file handles the Document Repository for LORIS
 *
 * PHP Version 5
 *
 * @category Documentation
 * @package  Main
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/Jkat/Loris-Trunk/
 */
$user =& User::singleton();
if (!$user->hasPermission('document_repository_view') && !$user->hasPermission('document_repository_delete')) {// @codingStandardsIgnoreLine
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(get_include_path().":../../project/libraries:../../php/libraries:");
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize("../../project/config.xml");

// create Database object
$DB =& Database::singleton();

$result = $DB->pselectRow("SELECT * FROM document_repository where record_id =:identifier", array(':identifier' => $_GET['id']));// @codingStandardsIgnoreLine

echo json_encode($result);

?>
