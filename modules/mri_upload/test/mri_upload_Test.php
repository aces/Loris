<?php
print __DIR__ ;
require_once __DIR__ . '/../../../../vendor/autoload.php';
class LorisIntegrationTest extends PHPUnit_Framework_TestCase
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

    function testmri_uploadFailure()
    {
    }
    function testmri_uploadSuccess()
    {
    }

    public function tearDown()
    {
        $this->webDriver->quit();
    }
}
?>
