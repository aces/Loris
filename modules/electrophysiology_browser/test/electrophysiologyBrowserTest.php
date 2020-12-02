<?php
/**
 * Electrophysiology Browser automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Alexandra Livadas <alexandra.livadas@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__ . "/../../../test/integrationtests/"
    . "LorisIntegrationTestWithCandidate.class.inc";

/**
 * Implements automated integration tests for Electrophysiology Browser within Loris
 *
 * @category Test
 * @package  Loris
 * @author   Alexandra Livadas <alexandra.livadas@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class EEGBrowserIntegrationTest extends LorisIntegrationTestWithCandidate
{

    //Filter options
    static $site       = 'select[name="site"]';
    static $PSCID      = 'input[name="PSCID"]';
    static $DCCID      = 'input[name="DCCID"]';
    static $project    = 'select[name="project"]';
    static $visitLabel = 'input[name="visitLabel"]';

    static $display      = ".table-header > div > div > div:nth-child(1)";
    static $clearFilter  = ".nav-tabs a";
    static $PSCIDHeader  = "#dynamictable > thead > tr > th:nth-child(3)";
    static $DCCIDHeader  = "#dynamictable > thead > tr > th:nth-child(4)";
    static $firstElement = "#dynamictable > tbody > tr:nth-child(1)";

    static $allLink = "tbody > tr:nth-child(1) > td:nth-child(9) > a:nth-child(2)";
    static $rawLink = "tbody > tr:nth-child(1) > td:nth-child(9) > a:nth-child(1)";

    static $prevLink       = "#nav_previous";
    static $nextLink       = "#nav_next";
    static $breadcrumbLink = "#bc2 > a:nth-child(2)";

    /**
     * Setup and insert testing data
     *
     * @return void
     */
    function setUp() : void
    {
        parent::setUp();
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
            "candidate",
            [
                'CandID'                => '000001',
                'PSCID'                 => 'DCC0001',
                'RegistrationCenterID'  => 253,
                'RegistrationProjectID' => 2,
                'Active'                => 'Y',
                'Entity_type'           => 'Human',
            ]
        );
        $this->DB->insert(
            'session',
            [
                'ID'            => '999997',
                'CandID'        => '000001',
                'Visit_label'   => 'Test0',
                'CenterID'      => 253,
                'ProjectID'     => 2,
                'Scan_done'     => 'Y',
                'Current_stage' => 'Visit',
                'Visit'         => 'In Progress',
            ]
        );
        $this->DB->insert(
            "ImagingFileTypes",
            [
                'type'        => 'testType',
                'description' => 'test%(EEG)'
            ]
        );
        $this->DB->insert(
            "ImagingFileTypes",
            [
                'type'        => 'testType2',
                'description' => 'test2%(EEG)'
            ]
        );
        $this->DB->insert(
            "physiological_output_type",
            [
                'PhysiologicalOutputTypeID' => 22,
                'OutputTypeName'            => 'test'
            ]
        );
        $this->DB->insert(
            "physiological_output_type",
            [
                'PhysiologicalOutputTypeID' => 23,
                'OutputTypeName'            => 'test2'
            ]
        );
        $this->DB->insert(
            "physiological_file",
            [
                'SessionID'                 => '999999',
                'PhysiologicalOutputTypeID' => 22,
                'FileType'                  => 'testType'
            ]
        );
        $this->DB->insert(
            "physiological_file",
            [
                'SessionID'                 => '999997',
                'PhysiologicalOutputTypeID' => 23,
                'FileType'                  => 'testType2'
            ]
        );
    }

    /**
     * Teardown and delete testing data
     *
     * @return void
     */
    function tearDown() : void
    {
        $this->DB->delete(
            "physiological_file",
            [
                'SessionID'                 => '999999',
                'PhysiologicalOutputTypeID' => 22,
            ]
        );
        $this->DB->delete(
            "physiological_file",
            [
                'SessionID'                 => '999997',
                'PhysiologicalOutputTypeID' => 23,
            ]
        );
        $this->DB->delete(
            'session',
            [
                'ID'     => 999997,
                'CandID' => 000001
            ]
        );
        $this->DB->delete(
            "candidate",
            [
                'CandID' => '000001',
                'PSCID'  => 'DCC0001',
            ]
        );
        $this->DB->delete(
            "psc",
            ['CenterID' => '253']
        );

        $this->DB->delete(
            "physiological_output_type",
            [
                'PhysiologicalOutputTypeID' => 22,
                'OutputTypeName'            => 'test'
            ]
        );
        $this->DB->delete(
            "physiological_output_type",
            [
                'PhysiologicalOutputTypeID' => 23,
                'OutputTypeName'            => 'test2'
            ]
        );
        $this->DB->delete(
            "ImagingFileTypes",
            [
                'type'        => 'testType',
                'description' => 'test%(EEG)'
            ]
        );
        $this->DB->delete(
            "ImagingFileTypes",
            [
                'type'        => 'testType2',
                'description' => 'test2%(EEG)'
            ]
        );
        parent::tearDown();
    }

    /**
     * Tests that the page loads
     *
     * @return void
     */
    function testEEGBrowserDoesPageLoad()
    {
        $this->safeGet($this->url . "/electrophysiology_browser/?");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString("Electrophysiology Browser", $bodyText);
    }

    /**
     * Test that the page loads with the given permissions
     *
     * @return void
     */
    function testEEGBrowserPermissions()
    {
        $this->checkPagePermissions(
            '/electrophysiology_browser/?',
            [
                'electrophysiology_browser_view_allsites',
                'electrophysiology_browser_view_site'
            ],
            "Electrophysiology Browser"
        );
    }

    /**
     * Test that the EEG Browser still loads if the user has a different site but
     * has 'electrophysiology_browser_view_allsites' permissions
     *
     * @return void
     */
    function testEEGBrowserWithSitePermissions()
    {
        $this->resetStudySite();
        $this->changeStudySite();
        $this->setupPermissions(['electrophysiology_browser_view_allsites']);
        $this->safeGet($this->url . "/electrophysiology_browser/?");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
        $this->resetStudySite();
    }

    /**
     * Test all filters on the main page. Test that the Clear Filter works.
     *
     * @return void
     */
    function testFilters()
    {
        $this->safeGet($this->url . "/electrophysiology_browser/");
        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clearFilter,
            'TST0001',
            "1 rows"
        );
        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clearFilter,
            'TST0002',
            "0 rows"
        );
        $this->_filterTest(
            self::$DCCID,
            self::$display,
            self::$clearFilter,
            '900000',
            "1 rows"
        );
        $this->_filterTest(
            self::$DCCID,
            self::$display,
            self::$clearFilter,
            '900001',
            "0 rows"
        );
        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clearFilter,
            'Data Coordinating Center',
            "1 rows"
        );
        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clearFilter,
            'Montreal',
            "0 rows"
        );
        $this->_filterTest(
            self::$project,
            self::$display,
            self::$clearFilter,
            'Challah',
            "0 rows"
        );
        $this->_filterTest(
            self::$visitLabel,
            self::$display,
            self::$clearFilter,
            'Test',
            "1 rows"
        );
        $this->_filterTest(
            self::$visitLabel,
            self::$display,
            self::$clearFilter,
            'V2',
            "0 rows"
        );
    }

    /**
     * Test that the column headers at the top of the table
     * sort the table data when clicked
     *
     * @return void
     */
    function testEEGBrowserSortableByColumn()
    {
        $this->safeGet($this->url . "/electrophysiology_browser/?");

        //Test PSCID Header
        $this->safeClick(
            WebDriverBy::cssSelector(self::$PSCIDHeader)
        );

        $firstEntry = $this->safeFindElement(
            WebDriverBy::cssSelector("#dynamictable > tbody > tr:nth-child(1)")
        )->getText();
        $this->assertStringContainsString("OTT166", $firstEntry);
        $this->safeClick(
            WebDriverBy::cssSelector(self::$PSCIDHeader)
        );
        $firstEntry = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$firstElement)
        )->getText();
        $this->assertStringContainsString("TST0001", $firstEntry);

        //Test DCCID Header
        $firstEntry = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$firstElement)
        )->getText();
        $this->assertStringContainsString("900000", $firstEntry);

        $this->safeClick(
            WebDriverBy::cssSelector(self::$DCCIDHeader)
        );

        $firstEntry = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$firstElement)
        )->getText();
        $this->assertStringContainsString("900000", $firstEntry);
    }

    /**
     * Test that the all types link takes you to a Sessions page
     *
     * @return void
     */
    function testAllTypesLink()
    {
        $this->safeGet($this->url . "/electrophysiology_browser/");
        $link = self::$allLink;
        $this->safeClick(WebDriverBy::cssSelector($link));
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "View Session",
            $bodyText
        );
    }

    /**
     * Test that the raw link takes you to a Sessions page
     *
     * @return void
     */
    function testRawLink()
    {
        $this->safeGet($this->url . "/electrophysiology_browser/");
        $link = self::$rawLink;
        $this->safeClick(WebDriverBy::cssSelector($link));
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "View Session",
            $bodyText
        );
    }

    /**
     * Test that the sessions page loads
     *
     * @return void
     */
    function testSessionsDoesPageLoad()
    {
        $this->safeGet($this->url . "/electrophysiology_browser/sessions/999999");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString(
            "Electrophysiology Browser",
            $bodyText
        );
    }

    /**
     * Test that the Sessions page loads with EEG permissions
     *
     * @return void
     */
    function testSessionsWithPermissions()
    {
        $this->checkPagePermissions(
            '/electrophysiology_browser/sessions/999999',
            [
                'electrophysiology_browser_view_allsites',
                'electrophysiology_browser_view_site'
            ],
            "Electrophysiology Browser"
        );
    }

    /**
     * Test that the Sessions page does not load if the user does
     * not have the same site.
     *
     * @return void
     */
    function testSessionsSitePermissions()
    {
        $this->resetStudySite();
        $this->changeStudySite();

        $this->setupPermissions(['electrophysiology_browser_view_site']);
        $this->safeGet($this->url . "/electrophysiology_browser/sessions/999999");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();

        $this->setupPermissions(['electrophysiology_browser_view_allsites']);
        $this->safeGet($this->url . "/electrophysiology_browser/sessions/999999");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();

        $this->resetStudySite();
    }

    /**
     * Test that the Sessions page does not load if the user
     * does not have the same project.
     *
     * @return void
     */
    function testSessionsProjectPermissions()
    {
        $this->resetUserProject();
        $this->changeUserProject();

        $this->setupPermissions(['electrophysiology_browser_view_allsites']);
        $this->safeGet($this->url . "/electrophysiology_browser/sessions/999999");
        $bodyText
            = $this->safeFindElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();

        $this->resetUserProject();
    }

    /**
     * Test that the "Previous" and "Next" links navigate to other
     * sessions pages.
     *
     * @return void
     */
    function testSessionsNavigation()
    {
        $this->safeGet($this->url . "/electrophysiology_browser/sessions/999999");
        $link = self::$nextLink;
        $this->safeClick(WebDriverBy::cssSelector($link));

        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "View Session",
            $bodyText
        );
        $this->assertStringContainsString("167", $this->webDriver->getCurrentURL());

        $this->safeClick(WebDriverBy::cssSelector(self::$prevLink));
        $this->assertStringContainsString("166", $this->webDriver->getCurrentURL());
    }

    /**
     * Test that the breadcrumbs link returns
     * to the main EEG page
     *
     * @return void
     */
    function testSessionsBreadcrumbLink()
    {
        $this->safeGet($this->url . "/electrophysiology_browser/sessions/999999");
        $this->safeClick(WebDriverBy::cssSelector(self::$breadcrumbLink));

        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString("View Session", $bodyText);
        $this->assertStringContainsString(
            "/electrophysiology_browser",
            $this->webDriver->getCurrentURL()
        );
        $this->assertStringNotContainsString("sessions", $this->webDriver->getCurrentURL());
    }
}
