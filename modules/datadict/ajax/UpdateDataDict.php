<?php
/**
 * Update or insert into the data dictionary
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

$user =& User::singleton();
if (!$user->hasPermission('data_dict_edit')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');
/* This is used by the data dictionary page to
 * update the column descriptions on the fly */
require_once "Database.class.inc";
require_once 'NDB_Config.class.inc';
require_once 'NDB_Client.class.inc';
$config =& NDB_Config::singleton();
$client = new NDB_Client();
$client->initialize();


list($name,$extra) = explode("___", $_REQUEST['fieldname']);

$description = trim($_REQUEST['description']);

// create user object
$user =& User::singleton();

if ($user->hasPermission('data_dict_edit')) { //if user has edit permission

    $native_description = $DB->pselectOne(
        "SELECT Description FROM parameter_type WHERE Name = :v_name",
        array("v_name" => $name)
    );

    if ($description != $native_description) {
        if (empty($description)) {
            $description = ' ';
        }
        $DB->replace(
            'parameter_type_override',
            array(
                'Description' => $description,
                'Name'        => $name,
            )
        );
    } else {
        $DB->delete(
            'parameter_type_override',
            array('Name' => $name)
        );
    }
}


