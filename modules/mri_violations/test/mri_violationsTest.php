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
        $this->DB->insert(
            "psc",
            array(
             'CenterID' => '55', 
             'Name' => 'TESTinPSC',
             'Alias' => 'test',
             'MRI_alias' => 'test'
            )

        );
        $this->DB->insert(
            "candidate",
            array(
             'CandID'        => '999888',
             'CenterID'      => '55',
             'UserID'        => '1',
             'PSCID'         => '8888'
            )
        );
        $this->DB->insert(
            "session",
            array(
             'CandID'        => '999888',
             'CenterID'      => '55',
             'UserID'        => '1',
             'MRIQCStatus'   => 'Pass'
            )
        );
        $this->DB->insert(
            "mri_protocol_violated_scans",
            array(
             'ID'            => '1001',
             'CandID'        => '999888'
            )
        );
        $this->DB->insert(
            "violations_resolved",
            array(
             'ExtID'         => '1001',
             'TypeTable'     => 'mri_protocol_violated_scans'
            )
        );

    }

    public function tearDown()
    {

        $this->DB->delete(
            "session",
            array('CandID' => '999888','CenterID' => '55')
        );     
        $this->DB->delete(
            "candidate",
            array('CandID' => '999888','CenterID' => '55')
        );
        $this->DB->delete(
            "mri_protocol_violated_scans",        
           array(
             'ID'            => '1001',
             'CandID'        => '999888'
            )
        );
        $this->DB->delete(
            "violations_resolved",
            array(
             'ExtID'         => '1001',
             'TypeTable'     => 'mri_protocol_violated_scans'
            )
        );
        $this->DB->delete(
            "psc",
            array('CenterID' => '55', 'Name' => 'TESTinPSC')
        );
        parent::tearDown();
    }
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
