<?php
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../htdocs/api/v0.0.1/Candidates.php';

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
                if (strpos($query, "SELECT CandID, ProjectID") === 0) {
                    return [
                        [
                            "CandID" => "123456",
                            "ProjectID" => null,
                            "PSCID" => "TestCandidate2",
                            "Site" => "DCC",
                            "EDC" => null,
                            "DoB" => "1833-10-24",
                            "Gender" => "Male"
                        ],
                        [
                            "CandID" => "222222",
                            "ProjectID" => null,
                            "PSCID" => "TestCandidate",
                            "Site" => "DCC",
                            "EDC" => null,
                            "DoB" => "1933-10-24",
                            "Gender" => "Female"
                        ]
                    ];
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

        $this->assertEquals($API->JSON, ["Candidates" => [
            [
                "CandID" => "123456",
                "Project" => "loris",
                "PSCID" => "TestCandidate2",
                "Site" => "DCC",
                "EDC" => null,
                "DoB" => '1833-10-24',
                "Gender" => "Male",
            ],
            [
                "CandID" => "222222",
                "Project" => "loris",
                "PSCID" => "TestCandidate",
                "Site" => "DCC",
                "EDC" => null,
                "DoB" => '1933-10-24',
                "Gender" => "Female",
            ]
            ]
        ]);
    }
    function doPostCandidate () {
        try {
            $API = $this->getMockBuilder(
                '\Loris\API\Candidates')->disableOriginalConstructor()->setMethods(['createNew'])->getMock();
            $API->expects($this->once())->method('createNew');
            $API->__construct("POST",
                    ['Candidate' => [
                        'Project' => "loris",
                        'PSCID'   => 'HelloPSC',
                        'EDC'     => '2015-05-19',
                        'DoB'     => '2015-05-26',
                        'Gender'  => 'Male'
                    ]
                ]
                );
            return $API;
        } catch(\Loris\API\SafeExitException $e) {
            $API = $e->Object;
            return $API;
        }
    }
    function testPostCandidateValid() {
        $user = \User::singleton("admin");
        $_SESSION = array(
            'State' => State::singleton()
        );
        State::singleton()->setUsername("admin");
        var_dump($_SESSION);
        var_dump(State::singleton());
        $tmp  = $user->userInfo["CenterIDs"];

        //Test with no centers
        $user->userInfo["CenterIDs"] = array();

        $API = $this->doPostCandidate();
        $this->assertEquals($API->Headers, ['HTTP/1.1 401 Unauthorized']);
        $this->assertEquals(isset($API->JSON['Meta']['CandID']), false);

        //Test with multiple centers
        $user->userInfo["CenterIDs"] = array(1, 2);

        $API = $this->doPostCandidate();
        $this->assertEquals($API->Headers, ['HTTP/1.1 501 Not Implemented']);
        $this->assertEquals(isset($API->JSON['Meta']['CandID']), false);

        //Test with one center
        $user->userInfo["CenterIDs"] = array(1);

        $API = $this->doPostCandidate();
        var_dump($API->JSON);
        var_dump(NDB_Factory::singleton()->config());
        \Candidate::createNew(1, '2015-05-26', '2015-05-26', 'Male', 'HelloPSC');
        $this->assertEquals($API->Headers, ['HTTP/1.1 201 Created']);
        $this->assertEquals(isset($API->JSON['Meta']['CandID']), true);
        $CandID = $API->JSON['Meta']['CandID'];
        $this->assertEquals(is_numeric($CandID), true);
        $this->assertTrue($CandID >= 100000);
        $this->assertTrue($CandID <= 999999);

        $user->userInfo["CenterIDs"] = $tmp;
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
