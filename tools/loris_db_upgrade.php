#!/usr/bin/php
<?php declare(strict_types=1);

/**
 * This script will upgrade the LORIS database to a specified release version.
 * Usage: php loris_db_upgrade.php -D 
 * Errorlog: log/*.log
 * PHP Version 7
 *
 * @category Install
 * @package  Loris
 * @author   Shen Wang <shen.wang2@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
 * @package core
 */
require_once __DIR__ . "/generic_includes.php";

// check the running path if not in tools, it will quit
if (basename(__DIR__) !== 'tools') {
    exit("This script only runs in the tools directory!");
}

//get sql file path
$path    = __DIR__ . "/../SQL/Release_patches";

// file names from the Release_patches
$files = array_diff(scandir($path), array('.', '..'));

echo "This script will upgrade the LORIS database to the latest release version.\n";

if (!file_exists('../project/config.xml')) {
    print("config.xml file doesn't exist. Aborting update.");
    exit(1);
}

$v = $argv[1];
$versionList = array();

// read from file names, make a version list 
foreach ($files as $file){
  $f = explode("_",$file);
  $versionList[] = $f[0];
  $versionList[] = $f[2];
  }
$versionList = array_unique($versionList);

// if user input version is not an available version, it will print a list and quit
if (!in_array($v,$versionList))
 {
   echo "Please input an available version! \n";
   echo "Pick one version from the version list below! \n";
   foreach ($versionList as $list){
      print_r($list."\n");
   }
   exit;
 }

// read sql file needed for update.  
$sql = null;
$query = null;
foreach($files as $file){

    if (substr($file, 0, strpos($file,'_'))>=$v) {
       print_r($file);
       write_log("*********".$file."*********\n");

      $a = file_get_contents(__DIR__ . "/../SQL/Release_patches/".$file);
      $sql .= $a;

    }
}

$lines = explode(PHP_EOL, $sql);
foreach ($lines as $line) {
  // remove comment line from sql file
   if (substr($line, 0, 2) !== '--') {
     $query .= $line." ";
   }

}

$factory      = \NDB_Factory::singleton();
$db_config    = $factory->config()->getSetting('database');
$mysqli = new mysqli($db_config['host'], $db_config['adminUser'], $db_config['adminPassword'], $db_config['database']);

if (!$mysqli) {
	    echo "Error: Unable to connect to MySQL." . PHP_EOL;
    echo "Debugging errno: " . mysqli_connect_errno() . PHP_EOL;
    echo "Debugging error: " . mysqli_connect_error() . PHP_EOL;
    exit;
}

$errs = array();


$qureys = explode(";",$query);
foreach ($qureys as $q) {
   if (!empty(trim($q))) {
      if (!$mysqli->query($q)) {
         $error = ($mysqli->error);
         $errs[]= $error;
         print_r($error."\n");
         write_log("-----------".date("h:i:sa")."-----------");
         write_log($q);
         write_log($error);
         write_log("----------------------------------------");
      } else {
           echo "OK! \n";
      }
   }
}
if (empty($errs)) {
   echo "Upgrade completed successfully!";
} else {
   echo "Fix the errors in Database!";
}


function write_log(string $log_msg): void
{
    $log_dir = "log";
    if (!file_exists($log_dir))
    {
        // create directory/folder uploads.
        mkdir($log_dir, 0640, true);
    }
    $log_file_data = $log_dir.'/log_' . date('d-M-Y') . '.log';
        // append the message at the end of the log file.
    file_put_contents($log_file_data, $log_msg . "\n", FILE_APPEND);
}
