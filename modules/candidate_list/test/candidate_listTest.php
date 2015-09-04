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
    /**
     * Backs up the useEDC config value and sets the value to a known
     * value (true) for testing.
     *
     * @return none
     */
    function setUp()
    {
        parent::setUp();

        $this->setupConfigSetting("useEDC", "true");
    }

    /**
     * Restore the values backed up in the setUp function
     *
     * @return none
     */
    function tearDown()
    {
        parent::tearDown();
        $this->restoreConfigSetting("useEDC");
    }
    /**
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

    /**
     * Tests that, after clicking the "Advanced" button, all of the
     * advanced filters appear on the page and are the correct element type.
     *
     * @return void
     */
    function testCandidateListAdvancedOptionsAppear()
    {

        $this->webDriver->get($this->url . "?test_name=candidate_list");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Access Profile", $bodyText);

        // Switch to Advanced mode
        $basicButton = $this->webDriver->findElement(WebDriverBy::Name("advanced"));
        $basicButton->click();

        // Go through each element and ensure it's on the page after clicking
        // advanced
        $scanDoneOptions = $this->webDriver->findElement(
            WebDriverBy::Name("scan_done")
        );
        $this->assertEquals("select", $scanDoneOptions->getTagName());

        $participantsStatusOptions = $this->webDriver->findElement(
            WebDriverBy::Name("Participant_Status")
        );
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

        $latestVisitOptions = $this->webDriver->findElement(
            WebDriverBy::Name("Latest_Visit_Status")
        );
        $this->assertEquals("select", $latestVisitOptions->getTagName());

        $feedbackOptions = $this->webDriver->findElement(
            WebDriverBy::Name("Feedback")
        );
        $this->assertEquals("select", $feedbackOptions->getTagName());
    }
}
?>
