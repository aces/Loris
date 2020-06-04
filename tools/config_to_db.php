#!/usr/bin/env php
<?php
/**
 * script to move config.xml data to the database
 *
 * PHP version 5
 *
 * @category Main
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
 */

require_once __DIR__ . "/../vendor/autoload.php";
require_once 'generic_includes.php';
require_once 'Database.class.inc';

$xml_file = "../project/config.xml";
$iterator = new SimpleXmlIterator($xml_file, null, true);

iterate($iterator, null);

/**
 * iterate over the config xml
 *
 * @param SimpleXmlIterator $iterator  xml iterator
 * @param string            $parentKey parent of the current value of the iterator
 *
 * @return void
 */
function iterate($iterator, $parentKey)
{
    $db = Database::singleton();
    for ($iterator->rewind(); $iterator->valid(); $iterator->next()) {
        $current = $iterator->current();
        $name  = $iterator->key();
        if ($iterator->hasChildren()) {
            iterate($current, $name);
        } else { // Else it is a leaf

            // If a key by that name exists, get its ID
            $configID = $db->pselectone(
                "SELECT ID 
                 FROM ConfigSettings 
                 WHERE Name=:name", 
                array('name' => $name)
            );

            // If the key already exists
            if (!empty($configID)) {
                $dbParentKey = $db->pselectone(
                    "SELECT Name 
                     FROM ConfigSettings 
                     WHERE ID=(SELECT Parent FROM ConfigSettings WHERE Name=:name)", 
                    array('name' => $name)
                );
                if ($parentKey==$dbParentKey) {

                    // Insert into the DB
                    processLeaf($name, $current, $configID);
                }
            }
        }
    }
}

/**
 * insert a value into the Config table
 *
 * @param string $name     name of the config field
 * @param string $value    value of the config field
 * @param int    $configID ID of the config field
 *
 * @return void
 */
function processLeaf($name, $value, $configID)
{
    $db = Database::singleton();
    $allowMultiple = $db->pselectone(
        "SELECT AllowMultiple 
         FROM ConfigSettings 
         WHERE ID=:configID", 
        array('configID' => $configID)
    );
    $currentValue  = $db->pselect(
        "SELECT Value 
         FROM Config 
         WHERE ConfigID=:configID", 
        array('configID' => $configID)
    );

    // if the configID is not already in the config table
    if (empty($currentValue)) {

        $db->insert(
            'Config', array('ConfigID' => $configID, 'Value' => $value)
        );

    } else if (!empty($currentValue) && $allowMultiple==0) { 
        // if the configID exists and the field does not allow multiples

        $db->update(
            'Config', array('Value' => $value), array('ConfigID' => $configID)
        );

    } else { // if the configID exists and the field does allow multiples
        
        // if it is not a copy of an already existing value
        if (!Recursive_In_array($value, $currentValue)) {
            $db->insert(
                'Config', array('ConfigID' => $configID, 'Value' => $value)
            );
        }

    }
}

/**
 * recursive in_array function
 *
 * @param string $value the value being searched for
 * @param array  $array the array being searched through
 *
 * @return boolean
 */
function Recursive_In_array($value, $array)
{
    foreach ($array as $sub_array) {
        if ($sub_array == $value 
            || (is_array($sub_array) && Recursive_In_array($value, $sub_array))
        ) {
            return true;
        }
    }
    return false;
}
?>
