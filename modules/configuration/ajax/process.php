<?php
/**
 * This file is used by the Configuration module to update
 * or insert values into the Config table.
 *
 * FIXME This code should be refactored away from using the separate 'ajax'
 * file model toward using a more robust Loris Module-based approached.
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
foreach ($_POST as $key => $value) {
    if (is_numeric($key)) {
        // When a $key is numeric, it means we are updating the entry in the
        // Config table with ID == $key.
        if ($value == "") {
            // A blank value is the same as deleting.
            $DB->delete('Config', array('ID' => $key));
        } else {
            if (! noDuplicateInDropdown($key, $value)) {
                // Don't alter the table if the same key was passed twice.
                continue;
            }
            // Get all the IDs in Config with a relation to an entry in the
            // ConfigSettings table that has the web_path data type.
            $pathIDs = getPathIDs('Config');
            if (in_array($key, $pathIDs)) {
                // If updating a path config setting, make sure that the
                // value is a valid path. This helps to prevent malicious
                // input.
                if (!validPath($value)) {
                    $err = 'Directory `'
                        . htmlspecialchars($value, ENT_QUOTES)
                        . '` is invalid';
                    // Set response code and display error message.
                    displayError(400, $err);
                    return;
                }
            }
            // Update the config setting to the new value.
            $DB->update(
                'Config',
                array('Value' => $value),
                array('ID' => $key)
            );
        }
    } else {
        // This branch is executed when the key is prefixed with the string
        // 'add' or 'remove' (i.e. the full key is not numeric and triggers this
        // else branch).
        // An example $key is 'add-38' which means "Add an entry in the Config
        // table using foriegn key 38 from the ConfigSettings table." The
        // number refers to ConfigSettings.ID which is different from
        // Config.ID.
        // This is different from the above is_numeric case; this makes use of
        // Config.ID, not Config.ConfigID (which is a FK to ConfigSettings.ID).
        // The Config table is the one that will be modified here.
        $keySplit         = explode("-", $key); // e.g. 'add-10' or 'remove-49'
        $action           = $keySplit[0];
        $ConfigSettingsID = $keySplit[1];
        if ($action == 'add') {
            // This branch adds a new entry to the Config table.
            if ($value === "") {
                continue;
            }
            if (isDuplicate($ConfigSettingsID, $value)) {
                header("HTTP/1.1 303 Duplicate value");
                exit();
            }
            // Get all the IDs in ConfigSettings with the web_path data type.
            $pathIDs = getPathIDs('ConfigSettings');
            if (in_array($ConfigSettingsID, $pathIDs)) {
                if (!validPath($value)) {
                    $err = 'Directory `' . htmlspecialchars($value, ENT_QUOTES)
                        . '` is invalid';
                    // Set response code and display error message.
                    displayError(400, $err);
                    return;
                }
            }
            // Add the new setting
            $DB->insert(
                'Config',
                array(
                 'ConfigID' => $ConfigSettingsID, // FK to ConfigSettings.
                 'Value'    => $value,
                )
            );
        } elseif ($action == 'remove') {
            // Delete an entry from the Config table.
            $DB->delete(
                'Config',
                array('ConfigID' => $ConfigSettingsID)
            );
        }
    }
    unset($pathIDs);
}
/**
 * Check Duplicate value
 *
 * @param string $key   The value of the key
 * @param string $value The value of the value
 *
 * @return bool $result
 */
function isDuplicate($key, $value): bool
{
    $factory = \NDB_Factory::singleton();
    $DB      = $factory->database();
    $result  = $DB->pselectOne(
        "SELECT COUNT(*) FROM Config WHERE ConfigID =:ConfigID AND Value =:Value",
        array(
         'ConfigID' => $key,
         'Value'    => $value,
        )
    );
    return intval($result) > 0;
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
 * Depending on the context, either the Config or ConfigSettings table can be
 * used. This is determined by what IDs the code currently has access to.
 *
 * @param string $table 'Config' or 'ConfigSettings'.
 *
 * @return array IDs corresponding to path settings.
 */
function getPathIDs(string $table): array
{
    if (! in_array($table, array('Config', 'ConfigSettings', true))) {
        throw new \LorisException('Table must be "Config" or "ConfigSettings"');
    }
    $ids = array();
    switch ($table) {
    case 'Config':
        /* Query adapated from:
         * https://github.com/aces/Loris/wiki/Project-Customization
         */
        $query = "SELECT c.ID FROM Config c "
            . "LEFT JOIN ConfigSettings cs ON (c.ConfigID = cs.ID) "
            . "JOIN ConfigSettings csp ON (cs.Parent = csp.ID) "
            . "WHERE cs.DataType = 'web_path';";
        break;
    case 'ConfigSettings':
        $query = "SELECT ID FROM ConfigSettings "
            . "WHERE DataType = 'web_path';";
        break;
    }
    return \Database::singleton()->pselectCol($query, array());
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

