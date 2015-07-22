<?php
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
use Facebook\WebDriver\WebDriverBy;

class mri_uploadTestIntegrationTest extends LorisIntegrationTest
{
    function testMriUploadDoespageLoad()
    {
        $this->webDriver->get($this->url . '?test_name=mri_upload');
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Mri Upload", $bodyText);
    }
}
?>
