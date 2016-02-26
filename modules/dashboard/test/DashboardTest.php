<?php
/**
 * Dashboard automated integration tests
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
 * Dashboard module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DashboardTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Dashboard, the word "Welcome" appears 
     * in the welcome panel
     * Test Data: admin account
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
     * Tests that, when loading the Dashboard, click the loris icon, it relocate this dashboard the word "Welcome" appears
     * in the welcome panel
     * author : Wang Shen 
     * @return void
     */

    public function testDashboardLoris()
    {
        $this->safeGet($this->url . '/dashboard/');

        $loris = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#nav-left > div.navbar-header > a"));
            $loris->click();
            $assertText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector(".welcome"))->getText();
        $this->assertContains("Welcome", $assertText);
    }
  
  /**
     * Tests that, when loading the Dashboard, click the Views button of Recruitment, the items "View overall recruitment" and "View site breakdown" appear
     * author : Wang Shen 
     * @return void
     */

    public function testDashboardRecruitmentView()
    {
        $this->safeGet($this->url . '/dashboard/');

        $views = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-8 > div:nth-child(2) > div.panel-heading > div > div > button"));
            $views->click();
           
            $assertText1 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-8 > div:nth-child(2) > div.panel-heading > div > div > ul > li.active > a"))->getText();
            $assertText2 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-8 > div:nth-child(2) > div.panel-heading > div > div > ul > li:nth-child(2) > a"))->getText();

        $this->assertContains("View overall recruitment", $assertText1);
        $this->assertContains("View site breakdown", $assertText2);
    }
  /**
     * Tests that, when loading the Dashboard, click the ViewSiteBreakdown button, the item "Total recruitment per site" appears in the Recruitment section.
     * author : Wang Shen 
     * @return void
     */

    public function testDashboardRecruitmentView_ViewSiteBreakdown()
    {
        $this->safeGet($this->url . '/dashboard/');

        $views = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-8 > div:nth-child(2) > div.panel-heading > div > div > button"));
            $views->click();

        $ViewSiteBreakdown = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-8 > div:nth-child(2) > div.panel-heading > div > div > ul > li:nth-child(2) > a"));
        $ViewSiteBreakdown->click();
        
        $assertText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#recruitment-site-breakdown > div.col-lg-4.col-md-4.col-sm-4 > div > h5"))->getText();

   

        $this->assertContains("Total recruitment per site", $assertText);
        
    }

    /**
     * Tests that, when loading the Dashboard, click the Views button of Recruitment, the items "View scans per site" and "View scans per site" appear in Study Progression.
     * author : Wang Shen 
     * @return void
     */

    public function testDashboardStudyProgressionView()
    {
        $this->safeGet($this->url . '/dashboard/');

        $views = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-8 > div:nth-child(3) > div.panel-heading > div > div > button"));
            $views->click();

         $assertText1 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-8 > div:nth-child(3) > div.panel-heading > div > div > ul > li:nth-child(1) > a"))->getText();
            $assertText2 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-8 > div:nth-child(3) > div.panel-heading > div > div > ul > li:nth-child(2) > a"))->getText();

        $this->assertContains("View scans per site", $assertText1);
        $this->assertContains("View recruitment per site", $assertText2);
        
    }


    



    /**
     * Tests that, when loading the Dashboard, click the stie all button of incomplete forms in the My tasks panel, it relocates to All Completion Statistics.
     * author : Wang Shen 
     * @return void
     */

    public function testDashboardMyTasks_IncompleteForms()
    {
        $this->safeGet($this->url . '/dashboard/');

        $siteAll = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-4 > div:nth-child(1) > div > div.panel-body > div > a:nth-child(2) > div > div.col-xs-4.text-right.alert-chevron > p"));
            $siteAll ->click();

         $assertText1 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > h2"))->getText();
 
        $this->assertContains("All Completion Statistics", $assertText1);
        
        
    }

       /**
     * Tests that, when loading the Dashboard, click the stie all button of New and pending scans in the My tasks panel, it relocates to Imaging Browser.
     * author : Wang Shen 
     * @return void
     */

    public function testDashboardMyTasks_NewPendingScans()
    {
        $this->safeGet($this->url . '/dashboard/');

        $siteAll = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-4 > div:nth-child(1) > div > div.panel-body > div > a.list-group-item.new-scans > div > div.col-xs-4.text-right.alert-chevron > span"));
            $siteAll ->click();

         $assertText1 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#page > div > div.alert.alert-info.alert-sm > a > label"))->getText();
      
        $this->assertContains("Imaging Browser", $assertText1);
        
        
    }


       /**
     * Tests that, when loading the Dashboard, click the stie all button of Violated Scans in the My tasks panel, it relocates to Mri Violations.
     * author : Wang Shen 
     * @return void
     */

    public function testDashboardMyTasks_ViolatedScans()
    {
        $this->safeGet($this->url . '/dashboard/');

        $siteAll = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-4 > div:nth-child(1) > div > div.panel-body > div > a:nth-child(4) > div > div.col-xs-4.text-right.alert-chevron > span"));
            $siteAll ->click();

         $assertText1 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#page > div > div.alert.alert-info.alert-sm > a > label"))->getText();
       
        $this->assertContains("Mri Violations", $assertText1);
        
        
    }


       /**
     * Tests that, when loading the Dashboard, click the stie all button of Final radiological reviews in the My tasks panel, it relocates to Final Radiological Review.
     * author : Wang Shen 
     * @return void
     */

    public function testDashboardMyTasks_FinalRadiologicalReviews()
    {
        $this->safeGet($this->url . '/dashboard/');

        $siteAll = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-4 > div:nth-child(1) > div > div.panel-body > div > a.list-group-item.radiological-review > div > div.col-xs-4.text-right.alert-chevron > span"));
            $siteAll ->click();

         $assertText1 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#page > div > div.alert.alert-info.alert-sm > a > label"))->getText();
          
        $this->assertContains("Final Radiological Review", $assertText1);
        
        
    }


    /**
     * Tests that, when loading the Dashboard, click the stie all button of Accounts pending approval in the My tasks panel, it relocates to Mri Violations.
     * author : Wang Shen 
     * @return void
     */

    public function testDashboardMyTasks_AccountsPendingApproval()
    {
        $this->safeGet($this->url . '/dashboard/');

        $siteAll = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-4 > div:nth-child(1) > div > div.panel-body > div > a.list-group-item.pending-accounts > div > div.col-xs-4.text-right.alert-chevron > span"));
            $siteAll ->click();

         $assertText1 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#page > div > div.alert.alert-info.alert-sm > a > label"))->getText();
           
        $this->assertContains("User Accounts", $assertText1);
        
        
    }

    /**
     * Tests that, when loading the Dashboard, click Document Repository, it relocates to Document Repository.
     * author : Wang Shen 
     * @return void
     */

    public function testDashboardMyTasks_DocumentRepository()
    {
        $this->webDriver->get($this->url . '?test_name=dashboard');

        $siteAll = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#lorisworkspace > div > div.col-lg-4 > div:nth-child(2) > div > div.panel-body > a"));
            $siteAll ->click();

         $assertText1 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#page > div > div.alert.alert-info.alert-sm > a > label"))->getText();
           
           
        $this->assertContains("Document Repository", $assertText1);  
        
    }

    /**
     * Tests that, when loading the Dashboard as admin account, the submenu configuration should be appeared.
     * author : Wang Shen 
     * @return void
     */

  public function testDashboard_GetPermossion()
  {
        
    $this->webDriver->get($this->url . '?test_name=dashboard');
    $this->webDriver->get("https://wangshen-dev.loris.ca//configuration/");
   
 

       $assertText1 = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#page > div > div.alert.alert-info.alert-sm > a > label"))->getText();
           
           
        $this->assertContains("Configuration", $assertText1);  
       
  }



}
?>
