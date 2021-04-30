<?php
/**
 * New_profile automated integration tests
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
use Facebook\WebDriver\WebDriverSelect;
use Facebook\WebDriver\WebDriverExpectedCondition;

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * New_profile automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class NewProfileTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the new_profile module with all settings
     * enabled, the correct fields all appear in the body.
     *
     * @return void
     */
    function testNewProfilePageLoads()
    {
        $this->setUpConfigSetting("useEDC", "true");
        $this->safeGet($this->url . "/new_profile/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("New Profile", $bodyText);
        // check EDC shows on the page
        $value = "#lorisworkspace > fieldset > div > form > div > div:nth-child(3)>".
                 " div > div:nth-child(1) > label";
        $EDC   = $this->safeFindElement(
            WebDriverBy::cssSelector($value)
        )->getText();
        $this->assertStringContainsString("Expected Date of Confinement", $EDC);
        // check Project shows on the page
        $value   = "#lorisworkspace > fieldset > div > form>div>div:nth-child(7)>".
                   " div > label";
        $project = $this->safeFindElement(
            WebDriverBy::cssSelector($value)
        )->getText();
        $this->assertStringContainsString("Project", $project);

        $this->restoreConfigSetting("useEDC");
    }

    /**
     * Tests that candidate is created
     *
     * @return void
     */
    function testNewProfileCreateCandidate(): void
    {
        $this->setUpConfigSetting("useEDC", "false");
        $this->safeGet($this->url . "/new_profile/");
        $this->safeFindElement(
            WebDriverBy::Name("dobDate")
        )->sendKeys("2020-02-28");
        $this->safeFindElement(
            WebDriverBy::Name("dobDateConfirm")
        )->sendKeys("2020-02-28");

        $el_dropdown = new WebDriverSelect(
            $this->safeFindElement(WebDriverBy::Name("sex"))
        );
        $el_dropdown->selectByVisibleText("Male");
        $el_dropdown = new WebDriverSelect(
            $this->safeFindElement(WebDriverBy::Name("project"))
        );
        $el_dropdown->selectByVisibleText("DCP");

        $el_dropdown = new WebDriverSelect(
            $this->safeFindElement(WebDriverBy::Name("site"))
        );
        $el_dropdown->selectByVisibleText("Data Coordinating Center");
        $this->safeClick(WebDriverBy::Name("fire_away"));
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#lorisworkspace > fieldset > div > div > p:nth-child(1)"
            )
        )->getText();
        $this->assertStringContainsString("New candidate created.", $bodyText);
        $this->restoreConfigSetting("useEDC");
    }
}
