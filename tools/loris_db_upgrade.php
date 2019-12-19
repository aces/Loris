#!/usr/bin/php
<?php

/**
 * This script will upgrade the loris database to the lastest. 
 * Usage: php loris_db_upgrade.php [-D]
 *
 * PHP Version 7
 *
 * @category Install
 * @package  Loris
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 * @package behavioural
 */
require_once __DIR__ . "/../vendor/autoload.php";
require_once __DIR__ . "/generic_includes.php";
 set_include_path(get_include_path().":../project/libraries:../php/libraries:");
require_once "../php/libraries/Database.class.inc";
require_once "../php/libraries/NDB_Config.class.inc";
$path    = __DIR__ . "/../SQL/Release_patches";

$files = array_diff(scandir($path), array('.', '..'));

echo "This script will upgrade the loris database to the lastest.\n";
echo "Backing Up the Database Before Upgrading the Database.\n"

$v = readline("\n Enter current version of Loris database (ex:21.0): ");
  
if (!file_exists('../project/config.xml')) {
    die("config.xml file doesn't exist. Aborting update.");
}

$DB = \Database::singleton();
$sql = null;
foreach($files as $file){

    if (substr($file, 0, 5)>=$v) {
     print_r($file);
      $a = file_get_contents(__DIR__ . "/../SQL/Release_patches/".$file);
      $sql .= $a;

    }
}
    try {
       $DB->_PDO->exec($sql);
    } catch (PDOException $e){
       echo $e->getMessage();
    }
echo "Upgrade completed successfully!";
