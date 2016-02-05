<?php
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class StatisticsTest extends LorisIntegrationTest
{
   




public function testDashboardLoris()
    {
         $this->webDriver->get($this->url . '?test_name=dashboard');
 
         $loris = $this->webDriver
             ->findElement(WebDriverBy::cssSelector("#nav-left > div.navbar-header > a"));
             $loris->click();
             $assertText = $this->webDriver
             ->findElement(WebDriverBy::cssSelector(".welcome"))->getText();
         $this->assertContains("Welcome", $assertText);
     }









    // public function testTabsFrameworkLoads()
    // {
    //     $this->webDriver->get($this->url . '?test_name=statistics');

    //     try {
    //         // If this is the mobile view, we need to expand the dropdown
    //         // before the stats links are visible.
    //         $expand = $this->webDriver->findElement(WebDriverBy::ID("down"));
    //         $expand->click();
    //     } catch(ElementNotVisibleException $e) {
    //         // Using the desktop version, so the mobile link isn't visible and
    //         // doesn't need to be clicked.
    //     }

    //     // Ensure that Demographic Statistics link is there. There's nothing special
    //     // about Demographics, it's just a randomly chosen default tab to ensure that
    //     // something shows up. Ideally, this should loop through the StatisticsTabs
    //     // table and ensure that they all appear.
    //     try {
    //         $link = $this->webDriver->findElement(WebDriverBy::PartialLinkText("Demographic Statistics"));
    //         $this->assertContains("Demographic", $link->getText());
    //     } catch(NoSuchElementException $e) {
    //         print $this->webDriver->getPageSource();
    //         $this->fail("Could not find demographic tab link");
    //     }
    // }

    // public function testGeneralDescriptionTabLoads() {
    //     $this->webDriver->get($this->url . '?test_name=statistics&subtest=stats_general&dynamictabs=dynamictabs');
    //     $header = $this->webDriver->findElement(WebDriverBy::XPath("//div[@id = 'page']/h2"));
    //     $this->assertContains("Welcome to the statistics page", $header->getText());

    // }
}
?>
