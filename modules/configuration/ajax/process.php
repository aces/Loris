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
$factory = \NDB_Factory::singleton();
$DB      = $factory->database();
foreach ($_POST as $key => $value) {
    if (is_numeric($key)) { //update
        if ($value == "") {
            $DB->delete('Config', array('ID' => $key));
        } else {
            // if no duplicate value then do updating
            if (noDuplicateInDropdown($key, $value)) {
                $DB->update(
                    'Config',
                    array('Value' => $value),
                    array('ID' => $key)
                );
            } else {
                   header("HTTP/1.1 400 Bad Request");
                   exit();
            }
        }
    } else { //add new or remove
        $keySplit   = explode("-", $key);
        $valueSplit = explode("-", $value);
        if ($keySplit[0] == 'add') {
            if ($value !== "") {
                if (countDuplicate($keySplit[1], $value) == '0') {
                    $DB->insert(
                        'Config',
                        array(
                         'ConfigID' => $keySplit[1],
                         'Value'    => $value,
                        )
                    );
                } else {
                        header("HTTP/1.1 303 Duplicate value");
                        exit();
                }
            }
        } elseif ($valueSplit[0] == 'remove') {
            $DB->delete('Config', array('ID' => $valueSplit[1]));
        }
    }
}
/**
 * Check Duplicate value
 *
 * @param string $key   The value of the key
 * @param string $value The value of the value
 *
 * @return int $result
 */
function countDuplicate($key,$value)
{
    $factory   = \NDB_Factory::singleton();
    $DB        = $factory->database();
       $result = $DB->pselectOne(
           "SELECT COUNT(*) FROM Config WHERE ConfigID =:ConfigID AND Value =:Value",
           array(
            'ConfigID' => $key,
            'Value'    => $value,
           )
       );
       return $result;
}
/**
 * Check dropdown list Duplicate value
 *
 * @param string $id    The value of the id
 * @param string $value The value of the value
 *
 * @return boolean return true if there is no Duplicate value
 */
function noDuplicateInDropdown($id,$value)
{
    $factory = \NDB_Factory::singleton();
    $DB      = $factory->database();
       // ConfigID can be found in the Config table by searching new id.
       $ConfigID = $DB->pselectOne(
           "SELECT ConfigID FROM Config WHERE ID =:ID",
           array('ID' => $id)
       );
       // IDBefore means that row ID contains the same configID and value pair.
       $IDBefore = $DB->pselectOne(
           "SELECT ID FROM Config WHERE ConfigID =:ConfigID AND Value =:Value",
           array(
            'ConfigID' => $ConfigID,
            'Value'    => $value,
           )
       );
       //If the new "id" equals "IDBefore" in Config table means
       //it can be updated in the table. Otherwise, it means Dropdown menu has
       // already had the same configID and value pair.

       //If the "IDBefore" is empty in the table means
       //we can insert the new configID and value pair into the table.Otherwise,
       // it means Dropdown menu has already had the same configID and value pair.
       return ($id == $IDBefore || $IDBefore == null);
}
exit();


