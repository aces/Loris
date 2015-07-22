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
    private $_AAPPermId;
    private $_DEPermId;
    private $_userId;
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

        $this->_userId = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:testerID",
            array(":testerID" => "UnitTester")
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
            array(":uID" => $this->_userId)
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
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);

        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));

        // Ensure that the default is basic mode (which means the button
        // says "Advanced")
        $this->assertEquals("Advanced", $basicButton->getAttribute("value"));
    }


    // NOT WORKING
    // NOT DELETING PERMISSIONS PROPERLY!!!!!!!
    /**
     * 2.
     * Tests that either access_all_profiles or data_entry
     * permission is required to access the page
     * @return void
     */
    function testCandidateListPermissions() {

        $this->_userId = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:userID",
            array(":userID" => "UnitTester")
        );

        // remove access_all_profiles permission
        $this->_AAPPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:AAP",
            array(":AAP" => "access_all_profiles")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_userId, "permID" => $this->_AAPPermId)
        );

        // remove data_entry permission
        $this->_DEPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:DE",
            array(":DE" => "data_entry")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_userId, "permID" => $this->_DEPermId)
        );

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);
        $this->assertContains("You do not have access to this page.", $bodyText);

        // re-add access_all_profiles and data_entry permissions
        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_userId, "permID" => $this->_AAPPermId)
        );
        $this->DB->insert(
            "user_perm_rel",
            array( "UserID" => $this->_userId, "permID" => $this->_DEPermId)
        );
    }



    /// ERROR: Cannot locate "Edit Candidate Info" button element
    /**
     * 3.
     * Tests that, if data_entry permission NOT access_all_profiles
     * can only see subjects from own site
     *
     * @return void
     */
    function testCandidateListDataEntryPermissions() {

        $this->_userId = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:userID",
            array(":userID" => "UnitTester")
        );

        // remove data_entry permission
        $this->_DEPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:DE",
            array(":DE" => "data_entry")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_userId, "permID" => $this->_DEPermId)
        );

        $this->DB->update(
            "users",
            array("CenterID" => "2"),
            array("ID" => $this->_userId)
        );

        $centerIDKey = array("1"=>"DCC", "2"=>"AAA", "3"=>"BBB");

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);

        $ownSite="AAA";

        for ($i=1; $i<=25; $i++) {
            $site = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td:nth-child(2)"))->getText();

            $PSCID = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn"))->getText();
            $timepointListLink = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn > a"));
            $timepointListLink->click();

            $this->webDriver->wait(120, 1000)->until(
                WebDriverExpectedCondition::presenceOfElementLocated(
                    WebDriverBy::id("page")
                )
            );

            if ($site == $ownSite || $ownSite == 'DCC') {
                $this->assertEquals($site, $ownSite);

                $editCandidateInfoButton = $this->webDriver->findElement(WebDriverBy::cssSelector("#lorisworkspace > div.col-xs-12.row > button:nth-child(3)"));
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
                $this->assertEquals($ownSite, 'DCC');

                // text exists, but no "Create Time Point" or "Edit Candidate Info" buttons
                $actionsText = $this->webDriver->findElement(WebDriverBy::xpath('//*[@id="lorisworkspace"]/div[1]'))->getText();
                $this->assertContains("Create time point", $actionsText);
                $this->assertContains("Edit Candidate Info", $actionsText);
            }
        }

        // re-add data_entry permissions
        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_userId, "permID" => $this->_DEPermId)
        );

        $this->DB->update(
            "users",
            array("CenterID" => "1"),
            array("ID" => $this->_userId)
        );

    }




// DONE, except change to user site ??
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



    /**
     * 7.
     * Tests that, if advanced filter is set,
     * advanced filters are expanded on page load
     * and are the correct element type, and collapsed otherwise
     *
     * @return void
     */
    function testCandidateListAdvancedOptionsAppear()
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
            array('select', 'SubprojectID', '1', array('Control', 'Experimental')),
            //    array('select','Visit_label','1'),     //Different in IBIS
            //    array('select','centerID','2', array('AAA','BBB','DCC')),
            //    array('select','ProjectID','1', array('Sample Project', 'Another Sample Project')),
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
    function testColumnSort($filterLinkText, $filter) {

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $desiredLink = "/main.php?test_name=candidate_list&filter[order][field]={$filter}&filter[order][fieldOrder]=";
        $link = $this->webDriver->findElement(WebDriverBy::linkText($filterLinkText));
        $link->click();

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

        $i=1;
//        for ($i = 1; $i <= 25; $i++) {
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
//        }
    }



    // ERROR: NoSuchElementException: Unable to locate element: {"method":"css selector","selector":"body"}
    /**
     * 13.
     * Tests that, if PSCID link is clicked,
     * it points to the correct timepoint_list page
     *
     * @return void
     */
    function testTimepointListPage() {
        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $i=1;
        //for ($i = 1; $i <= 25; $i++) {
        $PSCID = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn"))->getText();
        $PSCIDLink = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn > a"));
        $CandID = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td:nth-child(3)"))->getText();

        $PSCIDLink->click();

        // insert wait till page loads function
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::id("page")
            )
        );


        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile > Candidate Profile {$CandID} / {$PSCID}", $bodyText);
        $this->assertContains("List of Visits (Time Points)", $bodyText);

        //}
    }

//        1) CandidateListTestIntegrationTest::testTimepointListPage
//        NoSuchElementException: Unable to locate element: {"method":"css selector","selector":"body"}
//        Works 50% of the time




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



    // Not implemented in my sandbox
    // check permissions or config
    /**
     * 15.
     * Tests that, if wrong PSCID/DCCID combination is entered
     * and "Open Profile" is clicked,
     * an error is thrown
     *
     * @return void
     */
    function testOpenProfileError() {

        // remove access_all_profiles permission
        $this->_AAPPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:AAP",
            array(":AAP" => "access_all_profiles")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_userId, "permID" => $this->_AAPPermId)
        );

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $fakeDCCID='1';
        $fakePSCID='DCC0001';

        $DCCIDSearch = $this->webDriver->findElement(WebDriverBy::cssSelector("#kgkjgkjg > div:nth-child(1) > div.col-sm-3 > form > div:nth-child(2) > div > input"));
        $DCCIDSearch->click();
        $this->webDriver->getKeyboard()->sendKeys($fakeDCCID);

        $PSCIDSearch = $this->webDriver->findElement(WebDriverBy::cssSelector("#kgkjgkjg > div:nth-child(1) > div.col-sm-3 > form > div:nth-child(4) > div > input"));
        $PSCIDSearch->click();
        $this->webDriver->getKeyboard()->sendKeys($fakePSCID);

        $openProfileButton = $this->webDriver->findElement(WebDriverBy::cssSelector("#kgkjgkjg > div:nth-child(1) > div.col-sm-3 > form > input.btn.btn-sm.btn-primary.col-md-5.col-sm-12.col-md-offset-8"));
        $openProfileButton->click();

        // assert not matching error...

        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_userId, "permID" => $this->_AAPPermId)
        );
    }


    // Not implemented in my sandbox
    /**
     * 16.
     * Tests that, if a correct PSCID/DCCID combination is entered,
     * the correct timepoint_list page loads
     *
     * @return void
     */
    function testOpenProfileMatch() {

        // remove access_all_profiles permission
        $this->_AAPPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:AAP",
            array(":AAP" => "access_all_profiles")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_userId, "permID" => $this->_AAPPermId)
        );


        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $matchingDCCID=$this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child(1) > td:nth-child(3)"))->getText();
        $matchingPSCID=$this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child(1) > td.candFrozenColumn"))->getText();

        $DCCIDSearch = $this->webDriver->findElement(WebDriverBy::cssSelector("#kgkjgkjg > div:nth-child(1) > div.col-sm-3 > form > div:nth-child(2) > div > input"));
        $DCCIDSearch->click();
        $this->webDriver->getKeyboard()->sendKeys($matchingDCCID);

        $PSCIDSearch = $this->webDriver->findElement(WebDriverBy::cssSelector("#kgkjgkjg > div:nth-child(1) > div.col-sm-3 > form > div:nth-child(4) > div > input"));
        $PSCIDSearch->click();
        $this->webDriver->getKeyboard()->sendKeys($matchingPSCID);

        $openProfileButton = $this->webDriver->findElement(WebDriverBy::cssSelector("#kgkjgkjg > div:nth-child(1) > div.col-sm-3 > form > input.btn.btn-sm.btn-primary.col-md-5.col-sm-12.col-md-offset-8"));
        $openProfileButton->click();

        $currentURL = $this->url;
        $desiredURL = '/main.php?test_name=timepoint_list&candID=' . $matchingDCCID . '&PSCID=' . $matchingPSCID;
        $this->assertContains($desiredURL, $currentURL);

        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile > Candidate Profile {$matchingDCCID} / {$matchingPSCID}", $bodyText);
        $this->assertContains("List of Visits (Time Points)", $bodyText);

        $this->DB->insert(
            "user_perm_rel",
            array("UserID" => $this->_userId, "permID" => $this->_AAPPermId)
        );
    }



    // NOT WORKING
    // NOT DELETING PERMISSIONS PROPERLY!!!!!!!
    /**
     * 17.
     * Tests that, without access_all_profiles permission,
     * PSCID links are NOT clickable
     *
     * @return void
     */
    function testPSCIDLinkPermissions() {

        $this->_userId = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:userID",
            array(":userID" => "UnitTester")
        );

        // remove access_all_profiles permission
        $this->_AAPPermId = $this->DB->pselectOne(
            "SELECT permID FROM permissions WHERE code=:AAP",
            array(":AAP" => "access_all_profiles")
        );
        $this->DB->delete(
            "user_perm_rel",
            array("UserID" => $this->_userId, "permID" => $this->_AAPPermId)
        );

        $this->webDriver->get($this->url . "?test_name=candidate_list");

        $URL1=$this->url;

        for ($i=1; $i<=25; $i++) {
            $PSCID = $this->webDriver->findElement(WebDriverBy::cssSelector("#cand > tbody > tr:nth-child({$i}) > td.candFrozenColumn"));
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

        $this->_useEDCBackup = $this->DB->pselectOne(
            "SELECT Value FROM Config WHERE ConfigID=:useEDC",
            array(":useEDC" => $this->_useEDCId)
        );
        $this->DB->update(
            "Config",
            array("Value" => "false"),
            array("ConfigID" => $this->_useEDCId)
        );

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

        $tableHeaders = $this->webDriver->findElement(WebDriverBy::cssSelector("thead"))->getText();
        $this->assertNotContains("EDC", $tableHeaders);
        $this->assertNotContains("Project", $tableHeaders);

    }



}
?>
