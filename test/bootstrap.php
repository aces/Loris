<?php
/**
 * Created by PhpStorm.
 * User: kmarasinska
 * Date: 29/05/15
 * Time: 2:25 PM
 */

//@TODO: This needs to be changed to use a test specific config.xml. Tests should not use project/config.xml.
// When running tests LORIS app should connect to a test database
// because some tests are destructive (i.e. they wipe specific DB tables and repopulate them using test fixtures,
// from /test/fixtures/ folder)
//test specific config to use in test folder
//define('CONFIG_XML', __DIR__ . "/config.xml");
define('CONFIG_XML', __DIR__ . "/../project/config.xml");
define('TABLE_FIXTURES_PATH', __DIR__ . "/fixtures/tables/");

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__.'/unittests/Loris_PHPUnit_Database_TestCase.php';