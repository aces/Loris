<?php
/**
 * This file is used by the Configuration module to update
 * or insert values into the Config table.
 *
 * FIXME This code should be refactored away from using the separate 'ajax'
 * file model toward using a more robust Loris Module-based approached.
 * This is dependent on the Reactifying of the Configuration module generally.
 *
 * PHP version 7
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

if (!\User::singleton()->hasPermission('config')) {
    header("HTTP/1.1 403 Forbidden");
    return;
}

$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize();
$factory = \NDB_Factory::singleton();
$DB      = $factory->database();
$pathIDs = getPathIDs();
foreach ($_POST as $key => $value) {
    if (is_numeric($key)) { //update
        if ($value == "") {
            $DB->update('Config', array('Value' => null), array('ID' => $key));
        } else {
            // if no duplicate value then do updating
            if (noDuplicateInDropdown($key, $value)) {
                if (in_array(intval($key), $pathIDs, true)) {
                    if (!validPath($value)) {
                        $err = 'Directory `'
                            . htmlspecialchars($value, ENT_QUOTES)
                            . '` is invalid';
                        // Set response code and display error message.
                        displayError(400, $err);
                        return;
                    }
                }
                $DB->update(
                    'Config',
                    array('Value' => $value),
                    array('ID' => $key)
                );
            }
        }
    } else { //add new or remove
        $keySplit   = explode("-", $key);
        $valueSplit = explode("-", $value);
        if ($keySplit[0] == 'add') {
            if ($value !== "") {
                if (countDuplicate($keySplit[1], $value) == '0') {
                    $DB->update(
                        'Config',
                        array('Value' => $value),
                        array(
                         'ConfigID' => $keySplit[1],
                        )
                    );
                } else {
                    header("HTTP/1.1 303 Duplicate value");
                    exit();
                }
                if (in_array(intval($keySplit[1]), $pathIDs, true)) {
                    if (!validPath($value)) {
                        $err = 'Directory `' . htmlspecialchars($value, ENT_QUOTES)
                            . '` is invalid';
                        // Set response code and display error message.
                        displayError(400, $err);
                        return;
                    }
                }
                $DB->insert(
                    'Config',
                    array(
                     'ConfigID' => $keySplit[1],
                     'Value'    => $value,
                    )
                );
            }
        } elseif ($valueSplit[0] == 'remove') {
            $DB->update(
                'Config',
                array('Value' => null),
                array('ID' => $valueSplit[1])
            );
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
/**
 * Query DB for config settings that correspond to filepaths.
 *
 * @return array IDs corresponding to path settings.
 */
function getPathIDs()
{
    $ids = array();
    /* Query adapated from:
     * https://github.com/aces/Loris/wiki/Project-Customization
     */
    $query  = "SELECT c.ConfigID,c.ID FROM Config c "
        . "LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) "
        . "JOIN ConfigSettings csp ON (cs.Parent = csp.ID) "
        . "WHERE cs.DataType = 'web_path';";
    $result = \Database::singleton()->pselect($query, array());
    foreach ($result as $key => $value) {
        // The configuration module uses both the ID and ConfigID in different
        // contexts when updating or adding paths via the front-end.
        // At some point in the future this should be reworked for consistency
        // in the main module code. Either "ID" or "ConfigID" should be used,
        // but not both.
        // Until then, both IDs will also be used here.
        $ids[] = intval($value['ID']);
        $ids[] = intval($value['ConfigID']);
    }
    return $ids;
}

/**
 * Return a json-encoded error message and response code when an error occurs
 *
 * @param int    $code A valid HTTP Response Code.
 * @param string $msg  Error text to display.
 *
 * @return void
 */
function displayError(int $code, string $msg): void
{
    // Display error message and return
    http_response_code($code);
    echo "ERROR: $msg";
}

/**
 * Ensures that the passed value is a readable directory.
 *
 * @param string $value The value to test.
 *
 * @return bool Whether the value is a readable directory.
 */
function validPath($value)
{
    if (! (is_dir($value) && is_readable($value))) {
        return false;
    }
    return true;
}

