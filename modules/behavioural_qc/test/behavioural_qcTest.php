<?php
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
require_once __DIR__ .
        "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
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
class Behavioural_QCTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the behavioural_qc module, some
     * text appears in the body.
     *
     * @return void
     */
    function testBeahaviouralQCDoespageLoad()
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
    function testBeahaviouralQCWithoutPermission()
    {
         $this->setupPermissions(array());
         $this->safeGet($this->url . "/behavioural_qc/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
            "You do not have access to this page.",
            $bodyText
        );
         $this->resetPermissions();
    }
    /**
     * Tests that help editor loads with the permission
     *
     * @return void
     */
    function testBeahaviouralQCPermission()
    {
         $this->setupPermissions(array("quality_control"));
         $this->safeGet($this->url . "/behavioural_qc/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
        );
          $this->resetPermissions();
    }
}
