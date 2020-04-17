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
    static $PSCID          = ".col-xs-12:nth-child(2) > .row .form-control";
    static $DCCID          = ".col-xs-12:nth-child(3) > .row .form-control";
    static $visitLabel     = 'select[name="visitLabel"]';
    static $site           = 'select[name="site"]';
    static $entityType     = 'select[name="entityType"]';
    static $sex            = 'select[name="sex"]';
    static $project        = 'select[name="project"]';
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
        //testing is done with user affiliated to only site=1 and project=1
        //numbers below should reflect these affiliations.

        $this-> _testFilter(self::$PSCID, "0 rows", 'test');
        $this-> _testFilter(self::$PSCID, "1 rows", 'MTL001');
        $this-> _testFilter(self::$DCCID, "1 rows", '300001');
        $this-> _testFilter(self::$DCCID, "0 rows", 'test');
        $this-> _testFilter(self::$visitLabel, "362", '1');
        $this-> _testFilter(self::$visitLabel, "223", '2');
        $this-> _testFilter(self::$site, "7 rows", '1');
        $this-> _testFilter(self::$site, "165", '2');
        $this-> _testFilter(self::$entityType, "436", '1');

        // test advanced filter - sex
        // Switch to Advanced mode
         $btn = self::$advancedFilter;
        $this->safeClick(WebDriverBy::cssSelector($btn));

           //female
           $this-> _testFilter(self::$sex, "20 rows displayed of 225", '1');
           // male
           $this-> _testFilter(self::$sex, "20 rows displayed of 210", '2');

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
        $this->safeFindElement(WebDriverBy::cssSelector($element));
        if (strpos($element, "select") === false) {
            $this->webDriver->executeScript(
                "input = document.querySelector('$element');
                 lastValue = input.value;
                 input.value = '$value';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);"
            );
        } else {
            $this->webDriver->executeScript(
                "input = document.querySelector('$element');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
        }
            $row      = self::$display;
            $bodyText = $this->safeFindElement(
                WebDriverBy::cssSelector($row)
            )->getText();

            // 4 means there are 4 records under this site.
            $this->assertContains($records, $bodyText);
            //test clear filter
            $btn = self::$clearFilter;
            $this->safeClick(WebDriverBy::cssSelector($btn));

            $inputText = $this->webDriver->executeScript(
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
        $this->safeClick(WebDriverBy::cssSelector($btn));

        //to do check the url
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
        $this->markTestSkipped(
            'This test needs work. It is causing failures sometimes for '
            . 'unkown reasons.'
        );
        $this->safeGet($this->url . "/candidate_list/");
        $link = self::$pscidLink;
        $this->webDriver->executeScript(
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
