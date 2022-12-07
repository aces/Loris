<?php
/**
 * Candidate_profile automated integration tests
 *
 * PHP Version 7
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
     * Test that the page instrument link works on card 2 section
     *
     * @return void
     */
    function testCandidateProfileInstrumentLink1()
    {
        $this->safeGet($this->url . "/candidate_profile/900000/");
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#card2 > div:nth-child(1) >".
                "div:nth-child(1)>div:nth-child(1)>div:nth-child(1)>div:nth-".
                "child(1)> div:nth-child(2) > h4:nth-child(1) > a:nth-child(1)"
            )
        )->click();
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString(
            "Behavioural Battery of Instruments",
            $bodyText
        );
    }
    /**
     * Test that the page instrument link works on card 1 section
     *
     * @return void
     */
    function testCandidateProfileInstrumentLink2()
    {
        $this->safeGet($this->url . "/candidate_profile/900000/");
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#card0 > div:nth-child(1) >".
                "div:nth-child(1)>div:nth-child(1)>dl:nth-child(1)>div:nth-".
                "child(9)>dd:nth-child(2) > div:nth-child(1) > a:nth-child(1)"
            )
        )->click();
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString(
            "Behavioural Battery of Instruments",
            $bodyText
        );
    }
}
