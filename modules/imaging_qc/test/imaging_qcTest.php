<?php declare(strict_types=1);
 use Facebook\WebDriver\WebDriverBy;
 require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * ImagingQCIntegrationTest automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ImagingQCIntegrationTest extends LorisIntegrationTest
{
    /**
     * Ensures that the module loads if and only if the user has one of the
     * module permissions codes.
     *
     * @return void
     */
    public function testPermissions(): void
    {
        $this->checkPagePermissions(
            '/imaging_qc/',
            ['imaging_quality_control_view'],
            "Imaging Quality Control"
        );
    }
    /**
     * Tests that, the homepage should not have "You do not have access
     * to this page." on the page with permission.
     *
     * @return void
     */
    function testPageLoadsWithoutPermissionsAccessAllProfiles()
    {
        $this->safeGet($this->url . "/imaging_qc/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "Something went wrong.",
            $bodyText
        );

    }
}
