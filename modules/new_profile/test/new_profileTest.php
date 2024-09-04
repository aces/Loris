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
    public $dateTaken  = "input[name='dobDate']";
    public $dtc        = "input[name='dobDateConfirm']";
    public $edc        = "input[name='edcDate']";
    public $edcConfirm = "input[name='edcDateConfirm']";

    public $btn = "button[name='fire_away']";
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
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
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
        $this->webDriver->get($this->url . "/new_profile/");
        // send a key to sex
        $sexElement = $this->safeFindElement(WebDriverBy::Name('sex'));
        $sexOption  = new WebDriverSelect($sexElement);
        $sexOption->selectByValue("Male");
        $sexElement = $this->safeFindElement(WebDriverBy::Name('site'));
        $sexOption  = new WebDriverSelect($sexElement);
        $sexOption->selectByValue("1");
        $sexElement = $this->safeFindElement(WebDriverBy::Name('project'));
        $sexOption  = new WebDriverSelect($sexElement);
        $sexOption->selectByValue("Pumpernickel");

        $this->safeFindElement(
            WebDriverBy::cssSelector($this->dateTaken)
        )->sendKeys("2015-01-01");
        $this->safeFindElement(
            WebDriverBy::cssSelector($this->dtc)
        )->sendKeys("2015-01-01");
        $this->safeClick(WebDriverBy::cssSelector($this->btn));

        $swalTitle = $this->safeFindElement(
            WebDriverBy::Id("swal2-title")
        )->getText();
        $this->assertEquals("New Candidate Created", $swalTitle);
    }

}
