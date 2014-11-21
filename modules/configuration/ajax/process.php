<?php
/**
 * This file is used by the Configuration module to update
 * or insert values into the Config table.
 *
 * PHP version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  GPLv3
 * @link     https://github.com/aces/Loris
 */

ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once 'NDB_Client.class.inc';
require_once "Utility.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();

$DB =& Database::singleton();
foreach ($_POST as $key => $value) {
    if (is_numeric($key)) { //update
        $DB->update(
            'Config', 
            array('Value' => $value), 
            array('ID' => $key)
        );
    } else { //add new or remove
        $id = split("-", $key);
        if ($id[0] === "add") {
            $DB->insert(
                'Config', 
                array('ConfigID' => $id[1], 'Value' => $value)
            );
        } elseif ($id[0] === "remove") {
            $DB->delete('Config', array('ID' => $id[1]));
        }
    } 
} 


exit();

?>