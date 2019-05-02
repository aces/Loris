<?php
/**
 * Module create_timepoint automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Test
 * @author   Gregory Luneau <gregory.luneau@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests"
    . "/LorisIntegrationTestWithCandidate.class.inc";

/**
 * Implementation of LorisIntegrationTest helper class.
 *
 * @category Test
 * @package  Test
 * @author   Gregory Luneau <gregory.luneau@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CreateTimepointTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    //UI location
    static $subProject = "subproject, select";
    static $visitLabel = "#visit, select";
    static $button     = "button.btn";
    /**
     * It does the setUp before running the tests
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
    }

    /**
     * It does the tearDown after running the tests
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepointDoespageLoad()
    {
        $this->safeGet(
            $this->url . "/create_timepoint/".
            "?candID=900000&identifier=900000&subprojectID=1"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Create Time Point", $bodyText);
    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepoint()
    {
        $this->_createTimepoint('900000', '1', '1');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("New time point successfully registered", $bodyText);

    }
    /**
     * Create a timepoint with three parameters.
     *
     * @param string $canID           ID of candidate
     * @param string $subprojectValue text of subproject
     * @param string $visitlabelValue text of visit label
     *
     * @return void
     */
    private function _createTimepoint($canID, $subprojectValue, $visitlabelValue)
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=" . $canID .
            "&identifier=" .$canID
        );
            $subproject = self::$subProject;
            $this->webDriver->executescript(
                "input = document.querySelector('$subproject');
                 input.selectedIndex = '$subprojectValue';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
            $visit = self::$visitLabel;
            $this->webDriver->executescript(
                "input = document.querySelector('$visit');
                 input.selectedIndex = '$visitlabelValue';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
            $btn = self::$button;
            $this->webDriver->executescript(
                "document.querySelector('$btn').click();"
            );
    }
    /**
     * Tests that, create a timepoint and input a empty subproject
     * get Error message
     *
     * @return void
     */
    function testCreateTimepointErrorEmptySubproject()
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );
        $this->webDriver->findElement(WebDriverBy::Name("fire_away"))->click();
        $bodyText = $this->webDriver->getPageSource();
        $this->assertNotContains(
            "New time point successfully registered.",
            $bodyText
        );

    }
    /**
     * Tests that timepoint loads with the permission
     *
     * @return void
     */
    public function testCreateTimepointPermission()
    {
        $this->setupPermissions(array("data_entry"));
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();

        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
}

