<?php declare(strict_types=1);

/**
 * Candidate_list automated integration tests
 *
 * PHP Version 8
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTestWithCandidate.class.inc";
/**
 * CandidateListTestIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Nicolas Brossard <nicolasbrossard.mni@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class CandidateListTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    //filter location
    static $PSCID       = 'input[name="pscid"]';
    static $DCCID       = 'input[name="dccid"]';
    static $visitLabel  = '.loris-select[data-name="visitLabel"]';
    static $site        = '.loris-select[data-name="site"]';
    static $entityType  = '.loris-select[data-name="entityType"]';
    static $sex         = '.loris-select[data-name="sex"]';
    static $project     = '.loris-select[data-name="project"]';
    static $cohort      = '.loris-select[data-name="cohort"]';
    static $scanDone    = '.loris-select[data-name="scanDone"]';
    static $Participant = '.loris-select[data-name="participantStatus"]';
    static $dob         = 'input[name="DoBMin"]';
    static $visitCount  = 'input[name="visitCount"]';
    static $feedback    = '.loris-select[data-name="feedback"]';
    static $edc         = 'input[name="edc"]';

    static $openProfile  = ".action-openProfile button";
    static $clearFilter  = ".rt-clear-all button";
    static $scanDoneLink = '.rt-table tbody tr a[href*="imaging_browser"]';
    static $pscidLink    = "tr:nth-child(1) a";

    /**
     * Backs up the useEDC config value and sets the value to a known
     * value (true) for testing.
     *
     * @return void
     */
    function setUp(): void
    {
        parent::setUp();
        $this->setupConfigSetting("useEDC", "true");
    }

    /**
     * Restore the values backed up in the setUp function
     *
     * @return void
     */
    function tearDown(): void
    {
        parent::tearDown();
        $this->restoreConfigSetting("useEDC");
    }

    /**
     * Tests that, the homepage should not have "You do not have access
     * to this page." on the page with permission.
     *
     * @return void
     */
    function testPageLoadsWithoutPermissionsAccessAllProfiles()
    {
        $this->setupPermissions(["access_all_profiles"]);
        $this->safeGet($this->url . "/candidate_list/");
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
     * Tests that, when loading the candidate_list module, the breadcrumb
     * appears and the filters are shown beside the table.
     *
     * @return void
     */
    function testCandidateListPageLoads()
    {
        $this->safeGet($this->url . "/candidate_list/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Access Profile", $bodyText);
        $drawerText = $this->safeFindElement(
            WebDriverBy::cssSelector(".rt-drawer")
        )->getText();
        $this->assertStringContainsString("Filters", $drawerText);
    }

    /**
     * Tests that a candidate's registration cohort appears before a visit is
     * started for that cohort.
     *
     * @return void
     */
    function testRegistrationCohortAppearsWithoutVisit(): void
    {
        $this->DB->update(
            'candidate',
            ['RegistrationCohortID' => 1],
            ['CandID' => '900000']
        );
        $this->DB->delete('session', ['CandidateID' => 1]);

        $this->safeGet($this->url . "/candidate_list/?pscid=TST0001");
        $tableText = $this->safeFindElement(
            WebDriverBy::cssSelector('.rt-table')
        )->getText();

        $this->assertStringContainsString('TST0001', $tableText);
        $this->assertStringContainsString('Stale', $tableText);
    }

    /**
     * Tests that every filter appears in the drawer.
     *
     * @return void
     */
    function testCandidateListFiltersAppear()
    {
        $this->safeGet($this->url . "/candidate_list/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#breadcrumbs")
        )->getText();
        $this->assertStringContainsString("Access Profile", $bodyText);
        $this->safeFindElement(WebDriverBy::cssSelector(".rt-drawer"));
        $filters = [
            self::$scanDone,
            self::$Participant,
            self::$sex,
            self::$feedback,
            self::$visitCount,
            self::$edc,
            self::$dob,
        ];
        foreach ($filters as $filter) {
            $this->assertCount(
                1,
                $this->webDriver->findElements(
                    WebDriverBy::cssSelector(".rt-drawer $filter")
                ),
                "Missing filter $filter"
            );
        }
    }

    /**
     * Tests clear button in the form
     * The form should refreash and the data should be gone.
     *
     * @return void
     */
    function testFilters()
    {
        $this->safeGet($this->url . "/candidate_list/");
        $this->_filterTest(
            self::$PSCID,
            $this->_total(0),
            self::$clearFilter,
            'test',
            '0',
        );
        $this->_filterTest(
            self::$PSCID,
            $this->_total(1),
            self::$clearFilter,
            'MTL001',
            '1'
        );
        $this->_filterTest(
            self::$DCCID,
            $this->_total(1),
            self::$clearFilter,
            '300001',
            '1'
        );
        $this->_filterTest(
            self::$DCCID,
            $this->_total(0),
            self::$clearFilter,
            'test',
            '0'
        );
        $this->_filterTest(
            self::$visitLabel,
            $this->_total(362),
            self::$clearFilter,
            'V1',
            '362'
        );
        $this->_filterTest(
            self::$visitLabel,
            $this->_total(223),
            self::$clearFilter,
            'V2',
            '223'
        );
        $this->_filterTest(
            self::$site,
            $this->_total(7),
            self::$clearFilter,
            'Data Coordinating Center',
            '7'
        );
        $this->_filterTest(
            self::$site,
            $this->_total(165),
            self::$clearFilter,
            "Montreal",
            '165'
        );
        $this->_filterTest(
            self::$entityType,
            $this->_total(436),
            self::$clearFilter,
            "Human",
            '436'
        );
        $this->_filterTest(
            self::$sex,
            $this->_total(226),
            self::$clearFilter,
            "Female",
            '226'
        );
        $this->_filterTest(
            self::$sex,
            $this->_total(210),
            self::$clearFilter,
            "Male",
            '210'
        );
        $this->_filterTest(
            self::$scanDone,
            $this->_total(17),
            self::$clearFilter,
            "Yes",
            '17'
        );
        $this->_filterTest(
            self::$Participant,
            $this->_total(436),
            self::$clearFilter,
            "Active",
            '436'
        );
        $this->_filterTest(
            self::$visitCount,
            $this->_total(79),
            self::$clearFilter,
            "3",
            '79'
        );
        $this->_filterTest(
            self::$feedback,
            $this->_total(11),
            self::$clearFilter,
            "Closed",
            '11'
        );
        $this->_filterTest(
            self::$edc,
            $this->_total(1),
            self::$clearFilter,
            "2003-07-30",
            '1'
        );
        $this->_filterTest(
            self::$cohort,
            $this->_total(2),
            self::$clearFilter,
            "High Yeast",
            '2'
        );
    }

    /**
     * Gives the selector for the table's count once it shows a total
     *
     * @param int $total The number of rows expected
     *
     * @return string
     */
    private function _total(int $total): string
    {
        return ".rt-range[data-total=\"$total\"]";
    }

    /**
     * Tests that, when user only has data_entry permisson, user
     * can click open profile button to input PSCID and DCCID
     *
     * @return void
     */
    function testDataEntryAndOpenProfile()
    {
        $this->setupPermissions(["data_entry"]);
        $this->safeGet($this->url . "/candidate_list/");
        //click open profile button
        $btn = self::$openProfile;
        $this->safeClick(WebDriverBy::cssSelector($btn), 1);
        // input PSCID and DCCID
        $dccid = 'input[name="CandID"]:nth-child(1)';
        $pscid = 'input[name="PSCID"]:nth-child(1)';
        // to do react input value
        $this->safeFindElement(
            WebDriverBy::cssSelector($dccid),
            1
        )->sendKeys('300001');
        $this->safeFindElement(
            WebDriverBy::cssSelector($pscid),
            1
        )->sendKeys('MTL001');
        $btn = ".col-sm-12 > .row .btn";
        //to do check the url
        $this->safeClick(WebDriverBy::cssSelector($btn), 1);
        sleep(2);
        $URL =  $this->webDriver->executeScript("return window.location.href;");
        $this->assertStringContainsString("300001", $URL);
        $this->resetPermissions();
    }

    /**
     * Tests that, click the pscid link, and it will goto the candidate profile page
     *
     * @return void
     */
    function testPscidLink()
    {
        $this->safeGet($this->url . "/candidate_list/");
        $link = self::$pscidLink;
        sleep(1);
        $this->safeClick(WebDriverBy::cssSelector($link));
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "Candidate Profile",
            $bodyText
        );
    }

    /**
     * Tests that, click the scanDone ="y" link,
     * and it will goto the imaging browser page.
     *
     * @return void
     */
    function testScanDoneLink()
    {
        $this->safeGet($this->url . "/candidate_list/?pscid=MTL022");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$scanDoneLink)
        )->getText();
        $this->assertStringContainsString(
            "Y",
            $bodyText
        );
        $this->safeClick(
            WebDriverBy::cssSelector(self::$scanDoneLink)
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$pscidLink)
        )->getText();
        $this->assertStringContainsString(
            "MTL022",
            $bodyText
        );
    }
}
