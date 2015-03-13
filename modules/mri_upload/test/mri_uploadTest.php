<?php
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class mri_uploadTestIntegrationTest extends LorisIntegrationTest.class.inc
{
    protected $webDriver;

    public function setUp()
    {
        $this->webDriver = RemoteWebDriver::create(
            'http://localhost:4444/wd/hub',
            array(\WebDriverCapabilityType::BROWSER_NAME => 'firefox')
        );

        $this->webDriver->get('http://localhost/main.php?test_name=mri_upload');

        print "Page source: " . $this->webDriver->getPageSource();

    }
    
    function testMriUploadDoespageLoad()
    {
       $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
       $this->assertContains("mri_upload", $bodyText);
    }

    public function tearDown()
    {
        $this->webDriver->quit();
    }
}
?>