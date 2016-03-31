<?php
/**
 * Dashboard automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTestDashboardWithPermission.class.inc";

/**
 * Dashboard module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DashboardTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Dashboard, the word "Welcome" appears
     * in the welcome panel
     *
     * @return void
     */
    /**
     * Tests that, when loading the Dashboard, the word "Data Team Helper"
     * should not appears in the welcome panel
     *
     * @return void
     */
    public function testDashboardPageLoads()
    {
        $this->safeGet($this->url . '/dashboard/');
        $welcomeText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector(".welcome"))->getText();
        $this->assertContains("Welcome", $welcomeText);
    }
     


/** to test that, when loading the Dashboard, click the Views button of Recruitment, the items "View overall recruitment" and "View site breakdown" appear
     * author : Wang Shen
   *
     * @return void
     */
    public function testDashboardRecruitmentView()
    {
        $this->safeGet($this->url . '/dashboard/');
        $views = $this->webDriver
            ->findElement(WebDriverBy::Xpath("//*[@id='lorisworkspace']/div/div[1]/div[2]/div[1]/div/div/button"));
        $views->click();

        $assertText1 = $this->webDriver
            ->findElement(WebDriverBy::XPath("//*[@id='lorisworkspace']/div/div[1]/div[2]/div[1]/div/div/ul/li[1]/a"))->getText();
        $assertText2 = $this->webDriver
            ->findElement(WebDriverBy::XPath("//*[@id='lorisworkspace']/div/div[1]/div[2]/div[1]/div/div/ul/li[2]/a"))->getText();
        $this->assertContains("View overall recruitment", $assertText1);
        $this->assertContains("View site breakdown", $assertText2);
    }
    public function testDashboardWithoutPermission()
    {
        $this->setupPermissions(array('imaging_browser_view_site'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet($this->url . '/data_team_helper/');
        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains("Data Team Helper", $breadcrumbText);  
    }
}
