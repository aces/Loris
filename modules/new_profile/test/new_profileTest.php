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
        $this->setUpConfigSetting("useProjects", "true");

        $this->safeGet($this->url . "/new_profile/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
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

        $sexField = $this->webDriver->findElement(WebDriverBy::Name("sex"));
        $this->assertEquals("select", $sexField->getTagName());

        $projectField = $this->webDriver->findElement(
            WebDriverBy::Name("ProjectID")
        );
        $this->assertEquals("select", $projectField->getTagName());

        $this->restoreConfigSetting("useEDC");
        $this->restoreConfigSetting("useProjects");
    }

    /**
     * Tests that with useProjects turned off, project related fields do not
     * appear on the page
     *
     * @return void
     */
    function testNewProfileLoadsWithoutProjects()
    {
        $this->setUpConfigSetting("useProjects", "false");

        $this->safeGet($this->url . "/new_profile/");

        try {
            $projectField = $this->webDriver->findElement(
                WebDriverBy::Name("ProjectID")
            );
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
     * @return void
     */
    function testNewProfileLoadsWithoutEDC()
    {
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

    /**
     * Tests that page returns error if the dates dont match
     *
     * @return void
     */
    function testNewProfileCheckDateError()
    {
        $this->setUpConfigSetting("useEDC", "true");

        $this->webDriver->get($this->url . "/new_profile/");
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2000-05-05'"
        );

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2000-05-11'"
        );

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[2].value='2000-05-30'"
        );

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[3].value='2000-05-30'"
        );

        $sex = $this->safeFindElement(WebDriverBy::Name("sex"));
        $sex->sendKeys("Male");

        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Date of Birth fields must match.", $bodyText);

        $this->restoreConfigSetting("useEDC");
    }

    /**
     * Tests that page returns error if DoB dates dont match
     *
     * @return void
     */
    function testNewProfileDoBDateError()
    {
        $this->webDriver->get($this->url . "/new_profile/");

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2000-05-05'"
        );

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2000-05-01'"
        );

        $sex = $this->webDriver->findElement(WebDriverBy::Name("sex"));
        $sex->sendKeys("Male");

        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Date of Birth fields must match.", $bodyText);
    }

    /**
     * Tests that candidate is created
     *
     * @return void
     */
    function testNewProfileCreateCandidate(): void
    {
        $this->webDriver->get($this->url . "/new_profile/");
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2015-01-01'"
        );

        $sex = $this->webDriver->findElement(WebDriverBy::Name("sex"));
        $sex->sendKeys("Male");

        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("New candidate created", $bodyText);
    }

    /**
     * Tests that candidate is created
     *
     * @return void
     */
    function testNewProfilePSCIDSequential(): void
    {
        $this->changeStudySite();
        $this->webDriver->get($this->url . "/new_profile/");

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2015-01-01'"
        );

        $sex = $this->webDriver->findElement(WebDriverBy::Name("sex"));
        $sex->sendKeys("Male");

        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("PSCID: BBQ000", $bodyText);

        $this->webDriver->get($this->url . "/new_profile/");

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2015-01-01'"
        );
        $sex = $this->safeFindElement(WebDriverBy::Name("sex"));
        $sex->sendKeys("Male");

        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("PSCID: BBQ001", $bodyText);

        $this->deleteCandidate("BBQ000");
        $this->deleteCandidate("BBQ001");
        $this->resetStudySite();
    }
}

