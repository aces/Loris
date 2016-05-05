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
     * Tests that, when loading the Dashboard, the word "Welcome" appears
     * in the welcome panel
     *
     * @return void
     */
    public function testDashboardPageLoads()
    {
        $this->safeGet($this->url . '/dashboard/');
        $welcomeText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector(".welcome"))->getText();
        $this->assertContains("Welcome", $welcomeText);
    }



     /**
      * To test that, when loading the Dashboard, click the Views button of
      * Recruitment, the items "View overall recruitment" and "View site breakdown"
      * appear
      * author : Wang Shen
      *
      * @return void
      */
    public function testDashboardRecruitmentView()
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
    /**
  * Verify that for a user with 'conflict_resolver' permission,
  * Check that site displayed is always 'All'.
  * Click on this task and verify that you go to the conflict_resolver page.
  *
  *@return void
  */
    public function testConflictResolverPermission()
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
    /**
   * Verify that for a user with 'Violated Scans: View all-sites' permissions,
   * Check that site displayed is always 'All'.
   *
   * @return void
   */
    public function testViolatedPermission()
    {
         $this->setupPermissions(array("violated_scans_view_allsites"));
         // check the link
         $this->safeGet($this->url . "/mri_violations/");
         $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))
             ->getText();
         $this->assertNotContains("You do not have access to this page", $bodyText);
         $this->resetPermissions();

    }
    /**
  * Verify that for a user with 'Across all sites create and edit user
  * accounts' permission.
  * Check that site displayed is always 'All'.
  *
  * @return void
  */
    public function testAcrossAllPermission()
    {
         $this->setupPermissions(array("user_accounts_multisite", "user_accounts"));
         // check the link
         $this->safeGet($this->url . "/user_accounts/");
         $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))
             ->getText();
         $this->assertNotContains("You do not have access to this page", $bodyText);
         $this->resetPermissions();

    }
    /**
   * Verify that for a user with "edit Final radiological review" or
   * "view_final_radiological_review" permission.
   * Check that site displayed is always 'All'.
  *
   * @return void
   */
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
}
