<?php
/**
 * PHPUnit bootstrap file
 *
 * To run phpunit:
 *  vendor/bin/phpunit
 *      --bootstrap /var/www/loris/test/bootstrap.php UnitTest [UnitTest.php]
 * OR
 *  vendor/bin/phpunit
 *      --configuration /var/www/loris/test/phpunit.xml UnitTest [UnitTest.php]
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Main
 * @author   Karolina Marasinska <karolinam.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

//@TODO: This needs to be changed to use a test specific config.xml.
// Tests should not use project/config.xml.
// When running tests LORIS app should connect to a test database because some tests
// are destructive
// (i.e. they wipe specific DB tables and repopulate them using test fixtures,
// from /test/fixtures/ folder)

//test specific config to use from test folder
//define('CONFIG_XML', __DIR__ . "/config.xml");
define('CONFIG_XML', __DIR__ . "/../project/config.xml");
define('TABLE_FIXTURES_PATH', __DIR__ . "/fixtures/tables/");

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__.'/unittests/Loris_PHPUnit_Database_TestCase.php';