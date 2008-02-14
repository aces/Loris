<?
/**
* This file displays the jpog images in the browser
* It checks the image name format and the path to make sure that only allowed images (from dirs defined in the config file) are displayed.
* @version $Id: view_files.php,v 3.6 2007/03/16 16:35:20 sebas Exp $
* @package mri
*/

   
/**
* display jpg image
*/
$content_type = 'image/jpeg';
header("Content-type: $content_type");

// instead of making local config obj, parse the config file here...
// cannot use NDB_Config class b/c of path to xml file in the class' load() method

// PEAR::Config
require_once "Config.php";

// define which configuration file we're using for this installation
$configFile = "../../project/config.xml";

// load the configuration data into a global variable $config
$configObj = new Config;
$root =& $configObj->parseConfig($configFile, "XML");
if(PEAR::isError($root)) {
    die("Config error: ".$root->getMessage());
}
$configObj =& $root->searchPath(array('config'));
$config =& $configObj->toArray();
$config = $config['config'];
unset($configObj, $root, $configFile);

// test the file name format and the path
if (strpos($file, $config['paths']['data']) === 0 && strrpos($file, '.jpg') !== false && strpos($file, '.jpg') == strlen($file)-4)
{
  $filename = $file;
  $handle = fopen ($filename, "r");
  $contents = fread ($handle, filesize ($filename));
  fclose ($handle);
  echo $contents;
}
?>
