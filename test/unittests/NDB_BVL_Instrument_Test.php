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
                array('getProperty', 'setProperty', 'getUsername', 'isLoggedIn')
            )
            ->getMock();
        $this->mockSinglePointLogin = $this->getMockBuilder('SinglePointLogin')
            ->getMock();
        $this->session->method("getProperty")
            ->willReturn($this->mockSinglePointLogin);

        $_SESSION = array(
            'State' => $this->session
        );

        $this->_factory = \NDB_Factory::singleton();
        $this->_factory->setTesting(true);

        $this->_mockDB = $this->getMockBuilder("\Database")->getMock();
        $this->_mockConfig = $this->getMockBuilder("\NDB_Config")->getMock();

        \NDB_Factory::$db = $this->_mockDB;
        \NDB_Factory::$testdb = $this->_mockDB;
        \NDB_Factory::$config = $this->_mockConfig;

        $this->quickForm = new \LorisForm();

        $this->_instrument = $this->getMockBuilder(\NDB_BVL_Instrument::class)
            ->disableOriginalConstructor()
            ->setMethods(array("getFullName", "getSubtestList"))->getMock();
        $this->_instrument->method('getFullName')->willReturn("Test Instrument");
        $this->_instrument->method('getSubtestList')->willReturn(array());
        $this->_instrument->form = $this->quickForm;
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
        $json = $this->_instrument->toJSON();
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

    /**
     * Test that addSelect and addElement add the correct information
     * and that toJSON returns this data
     *
     * @covers NDB_BVL_Instrument::toJSON
     * @return void
     */
    function testSelectElement()
    {
        $value = array('value' => "Option");
        $not_answered = array('value' => 'Option', 'not_answered' => 'Not Answered');
        $this->_instrument->addSelect("FieldName", "Field Description", $value);
        $this->_instrument->addSelect(
            "FieldName2", "Field Description 2", $not_answered
        );
        $this->_instrument->form->addElement(
            'select',
            "multiselect1",
            "Test Question",
            $value, array("multiple" => 'multiple')
        );
        $this->_instrument->form->addElement(
            'select',
            "multiselect2",
            "Test Question",
            $not_answered, array('multiple' => "multiple")
        );
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $selectElement = $outArray['Elements'][0];
        $selectElement2 = $outArray['Elements'][1];

        $multiselectElement = $outArray['Elements'][2];
        $multiselectElement2 = $outArray['Elements'][3];

        $this->assertEquals(
            $selectElement,
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

        $this->assertEquals(
            $selectElement2,
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

        $this->assertEquals(
            $multiselectElement,
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

        $this->assertEquals(
            $multiselectElement2,
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
            "FieldName", "Field Description for Text", array("value" => "Option")
        );
        $this->_instrument->addTextAreaElement(
            "FieldName2", "Field Description2 for Text", array("value" => "Option")
        );
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $textElement = $outArray['Elements'][0];
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

        $textRules = $this->_instrument->XINRules['FieldName'];
        $textAreaRules = $this->_instrument->XINRules['FieldName2'];
        $this->assertEquals(
            $textRules,
            [
                'message' => 'This field is required.',
                'group' => 'FieldName_group',
                'rules' => ['FieldName_status{@}=={@}', 'Option']
            ]
        );
        $this->assertEquals(
            $textAreaRules,
            [
                'message' => 'This field is required.',
                'group' => 'FieldName2_group',
                'rules' => ['FieldName2_status{@}=={@}', 'Option']
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
            "FieldName1", "Field Description1", array("value" => "Option")
        );
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $this->assertEquals(
            $outArray['Elements'][0],
            ['Type' => "Group", 'Error' => "Unimplemented"]
        );
        $groupEl = $this->_instrument->form->form['FieldName1_group'];
        $this->assertEquals(
            $groupEl,
            [
                'type' => 'group',
                'name' => 'FieldName1_group',
                'elements' => [
                    ['label' => null,
                     'name' => 'FieldName1',
                     'type' => 'textarea',
                     'html' => $this->_instrument->form
                         ->renderElement($groupEl['elements'][0])
                    ],
                    ['label' => '',
                     'name' => 'FieldName1_status',
                     'class' => 'form-control input-sm',
                     'type' => 'select',
                     'options' => ['' => '',
                                   '88_refused' => '88 Refused',
                                   '99_do_not_know' => '99 Do not know',
                                   'not_answered' => 'Not Answered'
                                  ],
                     'html' => $this->_instrument->form
                         ->renderElement($groupEl['elements'][1])
                    ],
                ],
                'label' => 'Field Description1',
                'delimiter' => ' ',
                'options' => false,
                'html' => $this->_instrument->form->groupHTML($groupEl)
            ]
        );
        $textRules = $this->_instrument->XINRules['FieldName1'];
        $this->assertEquals(
            $textRules,
            [
                'message' => 'You must specify or select from the drop-down',
                'group' => 'FieldName1_group',
                'rules' => ['FieldName1_status{@}=={@}', 'Option']
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
            "hourMinField", "hourMinLabel", ["value" => "Option"], "Rule_message"
        );
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $this->assertEquals(
            $outArray['Elements'][0],
            ['Type' => "Group", 'Error' => "Unimplemented"]
        );
        $groupEl = $this->_instrument->form->form['hourMinField_group'];
        $this->assertEquals(
            $groupEl,
            [
                'type' => 'group',
                'name' => 'hourMinField_group',
                'elements' => [
                    ['label' => null,
                     'name' => 'hourMinField',
                     'type' => 'time',
                     'html' => $this->_instrument->form
                         ->renderElement($groupEl['elements'][0])
                    ],
                    ['label' => '',
                     'name' => 'hourMinField_status',
                     'class' => 'form-control input-sm',
                     'type' => 'select',
                     'options' => [null => '',
                                   'dnk' => 'DNK',
                                   'refusal' => 'Refusal',
                                   'not_answered' => 'Not Answered',
                                  ],
                     'html' => $this->_instrument->form
                         ->renderElement($groupEl['elements'][1])
                    ]
                ],
                'label' => 'hourMinLabel',
                'delimiter' => ' ',
                'options' => false,
                'html' => $this->_instrument->form->groupHTML($groupEl)
            ]
        );
        $rules = $this->_instrument->XINRules['hourMinField'];
        $this->assertEquals(
            $rules,
            [
                'message' => 'Rule_message',
                'group' => 'hourMinField_group',
                'rules' => ['Option', 'hourMinField_status{@}=={@}']
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
                'format'  => 'YMd',
                "minYear" => "1990",
                "maxYear" => "2000",
                "addEmptyOption" => false,
            ]
        );
        $this->_instrument->addBasicDate(
            "FieldName2",
            "Field Description",
            [
                'format'  => 'YMd',
                "minYear" => "1990",
                "maxYear" => "2000",
                "addEmptyOption" => true,
            ]
        );

        $this->_instrument->addDateElement(
            "FieldName3",
            "Field Description",
            [
                'format'  => 'YMd',
                "minYear" => "1990",
                "maxYear" => "2000",
                "addEmptyOption" => false,
            ]
        );
        $this->_instrument->addDateElement(
            "FieldName4",
            "Field Description",
            [
                'format'  => 'YMd',
                "minYear" => "1990",
                "maxYear" => "2000",
                "addEmptyOption" => true,
            ]
        );
        $json = $this->_instrument->toJSON();
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
                'label' => 'Label 1',
                'name' => 'Field1',
                'type' => 'date',
                'options' => ['value' => 'Option',
                              'format' => 'YM']
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
            "CustomName", "Date Label", array("value" => "Option")
        );
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $this->assertEquals(
            $outArray['Elements'][0],
            ['Type' => "Group", 'Error' => "Unimplemented"]
        );
        $groupEl = $this->_instrument->form->form['CustomName_date_group'];
        $this->assertEquals(
            $groupEl,
            [
                'type' => 'group',
                'name' => 'CustomName_date_group',
                'elements' => [
                    [
                        'label' => null,
                        'name' => 'CustomName_date',
                        'class' => 'form-control input-sm',
                        'type' => 'date',
                        'html' => $this->_instrument->form
                            ->renderElement($groupEl['elements'][0]),
                        'options' => ['value' => 'Option']
                    ],
                    [
                        'label' => null,
                        'name' => 'CustomName_date_status',
                        'class' => 'form-control input-sm',
                        'type' => 'select',
                        'options' => [
                            null => '',
                            '88_refused' => "88 Refused",
                            '99_do_not_know' => "99 Do not know",
                            'not_answered'   => "Not Answered"
                        ],
                        'html' => $this->_instrument->form
                            ->renderElement($groupEl['elements'][1])
                    ]
                ],
                'label' => 'Date Label',
                'delimiter' => "</td>\n<td>",
                'options' => false,
                'html' => $this->_instrument->form->groupHTML($groupEl)
            ]
        );
        $rule1 = $this->_instrument->XINRules['CustomName_date'];
        $this->assertEquals(
            $rule1,
            [
                'message' => "You must specify or select from the drop-down",
                'group' => 'CustomName_date_group',
                'rules' => ['CustomName_date_status{@}=={@}']
            ]
        );
        $rule2 = $this->_instrument->XINRules['CustomName_date_status'];
        $this->assertEquals(
            $rule2,
            [
                'message' => "You must specify or select from the drop-down",
                'group' => 'CustomName_date_group',
                'rules' => ['CustomName_date{@}=={@}']
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
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $numericElement = $outArray['Elements'][0];

        $this->assertEquals(
            $numericElement,
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
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $numericElement = $outArray['Elements'][0];
        $this->assertEquals(
            $numericElement,
            ['Type' => "Group", 'Error' => "Unimplemented"]
        );
        $groupEl = $this->_instrument->form->form['TestElement_group'];
        $this->assertEquals(
            $groupEl,
            [
                'type' => 'group',
                'name' => 'TestElement_group',
                'elements' => [
                    [
                        'type' => 'text',
                        'name' => 'TestElement',
                        'label' => 'Test Description',
                        'class' => 'form-control input-sm',
                        'numeric' => true,
                        'numericMsg' => 'Numbers only, please',
                        'html' => $this->_instrument->form
                            ->renderElement($groupEl['elements'][0])
                    ],
                    [
                        'type' => 'select',
                        'name' => 'TestElement_status',
                        'label' => null,
                        'class' => 'form-control input-sm not-answered',
                        'options' => [
                            '' => '',
                            '88_refused' => '88 Refused',
                            '99_do_not_know' => '99 Do not know',
                            'not_answered' => 'Not Answered'
                        ],
                        'html' => $this->_instrument->form
                            ->renderElement($groupEl['elements'][1])
                    ]
                ],
                'label' => 'Test Description',
                'delimiter' => ' ',
                'options' => false,
                'numeric' => [0],
                'html' => $this->_instrument->form->groupHTML($groupEl)
            ]
        );
        $rule = $this->_instrument->XINRules['TestElement'];
        $this->assertEquals(
            $rule,
            [
                'message' => 'This field is required',
                'group' => 'TestElement_group',
                'rules' => ['TestElement_status{@}=={@}']
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
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $scoreElement = $outArray['Elements'][0];
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
                'Type'        => "score",
                "Name"        => "FieldName2",
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
            "header", null, "I am your test header"
        );
        $this->_instrument->form->addElement(
            "header", null, "I am another test header"
        );
        $this->_instrument->addScoreColumn(
            "FieldName2",
            "Field Description",
            "45"
        );
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $headerElement = $outArray['Elements'][0];
        $headerElement2= $outArray['Elements'][1];

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
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
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
                array("getFullName", "getSubtestList", '_setupForm')
            )->getMock();
        $this->_instrument->method('getFullName')->willReturn("Test Instrument");
        $this->_instrument->method('getSubtestList')->willReturn(
            array(
                array('Name' => 'Page 1', 'Description' => 'The first page'),
                array('Name' => 'Page 2', 'Description' => 'The second page'),
            )
        );

        $this->_instrument->form = $this->quickForm;
        $this->_instrument->testName = "Test";

        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $page1 = $outArray['Elements'][0];
        $page2 = $outArray['Elements'][1];
        $this->assertEquals(
            $page1,
            [
                'Type' => 'ElementGroup',
                'GroupType' => 'Page',
                'Elements' => [],
                'Description' => 'The first page'
            ]
        );
        $this->assertEquals(
            $page2,
            [
                'Type' => 'ElementGroup',
                'GroupType' => 'Page',
                'Elements' => [],
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
        $age = array('year' => 3, 'mon' => 4, 'day' => 23);
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
        $age = array('year' => 3, 'mon' => 4, 'day' => 23);
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
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $this->assertEquals(
            $outArray['Elements'][0],
            array('Type' => 'select',
                  'Name' => 'field1',
                  'Description' => 'label1',
                  'Options' => array('Values' => array('' => '',
                                                       'yes' => 'Yes',
                                                       'no' => 'No'),
                                     'RequireResponse' => true)
            )
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
            "field1", "label1", ["rule1"], "Rule message"
        );
        $json = $this->_instrument->toJSON();
        $outArray = json_decode($json, true);
        $this->assertEquals(
            $outArray['Elements'][0],
            array('Type' => 'select',
                'Name' => 'field1',
                'Description' => 'label1',
                'Options' => array('Values' => array('' => '',
                    'yes' => 'Yes',
                    'no' => 'No'),
                    'RequireResponse' => true)
            )
        );
        $rules = $this->_instrument->XINRules["field1"];
        $this->assertEquals(
            $rules,
            array('message' => 'Rule message',
                  'group' => '',
                  'rules' => ['rule1']
            )
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
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->assertEquals("123", $this->_instrument->getSessionID());
    }

    /**
     * Test that getSessionID returns -1 if nothing was found in the
     * database for the given commentID
     *
     * @covers NDB_BVL_Instrument::getSessionID
     * @return void
     */
    function testGetSessionIDReturnsNegative()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID2';
        $this->assertEquals(-1, $this->_instrument->getSessionID());
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
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->assertEquals("123", $this->_instrument->getSessionID());
        $this->assertEquals("V1", $this->_instrument->getVisitLabel());
    }

    /**
     * Test that getVistiLabel returns an empty string
     * if nothing was found in the database
     *
     * @covers NDB_BVL_Instrument::getVisitLabel
     * @return void
     */
    function testGetVisitLabelReturnsEmpty()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID2';
        $this->assertEquals("", $this->_instrument->getVisitLabel());
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
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID1';
        $this->assertEquals(2, $this->_instrument->getSubprojectID());
    }

    /**
     * Test that getSubprojectID returns null if nothing was found
     *
     * @covers NDB_BVL_Instrument::getSubprojectID
     * @return void
     */
    function testGetSubprojectIDReturnsNull()
    {
        $this->_setUpMockDB();
        $this->_setTableData();
        $this->_instrument->commentID = 'commentID2';
        $this->assertEquals(null, $this->_instrument->getSubprojectID());
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
        $this->assertEquals('2005-01-01', $this->_instrument->getDoD());
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
     * Private function to set fake table data to be tested
     *
     * @return void
     */
    private function _setTableData()
    {
        $this->_DB->run("DROP TEMPORARY TABLE IF EXISTS flag");
        $this->_DB->run("DROP TEMPORARY TABLE IF EXISTS session");
        $this->_DB->run("DROP TEMPORARY TABLE IF EXISTS candidate");
        $this->_DB->setFakeTableData(
            "flag",
            [['SessionID' => '123', 'CommentID' => 'commentID1']]
        );
        $this->_DB->setFakeTableData(
            "candidate",
            [
                [
                    'CandID' => 1,
                    'DoB' => '1999-01-01',
                    'DoD' => '2005-01-01',
                    'PSCID' => '345'
                ]
            ]
        );
        $this->_DB->setFakeTableData(
            "session",
            [['ID' => '123', 'CandID' => 1]]
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
        $database     = $this->_config->getSetting('database');
        $this->_DB     = \Database::singleton(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            1
        );
    }
}
?>
