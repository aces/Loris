<?php
/**
 * Training module automated integration tests
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
 * Training module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class TrainingTest extends LorisIntegrationTest
{

    /**
     * Tests that the breadcrumb loads, which it should regardless of the user's
     * permissions
     *
     * @return void
     */
    public function testBreadcrumbLoads()
    {
        $this->safeGet($this->url . "/training/");
        $breadcrumbText = $this->webDriver
            ->findElement(WebDriverBy::id("breadcrumbs"))->getText();
        $this->assertStringContainsString("Training", $breadcrumbText);
    }

    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testLoadsWithPermission()
    {
        $this->setupPermissions(array("training"));
        $this->safeGet($this->url . "/training/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::id("training-options")
        )->getText();
        $this->assertStringContainsString("training", $bodyText);
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
        $this->safeGet($this->url . "/training/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }

    /**
     * Tests that the training menu item loads if the user has correct
     * permissions
     *
     * @return void
     */
    function testMenuItemPresentWithPermission()
    {
        $this->setupPermissions(array("training"));
        $this->safeGet($this->url . "/training/");
        $this->assertTrue(
            $this->isMenuItemPresent('Clinical', 'Training')
        );
        $this->resetPermissions();
    }

    /**
     * Tests that the training menu item does not load if the user does not have
     * the correct permissions
     *
     * @return void
     */
    function testMenuItemNotPresentWithoutPermission()
    {
        $this->setupPermissions(array());
        $this->safeGet($this->url . "/training/");
        $this->assertFalse(
            $this->isMenuItemPresent('Clinical', 'Training')
        );
        $this->resetPermissions();
    }
}

