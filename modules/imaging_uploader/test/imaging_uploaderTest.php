<?php
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class imaging_uploaderTestIntegrationTest extends LorisIntegrationTest
{
    function testImagingUploaderDoespageLoad()
    {
        $this->safeGet($this->url . '/imaging_uploader/');
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Imaging Upload", $bodyText);
    }
}
?>
