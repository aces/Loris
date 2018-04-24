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
$DB =& Database::singleton();
foreach ($_POST as $key => $value) {
    if (is_numeric($key)) { //update
        if ($value == "") {
            $DB->delete('Config', array('ID' => $key));
        } else {
            // if no duplicate value then do updating
            if (duplicateExistsInDropdown($key, $value)) {
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
       $DB     =& Database::singleton();
       $result = $DB->pselectOne(
           "SELECT COUNT(*) FROM Config WHERE ConfigID =:ConfigID AND Value =:Value",
           array(
            ':ConfigID' => $key,
            ':Value'    => $value,
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
function duplicateExistsInDropdown($id,$value)
{
       $DB       =& Database::singleton();
       $ConfigID = $DB->pselectOne(
           "SELECT ConfigID FROM Config WHERE ID =:ID",
           array(':ID' => $id)
       );
       $IDBefore = $DB->pselectOne(
           "SELECT ID FROM Config WHERE ConfigID =:ConfigID AND Value =:Value",
           array(
            ':ConfigID' => $ConfigID,
            ':Value'    => $value,
           )
       );
       return ($id == $IDBefore || $IDBefore == null);
}
exit();

?>
