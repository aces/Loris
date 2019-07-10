<?php
/**
 * Update MRI Protocol
 *
 * PHP Version 5
 *
 * @category MRI
 * @package  Main
 * @author   Zia Mohadesz <zia.mohades@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
$user =& \User::singleton();
if (!$user->hasPermission('violated_scans_edit')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';

$config =& \NDB_Config::singleton();
$client = new \NDB_Client();
$client->initialize();
list($row,$row_id,$column,$column_id) = explode("_", $_REQUEST['field_id']);
$value       = $_REQUEST['field_value'];
$table_desc  = $DB->pselect("DESC mri_protocol", array());
$column_name = $table_desc[$column_id]['Field'];

// create user object
$user =& \User::singleton();

if ($user->hasPermission('violated_scans_edit')) {
     $DB->update(
         'mri_protocol',
         array($column_name => $value),
         array('ID' => $row_id)
     );
}

