<?php

/**
 * Candidate_list automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
require_once __DIR__
    . "/../../../php/libraries/UserPermissions.class.inc";

/**
 * CandidateListTestIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class CandidateListTestIntegrationTest extends LorisIntegrationTest
{
    private $_useEDCId;
    private $_useEDCBackup;
    private $_useProjectsId;
    private $_useProjectsBackup;


    /**
     * Backs up the useEDC config value and sets the value to a known
     * value (true) for testing.
     *
     * @return none
     */
    function setUp()
    {
        parent::setUp();

        $this->_useEDCId = $this->DB->pselectOne(
            "SELECT ID FROM ConfigSettings WHERE NAME=:useEDC",
            array(":useEDC" => "useEDC")
        );

        $this->_useEDCBackup = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:useEDC",
            array(":useEDC" => $this->_useEDCId)
        );

        $this->DB->update(
            "Config",
            array("Value" => "true"),
            array("ConfigID" => $this->_useEDCId)
        );

    }



    /**
     * Restore the values backed up in the setUp function
     *
     * @return none
     */
    function tearDown()
    {
        $this->_useEDCBackup = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:useEDC",
            array(":useEDC" => $this->_useEDCId)
        );
        $this->DB->update(
            "Config",
            array("Value" => $this->_useEDCBackup),
            array("ConfigID" => $this->_useEDCId)
        );
        parent::tearDown();
    }



    /**
     * 1.
     * Tests that, when loading the candidate_list module, the breadcrumb
     * appears and the default filters are set to "Basic" mode.
     *
     * @return void
     */
    function testCandidateListPageLoads()
    {
        $this->webDriver->get($this->url . "?test_name=candidate_list");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);

        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));

        // Ensure that the default is basic mode (which means the button
        // says "Advanced")
        $this->assertEquals("Advanced", $basicButton->getAttribute("value"));
    }



// NOT DONE!!!!!!!
    /**
     * 2.
     * Tests that either access_all_profiles or data_entry
     * permission is required to access the page
     * @return void
     */
//    function testCandidateListPermissions() {
//        $DB =& Database::singleton();
//
//        $userID=999990;
//
//        // remove access_all_profiles permission & data_entry permission
//        $DB->delete('user_perm_rel', array('userID' => $userID, 'permID' => 10));
//        $DB->delete('user_perm_rel', array('userID' => $userID, 'permID' => 11));
//        $this->setPermissions();
//        $this->webDriver->get($this->url . "?test_name=candidate_list");
//        $bodyText = $this->webDriver
//            ->findElement(WebDriverBy::cssSelector("body"))->getText();
//        $this->assertContains("Access Profile", $bodyText);
//        $this->assertContains("You do not have access to this page.", $bodyText);
//
//    }



// NOT DONE!!!!!!!
    /**
     * 3.
     * Tests that, if data_entry permission NOT access_all_profiles
     * can only see subjects from own site
     *
     * @return void
     */
//    function testCandidateListDataEntryPermissions() {
//
//        $DB =& Database::singleton();
//
//        $userID=999990;

//        $DB->delete('user_perm_rel', array('userID' => $userID, 'permID' => 10));
//        // refresh user permissions
//        $this->setPermissions();
//        $this->webDriver->get($this->url . "?test_name=candidate_list");
//        $bodyText = $this->webDriver
//            ->findElement(WebDriverBy::cssSelector("body"))->getText();
//        $this->assertContains("Access Profile", $bodyText);
//
//
//
//        if (data_entry_permission and !access_all_profiles) {
//            $own_site = $this->webDriver->findElement(WebDriverBy::cssSelector("Site: "))->getText();
//            $displayed_sites = blah;
//            $this->assertAttributeContainsOnly($own_site, $displayed_sites);
//        }
//    }



// DONE, except change to user site
    /**
     * 4.
     * Test that checks initial filter state:
     * Site = user site
     * Subproject = All
     *
     * @return void
     */
/*    function testInitialFilterState() {
        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $siteFilter = $this->webDriver->findElement(WebDriverBy::Name("centerID"));
        $siteField = $siteFilter->getAttribute('value');
        $this->assertEquals('',$siteField);
        $this->assertNotEquals('1',$siteField);

        // Change to USER SITE!!!!!!!
        // use label

        $subprojectFilter = $this->webDriver->findElement(WebDriverBy::Name("SubprojectID"));
        $subprojectField = $subprojectFilter->getAttribute('value');
        $this->assertEquals('',$subprojectField);
        $this->assertNotEquals('1',$subprojectField);

        // test all blank
        // open/close advanced
    }
*/


    /**
     * 6.
     * Tests that advanced and basic filter toggle works
     *
     * @return void
     */
/*    function testCandidateListBasicAdvancedToggle() {
        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Switch to Advanced mode
        $basicButton = $this->webDriver->findElements(WebDriverBy::Name("advanced"));
        $this->assertEquals(2, count($basicButton));
        $buttonValue = $basicButton[0]->getAttribute('value');
        $this->assertEquals($buttonValue, 'Advanced');
        $basicButton[0]->click();

        $scanDoneOptions = $this->webDriver->findElement(WebDriverBy::Name("scan_done"));
        $this->assertEquals("select", $scanDoneOptions->getTagName());

        $buttonValue2 = $basicButton[1]->getAttribute('value');
        $this->assertEquals($buttonValue2, 'Basic');
        $basicButton[1]->click();

        // Go through each element and ensure it's on the page after clicking
        $this->assertFalse($this->webDriver->findElement(WebDriverBy::Name("scan_done"))->isDisplayed());
        $this->assertFalse($this->webDriver->findElement(WebDriverBy::Name("Participant_Status"))->isDisplayed());
        $this->assertFalse($this->webDriver->findElement(WebDriverBy::Name("dob"))->isDisplayed());
        $this->assertFalse($this->webDriver->findElement(WebDriverBy::Name("gender"))->isDisplayed());
        $this->assertFalse($this->webDriver->findElement(WebDriverBy::Name("Visit_Count"))->isDisplayed());
        $this->assertFalse($this->webDriver->findElement(WebDriverBy::Name("Latest_Visit_Status"))->isDisplayed());
        $this->assertFalse($this->webDriver->findElement(WebDriverBy::Name("Feedback"))->isDisplayed());
    }
*/


    /**
     * 7.
     * Tests that, if advanced filter is set,
     * advanced filters are expanded on page load
     * and are the correct element type, and collapsed otherwise
     *
     * @return void
     */
/*    function testCandidateListAdvancedOptionsAppear()
    {

        $this->webDriver->get($this->url . "?test_name=candidate_list");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);

        // Switch to Advanced mode
        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));
        $basicButton->click();

        // Go through each element and ensure it's on the page after clicking advanced
        $scanDoneOptions = $this->webDriver->findElement(WebDriverBy::Name("scan_done"));
        $this->assertEquals("select", $scanDoneOptions->getTagName());

        $participantsStatusOptions = $this->webDriver->findElement(WebDriverBy::Name("Participant_Status"));
        $this->assertEquals("select", $participantsStatusOptions->getTagName());

        $dobOptions = $this->webDriver->findElement(WebDriverBy::Name("dob"));
        $this->assertEquals("input", $dobOptions->getTagName());
        // Not currently done
        //$this->assertEquals("date",$dobOptions->getAttribute("type"));

        $genderOptions = $this->webDriver->findElement(WebDriverBy::Name("gender"));
        $this->assertEquals("select", $genderOptions->getTagName());

        $numVisits = $this->webDriver->findElement(WebDriverBy::Name("Visit_Count"));
        $this->assertEquals("input", $dobOptions->getTagName());
        // Not currently done in Loris.
        //$this->assertEquals("number",$dobOptions->getAttribute("type"));
        //$this->assertEquals("0",$dobOptions->getAttribute("min"));

        $edcOptions = $this->webDriver->findElement(WebDriverBy::Name("edc"));
        $this->assertEquals("input", $edcOptions->getTagName());
        // Not currently done
        //$this->assertEquals("date",$edcOptions->getAttribute("type"));

        $latestVisitOptions = $this->webDriver->findElement(WebDriverBy::Name("Latest_Visit_Status"));
        $this->assertEquals("select", $latestVisitOptions->getTagName());

        $feedbackOptions = $this->webDriver->findElement(WebDriverBy::Name("Feedback"));
        $this->assertEquals("select", $feedbackOptions->getTagName());
    }
*/


    /**
     * 8.
     * Tests that each drop down
     * has the correct options
     *
     * @param $desiredFilter Name of drop down to test
     * @param $desiredOptions Options that should be in the drop down, respectively
     *
     * @dataProvider providerTestDropDownOptions
     */
/*    function testDropDownOptions($desiredFilter, $desiredOptions) {

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Open all filters
        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));
        $basicButton->click();

        $dropDown = $this->webDriver->findElement(WebDriverBy::Name($desiredFilter));
        $allOptions = $dropDown->findElement(WebDriverBy::tagName('option'));

        foreach ($allOptions as $option) {
            $this->assertContains($option->getAttribute('value'), $desiredOptions);
        }
    }

    function providerTestDropDownOptions() {
        return array(
//            array('centerID',
//                array('All', 'SEA','PHI','STL','UNC')),
            array('SubprojectID',
//                array('All', '6 month recruit', '12 month recruit', 'Control', '6 month recruits FRX', '12 month recruits FRX', 'EARLI Sib', 'Relative', 'IBIS2 High Risk', 'IBIS2 Low Risk')),
                array('All', 'Control', 'Experimental')),
            array('ProjectID',
//                array('All', 'IBIS1', 'IBIS2', 'Fragile X', 'EARLI Collaboration')),
                array('All', 'Sample Project', 'Another Sample Project')),
            array('Participant_Status',
                array('All', 'Active', 'Refused/Not Enrolled', 'Ineligible', 'Excluded', 'Inactive', 'Complete')),
//            array('Gender',
//                array('All', 'Male', 'Female')),
            array('Latest_Visit_Status',
                array('All', 'Not Started', 'Screening', 'Visit', 'Approval', 'Recycling Bin')),
            array('scan_done',
                array('All', 'Yes', 'No')),
            array('Feedback',
                array('All', 'None', 'opened', 'answered', 'closed', 'comment'))
        );
    }
*/

    /**
     * 9.
     * Tests that, if filters are used,
     * results are filtered
     *
     * @param $action Method of filling the respective field
     * @param $field Field to be tested
     * @param $val Value to be entered
     * @param $options Options for the respective field
     *
     * @dataProvider providerTestFilters
     */
/*    function testFilters($action, $field, $val, $options) {

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Open all filters
        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));
        $basicButton->click();

        // Testing individual fields
        if ($action == 'select') {
            $dropDown = $this->webDriver->findElement(WebDriverBy::Name($field));
            $allOptions = $dropDown->findElement(WebDriverBy::tagName('option'));
            foreach ($allOptions as $option) {
                if ($option == $val) {
                    $option->click();
                    break;
                }
            }
        }
        elseif ($action == 'type') {
            $this->webDriver->findElement(WebDriverBy::Name($field))->click();
            $this->webDriver->getKeyboard()->sendKeys($val);
        }

        // Submit filter
        $showDataButton = $this->webDriver->findElement(WebDriverBy::Name("filter"));
        $showDataButton->click();

        // Test other options don't show up
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("tbody"))->getText();
        foreach ($options as $option) {
            if (!in_array($val, $options)) {
                $this->assertNotContains($option, $bodyText);
            }
        }
    }

    function providerTestFilters() {
        return array(
            array('type','PSCID','1', array()),
            array('type','DCCID','1', array()),
            array('SubprojectID', array('Control', 'Experimental')), // array('All', '6 month recruit', '12 month recruit', 'Control', '6 month recruits FRX', '12 month recruits FRX', 'EARLI Sib', 'Relative', 'IBIS2 High Risk', 'IBIS2 Low Risk')),
            //    array('select','Visit_label','1'),     //Different in IBIS
            array('select','centerID','2', array('AAA','BBB','DCC')), //array('All', 'SEA','PHI','STL','UNC')
            array('select','SubprojectID','1'),
            array('select','ProjectID','1', array('Sample Project', 'Another Sample Project')), // array('All', 'IBIS1', 'IBIS2', 'Fragile X', 'EARLI Collaboration')),
            array('select','scan_done','Y', array('Yes', 'No')),
            array('select','Participant_Status','1', array('Active', 'Refused/Not Enrolled', 'Ineligible', 'Excluded', 'Inactive', 'Complete')),
            array('type','dob','2015-01-08', array()),
            array('select','gender','Male', array('Male', 'Female')),
            array('type','Visit_Count','1', array()),
            array('select','Latest_Visit_Status','Visit', array('Not Started', 'Screening', 'Visit', 'Approval', 'Recycling Bin')),
            //    array('edc'),
            array('select','Feedback','1', array('None', 'opened', 'answered', 'closed', 'comment'))
        );
    }
*/


    /**
     * 10.
     * Tests that, if "Clear Form" is clicked,
     * filters reset to initial state
     *
     * @param $action Method of filling the respective field
     * @param $field Field to be cleared
     * @param $val Value to be entered
     *
     * @dataProvider providerTestClearForm
     */
/*    function testClearForm($action, $field, $val){
        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Open all filters
        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));
        $basicButton->click();

        // Testing individual fields
        if ($action == 'select') {
            $dropDown = $this->webDriver->findElement(WebDriverBy::Name($field));
            $allOptions = $dropDown->findElement(WebDriverBy::tagName('option'));
            foreach ($allOptions as $option) {
                if ($option == $val) {
                    $option->click();
                    break;
                }
            }
        }
        elseif ($action == 'type') {
            $this->webDriver->findElement(WebDriverBy::Name($field))->click();
            $this->webDriver->getKeyboard()->sendKeys($val);
        }

        // Submit filter
        $showDataButton = $this->webDriver->findElement(WebDriverBy::Name("filter"));
        $showDataButton->click();

        // Clear data
        $clearButton = $this->webDriver->findElement(WebDriverBy::Name("reset"));
        $clearButton->click();

        // Check that field is set back to default
        $testFilter = $this->webDriver->findElement(WebDriverBy::Name($field));
        $testField = $testFilter->getAttribute('value');
        $this->assertEquals('',$testField);
    }

    function providerTestClearForm(){
        return array(
            array('type','PSCID','1'),
            array('type','DCCID','1'),
        //    array('select','Visit_label','1'),     //Different in IBIS
            array('select','centerID','2'),
            array('select','SubprojectID','1'),
            array('select','ProjectID','1'),
            array('select','scan_done','Y'),
            array('select','Participant_Status','1'),
            array('type','dob','2015-01-08'),
            array('select','gender','Male'),
            array('type','Visit_Count','1'),
            array('select','Latest_Visit_Status','Visit'),
        //    array('edc'),
            array('select','Feedback','1')
        );
    }
*/


    /**
     * 11.
     * Tests that, if a column is clicked,
     * data sorts
     *
     * @param filterLinkText Visible text of the link
     * @param filter Used in the link to order the table
     *
     * @dataProvider providerTestColumnSort
     */
/*    function testColumnSort($filterLinkText, $filter) {

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $desiredLink = "/main.php?test_name=candidate_list&filter[order][field]={$filter}&filter[order][fieldOrder]=";
        $link = $this->webDriver->findElement(WebDriverBy::linkText($filterLinkText));
        $link->click();
        $currentURL = $this->url;
        $this->assertContains($desiredLink, $currentURL);

        // See if sorted alphabetically by doing a check??

    }

    function providerTestColumnSort() {
        return array(
            array('Site', 'Site'),
            array('DCCID', 'DCCID'),
            array('PSCID', 'PSCID'),
            array('Gender', 'Gender'),
            array('Participant Status', 'Participant_Status'),
            array('Project', 'Project'),
            array('Subproject', 'Subproject'),
            array('DoB', 'DoB'),
            array('Scan Done', 'scan_Done'),
            array('Visit Count', 'Visit_count'),
            array('Latest Visit Status', 'Latest_visit_status'),
            array('Feedback', 'Feedback')
        );
    }
*/



    /**
     * 12.
     * Tests that, if "Yes" link under column 'Scan Done' is clicked,
     * the link points to the correct scan in the Imaging Browser
     *
     * @return void
     */
    function testScanDoneLinks()
    {
        $this->webDriver->get($this->url . "?test_name=candidate_list");

        for ($i = 1; $i <= 25; $i++) {
            $scanDoneResult = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td:nth-child(10) > a"));
            $scanDoneText = $scanDoneResult->getText();
            $PSCID = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child(1) > td.candFrozenColumn > a"))->getText();

            if ($scanDoneText == 'Yes') {
                $scanDoneResult->click();
                $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
                $this->assertContains("Imaging Browser", $bodyText);
                $this->assertContains("subject timepoint(s) selected.", $bodyText);

                $PSCIDField = $this->webDriver->findElement(WebDriverBy::Name("pscid"))->getAttribute('value');
                $this->assertEquals($PSCID, $PSCIDField);

//                if (none) {
//                    "Nothing found";
//                }

                for ($j = 1; $j <= 25; $j++) {
                    $rowPSCID = $this->webDriver->findElement(WebDriverBy::cssSelector("#kgkjgkjg > div.carousel.slide > div > div > table > tbody > tr:nth-child({$j}) > td:nth-child(3)"))->getText();
                    if ($rowPSCID != NULL) {
                        $this->assertEquals($rowPSCID, $PSCID);
                    }
                }
            }
        }
    }



    /**
     * 13.
     * Tests that, if PSCID link is clicked,
     * it points to the correct timepoint_list page
     *
     * @return void
     */
    function testTimepointListPage() {
        $this->webDriver->get($this->url . "?test_name=candidate_list");
    }



    /**
     * 14.
     * Tests that, if a candidate has feedback,
     * the feedback column is displayed with the correct colour
     *
     * @return void
     */
//<select name="Feedback" class="form-control input-sm" >
//<option value='' >All</option>
//<option value='0' >None</option> --> white/clear
//<option value='1' >opened</option> --> red   <td style="background-color:#E4A09E">
//<option value='2' >answered</option> --> ??
//<option value='3' >closed</option> --> ??
////<option value='4' >comment</option></select> --> blue <td style="background-color:#99CCFF">…</td>
//'opened' => '#E4A09E',
//'answered' => '#EEEEAA',
//'closed' => '#99CC99',
//'comment' => '#99CCFF',
//'unposted' => '#FFFFFF',
//    function testFeedbackColour() {
//        $feedback = $this->webDriver->findElements(WebDriverBy::cssSelector("td::nth-child(14)"));
//        $feedbackText = $this->webDriver->findElements(WebDriverBy::cssSelector("td::nth-child(14)"))->getText();
//
//        $actual=0;
//
//        if ($feedback =="opened") {
//            $this->assertEquals("#E4A09E", $actual);
//        }
//        elseif ($feedback =="answered") {
//            $this->assertEquals("#EEEEAA", $actual);
//        }
//        elseif ($feedback =="closed") {
//            $this->assertEquals("#99CC99", $actual);
//        }
//        elseif ($feedback =="comment") {
//            $this->assertEquals("#99CCFF", $actual);
//        }
//        elseif ($feedback =="unposted") {
//            $this->assertEquals("#FFFFFF", $actual);
//        }
//        // elseif ($feedback =="none") { background-color=white; }
//    }



    /**
     * 15.
     * Tests that, if wrong PSCID/DCCID combination is entered
     * and "Open Profile" is clicked,
     * an error is thrown
     *
     * @return void
     */
//    function testOpenProfileError() {
//        $this->webDriver->get($this->url . "?test_name=candidate_list");
//
//        $DCCIDSearch = $this->webDriver->findElement(WebDriverBy::Name("candID"));
//
//
//        // 2nd one is the desired field
//        $PSCIDSearch = $this->webDriver->findElements(WebDriverBy::Name("PSCID"));
//
//
//        // enter unmatching
//        // must enter a PSCID
//        // must enter a DCCID
//        // not matching error...
//    }



    /**
     * 16.
     * Tests that, if a correct PSCID/DCCID combination is entered,
     * the correct timepoint_list page loads
     *
     * @return void
     */
//    function testOpenProfileMatch() {
//        $this->webDriver->get($this->url . "?test_name=candidate_list");
//
//        $DCCIDSearch = $this->webDriver->findElement(WebDriverBy::Name("candID"));
//
//
//        // 2nd one is the desired field
//        $PSCIDSearch = $this->webDriver->findElements(WebDriverBy::Name("PSCID"));
//
//        // enter matching
//    }



    /**
     * 17.
     * Tests that, without access_all_profiles permission,
     * PSCID links are NOT clickable
     *
     * @return void
     */
//    function testPSCIDLinkPermissions {
//
//    }



    /**
     * 18.
     * Tests that, if useEDC and useProjects config variables = false,
     * filters are removed from menu
     *
     * @return void
     */
//    function testUseProjectsUseEDCFilters() {
//
//    }



// FROM LORISINTEGRATIONTEST.CLASS.INC

//    private $_oldConfig = array();
//
//    function setupConfigSetting($configName, $value) {
//        if(isset($this->_oldConfig[$configName])) {
//            throw new LorisException("Attempted to change already changed config setting");
//        }
//
//        $configID = $this->DB->pselectOne(
//            "SELECT ID FROM ConfigSettings WHERE Name=:configName",
//            array(":configName" => $configName)
//        );
//
//        $oldVal = $this->DB->pselectOne(
//            "SELECT Value FROM Config WHERE ConfigID=:confID",
//            array(":confID" => $configID)
//        );
//
//        $this->_oldConfig[$configName] = array(
//            'ConfigID' => $configID,
//            'OldValue' => $oldVal,
//        );
//
//        $this->DB->update(
//            "Config",
//            array("Value" => $value),
//            array("ConfigID" => $configID)
//        );
//    }
//
//    function restoreConfigSetting($configName) {
//        if(!isset($this->_oldConfig[$configName])) {
//            throw new LorisException("Attempted to restore unsaved config setting");
//        }
//        $this->DB->update(
//            "Config",
//            array("Value"    => $this->_oldConfig[$configName]['OldValue']),
//            array("ConfigID" => $this->_oldConfig[$configName]['ConfigID'])
//        );
//    }




    /**
     * Loads the users's permissions
     *
     * @return void
     * @access private
     */
    function setPermissions()
    {
        // create DB object
        $DB =& Database::singleton();

        $userID=999990;

        // get all the permissions for this user
        $query = "SELECT p.code, pr.userID FROM permissions p
            LEFT JOIN user_perm_rel pr
            ON (p.permID=pr.permID AND pr.userID=:UID)";

        $results = $DB->pselect($query, array('UID' => $userID));

        // reset the array
        $this->permissions = array();

        // fill the array
        foreach ($results AS $row) {
            if (!empty($row['userID'])
                && $row['userID'] === $userID
            ) {
                $this->permissions[$row['code']] = true;
            } else {
                $this->permissions[$row['code']] = false;
            }
        }

        return true;
    }


    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiating the config and database objects, creating a user
     * to user for the tests, and logging in.
     *
     * @return none
     */
//    function createTester() {
//        // Set up database wrapper and config
//        $this->config = NDB_Config::singleton(__DIR__ . "/../../project/config.xml");
//        $database = $this->config->getSetting('database');
//
//        $this->DB = Database::singleton(
//            $database['database'],
//            $database['username'],
//            $database['password'],
//            $database['host'],
//            1
//        );
//        $this->url = $this->config->getSetting("url") . "/main.php";
//
//        $this->DB->run("DELETE from users WHERE ID=999000");
//
//        $this->DB->insert(
//            "users",
//            array(
//                'ID'               => 999000,
//                'UserID'           => 'PermUnitTester',
//                'Real_name'        => 'PermUnit Tester',
//                'First_name'       => 'PermUnit',
//                'Last_name'        => 'Tester',
//                'Email'            => 'permtester.@example.com',
//                'CenterID'         => 1,
//                'Privilege'        => 0,
//                'PSCPI'            => 'N',
//                'Active'           => 'Y',
//                'Password_md5'     => 'a601e42ba82bb37a68ca3c8b7752f2e222',
//                'Password_hash'    => null,
//                'Password_expiry'  => '2099-12-31',
//                'Pending_approval' => 'N',
//            )
//        );
//
//        $this->DB->run("INSERT INTO user_perm_rel SELECT 999000, PermID FROM permissions");
//
//        $user = User::factory('PermUnitTester');
//        $user->updatePassword('4test4');
//        // Set up WebDriver implementation and login
//        $capabilities = array(\WebDriverCapabilityType::BROWSER_NAME => 'firefox');
//
//        $this->webDriver = RemoteWebDriver::create(
//            'http://localhost:4444/wd/hub',
//            $capabilities
//        );
//
//    }


    /**
     * Helper function to login to the loris instance which is being pointed to by
     * this test.
     *
     * @param string $username The username to log in as
     * @param string $password The (plain text) password to login as.
     *
     * @return none, side-effect logs in active webDriver
     */
//    protected function login($username, $password)
//    {
//        $this->webDriver->get($this->url);
//
//        $usernameEl = $this->webDriver->findElement(WebDriverBy::Name("username"));
//        $passwordEl = $this->webDriver->findElement(WebDriverBy::Name("password"));
//
//        $usernameEl->sendKeys($username);
//        $passwordEl->sendKeys($password);
//
//        $login = $this->webDriver->findElement(WebDriverBy::Name("login"));
//        $login->click();
//
//        // Explicitly wait until the page is loaded.
//        // Wait up to a minute, because sometimes when multiple tests
//        // are run one will fail due to the login taking too long?
//        $this->webDriver->wait(120, 1000)->until(
//            WebDriverExpectedCondition::presenceOfElementLocated(
//                WebDriverBy::id("page")
//            )
//        );
//    }






}
?>
