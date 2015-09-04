<?php
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class imaging_uploaderTestIntegrationTest extends LorisIntegrationTest
{
    function testImagingUploaderDoespageLoad()
    {
        $this->webDriver->get($this->url . '?test_name=imaging_uploader');
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Imaging Upload", $bodyText);
    }
}
?>
