<?php
/**
 * Electrophysiology Browser automated integration tests
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
require_once __DIR__ . "/../../../test/integrationtests/"
    . "LorisIntegrationTestWithCandidate.class.inc";

/**
 * Implements automated integration tests for Electrophysiology Browser within Loris
 *
 * @category Test
 * @package  Loris
 * @author   Alexandra Livadas <alexandra.livadas@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class EEGBrowserIntegrationTest extends LorisIntegrationTestWithCandidate
{
    /**
     * Tests that the page loads
     *
     * @return void
     */
    function testEEGBrowserDoesPageLoad()
    {
        $this->safeGet($this->url . "/electrophysiology_browser/?");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertContains("Electrophysiology Browser", $bodyText);
    }

    /**
     * Test that the page does not load if the user doesn't have permissions
     *
     * @return void
     */
    function testEEGBrowserWithoutPermissions()
    {
        $this->setupPermissions([]);
        $this->safeGet($this->url . "/electrophysiology_browser/?");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }

    /**
     * Test that the page loads if the user has the given permissions
     *
     * @return void
     */
    function testEEGBrowserWithPermissions()
    {
        $this->setupPermissions(['electrophysiology_browser_view_site']);
        $this->safeGet($this->url . "/electrophysiology_browser/?");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();

        $this->setupPermissions(['electrophysiology_browser_view_allsites']);
        $this->safeGet($this->url . "/electrophysiology_browser/?");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }

    /**
     * Test that the EEG Browser still loads if the user has a different site but
     * has 'electrophysiology_browser_view_allsites' permissions
     *
     * @return void
     */
    function testEEGBrowserWithSitePermissions()
    {
        $this->resetStudySite();
        $this->changeStudySite();
        $this->setupPermissions(['electrophysiology_browser_view_allsites']);
        $this->safeGet($this->url . "/electrophysiology_browser/?");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
        $this->resetStudySite();
    }

    /**
     * Test that the sessions page loads
     *
     * @return void
     */
    function testSessionsDoesPageLoad()
    {
        $this->safeGet($this->url . "/electrophysiology_browser/sessions/999999");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertContains("Electrophysiology Browser", $bodyText);
    }
}

?>

