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
// check EDC shows on the page
        $value = "#lorisworkspace > div > div > div > form > div >".
                 " div:nth-child(4) > div > div:nth-child(1) > label";
        $EDC = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
        $this->assertContains("Expected Date of Confinement", $EDC);
// check Project shows on the page
        $value = "#lorisworkspace > div > div > div > form > div >".
                 " div:nth-child(8) > div > div:nth-child(1) > label";
        $project = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
        );
        $this->assertContains("Project", $project);
        
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
        $value = "#lorisworkspace > div > div > div > form > div >".
                 " div:nth-child(8) > div > div:nth-child(1) > label";
        $project = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
        );
        } catch(UnknownServerException $e) {
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
            "document.getElementsByClassName('dateTaken').value='2000-05-05'"
        );

        $this->webDriver->executescript(
            "document.getElementsByClassName('dateTakenConfirm').value='2000-05-11'"
        );

        $this->webDriver->executescript(
            "document.getElementsByClassName('edcDateTaken').value='2000-05-30'"
        );

        $this->webDriver->executescript(
            "document.getElementsByClassName('edcDateTakenConfirm').value='2000-05-30'"
        );
        // send a key to gender
        $this->webDriver->executescript(
            "document.getElementsByClassName('gender').value='male'"
        );
        $startVisit =  $this->webDriver->executescript(
            "document.querySelector('#lorisworkspace > div > div > div > form > div > div:nth-child(9) > div > div > button').click"
        );


        $errUI = "#lorisworkspace > div > div > div > form > div > div:nth-child(1) > label";
        $err = $this->webDriver->executescript(
                "return document.querySelector('$errUI').textContent"
        );
         
        $this->assertContains("Date of Birth fields must match.", $err);

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

        $gender = $this->webDriver->findElement(WebDriverBy::Name("gender"));
        $gender->sendKeys("Male");

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
    function testNewProfileCreateCandidate()
    {
        $this->webDriver->get($this->url . "/new_profile/");
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2015-01-01'"
        );

        $gender = $this->webDriver->findElement(WebDriverBy::Name("gender"));
        $gender->sendKeys("Male");

        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("New candidate created", $bodyText);

        //        $this->deleteCandidate("BBQ0000");
    }

    /**
     * Tests that candidate is created
     *
     * @return void
     */
    function testNewProfilePSCIDSequential()
    {
        $this->changeStudySite();
        $this->webDriver->get($this->url . "/new_profile/");

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2015-01-01'"
        );

        $gender = $this->webDriver->findElement(WebDriverBy::Name("gender"));
        $gender->sendKeys("Male");

        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("PSCID: BBQ0000", $bodyText);

        $this->webDriver->get($this->url . "/new_profile/");

        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[0].value='2015-01-01'"
        );
        $this->webDriver->executescript(
            "document.getElementsByClassName('input-date')[1].value='2015-01-01'"
        );
        $gender = $this->safeFindElement(WebDriverBy::Name("gender"));
        $gender->sendKeys("Male");

        $startVisit = $this->safeFindElement(WebDriverBy::Name("fire_away"));
        $startVisit->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("PSCID: BBQ0001", $bodyText);

        $this->deleteCandidate("BBQ0000");
        $this->deleteCandidate("BBQ0001");
        $this->resetStudySite();
    }
}
?>
