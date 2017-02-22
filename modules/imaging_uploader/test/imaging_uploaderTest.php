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
             'SessionID'                   => '999999',
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
        $this->DB->delete("mri_upload", array('PatientName' => 'TestTestTest'));
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
/*    function testImagingUploaderFilter()
    {
        $this->safeGet($this->url . '/imaging_uploader/');
        sleep(600);
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);
    }
*/
}
?>
