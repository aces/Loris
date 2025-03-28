<?php declare(strict_types=1);

/**
 * Next_stage automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__ .
 "/../../../test/integrationtests/LorisIntegrationTestWithCandidate.class.inc";
/**
 * Next_stage automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class NextStageTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    /**
     * Tests that, when loading the Next_stage module, some
     * text appears in the body.
     *
     * @return void
     */
    function testNextStageDoespageLoad()
    {
        // $this->markTestSkipped(
        //"Permissions not correctly set up for next_page test");
        $this->safeGet(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Next Stage", $bodyText);
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
    }
    /**
     * Tests that, page loads with data_entry permission
     *
     * @return void
     */
    function testNextStageDoesPageLoadWithPermission()
    {
        $this->setupPermissions(["data_entry"]);
        $this->safeGet(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Next Stage", $bodyText);
        $this->resetPermissions();
    }

    /**
     * Tests that, page does not loads without data_entry permission
     *
     * @return void
     */
    function testNextStageDoesNotPageLoadWithoutPermission()
    {
        $this->setupPermissions([]);
        $this->safeGet(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }

    /**
     * Tests that, page does not loads for different study site
     *
     * @return void
     */
    function testNextStageDoesNotPageLoadWithDifferentStudySite()
    {
        // Reset any leftover study site from a previous test.
        $this->resetStudySite();
        // Change users CenterID
        $this->changeStudySite();

        // Check to make sure page doesn't load without permission
        $this->setupPermissions([]);
        $this->safeGet(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();

        // Check to make sure page doesn't load with permission
        $this->setupPermissions(["data_entry"]);
        $this->safeGet(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();

        // Delete created center
        $this->resetStudySite();
    }

    /**
     * Tests that page returns error if dates dont match
     *
     * @return void
     */
    function testNextStageDateError()
    {
        $this->safeGet(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2015-01-02'"
        );

        $Cohort = $this->safeFindElement(
            WebDriverBy::Name("CohortID")
        );
        $Cohort->sendKeys("Control");

        $startVisit = $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        );
        $startVisit->submit();
        sleep(1);
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Both Date fields must match.", $bodyText);
    }

    /**
     * Tests that page returns success when inputed correctly
     *
     * @return void
     */
    function testNextStageSuccess()
    {
        $this->safeGet(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2015-01-01'"
        );

        $Cohort = $this->safeFindElement(
            WebDriverBy::Name("CohortID")
        );
        $Cohort->sendKeys("Fresh");

        $startVisit = $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        );
        $startVisit->submit();
        sleep(2);
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Next stage started.", $bodyText);
    }
}

