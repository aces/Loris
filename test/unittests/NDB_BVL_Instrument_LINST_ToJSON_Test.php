<?php
namespace Loris\Tests;
set_include_path(get_include_path().":" .  __DIR__  . "/../../php/libraries:");

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../modules/instruments/php/dictionaryitem.class.inc';
require_once __DIR__ . '/../../php/libraries/NDB_BVL_Instrument_LINST.class.inc';
require_once 'Smarty_hook.class.inc';
require_once 'NDB_Config.class.inc';
use PHPUnit\Framework\TestCase;

/**
 * Unit test for NDB_BVL_Instrument_LINST_ToJSON class
 *
 * PHP Version 7
 *
 * @category Tests
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class NDB_BVL_Instrument_LINST_ToJSON_Test extends TestCase
{
    /**
     * An instrument class for testing
     *
     * @var \NDB_BVL_Instrument
     */
    protected $i;

    protected \NDB_Client $Client;

    /**
     * Set up sets a fake $_SESSION object that we can use for
     * assertions
     *
     * @return void
     */
    function setUp(): void
    {
        global $_SESSION;
        if (!defined("UNIT_TESTING")) {
            define("UNIT_TESTING", true);
        }
        date_default_timezone_set("UTC");

        $session = $this->getMockBuilder(\stdClass::class)->addMethods(
            [
                'getProperty',
                'setProperty',
                'getUsername',
                'isLoggedIn'
            ]
        )->getMock();

        $mockSinglePointLogin = $this->getMockBuilder('SinglePointLogin')
            ->getMock();
        $session->method("getProperty")
            ->willReturn($mockSinglePointLogin);

        $_SESSION = [
            'State' => $session,
        ];

        $factory = \NDB_Factory::singleton();

        $mockdb     = $this->getMockBuilder("\Database")->getMock();
        $mockconfig = $this->getMockBuilder("\NDB_Config")->getMock();

        $mockdb->expects($this->any())
            ->method('pselectOne')
            ->willReturn('999');

        '@phan-var \Database $mockdb';
        '@phan-var \NDB_Config $mockconfig';

        $factory->setDatabase($mockdb);
        $factory->setConfig($mockconfig);

        $this->Client = new \NDB_Client;
        $this->Client->makeCommandLine();
        //$this->Client->initialize(__DIR__ . "/../../project/config.xml");

        $i = $this
            ->getMockBuilder('\Loris\Behavioural\NDB_BVL_Instrument_LINST')
            ->disableOriginalConstructor()
            ->onlyMethods(['getFullName', 'getSessionID'])
            ->getMock();
        $i->method('getFullName')->willReturn("Test Instrument");
        $i->method('getSessionID')
            ->willReturn(new \SessionID(strval("123456")));

        '@phan-var \Loris\Behavioural\NDB_BVL_Instrument_LINST $i';
        $i->form     = new \LorisForm();
        $i->testName = "Test";

        $this->i = $i;
    }

    /**
     * Helper function to use for creating stubs that stub out everything except
     * the method being tested
     *
     * @param $methods [] The methods to exclude
     *
     * @return []
     */
    function _getAllMethodsExcept($methods)
    {
        $AllMethods = get_class_methods(
            '\Loris\Behavioural\NDB_BVL_Instrument_LINST'
        );

        return array_diff($AllMethods, $methods);
    }

    /**
     * Test metadata
     *
     * @return void
     */
    function testMetaData()
    {
        $instrument = "table{@}Test\ntitle{@}Test Instrument";
        $base64     = "data://text/plain;base64," . base64_encode($instrument);
        try {
            $this->i->loadInstrumentFile($base64, true);
        } catch (\NotFound $e) {
            // This can occur when no SessionID exists. It's not important
            // for this test.
        }
        $json     = $this->i->toJSON();
        $outArray = json_decode($json, true);
        assert(is_array($outArray));
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
     * Test all elements
     *
     * @return void
     */
    function testAllElements()
    {
        $instrument  = "table{@}Test\n";
        $instrument .= "title{@}Test Instrument\n";
        $instrument .= "date{@}Date_taken{@}Date of Administration{@}2006{@}2012\n";
        $instrument .= "static{@}Candidate_Age{@}Candidate Age (Months)\n";
        $instrument .= "static{@}Window_Difference{@}Window Difference (+/- Days)\n";
        $instrument .= "select{@}Examiner{@}Examiner{@}NULL=>''\n";
        $instrument .= "header{@}{@}Header\n";
        $instrument .= "static{@}{@}label\n";
        $instrument .= "text{@}FieldName{@}Field Description\n";
        $instrument .= "select{@}texbox_status{@}{@}NULL=>''{-}"
                       . "'not_answered'=>'Not Answered'\n";
        $instrument .= "textarea{@}FieldName{@}Field Description\n";
        $instrument .= "select{@}textarea_status{@}{@}NULL=>''{-}"
                       . "'not_answered'=>'Not Answered'\n";
        $instrument .= "select{@}FieldName{@}Field Description{@}NULL=>''{-}"
                       . "'option_1'=>'Option 1'{-}'option_2'=>'Option 2'{-}"
                       . "'option_3'=>'Option 3'{-}'not_answered'=>'Not Answered'\n";
        $instrument .= "selectmultiple{@}FieldName{@}Field Description{@}NULL=>''{-}"
                       . "'option_1'=>'Option 1'{-}'option_2'=>'Option 2'{-}"
                       . "'option_3'=>'Option 3'{-}'option_4'=>'Option 4'{-}"
                       . "'not_answered'=>'Not Answered'\n";
        $instrument .= "date{@}FieldName_date{@}Field Description{@}2003{@}2014\n";
        $instrument .= "select{@}date_status{@}{@}NULL=>''{-}"
                       . "'not_answered'=>'Not Answered'\n";
        $instrument .= "numeric{@}FieldName{@}Field Description{@}0{@}20\n";
        $instrument .= "select{@}numeric_status{@}{@}NULL=>''{-}"
                       . "'not_answered'=>'Not Answered'";

        $base64 = "data://text/plain;base64," . base64_encode($instrument);
        try {
            $this->i->loadInstrumentFile($base64, true);
        } catch (\NotFound $e) {
            // This can occur when no SessionID exists. It's not important
            // for this test.
        }
        $json           = $this->i->toJSON();
        $outArray       = json_decode($json, true);
        $instrumentJSON = [
            "Meta"     => [
                'InstrumentVersion'       => "1l",
                'InstrumentFormatVersion' => "v0.0.1a-dev",
                "ShortName"               => "Test",
                "LongName"                => "Test Instrument",
                "IncludeMetaDataFields"   => "true",
            ],
            "Elements" => [
                [
                    "Type"        => "date",
                    "Name"        => "Date_taken",
                    "Description" => "Date of Administration",
                    "Options"     => [
                        "MinDate" => "2006-01-01",
                        "MaxDate" => "2012-12-31"
                    ]
                ],
                [
                    "Type"        => "select",
                    "Name"        => "Examiner",
                    "Description" => "Examiner",
                    "Options"     => [
                        "Values"          => [
                            "" => ""
                        ],
                        "AllowMultiple"   => false,
                        "RequireResponse" => false
                    ]
                ],
                [
                    'Type'        => "header",
                    "Description" => "Header"
                ],
                [
                    'Type'        => "text",
                    "Name"        => "FieldName",
                    "Description" => "Field Description",
                    "Options"     => [
                        "Type"            => "small",
                        "RequireResponse" => true
                    ]
                ],
                [
                    'Type'        => "text",
                    "Name"        => "FieldName",
                    "Description" => "Field Description",
                    "Options"     => [
                        "Type"            => "large",
                        "RequireResponse" => true
                    ]
                ],
                [
                    'Type'        => "select",
                    "Name"        => "FieldName",
                    "Description" => "Field Description",
                    "Options"     => [
                        "Values"          => [
                            ''         =>'',
                            'option_1' =>'Option 1',
                            'option_2' =>'Option 2',
                            'option_3' =>'Option 3'
                        ],
                        "RequireResponse" => true,
                        "AllowMultiple"   => false,
                    ],
                ],
                [
                    'Type'        => "select",
                    "Name"        => "FieldName",
                    "Description" => "Field Description",
                    "Options"     => [
                        "Values"          => [
                            ''         =>'',
                            'option_1' =>'Option 1',
                            'option_2' =>'Option 2',
                            'option_3' =>'Option 3',
                            'option_4' =>'Option 4'
                        ],
                        "RequireResponse" => true,
                        "AllowMultiple"   => true,
                    ],
                ],
                [
                    'Type'        => "date",
                    "Name"        => "FieldName_date",
                    "Description" => "Field Description",
                    "Options"     => [
                        "MinDate"         => "2003-01-01",
                        "MaxDate"         => "2014-12-31",
                        "RequireResponse" => true
                    ]
                ],
                [
                    'Type'        => "numeric",
                    "Name"        => "FieldName",
                    "Description" => "Field Description",
                    "Options"     => [
                        "NumberType"      => "integer",
                        "MinValue"        => 0,
                        "MaxValue"        => 20,
                        "RequireResponse" => true
                    ]
                ]
            ]
        ];
        $this->assertEquals($instrumentJSON, $outArray);
    }

    /**
     * Test page element
     *
     * @return void
     */
    function testPageElement()
    {
        $instrument  = "table{@}Test\n";
        $instrument .= "title{@}Test Instrument\n";
        $instrument .= "date{@}Date_taken{@}Date of Administration{@}2006{@}2012\n";
        $instrument .= "static{@}Candidate_Age{@}Candidate Age (Months)\n";
        $instrument .= "static{@}Window_Difference{@}Window Difference (+/- Days)\n";
        $instrument .= "select{@}Examiner{@}Examiner{@}NULL=>''\n";
        $instrument .= "header{@}{@}Page 1\n";
        $instrument .= "page{@}{@}Page 2\n";
        $instrument .= "header{@}{@}Page 2";

        $base64 = "data://text/plain;base64," . base64_encode($instrument);
        try {
            $this->i->loadInstrumentFile($base64, true);
        } catch (\NotFound $e) {
            // This can occur when no SessionID exists. It's not important
            // for this test.
        }
        $json         = $this->i->toJSON();
        $outArray     = json_decode($json, true);
        $ExpectedMeta = [
            "Meta"     => [
                'InstrumentVersion'       => "1l",
                'InstrumentFormatVersion' => "v0.0.1a-dev",
                "ShortName"               => "Test",
                "LongName"                => "Test Instrument",
                "IncludeMetaDataFields"   => "true",
            ],
            "Elements" => [
                [
                    'Type'        => 'ElementGroup',
                    'GroupType'   => 'Page',
                    'Elements'    => [
                        [
                            "Type"        => "date",
                            "Name"        => "Date_taken",
                            "Description" => "Date of Administration",
                            "Options"     => [
                                "MinDate" => "2006-01-01",
                                "MaxDate" => "2012-12-31"
                            ]
                        ],
                        [
                            "Type"        => "select",
                            "Name"        => "Examiner",
                            "Description" => "Examiner",
                            "Options"     => [
                                "Values"          => [
                                    "" => ""
                                ],
                                "AllowMultiple"   => false,
                                "RequireResponse" => false
                            ]
                        ],
                        [
                            'Type'        => "header",
                            "Description" => "Page 1"
                        ]
                    ],
                    'Description' => 'Top'
                ],
                [
                    'Type'        => 'ElementGroup',
                    'GroupType'   => 'Page',
                    'Elements'    => [
                        [
                            'Type'        => "header",
                            "Description" => "Page 2"
                        ]
                    ],
                    'Description' => 'Page 2'
                ]
            ]
        ];
        $this->assertEquals($ExpectedMeta, $outArray);
    }
}

