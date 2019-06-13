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

        $this->factory = NDB_Factory::singleton();
        $this->factory->setConfig($this->_configMock);
        $this->factory->setDatabase($this->_dbMock);
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

    public function testGetConsentList()
    {
        $this->_setUpTestDoublesForConsentList();
        $this->assertEquals($this->_consentInfo, Utility::getConsentList());
    }

    private function _setUpTestDoublesForConsentList()
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselectWithIndexKey')
            ->willReturn($this->_consentInfo); 
    }

}
