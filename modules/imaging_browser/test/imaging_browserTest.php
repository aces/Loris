<?php
/**
 * Imaging Browser automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Imaging Browser automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ImagingBrowserTestIntegrationTest extends LorisIntegrationTest
{

    //Filter locations
    static $site          = 'select[name="site"]';
    static $pscid         = 'input[name="PSCID"]';
    static $dccid         = 'input[name="DCCID"]';
    static $project       = 'select[name="project"]';
    static $visitLabel    = 'input[name="visitLabel"]';
    static $visitQCStatus = 'select[name="visitQCStatus"]';
    static $sequenceType  = 'select[name="sequenceType"]';
    static $pendingNew    = 'select[name="pendingNew"]';

    //General locations
    static $display      = '.table-header > div > div > div:nth-child(1)';
    static $clearFilter  = '.nav-tabs a';
    static $nativeLink   = '#dynamictable tbody tr:nth-child(1) td:nth-child(12) '
                           .'a:nth-child(1)';
    static $selectedLink = '#dynamictable tbody tr:nth-child(1) td:nth-child(12) '
                           .'a:nth-child(2)';


    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in, and creating a candidate
     * with a session
     *
     * @return void
     */
    public function setUp(): void
    {

        parent::setUp();

        // Create tests-specific data
        $this->DB->insert(
            "psc",
            [
                'CenterID'  => '253',
                'Name'      => 'Test Site AOL',
                'Alias'     => 'AOL',
                'MRI_alias' => 'Y',
            ]
        );

        $this->DB->insert(
            "psc",
            [
                'CenterID'  => '254',
                'Name'      => 'Test Site BOL',
                'Alias'     => 'BOL',
                'MRI_alias' => 'Y',
            ]
        );

        // Create test-specific data
        $this->DB->insert(
            "candidate",
            [
                'CandID'                => '000001',
                'PSCID'                 => 'DCC0001',
                'RegistrationCenterID'  => 1,
                'RegistrationProjectID' => 1,
                'Active'                => 'Y',
                'Entity_type'           => 'Human',
            ]
        );

        $this->DB->insert(
            "candidate",
            [
                'CandID'                => '000002',
                'PSCID'                 => 'AOL0002',
                'RegistrationCenterID'  => 253,
                'RegistrationProjectID' => 1,
                'Active'                => 'Y',
                'Entity_type'           => 'Human',
            ]
        );

        $this->DB->insert(
            "candidate",
            [
                'CandID'                => 000003,
                'PSCID'                 => 'BOL0003',
                'RegistrationCenterID'  => 254,
                'RegistrationProjectID' => 1,
                'Active'                => 'Y',
                'Entity_type'           => 'Human',
            ]
        );

        $this->DB->insert(
            'session',
            [
                'ID'            => 999997,
                'CandID'        => 000001,
                'Visit_label'   => 'Test0',
                'CenterID'      => 1,
                'ProjectID'     => 1,
                'Scan_done'     => 'Y',
                'Current_stage' => 'Visit',
                'Visit'         => 'In Progress',
            ]
        );

        $this->DB->insert(
            'session',
            [
                'ID'            => 999998,
                'CandID'        => 000002,
                'Visit_label'   => 'Test1',
                'CenterID'      => 253,
                'ProjectID'     => 1,
                'Scan_done'     => 'Y',
                'Current_stage' => 'Visit',
                'Visit'         => 'In Progress',
            ]
        );

        $this->DB->insert(
            'session',
            [
                'ID'            => 999999,
                'CandID'        => 000003,
                'Visit_label'   => 'Test2',
                'CenterID'      => 254,
                'ProjectID'     => 1,
                'Scan_done'     => 'Y',
                'Current_stage' => 'Visit',
                'Visit'         => 'In Progress',
            ]
        );

        // Add imaging data

        $this->DB->insert(
            'mri_processing_protocol',
            [
                'ProcessProtocolID' => 1111,
                'ProtocolFile'      => 'None1',
                'FileType'          => null,
                'Tool'              => 'None1',
                'InsertTime'        => 0,
                'md5sum'            => null,
            ]
        );

        $this->DB->insert(
            'mri_processing_protocol',
            [
                'ProcessProtocolID' => 2222,
                'ProtocolFile'      => 'None2',
                'FileType'          => null,
                'Tool'              => 'None2',
                'InsertTime'        => 0,
                'md5sum'            => null,
            ]
        );

        // create the tarchive entries
        $this->DB->insert(
            'tarchive',
            [
                'TarchiveID'             => 263,
                'DicomArchiveID'         => '1.3.12.2.1107.5.2.32.35442.30000012' .
                    '100912542610900000004',
                'PatientID'              => 'AOL0002_000002_Test1',
                'PatientName'            => 'AOL0002_000002_Test1',
                'CenterName'             => 'Test site AOL',
                'AcquisitionCount'       => 10,
                'NonDicomFileCount'      => 3,
                'DicomFileCount'         => 1000,
                'CreatingUser'           => 'lorisdev',
                'sumTypeVersion'         => 1,
                'SourceLocation'         => '/data/incoming/AOL0002_000002_Test1',
                'ScannerManufacturer'    => 'Siemens',
                'ScannerModel'           => 'TrioTim',
                'ScannerSerialNumber'    => '33333',
                'ScannerSoftwareVersion' => 'syngo MR B17',
                'uploadAttempt'          => 1,
                'AcquisitionMetadata'    => 'metadata',
                'SessionID'              => 999998,
                'PendingTransfer'        => 1,
            ]
        );

        $this->DB->insert(
            'tarchive',
            [
                'TarchiveID'             => 264,
                'DicomArchiveID'         => '1.3.12.2.1107.5.2.32.35442.30000012' .
                    '100912542610900000001',
                'PatientID'              => 'BOL0003_000003_Test2',
                'PatientName'            => 'BOL0003_000003_Test2',
                'CenterName'             => 'Test site BOL',
                'AcquisitionCount'       => 10,
                'NonDicomFileCount'      => 3,
                'DicomFileCount'         => 1000,
                'CreatingUser'           => 'lorisdev',
                'sumTypeVersion'         => 1,
                'SourceLocation'         => '/data/incoming/BOL0003_000003_Test2',
                'ScannerManufacturer'    => 'Siemens',
                'ScannerModel'           => 'TrioTim',
                'ScannerSerialNumber'    => '33336',
                'ScannerSoftwareVersion' => 'syngo MR B17',
                'uploadAttempt'          => 1,
                'AcquisitionMetadata'    => 'metadata',
                'SessionID'              => 999999,
                'PendingTransfer'        => 1,
            ]
        );

        // @codingStandardsIgnoreStart
        $this->DB->insert(
            'files',
            [
                'FileID'                => 1111,
                'SessionID'             => 999998,
                'File'                  => 'assembly/506145/V1/mri/native/' .
                    'loris-MRI_506145_V1_t2_001.mnc',
                'SeriesUID'             => '1.3.12.2.1107.5.2.32.35049.' .
                    '2014021711090977356751313.0.0.0',
                'EchoTime'              => 0.011,
                'CoordinateSpace'       => 'native',
                'OutputType'            => 'native',
                'AcquisitionProtocolID' => 45,
                'FileType'              => 'mnc',
                'InsertedByUserID'      => 'lorisadmin',
                'InsertTime'            => 1454951768,
                'SourcePipeline'        => null,
                'PipelineDate'          => null,
                'SourceFileID'          => 1111,
                'ProcessProtocolID'     => 1111,
                'Caveat'                => 0,
                'TarchiveSource'        => 263,
            ]
        );
        // @codingStandardsIgnoreEnd

        // @codingStandardsIgnoreStart
        $this->DB->insert(
            'files',
            [
                'FileID'                => 2222,
                'SessionID'             => 999999,
                'File'                  => 'assembly/506145/V1/mri/native/' .
                    'loris-MRI_506145_V1_t1_001.mnc',
                'SeriesUID'             => '1.3.12.2.1107.5.2.32.35049.' .
                    '2014021711090977356751313.0.0.0',
                'EchoTime'              => 0.011,
                'CoordinateSpace'       => 'native',
                'OutputType'            => 'native',
                'AcquisitionProtocolID' => 44,
                'FileType'              => 'mnc',
                'InsertedByUserID'      => 'lorisadmin',
                'InsertTime'            => 1454951768,
                'SourcePipeline'        => null,
                'PipelineDate'          => null,
                'SourceFileID'          => 2222,
                'ProcessProtocolID'     => 2222,
                'Caveat'                => 0,
                'TarchiveSource'        => 264,
            ]
        );
        // @codingStandardsIgnoreStart

        $this->DB->insert(
            'files_qcstatus',
            [
                'FileQCID'          => 1111,
                'FileID'            => 1111,
                'SeriesUID'         => '1.3.12.2.1107.5.2.32.35049.' .
                    '2014021711090977356751313.0.0.0',
                'EchoTime'          => 0.011,
                'QCStatus'          => null,
                'QCFirstChangeTime' => 1455040145,
                'QCLastChangeTime'  => 1455040145,
                'Selected'          => true
            ]
        );

        $this->DB->insert(
            'files_qcstatus',
            [
                'FileQCID'          => 2222,
                'FileID'            => 2222,
                'SeriesUID'         => '1.3.12.2.1107.5.2.32.35049.' .
                    '2014021711090977356751313.0.0.0',
                'EchoTime'          => 0.011,
                'QCStatus'          => null,
                'QCFirstChangeTime' => 1455040145,
                'QCLastChangeTime'  => 1455040145,
                'Selected'          => true
            ]
        );
    }

    /**
     * Tears down created dataset
     *
     * @return void
     */
    public function tearDown(): void
    {
        parent::tearDown();
        // tear down test-specific dataset
        $this->DB->run('SET foreign_key_checks =0');
        $this->DB->delete("files", ['FileID' => '1111']);
        $this->DB->delete("files", ['FileID' => '2222']);
        $this->DB->delete(
            "mri_processing_protocol",
            ['ProcessProtocolID' => '1111']
        );
        $this->DB->delete(
            "mri_processing_protocol",
            ['ProcessProtocolID' => '2222']
        );
        $this->DB->delete("files_qcstatus", ['FileID' => '1111']);
        $this->DB->delete("files_qcstatus", ['FileID' => '2222']);
        $this->DB->delete("tarchive", ['TarchiveID' => '263']);
        $this->DB->delete("tarchive", ['TarchiveID' => '264']);
        $this->DB->delete("session", ['ID' => '999997']);
        $this->DB->delete("session", ['ID' => '999998']);
        $this->DB->delete("session", ['ID' => '999999']);
        $this->DB->delete("candidate", ['CandID' => '000001']);
        $this->DB->delete("candidate", ['CandID' => '000002']);
        $this->DB->delete("candidate", ['CandID' => '000003']);
        $this->DB->delete("psc", ['CenterID' => '253']);
        $this->DB->delete("psc", ['CenterID' => '254']);
        $this->DB->run('SET foreign_key_checks =1');
    }

    /**
     * Tests that, when loading the imaging_browser module, some
     * text appears in the body.
     *
     * @return void
     */
    function testImagingBrowserDoespageLoad()
    {
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#breadcrumbs")
        )->getText();
        $this->assertStringContainsString("Imaging Browser", $bodyText);
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
    }

    /******** A ********/

    /**
     * Step 1
     * Tests that the imaging_browser module loads with "view_site"
     * and "view_allsites" permissions
     *
     * @return void
     */
    function testImagingBrowserDoespageLoadWithoutPermissions()
    {
        // Without permissions
        $this->setupPermissions(['']);
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $errorText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $errorText
        );

    }

    function testImagingBrowserDoespageLoadWithPermissionsSite()
    {
        // With permission imaging_browser_phantom_ownsite
        $this->setupPermissions(['imaging_browser_phantom_ownsite']);
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $breadcrumbText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Imaging Browser", $breadcrumbText);
    }

    function testImagingBrowserDoespageLoadWithPermissionsAllSites()
    {
        // With permission imaging_browser_view_allsites
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $breadcrumbText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Imaging Browser", $breadcrumbText);
    }
    function testImagingBrowserDoespageLoadWithPermissionsPhontomAllSites()
    {
        // With permission imaging_browser_phantom_allsites
        $this->setupPermissions(['imaging_browser_phantom_allsites']);
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $breadcrumbText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Imaging Browser", $breadcrumbText);
    }

    /**
     * Step 2
     * Tests that users can see only own site datasets if permission
     * is "view_onsite" and all data sets if "view_allsites" permissions
     *
     * @return void
    */
    function testImagingBrowserViewDatasetDependingOnPermissions()
    {
        // With permission imaging_browser_view_site: subjects from DCC site
        $this->setupPermissions(['imaging_browser_view_site']);
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $ControlPanelText = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$display)
        )->getText();
        $this->assertStringContainsString("rows displayed of 15.", $ControlPanelText);

        // With permission imaging_browser_view_allsites: all subjects
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $ControlPanelText = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$display)
        )->getText();
        $this->assertStringContainsString("rows displayed of 29.", $ControlPanelText);
    }

    /**
     * Step 3a & 4 combined
     * Tests that all filters and the clear
     * filter button work
     * and that Show Data and Clear Form work
     *
     * @return void
    */
    function testImagingBrowserFiltersAndShowClearButtons()
    {
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->safeGet($this->url . "/imaging_browser/");

        $this->_filterTest(
            self::$pscid,
            self::$display,
            self::$clearFilter,
            'test',
            '0 rows'
        );
        $this->_filterTest(
            self::$pscid,
            self::$display,
            self::$clearFilter,
            'AOL0002',
            '1 rows'
        );
        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clearFilter,
            'Data Coordinating Center',
            '15 rows'
        );
        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clearFilter,
            'Montreal',
            '5 rows'
        );
        $this->_filterTest(
            self::$dccid,
            self::$display,
            self::$clearFilter,
            'test',
            '0 rows'
        );
        $this->_filterTest(
            self::$dccid,
            self::$display,
            self::$clearFilter,
            '475906',
            '6 rows'
        );
        $this->_filterTest(
            self::$project,
            self::$display,
            self::$clearFilter,
            'DCP',
            '0 rows'
        );
        $this->_filterTest(
            self::$project,
            self::$display,
            self::$clearFilter,
            'Pumpernickel',
            'of 29'
        );
        $this->_filterTest(
            self::$visitLabel,
            self::$display,
            self::$clearFilter,
            'V1',
            '12 rows'
        );
        $this->_filterTest(
            self::$visitLabel,
            self::$display,
            self::$clearFilter,
            'V1000',
            '0 rows'
        );
        $this->_filterTest(
            self::$visitQCStatus,
            self::$display,
            self::$clearFilter,
            'Fail',
            '2 rows'
        );
        $this->_filterTest(
            self::$visitQCStatus,
            self::$display,
            self::$clearFilter,
            'Pass',
            '6 rows'
        );
        $this->_filterTest(
            self::$sequenceType,
            self::$display,
            self::$clearFilter,
            'dwi65',
            '12 rows'
        );
        $this->_filterTest(
            self::$sequenceType,
            self::$display,
            self::$clearFilter,
            'dwi25',
            'of 27'
        );
        $this->_filterTest(
            self::$pendingNew,
            self::$display,
            self::$clearFilter,
            'New',
            '7 rows'
        );
        $this->_filterTest(
            self::$pendingNew,
            self::$display,
            self::$clearFilter,
            'Pending',
            '0 rows'
        );
    }

    /**
     * Step 3b
     * Tests that the Site field is populate with own site if permission
     * is "view_onsite" and "All" if "view_allsites" permissions
     *
     * @return void
     */
    function testImagingBrowserSiteDependingOnPermissions()
    {
        // With permission imaging_browser_view_site
        $this->setupPermissions(['imaging_browser_phantom_ownsite']);
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $SiteFilterText = $this->safeFindElement(
            WebDriverBy::Name("site")
        )->getText();
        $this->assertEquals("Data Coordinating Center", $SiteFilterText);

        // With permission imaging_browser_view_allsites
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $SiteFilterText     = $this->safeFindElement(
            WebDriverBy::Name("site")
        )->getText();
        $sites = [
          'Data Coordinating Center',
          'Montreal',
          'Ottawa',
          'Rome',
          'Test Site AOL',
          'Test Site BOL',
        ];
        foreach($sites as $site) {
          $this->assertStringContainsString($site, $SiteFilterText);
        }
    }

    /**
     * Step 5
     * Tests that column headers are sortable: Will check PSCID only
     *
     * @return void
     */
    function testImagingBrowserSortableByTableHeader()
    {
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $this->safeClick(
            WebDriverBy::cssSelector(
                "#dynamictable .info > th:nth-child(3)"
            )
        );

        $FirstEntry = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#dynamictable tbody > tr:nth-child(1) td:nth-child(3)"
            )
        )->getText();
        $this->assertStringContainsString("AOL0002", $FirstEntry);

        // click again and make sure the order is now reversed
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#dynamictable .info > th:nth-child(3)"
            )
        );

        $FirstEntry = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#dynamictable tbody > tr:nth-child(1) td:nth-child(3)"
            )
        )->getText();
        $this->assertStringContainsString("ROM300", $FirstEntry);
    }

    /**
     * Step 6
     * Tests that links to native work
     *
     * @return void
    */
    function testViewSessionLinksNative()
    {
        $this->markTestSkipped(
            'Skipping tests until Travis and React get along better'
        );
        // Setting permissions to view all sites to view all datasets
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $NativeLink = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$nativeLink)
        );
        $this->clickToLoadNewPage($NativeLink);

        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("View Session", $bodyText);

        // Selected link tested in the next test
    }

    /******** B ********/

    /**
     * Steps 1 & 2
     * Tests that the links on the sidebar work
     * in 3 functions for the 3 headers: Navigation, Links, VolumeViewer
     *
     * @return void
     */
    function testViewSessionNavigation()
    {
        $this->markTestSkipped(
            'Links are broken, Redmine 9576'
        );

        // Setting permissions to view all sites to view all datasets
        $this->setupPermissions(['imaging_browser_view_allsites']);

        $this->webDriver->navigate()->refresh();

        // Go to first item in the imaging browser list of candidates
        // to view buttons: Back to List and Next, then we can check Prev

        //Back to List Button
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $this->safeClick(
            WebDriverBy::cssSelector(self::$selectedLink)
        );

        $this->safeClick(
            WebDriverBy::cssSelector('#sidebar-content > ul:nth-child(2) li:nth-child(1) a')
        );

        $SelectionFilter = $this->safeFindElement(
            WebDriverBy::cssSelector('#imaging_browser_filter legend')
        )->getText();
        $this->assertStringContainsString("Selection Filter", $SelectionFilter);

        //Next Button
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $this->safeClick(
            WebDriverBy::cssSelector(self::$nativeLink)
        );

        $this->safeClick(
            WebDriverBy::cssSelector('#sidebar-content > ul:nth-child(2) li:nth-child(2) a:nth-child(2)')
        );

        $SiteText2 = $this->safeFindElement(
            WebDriverBy::cssSelector('#table-header-left tbody td:nth-child(5)')
        )->getText();
        $this->assertStringContainsString("Test Site BOL", $SiteText2);

        //Previous Button
        $this->safeClick(
            WebDriverBy::cssSelector(
                '#sidebar-content > ul:nth-child(2) li:nth-child(2) a:nth-child(1)'
            )
        );

        $SiteText1 = $this->safeFindElement(
            WebDriverBy::cssSelector('#table-header-left tbody td:nth-child(5)')
        )->getText();
        $this->assertStringContainsString("Test Site AOL", $SiteText1);
    }

    /**
     * Tests the links under "Links"
     *
     * @return void
     */
    function testViewSessionLinks()
    {

        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $this->safeClick(
            WebDriverBy::cssSelector(self::$nativeLink)
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector('body')
        )->getText();
        $this->assertStringContainsString("administrator", $bodyText);

    }

    /**
     * Tests that Volume Viewer buttons work
     *
     * @return void
     */
    function testViewSessionVolumeViewer()
    {
        $this->markTestSkipped(
            'Currently awaiting redmine 9385'
        );
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $SelectedLink = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$selectedLink)
        );
        $this->clickToLoadNewPage($SelectedLink);

        $ImageCheckbox = $this->safeFindElement(
            WebDriverBy::xPath('//*[@id="image-1"]/div/div/div[1]/input')
        );
        $ImageCheckbox->click();

        $ThreeDOnly = $this->safeFindElement(
            WebDriverBy::xPath('//*[@id="bbonly"]')
        );
        $ThreeDOnly->click();

        $BreadCrumbText = $this->safeFindElement(
            WebDriverBy::xPath('//*[@id="page"]/div/div[1]/a/label')
        )->getText();
        $this->assertStringContainsString("Brainbrowser", $BreadCrumbText);
    }

    /**
     * Steps 3 through 7
     * Visit level feedback
     *
     * @return void
    */
    function testViewSessionVisitLevelFeedback()
    {
        $this->markTestSkipped(
            'Skipping tests until Travis and React get along better'
        );
        // Setting permissions to view all sites to view all datasets
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $NativeLink = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$nativeLink)
        );
        $this->clickToLoadNewPage($NativeLink);

        $VisitLevelFeedback = $this->safeFindElement(
            WebDriverBy::xPath('//*[@id="sidebar-content"]/div[1]/a/span/span[2]')
        );
        $handleList         = $this->webDriver->getWindowHandles();
        $VisitLevelFeedback->click();

        $newHandleList = $this->webDriver->getWindowHandles();
        $diff          = array_diff($newHandleList, $handleList);
        $this->assertCount(1, $diff);
        $this->webDriver->switchTo()->window($diff[1]);

        $NewWindowPopUpPSCID = $this->safeFindElement(
            WebDriverBy::xPath('/html/body/div/table/tbody/tr[2]/td')
        )->getText();
        $this->assertStringContainsString("AOL0002", $NewWindowPopUpPSCID);
        $this->webDriver->switchTo()->window($diff[1])->close();
        $this->webDriver->switchTo()->window($handleList[0]);

        // Check that the QC status -VISIT LEVEL- buttons
        // are viewable without _qc permission
        $QCStatusVisit = $this->safeFindElement(
            WebDriverBy::xPath('//*[@id="sidebar-content"]/div[2]/div/label')
        )->getText();
        $this->assertStringContainsString("QC Status", $QCStatusVisit);

        $QCPending = $this->safeFindElement(
            WebDriverBy::xPath('//*[@id="sidebar-content"]/div[2]/label')
        )->getText();
        $this->assertStringContainsString("QC Pending", $QCPending);

        // Check that the QC -VISIT LEVEL- options are viewable
        // with correct permission
        $this->setupPermissions(
            [
                'imaging_browser_view_allsites',
                'imaging_browser_qc',
            ]
        );
        $this->webDriver->navigate()->refresh();

        $QCStatusVisitPass = $this->safeFindElement(
            WebDriverBy::Name("visit_status")
        )->getText();
        $this->assertStringContainsString("Pass", $QCStatusVisitPass);

        $QCPendingNo = $this->safeFindElement(
            WebDriverBy::Name("visit_pending")
        )->getText();
        $this->assertStringContainsString("No", $QCPendingNo);

        // Test that we can edit the QC status -VISIT LEVEL-
        // with the correct permission
        // Change visit QC status from Blank to Pass
        // Simultaneously also testing that the Save button shows and works

        $this->safeFindElement(
            WebDriverBy::Name("visit_status")
        )->sendKeys("Fail");

        // Testing the button Save is viewable, clickable and works
        $QCSaveShow = $this->safeFindElement(
            WebDriverBy::xPath('//input[@accessKey="s"]')
        );
        $QCSaveShow->click();

        $QCStatusVisit = $this->safeFindElement(
            WebDriverBy::Name("visit_status")
        )->getText();
        $this->assertStringContainsString("Fail", $QCStatusVisit);
    }

    /**
     * Step 8
     * Tests Breadcrumb back to imaging browser
     *
     * @return void
    */
    function testViewSessionBreadCrumb()
    {
        $this->markTestSkipped(
            'Skipping tests until Travis and React get along better'
        );
        // Setting permissions to view all sites to view all datasets
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $NativeLink = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$nativeLink)
        );
        $this->clickToLoadNewPage($NativeLink);

        $BreadCrumbLink = $this->safeFindElement(
            WebDriverBy::xPath(
                "//div[@id='breadcrumbs']
                 /div
                 /div
                 /div
                 /a[2]
                 /div"
            )
        );
        $this->clickToLoadNewPage($BreadCrumbLink);

        $SelectionFilter = $this->safeFindElement(
            WebDriverBy::xPath('//*[@id="lorisworkspace"]/div[1]/div/div/div[1]')
        )->getText();
        $this->assertStringContainsString("Selection Filter", $SelectionFilter);
    }

    /******** C ********/

    /**
     * Step 1
     * Future feature
     *
     * @return void
    **/

    /**
     * Step 2
     * Scan-Level QC Flags viewable and editabled depending on permission
     *
     * @return void
    */
    function testScanLevelQCFlags()
    {
        $this->markTestSkipped(
            'React components can not be tested'
        );

        // Setting permissions to view all sites to view all datasets
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $SelectedLink = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$selectedLink)
        );
        $this->clickToLoadNewPage($SelectedLink);

        $ImagePanelText1 = $this->safeFindElement(
            WebDriverBy::cssSelector(
                ".col-xs-3 > div:nth-child(1) > " .
                "div:nth-child(1) > label:nth-child(1)"
            )
        )->getText();
        $this->assertStringContainsString("QC Status", $ImagePanelText1);

        $ImagePanelText2 = $this->safeFindElement(
            WebDriverBy::cssSelector(
                ".col-xs-3 > div:nth-child(1) > " .
                "div:nth-child(2) > label:nth-child(1)"
            )
        )->getText();
        $this->assertStringContainsString("Selected", $ImagePanelText2);

        $ImagePanelText3 = $this->safeFindElement(
            WebDriverBy::cssSelector(
                ".col-xs-3 > div:nth-child(1) > " .
                "div:nth-child(3) > label:nth-child(1)"
            )
        )->getText();
        $this->assertStringContainsString("Caveat", $ImagePanelText3);

        // Setting permissions to view all sites and have qc permissions
        $this->setupPermissions(
            [
                'imaging_browser_view_allsites',
                'imaging_browser_qc',
            ]
        );
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $SelectedLink = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$selectedLink)
        );
        $this->clickToLoadNewPage($SelectedLink);

        // Only with the correct permissions would the options
        // in the dropdown menu appear
        $QCStatusPass = $this->safeFindElement(
            WebDriverBy::cssSelector(
                ".col-xs-3 > div:nth-child(1) > " .
                "div:nth-child(1) > select:nth-child(2)"
            )
        )->getText();
        $this->assertStringContainsString("Pass", $QCStatusPass);

        $QCSelectedFlair = $this->safeFindElement(
            WebDriverBy::cssSelector(
                ".col-xs-3 > div:nth-child(1) > " .
                "div:nth-child(2) > select:nth-child(2)"
            )
        )->getText();
        $this->assertStringContainsString("flair", $QCSelectedFlair);

        $QCStatusCaveatTrue = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "div.row:nth-child(3) > select:nth-child(2) > " .
                "option:nth-child(2)"
            )
        )->getText();
        $this->assertStringContainsString("True", $QCStatusCaveatTrue);

        // Test that we can edit the QC status -IMAGE LEVEL-
        // by changing it from Blank to Pass

        // Send option Pass (second option) from dropdown menu,
        // Click save,
        // Check PASS green flag appears next to file name
        $QCStatusImageSetFail = $this->safeFindElement(
            WebDriverBy::cssSelector(
                ".col-xs-3 > div:nth-child(1) > div:nth-child(1) > " .
                "select:nth-child(2) > option:nth-child(2)"
            )
        );
        $QCStatusImageSetFail->click();

        $QCSaveShow = $this->safeFindElement(
            WebDriverBy::xPath('//input[@accessKey="s"]')
        );
        $QCSaveShow->click();

        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->webDriver->navigate()->refresh();

        $QCStatusImageCheck = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#image-1 > div > div > div.panel-heading > span.label.label-success"
            )
        )->getText();
        $this->assertStringContainsString("Fail", $QCStatusImageCheck);

        // Caveat Link only if view all_sites violated scans permissions
        $this->setupPermissions(
            [
                'imaging_browser_view_allsites',
                'imaging_browser_qc',
                'violated_scans_view_allsites',
            ]
        );
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $SelectedLink = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$selectedLink)
        );
        $this->clickToLoadNewPage($SelectedLink);

        $this->markTestSkipped(
            'React components can not be tested, but also awaiting Redmine 9528'
        );

        $CaveatListLink = $this->safeFindElement(
            WebDriverBy::xPath('//*[@id="panel-body-23"]/div[1]/div[2]/div/div[3]/a')
        );
        $CaveatListLink->click();
        $breadcrumbText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Mri Violations", $breadcrumbText);
    }

    /**
     * Step 3
     * Selected set to NULL
     *
     * @return void
    **/

    /**
     * Step 4
     * Future Release
     *
     * @return void
    **/

    /**
     * Step 5
     * This is tested in B-Step2 (awaiting redmine 9385)
     *
     * @return void
    **/

    /**
     * Step 6
     * Link to comments launches window
     *
     * @return void
    */
    function testCommentsWindowLaunch()
    {
        $this->markTestSkipped(
            'Popup windows can not be tested'
        );
        // Setting permissions to view all sites to view all datasets
        $this->setupPermissions(['imaging_browser_view_allsites']);
        $this->webDriver->navigate()->refresh();
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $SelectedLink = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$selectedLink)
        );
        $this->clickToLoadNewPage($SelectedLink);

        $CommentsButton = $this->safeFindElement(
            WebDriverBy::cssSelector(
                ".mri-second-row-panel > a:nth-child(1) > " .
                "span:nth-child(1) > span:nth-child(2)"
            )
        );
        $handleList     = $this->webDriver->getWindowHandles();
        $CommentsButton->click();

        $newHandleList = $this->webDriver->getWindowHandles();
        $diff          = array_diff($newHandleList, $handleList);
        $this->assertCount(1, $diff);
        $this->webDriver->switchTo()->window($diff[1]);
        $newWindowText = $this->safeFindElement(
            WebDriverBy::xPath('//body')
        )->getText();
        $this->assertStringContainsString("Click here to close this window", $newWindowText);
        $this->webDriver->switchTo()->window($diff[1])->close();
    }

    /******** D ********/
    /**
     * Link to scan level comments editable with correct permission
     *
     * @return void
    */
    function testVisitCommentsWindowEditable()
    {
        $this->markTestSkipped(
            'Skipping tests until Travis and React get along better'
        );
        // Setting permissions to view all sites to view all datasets
        $this->setupPermissions(
            [
                'imaging_browser_view_allsites',
                'imaging_browser_qc',
            ]
        );
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );
        $NativeLink = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$nativeLink)
        );
        $this->clickToLoadNewPage($NativeLink);

        $VisitLevelFeedback = $this->safeFindElement(
            WebDriverBy::xPath('//*[@id="sidebar-content"]/div[1]/a/span/span[2]')
        );
        $handleList         = $this->webDriver->getWindowHandles();
        $VisitLevelFeedback->click();

        $newHandleList = $this->webDriver->getWindowHandles();
        $diff          = array_diff($newHandleList, $handleList);
        $this->assertCount(1, $diff);
        $this->webDriver->switchTo()->window($diff[1]);

        // First clear the field then send the comments/text
        $this->safeFindElement(
            WebDriverBy::Name("savecomments[text][7]")
        )->clear();
        $this->safeFindElement(
            WebDriverBy::Name("savecomments[text][7]")
        )->sendKeys("Testing comment field within Subject header");

        $SaveButton = $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        );
        $SaveButton->click();

        $SubjectText = $this->safeFindElement(
            WebDriverBy::Name("savecomments[text][7]")
        )->getText();
        $this->assertEquals(
            "Testing comment field within Subject header",
            $SubjectText
        );

        $this->webDriver->switchTo()->window($diff[1])->close();
    }

    /******** E ********/
    /**
     * Link to visit level comments editable with proper permissions
     *
     * @return void
    */
    function testImageCommentsWindowEditable()
    {
        $this->markTestSkipped(
            'React components can not be tested'
        );
        // Setting permissions to view all sites to view all datasets
        $this->setupPermissions(
            [
                'imaging_browser_view_allsites',
                'imaging_browser_qc',
            ]
        );
        $this->safeGet(
            $this->url . "/imaging_browser/"
        );

        $NativeLink = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$nativeLink)
        );
        $this->clickToLoadNewPage($NativeLink);

        $ImageQCFeedback = $this->safeFindElement(
            WebDriverBy::cssSelector(
                ".mri-second-row-panel > a:nth-child(1) > " .
                "span:nth-child(1) > span:nth-child(2)"
            )
        );
        $handleList      = $this->webDriver->getWindowHandles();
        $ImageQCFeedback->click();
        $newHandleList = $this->webDriver->getWindowHandles();
        $diff          = array_diff($newHandleList, $handleList);
        $this->assertCount(1, $diff);
        $this->webDriver->switchTo()->window($diff[1]);

        // First clear the field then send the comments/text
        $this->safeFindElement(
            WebDriverBy::Name("savecomments[text][1]")
        )->clear();
        $this->safeFindElement(
            WebDriverBy::Name("savecomments[text][1]")
        )->sendKeys("Testing comment field within Geometric Intensity");

        $SaveButton = $this->safeFindElement(
            WebDriverBy::Name("fire_away")
        );
        $SaveButton->click();

        $GeometricDistortionText = $this->safeFindElement(
            WebDriverBy::Name("savecomments[text][1]")
        )->getText();
        $this->assertEquals(
            "Testing comment field within Geometric Intensity",
            $GeometricDistortionText
        );

        $this->webDriver->switchTo()->window($diff[1])->close();
    }
}
?>
