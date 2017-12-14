<?php
/**
 * Imaging_uploader automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ .
      "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Imaging_uploader automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ImagingUploaderTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Insert testing data
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
         $this->DB->insert(
             "psc",
             array(
              'CenterID'  => '55',
              'Name'      => 'TESTinPSC',
              'Alias'     => 'tst',
              'MRI_alias' => 'test',
             )
         );
          $this->DB->insert(
              "candidate",
              array(
               'CandID'    => '999999',
               'CenterID'  => '55',
               'UserID'    => '1',
               'PSCID'     => '8889',
               'ProjectID' => '7777',
              )
          );
          $this->DB->insert(
              "session",
              array(
               'ID'           => '111112',
               'CandID'       => '999999',
               'CenterID'     => '55',
               'UserID'       => '1',
               'MRIQCStatus'  => 'Pass',
               'SubprojectID' => '6666',
               'Visit'        => 'In Progress',
               'Visit_label'  => 'TestVisitLabel',
              )
          );
          $this->DB->insert(
              'tarchive',
              array(
               'TarchiveID'             => 264,
               'DicomArchiveID'         => '1.3.12.2.1107.5.2.32.35442.30000' .
                 '012100912542610900000001',
               'PatientID'              => 'BOL0003_000003_Test2',
               'PatientName'            => 'BOL0003_000003_Test2',
               'CenterName'             => 'Test site BOL',
               'AcquisitionCount'       => 10,
               'NonDicomFileCount'      => 3,
               'DicomFileCount'         => 1000,
               'CreatingUser'           => 'lorisdev',
               'sumTypeVersion'         => 1,
               'SourceLocation'         => '/data/incoming/BOL0003_000003_Test2',
               'ScannerManufacturer'    => 'Siemens',
               'ScannerModel'           => 'TrioTim',
               'ScannerSerialNumber'    => '33336',
               'ScannerSoftwareVersion' => 'syngo MR B17',
               'uploadAttempt'          => 1,
               'AcquisitionMetadata'    => 'metadata',
               'SessionID'              => 111112,
               'PendingTransfer'        => 1,
              )
          );
          $this->DB->insert(
              "mri_upload",
              array(
               'UploadID'                 => '9999999',
               'UploadedBy'               => 'test',
               'UploadDate'               => '2017-01-01',
               'UploadLocation'           => '/data/incoming/test',
               'DecompressedLocation'     => '/tmp/ImagingUpload-test',
               'InsertionComplete'        => '0',
               'Inserting'                => '0',
               'PatientName'              => 'TestTestTest',
               'number_of_mincInserted'   => '1',
               'number_of_mincCreated'    => '1',
               'TarchiveID'               => '264',
               'SessionID'                => '111112',
               'IsCandidateInfoValidated' => '1',
               'IsTarchiveValidated'      => '0',
               'IsPhantom'                => 'N',
              )
          );
    }
    /**
     * Deleting the test data
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
        $this->DB->delete(
            "mri_upload",
            array('PatientName' => 'TestTestTest')
        );
        $this->DB->delete(
            "tarchive",
            array('TarchiveID' => '264')
        );
        $this->DB->delete(
            "session",
            array('CandID' => '999999')
        );
        $this->DB->delete(
            "candidate",
            array('CandID' => '999999')
        );
        $this->DB->delete(
            "psc",
            array('CenterID' => '55')
        );
    }
    /**
     * Tests that, when loading the Imaging_uploader module, some
     * text appears in the body.
     *
     * @return void
     */
    function testImagingUploaderDoespageLoad()
    {
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Imaging Upload", $bodyText);
    }
    /**
     * Tests that, when loading the Imaging_uploader module without permission,
     * "You do not have access to this page." appears in the body.
     *
     * @return void
     */
    function testImagingUploaderLoadWithoutPermission()
    {
        $this->setupPermissions(array(""));
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
    }
    /**
     * Tests that, when loading the Imaging_uploader module with permission,
     * "You do not have access to this page." not appears in the body.
     *
     * @return void
     */
    function testImagingUploaderLoadWithPermission()
    {
        $this->setupPermissions(array("imaging_uploader"));
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that, inputing some data into filter,then clicking the
     * [clear form] button, make sure that all of filter form should be
     * empty.
     *
     * @return void
     */
    function testImagingUploaderFilterClearForm()
    {
        $this->markTestSkipped("This method isn't working properly on travis.");

        $this->safeGet($this->url . '/imaging_uploader/');

        $this->webDriver->findElement(
            WebDriverBy::name("CandID")
        )->sendKeys("test");

        $this->webDriver->findElement(
            WebDriverBy::name("PSCID")
        )->sendKeys("test");

        $this->webDriver->findElement(
            WebDriverBy::name("reset")
        )->click();

         $bodyText1 = $this->webDriver->findElement(
             WebDriverBy::name("CandID")
         )->getText();
         $bodyText2 = $this->webDriver->findElement(
             WebDriverBy::name("PSCID")
         )->getText();

         $this->assertEquals('', $bodyText1);
         $this->assertEquals('', $bodyText2);
    }
    /**
     * Tests that, when loading the Imaging_uploader module,
     * input a test data, check it out after click filter button.
     *
     * @return void
     */
    function testImagingUploaderFilter()
    {
        $this->markTestSkipped("This method isn't working properly on travis.");
        $this->safeGet($this->url . '/imaging_uploader/');
        $this->webDriver->findElement(
            WebDriverBy::name("CandID")
        )->sendKeys("999999");

        $this->webDriver->findElement(
            WebDriverBy::name("filter")
        )->click();
        $this->safeGet($this->url . '/imaging_uploader/?format=json');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("TestVisitLabel", $bodyText);

        $this->safeGet($this->url . '/imaging_uploader/');

        $this->webDriver->findElement(
            WebDriverBy::name("PSCID")
        )->sendKeys("8889");

        $this->webDriver->findElement(
            WebDriverBy::name("filter")
        )->click();
        $this->safeGet($this->url . '/imaging_uploader/?format=json');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("TestVisitLabel", $bodyText);

        $this->safeGet($this->url . '/imaging_uploader/');

        $Visit_labelElement =  $this->safeFindElement(
            WebDriverBy::Name("Visit_label")
        );

        $Visit_label = new WebDriverSelect($Visit_labelElement);
        $Visit_label->selectByVisibleText("TestVisitLabel");

        $this->webDriver->findElement(
            WebDriverBy::name("filter")
        )->click();
        $this->safeGet($this->url . '/imaging_uploader/?format=json');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("TestVisitLabel", $bodyText);

        $this->safeGet($this->url . '/imaging_uploader/');

        $PhantomElement =  $this->safeFindElement(WebDriverBy::Name("IsPhantom"));
        $Phantom        = new WebDriverSelect($PhantomElement);
        $Phantom->selectByVisibleText("No");

        $this->webDriver->findElement(
            WebDriverBy::name("filter")
        )->click();
        $this->safeGet($this->url . '/imaging_uploader/?format=json');
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("TestVisitLabel", $bodyText);

    }
    /**
     * Tests that, when uploading an empty file,
     * some error text appears in the body.
     *
     * @return void
     */
    function testImagingUploaderwithoutData()
    {
        $this->markTestSkipped("This method isn't working properly on travis.");
        $this->safeGet($this->url . '/imaging_uploader/');
        $this->webDriver->findElement(
            WebDriverBy::ID("upload")
        )->click();
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
            "mri_file: Make sure 'Are these Phantom Scans' is filled out.",
            $bodyText
        );
    }
    /**
     * Tests that, when uploading a demo file,
     * and the file name appears in the body.
     *
     * @return void
     */
    function testImagingUploaderwithData()
    {
        $this->markTestSkipped("This method isn't working properly on travis.");
        $this->safeGet($this->url . '/imaging_uploader/');
                $this->webDriver->findElement(
                    WebDriverBy::Name("mri_file")
                )->sendKeys("/TestVisitLabel.zip");
                $this->webDriver->findElement(
                    WebDriverBy::name("CandID")
                )->sendKeys("999999");
                $this->webDriver->findElement(
                    WebDriverBy::name("PSCID")
                )->sendKeys("8889");

                $Visit_labelElement =  $this->safeFindElement(
                    WebDriverBy::Name("Visit_label")
                );
                $Visit_label        = new WebDriverSelect($Visit_labelElement);
                $Visit_label->selectByVisibleText("TestVisitLabel");

                $PhantomElement =  $this->safeFindElement(
                    WebDriverBy::Name("IsPhantom")
                );
                $Phantom        = new WebDriverSelect($PhantomElement);
                $Phantom->selectByVisibleText("No");

                $this->webDriver->findElement(
                    WebDriverBy::ID("upload")
                )->click();
                $bodyText = $this->webDriver->findElement(
                    WebDriverBy::cssSelector("body")
                )->getText();
                $this->assertContains("8889_999999_TestVisitLabel", $bodyText);

    }
}
?>
