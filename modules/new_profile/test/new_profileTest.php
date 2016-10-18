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

        $this->safeGet($this->url . "/new_profile/");
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

        $this->safeGet($this->url . "/new_profile/");

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

        $this->safeGet($this->url . "/new_profile/");

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

    /*
     * Tests that page returns error if EDC dates dont match
     *
     * @return none
     */
    function testNewProfileEDCDateError() {
        $this->setUpConfigSetting("useEDC", "true");

        $this->webDriver->get($this->url . "/new_profile/");

        $dates = $this->webDriver->findElements(WebDriverBy::cssSelector(".input-date"));
        $dates[0]->sendKeys("01/01/2015");
        $dates[1]->sendKeys("01/01/2015");
        $dates[2]->sendKeys("01/01/2015");
        $dates[3]->sendKeys("01/02/2015");
        $this->safeFindElement(WebDriverBy::Xpath("//*[@id='footer']/div[1]"))
                 ->click();
        sleep(1);
        $gender = $this->safeFindElement(WebDriverBy::Name("gender"));
        $gender->sendKeys("Male");

        // Config set for PSCID to be auto created
        // $pscid = $this->webDriver->findElement(WebDriverBy::Name("PSCID"));
        // $pscid->sendKeys("Control");
        $this->safeFindElement(WebDriverBy::Xpath("//*[@id='footer']/div[1]"))
                 ->click();
        sleep(1);
        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        sleep(3);
        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Estimated Due date fields must match.", $bodyText);

        $this->restoreConfigSetting("useEDC");
    }

    /*
     * Tests that page returns error if PSCID is not filled out
     *
     * @return none
     */
    function testNewProfilePSCIDError() {

        $this->markTestSkipped("Config not properly set up to test that PSCID is required");

        // $this->webDriver->get($this->url . "/new_profile/");

        // $dates = $this->webDriver->findElements(WebDriverBy::cssSelector(".input-date"));
        // $dates[0]->sendKeys("01/01/2015");
        // $dates[1]->sendKeys("01/01/2015");

        // $gender = $this->webDriver->findElement(WebDriverBy::Name("gender"));
        // $gender->sendKeys("Male");

        // $startVisit = $this->webDriver->findElement(WebDriverBy::Name("fire_away"));
        // $startVisit->click();

        // $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        // $this->assertContains("PSCID must be specified", $bodyText);
    }

    /**
     * Tests that page returns error if DoB dates dont match
     *
     * @return none
     */
    function testNewProfileDoBDateError() {
        $this->webDriver->get($this->url . "/new_profile/");

        $dates = $this->webDriver->findElements(WebDriverBy::cssSelector(".input-date"));
        $dates[0]->sendKeys("2015-01-01");
        $dates[1]->sendKeys("2015-02-01");
        $this->webDriver->findElement(WebDriverBy::Xpath("//*[@id='footer']/div[1]"))
                 ->click();
        $gender = $this->webDriver->findElement(WebDriverBy::Name("gender"));
        $gender->sendKeys("Male");
        sleep(2);

        // Config set for PSCID to be auto created
        // $pscid = $this->webDriver->findElement(WebDriverBy::Name("PSCID"));
        // $pscid->sendKeys("Control");

        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        sleep(3);
        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Date of Birth fields must match.", $bodyText);
    }

    /*
     * Tests that candidate is created
     *
     * @return none
     */
    function testNewProfileCreateCandidate() {

        $this->changeStudySite();
        $this->webDriver->get($this->url . "/new_profile/");

        $dates = $this->webDriver->findElements(WebDriverBy::cssSelector(".input-date"));
        $dates[0]->sendKeys("2015-01-01");
        $dates[1]->sendKeys("2015-01-01");
        $this->safeFindElement(WebDriverBy::Xpath("//*[@id='footer']/div[1]"))
                 ->click();
        sleep(1);
        $gender = $this->webDriver->findElement(WebDriverBy::Name("gender"));
        $gender->sendKeys("Male");
        $this->safeFindElement(WebDriverBy::Xpath("//*[@id='footer']/div[1]"))
                 ->click();
        sleep(1);
        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        sleep(3);
        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("PSCID: BBQ0000", $bodyText);

        $this->deleteCandidate("BBQ0000");
        $this->resetStudySite();
    }

    /*
     * Tests that candidate is created
     *
     * @return none
     */
    function testNewProfilePSCIDSequential() {

        $this->changeStudySite();
        $this->webDriver->get($this->url . "/new_profile/");

        $dates = $this->webDriver->findElements(WebDriverBy::cssSelector(".input-date"));
        $dates[0]->sendKeys("2015-01-01");
        $dates[1]->sendKeys("2015-01-01");
        $this->webDriver->findElement(WebDriverBy::Xpath("//*[@id='footer']/div[1]"))
                 ->click();
        sleep(1);
        $gender = $this->webDriver->findElement(WebDriverBy::Name("gender"));
        $gender->sendKeys("Male");
        $this->safeFindElement(WebDriverBy::Xpath("//*[@id='footer']/div[1]"))
                 ->click();
        sleep(1);
        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        sleep(3);
        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("PSCID: BBQ0000", $bodyText);

        $this->webDriver->get($this->url . "/new_profile/");

        $dates = $this->webDriver->findElements(WebDriverBy::cssSelector(".input-date"));
        $dates[0]->sendKeys("2015-01-01");
        $dates[1]->sendKeys("2015-01-01");
        $this->webDriver->findElement(WebDriverBy::Xpath("//*[@id='footer']/div[1]"))
                 ->click();
        sleep(1);
        $gender = $this->safeFindElement(WebDriverBy::Name("gender"));
        $gender->sendKeys("Male");
        $this->webDriver->findElement(WebDriverBy::Xpath("//*[@id='footer']/div[1]"))
                 ->click();
        sleep(1);
        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        sleep(3);
        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("PSCID: BBQ0001", $bodyText);

        $this->deleteCandidate("BBQ0000");
        $this->deleteCandidate("BBQ0001");
        $this->resetStudySite();
    }
}
?>
