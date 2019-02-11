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
    static $project        = ".col-xs-12:nth-child(6) .form-control, select";
    static $sex            = "#candidateList_filter > div > div > fieldset >".
                             " div:nth-child(12) > div > div > select";
    static $entityType     = ".col-xs-12:nth-child(8) .form-control, select";
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
        $this->setUpConfigSetting("useProjects", "true");
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
        $this->restoreConfigSetting("useProjects");
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
         $btn           = self::$advancedFilter;
            $buttonText = $this->webDriver->executescript(
                "return document.querySelector('$btn').textContent"
            );
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
           $this->webDriver->executescript(
               "return document.querySelector('$btn').click()"
           );
           // Go through each element and ensure it's on the page after clicking
           // advanced
           $scanDoneOptions = $this->webDriver->findElement(
               WebDriverBy::Name("scanDone")
           );
           $this->assertEquals("select", $scanDoneOptions->getTagName());
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
        $this-> _testFilter(self::$visitLabel, "370", 'V1');
        $this-> _testFilter(self::$visitLabel, "258", 'V2');
        $this-> _testFilter(self::$site, "3 rows", '1');
        $this-> _testFilter(self::$site, "167", '2');
        $this-> _testFilter(self::$entityType, "3 rows", '1');

        // test advanced filter - sex
        // Switch to Advanced mode
         $btn = self::$advancedFilter;
           $this->webDriver->executescript(
               "return document.querySelector('$btn').click()"
           );
           //female
           $this-> _testFilter(self::$sex, "20 rows displayed of 331", '1');
           // male
           $this-> _testFilter(self::$sex, "20 rows displayed of 326", '2');

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
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 lastValue = input.value;
                 input.value = '$value';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);
                "
            );
        } else {
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
        }
            $row      = self::$display;
            $bodyText = $this->webDriver->executescript(
                "return document.querySelector('$row').textContent"
            );
            // 4 means there are 4 records under this site.
            $this->assertContains($records, $bodyText);
            //test clear filter
            $btn = self::$clearFilter;
            $this->webDriver->executescript(
                "document.querySelector('$btn').click();"
            );
            $inputText = $this->webDriver->executescript(
                "return document.querySelector('$element').value"
            );
            $this->assertEquals("", $inputText);
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
        $this->webDriver->executescript(
            "document.querySelector('$btn').click();"
        );
        // input PSCID and DCCID
        $dccid = "#lorisworkspace > div > div:nth-child(1) > div >".
                 " div:nth-child(2)>form>div>div:nth-child(1)>div>div>input";
        $pscid = "#lorisworkspace > div > div:nth-child(1) > div >".
                 " div:nth-child(2)>form>div>div:nth-child(2)>div>div>input";
        // to do react input value
        $this->webDriver->executescript(
            "input = document.querySelector('$dccid');
                 lastValue = input.value;
                 input.value = '300001';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);"
        );
        $this->webDriver->executescript(
            "input = document.querySelector('$pscid');
                 lastValue = input.value;
                 input.value = 'MTL001';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);"
        );
        $btn = ".col-sm-12 > .row .btn";
        //to do check the url
        $this->webDriver->executescript(
            "document.querySelector('$btn').click();"
        );sleep(2);
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
        $this->webDriver->executescript(
            "document.querySelector('$link').click();"
        );
                $bodyText = $this->webDriver
                    ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains(
            "Candidate Profile",
            $bodyText
        );
    }

}
