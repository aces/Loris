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
 * @author   Stella Lee <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class CandidateListTestIntegrationTest extends LorisIntegrationTest
{
    private $_useEDCId;
    private $_useEDCBackup;
    private $_useProjectsId;
    private $_useProjectsBackup;
    private $_AAPPermId;        // access all profiles
    private $_DEPermId;         // data entry
    private $_uID;              // user ID
    private $_SUPermId;         // super user
    private $_centerID;


    /**
     * Backs up the useEDC config value and sets the value to a known
     * value (true) for testing.
     *
     * @return none
     */
    function setUp() {

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

        $this->_useProjectsId = $this->DB->pselectOne(
            "SELECT ID FROM ConfigSettings WHERE NAME=:useProjects",
            array(":useProjects" => "useProjects")
        );
        $this->_useProjectsBackup = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:useProjects",
            array(":useProjects" => $this->_useProjectsId)
        );
        $this->DB->update(
            "Config",
            array("Value" => "true"),
            array("ConfigID" => $this->_useProjectsId)
        );

        $this->_uID = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:uID",
            array(":uID" => "UnitTester")
        );

        $this->_AAPPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:AAP",
            array(":AAP" => "access_all_profiles")
        );

        $this->_DEPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:DE",
            array(":DE" => "data_entry")
        );

        $this->_centerID = $this->DB->pselectOne(
            "SELECT centerID FROM users WHERE ID=:uID",
            array(":uID" => $this->_uID)
        );

    }


    /**
     * Restore the values backed up in the setUp function
     *
     * @return none
     */
    function tearDown() {

        $this->_useEDCBackup = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:useEDC",
            array(":useEDC" => $this->_useEDCId)
        );
        $this->DB->update(
            "Config",
            array("Value" => $this->_useEDCBackup),
            array("ConfigID" => $this->_useEDCId)
        );

        $this->_useProjectsBackup = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:useProjects",
            array(":useProjects" => $this->_useProjectsId)
        );
        $this->DB->update(
            "Config",
            array("Value" => $this->_useProjectsBackup),
            array("ConfigID" => $this->_useProjectsId)
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
    function testCandidateListPageLoads() {

        $this->webDriver->get($this->url . "?test_name=candidate_list");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);

        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));

        // Ensure that the default is basic mode (which means the button says "Advanced")
        $this->assertEquals("Advanced", $basicButton->getAttribute("value"));

    }


    /**
     * 2.
     * Tests that either access_all_profiles or data_entry
     * permission is required to access the page
     * @return void
     */
    function testCandidateListPermissions() {

        $this->_uID = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:uID",
            array(":uID" => "UnitTester")
        );

        // remove superuser permission
        $this->_SUPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:SUP",
            array(":SUP" => "superuser")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_SUPermId)
        );

        // remove access_all_profiles permission
        $this->_AAPPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:AAP",
            array(":AAP" => "access_all_profiles")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_AAPPermId)
        );

        // remove data_entry permission
        $this->_DEPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:DE",
            array(":DE" => "data_entry")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_DEPermId)
        );

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);
        $this->assertContains("You do not have access to this page.", $bodyText);

        // re-add access_all_profiles and data_entry permissions
        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_AAPPermId)
        );
        $this->DB->insert(
            "user_perm_rel",
            array( "UserID" => $this->_uID, "permID" => $this->_DEPermId)
        );

        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_SUPermId)
        );

    }


    /**
     * 3.
     * Tests that, if data_entry permission NOT access_all_profiles
     * can only see subjects from own site
     *
     * @return void
     */
    function testCandidateListDataEntryPermissions() {

        $this->_uID = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:uID",
            array(":uID" => "UnitTester")
        );

        // remove data_entry permission
        $this->_DEPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:DE",
            array(":DE" => "data_entry")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_DEPermId)
        );

        // if only 1 site, set as test user's site
        // else set 2nd site as test user's site
        $siteQuery = $this->DB->pselect("SELECT CenterID, Name FROM psc ORDER BY CenterID", array());
        $count=0;
        foreach ($siteQuery as $key=>$site) {
            $count++;
            $ownSite=$site;
            if ($count > 1) {
                $this->DB->update(
                    "users",
                    array("CenterID" => "2"),
                    array("ID" => $this->_uID)
                );
                $ownSite=$site;
                break;
            }
        }

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);

        // Consider testing more than one? Cannot get selector to find element when $i != 1
        $i=1;
        $site = $this->webDriver->findElement(
            WebDriverBy::cssSelector("#cand > tbody:nth-child(2) > tr:nth-child({$i}) > td:nth-child(2)"))->getText();
        $PSCID = $this->webDriver->findElement(
            WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn"))->getText();
        $timepointListLink = $this->webDriver->findElement(
            WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn > a")
        );
        $timepointListLink->click();

        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::id("page")
            )
        );

        if ($site == $ownSite || $ownSite == 'DCC') {
            $this->assertEquals($site, $ownSite);

            $editCandidateInfoButton = $this->webDriver->findElement(
                WebDriverBy::cssSelector("#lorisworkspace > div.col-xs-12.row > button:nth-child(3)")
            );
            $editCandidateInfoButton->click();

            $this->webDriver->wait(120, 1000)->until(
                WebDriverExpectedCondition::presenceOfElementLocated(
                    WebDriverBy::id("page")
                )
            );

            $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
            $this->assertContains("Candidate Parameters", $bodyText);
            $this->assertContains("Candidate Information", $bodyText);
            $this->assertContains($PSCID, $bodyText);
        }
        else {
            $this->assertNotEquals($site, $ownSite);
            $this->assertNotEquals($ownSite, 'DCC');

            // Static text exists, but no "Create Time Point" or "Edit Candidate Info" buttons
            $actionsText = $this->webDriver->findElement(
                WebDriverBy::xpath('//*[@id="lorisworkspace"]/div[1]'))->getText();
            $this->assertContains("Create time point", $actionsText);
            $this->assertContains("Edit Candidate Info", $actionsText);
        }

        // re-add data_entry permissions
        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_DEPermId)
        );

        $this->DB->update(
            "users",
            array("CenterID" => "1"),
            array("ID" => $this->_uID)
        );

    }



    /**
     * 4.
     * Test that checks initial filter state:
     * Site = user site
     * Subproject = All
     *
     * @return void
     */
    function testInitialFilterState() {

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // check that Site = All (possibly change to equal user site?)
        $siteFilter = $this->webDriver->findElement(WebDriverBy::Name("centerID"));
        $siteField = $siteFilter->getAttribute('value');
        $this->assertEquals('',$siteField);

        // check that Subproject = All
        $subprojectFilter = $this->webDriver->findElement(WebDriverBy::Name("SubprojectID"));
        $subprojectField = $subprojectFilter->getAttribute('value');
        $this->assertEquals('',$subprojectField);

    }


    /**
     * 5.
     * Tests that results are filtered if a site is selected from site filter
     * (Redundant - see #9)
     */

    
    /**
     * 6.
     * Tests that advanced and basic filter toggle works
     *
     * @return void
     */
    function testCandidateListBasicAdvancedToggle() {

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Switch to Advanced mode
        $basicButton = $this->webDriver->findElements(WebDriverBy::Name("advanced"));
        $this->assertEquals(2, count($basicButton));
        $buttonValue = $basicButton[0]->getAttribute('value');
        $this->assertEquals($buttonValue, 'Advanced');
        $basicButton[0]->click();

        // Only Advanced mode has "Scan Done" options displayed
        $this->assertTrue($this->webDriver->findElement(WebDriverBy::Name("scan_done"))->isDisplayed());

        // Switch to Basic mode
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



    /**
     * 7.
     * Tests that, if advanced filter is set,
     * advanced filters are expanded on page load
     * and are the correct element type, and collapsed otherwise
     *
     * @return void
     */
    function testCandidateListAdvancedOptionsAppear() {

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
    function testDropDownOptions($desiredFilter, $desiredOptions) {

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Switch to Advanced mode
        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));
        $basicButton->click();

        // Find each drop down
        $dropDown = $this->webDriver->findElement(WebDriverBy::Name($desiredFilter));
        $allOptions = $dropDown->findElement(WebDriverBy::tagName('option'));

        // Assert each drop down contains the correct options
        foreach ($allOptions as $option) {
            $this->assertContains($option->getAttribute('value'), $desiredOptions);
        }
    }

    function providerTestDropDownOptions() {

        return array(
            array('centerID',
                array()),       // update this
            array('SubprojectID',
                array('All')),  // update this
            array('ProjectID',
                array('All')),  // update this
            array('Participant_Status',
                array('All', 'Active', 'Refused/Not Enrolled', 'Ineligible', 'Excluded', 'Inactive', 'Complete')),
            array('gender',
                array('All', 'Male', 'Female')),
            array('Latest_Visit_Status',
                array('All', 'Not Started', 'Screening', 'Visit', 'Approval', 'Recycling Bin')),
            array('scan_done',
                array('All', 'Yes', 'No')),
            array('Feedback',
                array('All', 'None', 'opened', 'answered', 'closed', 'comment'))
        );

    }


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
    function testFilters($action, $field, $val, $options) {

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
            array('select', 'SubprojectID', '1', array()),
            array('select','Visit_label','1', array()),
            array('select','centerID','2', array()),
            array('select','ProjectID','1', array()),
            array('select','scan_done','Y', array('Yes', 'No')),
            array('select','Participant_Status','1', array('Active', 'Refused/Not Enrolled', 'Ineligible', 'Excluded', 'Inactive', 'Complete')),
            array('type','dob','2015-01-08', array()),
            array('select','gender','Male', array('Male', 'Female')),
            array('type','Visit_Count','1', array()),
            array('select','Latest_Visit_Status','Visit', array('Not Started', 'Screening', 'Visit', 'Approval', 'Recycling Bin')),
            array('type', 'edc', '1', array()),
            array('select','Feedback','1', array('None', 'opened', 'answered', 'closed', 'comment'))
        );

    }


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
    function testClearForm($action, $field, $val){

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Switch to Advanced mode
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
            array('select','Visit_label','1'),
            array('select','centerID','2'),
            array('select','SubprojectID','1'),
            array('select','ProjectID','1'),
            array('select','scan_done','Y'),
            array('select','Participant_Status','1'),
            array('type','dob','2015-01-08'),
            array('select','gender','Male'),
            array('type','Visit_Count','1'),
            array('select','Latest_Visit_Status','Visit'),
            array('type', 'edc', '1'),
            array('select','Feedback','1')
        );

    }


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
    function testColumnSort($filterLinkText, $filter, $columnNumber) {

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $link = $this->webDriver->findElement(WebDriverBy::linkText($filterLinkText));
        $link->click();

        // Wait until page loads
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::id("page")
            )
        );

        // Check if sorted
        $previous = $this->webDriver->findElement(
            WebDriverBy::cssSelector("#cand > tbody > tr:nth-child(1) > td:nth-child($columnNumber)"))->getAttribute('value');
        for ($i=3; $i<=10; $i+=2){
            $field = $this->webDriver->findElement(
                WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td:nth-child($columnNumber)"))->getAttribute('value');
            // If strings are equal, $compare=0
            // If first argument is lexicographically smaller to the second, $compare<0
            $compare = strcmp($previous, $field);
            $this->assertLessThanOrEqual(0, $compare);
        }

    }

    function providerTestColumnSort() {

        return array(
            array('Site', 'Site', 2),
            array('DCCID', 'DCCID', 3),
            array('PSCID', 'PSCID', 4),
            array('Gender', 'gender', 5),
            array('Participant Status', 'Participant_Status', 6),
            array('Project', 'Project', 7),
            array('Subproject', 'Subproject', 8),
            array('DoB', 'DoB', 9),
            array('Scan Done', 'scan_Done', 10),
            array('Visit Count', 'Visit_count', 12),
            array('Latest Visit Status', 'Latest_Visit_Status', 13),
            array('Feedback', 'Feedback', 14)
        );

    }


    /**
     * 12.
     * Tests that, if "Yes" link under column 'Scan Done' is clicked,
     * the link points to the correct scan in the Imaging Browser
     *
     * @return void
     */
    function testScanDoneLinks() {

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Consider testing more than one? Cannot get selector to find element when $i != 1
        $i=1;
        $scanDoneResult = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td:nth-child(10)"));

        $scanDoneText = $scanDoneResult->getText();
        $PSCID = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn"))->getText();

        if ($scanDoneText == 'Yes') {
            $yesLink = $scanDoneResult->findElement(WebDriverBy::linkText("Yes"));
            $yesLink->click();
            $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
            $this->assertContains("Imaging Browser", $bodyText);
            $this->assertContains("subject timepoint(s) selected.", $bodyText);

            $PSCIDField = $this->webDriver->findElement(WebDriverBy::Name("pscid"))->getAttribute('value');
            $this->assertEquals($PSCID, $PSCIDField);

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

        // Consider testing more than one? Cannot get selector to find element when $i != 1
        $i=1;
        $PSCID = $this->webDriver->findElement(
            WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn"))->getText();
        $PSCIDLink = $this->webDriver->findElement(
            WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn > a")
        );
        $CandID = $this->webDriver->findElement(
            WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td:nth-child(3)"))->getText();

        $PSCIDLink->click();

        // Wait until page loads
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::id("page")
            )
        );

        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile > Candidate Profile {$CandID} / {$PSCID}", $bodyText);
        $this->assertContains("List of Visits (Time Points)", $bodyText);

    }


    /**
     * 14.
     * Tests that, if a candidate has feedback,
     * the feedback column is displayed with the correct colour
     *
     * @return void
     */
    function testFeedbackColour() {

        for ($i=1; $i<=25; $i++) {
            $path = '//*[@id="cand"]/tbody/tr[' . $i . ']/td[14]';
            $feedbackText = $this->webDriver->findElements(WebDriverBy::xpath($path));
            $stylePath = '//*[@id="cand"]/tbody/tr[' . $i . ']/td[14]/@style';
            $feedbackStyle = $this->webDriver->findElements(WebDriverBy::xpath($stylePath));

            if ($feedbackText =="opened") {
                $this->assertContains("#E4A09E", $feedbackStyle);
            }
            elseif ($feedbackText =="answered") {
                $this->assertContains("#EEEEAA", $feedbackStyle);
            }
            elseif ($feedbackText =="closed") {
                $this->assertContains("#99CC99", $feedbackStyle);
            }
            elseif ($feedbackText =="comment") {
                $this->assertContains("#99CCFF", $feedbackStyle);
            }
            elseif ($feedbackText =="unposted") {
                $this->assertContains("#FFFFFF", $feedbackStyle);
            }
            elseif ($feedbackText =="None") {
                $this->assertContains("#FFFFFF", $feedbackStyle);
            }
        }

    }


    /**
     * 15.
     * Tests that, if wrong PSCID/DCCID combination is entered
     * and "Open Profile" is clicked,
     * an error is thrown
     *
     * @return void
     */
    function testOpenProfileError() {

        // remove superuser permission
        $this->_SUPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:SUP",
            array(":SUP" => "superuser")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_SUPermId)
        );

        // remove access_all_profiles permission
        $this->_AAPPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:AAP",
            array(":AAP" => "access_all_profiles")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_AAPPermId)
        );

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $fakeDCCID='1';
        $fakePSCID='1';

        // Click "Open Profile" with empty fields
        $openProfileButton = $this->webDriver->findElement(WebDriverBy::cssSelector("input.btn:nth-child(4)"));
        $openProfileButton->click();
        // Check alert message
        $alert = $this->webDriver->switchTo()->alert();
        $this->assertContains("You must enter a DCC-ID", $alert->getText());
        $alert->accept();

        // Enter invalid DCCID into field
        $DCCIDSearch = $this->webDriver->findElement(WebDriverBy::Name("candID"));
        $DCCIDSearch->click();
        $this->webDriver->getKeyboard()->sendKeys($fakeDCCID);
        // Click "Open Profile" with only invalid DCCID
        $openProfileButton = $this->webDriver->findElement(
            WebDriverBy::cssSelector("input.btn:nth-child(4)")
        );
        $openProfileButton->click();
        // Check alert message
        $alert = $this->webDriver->switchTo()->alert();
        $this->assertContains("You must enter a PSCID", $alert->getText());
        $alert->accept();

        // Enter invalid PSCID into field
        $PSCIDSearch = $this->webDriver->findElement(WebDriverBy::cssSelector("div.col-sm-12:nth-child(3) > div:nth-child(2) > input:nth-child(1)"));
        $PSCIDSearch->click();
        $this->webDriver->getKeyboard()->sendKeys($fakePSCID);
        $openProfileButton->click();
        // Check alert message
        $alert = $this->webDriver->switchTo()->alert();
        $this->assertContains("DCCID or PSCID is not valid", $alert->getText());
        $alert->accept();

        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_AAPPermId)
        );

        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_SUPermId)
        );

    }


    /**
     * 16.
     * Tests that, if a correct PSCID/DCCID combination is entered,
     * the correct timepoint_list page loads
     *
     * @return void
     */
    function testOpenProfileMatch() {

        // remove superuser permission
        $this->_SUPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:SUP",
            array(":SUP" => "superuser")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_SUPermId)
        );

        // remove access_all_profiles permission
        $this->_AAPPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:AAP",
            array(":AAP" => "access_all_profiles")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_AAPPermId)
        );

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Find matching valid DCCID and PSCID
        $matchingDCCID=$this->webDriver->findElement(
            WebDriverBy::cssSelector("#cand > tbody > tr:nth-child(1) > td:nth-child(3)"))->getText();
        $matchingPSCID=$this->webDriver->findElement(
            WebDriverBy::cssSelector("#cand > tbody > tr:nth-child(1) > td.candFrozenColumn"))->getText();

        // Enter DCCID
        $DCCIDSearch = $this->webDriver->findElement(
            WebDriverBy::Name("candID")
        );
        $DCCIDSearch->click();
        $this->webDriver->getKeyboard()->sendKeys($matchingDCCID);

        // Enter PSCID
        $PSCIDSearch = $this->webDriver->findElement(
            WebDriverBy::cssSelector("div.col-sm-12:nth-child(3) > div:nth-child(2) > input:nth-child(1)")
        );
        $PSCIDSearch->click();
        $this->webDriver->getKeyboard()->sendKeys($matchingPSCID);

        // Click "Open Profile"
        $openProfileButton = $this->webDriver->findElement(
            WebDriverBy::cssSelector("input.btn:nth-child(4)")
        );
        $openProfileButton->click();

        // Assert that you were taken to the current URL
        $currentURL = $this->url;
        $desiredURL = '/main.php?test_name=timepoint_list&candID=' . $matchingDCCID . '&PSCID=' . $matchingPSCID;
        $this->assertContains($desiredURL, $currentURL);
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile > Candidate Profile {$matchingDCCID} / {$matchingPSCID}", $bodyText);
        $this->assertContains("List of Visits (Time Points)", $bodyText);

        // Insert "access all profiles" permission and super user permission
        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_AAPPermId)
        );

        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_SUPermId)
        );
    }


    /**
     * 17.
     * Tests that, without access_all_profiles permission,
     * PSCID links are NOT clickable
     *
     * @return void
     */
    function testPSCIDLinkPermissions() {

        $this->_uID = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:uID",
            array(":uID" => "UnitTester")
        );

        // remove access_all_profiles permission
        $this->_AAPPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:AAP",
            array(":AAP" => "access_all_profiles")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_uID, "permID" => $this->_AAPPermId)
        );

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Make sure that the URL does not change
        // Since static text (not a link) is being clicked
        $URL1=$this->url;
        for ($i=1; $i<=25; $i++) {
            $PSCID = $this->webDriver->findElement(
                WebDriverBy::cssSelector(
                    "#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn"
                )
            );
            $PSCID->click();
            $URL2=$this->url;
            $this->assertEquals($URL1, $URL2);
        }
    }


    /**
     * 18.
     * Tests that, if useEDC and useProjects config variables = false,
     * filters are removed from menu
     *
     * @return void
     */
    function testUseProjectsUseEDCFilters() {

        // Set "Use EDC" configuration as false
        $this->_useEDCBackup = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:useEDC",
            array(":useEDC" => $this->_useEDCId)
        );
        $this->DB->update(
            "Config",
            array("Value" => "false"),
            array("ConfigID" => $this->_useEDCId)
        );

        // Set "Use projects" configuration as false
        $this->_useProjectsBackup = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:useProjects",
            array(":useProjects" => $this->_useProjectsId)
        );
        $this->DB->update(
            "Config",
            array("Value" => "false"),
            array("ConfigID" => $this->_useProjectsId)
        );

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        // Make sure that "EDC" and "Project" columns are no longer in the table
        $tableHeaders = $this->webDriver->findElement(WebDriverBy::cssSelector("thead"))->getText();
        $this->assertNotContains("EDC", $tableHeaders);
        $this->assertNotContains("Project", $tableHeaders);

    }

}
?>
