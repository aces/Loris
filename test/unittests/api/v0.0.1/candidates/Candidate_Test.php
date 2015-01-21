<?php
namespace Loris\Tests\API;

require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1a/candidates/Candidate.php';
require_once __DIR__ . '/../BaseTestCase.php';

class Candidate_Test extends BaseTestCase
{

    function setUp() {
        parent::setUp();

        $this->Database->method("pselectRow")->will($this->returnCallback(
            function ($query, $params) {
                if(strpos($query, "SELECT c.CenterID, c.CandID, c.") == 0
                    && $params == ['Candidate' => "123456"]) {
                        return [
                            'CenterID' => 1,
                            "CandID" => 123456,
                            "PSCID" => "TestCandidate",
                            "DoB"   => "1900-02-20",
                            "EDC"   => null,
                            "Gender" => "Male",
                            "PSC" => "Test"
                        ];
                    }
                return array();
            }
        ));
    }
    function testValidMethods() {
        $API = new \Loris\API\Candidates\Candidate("GET", "123456");

        $this->assertEquals($API->AllowedMethods, ['GET']);
    }

    function testGetValidCandidate() {
        $API = new \Loris\API\Candidates\Candidate("GET", "123456");

        $this->assertEquals($API->JSON,
            [
                "Meta" => [ "CandID" => 123456 ],
                "Visits" => [ "VisitTwo" ]
            ]
        );

    }
}
?>
