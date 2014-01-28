<?php

/**
 * inititalize
 */
set_include_path(get_include_path().":../php/libraries:");
require_once "NDB_Client.class.inc";
require_once "NDB_Config.class.inc";
require_once "Utility.class.inc";
$client = new NDB_Client();
$client->makeCommandLine();
$client->initialize("../project/config.xml");
$config = NDB_Config::singleton();

$db =& Database::singleton();
$fp = fopen("php://stdin", "r");
$db->select("SELECT CenterID, Name FROM psc ORDER BY CenterID", $centers_q);
$centres = array();

print "Enter name: ";
while($line = fgets($fp, 4096)) { 
    $name = $line;
    break;
}
$name = trim($name);
print "Available Centres:\n";
foreach ($centers_q as $row) {
    print "\t$row[CenterID]: $row[Name]\n";
    $centres[$row['CenterID']] = $row['Name'];
}
print "\n\nEnter CenterID: ";
while($line = fgets($fp, 4096)) { 
    print "Enter CenterID: ";
    if(array_key_exists(intval($line), $centres)) {
        $selected = intval($line);
        break;
    }
}

$db->insert("examiners", array('full_name' => $name, 'centerID' => $selected, 'radiologist' => FALSE));

print "\n\nInserted name: $name, CenterID: $selected\n";
?>
