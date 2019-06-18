<?php
/**
 * Utility class tests
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Test
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . '/../../php/libraries/Utility.class.inc';
use PHPUnit\Framework\TestCase;

/**
 * Unit test for Utility class
 * @category Tests
 * @package  Main
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UtilityTest extends TestCase
{
    /**
     * Consent information
     *
     * @var array contains consent info retrieved by the getConsentList method
     */
    private $_consentInfo = array(
        array('ConsentID' => '1',
              'Name' => 'Bob', 
              'Label' => '2'),
        array('ConsentID' => '2',
              'Name' => 'Anne',
              'Label' => '3'),
        array('ConsentID' => '3',
              'Name' => 'Luke',
              'Label' => '4')
        ); 
    /**
     * Project information
     * @var array contains project information retrieved by getProjectList method
     */
    private $_projectInfo = array(
        array('ProjectID' => '12',
              'Name' => 'project1',
              'recruitmentTarget' => '123456'),
        array('ProjectID' => '23',
              'Name' => 'project2',
              'recruitmentTarget' => '234567')
        );
    /**
     * test_name table information
     * @var array contains test_name information retrieved by getAllInstruments method
     */
    private $_testNameInfo = array(
        array('ID' => '1234567890',
              'Test_name' => 'test1',
              'Full_name' => 'description1'),
        array('ProjectID' => '1122334455',
              'Test_name' => 'test2',
              'Full_name' => 'description2')
        );
    /**
     * psc table information
     * @var array contains psc information retrieved by getSiteList method
     */
    private $_siteInfo = array(
        array('CenterID' => '1234567890',
              'Name' => 'site1'),
        array('CenterID' => '1122334455',
              'Name' => 'site2')
        );
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

    /*
     * Test that calculateAge() method fails when the dates have the incorrect format
     * 
     * @dataProvider ageIncorrectFormatProvider
     * @covers Utility:calculateAge
     * @return void
     */
    public function testCalculateAgeFormat()
    {
        $this->expectException('\LorisException');
	Utility::calculateAge("1998\\08\\25", "2019\\07\\23");
    }

    public function ageIncorrectFormatProvider()
    {
        return [
            ["19980825", "20190611"],
            ["1990\\07\\05", "2018\\05\\23"],
            ["1990", "2018"],
            ["1990_07_05", "2019_09_65"],
            [" ", " "]
        ];
    }

    /**
     * Test that getConsentList() returns a list from the database
     *
     * @covers Utility::getConsentList()
     * @return void
     */
    public function testGetConsentList()
    {
        $this->_setUpTestDoublesForUtilityTests();
        $this->assertEquals($this->_consentInfo, Utility::getConsentList());
    }

    /**
     * Test that getProjectList() returns a list from the database
     *
     * @covers Utility::getProjectList()
     * @return void
     */
    public function testGetProjectList()
    {
        $this->_setUpTestDoublesForUtilityTests();
        $this->assertEquals(
            Utility::getProjectList(),
            array(
                '12' => 'project1',
                '23' => 'project2')
            );
    }

    /**
     * Test that getAllInstruments() returns the proper information
     * 
     * @covers Utility::getAllInstruments()
     * @return void
     */
    public function testGetAllInstruments()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_testNameInfo);

        $this->assertEquals(
            Utility::getAllInstruments(),
            array(
                'test1' => 'description1',
                'test2' => 'description2'));
   
    }

    /**
     * Test that getDirectInstruments() returns the correct information
     * TODO Figure out how to mock \Database::singleton() correctly
     *
     */
    public function testGetDirectInstruments()
    {
        $this->markTestIncomplete("Test not implemented!");
    }
   
    /**
     * Test that getSiteList() returns the correct list from the database
     * TODO Figure out how to mock \Database::singleton() correctly.
     * 
     */
    public function testGetSiteList()
    {
        $this->markTestIncomplete("Test not implemented!");
    }

    /**
     * Set up test doubles for Utility methods
     *
     * @return void
     */
    private function _setUpTestDoublesForUtilityTests()
    {
 
        $this->_dbMock->expects($this->at(0))
            ->method('pselectWithIndexKey')
            ->willReturn($this->_consentInfo); 

        $this->_dbMock->expects($this->at(0))
            ->method('pselect')
            ->willReturn($this->_projectInfo);
    }

}
