<?php declare(strict_types=1);
/**
 * Unit test for Candidate class
 *
 * PHP Version 5
 *
 * @category Tests
 * @package  Main
 * @author   Karolina Marasinska <karolina.marasinska@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../../php/libraries/Utility.class.inc';
use PHPUnit\Framework\TestCase;
/**
 * Unit tests for Utility class.
 *
 * @category Tests
 * @package  Test
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 *           John Saigle <john.saigle@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UtilityTest extends TestCase
{
    /**
     * Consent information
     *
     * @var array contains consent information retrieved
     *      by the getConsentList method
     */
    private $_consentInfo = [
        ['ConsentID' => '1',
            'Name'      => 'Bob',
            'Label'     => '2'
        ],
        ['ConsentID' => '2',
            'Name'      => 'Anne',
            'Label'     => '3'
        ],
        ['ConsentID' => '3',
            'Name'      => 'Luke',
            'Label'     => '4'
        ]
    ];
    /**
     * Project information
     *
     * @var array contains project information retrieved by getProjectList method
     */
    private $_projectInfo = [
        '12' => 'project1',
        '23' => 'project2'
    ];

    /**
     * Test_name table information
     *
     * @var array contains test_name information
     *      retrieved by getAllInstruments method
     */
    private $_testNameInfo = [
        ['ID' => '1',
            'Test_name'     => 'test1',
            'Full_name'     => 'description1',
            'IsDirectEntry' => 1
        ],
        ['ID' => '2',
            'Test_name'     => 'test2',
            'Full_name'     => 'description2',
            'IsDirectEntry' => 0
        ]
    ];
    /**
     * Psc table information
     *
     * @var array contains psc information retrieved by getSiteList method
     */
    private $_siteInfo = [
        ['CenterID' => '1',
            'Name'     => 'site1'
        ],
        ['CenterID' => '2',
            'Name'     => 'site2'
        ]
    ];
    /**
     * Session table information
     *
     * @var array contains session information retrieved
     *      by getStageUsingCandID method
     */
    private $_sessionInfo = [
        ['CandID' => '1',
            'SubprojectID'  => '2',
            'Current_stage' => 'Not Started'
        ],
        ['CandID' => '3',
            'SubprojectID'  => '4',
            'Current_stage' => 'Approval'
        ]
    ];
    /**
     * Language table information
     *
     * @var array contains language information retrieved by getLanguageList method
     */
    private $_languageInfo = [
        ['language_id' => '1',
            'language_label' => 'LA1'
        ],
        ['language_id' => '2',
            'language_label' => 'LA2'
        ]
    ];
    /**
     * NDB_Factory used in tests.
     * Test doubles are injected to the factory object.
     *
     * @var NDB_Factory
     */
    private $_factory;
    /**
     * Test double for NDB_Config object
     *
     * @var \NDB_Config | PHPUnit_Framework_MockObject_MockObject
     */
    private $_configMock;
    /**
     * Test double for Database object
     *
     * @var \Database | PHPUnit_Framework_MockObject_MockObject
     */
    private $_dbMock;

    /**
     * A mock NDB_Config variable used to set up a mock DB
     *
     * @note Used in the _setMockDB function
     *
     * @var \NDB_Config | PHPUnit_Framework_MockObject_MockObject
     */
    private $_mockConfig;
    /**
     * A mock Database variable
     *
     * @note Used in the _setMockDB function
     *
     * @var \Database | PHPUnit_Framework_MockObject_MockObject
     */
    private $_mockDB;
    /**
     * A mock Database variable
     *
     * @note Used in the _setMockDB function
     *
     * @var NDB_Factory
     */
    private $_mockFactory;

    /**
     * This method is called before each test
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->_configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $this->_dbMock     = $this->getMockBuilder('Database')->getMock();

        $this->_factory = NDB_Factory::singleton();
        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($this->_dbMock);
    }

    /**
     * Tears down the fixture, for example, close a network connection
     * This method is called after a test is executed
     *
     * @return void
     */
    protected function tearDown(): void
    {
        parent::tearDown();
        $this->_factory->reset();
    }

    /**
     * Test that calculateAge returns the proper age
     *
     * @covers Utility::calculateAge
     * @return void
     */
    public function testCalculateAge()
    {
        $array = Utility::calculateAge("1998-08-25", "2019-06-11");
        $this->assertEquals($array['year'], 20);
        $this->assertEquals($array['mon'], 9);
        $this->assertEquals($array['day'], 16);
    }

    /**
     * Test that the calculateAge() method fails
     * when the dates have the incorrect format
     *
     * @param string $first  string with the badly formatted date of birth
     * @param string $second string with the badly formatted current date
     *
     * @dataProvider ageIncorrectFormatProvider
     * @covers       Utility::calculateAge
     *
     * @return void
     */
    public function testCalculateAgeFormat($first, $second)
    {
        $this->expectException('\LorisException');
        $array = Utility::calculateAge($first, $second);
    }

    /**
     * Data provider for testCalculateAgeFormat
     *
     * @return array
     */
    public function ageIncorrectFormatProvider()
    {
        return [
            ["1990\\07\\05", "2018\\05\\23"],
            ["1990", "2018"],
            ["1990_07_05", "2019_09_65"],
            [" ", " "],
        ];
    }

    /**
     * Test that getConsentList() returns a list from the database
     *
     * @covers Utility::getConsentList
     * @return void
     */
    public function testGetConsentList()
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselectWithIndexKey')
            ->willReturn($this->_consentInfo);
        $this->assertEquals($this->_consentInfo, Utility::getConsentList());
    }

    /**
     * Test that getProjectList() returns a list from the database
     *
     * @covers Utility::getProjectList
     * @return void
     */
    public function testGetProjectList()
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselectColWithIndexKey')
            ->willReturn($this->_projectInfo);
        $this->assertEquals(
            Utility::getProjectList(),
            [
                '12' => 'project1',
                '23' => 'project2'
            ]
        );
    }

    /**
     * Test that getSubprojectList() returns a list of subprojects from the database
     *
     * @covers Utility::getSubprojectList
     * @return void
     */
    public function testGetSubprojectList()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                [
                    ['SubprojectID' => '1',
                        'title'        => 'subproject1'
                    ],
                    ['SubprojectID' => '2',
                        'title'        => 'subproject2'
                    ]
                ]
            );

        $this->assertEquals(
            ['1' => 'subproject1',
                '2' => 'subproject2'
            ],
            Utility::getSubprojectList()
        );
    }

    /**
     * Test that getSubprojectList() returns the correct subproject
     * when a ProjectID is specified
     *
     * @covers Utility::getSubprojectList
     * @return void
     */
    public function testGetSubprojectListWithProjectID()
    {
        /**
         * The 'with' assertion is included to check that the mySQL query changes
         * when a ProjectID is specified
         */
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->with(
                $this->stringContains(
                    "JOIN project_subproject_rel USING (SubprojectID)"
                )
            )
            ->willReturn(
                [
                    ['SubprojectID' => '123',
                        'title'        => 'DemoProject'
                    ]
                ]
            );

        $this->assertEquals(
            ['123' => 'DemoProject'],
            Utility::getSubprojectList(123)
        );
    }

    /**
     * Test that getSubprojectsForProject calls getSubprojectList and
     * returns the same information as the test above
     *
     * @return void
     * @covers Utility::getSubprojectsForProject
     */
    public function testGetSubprojectsForProject()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->with(
                $this->stringContains(
                    "JOIN project_subproject_rel USING (SubprojectID)"
                )
            )
            ->willReturn(
                [
                    ['SubprojectID' => '123',
                        'title'        => 'DemoProject'
                    ]
                ]
            );

        $this->assertEquals(
            ['123' => 'DemoProject'],
            Utility::getSubprojectsForProject(123)
        );
    }

    /**
     * Test that getSubprojectsForProject returns an empty array
     * if no project ID is given
     *
     * @return void
     * @covers Utility::getSubprojectsForProject
     */
    public function testGetSubprojectsForProjectWithoutID()
    {
        $this->assertEquals(
            [],
            Utility::getSubprojectsForProject()
        );
    }

    /**
     * Test that getAllInstruments() returns the proper information
     *
     * @covers Utility::getAllInstruments
     * @return void
     */
    public function testGetInstruments()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_testNameInfo);

        $this->assertEquals(
            [
                'test1' => 'description1',
                'test2' => 'description2'
            ],
            Utility::getAllInstruments()
        );
    }

    /**
     * Test that getAllDDEInstruments() returns the proper information
     *
     * @covers Utility::getAllDDEInstruments
     * @return void
     */
    public function testGetAllDDEInstruments()
    {
        $test_names = [
            ['Test_name' => 'test_name1',
                'Full_name' => 'full_name1'
            ],
            ['Test_name' => 'test_name2',
                'Full_name' => 'full_name2'
            ]
        ];
        $doubleDataEntryInstruments = ['test_name2'];

        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($test_names);
        $this->_configMock->expects($this->any())
            ->method('getSetting')
            ->willReturn($doubleDataEntryInstruments);

        $this->assertEquals(
            ['test_name2' => 'full_name2'],
            Utility::getAllDDEInstruments()
        );
    }

    /**
     * Test that getDirectInstruments() returns tests with isDirectEntry=true
     *
     * @covers Utility::getDirectInstruments
     * @return void
     */
    public function testGetDirectInstruments()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                [
                    ['Test_name' => 'test1',
                        'Full_name'     => 'description1',
                        'isDirectEntry' => 1
                    ]
                ]
            );

        $this->assertEquals(
            ['test1' => 'description1'],
            Utility::getDirectInstruments()
        );
    }

    /**
     * Test that getSiteList() returns the correct list from the database
     *
     * @note I am testing both methods in the same test because
     *       unless the study_site or DCC parameters are specified
     *       they have the same fuctionality
     * TODO Potential edge cases: test with the study_site and DCC booleans as false
     *
     * @covers Utility::getSiteList
     * @return void
     */
    public function testGetSiteList()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_siteInfo);

        $this->assertEquals(
            [
                '1' => 'site1',
                '2' => 'site2'
            ],
            Utility::getSiteList()
        );
    }

    /**
     * Test that getStageUsingCandID returns the proper
     * current stage for the given CandID
     *
     * @covers Utility::getStageUsingCandID
     * @return void
     */
    public function testGetStageUsingCandID()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_sessionInfo);

        $this->assertEquals(
            'Not Started',
            Utility::getStageUsingCandID('1')
        );
    }

    /**
     * Test that getSubprojectIDUsingCandID() returns
     * the correct SubprojectID given the CandID
     *
     * @covers Utility::getSubprojectIDUsingCandID
     * @return void
     */
    public function testGetSubprojectIDUsingCandID()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_sessionInfo);

        $this->assertEquals(
            '2',
            Utility::getSubprojectIDUsingCandID('1')
        );
    }

    /**
     * Test that getVisitList returns a list of visit labels
     * This is the simplest case of this function
     * TODO Potential edge cases: Set 'Active' to 'N'
     *
     * @covers Utility::getVisitList
     * @return void
     */
    public function testGetVisitList()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                [
                    ['Visit_label' => 'VL1',
                        'CandID'      => '1',
                        'CenterID'    => '2',
                        'Active'      => 'Y'
                    ],
                    ['Visit_label' => 'VL2',
                        'CandID'      => '3',
                        'CenterID'    => '4',
                        'Active'      => 'Y'
                    ]
                ]
            );

        $this->assertEquals(
            ['VL1' => 'VL1',
                'VL2' => 'VL2'
            ],
            Utility::getVisitList()
        );
    }

    /**
     * Test that getVisitList returns only
     * visit labels related to the given project ID
     *
     * @covers Utility::getVisitList
     * @return void
     */
    public function testGetVisitListWithProjectID()
    {
        /**
         * The 'with' assertion is included to ensure that the mySQL query changes
         * to include the ProjectID parameter if the ProjectID is specified
         */
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->with(
                $this->stringContains(
                    "AND (s.ProjectID IS NULL OR s.ProjectID=:ProjectID)"
                )
            )
            ->willReturn(
                [
                    ['Visit_label' => 'VL1',
                        'CandID'      => '123456',
                        'CenterID'    => '1234567890',
                        'Active'      => 'Y'
                    ]
                ]
            );

        $this->assertEquals(
            ['VL1' => 'VL1'],
            Utility::getVisitList(1)
        );
    }

    /**
     * Test that getLanguageList returns the proper information
     * from the language table
     *
     * @covers Utility::getLanguageList
     * @return void
     */
    public function testGetLanguageList()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_languageInfo);

        $this->assertEquals(
            ['1' => 'LA1',
                '2' => 'LA2'
            ],
            Utility::getLanguageList()
        );
    }

    /**
     * Test that getVisitInstruments() returns the correct
     * information for the given visit label
     *
     * @covers Utility::getVisitInstruments
     * @return void
     */
    public function testGetVisitInstruments()
    {

        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                [
                    ['Test_name_display' => 'display1',
                        'TestName'          => 'name1',
                        'Visit_label'       => 'V1'
                    ]
                ]
            );

        $this->assertEquals(
            [0 => ['Test_name_display' => 'display1',
                'TestName'          => 'name1',
                'Visit_label'       => 'V1'
            ]
            ],
            Utility::getVisitInstruments('V1')
        );
    }

    /**
     * Test an edge case of getVisitInstruments() where there is no
     * 'Test_name_display' column in the given table
     *
     * @covers Utility::getVisitInstruments
     * @return void
     */
    public function testGetVisitInstrumentsWithoutTestNameDisplay()
    {

        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                [
                    ['Full_name' => 'display1',
                        'TestName'    => 'name1',
                        'Visit_label' => 'V1'
                    ]
                ]
            );

        $this->assertEquals(
            [0 => ['Full_name' => 'display1',
                'TestName'    => 'name1',
                'Visit_label' => 'V1'
            ]
            ],
            Utility::getVisitInstruments('V1')
        );
    }

    /**
     * Test that lookupBattery returns the correct information
     * without the stage specified
     *
     * @covers Utility::lookupBattery
     * @return void
     */
    public function testLookupBattery()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                [
                    ['Test_name' => 'test1'],
                    ['Test_name' => 'test2']
                ]
            );

        $this->assertEquals(
            ['test1', 'test2'],
            Utility::lookupBattery(25)
        );

    }

    /**
     * Test that lookupBattery returns the correct information
     * with the stage specified
     *
     * @covers Utility::lookupBattery
     * @return void
     */
    public function testLookupBatteryWithStage()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->with($this->stringContains(" AND b.Stage=:BatStage"))
            ->willReturn(
                [
                    ['Test_name' => 'test1',
                        'Stage'     => 'stage1'
                    ]
                ]
            );

        $this->assertEquals(
            ['test1'],
            Utility::lookupBattery(25, 'stage1')
        );

    }

    /**
     * Test that associativeToNumericArray correctly converts
     * an array to numeric form
     *
     * @return void
     * @covers Utility::associativeToNumericArray
     */
    public function testAssociativeToNumericArray()
    {
        $associative = ['Test_name' => 'test1',
            'Stage'     => 'stage1'
        ];
        $this->assertEquals(
            [0 => $associative],
            Utility::associativeToNumericArray($associative)
        );
    }

    /**
     * Test that associativeToNumericArray returns the same array
     * if given a numeric array
     *
     * @return void
     * @covers Utility::associativeToNumericArray
     */
    public function testAssociativeToNumericArrayWithNumericArray()
    {
        $associative = [0 => ['Test_name' => 'test1',
            'Stage'     => 'stage1'
        ]
        ];
        $this->assertEquals(
            $associative,
            Utility::associativeToNumericArray($associative)
        );
    }

    /**
     * Test that asArray returns the given variable in array form
     *
     * @covers Utility::asArray
     * @return void
     */
    public function testAsArray()
    {
        $var = "Test";
        $this->assertEquals([$var], Utility::asArray($var));
    }

    /**
     * Test that nullifyEmpty changes an empty string to null
     *
     * @covers Utility::nullifyEmpty
     * @return void
     */
    public function testNullifyEmpty()
    {
        $var = ['ID' => '123', 'Name' => ''];
        $this->assertEquals(
            ['ID' => '123', 'Name' => null],
            Utility::nullifyEmpty($var, "Name")
        );
    }

    /**
     * Test that asArray returns the given variable as is if it
     * is already an array
     *
     * @covers Utility::asArray
     * @return void
     */
    public function testAsArrayWithArrayGiven()
    {
        $var = ["Test"];
        $this->assertEquals($var, Utility::asArray($var));
    }

    /**
     * Tests that getSourcefields will return an empty array
     * if no parameters are specified
     *
     * @covers Utility::getSourcefields
     * @return void
     */
    public function testGetSourcefieldsReturnsNothingWithNoParameters()
    {
        $this->assertEquals(
            [],
            Utility::getSourcefields()
        );
    }

    /**
     * Test that getSourcefields returns the correct information
     * and uses the correct query when the instrument parameter is specified
     *
     * @covers Utility::getSourcefields
     * @return void
     */
    public function testGetSourcefieldsWithInstrumentSpecified()
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselect')
            ->with($this->stringContains("AND sourcefrom = :sf"))
            ->willReturn(
                [
                    ['SourceField' => 'instrument_field',
                        'Name'        => 'instrument_name'
                    ]
                ]
            );

        $this->assertEquals(
            [0 => ['SourceField' => 'instrument_field',
                'Name'        => 'instrument_name'
            ]
            ],
            Utility::getSourcefields('instrument1', null, null)
        );
    }

    /**
     * Test that getSourcefields returns the correct information
     * and uses the correct query when the commentID parameter is specified
     *
     * @covers Utility::getSourcefields
     * @return void
     */
    public function testGetSourcefieldsWithCommentIDSpecified()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                [
                    ['SourceField' => 'commentID_field',
                        'Name'        => 'commentID_name'
                    ]
                ]
            );

        $this->assertEquals(
            [0 => ['SourceField' => 'commentID_field',
                'Name'        => 'commentID_name'
            ]
            ],
            Utility::getSourcefields(null, '1', null)
        );
    }

    /**
     * Test that getSourcefields returns the correct information
     * and uses the correct query when the name parameter is specified
     *
     * @covers Utility::getSourcefields
     * @return void
     */
    public function testGetSourcefieldsWithNameSpecified()
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselectRow')
            ->willReturn(
                [
                    ['SourceField' => 'name_field',
                        'Name'        => 'name_name'
                    ]
                ]
            );

        $this->assertEquals(
            [0 => ['SourceField' => 'name_field',
                'Name'        => 'name_name'
            ]
            ],
            Utility::getSourcefields(null, null, 'name_name')
        );
    }

    /**
     * Test an edge case of getSourcefields where all three parameters are specified
     * In this case, it should only use the instrument parameter
     *
     * @covers Utility::getSourcefields
     * @return void
     */
    public function testGetSourcefieldsWithAllThreeParameters()
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselect')
            ->with($this->stringContains("AND sourcefrom = :sf"))
            ->willReturn(
                [
                    ['SourceField' => 'instrument_field',
                        'Name'        => 'instrument_name'
                    ]
                ]
            );

        $this->assertEquals(
            [0 => ['SourceField' => 'instrument_field',
                'Name'        => 'instrument_name'
            ]
            ],
            Utility::getSourcefields('instrument1', '1', 'name')
        );
    }

    /**
     * DataProvider for function testValueIsPositiveIntegerReturnsFalse
     *
     * @return array
     */
    public function notPositiveIntegerValues(): array
    {
        return [
            [-1],
            [0],
            [3.14],
            ['abcdefg'],
            ['-1'],
            ['-98.6'],
            ['0'],
            [[]],
            [[1]],
            [null],
            [new stdClass()]
        ];
    }

    /**
     * DataProvider for function testValueIsPositiveIntegerReturnsTrue
     *
     * @return array
     */
    public function positiveIntegerValues(): array
    {
        return [
            [1],
            [100],
            ['1000'],
        ];
    }

    /**
     * Test that valueIsPositiveInteger returns false if given negative ints
     * or values that are not integers
     *
     * @param $notInt from dataProvider
     *
     * @dataProvider notPositiveIntegerValues
     *
     * @covers Utility::valueIsPositiveInteger
     * @return void
     */
    public function testValueIsPositiveIntegerReturnsFalse($notInt): void
    {
        $this->assertFalse(\Utility::valueIsPositiveInteger($notInt));
    }

    /**
     * Test that valueIsPositiveInteger returns true when given positive ints
     *
     * @param $int from dataProvider
     *
     * @dataProvider positiveIntegerValues
     *
     * @covers Utility::valueIsPositiveInteger
     * @return void
     */
    public function testValueIsPositiveIntegerReturnsTrue($int): void
    {
        $this->assertTrue(\Utility::valueIsPositiveInteger($int));
    }

    /**
     * Tests the
     * n function. Test cases adapted from blog post on
     * Python's os.path.join as this function is meant to give the same
     * behaviour.
     *
     * @see https://www.geeksforgeeks.org/python-os-path-join-method/
     *
     * @covers Utility::pathJoin
     * @return void
     */
    public function testPathJoin(): void
    {
        $expected = 'a/b/c';

        $this->assertEquals(
            \Utility::pathJoin('a', 'b', 'c'),
            $expected
        );
        $this->assertEquals(
            \Utility::pathJoin('a', 'b/c'),
            $expected
        );
        $this->assertEquals(
            \Utility::pathJoin('a/b', 'c'),
            $expected
        );
        $this->assertEquals(
            \Utility::pathJoin('a/b', '/c'),
            $expected
        );

        // Check leading front-slash
        $this->assertEquals(
            \Utility::pathJoin('/a', '/b/c'),
            '/a/b/c'
        );
    }

    /**
     * Test that columnsHasNull returns true if the specified column
     * in the table has a null entry
     *
     * @covers Utility::columnsHasNull
     * @return void
     */
    public function testColumnsHasNullTrue()
    {
        $this->_setMockDB();
        $this->_mockDB->run("DROP TEMPORARY TABLE IF EXISTS users");
        $tableData = [0 => ['ID' => 1,
            'UserID'    => '11111',
            'Real_name' => 'Some Name',
            'Email'     => 'email1'
        ],
            1 => ['ID' => 2,
                'UserID'    => '22222',
                'Real_name' => null,
                'Email'     => 'email2'
            ]
        ];
        $this->_mockDB->setFakeTableData("users", $tableData);
        $this->assertTrue(Utility::columnsHasNull("users", "Real_name"));
    }

    /**
     * Test that columnsHasNull returns false if the specified column
     * in the table does not have a null entry
     *
     * @covers Utility::columnsHasNull
     * @return void
     */
    public function testColumnsHasNullFalse()
    {
        $this->_setMockDB();
        $this->_mockDB->run("DROP TEMPORARY TABLE IF EXISTS users");
        $tableData = [0 => ['ID' => 1,
            'UserID'    => '11111',
            'Real_name' => 'Some Name',
            'Email'     => 'email1'
        ],
            1 => ['ID' => 2,
                'UserID'    => '22222',
                'Real_name' => 'Other Name',
                'Email'     => 'email2'
            ]
        ];
        $this->_mockDB->setFakeTableData("users", $tableData);
        $this->assertFalse(Utility::columnsHasNull("users", "Real_name"));
    }

    /**
     * Test that resolvePath removes instances of '..' and replaces
     * '//' with '/'
     *
     * @covers Utility::resolvePath
     * @return void
     */
    public function testResolvePath()
    {
        $path     = "..//..//php/libraries/Utility.class.inc";
        $expected = "php/libraries/Utility.class.inc";
        $this->assertEquals($expected, Utility::resolvePath($path));
    }

    /**
     * Test that getMaxUploadSize returns the correct value
     *
     * @covers Utility::getMaxUploadSize
     * @return void
     */
    public function testGetMaxUploadSize()
    {
        $umf = ini_get('upload_max_filesize');
        $pms = ini_get('post_max_size');
        $val = Utility::returnBytes($umf) < Utility::returnBytes($pms) ? $umf : $pms;
        $this->assertEquals($val, Utility::getMaxUploadSize());
    }

    /**
     * Test that returnBytes returns the correct value
     *
     * @covers Utility::returnBytes
     * @return void
     */
    public function testReturnBytes()
    {
        $this->assertEquals(64, Utility::returnBytes('64'));
        $this->assertEquals(65536, Utility::returnBytes('64K'));
        $this->assertEquals(2097152, Utility::returnBytes('2M'));
        $this->assertEquals(4294967296, Utility::returnBytes('4G'));
    }

    /**
     * Test that randomString returns a random string with the correct
     * length and with the correct characters specified
     *
     * @covers Utility::randomString
     * @return void
     */
    public function testRandomString()
    {
        $var = Utility::randomString(4, 'abcdefghijklmnopqrstuvwxyz');
        $this->assertEquals(4, strlen($var));
        $this->assertFalse(strpbrk($var, '1234567890'));
        $this->assertFalse(strpbrk($var, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'));
    }

    /**
     * Test that toDateDisplayFormat returns a properly formatted
     * date string
     *
     * @covers Utility::toDateDisplayFormat
     * @return void
     */
    public function testToDateDisplayFormat()
    {
        $this->_setMockDB();
        $date = "2000-01-01";
        $this->assertEquals(
            "2000-01-01 00:00:00",
            Utility::toDateDisplayFormat($date)
        );
    }

    /**
     * Test that toDateDisplayFormat throws a LorisException if
     * the string is badly formatted
     *
     * @covers Utility::toDateDisplayFormat
     * @return void
     */
    public function testToDateDisplayFormatThrowsException()
    {
        $this->_setMockDB();
        $date = "2000-01-";
        $this->expectException('\LorisException');
        Utility::toDateDisplayFormat($date);
    }

    /**
     * Test that getScanTypeList returns the scan type information
     * in the correct format
     *
     * @covers Utility::getScanTypeList
     * @return void
     */
    public function testGetScanTypeList()
    {
        $this->_dbMock->expects($this->once())->method('pselect')
            ->with(
                $this->stringContains(
                    "JOIN files f ON (f.AcquisitionProtocolID=mri.ID)"
                )
            )
            ->willReturn(
                [0 => ['ID' => 123,
                    'Scan_type' => 'scan 1'
                ],
                    1 => ['ID' => 234,
                        'Scan_type' => 'scan 2'
                    ]
                ]
            );
        $expected = [123 => 'scan 1', 234 => 'scan 2'];
        $this->assertEquals($expected, Utility::getScanTypeList());
    }

    /**
     * Test that appendForwardSlash appends a forward slash to the given path.
     * Also asserts that if the path already has a forward slash, it does nothing.
     *
     * @covers Utility::appendForwardSlash
     * @return void
     */
    public function testAppendForwardSlash()
    {
        $path          = "/php/libraries";
        $pathWithSlash = "/php/libraries/";
        $this->assertEquals(
            $pathWithSlash,
            Utility::appendForwardSlash($path)
        );
        $this->assertEquals(
            $pathWithSlash,
            Utility::appendForwardSlash($pathWithSlash)
        );
    }

    /**
     * Set up a mock database for some of the tests above
     *
     * @return void
     */
    private function _setMockDB()
    {
        $this->_mockFactory = \NDB_Factory::singleton();
        $this->_mockFactory->reset();
        $this->_mockFactory->setTesting(false);
        $this->_mockConfig = $this->_mockFactory->Config(CONFIG_XML);
        $database          = $this->_mockConfig->getSetting('database');
        $this->_mockDB     = \Database::singleton(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            true
        );
    }
}
