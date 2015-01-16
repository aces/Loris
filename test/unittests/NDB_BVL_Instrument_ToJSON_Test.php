<?php
namespace Loris\Tests;
set_include_path(get_include_path().":" .  __DIR__  . "/../../php/libraries:");

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/NDB_BVL_Instrument.class.inc';
require_once 'Smarty_hook.class.inc';
require_once 'NDB_Config.class.inc';

class NDB_BVL_Instrument_Test extends \PHPUnit_Framework_TestCase
{
    /**
     * Set up sets a fake $_SESSION object that we can use for
     * assertions
     */
    function setUp() {
        global $_SESSION;
        if(!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }
        $this->Session = $this->getMock('stdClass', array('getProperty', 'setProperty', 'getUsername', 'isLoggedIn'));
        $this->MockSinglePointLogin = $this->getMock('SinglePointLogin');
        $this->Session->method("getProperty")->willReturn($this->MockSinglePointLogin);
        $this->QuickForm = $this->getMock("HTML_Quickform");

        $_SESSION = array(
            'State' => $this->Session
        );

        $this->Client = new \NDB_Client;
        $this->Client->makeCommandLine();
        $this->Client->initialize(__DIR__ . "/../../project/config.xml");
        $this->i = $this->getMockBuilder("\NDB_BVL_Instrument")->setMethods(array("getFullName"))->getMock();

        $this->i->method('getFullName')->willReturn("Test Instrument");
        $this->i->form = $this->QuickForm;
        $this->i->testName = "Test";
    }

    /**
     * Helper function to use for creating stubs that stub out everything except
     * the method being tested
     */
    function _getAllMethodsExcept($methods) {
        $AllMethods = get_class_methods('NDB_BVL_Instrument');

        return array_diff($AllMethods, $methods);
    }

    function testMetaData() {
        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $ExpectedMeta = [
            'InstrumentVersion' => "1l",
            'InstrumentFormatVersion' => "v0.0.1a-dev",
            "ShortName" => "Test",
            "LongName" => "Test Instrument",
            "IncludeMetaDataFields" => "true",
        ];
        $this->assertEquals($ExpectedMeta, $outArray['Meta']);
    }

    function testSelectElement() {
    }

    function testTextElement() {
    }

    function testDateElement() {
    }

    function testNumericElement() {
    }

    function testScoreElement() {
    }
}
?>
