
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
 * Dashboard module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DashboardTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Dashboard, the word "Welcome" appears
     * in the welcome panel
     * Test Data: admin account
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

    /**
     * Click the stie all button of
     * Accounts pending approval in the My tasks panel,
     * it relocates to Mri Violations.
     * author : Wang Shen
     *
     * @return void
     */
    public function testDashboardMyTasksAccountsPendingApproval()
    {
        $this->safeGet($this->url . '/dashboard/');
        $siteAll = $this->webDriver->findElement(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div > div.col-lg-4 > div:nth-child(1) > div >".
                " div.panel-body > div > a.list-group-item.pending-accounts > div"
            )
        );
        $siteAll ->click();
        
        $assertText1 = $this->webDriver->findElement(
            WebDriverBy::cssSelector(
                "#page > div > div.alert.alert-info.alert-sm > a > label"
            )
        )->getText();

        $this->assertContains("User Accounts", $assertText1);

    }
}
?>
