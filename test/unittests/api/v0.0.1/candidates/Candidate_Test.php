<?php
namespace Loris\Tests\API;

require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1/candidates/Candidate.php';
require_once __DIR__ . '/../BaseTestCase.php';

class Candidate_Test extends BaseTestCase
{

    function setUp() {
        $this->getMockBuilder('Candidate')->setMockClassName("MockCandidate")->getMock();


        parent::setUp();

        $this->Candidate = $this->Factory->candidate(123456);



        $this->Candidate->method("getListOfVisitLabels")->willReturn(["VisitTwo"]);
        $this->Candidate->method("getCandidateGender")->willReturn("Male");
        $this->Candidate->method("getCandidateDoB")->willReturn("1900-02-20");
        $this->Candidate->method("getCandidateSite")->willReturn("Test");
        $this->Candidate->method("getPSCID")->willReturn("TestCandidate");
        $this->Candidate->method("getProjectTitle")->willReturn("loris");
        $this->Candidate->method("getListOfVisitLabels")->willReturn([
            "340" => "Test",
            '343' => "VisitTwo"
        ]
        );

        $this->Database->method("pselectRow")->will($this->returnCallback(
            function ($query, $params) {
                if(strpos($query, "SELECT c.CenterID, c.CandID, c.") == 0
                    && $params == ['Candidate' => "123456"]) {
                        return [
                            'CenterID' => 1,
                            "CandID" => 123456,
                            "PSCID" => $this->Candidate->getPSCID(),
                            "DoB"   => $this->Candidate->getCandidateDoB(),
                            "EDC"   => null,
                            "Gender" => $this->Candidate->getCandidateGender(),
                            "PSC" => $this->Candidate->getCandidateSite()
                        ];
                    }
                if(strpos($query, "SELECT MAX(c.Testdate) as CandChange") === 0) {
                    return [
                        'CandChange' => '24343',
                        'VisitChange' => '23433',
                        'VisitCount' => '3'
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
                "Meta" => [
                    "CandID" => 123456,
                    "Project" => "loris",
                    "PSCID" => "TestCandidate",
                    "Site" => "Test",
                    "EDC" => null,
                    "DoB" => "1900-02-20",
                    "Gender" => "Male"
                ],
                "Visits" => ["Test", "VisitTwo" ]
            ]
        );

    }
}
?>
