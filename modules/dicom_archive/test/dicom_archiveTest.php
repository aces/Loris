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
use Facebook\WebDriver\WebDriverBy;
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
    //Filter locations
    static $pname       = 'input[name="patientName"]';
    static $sex         = 'select[name="sex"]';
    static $site        = 'select[name="site"]';
    static $dateOfBirth = 'input[name="dateOfBirth"]';
    //General locations
    static $display     = '.table-header > div > div > div:nth-child(1)';
    static $clearFilter = '.nav-tabs a';

    /**
     * Insert testing data into the database
     *
     * @return void
     */
    function setUp(): void
    {
        parent::setUp();
    }
    /**
     * Delete testing data from database
     *
     * @return void
     */
    function tearDown(): void
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
        $this->safeGet($this->url . "/dicom_archive/viewDetails/?tarchiveID=27");
        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString("View Details", $bodyText);
    }
    /**
     * Tests that help editor loads with the permission
     *
     * @return void
     */
    function testDicomArchivePermission()
    {
        $this->setupPermissions(["dicom_archive_view_allsites"]);
        $this->safeGet($this->url . "/dicom_archive/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
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
    function testdicomArchiveFilterClearBtn()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        //testing data from RBdata.sql
        $this->_filterTest(
            self::$pname,
            self::$display,
            self::$clearFilter,
            'MTL022_300022_V1',
            '1 row'
        );
        $this->_filterTest(
            self::$sex,
            self::$display,
            self::$clearFilter,
            'M',
            '1 row'
        );
        $this->_filterTest(
            self::$dateOfBirth,
            self::$display,
            self::$clearFilter,
            '1972-10-10',
            '1 row'
        );
        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clearFilter,
            'Montreal',
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
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "#dynamictable>tbody>tr:nth-child(1)>td:nth-child(8)>a";
        $this->safeClick(WebDriverBy::cssSelector($location));
        $text = $this->safeFindElement(
            WebDriverBy::cssSelector("#breadcrumbs")
        )->getText();
        $this->assertStringContainsString('View Details', $text);
    }
    /**
     * Tests that the (view-Images) link works
     *
     * @return void
     */
    function testLinksViewImages()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "#dynamictable>tbody>tr:nth-child(1)>td:nth-child(9)>a";
        $this->safeClick(WebDriverBy::cssSelector($location));
        $text = $this->safeFindElement(
            WebDriverBy::cssSelector("#breadcrumbs")
        )->getText();
        $this->assertStringContainsString('View Session', $text);

    }
}
