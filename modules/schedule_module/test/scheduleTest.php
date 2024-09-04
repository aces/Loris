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
use Facebook\WebDriver\WebDriverBy;
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
    static $alertOk = "body > div.swal2-container.swal2-center.swal2-shown >".
                      " div > div.swal2-actions > button.swal2-confirm.swal2-styled";
    static $addBtn  = "#default-panel > div > div > div.table-header".
                      " > div > div > div:nth-child(2) > button:nth-child(1)";
    static $edit    = "#dynamictable >tbody>tr:nth-child(1)>td:nth-child(10)>button";
    static $delete  = "#dynamictable >tbody>tr:nth-child(1)>td:nth-child(11)>button";
    static $msg     = "body > div.swal2-container.swal2-center.swal2-shown > ".
                      "div > div.swal2-actions > button.swal2-confirm.swal2-styled";
    static $create  = "#addScheduleForm > div > div:nth-child(7) ".
                       "> div > div > button";
    /**
     * Insert an appointment
     *
     * @return void
     */
    function setUp(): void
    {
        parent::setUp();
        $this->DB->insert(
            "appointment",
            [
                'AppointmentID'     => '1',
                'SessionID'         => '1',
                'AppointmentTypeID' => '2',
                'StartsAt'          => '2025-02-02 02:02:02',
            ]
        );

    }
    /**
     * Delete an appointment
     *
     * @return void
     */
    function tearDown(): void
    {
        parent::tearDown();
        $this->DB->delete("appointment", ['AppointmentID' => '1']);

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
        $this->assertStringContainsString("Schedule", $bodyText);
        $this->assertStringNotContainsString("An error occurred", $bodyText);

    }
    /**
     * Tests that, the homepage should have "Schedule Module"
     * on the page with permission.
     *
     * @return void
     */
    function testPageLoadsWithPermissions()
    {
        $this->checkPagePermissions(
            '/schedule_module/',
            [
                'schedule_module',
            ],
            "Schedule Appointment"
        );
    }
    /**
     * Tests add an appointment
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
            WebDriverBy::cssSelector(
                "#lorisworkspace > div > div >".
                " div > div:nth-child(1)"
            )
        )->getText();
        $this->assertStringContainsString("Add Appointment", $bodyText);
    }
    /**
     * Tests edit an appointment
     *
     * @return void
     */
    function testEditappointment()
    {
        $this->safeGet($this->url . "/schedule_module/");
        $editButton = self::$edit;
        $ms         = self::$msg;
        $btn        = self::$create;
        // click edit button with same info, it will show a error msg
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "$editButton"
            )
        )->click();
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "$btn"
            )
        )->click();

        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "$ms"
            )
        )->getText();
        $this->assertStringContainsString(
            "OK",
            $bodyText
        );

    }
    /**
     * Tests delete an appointment
     *
     * @return void
     */
    function testDeleteAppointment()
    {
        $this->safeGet($this->url . "/schedule_module/");
        // click delete schedule button
        $btn = self::$delete;
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "$btn"
            )
        )->click();
        $ms       = self::$msg;
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("$ms")
        )->getText();
        $this->assertStringContainsString(
            "Yes, delete it!",
            $bodyText
        );
    }
    /**
     * Helper function to set up and load a page with a given permisison code.
     *
     * @param string $permission A valid permission code for the data_release
     *                           module.
     *
     * @return string The body text of the page loaded.
     */
    function _loadWithPermission(string $permission): string
    {
        $this->setupPermissions([$permission]);
        $this->safeGet($this->url . "/schedule_module/");
        return $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
    }
}
