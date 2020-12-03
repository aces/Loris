<?php declare(strict_types=1);
/**
 * Behavioural_QC automated integration tests
 *
 * PHP Version 5
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
 * Behavioural_QC automated integration tests
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Behavioural_QCTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the behavioural_qc module, some
     * text appears in the body.
     *
     * @return void
     */
    function testBehaviouralQCDoespageLoad()
    {
        $this->safeGet($this->url . "/behavioural_qc/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Behavioural Quality Control", $bodyText);
    }
    /**
     * Tests that behavioural_qc does not load with the permission
     *
     * @return void
     */
    function testBehaviouralQCWithoutPermission()
    {
        $this->setupPermissions([]);
        $this->safeGet($this->url . "/behavioural_qc/");
        $this->checkPagePermissions(
            '/behavioural_qc/',
            [],
            "Behavioural Quality Control",
            "You do not have access to this page."
        );
    }
    /**
     * Tests that help editor loads with the permission
     * Ensures that the module loads if and only if the user has one of the
     * module permissions codes.
     *
     * @return void
     */
    public function testPermissions(): void
    {
        $this->setupPermissions(["behavioural_quality_control_view"]);
        $this->safeGet($this->url . "/behavioural_qc/");
        $this->checkPagePermissions(
            '/behavioural_qc/',
            ['behavioural_quality_control_view'],
            "Behavioural Quality Control"
        );
    }
}
