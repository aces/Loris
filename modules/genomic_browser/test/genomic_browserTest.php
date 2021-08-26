<?php
/**
 * Genomic_browser automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * GenomicBrowserTestIntegrationTest
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <shen.wang2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class GenomicBrowserTestIntegrationTest extends LorisIntegrationTest
{
    // expect UIs for Profiles Tab
    // private $_loadingProfilesUI = array(
    //     'Profiles' => '#tab-tabProfiles'
    // );
    // expect UIs for GWAS Tab
    private $_loadingGWASUI = [
        'GWAS' => '#tab-tabGWAS',
    ];
    // expect UIs for SNP Tab
    private $_loadingSNPUI = [
        'SNP'         => '#tab-tabSNP',
    ];
    // expect UIs for Methylation Tab
    private $_MethylationUI = [
        'Methylation'     => '#tab-tabMethylation',
    ];
    // expect UIs for Files Tab
    private $_FilesUI = [
        'Files' => '#tab-tabFiles',
    ];

    //Filter locations
    static $site       = 'select[name="Site"]';
    static $DCCID      = 'input[name="DCCID"]';
    static $PSCID      = 'input[name="PSCID"]';
    static $sex        = 'select[name="Sex"]';
    static $subproject = 'select[name="Subproject"]';
    static $externID   = 'input[name="External ID"]';
    static $file       = 'select[name="File"]';
    static $SNP        = 'select[name="SNPs found"]';
    static $CNV        = 'select[name="CNVs found"]';
    static $CPG        = 'select[name="CPGs found"]';

    static $display     = '.table-header > div > div > div:nth-child(1)';
    static $clearFilter = '.nav-tabs a';
    static $clear       = "div.col-xs-12.col-sm-12.col-md-12 > ul > li > a";

    /**
     * Tests that, when loading the genomic_browser module, the
     * breadcrumb is 'Genomic browser' or an error is given according
     * to the user's permissions.
     *
     * @return void
     */
    function testGenomicBrowserWithoutPermission()
    {
         $this->setupPermissions([]);
         $this->safeGet($this->url . "/genomic_browser/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
         $this->resetPermissions();
    }
    /**
     * Tests that, when loading the genomic_browser module, the
     * breadcrumb is 'Genomic browser' or an error is given according
     * to the user's permissions.
     *
     * @return void
     */
    function testGenomicBrowserWithPermission()
    {
        $this->setupPermissions(
            [
                "genomic_browser_view_allsites",
                "genomic_browser_view_site",
            ]
        );
         $this->safeGet($this->url . "/genomic_browser/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
         $this->resetPermissions();
    }
    /**
     * Tests that, when loading the genomic_browser module, the each Tab should
     * have their own UIs.
     *
     * @return void
     */
    function testGenomicBrowserEachTab()
    {
        $this->safeGet($this->url . "/genomic_browser/");
        $this->_testPageUIs("#tab-tabGWAS", $this->_loadingGWASUI);
        $this->_testPageUIs("#tab-tabSNP", $this->_loadingSNPUI);
        $this->_testPageUIs(
            "#tab-tabMethylation",
            $this->_MethylationUI
        );
        $this->_testPageUIs(
            "#tab-tabFiles",
            $this->_FilesUI
        );
    }


    /**
     * Tests that the filters and the clear filter buton the Profiles
     * tab of the genomic browser function correctly
     *
     * @return void
     */
    function testGenomicBrowserFiltersProfileTab()
    {
        $this->safeGet($this->url . "/genomic_browser/");

        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clear,
            'Montreal',
            '20 rows'
        );

        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clear,
            'Data Coordinating Center',
            '7 rows'
        );

        $this->_filterTest(
            self::$DCCID,
            self::$display,
            self::$clear,
            'test',
            '0 rows'
        );

        $this->_filterTest(
            self::$DCCID,
            self::$display,
            self::$clear,
            '475906',
            '1 rows'
        );

        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clear,
            'test',
            '0 rows'
        );

        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clear,
            'MTL024',
            '1 rows'
        );

        $this->_filterTest(
            self::$sex,
            self::$display,
            self::$clear,
            'Female',
            '334'
        );

        $this->_filterTest(
            self::$file,
            self::$display,
            self::$clear,
            'Yes',
            '0 rows'
        );

        $this->_filterTest(
            self::$SNP,
            self::$display,
            self::$clear,
            'No',
            '6 rows'
        );

        $this->_filterTest(
            self::$CNV,
            self::$display,
            self::$clear,
            'Yes',
            '3 rows'
        );

        $this->_filterTest(
            self::$CPG,
            self::$display,
            self::$clear,
            'Yes',
            '3 rows'
        );
    }

    /**
     * This function could test UI elemnts in each Tabs.
     *
     * @param string $url this is for the url which needs to be tested.
     * @param array  $ui  UI elements in each Tabs.
     *
     * @return void
     */
    function _testPageUIs($url,$ui)
    {
        $this->safeFindElement(
            WebDriverBy::cssSelector($url)
        )->click();
        foreach ($ui as $key => $value) {
            $text = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
            $this->assertStringContainsString($key, $text);
        }

    }
    /**
     * This function could test filter function in each Tabs.
     *
     * @param string $url            this is for the url which needs to be tested.
     * @param string $filter         the filter which needs to be tested.
     * @param string $testData       the test data.
     * @param string $expectDataRows the expect rows in the table.
     *
     * @return void
     */
    function _testFilter($url,$filter,$testData,$expectDataRows)
    {
        $this->safeGet($this->url . $url);
        $this->safeFindElement(
            WebDriverBy::Name($filter)
        )->sendKeys($testData);
         //click showdata button
                $this->safeFindElement(
                    WebDriverBy::Name('filter')
                )->click();
                $text = $this->webDriver->executescript(
                    "return document.querySelector('#datatable').textContent"
                );
                  $this->assertStringContainsString($expectDataRows, $text);
    }
    /**
     * Tests that, when clicking the upload button,the upload window should show up
     *
     * @return void
     */
    function testUploadFile()
    {
        $this->safeGet($this->url . "/genomic_browser/");
        $this->safeClick(
            WebDriverBy::cssSelector("#tab-tabFiles")
        );sleep(2);
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "div.panel:nth-child(2) > div:nth-child(1)".
                  " > div:nth-child(1) > div:nth-child(2) > div:nth-child(1) >".
                " div:nth-child(1) > div:nth-child(1) > button:nth-child(1)"
            )
        )->click();
        $value    = "#tabFiles > div:nth-child(1) > div > div:nth-child(1)";
            $text = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
            $this->assertStringContainsString("Upload File", $text);
    }
}
