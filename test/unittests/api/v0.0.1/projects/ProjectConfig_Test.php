<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1a/projects/Configuration.php';
require_once __DIR__ . '/../BaseTestCase.php';

class ProjectConfig_Test extends BaseTestCase
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
                switch ($arg) {
                    case "useProjects":
                        return false;
                    case "useEDC":
                        return true;
                    case "PSCID":
                        return [
                            'generation' => "user",
                            'structure' => [
                                'seq' => [
                                    [
                                        '@' => [
                                            'type' => 'alpha'
                                        ]
                                    ],
                                    ['@' => [
                                        'type' => 'numeric'
                                    ]
                                ]
                            ]
                        ]
                    ];
                }
                return null;
            }));


    }

    function testProjectSettings() {
        $API = new \Loris\API\Projects\Configuration("GET", "TestProject");
        $this->assertEquals($API->JSON,
            ['Meta' => [
                "Project" => "TestProject",
                "DocType" => "Configuration"
            ],
            "Settings" => [
                "useProjects" => false,
                "useEDC"      => true,
                "PSCID"       => [
                    'generation' => 'user',
                    'regex' => "/^[a-z]{1,1}[0-9]{1,1}$/i"
                    ]
            ]
        ]
        );
    }
}
?>
