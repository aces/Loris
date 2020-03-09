<?php
/**
 * Schedule_module automated integration tests
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
 * Schedule_module Integration Test
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
    /**
     * Tests that, add an appointment
     *
     * @return void
     */
    function testAddappointment()
    {
        $this->safeGet($this->url . "/schedule_module/");
        // click add schedule button
        $this->safeFindElement(
            WebDriverBy::cssSelector("#all .table-header .btn:nth-child(1)")
        )->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#lorisworkspace > div > div >".
                    " div > div:nth-child(1)")
        )->getText();
        $this->assertContains("Add Appointment", $bodyText);
    }
    /**
     * Tests that, edit an appointment
     *
     * @return void
     */
    function testEditappointment()
    {   
        $this->safeGet($this->url . "/schedule_module/");
        // click add schedule button
        $this->safeFindElement(
            WebDriverBy::cssSelector("#all tr:nth-child(1) > td:nth-child(10) > .btn")
        )->click(); 
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#lorisworkspace > div > div >".
                    " div > div:nth-child(1)")
        )->getText();
        $this->assertContains("Edit Appointment", $bodyText);
    }
    /**
     * Tests that, delete an appointment
     *
     * @return void
     */
    function testDeleteappointment()
    {   
        $this->safeGet($this->url . "/schedule_module/");
        // click delete schedule button
        $this->safeFindElement(
            WebDriverBy::cssSelector("#all tr:nth-child(1) > td:nth-child(11) > .btn")
        )->click(); 
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#swal2-content")
        )->getText();
        $this->assertContains("Schedule deleted.", $bodyText);
    }
}
