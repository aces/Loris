<?php
/**
 * Candidate_list automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
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
    static $PSCID          = ".col-xs-12:nth-child(2) > .row .form-control";
    static $DCCID          = ".col-xs-12:nth-child(3) > .row .form-control";
    static $visitLabel     = ".col-xs-12:nth-child(4) .form-control";
    static $site           = ".col-xs-12:nth-child(5) .form-control, select";
    static $entityType     = ".col-xs-12:nth-child(7) .form-control, select";
    static $sex            = "#candidateList_filter > div > div > fieldset >".
                             " div:nth-child(11) > div > div > select";
    static $project        = ".col-xs-12:nth-child(15) .form-control, select";
    static $advancedFilter = ".table-header > div > div > div:nth-child(2) >".
                             " button:nth-child(1)";
    static $openProfile    = ".table-header > div > div > div:nth-child(2) >".
                             " button:nth-child(2)";
    static $clearFilter    = ".col-sm-9 > .btn";
    static $display        = ".table-header > div > div > div:nth-child(1)";
    static $pscidLink      = "tr:nth-child(1) a";

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
    function tearDown()
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
        $this->setupPermissions(array("access_all_profiles"));
        $this->safeGet($this->url . "/candidate_list/");
        $bodyText = $this->getReactElementContent("body");
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
        $bodyText = $this->getReactElementContent("body");
        $this->assertContains("Access Profile", $bodyText);
        // Ensure that the default is basic mode (which means the button
        // says "Advanced")
        $btn        = self::$advancedFilter;
        $buttonText = $this->getReactElementContent($btn);
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
        // Switch to Advanced mode
         $btn = self::$advancedFilter;
         $this->clickReactElement($btn);
           // Go through each element and ensure it's on the page after clicking
           // advanced
         $filter = $this->getReactElementContent("fieldset");
         $this->assertContains("Scan Done", $filter);
         $this->assertContains("Participant Status", $filter);
         $this->assertContains("DoB", $filter);
         $this->assertContains("Sex", $filter);
         $this->assertContains("VisitCount", $filter);
         $this->assertContains("Feedback", $filter);
         $this->assertContains("Latest Visit Status", $filter);
          // click hidden filter button
         $hideBtn = "div:nth-child(2) > .btn:nth-child(1)";
         $this->clickReactElement($hideBtn);
         $filter = $this->getReactElementContent("fieldset");
         $this->assertNotContains("Scan Done", $filter);
         $this->assertNotContains("Participant Status", $filter);
         $this->assertNotContains("DoB", $filter);
         $this->assertNotContains("Sex", $filter);
         $this->assertNotContains("VisitCount", $filter);
         $this->assertNotContains("Feedback", $filter);
         $this->assertNotContains("Latest Visit Status", $filter);
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
        $row = self::$display;
        $btn = self::$clearFilter;
        //testing data from RBdata.sql
        $this->_testFilter(self::$PSCID, "0 rows", "test", $row, $btn);
        $this->_testFilter(self::$PSCID, "1 rows", "MTL001", $row, $btn);
        $this->_testFilter(self::$DCCID, "1 rows", "300001", $row, $btn);
        $this->_testFilter(self::$DCCID, "0 rows", "test", $row, $btn);
        $this->_testFilter(self::$visitLabel, "374", "V1", $row, $btn);
        $this->_testFilter(self::$visitLabel, "261", "V2", $row, $btn);
        $this->_testFilter(self::$site, "8 rows", '1', $row, $btn);
        $this->_testFilter(self::$site, "168", '2', $row, $btn);
        $this->_testFilter(self::$entityType, "8 rows", '1', $row, $btn);
        //test advanced filter - sex
        //Switch to Advanced mode
        $this->clickReactElement(self::$advancedFilter);
        //female
        $this-> _testFilter(self::$sex, "20 rows displayed of 334", '1', $row, $btn);
        // male
        $this-> _testFilter(self::$sex, "20 rows displayed of 328", '2', $row, $btn);
    }
    /**
     * Tests that, when user only has data_entry permisson, user
     * can click open profile button to input PSCID and DCCID
     *
     * @return void
     */
    function testDataEntryAndOpenProfile()
    {
        $this->setupPermissions(array("data_entry"));
        $this->safeGet($this->url . "/candidate_list/");
        //click open profile button
        $btn = self::$openProfile;
        $this->clickReactElement($btn);
        // input PSCID and DCCID
        $dccid = "#lorisworkspace > div > div:nth-child(1) > div >".
                 " div:nth-child(2)>form>div>div:nth-child(1)>div>div>input";
        $pscid = "#lorisworkspace > div > div:nth-child(1) > div >".
                 " div:nth-child(2)>form>div>div:nth-child(2)>div>div>input";
        // to do react input value
        $this->reactTextSendKey($dccid, "300001");
        $this->reactTextSendKey($pscid, "MTL001");
        $btn = ".col-sm-12 > .row .btn";
        $this->clickReactElement($btn);
        sleep(1);
        //to do check the url
        $URL =  $this->webDriver->executescript("return window.location.href;");
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
        $this->clickReactElement($link);
        $bodyText = $this->getReactElementContent('.btn:nth-child(3) > div');
        $this->assertContains(
            "Candidate Profile",
            $bodyText
        );
    }

}
