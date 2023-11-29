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
    static $alertOk    = "button[class='swal2-confirm swal2-styled']";
    static $addBtn     = "#all .table-header .btn:nth-child(1)";
    static $edit       = "##all tr:nth-child(2) > td:nth-child(10) > .btn";
    static $delete     = "#all tr:nth-child(1) > td:nth-child(11) > .btn";
    static $msg        = "#swal2-content";
    static $create     = ".btn-sm > div";

    function setUp()
    {
        parent::setUp();
          $this->DB->insert(
            "appointment",
            array(
                'AppointmentID'  => '1',
                'SessionID'    => '1',
                'AppointmentTypeID'   => '2',
                'StartsAt' => '2020-02-02 02:02:02',
            )
        );

    }
    function tearDown()
    {
        parent::tearDown();
        $this->DB->delete("appointment", array('AppointmentID' => '1'));

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
        $this->assertContains("Schedule", $bodyText);
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
        $this->assertContains("Schedule", $bodyText);
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
            WebDriverBy::cssSelector(
                "#lorisworkspace > div > div >".
                " div > div:nth-child(1)"
            )
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
        $ok = self::$alertOk;
        $editButton = self::$edit;
        $ms = self::$msg;
        $btn = self::$create;
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
        $this->assertContains("This appointment already exists", $bodyText);
        // change time and save it again
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "$ok"
            )
        )->click();
        $el_dropdown = new WebDriverSelect(
                $this->safeFindElement(WebDriverBy::cssSelector("
                .col-sm-12:nth-child(6) .form-control"))
            );
        $el_dropdown->selectByVisibleText("Behavioral");
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "$btn"
            )
        )->click();
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "$ok"
            )
        )->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("$ms")
        )->getText();
        $this->assertContains("Schedule added", $bodyText);
       


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
        $btn = self::$delete;
        $this->safeFindElement(
            WebDriverBy::cssSelector(
              "$btn"
            )
        )->click();
        $ms = self::$msg;
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("$ms")
        )->getText();
        $this->assertContains("Schedule deleted.", $bodyText);
    }
}
