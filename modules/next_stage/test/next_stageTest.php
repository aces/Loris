<?php
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
        $this->webDriver->get(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Next Stage", $bodyText);
    }
    /**
     * Tests that, page loads with data_entry permission
     *
     * @return void
     */
    function testNextStageDoesPageLoadWithPermission()
    {
        $this->setupPermissions(array("data_entry"));
        $this->webDriver->get(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Next Stage", $bodyText);
        $this->resetPermissions();
    }

    /**
     * Tests that, page does not loads without data_entry permission
     *
     * @return void
     */
    function testNextStageDoesNotPageLoadWithoutPermission()
    {
        $this->setupPermissions(array());
        $this->webDriver->get(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
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
        // Change users CenterID
        $this->changeStudySite();

        // Check to make sure page doesn't load without permission
        $this->setupPermissions(array());
        $this->webDriver->get(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();

        // Check to make sure page doesn't load with permission
        $this->setupPermissions(array("data_entry"));
        $this->webDriver->get(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
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
        $this->webDriver->get(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2015-01-02'"
        );
        $scanDone = $this->webDriver->findElement(
            WebDriverBy::Name("scan_done")
        );
        $scanDone->sendKeys("No");

        $Subproject = $this->webDriver->findElement(
            WebDriverBy::Name("SubprojectID")
        );
        $Subproject->sendKeys("Control");

        $startVisit = $this->webDriver->findElement(
            WebDriverBy::Name("fire_away")
        );
        $startVisit->submit();

        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Both Date fields must match.", $bodyText);
    }

    /**
     * Tests that page returns success when inputed correctly
     *
     * @return void
     */
    function testNextStageSuccess()
    {
        $this->webDriver->get(
            $this->url .
            "/next_stage/?candID=900000&sessionID=999999&identifier=999999"
        );
        sleep(5);
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2015-01-01'"
        );
        $scanDone = $this->webDriver->findElement(
            WebDriverBy::Name("scan_done")
        );
        $scanDone->sendKeys("No");

        $Subproject = $this->webDriver->findElement(
            WebDriverBy::Name("SubprojectID")
        );
        $Subproject->sendKeys("Fresh");

        $startVisit = $this->webDriver->findElement(
            WebDriverBy::Name("fire_away")
        );
        $startVisit->submit();

        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Next stage started.", $bodyText);
    }
}

