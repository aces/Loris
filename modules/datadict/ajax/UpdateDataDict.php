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

if (get_magic_quotes_gpc()) {
    // Magic quotes adds \ to description, get rid of it.
    $description = stripslashes($_REQUEST['description']);
} else {
    // Magic quotes is off, so we can just directly use the description
    // since insert() will use a prepared statement.
    $description = $_REQUEST['description'];
}

// create user object
$user =& User::singleton();

if ($user->hasPermission('data_dict_edit')) { //if user has edit permission
    if ($DB->pselectOne(
        "SELECT COUNT(*) FROM parameter_type_override " .
        "WHERE Name =:id",
        array('id' => $name)
    )==0) {  //if it doesn't exist
        // unsafeinsert is needed to allow '<TEST_NAME>_Date_taken' to be inserted
        $DB->unsafeinsert(
            'parameter_type_override',
            array(
             'Name'        => $name,
             'Description' => $description,
            )
        ); //insert it
    } else {
        $DB->update(
            'parameter_type_override',
            array('Description' => $description),
            array('Name' => $name)
        ); //else update it
    }
}

?>
