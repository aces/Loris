<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1a/candidates/InstrumentData.php';
require_once __DIR__ . "/../BaseTestCase.php";

class InstrumentData_Test extends BaseTestCase
{
    function testValidMethods() {
        try {
            $API = new \Loris\API\Candidates\Candidate\InstrumentData(
                "GET",
                "123456",
                "VisitTwo",
                "Test",
                false,
                true 
            );
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }

        $this->assertEquals($API->AllowedMethods, ['GET', 'PUT', 'PATCH']);
    }
}
?>
