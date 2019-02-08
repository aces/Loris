<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../htdocs/api/v0.0.1/Projects.php';
require_once __DIR__ . '/BaseTestCase.php';

class Projects_Test extends BaseTestCase
{
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }

        $this->Config = $this->getMockBuilder('NDB_Config')->setMockClassName("MockNDB_Config")->getMock();

        $this->Factory = \NDB_Factory::singleton();
        $this->Factory->setTesting(true);

        $this->Config = $this->Factory->config();
        $this->Database = $this->Factory->database();


        $this->getMockBuilder('NDB_Config')->setMockClassName("MockNDB_Config")->getMock();
        $this->getMockBuilder('Database')->setMockClassName("MockDatabase")->getMock();

        $this->Database->method("pselect")->will($this->returnCallback(
            function ($query, $params) {
                if($query == "SELECT * FROM Project") {
                    return [
                        [
                            "ProjectID" => 1,
                            "Name" => "Sample Project"
                        ],
                        [
                            "ProjectID" => 2,
                            "Name" => "Another Sample Project"
                        ]
                    ];
                }

                return array();
            }
        ));

        /*
        $this->Config->method("getSetting")->will($this->returnCallback(
                function ($setting) {
                    // Stuff relevant to this test
                    if($setting === "useEDC") {
                        return "false";
                    }
                    if($setting === "useProjects") {
                        return "false";
                    }
                    if($setting === "PSCID") {
                        return [
                            ];
                    }
                    // Stuff that gets called around Loris that we don't want to
                    // throw an exception for
                    if($setting === "database") {
                        return false;
                    }
                    if($setting === "extLibs") {
                        return "";
                    }

                    throw new \ConfigurationException("Unmocked config setting $setting");
                }
        )); */

    }

    /**
     * Tests that the AllowedMethods for are correct
     */
    function testValidMethods() {
        $this->Config->method('getSetting')->will(
            $this->returnValueMap([
                ["useProjects", false],
                ["useEDC", false],
                ["PSCID", [
                            "generation" => "user",
                            "structure" => [
                                    'seq' => [
                                        [
                                            '#' => '',
                                            '@' => [
                                                'type' => 'siteAbbrev'
                                            ]
                                        ],
                                        [
                                            '#' => '',
                                            '@' => [
                                                'type' => 'numeric',
                                                'length' => '4',
                                            ]
                                        ]
                                    ]
                                ]
                    ]
                ]
            ])
        );

        $API = new \Loris\API\Projects("GET");
        $this->assertEquals($API->AllowedMethods, ['GET']);
    }

    /**
     * Tests that if the config  useProjects setting is
     * false, will return default "loris" project as per
     * API spec
     */
    function testGETProjectsWithoutProjects() {
        $this->Config->method('getSetting')->will(
            $this->returnValueMap([
                ["useProjects", false],
                ["useEDC", false],
                ["PSCID", [
                            "generation" => "user",
                            "structure" => [
                                    'seq' => [
                                        [
                                            '#' => '',
                                            '@' => [
                                                'type' => 'siteAbbrev'
                                            ]
                                        ],
                                        [
                                            '#' => '',
                                            '@' => [
                                                'type' => 'numeric',
                                                'length' => '4',
                                            ]
                                        ]
                                    ]
                                ]
                    ]
                ]
            ])
        );

        $API = new \Loris\API\Projects("GET");
        $this->assertEquals(
            $API->JSON,
            ['Projects' => [
                "loris" => [
                    "useEDC" => false,
                    "PSCID" => [
                        "Type" => "prompt",
                        "Regex" => "/^SITE{1,1}[0-9]{4,4}$/i"
                    ]
                ]
                ]
            ]
        );
    }

    /**
     * Tests that if useProjects is true in the config,
     * will return a JSON object of the form specified in
     * the API documentation
     */
    function testGETProjectsWithProjects() {
        $this->Config->expects($this->any())->method('getSetting')->will(
            $this->returnCallback(function ($arg) {
                if($arg === 'useProjects') {
                    return "true";
                }
                if($arg === 'useEDC') {
                    return "false";
                }

                if($arg === "PSCID") {
                return [
                            "generation" => "sequential",
                            "structure" => [
                                    'seq' => [
                                        [
                                            '#' => '',
                                            '@' => [
                                                'type' => 'siteAbbrev'
                                            ]
                                        ],
                                        [
                                            '#' => '',
                                            '@' => [
                                                'type' => 'numeric',
                                                'length' => '4',
                                            ]
                                        ]
                                    ]
                                ]
                    ];
                }
                return null;
            }));

        $API = new \Loris\API\Projects("GET");
        $this->assertEquals(
            $API->JSON,
            ['Projects' => [
                "Sample Project" => [
                    "useEDC" => false,
                    "PSCID" => [
                        "Type" => "auto",
                        "Regex" => "/^SITE{1,1}[0-9]{4,4}$/i"
                    ]
                ],
                "Another Sample Project" => [
                    "useEDC" => false,
                    "PSCID" => [
                        "Type" => "auto",
                        "Regex" => "/^SITE{1,1}[0-9]{4,4}$/i"
                    ]
                ],
            ]
        ]
        );
    }

    function tearDown()
    {
        $this->Factory->reset();
    }
}
?>
