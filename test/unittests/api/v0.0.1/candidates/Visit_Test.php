<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1a/candidates/Visit.php';
require_once __DIR__ . '/../BaseTestCase.php';

class Visit_Test extends BaseTestCase
{
    function testValidMethods() {
        $API = new \Loris\API\Candidates\Candidate\Visit("GET", "123456", "VisitTwo");
        $this->assertEquals($API->AllowedMethods, ['GET', 'PUT']);
    }

    function testGetValidVisitLabel() {
        $API = new \Loris\API\Candidates\Candidate\Visit("GET", "123456", "VisitTwo");
        $this->assertEquals($API->JSON,
            [
                "Meta" => [
                    "CandID" => 123456,
                    "Visit" => "VisitTwo"
                ]
            ]
        );
    }

    function testInvalidVisitLabel() {
        $this->expectOutputString(json_encode(["error" => "Invalid visit IDontExist"]));
        try {
            $API = new \Loris\API\Candidates\Candidate\Visit("GET", "123456", "IDontExist");
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }

        $this->assertEquals($API->Headers, ["HTTP/1.1 404 Not Found"]);
    }
}
?>
