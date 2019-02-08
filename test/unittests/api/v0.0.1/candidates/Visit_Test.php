<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1/candidates/Visit.php';
require_once __DIR__ . '/../BaseTestCase.php';

class Visit_Test extends BaseTestCase
{
    private $Timepoint;
    function setUp() {
       parent::setUp();
       $this->Timepoint = $this->Factory->Timepoint("323");
       $this->Timepoint->method("getData")->will(
           $this->returnCallback(
               function ($param) {
                   if($param === "SubprojectTitle") {
                       return "Test Battery";
                   }
               }
           )
       );
       $this->Timepoint->method("getDateOfScreening")->willReturn("1934-03-20");
       $this->Timepoint->method("getScreeningStatus")->willReturn("Pass");

       $this->Timepoint->method("getDateOfVisit")->willReturn("1934-03-27");
       $this->Timepoint->method("getVisitStatus")->willReturn("Pass");

       $this->Timepoint->method("getDateOfApproval")->willReturn("1935-03-20");
       $this->Timepoint->method("getApprovalStatus")->willReturn("Failure");
    }

    function testValidMethods() {
        $API = new \Loris\API\Candidates\Candidate\Visit("GET", "123456", "VisitTwo");
        $this->assertEquals($API->AllowedMethods, ['GET', 'PUT']);
    }

    function testGetValidVisitLabel() {
        $API = new \Loris\API\Candidates\Candidate\Visit("GET", "123456", "VisitTwo");
        $this->assertEquals($API->JSON,
            [
                "Meta" => [
                    "CandID" => '123456',
                    "Visit" => "VisitTwo",
                    "Battery" => "Test Battery"
                ],
                "Stages" => [
                    "Screening" => [
                        "Date" => "1934-03-20",
                        "Status" => "Pass"
                    ],
                    "Visit" => [
                        "Date" => "1934-03-27",
                        "Status" => "Pass"
                    ],
                    "Approval" => [
                        "Date" => "1935-03-20",
                        "Status" => "Failure"
                    ],
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

    function testPutInvalidBattery() {
        $this->expectOutputString(json_encode(["error" => "Test battery specified does not exist"]));
        $JSON = json_encode([
            "Meta" => [
                "CandID" => 123456,
                "Visit"  => "V3",
                "Battery" => "I don't belong here"
            ]
        ], true);
        try {
            $API = new \Loris\API\Candidates\Candidate\Visit("PUT", "123456", "V3", $JSON);
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }
        $this->assertEquals($API->Headers, ["HTTP/1.1 400 Bad Request"]);
    }

    /**
     * PhanParamTooMany is incorrectly being triggered by the mockBuilders because
     * it uses reflection. Phan thinks it takes 0 parameters for the constructor,
     * but doing so would cause all the tests to fail.
     *
     * @phan-file-suppress PhanParamTooMany
     */
    function testPostValidVisit() {
        $JSON = json_encode([
            "Meta" => [
                "CandID" => 123456,
                "Visit"  => "V3",
                "Battery" => "Test Battery"
            ]
        ], true);
        try {
            $API = $this->getMockBuilder(
                '\Loris\API\Candidates\Candidate\Visit')->disableOriginalConstructor()->setMethods(['createNew'])->getMock();
            $API->expects($this->once())->method('createNew');//->expects($this->once());
            $API->__construct(
                "PUT",
                "123456",
                "V3",
                $JSON
            );
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }
        $this->assertEquals($API->Headers, ["HTTP/1.1 201 Created"]);
    }
    function testPostInvalidVisit() {
        $this->expectOutputString(json_encode(["error" => "Visit from URL does not match metadata"]));
        $JSON = json_encode([
            "Meta" => [
                "CandID" => 123456,
                "Visit"  => "V4",
                "Battery" => "Test Battery"
            ]
        ], true);
        try {
            $API = new \Loris\API\Candidates\Candidate\Visit("PUT", "123456", "V3", $JSON);
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }
        $this->assertEquals($API->Headers, ["HTTP/1.1 400 Bad Request"]);
    }
}
?>
