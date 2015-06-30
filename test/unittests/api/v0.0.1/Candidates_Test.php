<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../htdocs/api/v0.0.1a/Candidates.php';

class Candidates_Test extends PHPUnit_Framework_TestCase
{
    /**
     */
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }

        $this->getMockBuilder('NDB_Config')->setMockClassName("MockNDB_Config")->getMock();
        $this->getMockBuilder('Database')->setMockClassName("MockDatabase")->getMock();
        $this->getMockBuilder('Candidate')->setMockClassName("MockCandidate")->getMock();

        $this->Factory = NDB_Factory::singleton();
        $this->Factory->setTesting(true);

        $this->Config = $this->Factory->config();
        $this->Database = $this->Factory->database();

        $this->Database->method("pselect")->will($this->returnCallback(
            function ($query, $params) {
                if($query == "SELECT CandID FROM candidate WHERE Active='Y'") {
                    return [["CandID" => "123456"], ["CandID" => "222222"]];
                }
                return array();
            }
        ));
    }

    function testValidMethods() {
        $API = new \Loris\API\Candidates("GET");

        $this->assertEquals($API->AllowedMethods, ['GET', 'POST']);
    }

    function testGetCandidates() {
        $API = new \Loris\API\Candidates("GET");

        $this->assertEquals($API->JSON, ["Candidates" => ["123456", "222222"]]);
    }

    function testPostCandidateValid() {
        try {
            $API = $this->getMockBuilder(
                '\Loris\API\Candidates')->disableOriginalConstructor()->setMethods(['createNew'])->getMock();
            $API->expects($this->once())->method('createNew');//->expects($this->once());
            $API->__construct("POST",
                ['candidate' => json_encode([
                    'Candidate' => [
                        'Project' => "loris",
                        'PSCID'   => 'HelloPSC',
                        'EDC'     => '2015-05-19',
                        'DoB'     => '2015-05-26',
                        'Gender'  => 'Male'
                    ]
                ])]);
            //$API->expects($this->once())->method('createNew');
            //$Mocked->expects($this->once())->method('createNew');
            //$API = new $Mocked("POST",
             //   )
            //]
        //);
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }

        $this->assertEquals($API->Headers, ['HTTP/1.1 201 Created']);
        $this->assertEquals(isset($API->JSON['Meta']['CandID']), true);
        $CandID = $API->JSON['Meta']['CandID'];
        $this->assertEquals(is_numeric($CandID), true);
        $this->assertTrue($CandID >= 100000);
        $this->assertTrue($CandID <= 999999);

    }

    function testPostCandidateInvalidGender() {
        try {
            $API = new \Loris\API\Candidates("POST",
                ['candidate' => json_encode([
                'Candidate' => [
                    'Project' => "loris",
                    'PSCID'   => 'HelloPSC',
                    'EDC'     => '2015-05-19',
                    'Gender'  => 'None'
                ]])
            ]
        );
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }

        $this->assertEquals($API->Headers, ['HTTP/1.1 400 Bad Request']);
    }

    function testPostCandidateInvalidJSON() {
        try {
            $API = new \Loris\API\Candidates("POST",
                ['candidate' => "{ oops: synax error }"]);
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
        }

        $this->assertEquals($API->Headers, ['HTTP/1.1 400 Bad Request']);
    }
}
?>
