<?php
/**
 * new_profile automated integration tests
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
class newProfileTestIntegrationTest extends LorisIntegrationTest
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
        $this->setUpConfigSetting("useProjects", "true");

        $this->webDriver->get($this->url . "?test_name=new_profile");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("New Profile", $bodyText);

        $dobField = $this->webDriver->findElement(WebDriverBy::Name("dob1"));
        $this->assertEquals("input", $dobField->getTagName());
        //$this->assertEquals("date", $dobField->getAttribute("type"));

        $dob2Field = $this->webDriver->findElement(WebDriverBy::Name("dob2"));
        $this->assertEquals("input", $dob2Field->getTagName());
        //$this->assertEquals("date", $dob2Field->getAttribute("type"));

        $edcField = $this->webDriver->findElement(WebDriverBy::Name("edc1"));
        $this->assertEquals("input", $edcField->getTagName());
        //$this->assertEquals("date", $edcField->getAttribute("type"));

        $edc2Field = $this->webDriver->findElement(WebDriverBy::Name("edc2"));
        $this->assertEquals("input", $edc2Field->getTagName());
        //$this->assertEquals("date", $edc2Field->getAttribute("type"));

        $genderField = $this->webDriver->findElement(WebDriverBy::Name("gender"));
        $this->assertEquals("select", $genderField->getTagName());

        $projectField = $this->webDriver->findElement(WebDriverBy::Name("ProjectID"));
        $this->assertEquals("select", $projectField->getTagName());

        $this->restoreConfigSetting("useEDC");
        $this->restoreConfigSetting("useProjects");
    }

    /**
     * Tests that with useProjects turned off, project related fields do not
     * appear on the page
     *
     * @return none
     */
    function testNewProfileLoadsWithoutProjects() {
        $this->setUpConfigSetting("useProjects", "false");

        $this->webDriver->get($this->url . "?test_name=new_profile");

        try {
            $projectField = $this->webDriver->findElement(WebDriverBy::Name("ProjectID"));
        } catch(NoSuchElementException $e) {
            $projectField = null;
        }
        $this->assertNull($projectField);

        $this->restoreConfigSetting("useProjects");
    }

    /**
     * Tests that with useEDC turned off, edc related fields do not appear
     * on the page.
     *
     * @return none
     */
    function testNewProfileLoadsWithoutEDC() {
        $this->setUpConfigSetting("useEDC", "false");

        $this->webDriver->get($this->url . "?test_name=new_profile");

        try {
            $edc1 = $this->webDriver->findElement(WebDriverBy::Name("edc1"));
        } catch(NoSuchElementException $e) {
            $edc1 = null;
        }
        $this->assertNull($edc1);

        try {
            $edc2 = $this->webDriver->findElement(WebDriverBy::Name("edc2"));
        } catch(NoSuchElementException $e) {
            $edc2 = null;
        }

        $this->assertNull($edc2);
        $this->restoreConfigSetting("useEDC");
    }
}
?>
