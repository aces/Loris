<?php
/**
 * AcknowledgementsIntegrationTest automated integration tests
 *
 * PHP Version 5
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
 * AcknowledgementsIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class AcknowledgementsIntegrationTest extends LorisIntegrationTest
{

    // Initial array data and UI location
    // clear filter button
    static $btn = ".col-sm-9 > .btn";
    // the number of table rows
    static $row = ".table-header > div > div > div:nth-child(1)";

    static $fullName    = ".col-xs-12:nth-child(2) > .row .form-control";
    static $citatioName = ".col-xs-12:nth-child(3) > .row .form-control";
    static $startDate   = ".col-xs-12:nth-child(4) .form-control";
    static $endDate     = ".col-xs-12:nth-child(5) .form-control";
    static $present     = ".col-xs-12:nth-child(6) .form-control, select";
    static $addBtn      = "div:nth-child(2) > .btn:nth-child(1)";
    static $testData    = array(
                           'ID'            => '999',
                           'ordering'      => '999',
                           'full_name'     => 'Demo Test',
                           'citation_name' => "Demo Citation",
                           'affiliations'  => 'mcgill',
                           'degrees'       => 'bachelors',
                           'roles'         => 'investigators',
                           'start_date'    => '2015-01-01',
                           'end_date'      => '2016-01-01',
                           'present'       => '0', // 0 presents Yes
                          );
    static $newData     = array(
                           'ordering'      => '9999',
                           'full_name'     => 'Test Test',
                           'citation_name' => "Test Citation",
                           'affiliations'  => 'McGill',
                           'degrees'       => 'Bachelors',
                           'roles'         => 'Investigators',
                           'start_date'    => '2016-11-11',
                           'end_date'      => '2028-11-11',
                           'present'       => '1',
                          );
    /**
     * Insert testing data into the database
     * author: Wang Shen
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
        $this->DB->insert(
            "acknowledgements",
            self::$testData
        );

    }
    /**
     * Delete testing data from database
     * author: Wang Shen
     *
     * @return void
     */
    function tearDown()
    {
        $this->DB->delete("acknowledgements", array('ID' => '999'));
        $this->DB->delete("acknowledgements", array('full_name' => 'Test Test'));
        parent::tearDown();
    }
    /**
     * Tests that, the homepage should have "Acknowledgements" on the page.
     *
     * @return void
     */
    function testPageLoads()
    {
        $this->safeGet($this->url . "/acknowledgements/");
        $bodyText = $this->getReactElementContent(
            '.panel:nth-child(3)>.panel-heading'
        );
        $this->assertContains("Acknowledgements", $bodyText);
    }
    /**
     * Tests that, the homepage should have "You do not have access to this page."
     * on the page without permission.
     *
     * @return void
     */
    function testPageLoadsWithoutPermissions()
    {
        $this->setupPermissions(array("violated_scans_view_allsites"));
        $this->safeGet($this->url . "/acknowledgements/");
        $bodyText = $this->getReactElementContent(
            'body'
        );
        $this->assertContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests that, after clicking the "filter" button, all of the
     * advanced filters appear on the page.
     *
     * @return void
     */
    function testFilterWithData()
    {
        $this->safeGet($this->url . "/acknowledgements/");
        $this->_testFilter(
            self::$fullName,
            "1 rows",
            self::$testData['full_name'],
            self::$row,
            self::$btn
        );
        $this->_testFilter(
            self::$citatioName,
            "1 rows",
            self::$testData['citation_name'],
            self::$row,
            self::$btn
        );
        $this->_testFilter(
            self::$startDate,
            "1 rows",
            self::$testData['start_date'],
            self::$row,
            self::$btn
        );
        $this->_testFilter(
            self::$endDate,
            "1 rows",
            self::$testData['end_date'],
            self::$row,
            self::$btn
        );
        $this->_testFilter(
            self::$present,
            "2 rows",
            self::$testData['present'],
            self::$row,
            self::$btn
        );

    }
    /**
     * Tests that, adding a new record, then this record appears on the page.
     *
     * @return void
     */
    function testAddNewRecord()
    {
        $this->safeGet($this->url . "/acknowledgements/");
        $this->clickReactElement(self::$addBtn);
        $this->reactTextSendKey(
            ".col-xs-12:nth-child(1) > .row .form-control",
            self::$newData['ordering']
        );
        $this->reactTextSendKey(
            ".col-xs-12:nth-child(2) > .row .form-control",
            self::$newData['full_name']
        );
        $this->reactTextSendKey(
            ".col-xs-12:nth-child(3) > .row .form-control",
            self::$newData['citation_name']
        );
        $this->reactTextSendKey(
            ".col-xs-12:nth-child(7) .form-control",
            self::$newData['start_date']
        );
        $this->reactTextSendKey(
            ".col-xs-12:nth-child(8) .form-control",
            self::$newData['end_date']
        );
        $this->reactDropdownSendKey(
            ".col-xs-12:nth-child(9) .form-control",
            self::$newData['present']
        );
        $this->clickReactElement(".btn-sm");
        $this->assertContains(
            "Success!",
            $this->getReactElementContent("#swal2-title")
        );

    }
}

