<?php
/**
 * Dashboard automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Statistics module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ . 
"/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class Statistics_Test extends LorisIntegrationTest
{

/**
     * Tests that, when loading the statistics module, some
     * text appears in the body.
     *
     * @return void
     */
    function testLoadPage()
    {
        $this->safeGet($this->url . "/statistics/");
        $bodyText = $this->safeFindElement(
                WebDriverBy::cssSeletor("body"))->getText();
        $this->assertContains("Welcome to the statistics page.", $bodyText);

    }
       /**
     * Tests that the statistics loads if the user has not the correct
     * permissions 
     *
     * @return void
     */
    function testLoadPageWithoutPermission()
    {
        $this->setupPermissions(array(""));
        $this->safeGet($this->url . "/statistics/");

        // Test that the Imaging menu appears in the first row
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("General Description", $bodyText);

        $this->resetPermissions();
    }

   /**
     * Tests that the statistics loads if the user has the correct
     * permissions 
     *
     * @return void
     */
    function testLoadPageWithPermission()
    {
        $this->setupPermissions(array("data_entry"));
        $this->safeGet($this->url . "/statistics/");

        // Test that the Imaging menu appears in the first row
        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector(
                  "body"))->getText();
        $this->assertContains("General Description", $bodyText);

        $this->resetPermissions();
    }



    /** Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testBehaviouralTab()
    {
        $this->safeGet($this->url . "/statistics/stats_behavioural/?dynamictabs=dynamictabs");
        $bodyText = $this->
                 safeFindElement(WebDriverBy::cssSelector(".statsH2"))->getText();
        $this->assertContains("Data Entry Statistics", $bodyText);

       //test one link inside this Tab
        $this->safeFindElement(WebDriverBy::linkText("Click here for breakdown per participant"))->click();
        $bodyText = $this->
                     safeFindElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("All Completion Statistics", $bodyText);
    }
 /** Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testReliabilityStatisticsTab()
    {
        $this->safeGet($this->url . "/statistics/stats_reliability/?dynamictabs=dynamictabs");
        $bodyText = $this->
                safeFindElement(WebDriverBy::cssSelector(".statsH2"))->getText();
        $this->assertContains("Reliability Statistics", $bodyText);

    }

