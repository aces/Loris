<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../htdocs/api/v0.0.1a/Projects.php';
require_once __DIR__ . '/BaseTestCase.php';

class Projects_Test extends BaseTestCase
{
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }

        $this->Config =& $this->getMockBuilder('NDB_Config')->setMockClassName("MockNDB_Config")->getMock();

        $this->Factory = \NDB_Factory::singleton();
        $this->Factory->setTesting(true);

        $this->Config = $this->Factory->config();



        $this->getMockBuilder('NDB_Config')->setMockClassName("MockNDB_Config")->getMock();
        $this->getMockBuilder('Database')->setMockClassName("MockDatabase")->getMock();
    }

    /**
     * Tests that the AllowedMethods for are correct
     */
    function testValidMethods() {
        $this->Config->method('getSetting')->will(
            $this->returnValueMap(
                ["useProjects", false]
            )
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
            $this->returnValueMap(
                ["useProjects", false]
            )
        );

        $API = new \Loris\API\Projects("GET");
        $this->assertEquals(
            $API->JSON,
            ['Projects' => ["loris"]]
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

                if($arg === 'Projects') {
                    return [
                        "project" => [
                            [
                                "id" => 1,
                                "title" => "Sample Project"
                            ],
                            [
                                    "id" => 2,
                                    "title" => "Another Sample Project"
                            ]
                        ]
                    ];
                }
                return null;
            }));

        $API = new \Loris\API\Projects("GET");
        $this->assertEquals(
            $API->JSON,
            ['Projects' => ["Sample Project","Another Sample Project"]]
        );
    }

    function tearDown()
    {
        $this->Factory->reset();
    }
}
?>
