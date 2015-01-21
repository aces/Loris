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
}
?>
