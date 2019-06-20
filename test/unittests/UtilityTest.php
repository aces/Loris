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

class FakeUtility extends Utility 
{
    static function getSiteList(Database $DB ,bool $study_site = true): array
    {
        // get the list of study sites - to be replaced by the Site object
        $query = "SELECT CenterID, Name FROM psc ";
        if ($study_site) {
            $query .= "WHERE Study_site='Y'";
        }
        $result = $DB->pselect($query, array());
        // fix the array
        $list = array();
        foreach ($result as $row) {
            $list[$row["CenterID"]] = $row["Name"];
        }
        natcasesort($list);
        return $list;
    }

    static function getVisitList(\Database $DB) : array
    {
        $query = "SELECT Visit_label from Visit_Windows ORDER BY Visit_label";
        $result = $DB->pselect($query, array());
        $list = array();
        foreach ($result as $row) {
            $list[$row["Visit_label"]] = ucfirst($row["Visit_label"]);
        }
        return $list;
    }

    static function getTestNameByCommentID(\Database $db, string $commentID): string
    {
        $query    = "SELECT Test_name FROM flag WHERE CommentID=:CID";
        $testName = $db->pselectOne($query, array('CID' => $commentID));
        return $testName;
    }

    static function getDirectInstruments(\Database $DB): array
    {
        $instruments   = array();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names WHERE IsDirectEntry=true 
             ORDER BY Full_name",
            array()
        );
        foreach ($instruments_q as $key) {
            $instruments[$key['Test_name']] =$key['Full_name'];
        }
        return $instruments;
    }

    static function getStageUsingCandID(\Database $db, string $Cand_id): string
    {
        $query = "select DISTINCT Current_stage from session where ".
            "CandID = :Cand_id";
        $stage = $db->pselect($query, array('Cand_id' => $Cand_id));
        return $stage[0]['Current_stage'];
    }

}

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
              'Full_name' => 'description1',
              'IsDirectEntry' => '1'),
        array('ID' => '1122334455',
              'Test_name' => 'test2',
              'Full_name' => 'description2',
              'IsDirectEntry' => '0')
        );
    /**
     * Visit_Windows table information
     * @var array contains information retrieved by the getVisitList() method
     */
    private $_visitInfo = array(
        array('Visit_label' => 'visitLabel'),
        array('Visit_label' => 'label')
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
     * flag table information
     * @var array contains flag information retreived by getTestNameByCommentID method
     */
    private $_flagInfo = 
        array('Test_name' => 'test_flag1',
              'CommentID' => 'ID123');
    /**
     * session table information
     * @var array contains session information retrieved by getStageUsingCandID method
     */
    private $_sessionInfo = array(
        array('CandID' => '123456',
              'Current_stage' => 'Not Started'),
        array('CandID' => '234567',
              'Current_stage' => 'Approval')
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
    public function testGetInstruments()
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
     * Test that getVisitList() returns the correct information
     * 
     * @covers Utility::getVisitList()
     * @return void
     */
    public function testGetVisitList()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_visitInfo);

        /**
         * The output is in the form 'Vist_label' => 'Visit_label'(with uppercase)
         */
        $this->assertEquals(
            array(
                'visitLabel' => 'VisitLabel',
                'label' => 'Label'),
            FakeUtility::getVisitList($this->_dbMock));
    }
   
    /**
     * Test that getSiteList() returns the correct list from the database
     * 
     * @covers Utility::getSiteList()
     * @return void
     */
    public function testGetSiteList()
    {       
        $this->_dbMock->expects($this->at(0))
            ->method('pselect')
            ->willReturn($this->_siteInfo);

        $this->assertEquals(
            FakeUtility::getSiteList($this->_dbMock),
            array(
                '1234567890' => 'site1',
                '1122334455' => 'site2'));
    }

    /**
     * Test that getTestNameByCommentID returns the correct test name for the given CommentID
     * TODO getTestNameByCommentID() is returning an array instead of a string. 
     * TODO I have yet to determine whether this is a strange error or something wrong with the method. 
     *
     * @covers Utility::getTestNameByCommentID
     * @return void 
     */
    public function testGetTestNameByCommentID()
    {
        $this->markTestIncomplete("This test is incomplete!");
        $this->_dbMock->expects($this->at(0))
            ->method('pselectOne')
            ->willReturn($this->_flagInfo);

        $this->assertEquals('test_flag1', FakeUtility::getTestNameByCommentID($this->_dbMock, 'ID123'));
        $this->assertEquals('test_flag2', FakeUtility::getTestNameByCommentID($this->_dbMock, 'ID234'));
    }

    /**
     * Test that getStageUsingCandID returns the proper current stage for the given CandID
     * TODO Check that this works for any part of the array, not just the first entry
     *
     * @covers Utility::getStageUsingCandID
     * @return void
     */
    public function testGetStageUsingCandID()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_sessionInfo);

        $this->assertEquals('Not Started', FakeUtility::getStageUsingCandID($this->_dbMock, '123456'));
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
