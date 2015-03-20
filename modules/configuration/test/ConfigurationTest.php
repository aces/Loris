<?php
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class ConfigurationTest extends LorisIntegrationTest
{
    protected $url = 'http://localhost/main.php?test_name=configuration';

    public function testConfigurationPageLoads()
    {
        $this->webDriver->get($this->url);

        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Configuration", $bodyText);
    }
}
?>