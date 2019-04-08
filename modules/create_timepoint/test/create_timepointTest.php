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
    /**
     * It does the setUp before running the tests
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();

        $this->createSubproject(1, "subprojet 1");
        $this->createSubproject(2, "subprojet 2");
    }

    /**
     * It does the tearDown after running the tests
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();

        $this->deleteSubproject("subprojet 1");
        $this->deleteSubproject("subprojet 2");
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
        $this->_createTimepoint('900000', 'subprojet 1', 'V02');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("New time point successfully registered", $bodyText);

    }

    /**
     * Tests that, create a timepoint and test the success link
     *
     * @return void
     */
    function testCreateTimepointSuccessLink()
    {
        $this->markTestSkipped(
            'Skipping tests until create timepoint works well'
        );

        $this->_createTimepoint('900000', 'subprojet 1', 'V01');
        $this->safeClick(WebDriverBy::LinkText("Click here to continue."));
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains(
            "List of Visits (Time Points)",
            $bodyText
        );

    }

    /**
     * Create a timepoint with three parameters.
     *
     * @param string $canID      ID of candidate
     * @param string $subproject text of subproject
     * @param string $visitlabel text of visit label
     *
     * @return void
     */
    private function _createTimepoint($canID, $subproject, $visitlabel)
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

