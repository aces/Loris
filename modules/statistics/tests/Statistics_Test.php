<?php
require_once __DIR__ . "/LorisIntegrationTest.class.inc";
class Statistics_Test extends LorisIntegrationTest
{
    public function testTabsFramework()
    {
        $this->webDriver->get('http://localhost/main.php?test_name=statistics');

        //print $this->webDriver->getPageSource();

        // Ensure that Demographic Statistics link is there. There's nothing special
        // about Demographics, it's just a randomly chosen default tab to ensure that
        // something shows up. Ideally, this should loop through the StatisticsTabs
        // table and ensure that they all appear.
        $link = $this->webDriver->findElement(WebDriverBy::PartialLinkText("Demographic Statistics"));
        $this->assertContains("Demographic", $link->getText());
    }

    public function testGeneralDescription() {
        $this->webDriver->get('http://localhost/main.php?test_name=statistics&subtest=stats_general&dynamictabs=dynamictabs');
        $header = $this->webDriver->findElement(WebDriverBy::XPath("//div[@id = 'page']/h2"));
        $this->assertContains("Welcome to the statistics page", $header->getText());

    }
}
?>
