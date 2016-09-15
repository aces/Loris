<?php
require_once "NDB_Client.class.inc";
$client =& new NDB_Client();
$client->initialize("../../project/config.xml");

$config =& NDB_Config::singleton();
$imgPath = $config->getSetting('imagePath');


$db =& Database::singleton();
if(PEAR::isError($db)) {
    print "Could not connect to database: ".$db->getMessage()."<br>\n"; die();
}

//If selecting obj file, grab those from the database
if ($_POST['option'] == 'surface'){
    $files = $db->pselect("SELECT File FROM files WHERE SessionID =:s AND FileType =:f", array(':s'=> $_POST['sessionID'], ':f'=> 'obj')); 
    if (PEAR::isError($files)){
        return PEAR::raiseError("Could not retrieve files: " . $files->getMessage());
    }
}

//If selecting thickness file, grab those from the database
elseif ($_POST['option'] == 'thickness'){
    $files = $db->pselect("Select File from files where SessionID =:s and file like '%txt'", array(':s'=> $_POST['sessionID']));
    if (PEAR::isError($files)){
        return PEAR::raiseError("Could not retrieve files: " . $files->getMessage());
    }
}

//Replace image path as specified in config file with sym link folder for file visibility
$escapedPath = preg_replace("/\//", "\/", $imgPath);

foreach ($files as $row) {
      $filename = preg_replace("/$escapedPath/", "", $row['File']);
      echo "BrainBrowser/files/";
      echo $filename . "\n"; 
}

?>
