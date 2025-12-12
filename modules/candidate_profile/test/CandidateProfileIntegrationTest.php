<?php declare(strict_types=1);

/**
 * Candidate_profile automated integration tests
 *
 * PHP Version 8
 *
 * @category Test
 * @package  Loris
 * @author   Alexandra Livadas <alexandra.livadas@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;

require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTestWithCandidate.class.inc";
/**
 * CandidateProfileIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Alexandra Livadas <alexandra.livadas@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CandidateProfileIntegrationTest extends LorisIntegrationTestWithCandidate
{
    /**
     * Tests that the page loads
     *
     * @return void
     */
    function testCandidateProfileDoespageLoad()
    {
        $this->safeGet($this->url . "/candidate_profile/900000/");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("#breadcrumbs"))
            ->getText();
        $this->assertStringContainsString(
            "Candidate Dashboard 900000 / TST0001",
            $bodyText
        );
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
     * Test that the page does not load if the user's study site does not
     * match the candidate's
     *
     * @return void
     */
    function testCandidateProfileWithoutSitePermissions()
    {
        $this->resetStudySite();
        $this->changeStudySite();
        $this->setupPermissions(["data_entry"]);
        $this->safeGet($this->url . "/candidate_profile/900000/");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString("Permission Denied", $bodyText);
        $this->resetPermissions();

        $this->resetStudySite();
    }

    /**
     * Test that the page does not load if the user's project does not
     * match the candidate's
     *
     * @return void
     */
    function testCandidateProfileWithoutProjectPermissions()
    {
        $this->resetUserProject();
        $this->changeUserProject();
        $this->setupPermissions(["data_entry"]);
        $this->safeGet($this->url . "/candidate_profile/900000/");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString("Permission Denied", $bodyText);
        $this->resetPermissions();

        $this->resetUserProject();
    }

    /**
     * Test that the page instrument link works on card section
     *
     * @return void
     */
    function testCandidateProfileInstrumentLink()
    {
                $this->setupPermissions(['superuser']);

        $this->safeGet($this->url . "/candidate_profile/115788/");
        $this->safeClick(
            WebDriverBy::cssSelector(
                '#card0 > div > div > div >'.
                ' dl > div:nth-child(9) > dd > div > a:nth-child(1)'
            )
        );

        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString(
            "Behavioural Battery of Instruments",
            $bodyText
        );
    }
}
