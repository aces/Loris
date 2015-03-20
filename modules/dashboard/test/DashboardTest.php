<?php
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class DashboardTest extends LorisIntegrationTest
{
    protected $url = 'http://localhost/main.php?test_name=dashboard';

    public function testDashboardPageLoads()
    {
        $this->webDriver->get($this->url);

        $welcomeText = $this->webDriver->findElement(WebDriverBy::cssSelector(".welcome"))->getText();
        $this->assertContains("Welcome", $welcomeText);
    }
}
?>