<?php
/**
 * final_radiological_review automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class finalRadiologicalReviewTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that the final Radiological Review loads if the user has the correct
     * permissions (edit_final_radiological_review or view_final_radiological_review)
     * It should only be able to see the menu item.
     * @return void
     */
    function testFinalRadiologicalReviewLoadsWithPermission()
    {
        $this->setupPermissions(array("edit_final_radiological_review"));
        $this->safeGet($this->url . "/final_radiological_review/");

    // Test that the Imaging menu appears in the first row
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("#example-navbar-collapse > ul:nth-child(1) > li:nth-child(1) > a")
        )->getText();
        $this->assertContains("Imaging", $bodyText);

        $this->resetPermissions();
    }
    /**
     * Tests that the final Radiological Review loads if the user has the correct
     * permissions (view_final_radiological_review)
     * It should find filter section
     * @return void
     */
    function testPermissionWithViewFinalRadiologicalReview()
    {
        $this->setupPermissions(array("view_final_radiological_review"));
        $this->safeGet($this->url . "/final_radiological_review/");

    // Test that the Imaging menu appears in the first row
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Selection Filter", $bodyText);
 
        $this->resetPermissions();
    }
    /**
     * Tests filter section, input some data which database doesn't have
     * and search it, it shows no data is found.
     * @return void
     */
    function testFinalRadiologicalReviewFilterWithNullResult()
    {
        $this->safeGet($this->url . "/final_radiological_review/");

    // Test that the Imaging menu appears in the first row
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Selection Filter", $bodyText);

        $this->resetPermissions();
    }
}
?>
