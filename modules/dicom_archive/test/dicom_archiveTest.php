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
    static $patientID   = ".col-xs-12:nth-child(2) > .row .form-control";
    static $patientName = ".col-xs-12:nth-child(3) > .row .form-control";
    static $site        = ".col-xs-12:nth-child(9) .form-control, select";
    static $sex         = ".col-xs-12:nth-child(4) .form-control";
    static $UID         = ".col-xs-12:nth-child(8) .form-control";
    static $dateOfBirth = ".col-xs-12:nth-child(5) .form-control";
    static $clearFilter = ".col-sm-9 > .btn";
    // first row of react table
    static $table   = ".table-header > .row > div > div:nth-child(1)";
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
        $bodyText = $this->getReactElementContent(
                       'body'
                    );
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
        $bodyText = $this->getReactElementContent(
                       'body'
                    );
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
    function testdicomArchiveFilterClearBtn()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        //testing data from RBdata.sql
        $row = self::$table;
        $btn = self::$clearFilter;
        $this->_testFilter(self::$patientID,"0 rows","test",$row,$btn);
        $this->_testFilter(self::$patientName,"1 rows","MTL022_300022_V1",$row,$btn);
        $this->_testFilter(self::$sex, "1 rows", "M",$row,$btn);
        $this->_testFilter(self::$dateOfBirth,"1 rows", "1972-10-10",$row,$btn);
        $this->_testFilter(self::$site,"8 rows", "4",$row,$btn);
        $this->_testFilter(self::$UID,"1 rows", "201110192002451318",$row,$btn);

    }
    /**
     * Tests that the (view-details) link works
     *
     * @return void
     */
    function testLinksViewDetails()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "tr:nth-child(1)>td:nth-child(8)>a";
        $text     = $this->getReactElementContent($location);
        $this->assertEquals('View Details', $text);
        $this->clickReactElement($location);
        $text = $this->getReactElementContent('h2');
        $this->assertContains('Tarchive Metadata', $text);
        //test click Acquisition ID
        $AcquistionID = "td:nth-child(2) > .dicom_archive";
        $this->clickReactElement($AcquistionID);
        $text = $this->getReactElementContent('.btn > div');
        $this->assertContains('Mri Violations', $text);


    }
    /**
     * Tests that the (view-Images) link works
     *
     * @return void
     */
    function testLinksViewImages()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "tr:nth-child(1) > td:nth-child(9) > a";
        $text     = $this->getReactElementContent($location);
        $this->assertEquals('View Images', $text);
        $this->clickReactElement($location);
        $text     = $this->getReactElementContent('.btn:nth-child(3) > div');
        $this->assertEquals('View Session', $text);
    }
    /**
     * Tests that the (view-Images) Hidden link works
     *
     * @return void
     */
    function testLinksViewDetailsHidden()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "tr:nth-child(1)>td:nth-child(8)>a";
        $text     = $this->getReactElementContent($location);
        $this->assertEquals('View Details', $text);
        $this->clickReactElement($location);
        // Patient ID = INVALID - HIDDEN
        $text = $this->getReactElementContent('.error');
        $this->assertContains('INVALID - HIDDEN', $text);
        //test Show/Hide Series and Show/Hide Files 
        $Series = ".collapsed";
        $this->clickReactElement($Series);
        $text = $this->getReactElementContent('#series-data th:nth-child(1)');
        $this->assertContains('Series Number', $text);
        // Show/Hide Files 
        $Files = "tr:nth-child(21) > td:nth-child(2) > a";
        $this->clickReactElement($Files);
        sleep(1);
        $text = $this->getReactElementContent('#files-data th:nth-child(1)');
        $this->assertContains('SeriesNumber', $text);
    }
}
