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
 * Fake Utility class that has exact copies of methods in the
 * Utility class to test certain SQL queries easily
 *
 * @category Tests
 * @package  Main
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

class FakeUtility extends Utility
{
    /**
     * Returns a list of sites in the database
     *
     * @param \Database $DB         The mock database used by the test methods
     * @param bool      $study_site If true only return sites that are
     *                              study sites according to the psc
     *                              table
     *
     * @return array an associative array("center ID" => "site name")
     */
    static function fakeGetSiteList(\Database $DB ,bool $study_site = true): array
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

    /**
     * Get the list of sites as an associative array
     *
     * @param \Database $DB         The mock database used for testing
     * @param boolean   $study_site If true only return study sites from psc
     *                              table
     * @param boolean   $DCC        Whether the DCC should be included or not
     *
     * @return array of the form CenterID => Site Name.
     *         Note that even though CenterID is numeric, the array
     *         should be interpreted as an associative array since the keys
     *         refer to the centerID, not the array index.
     */
    static function fakeGetAssociativeSiteList(
        \Database $DB,
        bool $study_site = true,
        bool $DCC = true
    ): array {
        
        // get the list of study sites - to be replaced by the Site object
        $query = "SELECT CenterID, Name FROM psc ";
        if ($study_site) {
            $query .= "WHERE Study_site='Y'";
        }
        if (!$DCC) {
            $query .= " AND CenterID <> 1";
        }

        $result = $DB->pselect($query, array());

        // fix the array
        $list = array();
        foreach ($result as $row) {
            $list[$row["CenterID"]] = $row["Name"];
        }
        return $list;
    }

    /**
     * Gets a list of visits used by the database as specified in
     * the Visit_Windows table
     *
     * @param \Database $DB The mock database used by the test methods
     *
     * @return array<string, string> of the form VisitLabel => Visit_label
     */
    static function fakeGetVisitList(\Database $DB) : array
    {
        $query = "SELECT Visit_label from Visit_Windows ORDER BY Visit_label";
        $result = $DB->pselect($query, array());
        $list = array();
        foreach ($result as $row) {
            $list[$row["Visit_label"]] = ucfirst($row["Visit_label"]);
        }
        return $list;
    }

    /**
     * Gets a list of all instruments that are administered as direct data
     * entry from subjects
     * This should return an array in a format suitable for addSelect() from
     * NDB_Page
     *
     * @param \Database $DB The mock database used by the test methods
     *
     * @return array of test_names in a Test_Name => "Full Name"
     */
    static function fakeGetDirectInstruments(\Database $DB): array
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

    /**
     * Looks up visit stage using candidate ID.
     *
     * @param \Database $db      The mock database used by the test methods
     * @param string    $Cand_id Candidate ID
     *
     * @return string
     * @throws DatabaseException
     */
    static function fakeGetStageUsingCandID(\Database $db, string $Cand_id): string
    {
        $query = "select DISTINCT Current_stage from session where ".
            "CandID = :Cand_id";
        $stage = $db->pselect($query, array('Cand_id' => $Cand_id));
        return $stage[0]['Current_stage'];
    }

    /**
     * Looks up visit stage using candidate ID.
     *
     * @param Database $db      The mock database used by the test methods
     * @param string   $Cand_id Candidate ID
     *
     * @return int
     * @throws DatabaseException
     */
    static function fakeGetSubprojectIDUsingCandID(
        \Database $db, string $Cand_id
    ) {
        $query = "select DISTINCT SubprojectID from session where CandID = :CandID";
        $stage = $db->pselect($query, array('CandID' => $Cand_id));
        return intval($stage[0]['SubprojectID']);
    }
    
    /**
     * Looks up the test_name for the current full name
     *
     * @param \Database $db       The mock database used by the test methods
     * @param string    $fullname Descriptive name to be looked up
     *
     * @return string (Non-associative array of the form array(Test1, Test2, ..))
     */
    static function fakeGetTestNameUsingFullName(
        \Database $db, string $fullname
    ) {
        $test_name  = '';
        $instrument = $db->pselect(
            "SELECT Test_name FROM test_names WHERE Full_name =:fname",
            array('fname' => $fullname)
        );
        if (is_array($instrument) && count($instrument)) {
            list(,$test_name) = each($instrument[0]);
        }
        return $test_name;
    }
    /**
     * Get the list of language available in the database
     *
     * @param \Database $DB The mock database used by the test methods
     *
     * @return array Array of language which exist in the database table 'language'
     *               array is of the form
     *               array($language_id => $language_label)
     */
    static function fakeGetLanguageList(\Database $DB): array
    {
        $languagesDB = $DB->pselect(
            "SELECT language_id, language_label
             FROM language",
            array()
        );
        foreach ($languagesDB as $language) {
            $languages[$language['language_id']] = $language['language_label'];
        }
        return $languages;
    }

    /**
     * Get all the instruments which currently exist for a given visit label
     * in the database.
     *
     * @param \Database $DB          The mock database used for testing
     * @param string    $visit_label The visit label for which you would like
     *                               to know the existing visit labels
     *
     * @return array Array of instruments which exist for the given visit label
     *               array is of the form
     *               array(0 => array('Test_name_display' => $TestName))?
     */
    static function fakeGetVisitInstruments(
        \Database $DB, string $visit_label
    ) {
        if ($DB->ColumnExists('test_battery', 'Test_name_display')) {
            $test_names = $DB->pselect(
                "SELECT DISTINCT Test_name_display FROM test_battery
                WHERE Visit_label=:vl",
                array('vl' => $visit_label)
            );
        } else {
            $test_names = $DB->pselect(
                "SELECT DISTINCT t.Full_name as Test_name_display FROM session s
                JOIN candidate c ON (c.candid=s.candid)
                JOIN psc ON (s.CenterID = psc.CenterID)
                JOIN flag f ON (f.sessionid=s.id)
                JOIN test_names t ON (f.test_name=t.Test_name)
                WHERE c.Active='Y' AND s.Active='Y' AND s.Visit_label =:vl
                AND psc.CenterID != '1' AND c.Entity_type != 'Scanner'
                ORDER BY t.Full_name",
                array('vl' => $visit_label)
            );
        }

        return $test_names;
    }
    
    /**
     * Returns a list of bvl instruments
     *
     * Returns a list of instruments for a timepoint's stage ($stage).
     * If no stage arg is passed, return the full list for all stages
     *
     * @param \Database   $DB    The mock database used for testing
     * @param integer     $age   age in days
     * @param string|null $stage study stage (screening or visit)
     *
     * @return array list of instruments
     */
    static function fakeLookupBattery(
        \Database $DB, int $age, ?string $stage = null
    ) {
        
        // craft the select query
        $query  = "SELECT t.Test_name FROM test_battery AS b, test_names AS t
            WHERE t.Test_name=b.Test_name
            AND b.AgeMinDays<=:CandAge AND b.AgeMaxDays>=:CandAge
            AND b.Active='Y'";
        $params = array('CandAge' => $age);

        if (!is_null($stage)) {
            $query .= " AND b.Stage=:BatStage";
            $params['BatStage'] = $stage;
        }

        $query .= " GROUP BY Test_name ORDER BY Test_name";

        // get the list of instruments
        $rows  = array();
        $tests = array();
        $rows  = $DB->pselect($query, $params);

        // repackage the array
        foreach ($rows AS $row) {
            $tests[] = $row['Test_name'];
        }

        // return an array of test names
        return $tests;
    }

    /**
     * Returns all the sourcefrom instruments from parameter_type
     *
     * @param \Database   $DB         The mock database used for testing
     * @param string|null $instrument If specified, return fields from this
     *                                test_name
     * @param string|null $commentID  If specified, return fields for this
     *                                commentid
     * @param string|null $name       If specified, return fields for this
     *                                parameter_type name
     *
     * @return Array of the form array(
     *             0 => array(
     *                 'SourceField' => value
     *                  'Name'        => name
     *             )
     *         )
     */
    static function fakeGetSourcefields(
        \Database $DB,
        ?string $instrument = null,
        ?string $commentID = null,
        ?string $name = null
    ): array {

        //get sourcefield using instrument
        $sourcefields = array();
        if (!is_null($instrument)) {
            $sourcefields = $DB->pselect(
                "SELECT SourceField, Name FROM parameter_type
                WHERE queryable='1' AND sourcefrom = :sf
                ORDER BY Name",
                array('sf' => $instrument)
            );
        } elseif (!is_null($commentID)) { //get sourcefield using commentid
            $instrument   = $DB->pselectOne(
                "SELECT Test_name FROM flag WHERE CommentID = :cid",
                array('cid' => $commentID)
            );
            $sourcefields = $DB->pselect(
                "SELECT SourceField, Name FROM parameter_type
                WHERE queryable = '1' AND sourcefrom = :instrument
                ORDER BY Name",
                array('instrument' => $instrument)
            );
        } elseif (!is_null($name)) { //get all source fields
            $sourcefields = $DB->pselectRow(
                "SELECT * FROM parameter_type WHERE Name = :pn",
                array('pn' => $name)
            );
        }
        return $sourcefields;
    }

    /**
     * Returns the test name associated with a given commentID
     *
     * @param \Database $db        The mock database used for testing
     * @param string    $commentID A CommentID for which you would like
     *                             to know the test_name
     *
     * @return  string The test name this commentID is a part of
     * @note    This should be moved to whatever module uses it, or perhaps
     *       NDB_BVL_Instrument
     * @cleanup
     */
    static function fakeGetTestNameByCommentID(
        \Database $db, string $commentID
    ): string {
        $query    = "SELECT Test_name FROM flag WHERE CommentID=:CID";
        $testName = $db->pselectOne($query, array('CID' => $commentID));
        return $testName;
    }

    /**
     * Get a list of DDE instruments installed in Loris.
     *
     * @param \NDB_Config $config The mock config used for testing
     *
     * @return array of the form Test_name => Full Description
     */
    static function fakeGetAllDDEInstruments(\NDB_Config $config): array
    {
        $Factory       = \NDB_Factory::singleton();
        $DB            = $Factory->Database();
        $instruments_q = $DB->pselect(
            "SELECT Test_name,Full_name FROM test_names",
            array()
        );
        $doubleDataEntryInstruments = $config->getSetting(
            'DoubleDataEntryInstruments'
        );
        $instruments = array();
        foreach ($instruments_q as $row) {
            if (isset($row['Test_name']) && isset($row['Full_name'])) {
                if (in_array($row['Test_name'], $doubleDataEntryInstruments)) {
                    $instruments[$row['Test_name']] = $row['Full_name'];
                }
            }
        }
        return $instruments;
    }
}

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
     * Tears down the fixture, for example, close a network connection
     * This method is called after a test is executed
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
     * @return void
     */
    public function ageIncorrectFormatProvider()
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
     * @covers Utility::getProjectList()
     * @return void
     */
    public function testGetProjectList()
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
     * @covers Utility::getProjectList()
     * @return void
     */
    public function testGetSubprojectList()
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
     * @covers Utility::getProjectList()
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
                    "JOIN project_rel USING (SubprojectID) WHERE ProjectID=:pID"
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
            Utility::getSubprojectList('123')
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
    public function testGetAllDDEInstruments()
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
        //$this->markTestIncomplete("This test is incomplete!");
        $this->assertEquals(
            array('test_name2' => 'full_name2'),
            FakeUtility::fakeGetAllDDEInstruments($this->_configMock)
        );
    }

    /**
     * Test that getDirectInstruments() returns tests with isDirectEntry=true
     *
     * @covers Utility::getDirectInstruments()
     * @return void
     */
    public function testGetDirectInstruments()
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
            FakeUtility::fakeGetDirectInstruments($this->_dbMock)
        );
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
            FakeUtility::fakeGetVisitList($this->_dbMock)
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
    public function testGetSiteListAndGetAssociativeSiteList()
    {       
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_siteInfo);


        $this->assertEquals(
            array(
                '1' => 'site1',
                '2' => 'site2'),
            FakeUtility::fakeGetSiteList($this->_dbMock)
        );
        
        $this->assertEquals(
            array(
                '1' => 'site1',
                '2' => 'site2'),
            FakeUtility::fakeGetAssociativeSiteList($this->_dbMock)
        );
    }

    /**
     * Test that getTestNameByCommentID returns 
     * the correct test name for the given CommentID
     * TODO getTestNameByCommentID() is returning an array instead of a string. 
     * 
     * @note In the Utility class there is a note saying this method 
     *       should be moved to a different module. 
     *
     * @covers Utility::getTestNameByCommentID
     * @return void 
     */
    public function testGetTestNameByCommentID()
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
            FakeUtility::fakeGetTestNameByCommentID($this->_dbMock, "ID123")
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
            FakeUtility::fakeGetStageUsingCandID($this->_dbMock, '1')
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
            FakeUtility::fakeGetSubprojectIDUsingCandID($this->_dbMock, '1')
        );
    }

    /**
     * Test that getTestNameUsingFullName returns the correct 
     * Test_name for the given Full_name
     *
     * @covers Utility::getTestNameUsingFullName
     * @return void
     */
    public function testGetTestNameUsingFullName()
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
            FakeUtility::fakeGetTestNameUsingFullName($this->_dbMock, 'description1')
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
    public function testGetExistingVisitLabels()
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
    public function testGetExistingVisitLabelsWithProjectID()
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
    public function testGetLanguageList()
    {
        $this->_dbMock->expects($this->any())
            ->method('pselect')
            ->willReturn($this->_languageInfo);

        $this->assertEquals(
            array('1' => 'LA1',
                  '2' => 'LA2'),
            FakeUtility::fakeGetLanguageList($this->_dbMock)
        );
    }

    /**
     * Test that getVisitInstruments() returns the correct 
     * information for the given visit label
     *
     * @covers Utility::getVisitInstruments()
     * @return void
     */
    public function testGetVisitInstruments()
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
            FakeUtility::fakeGetVisitInstruments($this->_dbMock, 'V1')
        );
    }
    
    /**
     * Test an edge case of getVisitInstruments() where there is no 
     * 'Test_name_display' column in the given table
     *
     * @covers Utility::getVisitInstruments()
     * @return void
     */
    public function testGetVisitInstrumentsWithoutTestNameDisplay()
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
            FakeUtility::fakeGetVisitInstruments($this->_dbMock, 'V1')
        );
    }

    /**
     * Test that lookupBattery returns the correct information 
     * without the stage specified
     * 
     * @covers Utility::lookupBattery()
     * @return void
     */
    public function testLookupBattery()
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
            FakeUtility::fakeLookupBattery($this->_dbMock, 25)
        );
                                   
    }

    /**
     * Test that lookupBattery returns the correct information 
     * with the stage specified
     *
     * @covers Utility::lookupBattery()
     * @return void
     */
    public function testLookupBatteryWithStage()
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
            FakeUtility::fakeLookupBattery($this->_dbMock, 25, 'stage1')
        );

    }

    /**
     * Tests that getSourcefields will return an empty array 
     * if no parameters are specified
     *
     * @covers Utility::getSourcefields()
     * @return void
     */
    public function testGetSourcefieldsReturnsNothingWithNoParameters()
    {
        $this->assertEquals(
            array(), 
            FakeUtility::fakeGetSourcefields($this->_dbMock)
        );
    }

    /**
     * Test that getSourcefields returns the correct information 
     * and uses the correct query when the instrument parameter is specified
     *
     * @covers Utility::getSourcefields()
     * @return void
     */
    public function testGetSourcefieldsWithInstrumentSpecified()
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
            FakeUtility::fakeGetSourcefields(
                $this->_dbMock, 'instrument1', null, null
            )
        );
    }

    /**
     * Test that getSourcefields returns the correct information 
     * and uses the correct query when the commentID parameter is specified
     * TODO This is returning null rather than an array
     *
     * @covers Utility::getSourcefields()
     * @return void
     */
    public function testGetSourcefieldsWithCommentIDSpecified()
    {
        //$this->markTestIncomplete("This test is incomplete!");

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
            FakeUtility::fakeGetSourcefields($this->_dbMock, null, '1', null)
        );
    }

    /**
     * Test that getSourcefields returns the correct information 
     * and uses the correct query when the name parameter is specified
     *
     * @covers Utility::getSourcefields()
     * @return void
     */
    public function testGetSourcefieldsWithNameSpecified()
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
            FakeUtility::fakeGetSourcefields(
                $this->_dbMock, null, null, 'name_name'
            )
        );
    }

    /**
     * Test an edge case of getSourcefields where all three parameters are specified
     * In this case, it should only use the instrument parameter
     *
     * @covers Utility::getSourcefields()
     * @return void
     */
    public function testGetSourcefieldsWithAllThreeParameters()
    {
        //$this->markTestIncomplete("Incomplete");
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
            FakeUtility::fakeGetSourcefields(
                $this->_dbMock, 'instrument1', '1', 'name'
            )
        );
    }
}

