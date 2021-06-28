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
    public $dateTaken  = "#default-panel > div > form >".
                         " div > div:nth-child(2) > div > div > input";
    public $dtc        = "#default-panel > div > form >".
                         " div > div:nth-child(3) > div > div > input";
    public $edc        = "#default-panel > div > form >".
                         " div > div:nth-child(4)>div>div:nth-child(1)>div>input";
    public $edcConfirm = "#default-panel > div > form >".
                         " div > div:nth-child(4)>div>div:nth-child(2)>div>input";
    public $sex        = "#default-panel > div > form >".
                         " div > div:nth-child(5) > div > div > select";
    public $site       = "#default-panel > div > form >".
                         " div > div:nth-child(6) > div > div > select";
    public $btn        = "#default-panel > div > form >".
                         " div > div:nth-child(9) > div > div > button";
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
        $this->markTestSkipped(
            'Skipping tests until Travis and React get along better'
        );
        $this->setUpConfigSetting("useEDC", "false");
        $this->webDriver->get($this->url . "/new_profile/");
        // send a key to sex
        $this->webDriver->executescript(
            "document.querySelector('$this->sex').value='male'"
        );
        // send a key to site
        $this->webDriver->executescript(
            "document.querySelector('$this->site').value='1'"
        );

        $this->webDriver->executescript(
            "document.querySelector('$this->dateTaken').value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.querySelector('$this->dtc').value='2015-01-01'"
        );

        $this->webDriver->executescript(
            "document.querySelector('$this->btn').click()"
        );
        $bodyText = $this->webDriver->executescript(
            "return document.querySelector('#default-panel').textContent"
        );

        $this->assertStringContainsString("New candidate created.", $bodyText);
        $this->restoreConfigSetting("useEDC");
    }

}
