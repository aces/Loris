<?php
/**
 * schedule_module automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
 require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * schedule_module Integration Test
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ScheduleTest extends LorisIntegrationTest
{

    /**
     * Insert testing data into the database
     * author: Wang Shen
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();

    }
    /**
     * Delete testing data from database
     * author: Wang Shen
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
    }
    /**
     * Tests that, the homepage should have "Schedule Module" on the page.
     *
     * @return void
     */
    function testPageLoads()
    {
        $this->safeGet($this->url . "/schedule_module/");
        $bodyText = $this->safeFindElement(
             WebDriverBy::cssSelector(".btn > div")
        )->getText();
        $this->assertContains("Schedule Module", $bodyText);
        $this->assertNotContains("An error occurred", $bodyText);
        
    }
    /**
     * Tests that, the homepage should have "Schedule Module"
     * on the page with permission.
     *
     * @return void
     */
    function testPageLoadsWithPermissions()
    {
        $this->setupPermissions(array("schedule_module"));
        $this->safeGet($this->url . "/schedule_module/");
        $bodyText = $this->safeFindElement(
             WebDriverBy::cssSelector(".btn > div")
        )->getText();
        $this->assertContains("Schedule Module", $bodyText);
        $this->assertNotContains("An error occurred", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that, the homepage should have "You do not have access to this page."
     * on the page without permission.
     *
     * @return void
     */
    function testPageLoadsWithoutPermissions()
    {
        $this->setupPermissions(array());
        $this->safeGet($this->url . "/schedule_module/");
        $bodyText = $this->safeFindElement(
             WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
}

