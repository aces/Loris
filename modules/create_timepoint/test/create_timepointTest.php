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
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverSelect;
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
    function setUp(): void
    {
        parent::setUp();
    }

    /**
     * It does the tearDown after running the tests
     *
     * @return void
     */
    function tearDown(): void
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
        $this->assertStringContainsString("Create Time Point", $bodyText);
    }

    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepoint()
    {
        $this->markTestSkipped(
            'Skipping tests until Travis and React get along better.'
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
        $select  = $this->safeFindElement(WebDriverBy::Name("#subproject"));
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText($subproject);
        $this->webDriver->findElement(
            WebDriverBy::Name("#visit")
        )->sendKeys($visitlabel);
        $this->webDriver->findElement(
            WebDriverBy::Name(".col-sm-9 > .btn")
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
        $this->safeFindElement(WebDriverBy::Name("fire_away"))->click();
        $bodyText = $this->webDriver->getPageSource();
        $this->assertStringNotContainsString(
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
        $this->setupPermissions(["data_entry"]);
        $this->safeGet(
            $this->url . "/create_timepoint/?candID=900000&identifier=900000"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();

        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }
}

