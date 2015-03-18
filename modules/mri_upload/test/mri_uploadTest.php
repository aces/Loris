<?php
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class mri_uploadTestIntegrationTest extends LorisIntegrationTest
{
    function testMriUploadDoespageLoad()
    {
        $this->webDriver->get('http://localhost/main.php?test_name=mri_upload');
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("mri_upload", $bodyText);
    }
}
?>
