<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1/projects/Project.php';
require_once __DIR__ . '/../BaseTestCase.php';

class Project_Test extends BaseTestCase
{
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }

        // Create the Mock classes, so that the factory doesn't die.
        $this->getMockBuilder('NDB_Config')->setMockClassName("MockNDB_Config")->getMock();
        $this->getMockBuilder('Database')->setMockClassName("MockDatabase")->getMock();

        $this->Factory = \NDB_Factory::singleton();
        $this->Factory->setTesting(true);

        // Make sure the references used by the test are the same ones
        // returned by the factory
        $this->Config   = $this->Factory->config();
        $this->Database = $this->Factory->database();

        $this->Config->expects($this->any())->method('getSetting')->will(
            $this->returnCallback(function ($arg) {
                if($arg === 'useProjects') {
                    return "true";
                }

                if($arg === 'Projects') {
                    return [
                        "project" => [
                            [
                                "id" => 1,
                                "title" => "TestProject"
                            ]
                        ]
                    ];
                }
                if($arg === 'DoubleDataEntryInstruments') {
                    return ["testInst2" ];
                }
                return null;
            }));

        $this->Database->method("pselect")->will(
            $this->returnCallback(function ($query, $params) {
                // If trying to get all candidates
                if($query === "SELECT CandID FROM candidate WHERE ProjectID=:projID"
                    && $params === array('projID' => 1)) {
                        return [["CandID" => "123456"], ["CandID" => "111111"]];
                    }
                // Called Utility::getAllInstruments()
                if($query === "SELECT Test_name,Full_name FROM test_names ORDER BY Full_name") {
                        return [
                            [
                                "Test_name" => "testInst",
                                "Full_name"  => "Test Instrument"
                            ],
                            [
                                "Test_name" => "testInst2",
                                "Full_name" => "Another Test Instrument"]
                            ];
                }

                if(strpos($query, "SELECT DISTINCT Visit_label FROM") === 0) {
                    return [
                        [
                            "Visit_label" => "V001"
                        ],
                        [
                            "Visit_label" => "AnotherVisit"
                        ],
                    ];
                }
            }
        ));
        $this->Database->method("pselectOne")->will(
            $this->returnCallback(function ($query, $params) {
                if(strpos($query, "SELECT sg.Subgroup_name") === 0) {
                    return "Test Instruments";
                };
                return null;
            }
        ));

        //$this->getMockBuilder('NDB_Config')->setMockClassName("MockNDB_Config")->getMock();
        //$this->getMockBuilder('Database')->setMockClassName("MockDatabase")->getMock();

    }

    function testValidMethods() {
        $API = new \Loris\API\Projects\Project("GET", "TestProject", false, false, false);
        $this->assertEquals($API->AllowedMethods, ['GET']);
    }

    function testProjectCandidates() {
        $API = new \Loris\API\Projects\Project("GET", "TestProject", true, false, false);
        $this->assertEquals($API->JSON,
            ['Meta' => [
                "Project" => "TestProject"
            ],
            "Candidates" => ["123456", "111111"]
        ]
        );
    }

    function testProjectInstruments() {
        $API = new \Loris\API\Projects\Project("GET", "TestProject", false, true, false, true);
        $this->assertEquals($API->JSON,
            ['Meta' => [
                "Project" => "TestProject"
            ],
            //"Instruments" => ["testInst", "testInst2"],
            "Instruments" => [
                "testInst" => [
                    "FullName" => "Test Instrument",
                    "Subgroup" => "Test Instruments",
                    "DoubleDataEntryEnabled" => false
                ],
                "testInst2" => [
                    "FullName" => "Another Test Instrument",
                    "Subgroup" => "Test Instruments",
                    "DoubleDataEntryEnabled" => true
                ]
            ]
        ]
        );
    }

    function testProjectVisits() {
        $API = new \Loris\API\Projects\Project("GET", "TestProject", false, false, true);
        $this->assertEquals($API->JSON,
            [
                'Meta' => [
                    "Project" => "TestProject"
                ],
                "Visits" => ["V001", "AnotherVisit"]
            ]
        );
    }

    function testProject() {
        $API = new \Loris\API\Projects\Project("GET", "TestProject", true, true, true);
        $this->assertEquals($API->JSON,
            [
                'Meta' => [
                    "Project" => "TestProject"
                ],
                "Candidates" => ["123456", "111111"],
                "Instruments" => ["testInst", "testInst2"],
                "Visits" => ["V001", "AnotherVisit"],
            ]
        );
    }
}
?>
