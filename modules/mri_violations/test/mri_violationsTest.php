<?php
/**
 * Mri_violations automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class MriViolationsTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Mri_violations module, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriViolationsDoesPageLoad()
    {
        $this->safeGet($this->url . "/mri_violations/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Mri Violations", $bodyText);
    }

    /**
     * Tests that, when loading the Mri_violations module > mri_protocol_violations submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriProtocolViolationsDoesPageLoad()
    {
        $this->safeGet($this->url . "/mri_violations/?submenu=mri_protocol_violations");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Mri Violations", $bodyText);
    }

    /**
     * Tests that, when loading the Mri_violations module > mri_protocol_check_violations submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriProtocolCheckViolationsDoesPageLoad()
    {
        $this->safeGet($this->url . "/mri_violations/?submenu=mri_protocol_check_violations");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Mri Violations", $bodyText);
    }
//violated_scans_view_allsites
//violated_scans_edit 

   /**
     *Tests that help editor loads with the permission
     *
     * @return void
     */
    function testLoginWithPermission()
    {
         $this->setupPermissions(array("violated_scans_view_allsites"));
         $this->safeGet($this->url . "/mri_violations/");
         $bodyText = $this->safeFindElement(
              WebDriverBy::cssSelector("body")
          )->getText();
          $this->assertNotContains("You do not have access to this page.", $bodyText);
          $this->resetPermissions();
     }
   /**
     *Tests that help editor loads with the permission
     *
     * @return void
     */
    function testLoginWithoutPermission()
    {
         $this->setupPermissions(array(""));
         $this->safeGet($this->url . "/mri_violations/");
         $bodyText = $this->safeFindElement(
              WebDriverBy::cssSelector("body")
          )->getText();
          $this->assertContains("You do not have access to this page.", $bodyText);
          $this->resetPermissions();
    }
   



}
?>
