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
        //$location: css selector for items 
        $patientID   = "#dicom_filter > div > div:nth-child(1) > div > div > input";
        $PatientName = "#dicom_filter > div > div:nth-child(2) > div > div > input";
        $site        = "#Site";
        $Gender      = "#dicom_filter > div > div:nth-child(4) > div > div > input";
        $dateOfBirth = "#dicom_filter > div > div:nth-child(5) > div > div > input";
        $Acquisition = "#dicom_filter > div > div:nth-child(6) > div > div > input";
        $Archive     = "#dicom_filter > div > div:nth-child(7) > div > div > input";
        $SeriesUID   = "#dicom_filter > div > div:nth-child(8) > div > div > input";
        $this->safeGet($this->url . "/dicom_archive/"); 
        //testing data from RBdata.sql
        $this-> _filter('patientID', "ibis",$patientID,"ibis");
        $this-> _filter('patientName', "MTL022_300022_V1",$PatientName,"ibis");
        $this-> _filter('site', "2",$site,"ibis");
        $this-> _filter('gender', "M",$Gender,"D568405");
        $this-> _filter('dateOfBirth', '2011-10-20',$dateOfBirth,"LIVING_PHANTOM_UNC_SD_HOS_20111020");
        $this-> _filter('acquisition', '2009-06-09',$Acquisition,"ibis");
        $this-> _filter('archiveLocation', "2009/DCM_2009-06-09_ImagingUpload-14-14-qM69wJ.tar",$Archive,"ibis");
        $this-> _filter('seriesuid', "1.3.12.2.1107.5.2.32.35182.2009060916513929723684064.0.0.0",$SeriesUID,"ibis");
    }
    /**
     * clear button function
     * 
     * @param $name the name of this element in html
     * @param $key  the test key for query
     * @param $location the location of the element (css selector)
     * @param $expectKey the expect result
     * @return void
     */
    function _filter($name, $key,$location,$expect)
    {
        $this->webDriver->get($this->url . "/dicom_archive/?" . $name ."=". $key);
        $text = $this->webDriver->executescript(
                "return document.querySelector('$location').value"
               );
        //make sure that filter works well
        $this->assertEquals($text, $key);
        //make sure that filter table works well
        $text = $this->webDriver->executescript(
                "return document.querySelector(".
                "'#dynamictable > tbody > tr:nth-child(1) > td:nth-child(2)').textContent"
               ); 
         $this->assertEquals($text, $expect);      
    }

}
?>
