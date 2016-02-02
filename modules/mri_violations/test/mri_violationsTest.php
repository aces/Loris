<?php
/**
 * Mri_violations automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class MriViolationsTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Mri_violations module, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriViolationsDoesPageLoad()
    {
        $this->webDriver->get($this->url . "/mri_violations/");
        sleep(2);
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Mri Violations", $bodyText);
    }

    /**
     * Tests that, when loading the Mri_violations module > mri_protocol_check_violations submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriProtocolCheckViolationsDoesPageLoad()
    {
        $this->webDriver->get($this->url . "/mri_violations/mri_protocol_check_violations/");
        sleep(2);
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Mri Violations", $bodyText,
            "Mri Violations module page did not load as expected.");
    }

    /**
     * Verify that MRI Violations module appears in Admin main menu only
     * if the user has permission "violated_scans_view_allsites".
     *
     * @return void
     */
    public function testMriViolationsMenuDisplayWithPermission()
    {
        $this->setupPermissions(array('violated_scans_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->assertTrue(
            $this->isMenuItemPresent('Imaging', 'MRI Violated Scans'),
            "MRI Violations menu must be there if the user has permission"
        );
    }

    /**
     * Verify that MRI Violations module DOES NOT appear in Imaging menu
     * if the user doesn't have permission "violated_scans_view_allsites".
     *
     * @return void
     */
    public function testMriViolationsMenuDisplayWithoutPermission()
    {
        $this->setupPermissions(array());
        $this->webDriver->navigate()->refresh();
        $this->assertFalse(
            $this->isMenuItemPresent('Imaging', 'MRI Violated Scans'),
            "MRI Violations menu must not be there if the user does not ".
            "have permission"
        );
    }

    /**
     * Verify that MRI Violations module
     *
     * @return void
     */
    public function testMriViolationsFilterResults()
    {
        $this->webDriver->get($this->url . "/mri_violations/");
        $this->webDriver->wait(120, 1000)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::Name("filter")
            )
        );
        $this->assertContains("Show Data", $this->webDriver->getPageSource());
        $showDataButton = $this->webDriver
            ->findElement(WebDriverBy::Name("filter"));
        //$showDataButton = $this->webDriver
        //    ->findElement(WebDriverBy::cssSelector("input.col-xs-12.btn-primary.btn-sm.btn[value='Show Data'][name='filter'][type='submit']"));

        $showDataButton->click();
        sleep(3);
        $assertText = $this->webDriver->findElement(WebDriverBy::xPath('//*[@id="page"]/div/div[1]/a/label'))->getText();
        $this->assertContains("Mri Violations", $assertText,
            "MRI Violations menu filter did not reload page as expected.");
    }

}
?>