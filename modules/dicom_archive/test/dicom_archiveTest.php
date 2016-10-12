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
        $window = new WebDriverWindow($this->webDriver);
        $size   = new WebDriverDimension(1024, 1768);
        $window->setSize($size);
        $this->DB->insert(
            "tarchive",
            array(
             'DicomArchiveID'         => '9999999999',
             'PatientID'              => '9999999999',
             'PatientName'            => 'TestTestTest',
             'PatientDoB'             => '1900-01-01',
             'PatientGender'          => 'M',
             'neurodbCenterName'      => 'NULL',
             'CenterName'             => 'Mc Gill University',
             'LastUpdate'             => '2014-05-30 13:49:36',
             'DateAcquired'           => '2010-11-25',
             'DateFirstArchived'      => '2014-05-30 13:47:11',
             'DateLastArchived'       => '2014-05-30 13:49:36',
             'AcquisitionCount'       => '166',
             'NonDicomFileCount'      => '0',
             'DicomFileCount'         => '881',
             'md5sumDicomOnly'        => '5.150346.tar',
             'md5sumArchive'          => '5.150346.tar',
             'CreatingUser'           => 'lorisadmin',
             'sumTypeVersion'         => '1',
             'tarTypeVersion'         => '1',
             'SourceLocation'         => '/tmp/bEu0Q_egfA/5.150346',
             'ArchiveLocation'        => '2010/DCM5.150346.tar',
             'ScannerManufacturer'    => 'SIEMENS',
             'ScannerModel'           => 'TrioTim',
             'ScannerSerialNumber'    => '35056',
             'ScannerSoftwareVersion' => 'syngo MR B15',
             'SessionID'              => '44',
             'uploadAttempt'          => '0',
             'CreateInfo'             => 'NULL',
             'AcquisitionMetadata'    => 'A really long text that can not be null.',
            )
        );
    }
    /**
     * Delete testing data from database
     *
     * @return none
     */
    function tearDown()
    {
        parent::tearDown();
        $this->DB->delete("tarchive", array('PatientName' => 'TestTestTest'));
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
        $this->markTestSkipped("This method isn't working properly on travis.");

        //testing the Patient Name
        $this->safeGet($this->url . "/dicom_archive/");
        $nameElement =  $this->safeFindElement(WebDriverBy::Name("PatientName"));
        $nameElement->sendKeys("TestPatientName");
        $this->safeClick(WebDriverBy::Name("reset"));
        $name =  $this->safeFindElement(WebDriverBy::Name("PatientName"))
            ->getAttribute('value');
        $this->assertEquals('', $name);

        //testing the Archive Location
        $locationElement =  $this->safeFindElement(WebDriverBy::Name("Location"));
        $locationElement->sendKeys("TestLocation");
        $this->safeClick(WebDriverBy::Name("reset"));
        $location =  $this->safeFindElement(WebDriverBy::Name("Location"))
            ->getAttribute('value');
        $this->assertEquals('', $location);

        //testing the Patient ID
        $idElement =  $this->safeFindElement(WebDriverBy::Name("PatientID"));
        $idElement->sendKeys("TestID");
        $this->safeClick(WebDriverBy::Name("reset"));
        $idText =  $this->safeFindElement(WebDriverBy::Name("PatientID"))
            ->getAttribute('value');
        $this->assertEquals('', $idText);

        //testing the Gender
        $genderElement =  $this->safeFindElement(WebDriverBy::Name("Gender"));
        $gender        = new WebDriverSelect($genderElement);
        $gender->selectByVisibleText("Male");
        $this->safeClick(WebDriverBy::Name("reset"));
        $genderElement =  $this->safeFindElement(WebDriverBy::Name("Gender"));
        $gender        = new WebDriverSelect($genderElement);
        $value         = $gender->getFirstSelectedOption()->getAttribute('value');
        $this->assertEquals("", $value);

    }
    /**
     * Tests that filter with the name
     *
     * @return void
     */
    function testdicomArchiveFileterByName()
    {
        $this->markTestSkipped("This method isn't working properly on travis.");

        //testing the Patient Name
        $this->safeGet($this->url . "/dicom_archive/");
        $nameElement =  $this->safeFindElement(WebDriverBy::Name("PatientName"));
        $nameElement->sendKeys("TestTestTest");
        $this->safeClick(WebDriverBy::Name("filter"));
        $name =$this->safeFindElement(WebDriverBy::cssSelector("tbody"))->getText();
        $this->assertContains('TestTestTest', $name);

    }
    /**
     * Tests that filter with the date of birth
     *
     * @return void
     */
    function testdicomArchiveFileterByDateOfBirth()
    {
        $this->markTestSkipped("This method isn't working properly on travis.");

        //testing the Patient's date of birth
        $this->safeGet($this->url . "/dicom_archive/");
        $DoBElement =  $this->safeFindElement(WebDriverBy::Name("DoB"));
        $DoBElement->sendKeys("1900-01-01");
        $this->safeClick(WebDriverBy::Name("filter"));
        $DoB = $this->safeFindElement(WebDriverBy::cssSelector("tbody"))->getText();
        $this->assertContains('1900-01-01', $DoB);
    }


}
?>
