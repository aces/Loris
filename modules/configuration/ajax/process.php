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
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

ini_set('default_charset', 'utf-8');

require_once "Database.class.inc";
require_once 'NDB_Client.class.inc';
require_once "Utility.class.inc";

$user =& User::singleton();
if (!$user->hasPermission('config')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();
// this qurey could delete duplicate ConfigID-value pairs 
$query = "Delete from Config  Where ID in
    (
      select temp.ID from
       (select ID from Config c
          where (c.ConfigId,c.Value) in 
                (
                 select ConfigId,Value
                 from Config group by ConfigId,Value
                 having count(*) > 1
                )
          and ID not in
               (
                select min(ID)
                from Config group by ConfigId,Value having count(*)>1
               )
       ) temp
    )";
$DB =& Database::singleton();
foreach ($_POST as $key => $value) {
    if (is_numeric($key)) { //update
        if ($value == "") {
            $DB->delete('Config', array('ID' => $key));
        } else {
            $DB->update(
                'Config',
                array('Value' => $value),
                array('ID' => $key)
            );
            //delete duplicate ConfigID-value pairs 
            $DB->run($query);
        }
    } else { //add new or remove
        $keySplit   = explode("-", $key);
        $valueSplit = explode("-", $value);
        if ($keySplit[0] == 'add') {
            if ($value !== "") {
                $DB->insert(
                    'Config',
                    array(
                     'ConfigID' => $keySplit[1],
                     'Value'    => $value,
                    )
                );
            }
        } elseif ($valueSplit[0] == 'remove') {
            $DB->delete('Config', array('ID' => $valueSplit[1]));
        }
    }
}


exit();

?>
