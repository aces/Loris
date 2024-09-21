<?php
/**
 * Dashboard automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Dashboard module automated integration tests
 *
 * PHP Version 7
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
    function setUp(): void
    {
        parent::setUp();
        //Insert a pending user
        $this->DB->insert(
            "users",
            [
                'UserID'                 => 'testUser1',
                'Email'                  => 'test@test.com',
                'Password'               => 'AA1234567!',
                'PasswordChangeRequired' => false
            ]
        );
        $user_id = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:test_user_id",
            ["test_user_id" => 'testUser1']
        );
        $this->DB->insert(
            "user_psc_rel",
            [
                'UserID'   => $user_id,
                'CenterID' => '1',
            ]
        );
        //Insert two violation scan
        $this->DB->insert(
            "psc",
            [
                'CenterID'  => '55',
                'Name'      => 'TESTinPSC',
                'Alias'     => 'tst',
                'MRI_alias' => 'test',
            ]
        );
        $this->DB->insert(
            "cohort",
            [
                'CohortID' => '55',
                'title'    => 'TESTinCohort',
            ]
        );
        $this->DB->insert(
            "Project",
            [
                'ProjectID' => '7777',
                'Name'      => 'TESTinProject',
            ]
        );
        $this->DB->insert(
            "user_project_rel",
            [
                'UserID'    => $user_id,
                'ProjectID' => '1',
            ]
        );
        $this->DB->insert(
            "candidate",
            [
                'CandID'                => '999888',
                'RegistrationCenterID'  => '55',
                'UserID'                => '1',
                'PSCID'                 => '8888',
                'RegistrationProjectID' => '7777',
                'Entity_type'           => 'Human',
                'Active'                => 'Y',
            ]
        );
        $this->DB->insert(
            "session",
            [
                'ID'          => '222222',
                'CandID'      => '999888',
                'CenterID'    => '55',
                'ProjectID'   => '7777',
                'UserID'      => '1',
                'MRIQCStatus' => '',
                'CohortID'    => '55',
                'Active'      => 'Y',
            ]
        );
        $this->DB->insert(
            "mri_protocol_group",
            [
                'MriProtocolGroupID' => 11,
                'Name'               => 'test',
            ]
        );

        //Insert an incomplete form data
        $this->DB->insert(
            "test_names",
            [
                'ID'        => '111',
                'Test_name' => 'TestName11111111111',
                'Sub_group' => 1,
            ]
        );
        $this->DB->insert(
            "flag",
            [
                'ID'         => '111111',
                'SessionID'  => '222222',
                'TestID'     => '111',
                'CommentID'  => 'commentID111',
                'Data_entry' => 'In Progress',
            ]
        );
        //Insert a demo data into conflicts_unresolved
        $this->DB->insert(
            "conflicts_unresolved",
            [
                'TestName'       => 'TestTestTest',
                'ExtraKeyColumn' => 'Test',
                'ExtraKey1'      => 'Null',
                'ExtraKey2'      => 'Null',
                'FieldName'      => 'TestTestTest',
                'CommentId1'     => '963443000111271151398976899',
                'Value1'         => 'no',
                'CommentId2'     => 'DDE_963443000111271151398976899',
                'Value2'         => 'no',
            ]
        );
        $this->DB->insert(
            "files",
            [
                'FileID'       => '1111112',
                'SessionID'    => '222222',
                'SourceFileID' => '1111112',
            ]
        );

        $this->DB->insert(
            "files_qcstatus",
            [
                'FileID'   => '1111112',
                'FileQCID' => '2222221',
            ]
        );
        $this->DB->insert(
            "conflicts_resolved",
            [
                'ResolvedID'          => '999999',
                'UserID'              => 'demo',
                'ResolutionTimestamp' => '2015-11-03 16:21:49',
                'User1'               => 'Null',
                'User2'               => 'Null',
                'TestName'            => 'Test',
                'ExtraKey1'           => 'NULL',
                'ExtraKey2'           => 'NULL',
                'FieldName'           => 'TestTestTest',
                'CommentId1'          => '589569DCC000012291366553230',
                'CommentId2'          => 'DDE_589569DCC000012291366653254',
                'OldValue1'           => 'Mother',
                'OldValue2'           => 'Father',
                'NewValue'            => 'NULL',
            ]
        );
        $this->DB->insert(
            "conflicts_unresolved",
            [
                'TestName'       => 'TestTestTest',
                'ExtraKeyColumn' => 'Test',
                'ExtraKey1'      => 'Null',
                'ExtraKey2'      => 'Null',
                'FieldName'      => 'TestTestTest',
                'CommentId1'     => 'commentID111',
                'Value1'         => 'no',
                'CommentId2'     => 'DDE_963443000111271151398976899',
                'Value2'         => 'no',
            ]
        );
        $this->DB->insert(
            "issues",
            [
                'issueID'  => '999999',
                'assignee' => 'UnitTester',
                'status'   => 'new',
                'priority' => 'low',
                'reporter' => 'UnitTester',
            ]
        );
        $this->DB->insert(
            "users",
            [
                'ID'     => '9999991',
                'UserID' => 'Tester1',
            ]
        );
        $this->DB->insert(
            "document_repository",
            [
                'record_id'  => '9999997',
                'visitLabel' => null,
                'Date_taken' => '2016-07-27 18:00:10',
                'File_name'  => 'test.jpg',
            ]
        );
    }
    /**
     * Delete the test data
     *
     * @return void
     */
    public function tearDown(): void
    {
        $this->DB->run('SET foreign_key_checks =0');
        $this->DB->delete(
            "document_repository",
            ['record_id' => '9999997']
        );
        $this->DB->delete(
            "users",
            ['ID' => '9999991']
        );
        $this->DB->delete(
            "issues",
            ['issueID' => '999999']
        );
        $this->DB->delete(
            "conflicts_resolved",
            ['ResolvedID' => '999999']
        );
        $this->DB->delete(
            "conflicts_unresolved",
            ['TestName' => 'TestTestTest']
        );
        $this->DB->delete(
            "files_qcstatus",
            ['FileID' => '1111112']
        );
        $this->DB->delete(
            "files",
            ['FileID' => '1111112']
        );

        $this->DB->delete(
            "users",
            ['UserID' => 'testUser1']
        );
        $this->DB->delete(
            "session",
            ['ID' => '222222']
        );
        $this->DB->delete(
            "candidate",
            [
                'CandID'               => '999888',
                'RegistrationCenterID' => '55',
            ]
        );
        $this->DB->delete(
            "mri_protocol_group",
            ['Name' => 'test']
        );
        $this->DB->delete(
            "psc",
            [
                'CenterID' => '55',
                'Name'     => 'TESTinPSC',
            ]
        );
        $this->DB->delete(
            "cohort",
            ['CohortID' => '55']
        );
        $this->DB->delete(
            "Project",
            [
                'ProjectID' => '7777',
                'Name'      => 'TESTinProject',
            ]
        );
        $this->DB->delete(
            "flag",
            ['CommentID' => 'commentID111']
        );
        $this->DB->delete(
            "test_names",
            ['ID' => '111']
        );
        $this->DB->delete(
            "conflicts_unresolved",
            ['TestName' => 'TestTestTest']
        );
        $this->DB->update(
            "Config",
            ["Value" => null],
            ["ConfigID" => 48]
        );
        $user_id = $this->DB->pselectOne(
            "SELECT ID FROM users WHERE UserID=:test_user_id",
            ["test_user_id" => 'testUser1']
        );
        $this->DB->delete(
            "user_project_rel",
            [
                'UserID'    => $user_id,
                'ProjectID' => '1',
            ]
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
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector(".welcome")
        )->getText();
        $this->assertStringContainsString("Welcome", $bodyText);
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
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
        $views = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#statistics_widgets .panel:nth-child(1) .views button"
            )
        );
        $views->click();

        $assertText1 = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#statistics_widgets .panel:nth-child(1)".
                " .dropdown-menu li:nth-child(1)"
            )
        )->getText();

        $assertText2 = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#statistics_widgets .panel:nth-child(1)".
                " .dropdown-menu li:nth-child(2)"
            )
        )->getText();

        $this->assertStringContainsString("Recruitment - overall", $assertText1);
        $this->assertStringContainsString(
            "Recruitment - site breakdown",
            $assertText2
        );
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
            [
                "imaging_browser_qc",
                "imaging_browser_view_allsites",
            ]
        );
        $this->safeGet($this->url . '/dashboard/');
        $this->_testMytaskPanelAndLink(
            ".new-scans",
            "4",
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
            [
                "conflict_resolver",
                "access_all_profiles",
                "data_dict_edit",
                "data_dict_view"
            ]
        );
        $this->safeGet($this->url . '/dashboard/');
        $this->_testMytaskPanelAndLink(
            ".conflict_resolver",
            "570",
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
            ["issue_tracker_developer"]
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
            [
                "data_entry",
                "access_all_profiles",
            ]
        );
        $this->safeGet($this->url . '/dashboard/');
        $bodyText = $this->webDriver->getPageSource();
        $this->assertStringContainsString("Incomplete forms", $bodyText);
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
            [
                "user_accounts_multisite",
                "user_accounts",
            ]
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
            [
                "document_repository_delete",
                "document_repository_view",
            ]
        );
        $this->safeGet($this->url . '/dashboard/');
        $bodyText = $this->webDriver->getPageSource();
        $this->assertStringContainsString("test.jpg", $bodyText);
        $this->resetPermissions();
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
        $this->login("UnitTester", $this->validPassword);
        $welcomeText = $this->safeFindElement(
            WebDriverBy::cssSelector(".welcome")
        )->getText();
        $this->assertStringContainsString("Unit Tester", $welcomeText);
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
        $this->setupConfigSetting('recruitmentTarget', '');
        $this->safeGet($this->url . '/dashboard/');
        $testText = $this->safeFindElement(
            WebDriverBy::Id("overall-recruitment")
        )->getText();
        $this->assertStringContainsString(
            "Please add a recruitment target for Overall Recruitment.",
            $testText
        );
        $this->restoreConfigSetting("recruitmentTarget");
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
        $this->safeFindElement(
            WebDriverBy::Xpath(
                "//*[@id='lorisworkspace']/div[1]/ul/li[5]/a"
            )
        )->click();

        $this->safeFindElement(
            WebDriverBy::Xpath(
                "//*[@id='49']/input"
            )
        )->clear();
        $this->safeFindElement(
            WebDriverBy::Xpath(
                "//*[@id='49']/input"
            )
        )->sendKeys('888');
        $this->safeFindElement(
            WebDriverBy::Xpath(
                "//*[@id='dashboard']/div/form/div[3]/div/button[1]"
            )
        )->click();
        $this->safeGet($this->url . '/dashboard/');
        $testText = $this->safeFindElement(
            WebDriverBy::Id("overall-recruitment")
        )->getText();
        $this->assertStringContainsString(
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
        $testText = $this->safeFindElement(
            WebDriverBy::Xpath(
                "//*[@id='lorisworkspace']/div/div[1]/div[2]"
            )
        )->getText();
        $this->assertStringNotContainsString(
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
        $testText = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#statistics_studyprogression .panel-body div:nth-child(1)"
            )
        )->getText();

        $this->assertStringContainsString(
            "Scan sessions per site",
            $testText
        );

        $this->assertStringNotContainsString(
            "There have been no candidates registered yet.",
            $testText
        );
    }

}

