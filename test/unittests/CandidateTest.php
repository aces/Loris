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
    private $_candidateInfo
        = array(
           'RegistrationCenterID'     => 2,
           'CandID'       => '969664',
           'PSCID'        => 'AAA0011',
           'DoB'          => '2007-03-02',
           'EDC'          => null,
           'Sex'          => 'Male',
           'PSC'          => 'AAA',
           'Ethnicity'    => 'White',
           'Active'       => 'Y',
           'RegisteredBy' => 'Admin Admin',
           'UserID'       => 'admin',
           'ProjectID'    => 1,
           'ProjectTitle' => '',
          );

    /**
     * List of timepoints (visits) that a Candidate has registered
     *
     * @var array list of time points are retrieved in the select method
     */
    private $_listOfTimePoints = array();

    /**
     * Candidate object use in tests
     *
     * @var Candidate
     */
    private $_candidate;

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
     * Maps config names to values
     * Used to set behavior of NDB_Config test double
     *
     * @var array config name => value
     */
    private $_configMap = array();


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
    protected function setUp()
    {
        parent::setUp();

        $this->_configMap = array(
                                array('HeaderTable', null)
                            );

        $this->_listOfTimePoints = array(
                                       array('ID' => '97'),
                                       array('ID' => '98')
                                   );

        $this->_listOfProjects = array(
                                     array('ProjectID' => 1, 
                                           'Name' => 'testProject'));

        $this->_configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $this->_dbMock     = $this->getMockBuilder('Database')->getMock();

        $this->_factory   = NDB_Factory::singleton();
        $this->_factory->setConfig($this->_configMock);
        $this->_factory->setDatabase($this->_dbMock);

        $this->_candidate = new Candidate();

    }

    /**
     * Tears down the fixture, for example, close a network connection.
     * This method is called after a test is executed.
     *
     * @return void
     */
    protected function tearDown()
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

        $this->_candidate->select(969664);
        //validate _candidate Info
        $this->assertEquals($this->_candidateInfo, $this->_candidate->getData());

        //validate list of time points
        $expectedTimepoints = array();
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
        $this->_dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn(null);
        
        $this->expectException('LorisException');
        $this->_candidate->select(88888);

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

        $data = array('Active' => 'N');
        //assert update method is called with correct parameters
        $this->_dbMock->expects($this->once())
            ->method('update')
            ->with(
                'candidate',
                $data,
                array('CandID' => $this->_candidateInfo['CandID'])
            );

        $this->assertTrue($this->_candidate->setData($data));
        $this->assertEquals($data['Active'], $this->_candidate->getData('Active'));
    }

    /**
     * Test setData method sets data when passing variable name and value
     * TODO Same test as above? 
     * 
     * @return void
     * @covers Candidate::setData
     * @covers Candidate::getData
     */
    public function testSetDataWithValueSucceeds()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $data = array('RegisteredBy' => 'TestUser');
        //assert update method is called with correct parameters
        $this->_dbMock->expects($this->once())
            ->method('update')
            ->with(
                'candidate',
                $data,
                array('CandID' => $this->_candidateInfo['CandID'])
            );

        $this->assertTrue(
            $this->_candidate->setData(
                array(
                    'RegisteredBy' => 'TestUser'
                )
            )
        );
        $this->assertEquals(
            $data['RegisteredBy'],
            $this->_candidate->getData('RegisteredBy')
        );
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
    
        $this->_candidate->setData(array());
    }

    /**
     * Test getData returns the entire array of candidate information if no
     * variable is specified
     *
     * @covers Candidate::getData
     * @return void
     */
    public function testGetDataReturnsAllInformationIfGivenNull()
    {
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidateInfo,
            $this->_candidate->getData()
        );
    }

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
            $this->_candidateInfo['ProjectID'],
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
            ->method('pselect')
            ->willReturn($this->_listOfProjects);
       
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
            $this->_candidateInfo['RegistrationCenterID'],
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
    }

    /**
     * Test getCandidateEthnicity returns the correct ethnicity of the candidate
     *
     * @note   This function is deprecated so it was causing a PHAN error. 
               It is marked test incomplete for this reason
     *         however it is fully implemented and functional
     * @covers Candidate::getCandidateEthnicity
     * @return void
     */
    public function testGetCandidateEthnicity()
    {
        $this->markTestIncomplete(
            "This test is marked as incomplete because the function is deprecated"
        );
        /**
        $this->_setUpTestDoublesForSelectCandidate();
        $this->_candidate->select($this->_candidateInfo['CandID']);

        $this->assertEquals(
            $this->_candidateInfo['Ethnicity'],
            $this->_candidate->getCandidateEthnicity()
        );
        */
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
        $this->_setUpTestDoublesForSelectCandidate();

        $selectReturns = array(
                             array('ID'          => '97',
                                   'Visit_label' => 'V01'),
                             array('ID'          => '98',
                                   'Visit_label' => 'V02')
                         );

        //mock pselect from getListOfVisitLabels
        $this->_dbMock->expects($this->at(3))
            ->method('pselect')
            ->with(
                $this->stringStartsWith('SELECT ID, Visit_label FROM session'),
                $this->arrayHasKey('Candidate')
            )
            ->willReturn($selectReturns);

        $expected = array();
        foreach ($selectReturns as $oneRow) {
            $expected[$oneRow['ID']] = $oneRow['Visit_label'];
        }

        $this->_candidate->select($this->_candidateInfo['CandID']);
        $this->assertEquals($expected, $this->_candidate->getListOfVisitLabels());

    }

    /**
     * Test Candidate::getValidSubprojects returns a list
     * of valid subprojects for a specific project
     *
     * @covers Candidate::getValidSubprojects
     * @return void
     */
    public function testGetValidSubprojectsReturnsAListOfSubprojects()
    {
        $subprojects = array(
                           array('SubprojectID' => 1),
                           array('SubprojectID' => 2)
                       );
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->at(3))
            ->method('pselect')
            ->with(
                $this->stringContains(
                    "SELECT SubprojectID from project_rel where ProjectID = :prj"
                )
            )
            ->willReturn(
                $subprojects
            );

        $expectedSubprojects = array(
                                   1 => 1,
                                   2 => 2
                               );
        
        $this->_candidate->select(969664);

        $this->assertEquals(
            $expectedSubprojects,
            $this->_candidate->getValidSubprojects()
        );
    }

    /**
     * Test getValidSubprojects returns array() when there are no subprojects 
     * in DB.
     *
     * @covers Candidate::getValidSubprojects
     * @return void
     */
    public function testGetValidSubprojectsReturnsEmptyArray(): void
    {
        $subprojects = array();
        $this->_setUpTestDoublesForSelectCandidate();

        $this->_dbMock->expects($this->at(3))
            ->method('pselect')
            ->willReturn(
                $subprojects
            );

        $this->_candidate->select(969664);

        $this->assertEquals($this->_candidate->getValidSubprojects(), array());
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

        $this->_candidate->select(969664);
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
        
        $this->_candidate->select(969664);
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
            ->willReturn(2);

        $this->_candidate->select(969664);
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

        $this->_candidate->select(969664);
        $this->assertEquals(1, $this->_candidate->getNextVisitNo());
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
        $this->_candidate->select(969664);

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
        $this->_candidate->select(969664);

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
            ->willReturn(array('CandID' => 969664));

        $this->assertTrue(Candidate::candidateExists(969664, 'AAA0011'));
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

        $this->assertFalse(Candidate::candidateExists(123, 'Test'));
    }

    /**
     * Test Candidate::validatePSCID with both valid and invalid PSCID
     *
     * @covers Candidate::validatePSCID
     * @return void
     */
    public function testValidatePSCID()
    {
        $seq = array(
                'seq' => array(
                          0 => array(
                                '#' => '',
                                '@' => array('type' => 'siteAbbrev'),
                               ),
                          1 => array(
                                '#' => '',
                                '@' => array(
                                        'type'      => 'numeric',
                                        'minLength' => '4',
                                       ),
                               ),
                         ),
               );
        $this->_configMap = array(
                             array(
                              'PSCID',
                              array(
                               'generation' => 'sequential',
                               'structure'  => $seq,
                              ),
                             ),
                            );

        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));
        $this->assertEquals(
            1,
            Candidate::validatePSCID('AAA0012', 'AAA'),
            'Valid PSCID: validatePSCID should return 1'
        );
        $this->assertEquals(
            0,
            Candidate::validatePSCID('AAA001', 'AAA'),
            'Invalid PSCID: validatePSCID should return 0'
        );
    }

    /**
     * Test Candidate::createNew
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
        $this->_dbMock->expects($this->at(0))
            ->method('pselectRow')
            ->willReturn($this->_candidateInfo);

        $this->_dbMock->expects($this->at(0))
            ->method('pselect')
            ->willReturn($this->_listOfProjects);

        $this->_dbMock->expects($this->at(1))
            ->method('pselect')
            ->willReturn(
                array(array("ID" => 97),array("ID"=>98))
            );

        $this->_dbMock->expects($this->at(2))
            ->method('pselect')
            ->willReturn(
                $this->_listOfTimePoints
            );
        $this->_configMock->method('getSetting')
            ->will($this->returnValueMap($this->_configMap));
    }


}
