<?php
/**
 * Dashboard automated integration tests
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
 * Dashboard module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DashboardTest extends LorisIntegrationTest
{

    /**
     * Setup the screen size of Travis-cs
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
        $window = new WebDriverWindow($this->webDriver);
        $size   = new WebDriverDimension(1280, 1024);
        $window->setSize($size);
        //Insert a pending user
        $this->DB->insert(
            "users",
            array(
             'UserID' => 'testUser1',
             'Email' => 'test@test.com',
             'Password' => 'AA1234567!',
             'CenterID' => '1',
             'Password_expiry' => '2020-01-06'
            )
        ); 
        //Insert two violation scan
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
             'PSCID'         => '8888',
             'ProjectID'     => '7777'
            )
        );
        $this->DB->insert(
            "session",
            array(
             'CandID'        => '999888',
             'CenterID'      => '55',
             'UserID'        => '1',
             'MRIQCStatus'   => 'Pass',
             'SubprojectID'  => '6666'
            )
        );
        $this->DB->insert(
            "mri_protocol_violated_scans",
            array(
             'ID'            => '1001',
             'CandID'        => '999888',
             'PatientName'   => '[Test]PatientName',
             'time_run'      => '2009-06-29 04:00:44',
             'minc_location' => 'assembly/test/test/mri/test/test.mnc',
        'series_description' => 'Test Series Description',
                 'SeriesUID' => '5555'
            )
        );
        $this->DB->insert(
            "mri_protocol_violated_scans",
            array(
             'ID'            => '1002',
             'CandID'        => '999888',
             'PatientName'   => '[Test]PatientName',
             'time_run'      => '2008-06-29 04:00:44',
             'minc_location' => 'assembly/test2/test2/mri/test2/test2.mnc',
        'series_description' => 'Test Series Description',
                 'SeriesUID' => '5556'
            )
        );        
        $this->DB->insert(
            "violations_resolved",
            array(
             'ExtID'         => '1001',
             'TypeTable'     => 'mri_protocol_violated_scans',
             'Resolved'      => 'other'
            )
        );
        $this->DB->insert(
            "violations_resolved",
            array(
             'ExtID'         => '1002',
             'TypeTable'     => 'MRICandidateErrors',
             'Resolved'      => 'unresolved'
            )
        );
        $this->DB->insert(
            "MRICandidateErrors",
            array(
             'ID'         => '1002',
             'PatientName'      => '[Test]PatientName',
             'MincFile'       => 'assembly/test2/test2/mri/test2/test2.mnc',
             'SeriesUID'      => '5556'
            )
        );

    }
    //Delete the test data
    public function tearDown()
    {
        $this->DB->delete(
            "users",
            array('UserID'=>'testUser1')
        );
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
            "mri_protocol_violated_scans",
           array(
             'ID'            => '1002',
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
            "MRICandidateErrors",
            array(
             'ID'         => '1002'
            )
        );
        $this->DB->delete(
            "violations_resolved",
            array(
             'ExtID'         => '1002',
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
     * Tests that, when loading the Dashboard, the word "Welcome" appears
     * in the welcome panel
     *
     * @return void
     */
/*    public function testDashboardPageLoads()
    {
        $this->safeGet($this->url . '/dashboard/');
        $welcomeText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector(".welcome"))->getText();
        $this->assertContains("Welcome", $welcomeText);
    }
*/


     /**
      * To test that, when loading the Dashboard, click the Views button of
      * Recruitment, the items "View overall recruitment" and "View site breakdown"
      * appear
      * author : Wang Shen
      *
      * @return void
      */
/*    public function testDashboardRecruitmentView()
    {
        $this->safeGet($this->url . '/dashboard/');
        $views = $this->webDriver
            ->findElement(
                WebDriverBy::Xpath(
                    "//*[@id='lorisworkspace']/div/di".
                    "v[1]/div[2]/div[1]/div/div/button"
                )
            );
        $views->click();

        $assertText1 = $this->webDriver
            ->findElement(
                WebDriverBy::XPath(
                    "//*[@id='lorisworkspace']/div/div[1]".
                    "/div[2]/div[1]/div/div/ul/li[1]/a"
                )
            )->getText();
        $assertText2 = $this->webDriver
            ->findElement(
                WebDriverBy::XPath(
                    "//*[@id='lorisworkspace']/div/div[1]".
                    "/div[2]/div[1]/div/div/ul/li[2]/a"
                )
            )->getText();
        $this->assertContains("View overall recruitment", $assertText1);
        $this->assertContains("View site breakdown", $assertText2);
    }
*/
    /**
  * Verify that for a user with 'conflict_resolver' permission,
  * Check that site displayed is always 'All'.
  * Click on this task and verify that you go to the conflict_resolver page.
  *
  *@return void
  */
/*    public function testConflictResolverPermission()
    {
        // check the element which shows on the My tasks panel
         $this->setupPermissions(array("conflict_resolver"));
             // check the link
             $this->safeGet($this->url . "/conflict_resolver/");
             $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))
                 ->getText();

             $this->assertNotContains(
                 "You do not have access to this page",
                 $bodyText
             );
             $this->resetPermissions();

    }
*/
    /**
   * Verify that for a user with 'Violated Scans: View all-sites' permissions,
   * Check that site displayed is always 'All'.
   *
   * @return void
   */
/*    public function testViolatedPermission()
    {
         $this->setupPermissions(array("violated_scans_view_allsites"));
         // check the link
         $this->safeGet($this->url . "/mri_violations/");
         $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))
             ->getText();
         $this->assertNotContains("You do not have access to this page", $bodyText);
         $this->resetPermissions();

    }
*/
    /**
  * Verify that for a user with 'Across all sites create and edit user
  * accounts' permission.
  * Check that site displayed is always 'All'.
  *
  * @return void
  */
/*    public function testAcrossAllPermission()
    {
         $this->setupPermissions(array("user_accounts_multisite", "user_accounts"));
         // check the link
         $this->safeGet($this->url . "/user_accounts/");
         $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))
             ->getText();
         $this->assertNotContains("You do not have access to this page", $bodyText);
         $this->resetPermissions();

    }
*/
    /**
   * Verify that for a user with "edit Final radiological review" or
   * "view_final_radiological_review" permission.
   * Check that site displayed is always 'All'.
  *
   * @return void
   */
/*
    public function testRadiologicalPermission()
    {
         $this->setupPermissions(
             array(
              "edit_final_radiological_review",
              "view_final_radiological_review",
             )
         );
         // check the link
         $this->safeGet($this->url . "/final_radiological_review/");
         $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))
             ->getText();
         $this->assertNotContains("You do not have access to this page", $bodyText);
         $this->resetPermissions();

    }
/*
    /**
     * Tests that, when loading the Dashboard and Config,the number of the Target
     * number of participants should be same.
     *
     * @return void
     */
    public function testPendingUser()
    {
        $this->setupPermissions(
             array(
              "user_accounts_multisite","user_accounts"
             )
         );
        $this->_testMytaskPanelAndLink(".pending-accounts","1","testUser1");
        $this->resetPermissions();
    }
    
    public function testMriViolations()
    {
      $this->_testMytaskPanelAndLink(".mri_violations","2","[Test]PatientName");   
    } 
   
    private function _testMytaskPanelAndLink($className,$value,$dataSeed)
    {
        $this->safeGet($this->url . '/dashboard/');
        sleep(5);
        $link = $this->webDriver
            ->findElement(WebDriverBy::cssSelector($className));
        $bodyText = $link->findElement(WebDriverBy::cssSelector(".huge"))->getText();
        $this->assertContains($value, $bodyText);
        $link->click();
        sleep(5);
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains($dataSeed, $bodyText);
        
    }
    
}
?>
