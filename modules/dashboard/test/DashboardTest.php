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
             'UserID'          => 'testUser1',
             'Email'           => 'test@test.com',
             'Password'        => 'AA1234567!',
             'CenterID'        => '1',
             'Password_expiry' => '2020-01-06',
            )
        );
        //Insert two violation scan
        $this->DB->insert(
            "psc",
            array(
             'CenterID'  => '55',
             'Name'      => 'TESTinPSC',
             'Alias'     => 'tst',
             'MRI_alias' => 'test',
            )
        );
        $this->DB->insert(
            "candidate",
            array(
             'CandID'      => '999888',
             'CenterID'    => '55',
             'UserID'      => '1',
             'PSCID'       => '8888',
             'ProjectID'   => '7777',
             'Entity_type' => 'Human',
            )
        );
        $this->DB->insert(
            "session",
            array(
             'ID'           => '222222',
             'CandID'       => '999888',
             'CenterID'     => '55',
             'UserID'       => '1',
             'MRIQCStatus'  => 'Pass',
             'SubprojectID' => '6666',
            )
        );
        $this->DB->insert(
            "mri_protocol_violated_scans",
            array(
             'ID'                 => '1001',
             'CandID'             => '999888',
             'PatientName'        => '[Test]PatientName',
             'time_run'           => '2009-06-29 04:00:44',
             'minc_location'      => 'assembly/test/test/mri/test/test.mnc',
             'series_description' => 'Test Series Description',
             'SeriesUID'          => '5555',
            )
        );
        $this->DB->insert(
            "mri_protocol_violated_scans",
            array(
             'ID'                 => '1002',
             'CandID'             => '999888',
             'PatientName'        => '[Test]PatientName',
             'time_run'           => '2008-06-29 04:00:44',
             'minc_location'      => 'assembly/test2/test2/mri/test2/test2.mnc',
             'series_description' => 'Test Series Description',
             'SeriesUID'          => '5556',
            )
        );
        $this->DB->insert(
            "violations_resolved",
            array(
             'ExtID'     => '1001',
             'hash'      => 'this is not a null value',
             'TypeTable' => 'mri_protocol_violated_scans',
             'Resolved'  => 'other',
            )
        );
        $this->DB->insert(
            "violations_resolved",
            array(
             'ExtID'     => '1002',
             'hash'      => 'this is not a null value',
             'TypeTable' => 'MRICandidateErrors',
             'Resolved'  => 'unresolved',
            )
        );
        $this->DB->insert(
            "MRICandidateErrors",
            array(
             'ID'          => '1002',
             'PatientName' => '[Test]PatientName',
             'MincFile'    => 'assembly/test2/test2/mri/test2/test2.mnc',
             'SeriesUID'   => '5556',
            )
        );
        //Insert an incomplete form data
         $this->DB->insert(
             "test_names",
             array(
              'ID'        => '111',
              'Test_name' => 'TestName11111111111',
             )
         );
         $this->DB->insert(
             "flag",
             array(
              'ID'         => '111111',
              'SessionID'  => '222222',
              'Test_name'  => 'TestName11111111111',
              'CommentID'  => 'commentID111',
              'Data_entry' => 'In Progress',
             )
         );
         //Insert a demo data into conflicts_unresolved
         $this->DB->insert(
             "conflicts_unresolved",
             array(
              'TableName'      => 'TestTestTest',
              'ExtraKeyColumn' => 'Test',
              'ExtraKey1'      => 'Null',
              'ExtraKey2'      => 'Null',
              'FieldName'      => 'TestTestTest',
              'CommentId1'     => '963443000111271151398976899',
              'Value1'         => 'no',
              'CommentId2'     => 'DDE_963443000111271151398976899',
              'Value2'         => 'no',
             )
         );

    }
    /**
     * Delete the test data
     *
     * @return void
     */
    public function tearDown()
    {
        $this->DB->delete(
            "users",
            array('UserID' => 'testUser1')
        );
        $this->DB->delete(
            "session",
            array(
             'CandID'   => '999888',
             'CenterID' => '55',
            )
        );
        $this->DB->delete(
            "candidate",
            array(
             'CandID'   => '999888',
             'CenterID' => '55',
            )
        );
        $this->DB->delete(
            "mri_protocol_violated_scans",
            array(
             'ID'     => '1001',
             'CandID' => '999888',
            )
        );
        $this->DB->delete(
            "mri_protocol_violated_scans",
            array(
             'ID'     => '1002',
             'CandID' => '999888',
            )
        );
        $this->DB->delete(
            "violations_resolved",
            array(
             'ExtID'     => '1001',
             'TypeTable' => 'mri_protocol_violated_scans',
            )
        );
        $this->DB->delete(
            "MRICandidateErrors",
            array('ID' => '1002')
        );
        $this->DB->delete(
            "violations_resolved",
            array(
             'ExtID'     => '1002',
             'TypeTable' => 'mri_protocol_violated_scans',
            )
        );
        $this->DB->delete(
            "psc",
            array(
             'CenterID' => '55',
             'Name'     => 'TESTinPSC',
            )
        );
        $this->DB->delete(
            "flag",
            array('CommentID' => 'commentID111')
        );
        $this->DB->delete(
            "test_names",
            array('ID' => '111')
        );
        $this->DB->delete(
            "conflicts_unresolved",
            array('TableName' => 'TestTestTest')
        );
        parent::tearDown();
    }



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
     * Verify that a user with 'Violated Scans: View all-sites Violated Scans'
     * permission has a task with the number of violated scans displayed.
     * This is the number of entries on the MRI Violated Scans page.
     * Check that clicking on the task takes you to the Violated Scans page.
     *
     * @return void
     */
    public function testMriViolations()
    {
        $this->setupPermissions(
            array("violated_scans_view_allsites")
        );
        $this->_testMytaskPanelAndLink(".mri_violations", "2", "[Test]PatientName");
        $this->resetPermissions();
    }
    /**
     * Check that for a user with 'Data Entry' permission, the number of incomplete
     * forms(instruments with Data Entry set to 'In Progress')is displayed in the My
     * Tasks panel. If the user also has 'Across all sites access candidates
     * profiles' then the site displayed is 'All', otherwise it is set to the site
     * the user belongs to and only the candidates that belong to the user's site
     * are considered for the computation of the number of incomplete forms.
     *
     *  @return void
     */
    public function testIncompleteForm()
    {

        $this->setupPermissions(
            array(
             "data_entry",
             "access_all_profiles",
            )
        );
        $this->safeGet($this->url . '/dashboard/');
        $this->_testMytaskPanelAndLink(
            ".statistics",
            "1",
            "All Completion Statistics"
        );
        $this->resetPermissions();
    }
    /**
     * Test the link with right value and permission
     *
     * @param string $className class Name of template
     * @param string $value     the total of test data
     * @param string $dataSeed  test result
     *
     * @return void.
     */
    private function _testMytaskPanelAndLink($className,$value,$dataSeed)
    {
        $this->safeGet($this->url . '/dashboard/');
        sleep(5);
        $link     =$this->safeFindElement(WebDriverBy::cssSelector($className));
        $bodyText = $link->findElement(WebDriverBy::cssSelector(".huge"))->getText();
        $this->assertContains($value, $bodyText);
        $link->click();
        sleep(5);
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains($dataSeed, $bodyText);

    }

}
?>
