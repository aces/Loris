<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1/candidates/Instruments.php';
require_once __DIR__ . '/../BaseTestCase.php';

class Instruments_Test extends BaseTestCase
{
    function testValidMethods() {
        $API = new \Loris\API\Candidates\Candidate\Instruments(
            "GET",
            "123456",
            "VisitTwo"
        );

        $this->assertEquals($API->AllowedMethods, ['GET']);
    }

    function testGetCandidateInstruments() {
        $API = new \Loris\API\Candidates\Candidate\Instruments(
            "GET",
            "123456",
            "VisitTwo"
        );

        $this->assertEquals($API->JSON,
            [
                "Meta" => [
                    "CandID" => 123456,
                    "Visit" => "VisitTwo"
                ],
                "Instruments" => ["Test", "TestTwo"]
            ]
        );
    }
}
?>
