<?php declare(strict_types=1);
/**
 * Module Manager automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Module Manager automated integration tests
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ModuleManagerTest extends LorisIntegrationTest
{

    /**
     * Tests that the module_manager loads an error page if
     * the user has no permission.
     *
     * @return void
     */
    function testLoadPageWithoutPermission()
    {
        $this->setupPermissions([""]);
        $this->safeGet($this->url . "/module_manager/");

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
     * Tests that the module_manager loads if the user has either
     * of the module permissions.
     *
     * @return void
     */
    function testLoadPageWithPermission()
    {
        // View permission
        $this->setupPermissions(["module_manager_view"]);
        $this->safeGet($this->url . "/module_manager/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();

        // Edit permission
        $this->setupPermissions(["module_manager_edit"]);
        $this->safeGet($this->url . "/module_manager/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();

        // Both
        $this->setupPermissions(["module_manager_view", "module_manager_edit"]);
        $this->safeGet($this->url . "/module_manager/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }
}
