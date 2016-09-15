<?php

set_include_path(get_include_path().":../../project/libraries:../../php/libraries:");
require_once "NDB_Client.class.inc";
$client =& new NDB_Client();
$client->initialize("../../project/config.xml");

$config =& NDB_Config::singleton();
$home = $config->getSetting('url');

echo $home;

?>
