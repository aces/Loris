<?php
namespace Loris\Tests;
set_include_path(get_include_path().":" .  __DIR__  . "/../../php/libraries:");
use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/NDB_BVL_Instrument.class.inc';
require_once 'Smarty_hook.class.inc';
require_once 'NDB_Config.class.inc';

class NDB_BVL_Instrument_ToJSON_Test extends TestCase
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
        date_default_timezone_set("UTC");
        $this->Session = $this->getMockBuilder(\stdClass::class)->setMethods(array('getProperty', 'setProperty', 'getUsername', 'isLoggedIn'))->getMock();
        $this->MockSinglePointLogin = $this->getMockBuilder('SinglePointLogin')->getMock();
        $this->Session->method("getProperty")->willReturn($this->MockSinglePointLogin);

        $_SESSION = array(
            'State' => $this->Session
        );

        $factory = \NDB_Factory::singleton();
        $factory->setTesting(true);

        $mockdb = $this->getMockBuilder("\Database")->getMock();
        $mockconfig = $this->getMockBuilder("\NDB_Config")->getMock();

        \NDB_Factory::$db = $mockdb;
        \NDB_Factory::$testdb = $mockdb;
        \NDB_Factory::$config = $mockconfig;

        $this->QuickForm = new \LorisForm(); //$this->getMock("HTML_Quickform");
        $this->Client = new \NDB_Client;
        $this->Client->makeCommandLine();
        $this->Client->initialize(__DIR__ . "/../../project/config.xml");

        $this->i = $this->getMockForAbstractClass(\NDB_BVL_Instrument::class)->setMethods(array("getFullName"))->getMock();
        $this->i->method('getFullName')->willReturn("Test Instrument");
        $this->i->method('getSubtestList')->willReturn(array());
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
        $value = array('value' => "Option");
        $not_answered = array('value' => 'Option', 'not_answered' => 'Not Answered');
        $this->i->addSelect("FieldName", "Field Description", $value);
        $this->i->addSelect("FieldName2", "Field Description 2", $not_answered);
        $this->i->form->addElement('select', "multiselect1", "Test Question", $value, array("multiple" => 'multiple'));
        $this->i->form->addElement('select', "multiselect2", "Test Question", $not_answered, array('multiple' => "multiple"));
        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $selectElement = $outArray['Elements'][0];
        $selectElement2 = $outArray['Elements'][1];

        $multiselectElement = $outArray['Elements'][2];
        $multiselectElement2 = $outArray['Elements'][3];

        $this->assertEquals($selectElement,
            [
                'Type' => "select",
                "Name" => "FieldName",
                "Description" => "Field Description",
                "Options" => [
                    "Values" => [
                        "value" => "Option"
                    ],
                    "RequireResponse" => false
                ],
            ]
        );

        $this->assertEquals($selectElement2,
            [
                'Type' => "select",
                "Name" => "FieldName2",
                "Description" => "Field Description 2",
                "Options" => [
                    "Values" => [
                        "value" => "Option"
                    ],
                    "RequireResponse" => true
                ],
            ]
        );

        $this->assertEquals($multiselectElement,
            [
                'Type' => "select",
                "Name" => "multiselect1",
                "Description" => "Test Question",
                "Options" => [
                    "Values" => [
                        "value" => "Option"
                    ],
                    "RequireResponse" => false,
                    "AllowMultiple" => true,
                ],
            ]
        );

        $this->assertEquals($multiselectElement2,
            [
                'Type' => "select",
                "Name" => "multiselect2",
                "Description" => "Test Question",
                "Options" => [
                    "Values" => [
                        "value" => "Option"
                    ],
                    "RequireResponse" => true,
                    "AllowMultiple" => true,
                ],
            ]
        );
    }


    function testTextElement() {
        $this->i->addTextElement("FieldName", "Field Description for Text", array("value" => "Option"));
        $this->i->addTextAreaElement("FieldName2", "Field Description2 for Text", array("value" => "Option"));
        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $textElement = $outArray['Elements'][0];
        $textareaElement = $outArray['Elements'][1];

        $this->assertEquals($textElement,
            [
                'Type'        => "text",
                "Name"        => "FieldName",
                "Description" => "Field Description for Text",
                "Options"     => [
                    "Type"            => "small",
                    "RequireResponse" => true
                ]
            ]
        );

        $this->assertEquals($textareaElement,
            [
                'Type'        => "text",
                "Name"        => "FieldName2",
                "Description" => "Field Description2 for Text",
                "Options"     => [
                    "Type"            => "large",
                    "RequireResponse" => true
                ]
            ]
        );
    }

    function testDateElement() {
        $this->i->addBasicDate(
            "FieldName",
            "Field Description",
            [
                'format'  => 'YMd',
                "minYear" => "1990",
                "maxYear" => "2000",
                "addEmptyOption" => false,
            ]
        );
        $this->i->addBasicDate(
            "FieldName2",
            "Field Description",
            [
                'format'  => 'YMd',
                "minYear" => "1990",
                "maxYear" => "2000",
                "addEmptyOption" => true,
            ]
        );

        $this->i->addDateElement(
            "FieldName3",
            "Field Description",
            [
                'format'  => 'YMd',
                "minYear" => "1990",
                "maxYear" => "2000",
                "addEmptyOption" => false,
            ]
        );
        $this->i->addDateElement(
            "FieldName4",
            "Field Description",
            [
                'format'  => 'YMd',
                "minYear" => "1990",
                "maxYear" => "2000",
                "addEmptyOption" => true,
            ]
        );
        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $dateElement = $outArray['Elements'][0];
        $dateElement2 = $outArray['Elements'][1];
        $dateElement3 = $outArray['Elements'][2];
        $dateElement4 = $outArray['Elements'][3];

        // They were added with addBasicDate, so response is
        // not required.
        $expectedResult = [
                'Type'        => "date",
                "Name"        => "FieldName",
                "Description" => "Field Description",
                "Options"     => [
                    "MinDate" => "1990-01-01",
                    "MaxDate" => "2000-12-31",
                    "RequireResponse" => false
                ]
            ];

        $this->assertEquals($dateElement, $expectedResult);

        $expectedResult['Name'] = 'FieldName2';
        $this->assertEquals($dateElement2, $expectedResult);

        unset($expectedResult['Options']['RequireResponse']);

        // The addDateElement wrappers add _date to the field name, the
        // addBasicDate wrappers do not.
        $expectedResult['Name'] = 'FieldName3_date';
        $this->assertEquals($dateElement3, $expectedResult);

        $expectedResult['Name'] = 'FieldName4_date';
        $this->assertEquals($dateElement4, $expectedResult);
    }

    function testNumericElement() {
        $this->i->addNumericElement("TestElement", "Test Description");
        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $numericElement = $outArray['Elements'][0];

        $this->assertEquals($numericElement,
            [
                "Type" => "numeric",
                "Name" => "TestElement",
                "Description" => "Test Description",
                "Options" => [
                    "NumberType" => "decimal"
                ]
            ]
        );

    }

    function testScoreElement() {
        $this->i->addScoreColumn(
            "FieldName",
            "Field Description",
            "45"
        );
        $this->i->addScoreColumn(
            "FieldName2",
            null
        );
        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $scoreElement = $outArray['Elements'][0];
        $scoreElement2 = $outArray['Elements'][1];

        $this->assertEquals($scoreElement,
            [
                'Type'        => "score",
                "Name"        => "FieldName",
                "Description" => "Field Description",
            ]
        );
        $this->assertEquals($scoreElement2,
            [
                'Type'        => "score",
                "Name"        => "FieldName2",
            ]
        );

    }

    function testHeaderElement() {
        // Since QuickForm arbitrarily decides to split things into "sections"
        // when there's a header, the header test adds 2 headers to ensure that
        // the JSON serialization was done according to spec, and not according
        // to QuickForm's whims.
        // The first "section" has no elements, and the second one, to make sure
        // that the serialization won't die on a 0 element "section"
        $this->i->form->addElement("header", null, "I am your test header");
        $this->i->form->addElement("header", null, "I am another test header");
        $this->i->addScoreColumn(
            "FieldName2",
            "Field Description",
            "45"
        );
        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $headerElement = $outArray['Elements'][0];
        $headerElement2= $outArray['Elements'][1];

        $this->assertEquals($headerElement,
            [
                'Type'        => "header",
                "Description" => "I am your test header",
                "Options"     => [
                    "Level" => 1
                ]
            ]
        );
        $this->assertEquals($headerElement2,
            [
                'Type'        => "header",
                "Description" => "I am another test header",
                "Options"     => [
                    "Level" => 1
                ]
            ]
        );

        $this->assertEquals(count($outArray['Elements']), 3);
    }

    function testLabelElement() {
        $this->i->addLabel("I am a label");
        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $labelElement = $outArray['Elements'][0];

        $this->assertEquals($labelElement,
            [
                'Type'        => "label",
                "Description" => "I am a label"
            ]
        );
        $this->assertEquals(count($outArray['Elements']), 1);
    }

    function testPageGroup() {
        $this->i = $this->getMockForAbstractClass(\NDB_BVL_Instrument::class)->setMethods(array("getFullName", "getSubtestList", '_setupForm'))->getMock();
        $this->i->method('getFullName')->willReturn("Test Instrument");
        $this->i->method('getSubtestList')->willReturn(
            array(
                array('Name' => 'Page 1', 'Description' => 'The first page'),
                array('Name' => 'Page 2', 'Description' => 'The second page'),
            )
        );

        $this->i->form = $this->QuickForm;
        $this->i->testName = "Test";


        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $page1 = $outArray['Elements'][0];
        $page2 = $outArray['Elements'][1];
        $this->assertEquals($page1,
            [
                'Type' => 'ElementGroup',
                'GroupType' => 'Page',
                'Elements' => [],
                'Description' => 'The first page'
            ]
        );
        $this->assertEquals($page2,
            [
                'Type' => 'ElementGroup',
                'GroupType' => 'Page',
                'Elements' => [],
                'Description' => 'The second page'
            ]
        );
    }
}
?>
