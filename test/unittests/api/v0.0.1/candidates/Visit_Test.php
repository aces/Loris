<?php
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1a/candidates/Visit.php';

class Visit_Test extends PHPUnit_Framework_TestCase
{
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }
    }

    /**
     * @expectedException Exception
     */
    function testValidMethods() {
        $API = new \Loris\API\Candidates\Candidate\Visit("GET", "123456", "V06");

        $this->assertEquals($API->AllowedMethods, ['GET']);
    }
}
?>
