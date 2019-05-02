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
        $this->_createTimepoint('900000', 'Stale', 'V1', 'Pumpernickel');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("New time point successfully registered", $bodyText);

    }

    /**
     * Create a timepoint with three parameters.
     *
     * @param string $canID      ID of candidate
     * @param string $subproject text of subproject
     * @param string $visitlabel text of visit label
     * @param string $project    text of project
     *
     * @return void
     */
    private function _createTimepoint($canID, $subproject, $visitlabel, $project)
    {
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=" . $canID .
            "&identifier=" .$canID
        );
        $selectSid  = $this->safeFindElement(WebDriverBy::Name("subproject"));
        $elementSid = new WebDriverSelect($selectSid);
        $elementSid->selectByVisibleText($subproject);

        $selectVl  = $this->safeFindElement(WebDriverBy::Name("visit"));
        $elementVl = new WebDriverSelect($selectVl);
        $elementVl->selectByVisibleText($visitlabel);

        $this->webDriver->findElement(
            WebDriverBy::Name("fire_away")
        )->click();
        sleep(1);
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

