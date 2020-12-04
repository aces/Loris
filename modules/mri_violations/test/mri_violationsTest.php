<?php
/**
 * Mri_violations automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverSelect;
require_once __DIR__ .
           "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Mri_violations automated integration tests
 *
 * PHP Version 5
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
    public function setUp() : void
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
            "subproject",
            [
                'SubprojectID' => '55',
                'title'        => 'TESTinSubproject',
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
            ]
        );
        $this->DB->insert(
            "candidate",
            [
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
                'ID'           => '9888',
                'CandID'       => '999888',
                'CenterID'     => '55',
                'ProjectID'    => '7777',
                'UserID'       => '1',
                'MRIQCStatus'  => 'Pass',
                'SubprojectID' => '55',
                'Visit_label'  => 'Test1',
            ]
        );
        $this->DB->insert(
            "session",
            [
                'ID'           => '9777',
                'CandID'       => '999777',
                'CenterID'     => '55',
                'ProjectID'    => '7777',
                'UserID'       => '2',
                'MRIQCStatus'  => 'Pass',
                'SubprojectID' => '55',
                'Visit_label'  => 'Test2',
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
                'CandID'             => '999888',
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
                'CandID'             => '999777',
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
            ]
        );
    }
    /**
     * Delete the test data
     *
     * @return void
     */
    public function tearDown() : void
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
                'CandID'   => '999888',
                'CenterID' => '55',
            ]
        );
        $this->DB->delete(
            "session",
            [
                'CandID'   => '999777',
                'CenterID' => '55',
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
            "subproject",
            ['SubprojectID' => '55']
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
     * Tests that, when loading the Mri_violations module >
     * mri_protocol_violations submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriProtocolViolationsDoesPageLoad()
    {
        $this->safeGet(
            $this->url .
            "/mri_violations/mri_protocol_violations/"
        );
        sleep(1);
        $value = "#bc2 > a:nth-child(3)";
        $text  = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
            $this->assertEquals("Mri Protocol Violations", $text);
    }

    /**
     * Tests that, when loading the Mri_violations module >
     * mri_protocol_check_violations submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriProtocolCheckViolationsDoesPageLoad()
    {
        $this->safeGet(
            $this->url .
            "/mri_violations/mri_protocol_check_violations/"
        );
        sleep(1);
        $value = "#bc2 > a:nth-child(3) > div";
        $text  = $this->webDriver->executescript(
            "return document.querySelector('$value').textContent"
        );
            $this->assertEquals("Mri Protocol Check Violations", $text);
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
     * Tests landing the sub page which named resolved violations
     *
     * @return void
     */
    function testResolvedsubmenu()
    {
        $this->safeGet(
            $this->url .
            "/mri_violations/resolved_violations/"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("#tabs > ul > li.statsTab.active > a")
        )->getText();
        $this->assertStringContainsString("Resolved", $bodyText);
    }
    /**
     * Tests clear button in the filter section, input some data,
     * then click the clear button,
     * all of data in the filter section will be gone.
     *
     * @return void
     */
    function testResolvedClearButton()
    {
        //testing the Patient Name
        $this->safeGet(
            $this->url .
            "/mri_violations/resolved_violations/"
        );
        $this->webDriver->findElement(
            WebDriverBy::Name("PatientName")
        )->sendKeys("test");
        $this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::Name("PatientName")
        )->getText();
        $this->assertEquals("", $bodyText);

        //testing the Description
        $this->webDriver->findElement(
            WebDriverBy::Name("Description")
        )->sendKeys("test");
        $this->webDriver->findElement(
            WebDriverBy::Name("reset")
        )->click();
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::Name("Description")
        )->getText();
        $this->assertEquals("", $bodyText);

        //testing the MincFile
        $this->webDriver->findElement(
            WebDriverBy::Name("Filename")
        )->sendKeys("test");
        $this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::Name("Filename")
        )->getText();
        $this->assertEquals("", $bodyText);

        //testing the Site
        $siteElement =  $this->safeFindElement(WebDriverBy::Name("Site"));
        $site        = new WebDriverSelect($siteElement);
        $site->selectByVisibleText("TESTinPSC");
        $this->safeClick(WebDriverBy::Name("reset"));
        $siteElement =  $this->safeFindElement(WebDriverBy::Name("Site"));
        $site        = new WebDriverSelect($siteElement);
        $value       = $site->getFirstSelectedOption()->getAttribute('value');
        $this->assertEquals("", $value);

        //testing the Series UID
        $this->webDriver->findElement(
            WebDriverBy::Name("SeriesUID")
        )->sendKeys("test");
        $this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::Name("SeriesUID")
        )->getText();
        $this->assertEquals("", $bodyText);

    }
    /**
     * Tests that, input some data and click search button, check the results.
     *
     * @return void
     */
    function testNotResolvedSearchButton()
    {
        $this->safeGet($this->url . "/mri_violations/");
        //testing search by PatientName
        $this->_searchTest(
            "PatientName",
            "[name]test"
        );
        //testing search by Filename
        $this->_searchTest(
            "Filename",
            "assembly/test2/test2/mri/test2/test2.mnc"
        );
        //testing search by Description
        $this->_searchTest(
            "Description",
            "Test Series Description"
        );
        //testing search by SeriesUID
        $this->_searchTest(
            "SeriesUID",
            "5556"
        );
        //testing search by site
        $this->_searchTest(
            "Site",
            "TESTinPSC"
        );
    }
    /**
     * Tests that,in the not resolved menu,
     * change the Resolution status of the first row.
     * Save it and check it.
     *
     * @return void
     */
    function testNotResolvedSaveButton()
    {
        $this->safeGet($this->url . "/mri_violations/");
        $this->webDriver->findElement(
            WebDriverBy::Name("PatientName")
        )->sendKeys("[name]test");
        $this->webDriver->findElement(
            WebDriverBy::Name("filter")
        )->click();
        sleep(1);
        $resolutionStatus = "#dynamictable > tbody > tr > td:nth-child(10) > select";
        $savebtn          = "#mri_violations > div.pull-right > input:nth-child(1)";
        $this->webDriver->executescript(
            "document.querySelector('$resolutionStatus').value='other'"
        );
        $this->webDriver->executescript(
            "document.querySelector('$savebtn').click()"
        );
        $this->safeGet($this->url . "/mri_violations/resolved_violations/");
        sleep(1);
        $body = $this->webDriver->getPageSource();
        $this->assertStringContainsString("[name]test", $body);
    }
    /**
     * Tests that, input some data and click search button, check the results.
     *
     * @return void
     */
    function testResolvedSearchButton()
    {
        //testing search by PatientName
        $this->safeGet($this->url . "/mri_violations/resolved_violations/");

        //testing search by PatientName
        $this->_searchTest(
            "PatientName",
            "[Test]PatientName"
        );
        //testing search by Filename
        $this->_searchTest(
            "Filename",
            "assembly/test/test/mri/test/test.mnc"
        );
        //testing search by Description
        $this->_searchTest(
            "Description",
            "Test Description"
        );
        //testing search by SeriesUID
        // $this->_searchTest(
        //     "SeriesUID",
        //     "5555"
        // );
        //testing search by site
        $this->_searchTest(
            "Site",
            "TESTinPSC"
        );
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
        // Raisin bread has 173 unresolved violated scans. We are adding three
        // in setup(): one resolved, and two unresolved. The total
        // number of unresolved violations is thus 175
        $this->_testMytaskPanelAndLink(
            ".mri_violations",
            "175",
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
        $this->webDriver->findElement(
            WebDriverBy::Name($searchBy)
        )->sendKeys($testValue);
        $this->webDriver->findElement(
            WebDriverBy::Name("filter")
        )->click();
        sleep(1);
        $bodyText = $this->webDriver->executescript(
            "return document.querySelector(
                    '#datatable > div > div.table-header.panel-heading > div')
                 .textContent"
        );
        $this->assertStringContainsString("1 rows displayed of 1", $bodyText);
        $this->webDriver->findElement(
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

