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
 *
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
     * @var array contains consent information retrieved 
     *      by the getConsentList method
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
     * 
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
     * Test_name table information
     * 
     * @var array contains test_name information 
     *      retrieved by getAllInstruments method
     */
    private $_testNameInfo = array(
        array('ID' => '1',
              'Test_name' => 'test1',
              'Full_name' => 'description1',
              'IsDirectEntry' => 1),
        array('ID' => '2',
              'Test_name' => 'test2',
              'Full_name' => 'description2',
              'IsDirectEntry' => 0)
        );
    /**
     * Visit_Windows table information
     * 
     * @var array contains information retrieved by the getVisitList() method
     */
    private $_visitInfo = array(
        array('Visit_label' => 'visitLabel'),
        array('Visit_label' => 'label')
        );
    /**
     * Psc table information
     * 
     * @var array contains psc information retrieved by getSiteList method
     */
    private $_siteInfo = array(
        array('CenterID' => '1',
              'Name' => 'site1'),
        array('CenterID' => '2',
              'Name' => 'site2')
        );
    /**
     * Flag table information
     * 
     * @var array contains flag information retreived 
     *      by getTestNameByCommentID method
     */
    private $_flagInfo = array('Test_name' => 'test_flag1',
                               'CommentID' => 'ID123');
    /**
     * Session table information
     * 
     * @var array contains session information retrieved 
     *      by getStageUsingCandID method
     */
    private $_sessionInfo = array(
        array('CandID' => '1',
              'SubprojectID' => '2',
              'Current_stage' => 'Not Started'),
        array('CandID' => '3',
              'SubprojectID' => '4',
              'Current_stage' => 'Approval')
        );
    /**
     * Language table information
     * 
     * @var array contains language information retrieved by getLanguageList method
     */
    private $_languageInfo = array(
        array('language_id' => '1',
              'language_label' => 'LA1'),
        array('language_id' => '2',
              'language_label' => 'LA2')
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
     * @var \NDB_Config | PHPUnit\Framework\MockObject\MockObject
     */
    private $_configMock;
    /**
     * Test double for Database object
     *
     * @var \Database | PHPUnit\Framework\MockObject\MockObject
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
    public function testCalculateAge(): void
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
    public function testCalculateAgeFormat($first, $second): void
    {
        $this->expectException('\LorisException');
        $array = Utility::calculateAge($first, $second);
    }

    /**
     * Data provider for testCalculateAgeFormat
     * 
     * @return array
     */
    public function ageIncorrectFormatProvider(): array
    {
        return array(
            array("1990\\07\\05", "2018\\05\\23"),
            array("1990", "2018"),
            array("1990_07_05", "2019_09_65"),
            array(" ", " "),
        );
    }

    /**
     * Test that getConsentList() returns a list from the database
     *
     * @covers Utility::getConsentList()
     * @return void
     */
    public function testGetConsentList(): void
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselectWithIndexKey')
            ->willReturn($this->_consentInfo);
        $this->assertEquals($this->_consentInfo, Utility::getConsentList());
    }

    /**
     * Test that getProjectList() returns a list from the database
     *
     * @covers Utility::getProjectList()
     * @return void
     */
    public function testGetProjectList(): void
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselect')
            ->willReturn($this->_projectInfo);
        $this->assertEquals(
            Utility::getProjectList(),
            array(
                '12' => 'project1',
                '23' => 'project2')
        );
    }

    /**
     * Test that getSubprojectList() returns a list of subprojects from the database
     *
     * @covers Utility::getSubprojectList()
     * @return void
     */
    public function testGetSubprojectList(): void
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                array(
                    array('SubprojectID' => '1',
                          'title' => 'subproject1'),
                    array('SubprojectID' => '2',
                          'title' => 'subproject2')
                )
            );

        $this->assertEquals(
            array('1' => 'subproject1',
                  '2' => 'subproject2'),
            Utility::getSubprojectList()
        );
    }

    /**
     * Test that getSubprojectList() returns the correct subproject 
     * when a ProjectID is specified
     *
     * @covers Utility::getSubprojectList()
     * @return void
     */
    public function testGetSubprojectListWithProjectID(): void
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
                array(
                    array('SubprojectID' => '123',
                          'title' => 'DemoProject')
                )
            );
   
        $this->assertEquals(
            array('123' => 'DemoProject'),
            Utility::getSubprojectList(123)
        );
    }

    /**
     * Test that getAllInstruments() returns the proper information
     * 
     * @covers Utility::getAllInstruments()
     * @return void
     */
    public function testGetInstruments(): void
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_testNameInfo);

        $this->assertEquals(
            array(
                'test1' => 'description1',
                'test2' => 'description2'),
            Utility::getAllInstruments()
        );
    }

    /**
     * Test that getAllDDEInstruments() returns the proper information
     *
     * @covers Utility::getAllDDEInstruments()
     * @return void
     */
    public function testGetAllDDEInstruments(): void
    {
        $test_names = array(
                          array('Test_name' => 'test_name1',
                                'Full_name' => 'full_name1'),
                          array('Test_name' => 'test_name2',
                                'Full_name' => 'full_name2')
                      );
        $doubleDataEntryInstruments = array('test_name2');

        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($test_names);
        $this->_configMock->expects($this->any())
            ->method('getSetting')
            ->willReturn($doubleDataEntryInstruments);

        $this->assertEquals(
            array('test_name2' => 'full_name2'),
            Utility::getAllDDEInstruments()
        );
    }

    /**
     * Test that getDirectInstruments() returns tests with isDirectEntry=true
     *
     * @covers Utility::getDirectInstruments()
     * @return void
     */
    public function testGetDirectInstruments(): void
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                array(
                    array('Test_name' => 'test1',
                          'Full_name' => 'description1',
                          'isDirectEntry' => 1))
            );

        $this->assertEquals(
            array('test1' => 'description1'),
            Utility::getDirectInstruments()
        );
    }

    /**
     * Test that getVisitList() returns the correct information
     * 
     * @covers Utility::getVisitList()
     * @return void
     */
    public function testGetVisitList(): void
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
            Utility::getVisitList()
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
     * @covers Utility::getSiteList()
     * @covers Utility::getAssociativeSiteList
     * @return void
     */
    public function testGetSiteListAndGetAssociativeSiteList(): void
    {       
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_siteInfo);


        $this->assertEquals(
            array(
                '1' => 'site1',
                '2' => 'site2'),
            Utility::getSiteList()
        );
        
        $this->assertEquals(
            array(
                '1' => 'site1',
                '2' => 'site2'),
            Utility::getAssociativeSiteList()
        );
    }

    /**
     * Test that getTestNameByCommentID returns 
     * the correct test name for the given CommentID
     * 
     * @note In the Utility class there is a note saying this method 
     *       should be moved to a different module. 
     *
     * @covers Utility::getTestNameByCommentID
     * @return void 
     */
    public function testGetTestNameByCommentID(): void
    {
        $this->_dbMock->expects($this->any())
            ->method('pselectOne')
            ->with(
                $this->stringContains(
                    "SELECT Test_name FROM flag WHERE CommentID=:CID"
                )
            )
            ->willReturn("test_flag1");

        $this->assertEquals(
            "test_flag1",
            Utility::getTestNameByCommentID("ID123")
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
    public function testGetSubprojectIDUsingCandID(): void
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
     * Test that getTestNameUsingFullName returns the correct 
     * Test_name for the given Full_name
     *
     * @covers Utility::getTestNameUsingFullName
     * @return void
     */
    public function testGetTestNameUsingFullName(): void
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                array(
                    array('Test_name' => 'test1',
                          'Full_name' => 'description1'),
                    array('Test_name' => 'test2',
                          'Full_name' => 'description2'))
            );

        $this->assertEquals(
            'test1', 
            Utility::getTestNameUsingFullName('description1')
        );
    }

    /**
     * Test that getExistingVisitLabels returns a list of visit labels
     * This is the simplest case of this function
     * TODO Potential edge cases: Set 'Active' to 'N'
     *
     * @covers Utility::getExistingVisitLabels
     * @return void
     */
    public function testGetExistingVisitLabels(): void
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                array(
                    array('Visit_label' => 'VL1',
                          'CandID' => '1',
                          'CenterID' => '2',
                          'Active' => 'Y'),
                    array('Visit_label' => 'VL2',
                          'CandID' => '3',
                          'CenterID' => '4',
                          'Active' => 'Y'))
            );

        $this->assertEquals(
            array('VL1' => 'VL1',
                  'VL2' => 'VL2'),
            Utility::getExistingVisitLabels()
        );
    }

    /**
     * Test that getExistingVisitLabels returns only 
     * visit labels related to the given project ID
     *
     * @covers Utility::getExistingVisitLabels
     * @return void
     */
    public function testGetExistingVisitLabelsWithProjectID(): void
    {
        /**
         * The 'with' assertion is included to ensure that the mySQL query changes
         * to include the ProjectID parameter if the ProjectID is specified
         */
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->with(
                $this->stringContains(
                    "AND (c.ProjectID IS NULL OR c.ProjectID=:ProjectID)"
                )
            )  
            ->willReturn(
                array(
                    array('Visit_label' => 'VL1',
                          'CandID' => '123456',
                          'CenterID' => '1234567890',
                          'Active' => 'Y'))
            );

        $this->assertEquals(
            array('VL1' => 'VL1'),
            Utility::getExistingVisitLabels('1')
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
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_languageInfo);

        $this->assertEquals(
            array('1' => 'LA1',
                  '2' => 'LA2'),
            Utility::getLanguageList()
        );
    }

    /**
     * Test that getVisitInstruments() returns the correct 
     * information for the given visit label
     *
     * @covers Utility::getVisitInstruments()
     * @return void
     */
    public function testGetVisitInstruments(): void
    {

        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                array(
                    array('Test_name_display' => 'display1',
                          'TestName' => 'name1',
                          'Visit_label' => 'V1'))
            );

        $this->assertEquals(
            array(0 => array('Test_name_display' => 'display1',
                             'TestName' => 'name1',
                             'Visit_label' => 'V1')),
            Utility::getVisitInstruments('V1')
        );
    }
    
    /**
     * Test an edge case of getVisitInstruments() where there is no 
     * 'Test_name_display' column in the given table
     *
     * @covers Utility::getVisitInstruments()
     * @return void
     */
    public function testGetVisitInstrumentsWithoutTestNameDisplay(): void
    {

        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                array(
                    array('Full_name' => 'display1',
                          'TestName' => 'name1',
                          'Visit_label' => 'V1'))
            );

        $this->assertEquals(
            array(0 => array('Full_name' => 'display1',
                             'TestName' => 'name1',
                             'Visit_label' => 'V1')),
            Utility::getVisitInstruments('V1')
        );
    }

    /**
     * Test that lookupBattery returns the correct information 
     * without the stage specified
     * 
     * @covers Utility::lookupBattery()
     * @return void
     */
    public function testLookupBattery(): void
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                array(
                    array('Test_name' => 'test1'),
                    array('Test_name' => 'test2'))
            );

        $this->assertEquals(
            array('test1', 'test2'),
            Utility::lookupBattery(25)
        );
                                   
    }

    /**
     * Test that lookupBattery returns the correct information 
     * with the stage specified
     *
     * @covers Utility::lookupBattery()
     * @return void
     */
    public function testLookupBatteryWithStage(): void
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->with($this->stringContains(" AND b.Stage=:BatStage"))
            ->willReturn(
                array(
                    array('Test_name' => 'test1',
                          'Stage' => 'stage1'))
            );

        $this->assertEquals(
            array('test1'),
            Utility::lookupBattery(25, 'stage1')
        );

    }

    /**
     * Tests that getSourcefields will return an empty array 
     * if no parameters are specified
     *
     * @covers Utility::getSourcefields()
     * @return void
     */
    public function testGetSourcefieldsReturnsNothingWithNoParameters(): void
    {
        $this->assertEquals(
            array(), 
            Utility::getSourcefields()
        );
    }

    /**
     * Test that getSourcefields returns the correct information 
     * and uses the correct query when the instrument parameter is specified
     *
     * @covers Utility::getSourcefields()
     * @return void
     */
    public function testGetSourcefieldsWithInstrumentSpecified(): void
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselect')
            ->with($this->stringContains("AND sourcefrom = :sf"))
            ->willReturn(
                array(
                    array('SourceField' => 'instrument_field',
                          'Name' => 'instrument_name'))
            );
        
        $this->assertEquals(
            array(0 => array('SourceField' => 'instrument_field',
                             'Name' => 'instrument_name')),
            Utility::getSourcefields('instrument1', null, null)
        );
    }

    /**
     * Test that getSourcefields returns the correct information 
     * and uses the correct query when the commentID parameter is specified
     *
     * @covers Utility::getSourcefields()
     * @return void
     */
    public function testGetSourcefieldsWithCommentIDSpecified(): void
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn(
                array(
                    array('SourceField' => 'commentID_field',
                          'Name' => 'commentID_name'))
            );

        $this->assertEquals(
            array(0 => array('SourceField' => 'commentID_field',
                             'Name' => 'commentID_name')),
            Utility::getSourcefields(null, '1', null)
        );
    }

    /**
     * Test that getSourcefields returns the correct information 
     * and uses the correct query when the name parameter is specified
     *
     * @covers Utility::getSourcefields()
     * @return void
     */
    public function testGetSourcefieldsWithNameSpecified(): void
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselectRow')
            ->willReturn(
                array(
                    array('SourceField' => 'name_field',
                          'Name' => 'name_name'))
            );

        $this->assertEquals(
            array(0 => array('SourceField' => 'name_field',
                             'Name' => 'name_name')),
            Utility::getSourcefields(null, null, 'name_name')
        );
    }

    /**
     * Test an edge case of getSourcefields where all three parameters are specified
     * In this case, it should only use the instrument parameter
     *
     * @covers Utility::getSourcefields()
     * @return void
     */
    public function testGetSourcefieldsWithAllThreeParameters(): void
    {
        $this->_dbMock->expects($this->at(0))
            ->method('pselect')
            ->with($this->stringContains("AND sourcefrom = :sf"))
            ->willReturn(
                array(
                    array('SourceField' => 'instrument_field',
                          'Name' => 'instrument_name'))
            );

        $this->assertEquals(
            array(0 => array('SourceField' => 'instrument_field',
                             'Name' => 'instrument_name')),
            Utility::getSourcefields('instrument1', '1', 'name')
        );
    }
}

