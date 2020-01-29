<?php
/**
 * Automated integration tests for the dicom_archive module.
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Automated integration tests for the dicom_archive module.
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DicomArchiveTestIntegrationTest extends LorisIntegrationTest
{
    //$location: css selector for react items
    static $patientID   = 'input[name="patientID"]';
    static $patientName = 'input[name="patientName"]';
    static $sex         = 'input[name="sex"]';
    static $dateOfBirth = 'input[name="dateOfBirth"]';
    static $acquisition = 'input[name="acquisitionDate"]';
    static $archiveLocation = 'input[name="archiveLocation"]';
    static $seriesUID       = 'input[name="seriesUID"]';
    static $site            = 'select[name="site"]';
    static $clearFilter     = ".col-sm-9 > .btn";
    static $display         = ".table-header > .row > div > div:nth-child(1)";
    /**
     * Insert testing data into the database
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
    }
    /**
     * Delete testing data from database
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
    }
    /**
     * Tests that, when loading the dicom_archive module > viewDetails subtest, some
     * text appears in the body.
     *
     * @return void
     */
    function testdicomArchiveViewDetailsDoespageLoad()
    {
        $this->safeGet($this->url . "/dicom_archive/viewDetails/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertContains("View Details", $bodyText);
    }
    /**
     * Tests that help editor loads with the permission
     *
     * @return void
     */
    function testDicomArchivePermission()
    {
        $this->setupPermissions(array("dicom_archive_view_allsites"));
        $this->safeGet($this->url . "/dicom_archive/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertNotContains(
            "An error occured while loading the page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests clear button in the form
     * The form should refreash and the data should be gone.
     *
     * @return void
     */
    function testdicomArchiveFilter()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        //testing data from RBdata.sql

        $this->_filterTest(
            self::$patientID,
            self::$display,
            self::$clearFilter,
            "INVALID - HIDDEN",
            '47'
        );
        $this->_filterTest(
            self::$patientName,
            self::$display,
            self::$clearFilter,
            "MTL022_300022_V1",
            '1 row'
        );
        $this->_filterTest(
            self::$sex,
            self::$display,
            self::$clearFilter,
            "M",
            '1 rows'
        );
        $this->_filterTest(
            self::$dateOfBirth,
            self::$display,
            self::$clearFilter,
            "1972-10-10",
            '1 row'
        );
        $this->_filterTest(
            self::$acquisition,
            self::$display,
            self::$clearFilter,
            "2018-04-20",
            '4 rows'
        );
        $this->_filterTest(
            self::$archiveLocation,
            self::$display,
            self::$clearFilter,
            "2018",
            '14 rows'
        );
        $this->_filterTest(
            self::$seriesUID,
            self::$display,
            self::$clearFilter,
            "1.3.12.2.1107.5.2.32.35008.2009052710345172468142734.0.0.0",
            '1 rows'
        );
        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clearFilter,
            "Montreal",
            '5 rows'
        );

    }
    /**
     * Tests that the (view-details) link works
     *
     * @return void
     */
    function testLinksViewDetails()
    {
        $this->markTestSkipped(
            'This test needs work. It is causing failures sometimes for '
            . 'unkown reasons.'
        );
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "#dynamictable>tbody>tr:nth-child(1)>td:nth-child(8)>a";
        $text     = $this->webDriver->executescript(
            "return document.querySelector('$location').textContent"
        );
        $this->assertEquals('View Details', $text);
        $this->webDriver->executescript(
            "document.querySelector('$location').click()"
        );
        $text = $this->webDriver->getPageSource();
        $this->assertContains('View Details', $text);
    }
    /**
     * Tests that the (view-Images) link works
     *
     * @return void
     */
    function testLinksViewImages()
    {
        $this->markTestSkipped(
            'Imaging is not set'
        );
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "#dynamictable > tbody > tr:nth-child(1) > td:nth-child(10) > a";
        $text     = $this->webDriver->executescript(
            "return document.querySelector('$location').textContent"
        );
        $this->assertEquals('View Images', $text);
        $this->webDriver->executescript(
            "document.querySelector('$location').click()"
        );
        sleep(1);
        $text = $this->webDriver->getPageSource();
        $text = $this->webDriver->executescript(
            "return document.querySelector('#bc2>a:nth-child(3)>div').textContent"
        );
        $this->assertEquals('View Session', $text);
    }
}
