<?php
require_once __DIR__ . '/../../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../../htdocs/api/v0.0.1a/projects/Project.php';

class Project_Test extends PHPUnit_Framework_TestCase
{
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }
    }

    /**
     * @expectedException Exception
     */
    function testValidMethods() {
        $API = new \Loris\API\Projects\Project("GET", "test", false, false, false);
        $this->assertEquals($API->AllowedMethods, ['GET']);
    }
}
?>
