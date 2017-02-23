<?php
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class imaging_uploaderTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Backs up the useEDC config value and sets the value to a known
     * value (true) for testing.
     *`
     * @return none
     */
    function setUp()
    {
        parent::setUp();
         $this->DB->insert(
            "psc",
            array(
             'CenterID' => '55',
             'Name' => 'TESTinPSC',
             'Alias' => 'tst',
             'MRI_alias' => 'test'
            )
        );
          $this->DB->insert(
            "candidate",
            array(
             'CandID'        => '999999',
             'CenterID'      => '55',
             'UserID'        => '1',
             'PSCID'         => '8889',
             'ProjectID'     => '7777'
            )
        );
        $this->DB->insert(
            "session",
            array(
             'ID'            => '111112',
             'CandID'        => '999999',
             'CenterID'      => '55',
             'UserID'        => '1',
             'MRIQCStatus'   => 'Pass',
             'SubprojectID'  => '6666',
             'Visit'         => 'In Progress',
             'Visit_label'   => 'TestVisitLabel'
            )
        );
        $this->DB->insert(
            "mri_upload",
            array(
             'UploadID'                    => '9999999',
             'UploadedBy'                  => 'test',
             'UploadDate'                  => '2017-01-01',
             'UploadLocation'              => '/data/incoming/test',
             'DecompressedLocation'        => '/tmp/ImagingUpload-test',
             'InsertionComplete'           => '0',
             'Inserting'                   => '0',
             'PatientName'                 => 'TestTestTest',
             'number_of_mincInserted'      => '1',
             'number_of_mincCreated'       => '1',
             'TarchiveID'                  => '999999',
             'SessionID'                   => '111112',
             'IsCandidateInfoValidated'    => '1',
             'IsTarchiveValidated'         => '0',
             'IsPhantom'                   => 'N',
            )
        );
    }
    /**
     * Restore the values backed up in the setUp function
     *
     * @return none
     */
    function tearDown()
    {
        parent::tearDown();
        $this->DB->delete(
            "mri_upload", 
            array('PatientName' => 'TestTestTest')
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
            array('CenterID'=>'55')
        );
        
    }

    function testImagingUploaderDoespageLoad()
    {
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Imaging Upload", $bodyText);
    }
 
    function testImagingUploaderLoadWithoutPermission()
    {
        $this->setupPermissions(array(""));
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
    }
    
    function testImagingUploaderLoadWithPermission()
    {
        $this->setupPermissions(array("imaging_uploader"));
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
    function testImagingUploaderFilterClearForm()
    {
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

        $this->assertEquals('',$bodyText1);
        $this->assertEquals('',$bodyText2);
    }
    function testImagingUploaderFilter()
    {
        $this->safeGet($this->url . '/imaging_uploader/');
        
        $this->webDriver->findElement(
             WebDriverBy::name("CandID")
         )->sendKeys("999999");
        
        $this->webDriver->findElement(
             WebDriverBy::name("filter")
         )->click();
        $this->safeGet($this->url . '/imaging_uploader/?format=json');
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("TestVisitLabel", $bodyText);


        $this->safeGet($this->url . '/imaging_uploader/');

        $this->webDriver->findElement(
             WebDriverBy::name("PSCID")
         )->sendKeys("8889");

        $this->webDriver->findElement(
             WebDriverBy::name("filter")
         )->click();
        $this->safeGet($this->url . '/imaging_uploader/?format=json');
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("TestVisitLabel", $bodyText);


    }

    function testImagingUploaderwithoutData()
    {
        $this->safeGet($this->url . '/imaging_uploader/');
        $this->webDriver->findElement(
             WebDriverBy::ID("upload")
         )->click();
        sleep(2);
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("mri_file: Make sure 'Are these Phantom Scans' is filled out.", $bodyText);
    }
    function testImagingUploaderwithData()
    {
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

        $Visit_labelElement =  $this->safeFindElement(WebDriverBy::Name("Visit_label"));
        $Visit_label        = new WebDriverSelect($Visit_labelElement);
        $Visit_label->selectByVisibleText("TestVisitLabel");

        $PhantomElement =  $this->safeFindElement(WebDriverBy::Name("IsPhantom"));
        $Phantom        = new WebDriverSelect($PhantomElement);
        $Phantom->selectByVisibleText("No");

        $this->webDriver->findElement(
             WebDriverBy::ID("upload")
         )->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("8889_999999_TestVisitLabel", $bodyText);
    }
}
?>
