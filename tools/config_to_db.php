<?php

require_once 'generic_includes.php';
require_once 'Database.class.inc';

$xml_file = "../project/config.xml";
$iterator = new SimpleXmlIterator($xml_file, null, true);

iterate($iterator);

// iterate over the config xml
function iterate($iterator) {
	$db = Database::singleton();
	for ($iterator->rewind(); $iterator->valid(); $iterator->next()) {
		$current = $iterator->current();
	    if ($iterator->hasChildren()) {
	    	iterate($current);
	    }
	    // Else it is a leaf
	    else {
	    	$name  = $iterator->key();
	    	// If a key by that name exists, get its ID
	    	$configID = $db->pselectone("SELECT ID FROM ConfigSettings WHERE Name=:name", array('name' => $name));
	    	
	    	// If the key already exists
	    	if (!empty($configID)) {

	    		/*parent
	    		$parent = $current->xpath("parent::*");
	    		print_r($parent);*/

				// Insert into the DB
		    	processLeaf($name, $current, $configID);
	    	}
	    }
	}
	return;
}

// Insert a value into the Config table
function processLeaf($name, $value, $configID) {
	$db = Database::singleton();
	$allowMultiple = $db->pselectone("SELECT AllowMultiple FROM ConfigSettings WHERE ID=:configID", array('configID' => $configID));
	$currentValue  = $db->pselect("SELECT Value FROM Config WHERE ConfigID=:configID", array('configID' => $configID));

	// if the configID is not already in the config table
	if (empty($currentValue)) {
		$db->insert('config', array('ConfigID' => $configID, 'Value' => $value));
	}
	// if the configID exists and the field does not allow multiples
	else if (!empty($currentValue) && $allowMultiple==0) {
		$db->update('config', array('Value' => $value), array('ConfigID' => $configID));
	}
	// if the configID exists and the field does allow multiples
	else {
		// if it is not a copy of an already existing value
		if (!in_array_r($value, $currentValue)) {
			$db->insert('config', array('ConfigID' => $configID, 'Value' => $value));
		}
	}
}

// recursive in_array function
function in_array_r($value, $array) {
	foreach ($array as $sub_array) {
		if ($sub_array == $value || (is_array($sub_array) && in_array_r($value, $sub_array))) {
			return true;
		}
	}
	return false;
}
?>