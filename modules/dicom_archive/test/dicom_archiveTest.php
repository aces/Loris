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
    static $patientID   = "#dicom_filter>div>div:nth-child(1)>div>div>input";
    static $PatientName = "#dicom_filter>div>div:nth-child(2)>div>div>input";
    static $site        = "#Site";
    static $Gender      = "#dicom_filter>div>div:nth-child(4)>div>div>input";
    static $dateOfBirth = "#dicom_filter>div>div:nth-child(5)>div>div>input";
    static $Acquisition = "#dicom_filter>div>div:nth-child(6)>div>div>input";
    static $Archive     = "#dicom_filter>div>div:nth-child(7)>div>div>input";
    static $SeriesUID   = "#dicom_filter>div>div:nth-child(8)>div>div>input";
    static $clearButton = "#dicom_filter>div>div:nth-child(9)>div>div>button";
    /**
     * Insert testing data into the database
     *
     * @return none
     */
    function setUp()
    {
        parent::setUp();
    }
    /**
     * Delete testing data from database
     *
     * @return none
     */
    function tearDown()
    {
        parent::tearDown();
    }
    /**
     * Tests that, when loading the dicom_archive module, some
     * text appears in the body.
     *
     * @return void
     */
    function testdicomArchiveDoespageLoad()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertContains("Dicom Archive", $bodyText);
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
          $this->resetPermissions();
    }
    /**
     * Tests clear button in the form
     * The form should refreash and the data should be gone.
     *
     * @return void
     */
    function testdicomArchivFilterClearBtn()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        //testing data from RBdata.sql
        $this-> _filter('patientID', "ibis", self::$patientID, "ibis");
        $this-> _filter(
            'patientName',
            "MTL022_300022_V1",
            self::$PatientName,
            "ibis"
        );
        $this-> _filter('site', "2", self::$site, "ibis");
        $this-> _filter('gender', "M", self::$Gender, "D568405");
        $this-> _filter(
            'dateOfBirth',
            '2011-10-20',
            self::$dateOfBirth,
            "LIVING_PHANTOM_UNC_SD_HOS_20111020"
        );
        $this-> _filter('acquisition', '2009-06-09', self::$Acquisition, "ibis");
        $this-> _filter(
            'archiveLocation',
            "2009/DCM_2009-06-09_ImagingUpload-14-14-qM69wJ.tar",
            self::$Archive,
            "ibis"
        );
        $this-> _filter(
            'seriesuid',
            "1.3.12.2.1107.5.2.32.35182.2009060916513929723684064.0.0.0",
            self::$SeriesUID,
            "ibis"
        );
    }
    /**
     * Tests filter function
     *
     * @param string $name     the name of this element in html
     * @param string $key      the test key for query
     * @param string $location the location of the element (css selector)
     * @param string $expect   Key the expect result
     *
     * @return void
     */
    function _filter($name, $key,$location,$expect)
    {
        $caught = false;
        $this->webDriver->get($this->url . "/dicom_archive/?" . $name ."=". $key);
        $script = "return document.querySelector('$location').value";
        try {
            $text = $this->webDriver->executescript($script);
            // something
        } catch (Exception $e) {
            $caught = true;
        }

        if ($caught) {
            sleep(1);
            $text = $this->webDriver->executescript($script);
        }
        //make sure that filter works well
        $this->assertEquals($text, $key);
        //make sure that filter table works well
        $text = $this->webDriver->executescript(
            "return document.querySelector(".
                "'#dynamictable > tbody > tr:nth-child(1) >".
                " td:nth-child(2)').textContent"
        );
         $this->assertEquals($text, $expect);
    }
    /**
     * Tests clear button
     *
     * @return void
     */
    function testClearBtn()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        $this->_clear('patientID', self::$patientID, 'testtesttest');
        $this->_clear('patientName', self::$PatientName, 'testtesttest');
        $this->_clear('site', self::$site, 'testtesttest');
        $this->_clear('gender', self::$Gender, 'testtesttest');
        $this->_clear('dateOfBirth', self::$dateOfBirth, 'testtesttest');
        $this->_clear('acquisition', self::$Acquisition, 'testtesttest');
        $this->_clear('archiveLocation', self::$Archive, 'testtesttest');
        $this->_clear('seriesuid', self::$SeriesUID, 'testtesttest');
    }
    /**
     * Clear function : Inputing 'testtesttest' into textarea, after clicking
     * button, the textarea should be null.
     *
     * @param string $name     the name of this element in html
     * @param string $location the location of the element (css selector)
     * @param string $key      the test key for query
     *
     * @return void
     */
    function _clear($name,$location ,$key)
    {
        $caught = false;
        $this->webDriver->get($this->url . "/dicom_archive/?" . $name ."=". $key);
        $script = "document.querySelector('".self::$clearButton."').click()";
        try {
            $this->webDriver->executescript($script);
            // something
        } catch (Exception $e) {
            $caught = true;
        }

        if ($caught) {
            sleep(1);
            $this->webDriver->executescript($script);
        }
        $script = "document.querySelector('".self::$clearButton."').click()";

        $this->webDriver->executescript(
            $script
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector('$location').value"
        );
        $this->assertEquals('', $text);
    }
    /**
     * Tests that the (view-Details) link works
     *
     * @return void
     */
    function testLinksViewDetails()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "#dynamictable > tbody > tr:nth-child(1) > td:nth-child(8) > a";
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
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "#dynamictable > tbody > tr:nth-child(1) > td:nth-child(9) > a";
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
        $this->assertEquals(' View Session', $text);

    }
}
?>
