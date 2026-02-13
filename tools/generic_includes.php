<?php declare(strict_types=1);

/**
 * This script contains useful generic stuff to include
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Main
 * @author   Loris <loris-dev@bic.mni.mcgill.ca>
 * @license  Loris License
 * @link     https://github.com/aces/Loris
 */

set_include_path(
    get_include_path().":".
    __DIR__."/../project/libraries:".
    __DIR__."/../php/libraries:"
);

require_once __DIR__ . "/../vendor/autoload.php";
$configFile = __DIR__."/../project/config.xml";
$client     = new NDB_Client();
$client->makeCommandLine();
$client->initialize($configFile);
$config        = NDB_Config::singleton();
$DB            = NDB_Factory::singleton()->database();
$lorisInstance = new \LORIS\LorisInstance(
    $DB,
    $config,
    [
        __DIR__ . "/../project/modules",
        __DIR__ . "/../modules/",
    ],
);
// Register S3 stream wrapper if configured
if (getenv('AWS_ACCESS_KEY_ID') !== false) {
    (new \LORIS\AWS\Client($lorisInstance))->registerStreamWrapper();
}
