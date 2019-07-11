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
    static $advancedFilter = ".pull-right > .btn:nth-child(1)";
    static $openProfile    = ".pull-right > .btn:nth-child(2)";
    static $clearFilter    =".col-sm-9 > .btn";
    static $display        = ".table-header .col-xs-12 > div:nth-child(1)";
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
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
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
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
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
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);
        // Switch to Advanced mode
         $btn = self::$advancedFilter;
         $this->clickReactElement($btn);
           // Go through each element and ensure it's on the page after clicking
           // advanced
         $scanDone  = ".col-xs-12:nth-child(8) .col-sm-3";
         $scan_text = $this->getReactElementContent($scanDone);
          $this->assertContains("Scan Done", $scan_text);

           $participantsStatusOptions = $this->webDriver->findElement(
               WebDriverBy::Name("participantStatus")
           );
           $this->assertEquals("select", $participantsStatusOptions->getTagName());
           $dobOptions = $this->webDriver->findElement(WebDriverBy::Name("DoB"));
           $this->assertEquals("input", $dobOptions->getTagName());
           // Not currently done
           //$this->assertEquals("date",$dobOptions->getAttribute("type"));
           $sexOptions = $this->webDriver->findElement(WebDriverBy::Name("sex"));
           $this->assertEquals("select", $sexOptions->getTagName());
           $numVisits = $this->webDriver->findElement(
               WebDriverBy::Name("visitCount")
           );
           $this->assertEquals("input", $dobOptions->getTagName());
           // Not currently done in Loris.
           //$this->assertEquals("number",$dobOptions->getAttribute("type"));
           //$this->assertEquals("0",$dobOptions->getAttribute("min"));
           $edcOptions = $this->webDriver->findElement(WebDriverBy::Name("edc"));
           $this->assertEquals("input", $edcOptions->getTagName());
           // Not currently done
           //$this->assertEquals("date",$edcOptions->getAttribute("type"));
           $latestVisitOptions = $this->webDriver->findElement(
               WebDriverBy::Name("latestVisitStatus")
           );
           $this->assertEquals("select", $latestVisitOptions->getTagName());
           $feedbackOptions = $this->webDriver->findElement(
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

        //testing data from RBdata.sql

        $this-> _testFilter(self::$PSCID, "0 rows", 'test');
        $this-> _testFilter(self::$PSCID, "1 rows", 'MTL001');
        $this-> _testFilter(self::$DCCID, "1 rows", '300001');
        $this-> _testFilter(self::$DCCID, "0 rows", 'test');
        $this-> _testFilter(self::$visitLabel, "374", 'V1');
        $this-> _testFilter(self::$visitLabel, "261", 'V2');
        $this-> _testFilter(self::$site, "8 rows", '1');
        $this-> _testFilter(self::$site, "167", '2');
        $this-> _testFilter(self::$entityType, "8 rows", '1');

        // test advanced filter - sex
        // Switch to Advanced mode
         $btn = self::$advancedFilter;
         $this->clickReactElement($btn);
           //female
           $this-> _testFilter(self::$sex, "20 rows displayed of 334", '1');
           // male
           $this-> _testFilter(self::$sex, "20 rows displayed of 328", '2');

    }
    /**
     * Testing filter funtion and clear button
     *
     * @param string $element The input element loaction
     * @param string $records The records number in the table
     * @param string $value   The test value
     *
     * @return void
     */
    function _testFilter($element,$records,$value)
    {
        // get element from the page
        if (strpos($element, "select") === false) {
            $this->reactTextSendKey($element, $value);
        } else {
            $this->reactDropdownSendKey($element, $value);
        }
            $row      = self::$display;
            $bodyText = $this->getReactElementContent($row);
            // 4 means there are 4 records under this site.
            $this->assertContains($records, $bodyText);
            //test clear filter
            $btn = self::$clearFilter;
            $this->clickReactElement($btn);
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
        //to do check the url
        $this->clickReactElement($btn);
        sleep(2);
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
                $bodyText = $this->webDriver
                    ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains(
            "Candidate Profile",
            $bodyText
        );
    }

}
