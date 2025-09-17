<?php declare(strict_types=1);

/**
 * Mri_violations automated integration tests
 *
 * PHP Version 8
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__ .
           "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Mri_violations automated integration tests
 *
 * PHP Version 8
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class MriViolationsTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * UI elements and locations
     * breadcrumb - 'MRI Violated Scans'
     */
    private $_loadingUI = [
        'MRI Violated Scans' => '#bc2 > a:nth-child(2) > div'
    ];

    /**
     * Insert testing data
     *
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
        $this->DB->insert(
            "Project",
            [
                'ProjectID' => '7777',
                'Name'      => 'TESTinProject',
            ]
        );
        $this->DB->insert(
            "psc",
            [
                'CenterID'  => '55',
                'Name'      => 'TESTinPSC',
                'Alias'     => 'ttt',
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
            "candidate",
            [
                'ID'                    => 1,
                'CandID'                => '999888',
                'RegistrationCenterID'  => '55',
                'UserID'                => '1',
                'PSCID'                 => '8888',
                'RegistrationProjectID' => '7777',
            ]
        );
        $this->DB->insert(
            "candidate",
            [
                'ID'                    => 2,
                'CandID'                => '999777',
                'RegistrationCenterID'  => '55',
                'UserID'                => '2',
                'PSCID'                 => '6666',
                'RegistrationProjectID' => '7777',
            ]
        );
        $this->DB->insert(
            "session",
            [
                'ID'          => '9888',
                'CandidateID' => 1,
                'CenterID'    => '55',
                'ProjectID'   => '7777',
                'UserID'      => '1',
                'MRIQCStatus' => 'Pass',
                'CohortID'    => '55',
                'Visit_label' => 'Test1',
            ]
        );
        $this->DB->insert(
            "session",
            [
                'ID'          => '9777',
                'CandidateID' => 2,
                'CenterID'    => '55',
                'ProjectID'   => '7777',
                'UserID'      => '2',
                'MRIQCStatus' => 'Pass',
                'CohortID'    => '55',
                'Visit_label' => 'Test2',
            ]
        );

        // create the tarchive entries
        $this->DB->insert(
            'tarchive',
            [
                'TarchiveID'             => '263',
                'DicomArchiveID'         => '1.3.12.2.1107.5.2.32.35442.30000012' .
              '100912542610900000004',
                'PatientID'              => '8888_999888_Test1',
                'PatientName'            => '8888_999888_Test1',
                'CenterName'             => 'Test',
                'AcquisitionCount'       => '10',
                'NonDicomFileCount'      => '3',
                'DicomFileCount'         => '1000',
                'CreatingUser'           => 'lorisdev',
                'sumTypeVersion'         => '1',
                'SourceLocation'         => '/data/incoming/8888_999888_Test1',
                'ScannerManufacturer'    => 'Siemens',
                'ScannerModel'           => 'TrioTim',
                'ScannerSerialNumber'    => '33333',
                'ScannerSoftwareVersion' => 'syngo MR B17',
                'uploadAttempt'          => '1',
                'AcquisitionMetadata'    => 'metadata',
                'SessionID'              => '9888',
                'PendingTransfer'        => '1',
            ]
        );
        $this->DB->insert(
            'tarchive',
            [
                'TarchiveID'             => '264',
                'DicomArchiveID'         => '1.3.12.2.1107.5.2.32.35442.30000012' .
               '100912542610900000004',
                'PatientID'              => '8888_999888_Test2',
                'PatientName'            => '8888_999888_Test2',
                'CenterName'             => 'Test',
                'AcquisitionCount'       => '10',
                'NonDicomFileCount'      => '3',
                'DicomFileCount'         => '1000',
                'CreatingUser'           => 'lorisdev',
                'sumTypeVersion'         => '1',
                'SourceLocation'         => '/data/incoming/8888_999888_Test2',
                'ScannerManufacturer'    => 'Siemens',
                'ScannerModel'           => 'TrioTim',
                'ScannerSerialNumber'    => '33333',
                'ScannerSoftwareVersion' => 'syngo MR B17',
                'uploadAttempt'          => '1',
                'AcquisitionMetadata'    => 'metadata',
                'SessionID'              => '9777',
                'PendingTransfer'        => '1',
            ]
        );

        $this->DB->insert(
            "mri_protocol_group",
            [
                'MriProtocolGroupID' => 11,
                'Name'               => 'test',
            ]
        );

        $this->DB->insert(
            "mri_protocol_violated_scans",
            [
                'ID'                 => '1001',
                'CandidateID'        => 1,
                'PatientName'        => '[Test]PatientName_Test1',
                'time_run'           => '2009-06-29 04:00:44',
                'minc_location'      => 'assembly/test/test/mri/test/test.mnc',
                'series_description' => 'Test Description',
                'SeriesUID'          => '5555',
                'TarchiveID'         => '263',
                'MriProtocolGroupID' => 11,
            ]
        );
        $this->DB->insert(
            "mri_protocol_violated_scans",
            [
                'ID'                 => '1002',
                'CandidateID'        => 2,
                'PatientName'        => '[name]test_Test2',
                'time_run'           => '2008-06-29 04:00:44',
                'minc_location'      => 'assembly/test2/test2/mri/test2/test2.mnc',
                'series_description' => 'Test Series Description',
                'SeriesUID'          => '5556',
                'TarchiveID'         => '264',
                'MriProtocolGroupID' => 11,
            ]
        );
        $this->DB->insert(
            "violations_resolved",
            [
                'ExtID'     => '1001',
                'hash'      => '123456',
                'TypeTable' => 'mri_protocol_violated_scans',
                'Resolved'  => 'other',
            ]
        );
        $this->DB->insert(
            "MRICandidateErrors",
            [
                'ID'          => '1002',
                'PatientName' => '[Test]PatientName',
                'MincFile'    => 'assembly/test2/test2/mri/test2/test3.mnc',
                'SeriesUID'   => '5558',
                'Reason'      => 'Test Case'
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
        $this->DB->delete(
            "MRICandidateErrors",
            ['ID' => '1002']
        );
        $this->DB->delete(
            "mri_protocol_violated_scans",
            ['ID' => '1001']
        );
        $this->DB->delete(
            "mri_protocol_violated_scans",
            ['ID' => '1002']
        );
        $this->DB->delete(
            "tarchive",
            ['TarchiveID' => '263']
        );
        $this->DB->delete(
            "tarchive",
            ['TarchiveID' => '264']
        );
        $this->DB->delete(
            "session",
            [
                'CandidateID' => 1,
                'CenterID'    => '55',
            ]
        );
        $this->DB->delete(
            "session",
            [
                'CandidateID' => 2,
                'CenterID'    => '55',
            ]
        );
        $this->DB->delete(
            "candidate",
            [
                'CandID'               => '999888',
                'RegistrationCenterID' => '55',
            ]
        );
        $this->DB->delete(
            "candidate",
            [
                'CandID'               => '999777',
                'RegistrationCenterID' => '55',
            ]
        );
        $this->DB->delete(
            "violations_resolved",
            [
                'ExtID'     => '1001',
                'TypeTable' => 'mri_protocol_violated_scans',
            ]
        );
        $this->DB->delete(
            "violations_resolved",
            ['ExtID' => '1002']
        );
        $this->DB->delete(
            "cohort",
            ['CohortID' => '55']
        );
        $this->DB->delete(
            "psc",
            [
                'CenterID' => '55',
                'Name'     => 'TESTinPSC',
            ]
        );
        $this->DB->delete(
            "Project",
            [
                'ProjectID' => '7777',
                'Name'      => 'TESTinProject',
            ]
        );
        $this->DB->delete(
            "mri_protocol_group",
            ['Name' => 'test']
        );
        parent::tearDown();
    }

    /**
     * Tests loading the module with the permission
     * 'violated_scans_view_allsites'
     *
     * @return void
     */
    function testModuleLoadsWithAllSitesPermission()
    {
        $this->setupPermissions(["violated_scans_view_allsites"]);
        $this->safeGet($this->url . "/mri_violations/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }

    /**
     * Tests loading the module with the permission
     * 'violated_scans_view_ownsite'
     *
     * @return void
     */
    function testModuleLoadsWithOwnSitePermission()
    {
        $this->setupPermissions(["violated_scans_view_ownsite"]);
        $this->safeGet($this->url . "/mri_violations/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
    }

    /**
     * Ensure that the module does not load when the user lacks MRI_Violations
     * permissions.
     *
     * @return void
     */
    function testModuleDoesNotLoadWithoutPermission()
    {
         $this->setupPermissions([""]);
         $this->safeGet($this->url . "/mri_violations/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
         $this->resetPermissions();
    }

    /**
     * Verify that for a user with 'violated_scans_view_allsites' permission the
     * number of MRI violated scans is reported in the My Task panel.
     * Also ensure that when you click on this task, the link takes you to the
     * MRI violated scans page.
     *
     * @return void
     */
    public function testDashboardWidgetAllSites()
    {
        $this->setupPermissions(
            [
                'violated_scans_view_allsites'
            ]
        );
        $this->safeGet($this->url . '/dashboard/');
        // Raisin bread has 169 unique unresolved violated scans. We are adding
        // three in setup(): one resolved, and two unresolved. The total
        // number of unresolved violations is thus 172
        $this->_testMytaskPanelAndLink(
            ".mri_violations",
            "172",
            "- MRI Violated Scans"
        );
        $this->resetPermissions();
    }

    /**
     * Verify that for a user with 'violated_scans_view_ownsite' permission the
     * number of MRI violated scans is reported in the My Task panel.
     * Also ensure that when you click on this task, the link takes you to the
     * MRI violated scans page.
     *
     * @return void
     */
    public function testDashboardWidgetOwnSite()
    {

        $this->setupPermissions(
            [
                'violated_scans_view_ownsite'
            ]
        );
        $this->safeGet($this->url . '/dashboard/');
        // Raisin bread has 164 unresolved violated scans that are not assigned
        // to any site and 3 unresolved violations assigned to DCC. We are
        // adding three in setup(): one resolved, another unresolved assigned to
        // center ID 55 and another not assigned to any site. The total number of
        // unresolved violations that are either assigned to DCC or not assigned to
        // any site is thus: 164+3+1 = 168.
        // Note that the test user is only assigned to sites DCC
        $this->_testMytaskPanelAndLink(
            ".mri_violations",
            "168",
            "- MRI Violated Scans"
        );
        $this->resetPermissions();
    }

    /**
     * Tests search button and search form.
     *
     * @param string $searchBy  the value of searchBy
     * @param string $testValue the value of testValue
     *
     * @return void
     */
    function _searchTest($searchBy,$testValue)
    {
        //$this->safeGet($this->url . "/mri_violations/");
        $this->safeFindElement(
            WebDriverBy::Name($searchBy)
        )->sendKeys($testValue);
        $this->safeFindElement(
            WebDriverBy::Name("filter")
        )->click();

        $body     = $this->safeFindElement(
            WebDriverby::CSSSelector(
                '#datatable > div > div.table-header.panel-heading > div'
            )
        );
        $bodyText = $body->getText();

        $this->assertStringContainsString("1 rows displayed of 1", $bodyText);
        $this->safeFindElement(
            WebDriverBy::Name("reset")
        )->click();
    }

    /**
     * Testing UI when page loads
     *
     * @return void
     */
    function testPageUIs()
    {
        $this->safeGet($this->url . "/mri_violations/");
        foreach ($this->_loadingUI as $key => $value) {
            $text = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
            $this->assertStringContainsString($key, $text);
        }
    }
}

