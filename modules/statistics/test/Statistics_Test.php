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
class StatisticsTest extends LorisIntegrationTest
{

    /**
     * Tests that, when loading the Statistics module, some
     * text appears in the body.
     *
     * @return void
     */
    function testLoadPage()
    {
        $this->safeGet($this->url . "/statistics/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("General Description", $bodyText);

    }
    /**
     * Tests that the Statistics loads if the user has not the correct
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
        $this->assertContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }

    /**
     * Tests that the Statistics loads if the user has the correct
     * permissions (data_entry)
     *
     * @return void
     */
    function testLoadPageWithPermission()
    {
        $this->setupPermissions(array("data_entry"));
        $this->safeGet($this->url . "/statistics/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }

    /**
     * Tests that, when loading the Statistics module behavioural tab, some
     * text appears in the body.
     *
     * @return void
     */
    function testBehaviouralTab()
    {
        $this->safeGet(
            $this->url .
            "/statistics/stats_behavioural/?dynamictabs=dynamictabs"
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector(".statsH2")
        )->getText();
        $this->assertContains("Data Entry Statistics", $bodyText);
    }
    /**
     * Tests that, when loading the Demographic Statistics Tab
     * in Statistics module, some text appears in the body.
     *
     * @return void
     */
    function testDemographicStatisticsTab()
    {
        $this->safeGet(
            $this->url .
            "/statistics/"
        );
        $this->webDriver->executescript(
            "document.querySelector('.nav-tabs > li:nth-child(2)".
            " > a:nth-child(1)').click()"
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector(".statsH2")
        )->getText();
        $this->assertContains("General Demographic Statistics", $bodyText);
    }
}