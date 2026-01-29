<?php declare(strict_types=1);

/**
 * Unit test for Candidate class
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  Main
 * @author   Karolina Marasinska <karolina.marasinska@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../../php/libraries/Utility.class.inc';
use PHPUnit\Framework\TestCase;
use LORIS\Database\Query;
use PHPUnit\Framework\Attributes\DataProvider;

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
        ['CandidateID' => '100001',
            'CohortID'      => '2',
            'Current_stage' => 'Not Started'
        ],
        ['CandidateID' => '100003',
            'CohortID'      => '4',
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
     * @var \NDB_Config&PHPUnit\Framework\MockObject\MockObject
     */
    private $_configMock;
    /**
     * Test double for Database object
     *
     * @var \Database&PHPUnit\Framework\MockObject\MockObject
     */
    private $_dbMock;

    /**
     * A mock NDB_Config variable used to set up a mock DB
     *
     * @note Used in the _setMockDB function
     *
     * @var \NDB_Config | PHPUnit\Framework\MockObject\MockObject
     */
    private $_mockConfig;
    /**
     * A mock Database variable
     *
     * @note Used in the _setMockDB function
     *
     * @var \Database | PHPUnit\Framework\MockObject\MockObject
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

        $configMock = $this->getMockBuilder('NDB_Config')->getMock();
        '@phan-var \NDB_Config $configMock';
        $this->_configMock = $configMock;
        $this->_dbMock     = $this->getMockBuilder('Database')->getMock();

        $mock = $this->_dbMock;
        '@phan-var \Database $mock';

        $this->_factory = NDB_Factory::singleton();
        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($mock);
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
     * Test that getConsentList() returns a list from the database
     *
     * @covers Utility::getConsentList
     * @return void
     */
    public function testGetConsentList()
    {
        $this->_dbMock->expects($this->anything())
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
        $this->_dbMock->expects($this->anything())
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
     * Test that getCohortList() returns a list of cohorts from the database
     *
     * @covers Utility::getCohortList
     * @return void
     */
    public function testGetCohortList(): void
    {
        $cohortRows = [
            ['CohortID' => '1', 'title' => 'cohort1'],
            ['CohortID' => '2', 'title' => 'cohort2']
        ];

        $queryMock = $this->createMock(\LORIS\Database\Query::class);
        $queryMock->method('getIterator')->willReturn(
            new \ArrayIterator($cohortRows)
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->willReturn($queryMock);

        $this->assertEquals(
            [
                '1' => 'cohort1',
                '2' => 'cohort2'
            ],
            Utility::getCohortList()
        );
    }

    /**
     * Test that getCohortList() returns the correct cohort
     * when a ProjectID is specified
     *
     * @covers Utility::getCohortList
     * @return void
     */
    public function testGetCohortListWithProjectID(): void
    {
        $cohortRows = [
            ['CohortID' => '123', 'title' => 'DemoProject']
        ];

        // Mock a Query object that is iterable
        $queryMock = $this->createMock(\LORIS\Database\Query::class);
        $queryMock->method('getIterator')->willReturn(
            new \ArrayIterator($cohortRows)
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->with($this->stringContains("JOIN project_cohort_rel USING (CohortID)"))
            ->willReturn($queryMock);

        $this->assertEquals(
            ['123' => 'DemoProject'],
            Utility::getCohortList(new ProjectID("123"))
        );
    }

    /**
     * Test that getCohortsForProject calls getCohortList and
     * returns the same information as the test above
     *
     * @return void
     * @covers Utility::getCohortsForProject
     */
    public function testGetCohortsForProject(): void
    {
        $cohortRows = [
            ['CohortID' => '123', 'title' => 'DemoProject']
        ];

        // Create a Query mock that is iterable
        $queryMock = $this->createMock(\LORIS\Database\Query::class);
        $queryMock->method('getIterator')->willReturn(
            new \ArrayIterator($cohortRows)
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->with($this->stringContains("JOIN project_cohort_rel USING (CohortID)"))
            ->willReturn($queryMock);

        $this->assertEquals(
            ['123' => 'DemoProject'],
            Utility::getCohortsForProject(new \ProjectID("123"))
        );
    }

    /**
     * Test that getCohortsForProject returns an empty array
     * if no project ID is given
     *
     * @return void
     * @covers Utility::getCohortsForProject
     */
    public function testGetCohortsForProjectWithoutID()
    {
        $this->assertEquals(
            [],
            Utility::getCohortsForProject()
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
        $testNameInfo = [
            ['Test_name' => 'test1', 'Full_name' => 'description1'],
            ['Test_name' => 'test2', 'Full_name' => 'description2']
        ];

        // Create a Query mock that iterates over $testNameInfo
        $queryMock = $this->createMock(\LORIS\Database\Query::class);
        $queryMock->method('getIterator')->willReturn(
            new \ArrayIterator($testNameInfo)
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->willReturn($queryMock);

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
        $test_battery = [
            [
                'Test_name' => 'test_name2',
                'Full_name' => 'full_name2'
            ]
        ];

        // Mock a Query object that returns our test array
        $queryMock = $this->createMock(\LORIS\Database\Query::class);
        $queryMock->method('getIterator')->willReturn(
            new \ArrayIterator($test_battery)
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->willReturn($queryMock);

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
    public function testGetDirectInstruments(): void
    {
        // Mock Query
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Make the Query iterable
        $queryMock->method('getIterator')->willReturn(
            new \ArrayIterator(
                [
                    [
                        'Test_name'     => 'test1',
                        'Full_name'     => 'description1',
                        'isDirectEntry' => 1,
                    ],
                ]
            )
        );

        // Mock DB to return the Query mock
        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->willReturn($queryMock);

        // Assert
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
    public function testGetSiteList(): void
    {
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->getMock();

        $queryMock->method('getIterator')->willReturn(
            new \ArrayIterator(
                [
                    ['CenterID' => '1', 'Name' => 'site1'],
                    ['CenterID' => '2', 'Name' => 'site2'],
                ]
            )
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->willReturn($queryMock);

        $this->assertEquals(
            [
                '1' => 'site1',
                '2' => 'site2',
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
    public function testGetStageUsingCandID(): void
    {
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->getMock();

        $queryMock->method('getFirstRow')->willReturn(
            [
                'Current_stage' => 'Not Started',
            ]
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->willReturn($queryMock);

        $this->assertEquals(
            'Not Started',
            Utility::getStageUsingCandID(
                new \Loris\StudyEntities\Candidate\CandID('100001')
            )
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
    public function testGetVisitList(): void
    {
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Make it iterable
        $queryMock->method('getIterator')->willReturn(
            new \ArrayIterator(
                [
                    [
                        'Visit_label' => 'VL1',
                        'CandidateID' => '100001',
                        'CenterID'    => '2',
                        'Active'      => 'Y',
                    ],
                    [
                        'Visit_label' => 'VL2',
                        'CandidateID' => '100003',
                        'CenterID'    => '4',
                        'Active'      => 'Y',
                    ],
                ]
            )
        );

        // Mock DB to return the Query mock
        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->willReturn($queryMock);

        // Assert
        $this->assertEquals(
            [
                'VL1' => 'VL1',
                'VL2' => 'VL2',
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
    public function testGetVisitListWithProjectID(): void
    {
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Make the Query iterable: return rows via ArrayIterator
        $queryMock->method('getIterator')->willReturn(
            new \ArrayIterator(
                [
                    [
                        'Visit_label' => 'VL1',
                        'CandidateID' => '123456',
                        'CenterID'    => '1234567890',
                        'Active'      => 'Y',
                    ]
                ]
            )
        );

        // Mock DB so pselect() returns the Query mock
        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->with(
                $this->stringContains(
                    "AND (s.ProjectID IS NULL OR s.ProjectID=:ProjectID)"
                )
            )
            ->willReturn($queryMock);

        // Call method under test
        $this->assertEquals(
            ['VL1' => 'VL1'],
            Utility::getVisitList(new \ProjectID("1"))
        );
    }

    /**
     * Test that getLanguageList returns the proper information
     * from the language table
     *
     * @covers Utility::getLanguageList
     * @return void
     */
    public function testGetLanguageList(): void
    {
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->getMock();

        // getIterator() returns rows as ArrayIterator
        $queryMock->method('getIterator')->willReturn(
            new ArrayIterator(
                [
                    ['language_id' => '1', 'language_label' => 'LA1'],
                    ['language_id' => '2', 'language_label' => 'LA2']
                ]
            )
        );

        // Mock DB to return the Query mock
        $this->_dbMock->method('pselect')->willReturn($queryMock);

        // Call the method under test
        $this->assertEquals(
            ['1' => 'LA1', '2' => 'LA2'],
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

        $this->_dbMock->expects($this->anything())
            ->method('pselectColWithIndexKey')
            ->willReturn(
                [
                    'name1' => 'display1'
                ]
            );

        $this->assertEquals(
            ['name1' => 'display1'
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
    public function testLookupBattery(): void
    {
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getIterator'])
            ->getMock();

        $queryMock->method('getIterator')->willReturn(
            new ArrayIterator(
                [
                    ['Test_name' => 'test1'],
                    ['Test_name' => 'test2']
                ]
            )
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->willReturn($queryMock);

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
    public function testLookupBatteryWithStage(): void
    {
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getIterator'])
            ->getMock();

        $queryMock->method('getIterator')->willReturn(
            new ArrayIterator(
                [
                    [
                        'Test_name' => 'test1',
                        'Stage'     => 'stage1'
                    ]
                ]
            )
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->with($this->stringContains(" AND b.Stage=:BatStage"))
            ->willReturn($queryMock);

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
    public function testGetSourcefieldsWithInstrumentSpecified(): void
    {
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getIterator'])
            ->getMock();

        $queryMock->method('getIterator')->willReturn(
            new ArrayIterator(
                [
                    [
                        'SourceField' => 'instrument_field',
                        'Name'        => 'instrument_name'
                    ]
                ]
            )
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->with($this->stringContains("AND sourcefrom = :sf"))
            ->willReturn($queryMock);

        $this->assertEquals(
            [
                [
                    'SourceField' => 'instrument_field',
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
    public function testGetSourcefieldsWithCommentIDSpecified(): void
    {
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->onlyMethods(['getIterator'])
            ->getMock();

        $queryMock->method('getIterator')->willReturn(
            new ArrayIterator(
                [
                    [
                        'SourceField' => 'commentID_field',
                        'Name'        => 'commentID_name'
                    ]
                ]
            )
        );

        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->willReturn($queryMock);

        $this->assertEquals(
            [
                [
                    'SourceField' => 'commentID_field',
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
        $this->_dbMock->expects($this->anything())
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
        // Create a fake Query object
        $queryMock = $this->getMockBuilder(\LORIS\Database\Query::class)
            ->disableOriginalConstructor()
            ->getMock();

        // Make the Query iterable so Utility::getSourcefields() can consume it
        $queryMock->method('getIterator')->willReturn(
            new ArrayIterator(
                [
                    [
                        'SourceField' => 'instrument_field',
                        'Name'        => 'instrument_name',
                    ]
                ]
            )
        );

        // Make pselect() return the fake Query
        $this->_dbMock->expects($this->anything())
            ->method('pselect')
            ->with($this->stringContains("AND sourcefrom = :sf"))
            ->willReturn($queryMock);

        $this->assertEquals(
            [
                [
                    'SourceField' => 'instrument_field',
                    'Name'        => 'instrument_name',
                ]
            ],
            Utility::getSourcefields('instrument1', '1', 'name')
        );
    }

    /**
     * Test that valueIsPositiveInteger returns false for values
     * that are not positive integers
     *
     * @param mixed $notInt The value to test
     *
     * @return void
     */
    #[DataProvider('notPositiveIntegerValues')]
    public function testValueIsPositiveIntegerReturnsFalse(mixed $notInt): void
    {
        $this->assertFalse(\Utility::valueIsPositiveInteger($notInt));
    }

    /**
     * Test that valueIsPositiveInteger returns true for positive integers
     *
     * @return iterable<array{0:mixed}> List of non-positive integer values
     */
    public static function notPositiveIntegerValues(): iterable
    {
        yield [-1];
        yield [0];
        yield [3.14];
        yield ['abcdefg'];
        yield ['-1'];
        yield ['-98.6'];
        yield ['0'];
        yield [[]];
        yield [[1]];
        yield [null];
        yield [new \stdClass()];
    }

    /**
     * Test that valueIsPositiveInteger returns true for positive integers
     *
     * @param int $int The positive integer value to test
     *
     * @return void
     */
    #[DataProvider('positiveIntegerValues')]
    public function testValueIsPositiveIntegerReturnsTrue(int $int): void
    {
        $this->assertTrue(\Utility::valueIsPositiveInteger($int));
    }

    /**
     * Data provider for testValueIsPositiveIntegerReturnsTrue
     *
     * Provides positive integer values
     *
     * @return iterable<array{0:int}>
     */
    public static function positiveIntegerValues(): iterable
    {
        yield [1];
        yield [5];
        yield [100];
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

        $config = $this->getMockBuilder("\NDB_Config")->getMock();
        $config->expects($this->anything())
            ->method('getSetting')
            ->willReturn('Y-m-d H:i:s');
        '@phan-var \NDB_Config $config';

        $this->_mockFactory->setConfig($config);

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
    public function testGetScanTypeList(): void
    {
        $queryMock = $this->createMock(Query::class);

        $queryMock->method('getIterator')->willReturn(
            new \ArrayIterator(
                [
                    ['MriScanTypeID' => 123, 'MriScanTypeName' => 'scan 1'],
                    ['MriScanTypeID' => 234, 'MriScanTypeName' => 'scan 2']
                ]
            )
        );

        $this->_dbMock->expects($this->once())
            ->method('pselect')
            ->with(
                $this->stringContains("JOIN files USING (MriScanTypeID)")
            )
            ->willReturn($queryMock);

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
        $this->_mockConfig = $this->_mockFactory->Config(CONFIG_XML);
        $database          = $this->_mockConfig->getSetting('database');
        $this->_mockDB     = $this->_mockFactory->database(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            true
        );

        $this->_mockFactory->setDatabase($this->_mockDB);
        $this->_mockFactory->setConfig($this->_mockConfig);
    }
}
