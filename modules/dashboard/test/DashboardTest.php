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
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

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
    public function testDashboardPageLoads()
    {
        $this->safeGet($this->url . '/dashboard/');

        $welcomeText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector(".welcome"))->getText();
        $this->assertContains("Welcome", $welcomeText);
    }

    public function testTargetNumberOfParticipants()
    {
            $this->safeGet($this->url . '/dashboard/');

            $dashboardNum = $this->safeFindElement(
                WebDriverBy::cssSelector("#overall-recruitment > div > p")
            )
                ->getText();

            $this->safeGet($this->url . '/configuration/');

            $this->safeFindElement(
                WebDriverBy::Xpath(
                    "//*[@id='lorisworkspace']/div[1]/ul/li[5]/a"
                )
            )
                ->click();
            $configNum =  $this->safeFindElement(
                WebDriverBy::Xpath(
                    "//*[@id='41']/input"
                )
            )
                ->getAttribute('value');

            $this->assertEquals($dashboardNum, "Target: ".$configNum);     
     
    }
}
?>
