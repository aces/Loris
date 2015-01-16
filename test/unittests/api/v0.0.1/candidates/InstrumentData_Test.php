<?php
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1a/candidates/InstrumentData.php';

class InstrumentData_Test extends PHPUnit_Framework_TestCase
{
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }
    }

    function testValidMethods() {
        try {
            $API = new \Loris\API\Candidates\Candidate\InstrumentData(
                "GET",
                "123456",
                "V06",
                "Instrument",
                false,
                false
            );
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }

        $this->assertEquals($API->AllowedMethods, ['GET', 'PUT', 'PATCH']);
        $this->assertEquals(0, 3);
    }
}
?>
