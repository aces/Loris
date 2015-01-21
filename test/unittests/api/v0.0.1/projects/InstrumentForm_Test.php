<?php
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1a/projects/InstrumentForm.php';

if(!class_exists('NDB_BVL_Instrument_test')) {
    // NDB_BVL_Instrument::factory() directly calls "new $class",
    // so instead of using the PHP Unit mocking, we need to just
    // create a new class that does what we want. Namely, nothing.
    class NDB_BVL_Instrument_test extends NDB_BVL_Instrument {
        function __construct() {
        }

        function save() {
        }

        function _hasAccess() {
            return true;
        }

        function toJSON() {
            return '{ "Test" : "Test" }';
        }
    };
}
class InstrumentForm_Test extends PHPUnit_Framework_TestCase
{
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }
        // Create the Mock classes, so that the factory doesn't die.
        $this->getMockBuilder('NDB_Config')->setMockClassName("MockNDB_Config")->getMock();
        $this->getMockBuilder('Database')->setMockClassName("MockDatabase")->getMock();
        $this->Factory = NDB_Factory::singleton();
        $this->Factory->setTesting(true);
        // Make sure the references used by the test are the same ones
        // returned by the factory
        $this->Config = $this->Factory->config();
        $this->Database = $this->Factory->database();


    }

    function testValidMethods() {
        $API = new \Loris\API\Projects\InstrumentForm("GET", "test");
        $this->assertEquals($API->AllowedMethods, ['GET']);
    }

    function testGetInstrumentForm() {
        $API = new \Loris\API\Projects\InstrumentForm("GET", "test");
        $this->assertEquals($API->JSON, ["Test" => "Test"]);

    }
}
?>
