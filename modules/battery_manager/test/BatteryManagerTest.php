<?php
/**
 * Battery Manager module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Battery Manager module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class BatteryManagerTest extends LorisIntegrationTest
{

    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testLoadsWithPermissionRead()
    {
        $this->setupPermissions(array("battery_manager_view"));
        $this->safeGet($this->url . "/battery_manager/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testDoesNotLoadWithoutPermission()
    {
        $this->setupPermissions(array());
        $this->safeGet($this->url . "/battery_manager/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }

}
