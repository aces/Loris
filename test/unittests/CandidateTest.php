<?php

/**
 * Created by PhpStorm.
 * User: kmarasinska
 * Date: 14/07/15
 * Time: 4:37 PM
 */
class CandidateTest extends PHPUnit_Framework_TestCase
{
    /**
     * Candidate Information as available in the Candidate object
     *
     * @var array contains candidate info retrieved by the select method
     */
    private $candidateInfo
        = array(
           'CenterID'     => '2',
           'CandID'       => '969664',
           'PSCID'        => 'AAA0011',
           'DoB'          => '2007-03-02',
           'EDC'          => null,
           'Gender'       => 'Male',
           'PSC'          => 'AAA',
           'Ethnicity'    => null,
           'Active'       => 'Y',
           'RegisteredBy' => 'Admin Admin',
           'UserID'       => 'admin',
           'ProjectID'    => null,
          );

    /**
     * List of timepoints (visits) that a Candidate has registered
     *
     * @var array list of time points are retrieved in the select method
     */
    private $listOfTimePoints = array();

    /**
     * Candidate object use in tests
     *
     * @var Candidate
     */
    private $candidate;

    /**
     * NDB_Factory used in tests.
     * Test doubles are injected to the factory object.
     *
     * @var NDB_Factory
     */
    private $factory;

    /**
     * Test double for NDB_Config object
     *
     * @var PHPUnit_Framework_MockObject_MockObject
     */
    private $configMock;

    /**
     * Test double for Database object
     *
     * @var PHPUnit_Framework_MockObject_MockObject
     */
    private $dbMock;

    /**
     * Maps config names to values
     * Used to set behavior of NDB_Config test double
     *
     * @var array config name => value
     */
    private $configMap = array();


    /**
     * Sets up fixtures:
     *  - candidate object
     *  - config and Database test doubles
     *  - factory
     *
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp()
    {
        parent::setUp();

        $this->configMap = array(
                            array('useProjects', false),
                            array('HeaderTable', null),
                           );

        $this->listOfTimePoints = array(
                                   array('ID' => '97'),
                                   array('ID' => '98'),
                                  );

        $this->configMock = $this->getMockBuilder('NDB_Config')->getMock();
        $this->dbMock     = $this->getMockBuilder('Database')->getMock();

        $this->factory   = NDB_Factory::singleton();
        $this->candidate = new Candidate();

        $this->factory->setConfig($this->configMock);
        $this->factory->setDatabase($this->dbMock);
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
        $this->factory->reset();
    }

    /**
     * Test select() method retrieves all candidate and related info
     *
     * @return void
     * @covers Candidate::select
     * @covers Candidate::getData
     * @covers Candidate::getListOfTimePoints
     */
    public function testSelectRetrievesCandidateInfo()
    {
        $this->setUpTestDoublesForSelectCandidate();

        $this->candidate->select(969664);

        //validate candidate Info
        $this->assertEquals($this->candidateInfo, $this->candidate->getData());

        //validate list of time points
        $expectedTimepoints = array();
        foreach ($this->listOfTimePoints as $oneRow) {
            $expectedTimepoints[] = $oneRow['ID'];
        }
        $this->assertEquals($expectedTimepoints, $this->candidate->getListOfTimePoints());
    }

    /**
     * Test select() method fails when invalid candidate ID is passed
     *
     * @return void
     * @covers Candidate::select
     * @throws Exception
     */
    public function testsSelectFailsWhenInvalidCandidateIdPassed(){

        $this->dbMock->expects($this->once())
            ->method('pselectRow')
            ->willReturn(false);

        $this->setExpectedException('Exception');
        $this->candidate->select('invalid value');

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
        $this->setUpTestDoublesForSelectCandidate();
        $this->candidate->select($this->candidateInfo['CandID']);

        $data = array('Active' => 'N');
        //assert update method is called with correct parameters
        $this->dbMock->expects($this->once())
            ->method('update')
            ->with('candidate', $data, array('CandID' => $this->candidateInfo['CandID']));

        $this->assertTrue($this->candidate->setData($data));
        $this->assertEquals($data['Active'], $this->candidate->getData('Active'));
    }

    /**
     * Test setData method sets data when passing variable name and value
     *
     * @return void
     * @covers Candidate::setData
     * @covers Candidate::getData
     */
    public function testSetDataWithValueSucceeds()
    {
        $this->setUpTestDoublesForSelectCandidate();
        $this->candidate->select($this->candidateInfo['CandID']);

        $data = array('RegisteredBy' => 'TestUser');
        //assert update method is called with correct parameters
        $this->dbMock->expects($this->once())
            ->method('update')
            ->with('candidate', $data, array('CandID' => $this->candidateInfo['CandID']));

        $this->assertTrue($this->candidate->setData('RegisteredBy', 'TestUser'));
        $this->assertEquals($data['RegisteredBy'], $this->candidate->getData('RegisteredBy'));
    }

    /**
     * Test getListOfVisitLabels returns array of visit labels w/ corresponding SessionID as key
     *
     * @covers Candidate::getListOfVisitLabels
     * @return void
     */
    public function testGetListOfVisitLabels()
    {
        $this->setUpTestDoublesForSelectCandidate();

        $selectReturns = array(
                          array(
                           'ID'          => '97',
                           'Visit_label' => 'V01',
                          ),
                          array(
                           'ID'          => '98',
                           'Visit_label' => 'V02',
                          ),
                         );

        //mock pselect from getListOfVisitLabels
        $this->dbMock->expects($this->at(2))
            ->method('pselect')
            ->with($this->stringStartsWith('SELECT ID, Visit_label FROM session'), $this->arrayHasKey('Candidate'))
            ->willReturn($selectReturns);

        $expected = array();
        foreach ($selectReturns as $oneRow) {
            $expected[$oneRow['ID']] = $oneRow['Visit_label'];
        }

        $this->candidate->select($this->candidateInfo['CandID']);
        $this->assertEquals($expected, $this->candidate->getListOfVisitLabels());

    }

    /**
     * Test getNextVisitLabel returns the next label
     *
     * @covers Candidate::getNextVisitLabel
     * @return void
     */
    public function testGetNextVisitLabelReturnsNexstLabel()
    {
        //set config 'visitLabel' values
        $this->configMap[] = array(
                              'visitLabel',
                              array(
                               'generation' => 'user',
                               'suggest'    => 'V%value%',
                              ),
                             );
        $this->setUpTestDoublesForSelectCandidate();

        $existingVisitLabels = array(
                          array(
                           'ID'          => '97',
                           'Visit_label' => 'V01',
                          ),
                          array(
                           'ID'          => '98',
                           'Visit_label' => 'V02',
                          ),
                         );

        //mock pselect from getListOfVisitLabels
        $this->dbMock->expects($this->at(2))
            ->method('pselect')
            ->with($this->stringStartsWith('SELECT ID, Visit_label FROM session'), $this->arrayHasKey('Candidate'))
            ->willReturn($existingVisitLabels);

        //mock pselectRow from getNextVisitLabel
        $this->dbMock->expects($this->at(3))
            ->method('pselectRow')
            ->with($this->stringStartsWith('SELECT IFNULL(max(VisitNo)+1, 1) AS nextVisitLabel'))
            ->willReturn(array('nextVisitLabel' => '3'));

        $this->candidate->select(969664);
        $this->assertEquals('V3', $this->candidate->getNextVisitLabel());
    }


    /**
     * Test getNextVisitLabel returns 1st visit label
     * when there are no existing visit labels
     *
     * @covers Candidate::getNextVisitLabel
     * @return void
     */
    public function testGetNextVisitLabelWhenThereAreNoExistingVisitLabels()
    {
        $this->listOfTimePoints = array();
        //set config 'visitLabel' values
        $this->configMap[] = array(
            'visitLabel',
            array(
                'generation' => 'user',
                'suggest'    => 'V%value%',
            ),
        );
        $this->setUpTestDoublesForSelectCandidate();

        $existingVisitLabels = array();

        //mock pselect from getListOfVisitLabels
        $this->dbMock->expects($this->at(2))
            ->method('pselect')
            ->with($this->stringStartsWith('SELECT ID, Visit_label FROM session'), $this->arrayHasKey('Candidate'))
            ->willReturn($existingVisitLabels);

        //mock pselectRow from getNextVisitLabel
        $this->dbMock->expects($this->at(3))
            ->method('pselectRow')
            ->with($this->stringStartsWith('SELECT IFNULL(max(VisitNo)+1, 1) AS nextVisitLabel'))
            ->willReturn(false);

        $this->candidate->select(969664);
        $this->assertEquals('V1', $this->candidate->getNextVisitLabel());
    }

    /**
     * Test getNextVisitLabel returns null when no 'visitLabel'
     * settings are present in config.xml
     *
     * @covers Candidate::getNextVisitLabel
     * @return void
     */
    public function testGetNextVisitLabelWhenNoVisitLabelSettingInConfig()
    {
        $this->setUpTestDoublesForSelectCandidate();
        $this->candidate->select(969664);

        $this->assertNull($this->candidate->getNextVisitLabel());
    }

    /**
     * Set up test doubles behavior for Candidate::select() method
     *
     * @return void
     */
    private function setUpTestDoublesForSelectCandidate()
    {
        $this->dbMock->expects($this->at(0))
            ->method('pselectRow')
            ->willReturn($this->candidateInfo);

        $this->dbMock->expects($this->at(1))
            ->method('pselect')
            ->willReturn(
                $this->listOfTimePoints
            );

        $this->configMock->method('getSetting')
            ->will($this->returnValueMap($this->configMap));
    }


}
