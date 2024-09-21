<?php
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
use PHPUnit\Framework\TestCase;
use LORIS\StudyEntities\Candidate\CandID;
/**
 * Unit test for Candidate class
 *
 * @category Tests
 * @package  Main
 * @author   Karolina Marasinska <karolina.marasinska@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class CandidateTest extends TestCase
{
    /**
     * Candidate Information as available in the Candidate object
     *
     * @var array contains _candidate info retrieved by the select method
     */
    private $_candidateInfo;

    /**
     * List of timepoints (visits) that a Candidate has registered
     *
     * @var array list of time points are retrieved in the select method
     */
    private $_listOfTimePoints = [];

    /**
     * Candidate object use in tests
     *
     * @var Candidate
     */
    private $_candidate;

    /**
     * NDB_Factory used in tests for methods that use the database
     *
     * @note This is setup and used in the _setUpMockDB() method
     * @var  NDB_Factory
     */
    private $_factoryForDB;

    /**
     * NDB_Config used in tests.
     *
     * @note This is setup and used in the _setUpMockDB() method
     * @var  \NDB_Config
     */
    private $_config;

    /**
     * Database used in tests
     *
     * @note This is setup and used in the _setUpMockDB() method
     * @var  \Database
     */
    private $_DB;

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
     * @var \NDB_Config | PHPUnit\Framework\MockObject\MockObject
     */
    private $_configMock;

    /**
     * Test double for Database object
     *
     * @phan-var \Database | PHPUnit\Framework\MockObject\MockObject
     */
    private $_dbMock;

    /**
     * Maps config names to values
     * Used to set behaviour of NDB_Config test double
     *
     * @var array config name => value
     */
    private $_configMap = [];

    private array $_listOfProjects;

    /**
     * Sets up fixtures:
     *  - _candidate object
     *  - config and Database test doubles
     *  - _factory
     *
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

        $this->_configMap = [
            ['HeaderTable', null]
        ];

        $this->_listOfTimePoints = [
            ['ID' => '97'],
            ['ID' => '98']
        ];

        $this->_listOfProjects = [
            ['ProjectID' => 1,
                'Name'      => 'testProject'
            ]
        ];

        $configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $dbMock     = $this->getMockBuilder('\Database')->getMock();

        '@phan-var \NDB_Config $configMock';
        '@phan-var \Database $dbMock';

        $this->_configMock = $configMock;
        $this->_dbMock     = $dbMock;

        $this->_factory = NDB_Factory::singleton();
        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($this->_dbMock);

        $this->_candidateInfo = [
            'RegistrationCenterID'  => 2,
            'CandID'                => new CandID('969664'),
            'PSCID'                 => 'AAA0011',
            'DoB'                   => '2007-03-02',
            'EDC'                   => null,
            'Sex'                   => 'Male',
            'PSC'                   => 'AAA',
            'Ethnicity'             => 'White',
            'Active'                => 'Y',
            'RegisteredBy'          => 'Admin Admin',
            'UserID'                => 'admin',
            'RegistrationProjectID' => 1,
            'ProjectTitle'          => '',
        ];
        $this->_candidate     = new Candidate();
    }

    /**
     * Tears down the fixture, for example, close a network connection.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown(): void
    {
        parent::tearDown();
        $this->_factory->reset();
    }

    /**
     * Test select() method retrieves all _candidate and related info
     *
     * @return void
     * @covers Candidate::select
     * @covers Candidate::getData
     * @covers Candidate::getListOfTimePoints
     */
    public function testSelectRetrievesCandidateInfo()
    {
        $this->_setUpTestDoublesForSelectCandidate();

        $resultMock = $this->getMockBuilder('\LORIS\Database\Query')
            ->disableOriginalConstructor()
            ->getMock();
        $resultMock->method("getIterator")
            ->willReturn(
                new ArrayIterator(
                    [
                        [
                            "ID"        => 97,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ],
                        [
                            "ID"        => 98,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ]
                    ]
                )
            );
        $this->_dbMock
            ->method('pselect')
            ->willReturn($resultMock);
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn($this->_candidateInfo);

        $this->_candidate->select($this->_candidateInfo['CandID']);

        //validate _candidate Info
        // candidateInfo is the value returned from the database, ->getData() has
        // typing
        //$this->assertEquals($this->_candidateInfo, $this->_candidate->getData());

        //validate list of time points
        $expectedTimepoints = [];
        foreach ($this->_listOfTimePoints as $oneRow) {
            $expectedTimepoints[] = $oneRow['ID'];
        }
        $this->assertEquals(
            $expectedTimepoints,
            $this->_candidate->getListOfTimePoints()
        );
    }

    /**
     * Test select() method fails when invalid _candidate ID is passed
     *
     * @return void
     * @covers Candidate::select
     * @throws LorisException
     */
    public function testsSelectFailsWhenInvalidCandidateIdPassed()
    {
        $this->expectException('DomainException');
        $this->_candidate->select(new CandID('88888'));
    }

    /**
     * Test setData method sets data when passing data as an array
     *
     * @return void
     * @covers Candidate::setData
     * @covers Candidate::getData
     */
    public function testSetDataWithArraySucceeds()
    {
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_candidate->select($this->_candidateInfo['CandID']);

        $data = ['Active' => 'N'];
        //assert update method is called with correct parameters
        $this->_dbMock->expects($this->once())
            ->method('update')
            ->with(
                'candidate',
                $data,
                ['CandID' => $this->_candidateInfo['CandID']]
            );

        $this->assertTrue($this->_candidate->setData($data));
        $this->assertEquals($data['Active'], $this->_candidate->getData('Active'));
    }

    /**
     * Test setData throws a LorisException when called with an empty array
     *
     * @covers Candidate::setData
     * @return void
     */
    public function testSetDataThrowsLorisException()
    {
        $this->expectException('\LorisException');

        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->_candidate->setData([]);
    }

    /**
     * Test getData returns the entire array of candidate information if no
     * variable is specified
     *
     * @covers Candidate::getData
     * @return void
     */
    /*
    public function testGetDataReturnsAllInformationIfGivenNull()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidateInfo,
            $this->_candidate->getData()
        );

        $this->assertTrue(
            $this->_candidate->setData(
                ['RegisteredBy' => 'TestUser']
            )
        );
    }
     */

    /**
     * Test getProjectID returns the correct ProjectID for the candidate
     *
     * @covers Candidate::getProjectID
     * @return void
     */
    public function testGetProjectID()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            \ProjectID::singleton($this->_candidateInfo['RegistrationProjectID']),
            $this->_candidate->getProjectID()
        );
    }

    /**
     * Test getProjectTitle returns the correct ProjectTitle for the candidate
     *
     * @covers Candidate::getProjectTitle
     * @return void
     */
    public function testGetProjectTitle()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->_dbMock->expects($this->any())
            ->method('pselectColWithIndexKey')
            ->willReturn(["1"=>'testProject']);

        $this->assertEquals("testProject", $this->_candidate->getProjectTitle());
    }

    /**
     * Test getCandID returns the correct CandID for the candidate
     *
     * @covers Candidate::getCandID
     * @return void
     */
    public function testGetCandID()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidateInfo['CandID'],
            $this->_candidate->getCandID()
        );
    }

    /**
     * Test getPSCID returns the correct PSCID for the candidate
     *
     * @covers Candidate::getPSCID
     * @return void
     */
    public function testGetPSCID()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidateInfo['PSCID'],
            $this->_candidate->getPSCID()
        );
    }

    /**
     * Test getCandidateSite returns the correct PSC information for the candidate
     *
     * @covers Candidate::getCandidateSite
     * @return void
     */
    public function testGetCandidateSite()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals(
            $this->_candidateInfo['PSC'],
            $this->_candidate->getCandidateSite()
        );
    }
    /**
     * Test getCenterID returns the correct RegistrationCenterID for the candidate
     *
     * @covers Candidate::getCenterID
     * @return void
     */
    public function testGetCenterID()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals(
            \CenterID::singleton($this->_candidateInfo['RegistrationCenterID']),
            $this->_candidate->getCenterID()
        );
    }
    /**
     * Test getCandidateDoB returns the correct DoB for the candidate
     *
     * @covers Candidate::getCandidateDoB
     * @return void
     */
    public function testGetCandidateDoB()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals(
            $this->_candidateInfo['DoB'],
            $this->_candidate->getCandidateDoB()
        );
    }

    /**
     * Test getCandidateEDC returns the correct
     * expected date of confinement for the candidate
     *
     * @covers Candidate::getCandidateEDC
     * @return void
     */
    public function testGetCandidateEDC()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidateInfo['EDC'],
            $this->_candidate->getCandidateEDC()
        );
    }

    /**
     * Test getCandidateSex returns the correct sex of the candidate
     *
     * @covers Candidate::getCandidateSex
     * @return void
     */
    public function testGetCandidateSex()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidateInfo['Sex'],
            $this->_candidate->getCandidateSex()
        );
        $this->assertTrue(
            $this->_candidate->setData(
                ['RegisteredBy' => 'TestUser']
            )
        );
    }

    /**
     * Test getCandidateEthnicity returns the correct ethnicity of the candidate
     *
     * @covers Candidate::getCandidateEthnicity
     * @return void
     */
    public function testGetCandidateEthnicity()
    {
        $this->markTestSkipped("getCandidateEthnicity is a deprecated function");
    }

    /**
     * Test isActive returns the correct string for the candidate
     *
     * @covers Candidate::isActive
     * @return void
     */
    public function testIsActive()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidateInfo['Active'],
            $this->_candidate->isActive()
        );
    }

    /**
     * Test registeredBy returns the correct string for the candidate
     *
     * @covers Candidate::registeredBy
     * @return void
     */
    public function testRegisteredBy()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidateInfo['RegisteredBy'],
            $this->_candidate->registeredBy()
        );
    }

    /**
     * Test lastRecordChangeBy returns the correct UserID for the candidate
     *
     * @covers Candidate::lastRecordChangeBy
     * @return void
     */
    public function testLastRecordChangeBy()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidateInfo['UserID'],
            $this->_candidate->lastRecordChangeBy()
        );
    }

    /**
     * Test getListOfVisitLabels returns array
     * of visit labels with corresponding SessionID as key
     *
     * @covers Candidate::getListOfVisitLabels
     * @return void
     */
    public function testGetListOfVisitLabels()
    {
        $this->markTestSkipped("Test is incomplete");
        $this->_setUpTestDoublesForSelectCandidate();

        $selectReturns = [
            ['ID'          => '97',
                'Visit_label' => 'V01'
            ],
            ['ID'          => '98',
                'Visit_label' => 'V02'
            ]
        ];

        //mock pselect from getListOfVisitLabels

        $expected = [];
        foreach ($selectReturns as $oneRow) {
            $expected[$oneRow['ID']] = $oneRow['Visit_label'];
        }

        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals($expected, $this->_candidate->getListOfVisitLabels());

    }

    /**
     * Test Candidate::getValidCohorts returns a list
     * of valid cohorts for a specific project
     *
     * @covers Candidate::getValidCohorts
     * @return void
     */
    public function testGetValidCohortsReturnsAListOfCohorts()
    {
        $this->_dbMock->method('pselectCol')
            ->willReturn(['Male','Female','Other']);
        $cohorts = [
            ['CohortID' => 1],
            ['CohortID' => 2]
        ];
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn($this->_candidateInfo);

        $expectedCohorts = [
            1 => 1,
            2 => 2
        ];

        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->_dbMock->expects($this->once())
            ->method('pselect')
            ->with(
                $this->stringContains(
                    "SELECT CohortID
                    FROM project_cohort_rel
                    WHERE ProjectID = :prj"
                )
            )
            ->willReturn(
                $cohorts
            );
        $this->assertEquals(
            $expectedCohorts,
            $this->_candidate->getValidCohorts()
        );
    }

    /**
     * Test getValidCohorts returns array() when there are no cohorts
     * in DB.
     *
     * @covers Candidate::getValidCohorts
     * @return void
     */
    public function testGetValidCohortsReturnsEmptyArray(): void
    {
        $cohorts = [];
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->exactly(2))
            ->method('pselect')
            ->willReturn(
                $cohorts
            );

        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals($this->_candidate->getValidCohorts(), []);
    }

    /**
     * Test getCohortForMostRecentVisit returns most recent visit's label
     *
     * @covers Candidate::getCohortForMostRecentVisit
     * @return void
     */
    public function testGetCohortForMostRecentVisitReturnsMostRecentVisitLabel()
    {
        $this->_dbMock->method('pselectCol')
            ->willReturn(['Male','Female','Other']);
        $cohort = [
            [
                'CohortID' => 1,
                'title'    => 'testCohort'
            ]
        ];
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn($this->_candidateInfo);

        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->with(
                $this->stringContains(
                    "SELECT CohortID, title"
                )
            )
            ->willReturn(
                $cohort
            );

        $expectedCohort = [
            'CohortID' => 1,
            'title'    => 'testCohort'
        ];

        $this->assertEquals(
            $expectedCohort,
            $this->_candidate->getCohortForMostRecentVisit()
        );
    }

    /**
     * Test getCohortForMostRecentVisit returns null if there is
     * no visit with a Date_visit
     *
     * @covers Candidate::getCohortForMostRecentVisit
     * @return void
     */
    public function testGetCohortForMostRecentVisitReturnsNull()
    {
        $this->_dbMock->method('pselectCol')
            ->willReturn(['Male','Female','Other']);
        $cohort = [];
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn($this->_candidateInfo);

        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->with(
                $this->stringContains(
                    "SELECT CohortID, title"
                )
            )
            ->willReturn($cohort);

        $this->assertEquals(
            null,
            $this->_candidate->getCohortForMostRecentVisit()
        );
    }

    /**
     * Test getFirstVisit returns first visit's label
     *
     * @covers Candidate::getFirstVisit
     * @return void
     */
    public function testGetFirstVisitReturnsFirstVisitLabel()
    {
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->with($this->stringContains("AND VisitNo = 1"))
            ->willReturn('V01');

        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals('V01', $this->_candidate->getFirstVisit());
    }

    /**
     * Test getFirstVisit returns an empty string if there is no first visit
     *
     * @covers Candidate::getFirstVisit
     * @return void
     */
    public function testGetFirstVisitReturnsEmptyString()
    {
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->with($this->stringContains("AND VisitNo = 1"))
            ->willReturn('');

        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals('', $this->_candidate->getFirstVisit());
    }

    /**
     * Test getNextVisitNo returns the next visit label
     *
     * @covers Candidate::getNextVisitNo
     * @return void
     */
    public function testGetNextVisitNoReturnsNextVisitNumber()
    {
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->with($this->stringContains("SELECT MAX(s.VisitNo)+1"))
            ->willReturn('2');

        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals(2, $this->_candidate->getNextVisitNo());
    }

    /**
     * Test getNextVisitNo returns 1 if the query result is null
     *
     * @covers Candidate::getNextVisitNo
     * @return void
     */
    public function testGetNextVisitNoReturnsOneWhenNextVisitDoesNotExist()
    {
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->with($this->stringContains("SELECT MAX(s.VisitNo)+1"))
            ->willReturn(null);

        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals(1, $this->_candidate->getNextVisitNo());
    }
    /**
     * Test getAge returns correct DateTime Interval $y, $m, $d properties
     *
     * @covers Candidate::getAge()
     * @return void
     */
    public function testGetAgeReturnsCorrectDateTimeInterval()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $referenceDate = new DateTime('2020-02-25');
        $this->assertEquals(12, $this->_candidate->getAge($referenceDate)->y);
        $this->assertEquals(11, $this->_candidate->getAge($referenceDate)->m);
        $this->assertEquals(23, $this->_candidate->getAge($referenceDate)->d);
    }
    /**
     * Test getAgeInYears returns age as int years
     *
     * @covers Candidate::getAgeInYears()
     * @return void
     */
    public function testGetAgeInYearsReturnsIntYears()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidate->getAge()->format('%y'),
            $this->_candidate->getAgeInYears()
        );
    }
    /**
     * Test getAgeInMonths returns age in months
     *
     * @covers Candidate::getAgeInMonths()
     * @return void
     */
    public function testGetAgeInMonthsReturnsMonths()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $expectedAge = intval($this->_candidate->getAge()->format('%m'))
               + 12
               * intval($this->_candidate->getAge()->format('%y'));
        $this->assertEquals($expectedAge, $this->_candidate->getAgeInMonths());
    }
    /**
     * Test getAgeInDays returns age in days
     *
     * @covers Candidate::getAgeInDays()
     * @return void
     */
    public function testGetAgeInDaysReturnsDays()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidate->getAge()->days,
            $this->_candidate->getAgeInDays()
        );
    }
    /**
     * Test getSessionID returns session ID for a given existing visit
     *
     * @covers Candidate::getSessionID
     * @return void
     */
    public function testGetSessionIDForExistingVisit()
    {
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn($this->_candidateInfo);
        $this->_dbMock
            ->method('pselect')
            ->will(
                $this->onConsecutiveCalls(
                    [
                        [
                            "ID"        => 97,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ],
                        [
                            "ID"        =>98,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ]
                    ],
                    [
                        [
                            "ID"        => 97,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ],
                        [
                            "ID"        =>98,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ]
                    ],
                    [
                        [
                            "ID"        => 97,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ],
                        [
                            "ID"        =>98,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ]
                    ],
                )
            );

        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals(97, $this->_candidate->getSessionID(1));
        $this->assertEquals(98, $this->_candidate->getSessionID(2));
    }

    /**
     * Test getSessionID returns NULL for none existing visit
     *
     * @covers Candidate::getSessionID
     * @return void
     */
    public function testGetSessionIDReturnsNullForNoneExistingVisit()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertNull($this->_candidate->getSessionID(0));
    }

    /**
     * Test static function Candidate::candidateExists
     * returns true when _candidate exists
     *
     * @covers Candidate::candidateExists
     * @return void
     */
    public function testCandidateExistsReturnsTrueWhenCandidateExists()
    {
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn(['CandID' => 969664]);

        $this->assertTrue(
            Candidate::candidateExists(
                $this->_candidateInfo['CandID'],
                'AAA0011'
            )
        );
    }

    /**
     * Test static function Candidate::candidateExists
     * returns true when _candidate does not exist
     *
     * @covers Candidate::candidateExists
     * @return void
     */
    public function testCandidateExistsReturnsFalseWhenCandidateDoesNotExists()
    {
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn(null);

        $this->assertFalse(
            Candidate::candidateExists(
                new CandID("123123"),
                'Test'
            )
        );
    }

    /**
     * Test Candidate::validatePSCID with both valid and invalid PSCID genreated
     * based on site
     *
     * @covers Candidate::validatePSCID
     * @return void
     */
    public function testValidateSitePSCID()
    {
        $seq = [
            'seq' => [
                0 => [
                    '#' => '',
                    '@' => ['type' => 'siteAbbrev'],
                ],
                1 => [
                    '#' => '',
                    '@' => [
                        'type'   => 'numeric',
                        'length' => '4',
                    ],
                ],
            ],
        ];
        $this->_configMap = [
            [
                'PSCID',
                [
                    'generation' => 'sequential',
                    'structure'  => $seq,
                ],
            ],
        ];

        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));
        $this->assertEquals(
            1,
            Candidate::validatePSCID('AAA0012', 'AAA', 'BBB'),
            'Valid PSCID: validatePSCID should return 1'
        );
        $this->assertEquals(
            0,
            Candidate::validatePSCID('AAA001', 'AAA', 'BBB'),
            'Invalid PSCID: validatePSCID should return 0'
        );
    }

    /**
     * Test Candidate::validatePSCID with both valid and invalid PSCID
     * generated based on Project
     *
     * @covers Candidate::validatePSCID
     * @return void
     */
    public function testValidateProjectPSCID()
    {
        $seq = [
            'seq' => [
                0 => [
                    '#' => '',
                    '@' => ['type' => 'projectAbbrev'],
                ],
                1 => [
                    '#' => '',
                    '@' => [
                        'type'   => 'numeric',
                        'length' => '4',
                    ],
                ],
            ],
        ];
        $this->_configMap = [
            [
                'PSCID',
                [
                    'generation' => 'sequential',
                    'structure'  => $seq,
                ],
            ],
        ];

        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));
        $this->assertEquals(
            1,
            Candidate::validatePSCID('BBB0012', 'AAA', 'BBB'),
            'Valid PSCID: validatePSCID should return 1'
        );
        $this->assertEquals(
            0,
            Candidate::validatePSCID('BBB001', 'AAA', 'BBB'),
            'Invalid PSCID: validatePSCID should return 0'
        );
    }


    /**
     * Test getConsents returns correct array of information
     *
     * @covers Candidate::getConsents
     * @return void
     */
    public function testGetConsents()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $result = [
            ['ConsentID'     => 1,
                'Name'          => 'name1',
                'Status'        => 'done',
                'DateGiven'     => 'today',
                'DateWithdrawn' => 'tomorrow'
            ]
        ];

        $this->_dbMock->expects($this->once())
            ->method('pselectWithIndexKey')
            ->with(
                $this->stringContains(
                    "SELECT ConsentID, Name, Status, DateGiven, DateWithdrawn"
                )
            )
            ->willReturn($result);

        $this->assertEquals(
            $result,
            $this->_candidate->getConsents()
        );
    }

    /**
     * Test getParticipantStatusOptions returns correct array of information
     *
     * @covers Candidate::getParticipantStatusOptions
     * @return void
     */
    public function testGetParticipantStatusOptions()
    {
        $this->_setUpMockDB();
        $this->_DB->setFakeTableData(
            "participant_status_options",
            [
                0 => [
                    'ID'          => 1,
                    'Description' => 'description1',
                    'parentID'    => null
                ],
                1 => [
                    'ID'          => 2,
                    'Description' => 'description2',
                    'parentID'    => null
                ]
            ]
        );
        $result = Candidate::getParticipantStatusOptions();
        $this->_DB->run("DROP TEMPORARY TABLE participant_status_options");
        $this->assertEquals(
            [1 => 'description1',
                2 => 'description2'
            ],
            $result
        );
    }

    /**
     * Test getParticipantStatusSubOptions returns correct array of information
     *
     * @covers Candidate::getParticipantStatusSubOptions
     * @return void
     */
    public function testGetParticipantStatusSubOptions()
    {
        $this->_setUpMockDB();
        $this->_DB->setFakeTableData(
            "participant_status_options",
            [
                0 => [
                    'ID'          => 1,
                    'Description' => 'description1',
                    'parentID'    => 1
                ],
                1 => [
                    'ID'          => 2,
                    'Description' => 'description2',
                    'parentID'    => 2
                ]
            ]
        );
        $result = Candidate::getParticipantStatusSubOptions(1);
        $this->_DB->run("DROP TEMPORARY TABLE participant_status_options");
        $this->assertEquals(
            [1 => 'description1'],
            $result
        );
    }

    /**
     * Test that getParticipantStatusDescription returns the correct
     * description given the candID
     *
     * @return void
     * @covers Candidate::getParticipantStatusOptions
     */
    public function testParticipantStatusDescription()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->_setUpMockDB();
        $this->_DB->setFakeTableData(
            "participant_status_options",
            [
                0 => [
                    'ID'          => '1',
                    'Description' => 'description1',
                    'parentID'    => 1
                ],
                1 => [
                    'ID'          => '2',
                    'Description' => 'description2',
                    'parentID'    => 2
                ]
            ]
        );
        $this->_DB->setFakeTableData(
            "participant_status",
            [
                0 => [
                    'CandID'             => '969664',
                    'participant_status' => '2'
                ]
            ]
        );
        $result = $this->_candidate->getParticipantStatusDescription($this->_DB);
        $this->_DB->run("DROP TEMPORARY TABLE participant_status_options");
        $this->_DB->run("DROP TEMPORARY TABLE participant_status");
        $this->assertEquals($result, 'description2');
    }

    /**
     * Test that isAccessibleBy returns true if the center IDs and project IDs
     * of a given user match those of the candidate
     *
     * @return void
     * @covers Candidate::isAccessibleBy
     */
    function testIsAccessibleBy()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);
        $user = $this->getMockBuilder('\User')
            ->onlyMethods(['getCenterIDs', 'getProjectIDs'])
            ->getMock();
        $user->expects($this->once())->method("getCenterIDs")
            ->willReturn([new \CenterID("1"), new \CenterID("2")]);
        $user->expects($this->once())->method("getProjectIDs")
            ->willReturn([new \ProjectID("1"), new \ProjectID("3")]);
        '@phan-var \User $user';

        $result = $this->_candidate->isAccessibleBy($user);
        $this->assertTrue($result);
    }

    /**
     * Test that isAccessibleBy returns false if the project IDs of a user
     * do not match the candidate's project ID
     *
     * @return void
     * @covers Candidate::isAccessibleBy
     */
    function testIsAccessibleByNoProject()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->_setUpMockDB();

        $user = $this->getMockBuilder('\User')
            ->onlyMethods(['getCenterIDs', 'getProjectIDs'])
            ->getMock();
        $user->expects($this->atLeastOnce())->method("getCenterIDs")
            ->willReturn([new \CenterID("1"), new \CenterID("2")]);
        $user->expects($this->atLeastOnce())->method("getProjectIDs")
            ->willReturn([new \ProjectID("2"), new \ProjectID("3")]);
        '@phan-var \User $user';

        $result = $this->_candidate->isAccessibleBy($user);
        $this->assertFalse($result);
    }

    /**
     * Test that isAccessibleBy returns false if the center IDs
     * of a given user do not match the center ID of the candidate
     *
     * @return void
     * @covers Candidate::isAccessibleBy
     */
    function testIsAccessibleByNoCenter()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->_setUpMockDB();

        $user = $this->getMockBuilder('\User')->getMock();
        $user->expects($this->atLeastOnce())->method("getCenterIDs")
            ->willReturn([new \CenterID("1"), new \CenterID("3")]);
        $user->expects($this->atLeastOnce())->method("getProjectIDs")
            ->willReturn([new \ProjectID("1"), new \ProjectID("3")]);

        '@phan-var \User $user';

        $result = $this->_candidate->isAccessibleBy($user);
        $this->assertFalse($result);
    }

    /**
     * Test that structureToPCRE returns the regex form of the given structure.
     * This test covers the different cases of the function.
     *
     * @covers Candidate::structureToPCRE
     * @return void
     */
    public function testStructureToPCRE()
    {
        $structure = [
            'seq' => [
                0 => ['@' => ['type' => 'alpha',
                    'minLength' => '1',
                    'maxLength' => '5'
                ]
                ],
                1 => ['@' => ['type' => 'alphanumeric',
                    'length' => '2'
                ]
                ],
                2 => ['@' => ['type' => 'static'],
                    '#' => '1-3'
                ],
                3 => ['@' => ['type' => 'set'],
                    '#' => '1||3'
                ],
                4 => ['@' => ['type' => 'set'],
                    '#' => '1-3'
                ],
            ]
        ];
        $this->assertEquals(
            '/^[a-z]{1,5}[0-9a-z]{2,2}(1-3){1,1}(1||3){1,1}[1-3]{1,1}$/i',
            Candidate::structureToPCRE($structure)
        );
    }

    /**
     * Test structureToPCRE with the site and project abbreviations set
     *
     * @covers Candidate::structureToPCRE
     * @return void
     */
    public function testStructureToPCREWithAbbreviations()
    {
        $structure = [
            'seq' => [
                0 => ['@' => ['type' => 'siteAbbrev',
                    'minLength' => '1',
                    'maxLength' => '5'
                ]
                ],
                1 => ['@' => ['type' => 'projectAbbrev',
                    'minLength' => '1',
                    'maxLength' => '5'
                ]
                ]
            ]
        ];
        $this->assertEquals(
            '/^MTL{1,5}P1{1,5}$/i',
            Candidate::structureToPCRE($structure, "MTL", "P1")
        );
    }

    /**
     * Test Candidate::createNew
     * TODO This function calls Site::singleton() and User::singleton()
     *      So these need to be mocked in some way. It also uses the $_SESSION
     *      array, which requires user interaction, which makes it harder to test.
     *
     * @covers Candidate::createNew
     * @return void
     */
    public function testCreateNew()
    {
        $this->markTestIncomplete("Test not implemented!");
    }

    /**
     * Set up test doubles behavior for Candidate::select() method
     *
     * @return void
     */
    private function _setUpTestDoublesForSelectCandidate()
    {

        $resultMock = $this->getMockBuilder('\LORIS\Database\Query')
            ->disableOriginalConstructor()
            ->getMock();
        $resultMock->method("getIterator")
            ->willReturn(
                new ArrayIterator(
                    [
                        [
                            "ID"        => 97,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ],
                        [
                            "ID"        => 98,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ]
                    ]
                )
            );
        $this->_dbMock
            ->method('pselect')
            ->willReturn($resultMock);
        /*
                $this->onConsecutiveCalls(
                    [
                        [
                            "ID"        => 97,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ],
                        [
                            "ID"        =>98,
                            "ProjectID" => 1,
                            "CenterID"  => 2,
                        ]
                    ],
                    $this->_listOfTimePoints
                )
            );
        */

        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn($this->_candidateInfo);

        $this->_dbMock->method('pselectCol')
            ->willReturn(['Male','Female','Other']);

        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));
    }

    /**
     * Set up mock database and config information
     * This is only necessary to test the functions that use
     * the database.
     *
     * @return void
     */
    private function _setUpMockDB()
    {
        $this->_factoryForDB = NDB_Factory::singleton();
        $this->_factoryForDB->reset();
        $this->_config = $this->_factoryForDB->Config(CONFIG_XML);
        $database      = $this->_config->getSetting('database');
        $this->_DB     = $this->_factoryForDB->database(
            $database['database'],
            $database['username'],
            $database['password'],
            $database['host'],
            true
        );

        $this->_factoryForDB->setDatabase($this->_DB);
        $this->_factoryForDB->setConfig($this->_config);
    }
}
