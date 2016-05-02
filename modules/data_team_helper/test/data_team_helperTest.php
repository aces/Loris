<?php
/**
 * data_team_helper automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class dataTeamHelperTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the data_team_helper module, some
     * text appears in the body.
     *
     * @return void
     */
    function testDataTeamHelperDoespageLoad()
    {
        $this->safeGet($this->url . "/data_team_helper/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Data Team Helper", $bodyText);
    }
     /**
      * Tests that data_team_helper does not load with the permission
      *
      * @return void
      */
     function testDataTeamHelperWithoutPermission()
     {
          $this->setupPermissions(array());
          $this->safeGet($this->url . "/data_team_helper/");
          $bodyText = $this->safeFindElement(
              WebDriverBy::cssSelector("body")
          )->getText();
          $this->assertContains("You do not have access to this page.", $bodyText);
          $this->resetPermissions();
     }
    /**
     * Tests that help editor loads with the permission
     *
     * @return void
     */
    function testDataTeamHelperPermission()
    {
         $this->setupPermissions(array("data_team_helper"));
         $this->safeGet($this->url . "/data_team_helper/");
         $bodyText = $this->safeFindElement(
              WebDriverBy::cssSelector("body")
          )->getText();
          $this->assertNotContains("You do not have access to this page.", $bodyText);
          $this->resetPermissions();
     }

    /**
     * Tests data conflicts, click each link, the particular content shows on the page.
     *
     * @return void
     */
    function testlinksDC()
     {
         $this->safeGet($this->url."/data_team_helper/");
         $webElement = $this->safeFindElement(
              WebDriverBy::XPath("//*[@id='lorisworkspace']/ul/li[2]/a"))->click();
         $bodyText = $this->safeFindElement(
              WebDriverBy::XPath("//*[@id='incomplete']/div/div[1]")
          )->getText();
          $this->assertContains("Data Entry Conflicts", $bodyText);

     }
    /**
     * Tests behavioural feedback, click each link, the particular content shows on the page.
     *
     * @return void
     */
    function testlinkBF()
     {
         $this->safeGet($this->url."/data_team_helper/");
         $webElement = $this->safeFindElement(
              WebDriverBy::XPath("//*[@id='lorisworkspace']/ul/li[3]/a"))->click();
         $bodyText = $this->safeFindElement(
              WebDriverBy::XPath("//*[@id='feedback']/div/div[1]")
          )->getText();
          $this->assertContains("Behvarioural Feedback", $bodyText);

     }
   /**
     * Tests that, when loading the data team helper,the chart shows.
     *
     * @return void
     */
    function testChart()
    {
        $this->safeGet($this->url."/data_team_helper/");
        $assertText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
            ->getText();

        $this->assertContains("At A Glance: All Candidates", $assertText);

    }

}
?>
