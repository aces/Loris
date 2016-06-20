<?php
/**
 * Reliability automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   WangShen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class reliabilityTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Reliability module, some
     * text appears in the body.
     *
     * @return void
     */

 /**
     * Insert testing data
     *
     * @return void
     */
    public function setUp()
    {
        parent::setUp();
         $window = new WebDriverWindow($this->webDriver);
         $size = new WebDriverDimension(1024,768);
         $window->setSize($size);
   


    }

    function testReliabilityDoespageLoad()
    {
        $this->safeGet($this->url . "/reliability/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("reliability", $bodyText);
    }

   /**
     *Tests landing the Reliability with the permission 'violated_scans_view_allsites'
     *
     * @return void
     */
    function testLoginWithPermission()
    {
         $this->setupPermissions(array("access_all_profiles"));
         $this->safeGet($this->url . "/reliability/");
         $bodyText = $this->safeFindElement(
              WebDriverBy::cssSelector("body")
          )->getText();
          $this->assertNotContains("You do not have access to this page.", $bodyText);
          $this->resetPermissions();
     }





}
?>
