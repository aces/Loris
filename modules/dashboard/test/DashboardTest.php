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
        //Insert a pending user
        $this->DB->insert(
            "users",
            array(
             'UserID'          => 'testUser1',
             'Email'           => 'test@test.com',
             'Password'        => 'AA1234567!',
             'Password_expiry' => '2020-01-06',
            )
        );
        $user_id = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:test_user_id",
            array("test_user_id" => 'testUser1')
        );
        $this->DB->insert(
            "user_psc_rel",
            array(
             'UserID'   => $user_id,
             'CenterID' => '1',
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
            "subproject",
            array(
             'SubprojectID' => '55',
             'title'        => 'TESTinSubproject',
            )
        );
        $this->DB->insert(
            "candidate",
            array(
             'CandID'               => '999888',
             'RegistrationCenterID' => '55',
             'UserID'               => '1',
             'PSCID'                => '8888',
             'ProjectID'            => '7777',
             'Entity_type'          => 'Human',
             'Active'               => 'Y',
            )
        );
        $this->DB->insert(
            "session",
            array(
             'ID'           => '222222',
             'CandID'       => '999888',
             'CenterID'     => '55',
             'UserID'       => '1',
             'MRIQCStatus'  => '',
             'SubprojectID' => '55',
             'Active'       => 'Y',
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
        $this->DB->insert(
            "files",
            array(
             'FileID'       => '1111112',
             'SessionID'    => '222222',
             'SourceFileID' => '1111112',
            )
        );

        $this->DB->insert(
            "files_qcstatus",
            array(
             'FileID'   => '1111112',
             'FileQCID' => '2222221',
            )
        );
        $this->DB->insert(
            "conflicts_resolved",
            array(
             'ResolvedID'          => '999999',
             'UserID'              => 'demo',
             'ResolutionTimestamp' => '2015-11-03 16:21:49',
             'User1'               => 'Null',
             'User2'               => 'Null',
             'TableName'           => 'Test',
             'ExtraKey1'           => 'NULL',
             'ExtraKey2'           => 'NULL',
             'FieldName'           => 'TestTestTest',
             'CommentId1'          => '589569DCC000012291366553230',
             'CommentId2'          => 'DDE_589569DCC000012291366653254',
             'OldValue1'           => 'Mother',
             'OldValue2'           => 'Father',
             'NewValue'            => 'NULL',
            )
        );
        $this->DB->insert(
            "conflicts_unresolved",
            array(
             'TableName'      => 'TestTestTest',
             'ExtraKeyColumn' => 'Test',
             'ExtraKey1'      => 'Null',
             'ExtraKey2'      => 'Null',
             'FieldName'      => 'TestTestTest',
             'CommentId1'     => 'commentID111',
             'Value1'         => 'no',
             'CommentId2'     => 'DDE_963443000111271151398976899',
             'Value2'         => 'no',
            )
        );
        $this->DB->insert(
            "issues",
            array(
             'issueID'  => '999999',
             'assignee' => 'UnitTester',
             'status'   => 'new',
             'priority' => 'low',
             'reporter' => 'UnitTester',
            )
        );
        $this->DB->insert(
            "users",
            array(
             'ID'     => '9999991',
             'UserID' => 'Tester1',
            )
        );
        $this->DB->insert(
            "document_repository",
            array(
             'record_id'  => '9999997',
             'visitLabel' => null,
             'Date_taken' => '2016-07-27 18:00:10',
             'File_name'  => 'test.jpg',
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
        $this->DB->run('SET foreign_key_checks =0');
        $this->DB->delete(
            "document_repository",
            array('record_id' => '9999997')
        );
        $this->DB->delete(
            "users",
            array('ID' => '9999991')
        );
        $this->DB->delete(
            "issues",
            array('issueID' => '999999')
        );
        $this->DB->delete(
            "conflicts_resolved",
            array('ResolvedID' => '999999')
        );
        $this->DB->delete(
            "conflicts_unresolved",
            array('TableName' => 'TestTestTest')
        );
        $this->DB->delete(
            "files_qcstatus",
            array('FileID' => '1111112')
        );
        $this->DB->delete(
            "files",
            array('FileID' => '1111112')
        );

        $this->DB->delete(
            "users",
            array('UserID' => 'testUser1')
        );
        $this->DB->delete(
            "session",
            array('ID' => '222222')
        );
        $this->DB->delete(
            "candidate",
            array(
             'CandID'               => '999888',
             'RegistrationCenterID' => '55',
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
            "subproject",
            array('SubprojectID' => '55')
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
        $this->DB->update(
            "Config",
            array("Value" => null),
            array("ConfigID" => 48)
        );
        $this->DB->run('SET foreign_key_checks =1');
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
                    "v/div[1]/div[2]/div[1]/div/div/button"
                )
            );
        $views->click();

        $assertText1 = $this->webDriver
            ->findElement(
                WebDriverBy::XPath(
                    "//*[@id='lorisworkspace']/div/div/div[1]".
                    "/div[2]/div[1]/div/div/ul/li[1]/a"
                )
            )->getText();
        $assertText2 = $this->webDriver
            ->findElement(
                WebDriverBy::XPath(
                    "//*[@id='lorisworkspace']/div/div/div[1]".
                    "/div[2]/div[1]/div/div/ul/li[2]/a"
                )
            )->getText();
        $this->assertContains("View overall recruitment", $assertText1);
        $this->assertContains("View site breakdown", $assertText2);
    }

    /**
     * Check that for a user with 'Data Entry' permission, the number of incomplete
     * forms(instruments with Data Entry set to 'In Progress')is displayed in the My
     * Tasks panel. If the user also has 'Across all sites access candidates
     * profiles' then the site displayed is 'All', otherwise it is set to the site
     * the user belongs to and only the candidates that belong to the user's site
     * are considered for the computation of the number of incomplete forms.
     *
     * @return void
     */
    public function testNewScans()
    {

        $this->setupPermissions(
            array(
             "imaging_browser_qc",
             "imaging_browser_view_allsites",
            )
        );
        $this->safeGet($this->url . '/dashboard/');
        $this->_testMytaskPanelAndLink(
            ".new-scans",
            "10",
            "- Imaging Browser"
        );
        $this->resetPermissions();
    }
    /**
     * Verify that for a user with 'Resolving conflicts' permission the number
     * of data entry conflicts is reported in the My Task panel.
     * If the user also has 'Across all sites access candidates profiles' then
     * the site displayed is 'All', otherwise it is set to the site the user
     * belongs to. The number of data entry conflicts is the number of
     * entries in the Unresolved tab of the Conflict Resolver page.
     * Click on this task and check that you go to the Conflict Resolver page.
     *
     * @return void
     */
    public function testConflictResolver()
    {

        $this->setupPermissions(
            array(
             "conflict_resolver",
             "access_all_profiles",
            )
        );
        $this->safeGet($this->url . '/dashboard/');
        $this->_testMytaskPanelAndLink(
            ".conflict_resolver",
            "577",
            "- Conflict Resolver"
        );
        $this->resetPermissions();
    }
    /**
     *  Check user has 'issue_tracker_developer' permission,
     *  user can see the issue panel.
     *  Click the issue link can access issue module.
     *
     * @return void
     */
    public function testIssues()
    {
        $this->setupPermissions(
            array("issue_tracker_developer")
        );
        $this->safeGet($this->url . '/dashboard/');
        $this->_testMytaskPanelAndLink(
            ".issue_tracker",
            "1",
            "Issue Tracker"
        );
        $this->resetPermissions();
    }
    /**
     * Check that for a user with 'Data Entry' permission, the number of
     * incomplete forms (instruments with Data Entry  set to 'In Progress')
     * is displayed in the My Tasks panel. If the user also has 'Across all
     * sites access candidates profiles' then the site displayed is 'All',
     * otherwise it is set to the site the user belongs to and only the
     * candidates that belong to the user's site are considered for the
     * computation of the number of incomplete forms.
     * Clicking on this task should take you to the BVL statistics page,
     * with the stats filtered according to the user's site (or without
     * any filter if the user has 'Across all sites access candidates
     * profiles' permission).
     *
     * @return void
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
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains("Incomplete forms", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Verify that if a user has 'User Management / Survey Participant
     * Management' permission, the number of pending account approvals
     * is displayed in the My Task panel. This should be the number of
     * entries in the User Account page with the following Selection Filter:
     * Site set to the user's site and Pending Approval set to 'Yes'. The
     * Site displayed will be the user's site. Check that you are taken to
     * that page (with the Selection Filter correctly set) when you click
     * on the task.
     *
     * @return void
     */
    public function testPendingUser()
    {

        $this->setupPermissions(
            array(
             "user_accounts_multisite",
             "user_accounts",
            )
        );
        $this->safeGet($this->url . '/dashboard/');
        $this->_testMytaskPanelAndLink(
            ".pending-accounts",
            "1",
            "- User Accounts"
        );
        $this->resetPermissions();
    }
    /**
     * Verify that if a user has the 'View and upload files in Document
     * Repository' or 'Delete files in Document Repository' permission,
     * the latest documents to have been edited or uploaded in the document
     * repository are displayed (4 at most) in the Document Repository panel.
     * Clicking on a document will display it in the browser.
     * Clicking on the Document Repository button takes you to the Document
     * Repository page.
     *
     * @return void
     */
    public function testDocumentRepository()
    {

        $this->setupPermissions(
            array(
             "document_repository_delete",
             "document_repository_view",
            )
        );
        $this->safeGet($this->url . '/dashboard/');
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains("test.jpg", $bodyText);
        $this->assertContains("NEW", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Test the link with right value and permission
     *
     * @param string $className class Name of template
     * @param string $value     the total of test data
     * @param string $dataSeed  test result
     *
     * @return void
     */
    private function _testMytaskPanelAndLink($className,$value,$dataSeed)
    {
        $this->safeGet($this->url . '/dashboard/');
        $link     =$this->safeFindElement(WebDriverBy::cssSelector($className));
        $bodyText = $link->findElement(WebDriverBy::cssSelector(".huge"))->getText();
        $this->assertContains($value, $bodyText);
        $this->safeClick(WebDriverBy::cssSelector($className));
        $this->webDriver->wait(3, 500)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::Id('lorisworkspace')
            )
        );
        $pageSource = $this->webDriver->getPageSource();
        $this->assertContains($dataSeed, $pageSource);

    }
    /**
     *  If test on local machine, then run this function.
     *
     * @return void
     */
    public function testLocal()
    {
        $config  =& NDB_Config::singleton();
        $dev     = $config->getSetting("dev");
        $sandbox = $dev['sandbox'];
        if ($sandbox == '1') {

            $this->_testPlan1();
            $this->_testPlan2();
            $this->_testPlan3();
            $this->_testPlan5And6();
            $this->_testPlan7And8();

        } else {
            $this->assertEquals(true, 1);
        }

    }
    /**
     * Log in. Note the time. Log out and log back in after 2 minutes.
     * Check that welcome panel info is correct.
     *
     * @return void
     */
    private function _testPlan1()
    {
        $this->safeGet($this->url . '/main.php?logout=true');
         $this->login("UnitTester", "4test4");
        $welcomeText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector(".welcome"))->getText();
        $this->assertContains("Unit Tester", $welcomeText);
    }
    /**
     * Make sure there is no recruitment target set in the configuration
     * module. Check that an incentive to define a recruitment target is
     * displayed in recruitment panel.
     *
     * @return void
     */
    private function _testPlan2()
    {
        $this->safeGet($this->url . '/dashboard/');
        $testText = $this->webDriver
            ->findElement(WebDriverBy::Id("overall-recruitment"))->getText();
        $this->assertContains(
            "Please add a recruitment target for Overall Recruitment.",
            $testText
        );
    }
    /**
     * Put a recruitment target in the configuration module and check that
     * the info in the recruitment panel is correct.
     *
     * @return void
     */
    private function _testPlan3()
    {
        $this->safeGet($this->url . '/configuration/');
        $this->webDriver->findElement(
            WebDriverBy::Xpath(
                "//*[@id='lorisworkspace']/div[1]/ul/li[5]/a"
            )
        )->click();

        $this->webDriver->findElement(
            WebDriverBy::Xpath(
                "//*[@id='48']/input"
            )
        )->clear();
        $this->webDriver->findElement(
            WebDriverBy::Xpath(
                "//*[@id='48']/input"
            )
        )->sendKeys('888');
        $this->webDriver->findElement(
            WebDriverBy::Xpath(
                "//*[@id='dashboard']/div/form/div[3]/div/button[1]"
            )
        )->click();
        $this->safeGet($this->url . '/dashboard/');
        $testText = $this->webDriver
            ->findElement(WebDriverBy::Id("overall-recruitment"))->getText();
        $this->assertContains(
            "888",
            $testText
        );
    }
    /**
     * 5. Create a candidate and assign it to any site. Inactivate it.
     * Make sure it is NOT taken into account in the sex
     * breakdown view (recruitment panel).
     * 6. Check that site breakdown view (recruitment panel) is correct.
     *
     * @return void
     */
    private function _testPlan5And6()
    {
        $this->safeGet($this->url . '/dashboard/');
        $testText = $this->webDriver
            ->findElement(
                WebDriverBy::Xpath(
                    "//*[@id='lorisworkspace']/div/div[1]/div[2]"
                )
            )->getText();
        $this->assertNotContains(
            "There have been no candidates registered yet.",
            $testText
        );
    }
    /**
     * 7. Check that scans per site (study progression panel) view is correct
     * (scan dates and scan numbers).
     * 8. Check that recruitment per site view is correct
     * (study progression panel).
     *
     * @return void
     */
    private function _testPlan7And8()
    {
        $this->safeGet($this->url . '/dashboard/');
        $testText = $this->webDriver
            ->findElement(
                WebDriverBy::Xpath(
                    "//*[@id='lorisworkspace']/div/div[1]/div[3]"
                )
            )->getText();
        $this->assertContains(
            "Scan sessions per site",
            $testText
        );

        $this->assertNotContains(
            "There have been no candidates registered yet.",
            $testText
        );
    }

}

