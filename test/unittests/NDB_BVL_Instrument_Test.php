<?php
/**
 * Unit test for NDB_BVL_Instrument class
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\Tests;
set_include_path(get_include_path().":" .  __DIR__  . "/../../php/libraries:");
use PHPUnit\Framework\TestCase;
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/NDB_BVL_Instrument.class.inc';
require_once 'Smarty_hook.class.inc';
require_once 'NDB_Config.class.inc';
require_once 'SessionID.php';
/**
 * Unit test for NDB_BVL_Instrument class
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_BVL_Instrument_Test extends TestCase
{
    private $_instrument;
    private $_factory;
    private $_mockConfig;
    private $_mockDB;

    private $_factoryForDB;
    private $_config;
    private $_DB;
    /**
     * Set up sets a fake $_SESSION object that we can use for
     * assertions
     *
     * @return void
     */
    function setUp()
    {
        global $_SESSION;
        if (!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }
        date_default_timezone_set("UTC");
        $this->session = $this->getMockBuilder(\stdClass::class)
            ->setMethods(
                ['getProperty', 'setProperty', 'getUsername', 'isLoggedIn']
            )
            ->getMock();
        $this->mockSinglePointLogin = $this->getMockBuilder('SinglePointLogin')
            ->getMock();
        $this->session->method("getProperty")
            ->willReturn($this->mockSinglePointLogin);

        $_SESSION = [
            'State' => $this->session
        ];

        $this->_factory = \NDB_Factory::singleton();
        $this->_factory->setTesting(true);

        $this->_mockDB     = $this->getMockBuilder("\Database")->getMock();
        $this->_mockConfig = $this->getMockBuilder("\NDB_Config")->getMock();

        \NDB_Factory::$db     = $this->_mockDB;
        \NDB_Factory::$testdb = $this->_mockDB;
        \NDB_Factory::$config = $this->_mockConfig;

        $this->quickForm = new \LorisForm();

        $this->_instrument = $this->getMockBuilder(\NDB_BVL_Instrument::class)
            ->disableOriginalConstructor()
            ->setMethods(["getFullName", "getSubtestList"])->getMock();
        $this->_instrument->method('getFullName')->willReturn("Test Instrument");
        $this->_instrument->method('getSubtestList')->willReturn([]);
        $this->_instrument->form     = $this->quickForm;
        $this->_instrument->testName = "Test";
    }

    /**
     * Helper function to use for creating stubs that stub out everything except
     * the method being tested
     *
     * @param $methods The method being tested
     *
     * @return array
     */
    function _getAllMethodsExcept($methods)
    {
        $AllMethods = get_class_methods('NDB_BVL_Instrument');

        return array_diff($AllMethods, $methods);
    }

    /**
     * Test that the toJSON method returns the correct metadata
     *
     * @covers NDB_BVL_Instrument::toJSON
     * @return void
     */
    function testMetaData()
    {
        $json         = $this->_instrument->toJSON();
        $outArray     = json_decode($json, true);
        $ExpectedMeta = [
            'InstrumentVersion'       => "1l",
            'InstrumentFormatVersion' => "v0.0.1a-dev",
            "ShortName"               => "Test",
            "LongName"                => "Test Instrument",
            "IncludeMetaDataFields"   => "true",
        ];
        $this->assertEquals($ExpectedMeta, $outArray['Meta']);
    }

    /**
     * Test that addSelect and addElement add the correct information
     * and that toJSON returns this data
     *
     * @covers NDB_BVL_Instrument::toJSON
     * @return void
     */
    function testSelectElement()
    {
        $value        = ['value' => "Option"];
        $not_answered = ['value' => 'Option', 'not_answered' => 'Not Answered'];
        $this->_instrument->addSelect("FieldName", "Field Description", $value);
        $this->_instrument->addSelect(
            "FieldName2",
            "Field Description 2",
            $not_answered
        );
        $this->_instrument->form->addElement(
            'select',
            "multiselect1",
            "Test Question",
            $value,
            ["multiple" => 'multiple']
        );
        $this->_instrument->form->addElement(
            'select',
            "multiselect2",
            "Test Question",
            $not_answered,
            ['multiple' => "multiple"]
        );
        $json           = $this->_instrument->toJSON();
        $outArray       = json_decode($json, true);
        $selectElement  = $outArray['Elements'][0];
        $selectElement2 = $outArray['Elements'][1];

        $multiselectElement  = $outArray['Elements'][2];
        $multiselectElement2 = $outArray['Elements'][3];

        $this->assertEquals(
            $selectElement,
            [
                'Type'        => "select",
                "Name"        => "FieldName",
                "Description" => "Field Description",
                "Options"     => [
                    "Values"          => [
                        "value" => "Option"
                    ],
                    "RequireResponse" => false
                ],
            ]
        );

        $this->assertEquals(
            $selectElement2,
            [
                'Type'        => "select",
                "Name"        => "FieldName2",
                "Description" => "Field Description 2",
                "Options"     => [
                    "Values"          => [
                        "value" => "Option"
                    ],
                    "RequireResponse" => true
                ],
            ]
        );

        $this->assertEquals(
            $multiselectElement,
            [
                'Type'        => "select",
                "Name"        => "multiselect1",
                "Description" => "Test Question",
                "Options"     => [
                    "Values"          => [
                        "value" => "Option"
                    ],
                    "RequireResponse" => false,
                    "AllowMultiple"   => true,
                ],
            ]
        );

        $this->assertEquals(
            $multiselectElement2,
            [
                'Type'        => "select",
                "Name"        => "multiselect2",
                "Description" => "Test Question",
                "Options"     => [
                    "Values"          => [
                        "value" => "Option"
                    ],
                    "RequireResponse" => true,
                    "AllowMultiple"   => true,
                ],
            ]
        );
    }


    /**
     * Test that addTextElement and addTextAreaElement adds the correct data to
     * the instrument
     *
     * @covers NDB_BVL_Instrument::addTextElement
     * @covers NDB_BVL_Instrument::addTextAreaElement
     * @covers NDB_BVL_Instrument::toJSON
     * @return void
     */
    function testTextElement()
    {
        $this->_instrument->addTextElement(
            "FieldName",
            "Field Description for Text",
            ["value" => "Option"]
        );
        $this->_instrument->addTextAreaElement(
            "FieldName2",
            "Field Description2 for Text",
            ["value" => "Option"]
        );
        $json            = $this->_instrument->toJSON();
        $outArray        = json_decode($json, true);
        $textElement     = $outArray['Elements'][0];
        $textareaElement = $outArray['Elements'][1];

        $this->assertEquals(
            $textElement,
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

        $this->assertEquals(
            $textareaElement,
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

        $textRules     = $this->_instrument->XINRules['FieldName'];
        $textAreaRules = $this->_instrument->XINRules['FieldName2'];
        $this->assertEquals(
            $textRules,
            [
                'message' => 'This field is required.',
                'group'   => 'FieldName_group',
                'rules'   => ['FieldName_status{@}=={@}', 'Option']
            ]
        );
        $this->assertEquals(
            $textAreaRules,
            [
                'message' => 'This field is required.',
                'group'   => 'FieldName2_group',
                'rules'   => ['FieldName2_status{@}=={@}', 'Option']
            ]
        );
    }

    /**
     * Test that addTextAreaElementRD adds a group element to the instrument
     *
     * @covers NDB_BVL_Instrument::addTextAreaElementRD
     * @return void
     */
    function testAddTextAreaElementRD()
    {
        $this->_instrument->addTextAreaElementRD(
            "FieldName1",
            "Field Description1",
            ["value" => "Option"]
        );
        $json     = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $this->assertEquals(
            $outArray['Elements'][0],
            ['Type' => "Group", 'Error' => "Unimplemented"]
        );
        $groupEl = $this->_instrument->form->form['FieldName1_group'];
        $this->assertEquals(
            $groupEl,
            [
                'type'      => 'group',
                'name'      => 'FieldName1_group',
                'elements'  => [
                    ['label' => null,
                        'name'  => 'FieldName1',
                        'type'  => 'textarea',
                        'html'  => $this->_instrument->form
                            ->renderElement($groupEl['elements'][0])
                    ],
                    ['label' => '',
                        'name'    => 'FieldName1_status',
                        'class'   => 'form-control input-sm',
                        'type'    => 'select',
                        'options' => ['' => '',
                            '88_refused'     => '88 Refused',
                            '99_do_not_know' => '99 Do not know',
                            'not_answered'   => 'Not Answered'
                        ],
                        'html'    => $this->_instrument->form
                            ->renderElement($groupEl['elements'][1])
                    ],
                ],
                'label'     => 'Field Description1',
                'delimiter' => ' ',
                'options'   => false,
                'html'      => $this->_instrument->form->groupHTML($groupEl)
            ]
        );
        $textRules = $this->_instrument->XINRules['FieldName1'];
        $this->assertEquals(
            $textRules,
            [
                'message' => 'You must specify or select from the drop-down',
                'group'   => 'FieldName1_group',
                'rules'   => ['FieldName1_status{@}=={@}', 'Option']
            ]
        );
    }

    /**
     * Test that addHourMinElement returns a group element with the correct
     * data and sets an appropriate XINRule
     *
     * @covers NDB_BVL_Instrument::addHourMinElement
     * @return void
     */
    function testAddHourMinElement()
    {
        $this->_instrument->addHourMinElement(
            "hourMinField",
            "hourMinLabel",
            ["value" => "Option"],
            "Rule_message"
        );
        $json     = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $this->assertEquals(
            $outArray['Elements'][0],
            ['Type' => "Group", 'Error' => "Unimplemented"]
        );
        $groupEl = $this->_instrument->form->form['hourMinField_group'];
        $this->assertEquals(
            $groupEl,
            [
                'type'      => 'group',
                'name'      => 'hourMinField_group',
                'elements'  => [
                    ['label' => null,
                        'name'  => 'hourMinField',
                        'type'  => 'time',
                        'html'  => $this->_instrument->form
                            ->renderElement($groupEl['elements'][0])
                    ],
                    ['label' => '',
                        'name'    => 'hourMinField_status',
                        'class'   => 'form-control input-sm',
                        'type'    => 'select',
                        'options' => [null => '',
                            'dnk'          => 'DNK',
                            'refusal'      => 'Refusal',
                            'not_answered' => 'Not Answered',
                        ],
                        'html'    => $this->_instrument->form
                            ->renderElement($groupEl['elements'][1])
                    ]
                ],
                'label'     => 'hourMinLabel',
                'delimiter' => ' ',
                'options'   => false,
                'html'      => $this->_instrument->form->groupHTML($groupEl)
            ]
        );
        $rules = $this->_instrument->XINRules['hourMinField'];
        $this->assertEquals(
            $rules,
            [
                'message' => 'Rule_message',
                'group'   => 'hourMinField_group',
                'rules'   => ['Option', 'hourMinField_status{@}=={@}']
            ]
        );
    }

    /**
     * Test that addBasicDate (from NDB_Page) and addDateElement
     * adds the correct date to the instrument object
     *
     * @covers NDB_Page::addBasicDate
     * @covers NDB_Page::addDateElement
     * @covers NDB_Page::toJSON
     * @return void
     */
    function testDateElement()
    {
        $this->_instrument->addBasicDate(
            "FieldName",
            "Field Description",
            [
                'format'         => 'YMd',
                "minYear"        => "1990",
                "maxYear"        => "2000",
                "addEmptyOption" => false,
            ]
        );
        $this->_instrument->addBasicDate(
            "FieldName2",
            "Field Description",
            [
                'format'         => 'YMd',
                "minYear"        => "1990",
                "maxYear"        => "2000",
                "addEmptyOption" => true,
            ]
        );

        $this->_instrument->addDateElement(
            "FieldName3",
            "Field Description",
            [
                'format'         => 'YMd',
                "minYear"        => "1990",
                "maxYear"        => "2000",
                "addEmptyOption" => false,
            ]
        );
        $this->_instrument->addDateElement(
            "FieldName4",
            "Field Description",
            [
                'format'         => 'YMd',
                "minYear"        => "1990",
                "maxYear"        => "2000",
                "addEmptyOption" => true,
            ]
        );
        $json         = $this->_instrument->toJSON();
        $outArray     = json_decode($json, true);
        $dateElement  = $outArray['Elements'][0];
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
                "MinDate"         => "1990-01-01",
                "MaxDate"         => "2000-12-31",
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

    /**
     * Test that addMonthYear creates a date element with the correct data
     * and that it adds the element name to the monthYearFields array.
     *
     * @covers NDB_BVL_Instrument::addMonthYear
     * @return void
     */
    function testMonthYearElement()
    {
        $this->_instrument->addMonthYear("Field1", "Label 1", ['value' => 'Option']);
        $this->assertEquals(
            $this->_instrument->form->form["Field1"],
            [
                'label'   => 'Label 1',
                'name'    => 'Field1',
                'type'    => 'date',
                'options' => ['value' => 'Option',
                    'format' => 'YM'
                ]
            ]
        );
        $this->assertEquals($this->_instrument->monthYearFields[0], "Field1");
    }

    /**
     * Test that addCustomDateElement creates a group element with
     * the correct data and sets a XINRule
     *
     * @covers NDB_BVL_Instrument::addCustomDateElement
     * @return void
     */
    function testAddCustomDateElement()
    {
        $this->_instrument->addCustomDateElement(
            "CustomName",
            "Date Label",
            ["value" => "Option"]
        );
        $json     = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $this->assertEquals(
            $outArray['Elements'][0],
            ['Type' => "Group", 'Error' => "Unimplemented"]
        );
        $groupEl = $this->_instrument->form->form['CustomName_date_group'];
        $this->assertEquals(
            $groupEl,
            [
                'type'      => 'group',
                'name'      => 'CustomName_date_group',
                'elements'  => [
                    [
                        'label'   => null,
                        'name'    => 'CustomName_date',
                        'class'   => 'form-control input-sm',
                        'type'    => 'date',
                        'html'    => $this->_instrument->form
                            ->renderElement($groupEl['elements'][0]),
                        'options' => ['value' => 'Option']
                    ],
                    [
                        'label'   => null,
                        'name'    => 'CustomName_date_status',
                        'class'   => 'form-control input-sm',
                        'type'    => 'select',
                        'options' => [
                            null             => '',
                            '88_refused'     => "88 Refused",
                            '99_do_not_know' => "99 Do not know",
                            'not_answered'   => "Not Answered"
                        ],
                        'html'    => $this->_instrument->form
                            ->renderElement($groupEl['elements'][1])
                    ]
                ],
                'label'     => 'Date Label',
                'delimiter' => "</td>\n<td>",
                'options'   => false,
                'html'      => $this->_instrument->form->groupHTML($groupEl)
            ]
        );
        $rule1 = $this->_instrument->XINRules['CustomName_date'];
        $this->assertEquals(
            $rule1,
            [
                'message' => "You must specify or select from the drop-down",
                'group'   => 'CustomName_date_group',
                'rules'   => ['CustomName_date_status{@}=={@}']
            ]
        );
        $rule2 = $this->_instrument->XINRules['CustomName_date_status'];
        $this->assertEquals(
            $rule2,
            [
                'message' => "You must specify or select from the drop-down",
                'group'   => 'CustomName_date_group',
                'rules'   => ['CustomName_date{@}=={@}']
            ]
        );
    }
    /**
     * Test that addNumericElement adds the correct data to the instrument
     *
     * @covers NDB_BVL_Instrument::addNumericElement
     * @covers NDB_BVL_Instrument::toJSON
     * @return void
     */
    function testNumericElement()
    {
        $this->_instrument->addNumericElement("TestElement", "Test Description");
        $json           = $this->_instrument->toJSON();
        $outArray       = json_decode($json, true);
        $numericElement = $outArray['Elements'][0];

        $this->assertEquals(
            $numericElement,
            [
                "Type"        => "numeric",
                "Name"        => "TestElement",
                "Description" => "Test Description",
                "Options"     => [
                    "NumberType" => "decimal"
                ]
            ]
        );
    }

    /**
     * Test that addNumericElementRD correctly creates a group element
     * and sets a XINRule with the proper data
     *
     * @covers NDB_BVL_Instrument::addNumericElementRD
     * @return void
     */
    function testNumericElementRD()
    {
        $this->_instrument->addNumericElementRD("TestElement", "Test Description");
        $json           = $this->_instrument->toJSON();
        $outArray       = json_decode($json, true);
        $numericElement = $outArray['Elements'][0];
        $this->assertEquals(
            $numericElement,
            ['Type' => "Group", 'Error' => "Unimplemented"]
        );
        $groupEl = $this->_instrument->form->form['TestElement_group'];
        $this->assertEquals(
            $groupEl,
            [
                'type'      => 'group',
                'name'      => 'TestElement_group',
                'elements'  => [
                    [
                        'type'       => 'text',
                        'name'       => 'TestElement',
                        'label'      => 'Test Description',
                        'class'      => 'form-control input-sm',
                        'numeric'    => true,
                        'numericMsg' => 'Numbers only, please',
                        'html'       => $this->_instrument->form
                            ->renderElement($groupEl['elements'][0])
                    ],
                    [
                        'type'    => 'select',
                        'name'    => 'TestElement_status',
                        'label'   => null,
                        'class'   => 'form-control input-sm not-answered',
                        'options' => [
                            ''               => '',
                            '88_refused'     => '88 Refused',
                            '99_do_not_know' => '99 Do not know',
                            'not_answered'   => 'Not Answered'
                        ],
                        'html'    => $this->_instrument->form
                            ->renderElement($groupEl['elements'][1])
                    ]
                ],
                'label'     => 'Test Description',
                'delimiter' => ' ',
                'options'   => false,
                'numeric'   => [0],
                'html'      => $this->_instrument->form->groupHTML($groupEl)
            ]
        );
        $rule = $this->_instrument->XINRules['TestElement'];
        $this->assertEquals(
            $rule,
            [
                'message' => 'This field is required',
                'group'   => 'TestElement_group',
                'rules'   => ['TestElement_status{@}=={@}']
            ]
        );
    }

    /**
     * Test that addScoreColumn (from NDB_Page) adds the data to the
     * instrument object
     *
     * @covers NDB_Page::addScoreColumn
     * @covers NDB_BVL_Instrument::toJSON
     * @return void
     */
    function testScoreElement()
    {
        $this->_instrument->addScoreColumn(
            "FieldName",
            "Field Description",
            "45"
        );
        $this->_instrument->addScoreColumn(
            "FieldName2",
            null
        );
        $json          = $this->_instrument->toJSON();
        $outArray      = json_decode($json, true);
        $scoreElement  = $outArray['Elements'][0];
        $scoreElement2 = $outArray['Elements'][1];

        $this->assertEquals(
            $scoreElement,
            [
                'Type'        => "score",
                "Name"        => "FieldName",
                "Description" => "Field Description",
            ]
        );
        $this->assertEquals(
            $scoreElement2,
            [
                'Type' => "score",
                "Name" => "FieldName2",
            ]
        );

    }

    /**
     * Test that when a header element is added, the toJSON method returns the
     * element in the correct format
     *
     * @covers NDB_BVL_Instrument::toJSON
     * @return void
     */
    function testHeaderElement()
    {
        // Since QuickForm arbitrarily decides to split things into "sections"
        // when there's a header, the header test adds 2 headers to ensure that
        // the JSON serialization was done according to spec, and not according
        // to QuickForm's whims.
        // The first "section" has no elements, and the second one, to make sure
        // that the serialization won't die on a 0 element "section"
        $this->_instrument->form->addElement(
            "header",
            null,
            "I am your test header"
        );
        $this->_instrument->form->addElement(
            "header",
            null,
            "I am another test header"
        );
        $this->_instrument->addScoreColumn(
            "FieldName2",
            "Field Description",
            "45"
        );
        $json           = $this->_instrument->toJSON();
        $outArray       = json_decode($json, true);
        $headerElement  = $outArray['Elements'][0];
        $headerElement2 = $outArray['Elements'][1];

        $this->assertEquals(
            $headerElement,
            [
                'Type'        => "header",
                "Description" => "I am your test header",
                "Options"     => [
                    "Level" => 1
                ]
            ]
        );
        $this->assertEquals(
            $headerElement2,
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

    /**
     * Test that addLabel (from NDB_Page) adds the label element
     * to the instrument object
     *
     * @covers NDB_Page::addLabel
     * @covers NDB_BVL_Instrument::toJSON
     * @return void
     */
    function testLabelElement()
    {
        $this->_instrument->addLabel("I am a label");
        $json         = $this->_instrument->toJSON();
        $outArray     = json_decode($json, true);
        $labelElement = $outArray['Elements'][0];

        $this->assertEquals(
            $labelElement,
            [
                'Type'        => "label",
                "Description" => "I am a label"
            ]
        );
        $this->assertEquals(count($outArray['Elements']), 1);
    }

    /**
     * Test that toJSON gets the subtest list and full name elements of
     * the instrument
     *
     * @covers NDB_BVL_Instrument::toJSON
     * @return void
     */
    function testPageGroup()
    {
        $this->_instrument = $this->getMockBuilder(\NDB_BVL_Instrument::class)
            ->disableOriginalConstructor()
            ->setMethods(
                ["getFullName", "getSubtestList", '_setupForm']
            )->getMock();
        $this->_instrument->method('getFullName')->willReturn("Test Instrument");
        $this->_instrument->method('getSubtestList')->willReturn(
            [
                ['Name' => 'Page 1', 'Description' => 'The first page'],
                ['Name' => 'Page 2', 'Description' => 'The second page'],
            ]
        );

        $this->_instrument->form     = $this->quickForm;
        $this->_instrument->testName = "Test";

        $json     = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $page1    = $outArray['Elements'][0];
        $page2    = $outArray['Elements'][1];
        $this->assertEquals(
            $page1,
            [
                'Type'        => 'ElementGroup',
                'GroupType'   => 'Page',
                'Elements'    => [],
                'Description' => 'The first page'
            ]
        );
        $this->assertEquals(
            $page2,
            [
                'Type'        => 'ElementGroup',
                'GroupType'   => 'Page',
                'Elements'    => [],
                'Description' => 'The second page'
            ]
        );
    }

    /**
     * Test that setup correctly sets the commentID and page values of the
     * instrument and that getCommentID returns the commentID value.
     *
     * @covers NDB_BVL_Instrument::setup
     * @covers NDB_BVL_Instrument::getCommentID
     * @return void
     */
    function testSetup()
    {
        $this->_instrument->setup("commentID", "page");
        $this->assertEquals("commentID", $this->_instrument->getCommentID());
        $this->assertEquals("page", $this->_instrument->page);

    }

    /**
     * Test that calculateAgeMonths returns the correct number of months
     * for the given age array.
     *
     * @covers NDB_BVL_Instrument::calculateAgeMonths
     * @return void
     */
    function testCalculateAgeMonths()
    {
        $age    = ['year' => 3, 'mon' => 4, 'day' => 23];
        $months = $this->_instrument->calculateAgeMonths($age);
        $this->assertEquals(40.8, $months);
    }

    /**
     * Test that calculateAgeDays returns the correct number of days
     * for the given age array
     *
     * @covers NDB_BVL_Instrument::calculateAgeDays
     * @return void
     */
    function testCalculateAgeDays()
    {
        $age  = ['year' => 3, 'mon' => 4, 'day' => 23];
        $days = $this->_instrument->calculateAgeDays($age);
        $this->assertEquals(1238, $days);
    }

    /**
     * Test that addYesNoElement adds an element to the instrument with
     * yes/no options
     *
     * @covers NDB_BVL_Instrument::addYesNoElement
     * @return void
     */
    function testAddYesNoElement()
    {
        $this->_instrument->addYesNoElement("field1", "label1");
        $json     = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $this->assertEquals(
            $outArray['Elements'][0],
            ['Type' => 'select',
                'Name'        => 'field1',
                'Description' => 'label1',
                'Options'     => ['Values' => ['' => '',
                    'yes' => 'Yes',
                    'no'  => 'No'
                ],
                    'RequireResponse' => true
                ]
            ]
        );
    }

    /**
     * Test that addYesNoElement adds an element and registers a XIN rule
     * if specified.
     *
     * @covers NDB_BVL_Instrument::addYesNoElementWithRules
     * @return void
     */
    function testAddYesNoElementWithRules()
    {
        $this->_instrument->addYesNoElement(
            "field1",
            "label1",
            ["rule1"],
            "Rule message"
        );
        $json     = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $this->assertEquals(
            $outArray['Elements'][0],
            ['Type' => 'select',
                'Name'        => 'field1',
                'Description' => 'label1',
                'Options'     => ['Values' => ['' => '',
                    'yes' => 'Yes',
                    'no'  => 'No'
                ],
                    'RequireResponse' => true
                ]
            ]
        );
        $rules = $this->_instrument->XINRules["field1"];
        $this->assertEquals(
            $rules,
            ['message' => 'Rule message',
                'group'   => '',
                'rules'   => ['rule1']
            ]
        );
    }

    /**
     * Test that getCommentID returns the correct string
     *
     * @covers NDB_BVL_Instrument::getCommentID
     * @return void
     */
    function testGetCommentID()
    {
        $this->_instrument->commentID = 'commentID1';
        $this->assertEquals("commentID1", $this->_instrument->getCommentID());
    }

    /**
     * Test that getSessionID gets the correct data from the database
     *
     * @covers NDB_BVL_Instrument::getSessionID
     * @return void
     */
    function testGetSessionID()
    {
        $this->_instrument->commentID = 'commentID1';
        $this->_mockDB->expects($this->once())->method('pselectOne')
            ->with(
                "SELECT SessionID FROM flag WHERE CommentID = :CID",
                ['CID' => 'commentID1']
            )
            ->willReturn('123');
        $this->assertEquals(
            new \SessionID('123'),
            $this->_instrument->getSessionID()
        );
    }

    /**
     * Test that getSessionID will return null if nothing was found in the
     * database for the given commentID
     *
     * @covers NDB_BVL_Instrument::getSessionID
     * @return void
     */
    function testGetSessionIDReturnsNegative()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID3';
        $this->assertNull($this->_instrument->getSessionID());
    }

    /**
     * Test that getVisitLabel returns the correct visit label
     * for the given session ID
     *
     * @covers NDB_BVL_Instrument::getVisitLabel
     * @return void
     */
    function testGetVisitLabel()
    {
        $this->_instrument->commentID = 'commentID1';
        $this->_mockDB->expects($this->any(0))->method('pselectOne')
            ->with(
                "SELECT SessionID FROM flag WHERE CommentID = :CID",
                ['CID' => 'commentID1']
            )
            ->willReturn('123');
        $this->_mockDB->expects($this->any())->method('pselectRow')
            ->willReturn(
                ['SubprojectID' => 2, 'Visit_label' => 'V1', 'CandID' => '300123']
            );
        $this->assertEquals("V1", $this->_instrument->getVisitLabel());
    }

    /**
     * Test that getSubprojectID returns the correct value
     * for the given session ID
     *
     * @covers NDB_BVL_Instrument::getSubprojectID
     * @return void
     */
    function testGetSubprojectID()
    {
        $this->_instrument->commentID = 'commentID1';
        $this->_mockDB->expects($this->any(0))->method('pselectOne')
            ->with(
                "SELECT SessionID FROM flag WHERE CommentID = :CID",
                ['CID' => 'commentID1']
            )
            ->willReturn('123');
        $this->_mockDB->expects($this->any())->method('pselectRow')
            ->willReturn(['SubprojectID' => 2]);
        $this->assertEquals(2, $this->_instrument->getSubprojectID());
    }

    /**
     * Test that getDoB returns the correct date of birth from the database
     *
     * @covers NDB_BVL_Instrument::getDoB
     * @return void
     */
    function testGetDoB()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->assertEquals('1999-01-01', $this->_instrument->getDoB());
    }

    /**
     * Test that getDoD returns the correct date of death from the database
     *
     * @covers NDB_BVL_Instrument::getDoD
     * @return void
     */
    function testGetDoD()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->assertEquals('2016-01-01', $this->_instrument->getDoD());
    }

    /**
     * Test that getPSCID returns the correct data from the database
     *
     * @covers NDB_BVL_Instrument::getPSCID
     * @return void
     */
    function testGetPSCID()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->assertEquals('345', $this->_instrument->getPSCID());
    }

    /**
     * Test that loadInstanceData returns data from the correct database
     *
     * @covers NDB_BVL_Instrument::loadInstanceData
     * @return void
     */
    function testLoadInstanceData()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'flag';
        $defaults = \NDB_BVL_Instrument::loadInstanceData($this->_instrument);
        $defaults['Testdate'] = '2020-01-01 00:00:00';
        $this->assertEquals(
            $defaults,
            [
                'ID'             => '1000',
                'SessionID'      => '123',
                'Test_name'      => 'Test_name1',
                'CommentID'      => 'commentID1',
                'Data_entry'     => null,
                'Administration' => null,
                'Validity'       => null,
                'Exclusion'      => null,
                'Flag_status'    => null,
                'UserID'         => '456',
                'Testdate'       => '2020-01-01 00:00:00',
                'Data'           => null
            ]
        );
    }

    /**
     * Test that getFieldValue returns the correct data from the table
     *
     * @covers NDB_BVL_Instrument::getFieldValue
     * @return void
     */
    function testGetFieldValue()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->assertEquals(
            'Test Examiner1',
            $this->_instrument->getFieldValue('Examiner')
        );
    }

    /**
     * Test that getCandidateAge returns the age from DoB to the date the
     * instrument was taken if the DoD of the candidate is after the date taken
     *
     * @covers NDB_BVL_Instrument::getCandidateAge
     * @return void
     */
    function testGetCandidateAgeDoDAfterDateTaken()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->assertEquals(
            ['year' => 11, 'mon' => 4, 'day' => 4],
            $this->_instrument->getCandidateAge()
        );
    }

    /**
     * Test that getCandidateAge returns the age from DoB to the date taken
     * if the DoD of the candidate is empty
     *
     * @covers NDB_BVL_Instrument::getCandidateAge
     * @return void
     */
    function testGetCandidateAgeNoDoD()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_DB->run("UPDATE candidate SET DoD=null WHERE CandID=1");
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->assertEquals(
            ['year' => 11, 'mon' => 4, 'day' => 4],
            $this->_instrument->getCandidateAge()
        );
    }

    /**
     * Test that getCandidateAge returns the age from DoB to DoD if the
     * DoD of the candidate is before the date taken of the instrument
     *
     * @covers NDB_BVL_Instrument::getCandidateAge
     * @return void
     */
    function testGetCandidateAgeWithDoD()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_DB->run("UPDATE candidate SET DoD='2005-06-02' WHERE CandID=1");
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->assertEquals(
            ['year' => 6, 'mon' => 5, 'day' => 1],
            $this->_instrument->getCandidateAge()
        );
    }

    /**
     * Test that getCandidateAge returns the age from DoB to the given date
     *
     * @covers NDB_BVL_Instrument::getCandidateAge
     * @return void
     */
    function testGetCandidateAgeWithDateGiven()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->assertEquals(
            ['year' => 4, 'mon' => 8, 'day' => 3],
            $this->_instrument->getCandidateAge('2003-09-04')
        );
    }

    /**
     * Test that _setDefaultsArray changes the candidate age and sets
     * the instrument's dateTimeFields value
     *
     * @covers NDB_BVL_Instrument::_setDefaultsArray
     * @return void
     */
    function testSetDefaultsArray()
    {
        $defaults = ['Test' => 'Test1',
            'Window_Difference' => 1,
            'Candidate_Age'     => '2020-01-01'
        ];
        $result   = $this->_instrument->_setDefaultsArray($defaults);
        $defaults['Candidate_Age'] = '2020-01-01 (Age out of range)';
        $this->assertEquals($defaults, $result);
        $this->assertEquals(["Date_taken"], $this->_instrument->dateTimeFields);
    }

    /**
     * Test that _saveCandidateAge calculates the candidate age and
     * window difference values and saves them to the database
     *
     * @covers NDB_BVL_Instrument::_saveCandidateAge
     * @return void
     */
    function testSaveCandidateAge()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->_instrument->testName  = 'Test Name1';
        $values = ['Date_taken' => '2005-06-06'];
        $this->_instrument->_saveCandidateAge($values);
        $this->assertEquals(
            $values,
            [
                'Date_taken'        => '2005-06-06',
                'Candidate_Age'     => 77.2,
                'Window_Difference' => 0
            ]
        );
    }

    /**
     * Test that _nullStatus sets the value of a field to empty if its
     * correlated status field has a value set
     *
     * @covers NDB_BVL_Instrument::_nullStatus
     * @return void
     */
    function testNullStatus()
    {
        $values = ['Test1' => 'field1',
            'Test2'        => 'field2',
            'Test3'        => 'field3',
            'Test1_status' => 'status1',
            'Test2_status' => 'status2',
            'Test3_status' => ''
        ];
        $this->_instrument->_nullStatus($values);
        $this->assertEquals(
            $values,
            [
                'Test1'        => '',
                'Test2'        => '',
                'Test3'        => 'field3',
                'Test1_status' => 'status1',
                'Test2_status' => 'status2',
                'Test3_status' => ''
            ]
        );
    }

    /**
     * Test that _saveValues correctly preprocesses the given array and
     * then updates the instrument table in the database accordingly
     *
     * @covers NDB_BVL_Instrument::_saveValues
     * @covers NDB_BVL_Instrument::_save
     * @return void
     */
    function testSaveValueAndSave()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->_instrument->testName  = 'TestName1';
        $this->_instrument->formType  = "XIN";
        $values = ['Date_taken' => '2005-06-06',
            'arthritis_age'        => 2,
            'arthritis_age_status' => 'status'
        ];
        $this->_instrument->_saveValues($values);
        $dbData = $this->_DB->pselect("SELECT * FROM medical_history", []);
        $this->assertEquals('77.2', $dbData[0]['Candidate_Age']);
        $this->assertEquals('0', $dbData[0]['Window_Difference']);
        $this->assertEquals(null, $dbData[0]['arthritis_age']);
        $this->assertEquals('', $dbData[0]['arthritis_age_status']);
    }

    /**
     * Test that freeze correctly freezes the form related to the instrument
     *
     * @covers NDB_BVL_Instrument::freeze
     * @return void
     */
    function testFreeze()
    {
        $this->_instrument->freeze();
        $this->assertTrue($this->_instrument->form->frozen);
    }

    /**
     * Test that getDateOfAdministration gets the Date_taken
     * from the instrument table
     *
     * @covers NDB_BVL_Instrument::getDateOfAdministration
     * @return void
     */
    function testGetDateOfAdministration()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->assertEquals(
            '2010-05-05',
            $this->_instrument->getDateOfAdministration()
        );
    }

    /**
     * Test that setRequired sets the required value of the form
     *
     * @note This test is being skipped because there is an error in
     * the setRequired method. Once this is resolved, this test can
     * be implemented.
     *
     * @covers NDB_BVL_Instrument::setRequired
     * @return void
     */
    function testSetRequired()
    {
        $this->markTestSkipped("Error in setRequired method");
        $this->_instrument->setRequired("Required_el");
        $this->assertEquals("Required_el", $this->_instrument->form->_required[]);
    }

    /**
     * Test that XINValidate returns true if there are no errors
     * for the given elements array
     *
     * @covers NDB_BVL_Instrument::XINValidate
     * @return void
     */
    function testXINValidatNoErrors()
    {
        $elements = ['el1' => 'val1',
            'el2' => 'val2'
        ];
        $this->assertTrue($this->_instrument->XINValidate($elements));
    }
    /**
     * Test that XINRegisterRule sets the values in the XINRules
     * array for the appropriate element name
     *
     * @covers NDB_BVL_Instrument::XINRegisterRule
     * @return void
     */
    function testXINRegisterRule()
    {
        $this->_instrument->XINRegisterRule(
            'elname1',
            ['rule1', 'rule2'],
            'message1',
            'group1'
        );
        $this->assertEquals(
            $this->_instrument->XINRules['elname1'],
            [
                'message' => 'message1',
                'group'   => 'group1',
                'rules'   => ['rule1', 'rule2']
            ]
        );
    }

    /**
     * Test that the progress of data entry completion is 100 and that the status is
     * 'Complete' if the _requiredElements array is empty
     *
     * @covers NDB_BVL_Instrument::determineDataEntryCompletionProgress
     * @covers NDB_BVL_Instrument::_determineDataEntryCompletionStatus
     * @return void
     */
    function testDetermineDataEntryCompletionProgressNoRequiredEl()
    {
        $this->_instrument->_requiredElements = [];
        $this->assertEquals(
            100,
            $this->_instrument->determineDataEntryCompletionProgress()
        );
        $this->assertEquals(
            'Complete',
            $this->_instrument->_determineDataEntryCompletionStatus()
        );
    }

    /**
     * Test that the progress of data entry completion is 0 and that the status is
     * 'Incomplete' if the _requiredElements field and status field are not set
     *
     * @covers NDB_BVL_Instrument::determineDataEntryCompletionProgress
     * @covers NDB_BVL_Instrument::_determineDataEntryCompletionStatus
     * @return void
     */
    function testDetermineDataEntryCompletionProgressWithUnanswered()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->_DB->run(
            "UPDATE medical_history SET arthritis_age=null
                WHERE CommentID='commentID1'"
        );
        $this->_DB->run(
            "UPDATE medical_history SET arthritis_age_status=null
                WHERE CommentID='commentID1'"
        );
        $this->_instrument->_requiredElements = ['arthritis_age'];
        $this->assertEquals(
            0,
            $this->_instrument->determineDataEntryCompletionProgress()
        );
        $this->assertEquals(
            'Incomplete',
            $this->_instrument->_determineDataEntryCompletionStatus()
        );
    }

    /**
     * Test that the progress of data entry completion is 100 and that the status is
     * 'Complete' if the _requiredElements field and status field have set values
     *
     * @covers NDB_BVL_Instrument::determineDataEntryCompletionProgress
     * @covers NDB_BVL_Instrument::_determineDataEntryCompletionStatus
     * @return void
     */
    function testDetermineDataEntryCompletionProgressWithAnswered()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->_DB->run(
            "UPDATE medical_history SET arthritis_age=60
                WHERE CommentID='commentID1'"
        );
        $this->_DB->run(
            "UPDATE medical_history SET arthritis_age_status='done'
                WHERE CommentID='commentID1'"
        );
        $this->_instrument->_requiredElements = ['arthritis_age'];
        $this->assertEquals(
            100,
            $this->_instrument->determineDataEntryCompletionProgress()
        );
        $this->assertEquals(
            'Complete',
            $this->_instrument->_determineDataEntryCompletionStatus()
        );
    }

    /**
     * Test that getDataEntryCompletionStatus returns the correct data
     * from the database
     *
     * @covers NDB_BVL_Instrument::getDataEntryCompletionStatus
     * @return void
     */
    function testGetDataEntryCompletionStatus()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->assertEquals(
            'Incomplete',
            $this->_instrument->getDataEntryCompletionStatus()
        );
    }

    /**
     * Test that _setDataEntryCompletionStatus correctly sets the
     * 'Data_entry_completion_status value in the instrument table
     *
     * @covers NDB_BVL_Instrument::_setDataEntryCompletionStatus
     * @return void
     */
    function testSetDataEntryCompletionStatus()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->_instrument->_setDataEntryCompletionStatus('Complete');
        $data = \NDB_BVL_Instrument::loadInstanceData($this->_instrument);
        $this->assertEquals('Complete', $data['Data_entry_completion_status']);
    }

    /**
     * Test that _setDataEntryCompletionStatus throws an exception if
     * the given status is not 'Complete' or 'Incomplete'
     *
     * @covers NDB_BVL_Instrument::_setDataEntryCompletionStatus
     * @return void
     */
    function testSetDataEntryCompletionStatusThrowsException()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->expectException('Exception');
        $this->_instrument->_setDataEntryCompletionStatus('BadString');
    }

    /**
     * Test that nullScores sets the value for the given key-value pair
     * to null in the instrument table
     *
     * @covers NDB_BVL_Instrument::_nullScores
     * @return void
     */
    function testNullScores()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->_instrument->_nullScores(['Examiner' => 'Test Examiner1']);
        $data = \NDB_BVL_Instrument::loadInstanceData($this->_instrument);
        $this->assertEquals(null, $data['Examiner']);
    }

    /**
     * Test that diff returns an array highlighting the differences between
     * two instruments
     *
     * @covers NDB_BVL_Instrument::diff
     * @return void
     */
    function testDiff()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $otherInstrument            = $this
            ->getMockBuilder(\NDB_BVL_Instrument::class)
            ->disableOriginalConstructor()
            ->setMethods(["getFullName", "getSubtestList"])->getMock();
        $otherInstrument->commentID = 'commentID2';
        $otherInstrument->table     = 'medical_history';
        $this->assertEquals(
            $this->_instrument->diff($otherInstrument),
            [
                [
                    'TableName'      => 'medical_history',
                    'ExtraKeyColumn' => null,
                    'ExtraKey1'      => ' ',
                    'ExtraKey2'      => ' ',
                    'FieldName'      => 'Examiner',
                    'CommentId1'     => 'commentID1',
                    'Value1'         => 'Test Examiner1',
                    'CommentId2'     => 'commentID2',
                    'Value2'         => 'Test Examiner2'
                ]
            ]
        );
    }

    /**
     * Test that clearInstrument clears all relevant instrument data and removes
     * instrument data from the conflicts_unresolved table
     *
     * @covers NDB_BVL_Instrument::clearInstrument
     * @return void
     */
    function testClearInstrument()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $conflicts_data = [
            [
                'ConflictID'     => '123',
                'TableName'      => '',
                'ExtraKeyColumn' => null,
                'ExtraKey1'      => '',
                'ExtraKey2'      => '',
                'FieldName'      => '',
                'CommentId1'     => 'commentID1',
                'Value1'         => null,
                'CommentId2'     => '',
                'Value2'         => null
            ]
        ];
        $this->_DB->setFakeTableData(
            "conflicts_unresolved",
            $conflicts_data
        );
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $conflictsBefore = $this->_DB->pselect(
            "SELECT * FROM conflicts_unresolved",
            []
        );
        $this->_instrument->clearInstrument();
        $data           = \NDB_BVL_Instrument::loadInstanceData($this->_instrument);
        $conflictsAfter = $this->_DB->pselect(
            "SELECT * FROM conflicts_unresolved",
            []
        );
        $this->_DB->run("DROP TEMPORARY TABLE IF EXISTS conflicts_unresolved");
        $this->assertEquals(null, $data['Examiner']);
        $this->assertEquals('Incomplete', $data['Data_entry_completion_status']);
        $this->assertEquals(
            $conflicts_data,
            $conflictsBefore
        );
        $this->assertEquals([], $conflictsAfter);
    }

    /**
     * Test that determineDataEntryAllowed returns true if the Data_entry is anything
     * but 'Complete' and returns false if Data_entry is 'Complete. Test that
     * validate simply calls determineDataEntryAllowed and has the same output.
     *
     * @covers NDB_BVL_Instrument::determineDataEntryAllowed
     * @covers NDB_BVL_Instrument::validate
     * @return void
     */
    function testDetermineDataEntryAllowed()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->_instrument->table     = 'medical_history';
        $this->assertTrue($this->_instrument->determineDataEntryAllowed());
        $this->assertTrue($this->_instrument->validate(['value1']));
        $this->_instrument->commentID = 'commentID2';
        $this->assertFalse($this->_instrument->determineDataEntryAllowed());
        $this->assertFalse($this->_instrument->validate(['value1']));
    }

    /**
     * Test that getFlags returns an \InstrumentFlags object
     *
     * @covers NDB_BVL_Instrument::getFlags
     * @return void
     */
    function testGetFlags()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->assertEquals(
            new \InstrumentFlags(null, null, null),
            $this->_instrument->getFlags()
        );
    }

    /**
     * Test that _toJSONParseSmarty returns an array with the
     * correct information for a date type element.
     *
     * @covers NDB_BVL_Instrument::_toJSONParseSmarty
     * @return void
     */
    function testToJsonParseSmartyDateType()
    {
        $el     = ['type' => 'date'];
        $result = ['type' => 'date',
            'options'    => ['mindate' => "1990-01-01",
                'maxdate'         => "2000-12-31",
                'RequireResponse' => false
            ],
            'NoResponse' => true
        ];
        $this->assertEquals($result, $this->_instrument->_toJSONParseSmarty($el));
    }

    /**
     * Test that _toJSONParseSmarty returns an array with the
     * correct information for a date type element when the form
     * is not a LorisForm.
     *
     * @covers NDB_BVL_Instrument::_toJSONParseSmarty
     * @return void
     */
    function testToJsonParseSmartyDateTypeNotLorisForm()
    {
        $date = ['options' => ['minYear' => '1990',
            'maxYear' => '2000'
        ],
            'type'    => 'select'

        ];
        $dateHTML = $this->_instrument->form->renderElement($date);
        $el       = ['type' => 'date',
            'html' => $dateHTML
        ];
        $result   = ['type' => 'date',
            'html'       => $dateHTML,
            'options'    => ['mindate' => "1990-01-01",
                'maxdate' => "2000-12-31"
            ],
            'NoResponse' => true
        ];
        $this->_instrument->form = new \Candidate();
        $this->assertEquals($result, $this->_instrument->_toJSONParseSmarty($el));
    }

    /**
     * Test that _toJSONParseSmarty returns an array with the
     * correct information
     *
     * @covers NDB_BVL_Instrument::_toJSONParseSmarty
     * @return void
     */
    function toJsonParseSmartySelectType()
    {
        $select = ['type' => 'select',
            'multiple' => 'multiple',
            'option'   => ['value' => 'not_answered']
        ];
        $html   = $this->_instrument->form->renderElement($select);
        $el     = ['type' => 'select', 'html' => $html];
        $this->assertEquals($el, $this->_instrument->_toJSONParseSmarty($select));
    }

    /**
     * Test that usesJSONData returns false
     *
     * @covers NDB_BVL_Instrument::usesJSONData
     * @return void
     */
    function testUsesJSONData()
    {
        $this->assertFalse($this->_instrument->usesJSONData());
    }

    /**
     * Test that display returns an html with an expected hidden element. The HTML
     * value returned is too long to be compared.
     *
     * @covers NDB_BVL_Instrument::display
     * @return void
     */
    function testDisplay()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->setup("commentID1", "page");
        $this->_instrument->table = 'medical_history';
        $this->assertContains(
            "<input  name=\"candID\" value=\"\" type=\"hidden\">\n",
            $this->_instrument->display()
        );
    }

    /**
     * Test that save returns false if the instrument cannot be validated
     * and saved
     *
     * @covers NDB_BVL_Instrument::save
     * @return void
     */
    function testSaveFalse()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID2';
        $this->_instrument->table     = 'medical_history';
        $this->_instrument->form      = $this->getMockBuilder("\LorisForm")
            ->getMock();
        $this->_instrument->form
            ->method('getSubmitValues')->willReturn(['1', '2']);
        $this->assertFalse($this->_instrument->save());
    }

    /**
     * Test that XINRunRuleFunction throws a LorisException if the operator
     * is unsupported (not == or !=)
     *
     * @covers NDB_BVL_Instrument::XINRunRuleFunction
     * @return void
     */
    function testXINRunRuleFunctionThrowsException()
    {
        $this->expectException('\LorisException');
        $this->_instrument->XINRunRuleFunction("controller", ["1"], "&&");
    }

    /**
     * Private function to set fake table data to be tested
     *
     * @return void
     */
    private function _setTableData()
    {
        $this->_DB->run("DROP TEMPORARY TABLE IF EXISTS flag");
        $this->_DB->run("DROP TEMPORARY TABLE IF EXISTS session");
        $this->_DB->run("DROP TEMPORARY TABLE IF EXISTS candidate");
        $this->_DB->run("DROP TEMPORARY TABLE IF EXISTS medical_history");
        $this->_DB->run("DROP TEMPORARY TABLE IF EXISTS test_battery");
        $this->_DB->run("DROP TEMPORARY TABLE IF EXISTS parameter_type");
        $this->_DB->setFakeTableData(
            "flag",
            [
                [
                    'ID'             => '1000',
                    'SessionID'      => '123',
                    'CommentID'      => 'commentID1',
                    'Test_name'      => 'Test_name1',
                    'UserID'         => '456',
                    'Data_entry'     => 'Incomplete',
                    'Administration' => 'admin1',
                    'Validity'       => 'valid1'
                ],
                [
                    'ID'             => '2000',
                    'SessionID'      => '234',
                    'CommentID'      => 'commentID2',
                    'Test_name'      => 'Test_name2',
                    'UserID'         => '457',
                    'Data_entry'     => 'Complete',
                    'Administration' => 'admin2',
                    'Validity'       => 'valid2'
                ],
            ]
        );
        $this->_DB->setFakeTableData(
            "candidate",
            [
                [
                    'CandID' => 1,
                    'DoB'    => '1999-01-01',
                    'DoD'    => '2016-01-01',
                    'PSCID'  => '345'
                ],
                [
                    'CandID' => 2,
                    'DoB'    => '1999-01-01',
                    'DoD'    => '2016-01-01',
                    'PSCID'  => '346'
                ]
            ]
        );
        $this->_DB->setFakeTableData(
            "session",
            [
                [
                    'ID'           => '123',
                    'CandID'       => 1,
                    'SubprojectID' => '12'
                ],
                [
                    'ID'           => '234',
                    'CandID'       => 2,
                    'SubprojectID' => '12'
                ]
            ]
        );
        $this->_DB->setFakeTableData(
            "medical_history",
            [
                [
                    'CommentID'                    => 'commentID1',
                    'UserID'                       => '456',
                    'Examiner'                     => 'Test Examiner1',
                    'Date_taken'                   => '2010-05-05 00:00:01',
                    'Data_entry_completion_status' => 'Incomplete'
                ],
                [
                    'CommentID'                    => 'commentID2',
                    'UserID'                       => '457',
                    'Examiner'                     => 'Test Examiner2',
                    'Date_taken'                   => '2010-05-05 00:00:01',
                    'Data_entry_completion_status' => 'Incomplete'
                ],
            ]
        );
        $this->_DB->setFakeTableData(
            "test_battery",
            [
                [
                    'Active'       => 'Y',
                    'Test_name'    => 'TestName1_proband',
                    'SubprojectID' => '12',
                    'AgeMinDays'   => 0,
                    'AgeMaxDays'   => 100
                ]
            ]
        );
        $this->_DB->setFakeTableData(
            "parameter_type",
            [
                [
                    'Description' => 'description 1',
                    'SourceField' => 'Not validity',
                    'SourceFrom'  => 'Testname1'
                ],
                [
                    'Description' => 'description 2',
                    'SourceField' => 'Validity',
                    'SourceFrom'  => 'Testname1'
                ]
            ]
        );
    }

    /**
     * Private function to set up the mock DB used for testing
     *
     * @return void
     */
    private function _setUpMockDB()
    {
        $this->_factoryForDB = \NDB_Factory::singleton();
        $this->_factoryForDB->reset();
        $this->_factoryForDB->setTesting(false);
        $this->_config = $this->_factoryForDB->Config(CONFIG_XML);
        $database      = $this->_config->getSetting('database');
        $this->_DB     = \Database::singleton(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            1
        );
    }
}

