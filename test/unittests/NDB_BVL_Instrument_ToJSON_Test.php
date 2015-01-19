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
        $this->QuickForm = new \HTML_Quickform(); //$this->getMock("HTML_Quickform");

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
        $value = array('value' => "Option");
        $not_answered = array('value' => 'Option', 'not_answered' => 'Not Answered');
        $this->i->addSelect("FieldName", "Field Description", $value);
        $this->i->addSelect("FieldName", "Field Description", $not_answered);
        $this->i->form->addElement('select', "multiselect1", "Test Question", $value, "multiple");
        $this->i->form->addElement('select', "multiselect2", "Test Question", $not_answered, "multiple");
        //$this->i->addSelect( "multiselect2", "Test Question2", $not_answered,"multiple size='5'" );
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
                /*
                 * These are not included in the output because
                 * they're the defaults
                "AllowMultiple" => false,
                 */
            ]
        );

        $this->assertEquals($selectElement2,
            [
                'Type' => "select",
                "Name" => "FieldName",
                "Description" => "Field Description",
                "Options" => [
                    "Values" => [
                        "value" => "Option"
                    ],
                    "RequireResponse" => true
                /*
                 * These are not included in the output because
                 * they're the defaults
                "AllowMultiple" => false,
                 */
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
        $this->i->addTextElement("FieldName", "Field Description", array("value" => "Option"));
        $this->i->addTextAreaElement("FieldName2", "Field Description2", array("value" => "Option"));
        $json = $this->i->toJSON();
        $outArray = json_decode($json, true);
        $textElement = $outArray['Elements'][0];
        $textareaElement = $outArray['Elements'][1];

        $this->assertEquals($textElement,
            [
                'Type'        => "text",
                "Name"        => "FieldName",
                "Description" => "Field Description",
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
                "Description" => "Field Description2",
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
        $this->markTestIncomplete("Numeric Test is not yet implemented");
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
                /*"Options"     => [
                ]*/
            ]
        );
        $this->assertEquals($scoreElement2,
            [
                'Type'        => "score",
                "Name"        => "FieldName2",
                /*"Options"     => [
                ]*/
            ]
        );

    }

    function testHeaderElement() {
        $this->markTestIncomplete("Header test is not yet implemented");
    }

    function testLabelElement() {
        $this->markTestIncomplete("Label test is not yet implemented");
    }
}
?>
