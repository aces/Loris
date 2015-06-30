<?php
namespace Loris\Tests\API;
require_once __DIR__ . '/../../../../vendor/autoload.php';
require_once __DIR__ . '/../../../../htdocs/api/v0.0.1a/Candidates.php';
require_once __DIR__ . '/NDB_BVL_Instrument_test.php';

class BaseTestCase extends \PHPUnit_Framework_TestCase
{
    function setUp() {
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }

        $this->getMockBuilder('NDB_Config')->setMockClassName("MockNDB_Config")->getMock();
        $this->getMockBuilder('Database')->setMockClassName("MockDatabase")->getMock();

        $this->Factory = \NDB_Factory::singleton();
        $this->Factory->setTesting(true);

        $this->Config = $this->Factory->config();
        $this->Database = $this->Factory->database();

        $this->Database->method("pselect")->will($this->returnCallback(
            function ($query, $params) {
                if($query == "SELECT CandID FROM candidate WHERE Active='Y'") {
                    return [["CandID" => "123456"], ["CandID" => "222222"]];
                }
                if(strpos($query, 'SELECT ID, Visit_label FROM session') === 0) {
                    return [[ "ID" => 444, "Visit_label" => "VisitTwo"]];
                }
                if($query == "SELECT Test_name FROM flag f JOIN session s ON (s.ID=f.SessionID) WHERE s.CandID=:CID AND s.Active='Y' AND s.Visit_label=:VL" && $params == array('CID' => "123456", 'VL' => 'VisitTwo')) {
                    return [["Test_name" => "Test"], ["Test_name" => "TestTwo"]];
                }

                return array();
            }
        ));

        $this->Database->method("pselectRow")->will($this->returnCallback(
            function ($query, $params) {
                if(strpos($query, "SELECT c.CenterID, c.CandID, c.") == 0
                    && $params == ['Candidate' => "123456"]) {
                        return [
                            'CenterID' => 1,
                            "CandID" => 123456,
                            "PSCID" => "TestCandidate",
                            "DoB"   => "1900-02-20",
                            "EDC"   => null,
                            "Gender" => "Male",
                            "PSC" => "Test"
                        ];
                    }
                return array();
            }
        ));
        $this->Database->method("pselectOne")->will($this->returnCallback(
            function ($query, $params) {
                if(strpos($query, "SELECT CommentID FROM flag f") == 0
                    && $params == ['VL' => 'VisitTwo', 'TN' => 'Test', 'CID' => "123456"]) {
                        return 'AFakeCommentID';
                    }
                print "Oh noes";
                return array();
            }
        ));
    }

    function tearDown() {
        $this->Factory->reset();
    }
}
?>
