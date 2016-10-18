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
        $this->setupPermissions(array("view_final_radiological_review"));
        $this->safeGet($this->url . "/final_radiological_review/");

    // Test that the Imaging menu appears in the first row
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);

        $this->resetPermissions();
    }
}
?>

