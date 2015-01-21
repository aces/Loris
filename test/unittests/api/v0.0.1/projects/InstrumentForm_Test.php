<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1a/projects/InstrumentForm.php';
require_once __DIR__ . "/../BaseTestCase.php";

class InstrumentForm_Test extends BaseTestCase
{
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
