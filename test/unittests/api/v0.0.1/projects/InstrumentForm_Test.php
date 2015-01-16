<?php
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1a/projects/InstrumentForm.php';

class InstrumentForm_Test extends PHPUnit_Framework_TestCase
{
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }
    }

    function testValidMethods() {
        try {
            $API = new \Loris\API\Projects\InstrumentForm("GET", "test", false, false, false);
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }
        $this->assertEquals($API->AllowedMethods, ['GET']);
    }
}
?>
