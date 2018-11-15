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
    public $dateTaken  = "#lorisworkspace > div > div > div > form >".
                         " div > div:nth-child(2) > div > div > input";
    public $dtc        = "#lorisworkspace > div > div > div > form >".
                         " div > div:nth-child(3) > div > div > input";
    public $edc        = "#lorisworkspace > div > div > div > form >".
                         " div > div:nth-child(4)>div>div:nth-child(1)>div>input";
    public $edcConfirm = "#lorisworkspace > div > div > div > form >".
                         " div > div:nth-child(4)>div>div:nth-child(2)>div>input";
    public $gender     = "#lorisworkspace > div > div > div > form >".
                         " div > div:nth-child(5) > div > div > select";
    public $site       = "#lorisworkspace > div > div > div > form >".
                         " div > div:nth-child(6) > div > div > select";
    public $btn        = "#lorisworkspace > div > div > div > form >".
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
        $this->setUpConfigSetting("useProjects", "true");
        $this->safeGet($this->url . "/new_profile/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("New Profile", $bodyText);
        // check EDC shows on the page
        $value = "#lorisworkspace > div > div > div > form > div >".
                 " div:nth-child(4) > div > div:nth-child(1) > label";
        $EDC   = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
        $this->assertContains("Expected Date of Confinement", $EDC);
        // check Project shows on the page
        $value   = "#lorisworkspace > div > div > div > form > div >".
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
            $value   = "#lorisworkspace > div > div > div > form > div >".
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
        $this->webDriver->get($this->url . "/new_profile/");

        $this->webDriver->executescript(
            "document.querySelector('$this->dateTaken').value='2009-05-05'"
        );
        $this->webDriver->executescript(
            "document.querySelector('$this->dtc').value='2000-05-11'"
        );
        // send a key to gender
        $this->webDriver->executescript(
            "document.querySelector('$this->gender').value='male'"
        );
        // send a key to site
        $this->webDriver->executescript(
            "document.querySelector('$this->site').value='1'"
        );

        $startVisit =  $this->webDriver->executescript(
            "document.querySelector('button.btn').click()"
        );sleep(10);
        $err = $this->webDriver->executescript(
            "return document.querySelector('#lorisworkspace').textContent"
        );
        $this->assertContains("Date of birth fields must match", $err);

    }

    /**
     * Tests that candidate is created
     *
     * @return void
     */
    function testNewProfileCreateCandidate()
    {
        $this->webDriver->get($this->url . "/new_profile/");sleep(200);
        // send a key to gender
        $this->webDriver->executescript(
            "document.querySelector('$this->gender').value='male'"
        );
        // send a key to site
        $this->webDriver->executescript(
            "document.querySelector('$this->site').value='1'"
        );

        $this->webDriver->executescript(
            "document.querySelector('$this->dateTaken').value='2009-05-05'"
        );
        $this->webDriver->executescript(
            "document.querySelector('$this->dtc').value='2009-05-05'"
        );

        $startVisit =  $this->webDriver->executescript(
            "document.querySelector('$this->btn').click()"
        );
        $bodyText   = $this->webDriver->executescript(
            "return document.querySelector('#lorisworkspace').textContent"
        );
        $this->assertContains("New candidate created.", $bodyText);

    }

    /**
     * Tests that candidate is created
     *
     * @return void
     */
    function testNewProfilePSCIDSequential()
    {
        $this->DB->delete("psc", array("CenterID" => 99));
        $this->DB->insert(
            "psc",
            array(
             "CenterID" => 99,
             "Name"     => "testPSC",
             "Alias"    => "BBQ",
            )
        );
        $this->DB->update(
            "user_psc_rel",
            array("CenterID" => 99),
            array("UserID" => 999990)
        );

        $this->webDriver->get($this->url . "/new_profile/");
        $this->webDriver->executescript(
            "document.querySelector('$this->dateTaken').value='2009-05-05'"
        );
        $this->webDriver->executescript(
            "document.querySelector('$this->dtc').value='2009-05-05'"
        );

        $this->webDriver->executescript(
            "document.querySelector('$this->gender').value='male'"
        );
        // send a key to site
        $this->webDriver->executescript(
            "document.querySelector('$this->site').value='99'"
        );

        $startVisit =  $this->webDriver->executescript(
            "document.querySelector('$this->btn').click()"
        );
        $bodyText   = $this->webDriver->executescript(
            "return document.querySelector('#lorisworkspace').textContent"
        );
        $this->assertContains("PSCID: BBQ0000", $bodyText);

        $this->webDriver->get($this->url . "/new_profile/");
        $this->webDriver->executescript(
            "document.querySelector('$this->dateTaken').value='2009-05-05'"
        );
        $this->webDriver->executescript(
            "document.querySelector('$this->dtc').value='2009-05-05'"
        );

        $this->webDriver->executescript(
            "document.querySelector('$this->gender').value='male'"
        );
        // send a key to site
        $this->webDriver->executescript(
            "document.querySelector('$this->site').value='1'"
        );

        $startVisit =  $this->webDriver->executescript(
            "document.querySelector('$this->btn').click()"
        );
        $bodyText   = $this->webDriver->executescript(
            "return document.querySelector('#lorisworkspace').textContent"
        );

        $this->assertContains("PSCID: BBQ0001", $bodyText);

        $this->deleteCandidate("BBQ0000");
        $this->deleteCandidate("BBQ0001");
        $this->DB->update(
            "user_psc_rel",
            array("CenterID" => 1),
            array("UserID" => 999990)
        );
        $this->DB->delete("psc", array("CenterID" => 99));
    }
}
?>
