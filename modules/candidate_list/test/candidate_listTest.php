<?php
/**
 * Candidate_list automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTestWithCandidate.class.inc";
/**
 * CandidateListTestIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CandidateListTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    //filter location
    static $PSCID          = 'input[name="pscid"]';
    static $DCCID          = 'input[name="dccid"]';
    static $visitLabel     = 'select[name="visitLabel"]';
    static $site           = 'select[name="site"]';
    static $entityType     = 'select[name="entityType"]';
    static $sex            = 'select[name="sex"]';
    static $project        = 'select[name="project"]';
    static $advancedFilter = "div:nth-child(2) > .btn:nth-child(1)";
    // advanced filter
    static $scanDone    = 'select[name="scanDone"]';
    static $Participant = 'select[name="participantStatus"]';
    static $dob         = 'input[name="DoB"]';
    static $visitCount  = 'input[name="visitCount"]';
    static $feedback    = 'select[name="feedback"]';
    static $lastVisit   = 'select[name="latestVisitStatus"]';
    static $edc         = 'input[name="edc"]';






    static $openProfile = "div:nth-child(2) > .btn:nth-child(2)";
    static $clearFilter = ".nav-tabs a";
    static $display     = ".table-header > div > div > div:nth-child(1)";
    static $pscidLink   = "tr:nth-child(1) a";

    /**
     * Backs up the useEDC config value and sets the value to a known
     * value (true) for testing.
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
        $this->setupConfigSetting("useEDC", "true");
    }

    /**
     * Restore the values backed up in the setUp function
     *
     * @return void
     */
    function tearDown(): void
    {
        parent::tearDown();
        $this->restoreConfigSetting("useEDC");
    }
    /**
     * Tests that, the homepage should not have "You do not have access
     * to this page." on the page with permission.
     *
     * @return void
     */
    function testPageLoadsWithoutPermissionsAccessAllProfiles()
    {
        $this->setupPermissions(["access_all_profiles"]);
        $this->safeGet($this->url . "/candidate_list/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests that, when loading the candidate_list module, the breadcrumb
     * appears and the default filters are set to "Basic" mode.
     *
     * @return void
     */
    function testCandidateListPageLoads()
    {
        $this->safeGet($this->url . "/candidate_list/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Access Profile", $bodyText);
        // Ensure that the default is basic mode (which means the button
        // says "Advanced")
        $btn        = self::$advancedFilter;
        $buttonText = $this->safeFindElement(
            WebDriverBy::cssSelector($btn)
        )->getText();
        $this->assertContains("Advanced", $buttonText);
    }
    /**
     * Tests that, after clicking the "Advanced" button, all of the
     * advanced filters appear on the page and are the correct element type.
     *
     * @return void
     */
    function testCandidateListAdvancedOptionsAppear()
    {
        $this->safeGet($this->url . "/candidate_list/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Access Profile", $bodyText);
        // Switch to Advanced mode
        $btn = self::$advancedFilter;
        $this->safeClick(WebDriverBy::cssSelector($btn));
           // Go through each element and ensure it's on the page after clicking
           // advanced
        $scanDoneOptions = $this->safeFindElement(
            WebDriverBy::Name("scanDone")
        );
           $this->assertEquals("select", $scanDoneOptions->getTagName());
        $participantsStatusOptions = $this->safeFindElement(
            WebDriverBy::Name("participantStatus")
        );
           $this->assertEquals("select", $participantsStatusOptions->getTagName());
           $dobOptions = $this->safeFindElement(WebDriverBy::Name("DoB"));
           $this->assertEquals("input", $dobOptions->getTagName());
           // Not currently done
           //$this->assertEquals("date",$dobOptions->getAttribute("type"));
           $sexOptions = $this->safeFindElement(WebDriverBy::Name("sex"));
           $this->assertEquals("select", $sexOptions->getTagName());
           $this->assertEquals("input", $dobOptions->getTagName());
           // Not currently done in Loris.
           //$this->assertEquals("number",$dobOptions->getAttribute("type"));
           //$this->assertEquals("0",$dobOptions->getAttribute("min"));
           $edcOptions = $this->safeFindElement(WebDriverBy::Name("edc"));
           $this->assertEquals("input", $edcOptions->getTagName());
           // Not currently done
           //$this->assertEquals("date",$edcOptions->getAttribute("type"));
        $latestVisitOptions = $this->safeFindElement(
            WebDriverBy::Name("latestVisitStatus")
        );
           $this->assertEquals("select", $latestVisitOptions->getTagName());
        $feedbackOptions = $this->safeFindElement(
            WebDriverBy::Name("feedback")
        );
           $this->assertEquals("select", $feedbackOptions->getTagName());
    }
    /**
     * Tests clear button in the form
     * The form should refreash and the data should be gone.
     *
     * @return void
     */
    function testFilters()
    {
        $this->safeGet($this->url . "/candidate_list/");
        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clearFilter,
            'test',
            "0 rows",
        );
        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clearFilter,
            'MTL001',
            "1 rows"
        );
        $this->_filterTest(
            self::$DCCID,
            self::$display,
            self::$clearFilter,
            '300001',
            "1 rows"
        );
        $this->_filterTest(
            self::$DCCID,
            self::$display,
            self::$clearFilter,
            'test',
            '0 row'
        );
        $this->_filterTest(
            self::$visitLabel,
            self::$display,
            self::$clearFilter,
            'V1',
            "362"
        );
        $this->_filterTest(
            self::$visitLabel,
            self::$display,
            self::$clearFilter,
            'V2',
            "223"
        );
        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clearFilter,
            'Data Coordinating Center',
            '7 rows'
        );
        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clearFilter,
            "Montreal",
            '165'
        );
        $this->_filterTest(
            self::$entityType,
            self::$display,
            self::$clearFilter,
            "Human",
            '436'
        );
        $this->safeClick(WebDriverBy::cssSelector(self::$advancedFilter));
        $this->_filterTest(
            self::$sex,
            self::$display,
            self::$clearFilter,
            "Female",
            '225'
        );
        $this->_filterTest(
            self::$sex,
            self::$display,
            self::$clearFilter,
            "Male",
            '210'
        );
        $this->_filterTest(
            self::$scanDone,
            self::$display,
            self::$clearFilter,
            "Yes",
            '17 rows'
        );
        $this->_filterTest(
            self::$Participant,
            self::$display,
            self::$clearFilter,
            "Active",
            '436'
        );
        $this->_filterTest(
            self::$dob,
            self::$display,
            self::$clearFilter,
            "2003-06-30",
            '1 row'
        );
        $this->_filterTest(
            self::$visitCount,
            self::$display,
            self::$clearFilter,
            "3",
            '79'
        );
        $this->_filterTest(
            self::$feedback,
            self::$display,
            self::$clearFilter,
            "closed",
            '11 rows'
        );
        $this->_filterTest(
            self::$lastVisit,
            self::$display,
            self::$clearFilter,
            "Visit",
            '413'
        );
        $this->_filterTest(
            self::$edc,
            self::$display,
            self::$clearFilter,
            "2003-07-30",
            '1 row'
        );
    }
    /**
     * Tests that, when user only has data_entry permisson, user
     * can click open profile button to input PSCID and DCCID
     *
     * @return void
     */
    function testDataEntryAndOpenProfile()
    {
        $this->setupPermissions(["data_entry"]);
        $this->safeGet($this->url . "/candidate_list/");
        //click open profile button
        $btn = self::$openProfile;
        $this->safeClick(WebDriverBy::cssSelector($btn));
        // input PSCID and DCCID
        $dccid = "#lorisworkspace > div > div:nth-child(1) > div >".
                 " div:nth-child(2)>form>div>div:nth-child(1)>div>div>input";
        $pscid = "#lorisworkspace > div > div:nth-child(1) > div >".
                 " div:nth-child(2)>form>div>div:nth-child(2)>div>div>input";
        // to do react input value
        $this->webDriver->executeScript(
            "input = document.querySelector('$dccid');
                 lastValue = input.value;
                 input.value = '300001';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);"
        );
        $this->webDriver->executeScript(
            "input = document.querySelector('$pscid');
                 lastValue = input.value;
                 input.value = 'MTL001';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);"
        );
        $btn = ".col-sm-12 > .row .btn";
        //to do check the url
        $this->safeClick(WebDriverBy::cssSelector($btn));
        $URL =  $this->webDriver->executeScript("return window.location.href;");
        $this->assertContains("300001", $URL);
        $this->resetPermissions();
    }
    /**
     * Tests that, click the pscid link, and it will goto the candidate profile page
     *
     * @return void
     */
    function testPscidLink()
    {
        $this->safeGet($this->url . "/candidate_list/");
        $link = self::$pscidLink;
        $this->safeClick(WebDriverBy::cssSelector($link));
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
            "Candidate Profile",
            $bodyText
        );
    }

}
