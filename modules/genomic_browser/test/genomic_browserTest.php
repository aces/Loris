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
         $this->assertStringContainsString("You do not have access to this page.", $bodyText);
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
         $this->assertStringNotContainsString("You do not have access to this page.", $bodyText);
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
     * Tests that, inputing test data and searching the data,
     * checking the results in the table.
     *
     * @return void
     */
    function testGenomicBrowserFilterEachTab()
    {
        $this->markTestSkipped("Skipping long test");
        return;
        // test filter in Profiles Tab
        //$this->_testFilter("/genomic_browser/", "PSCID", "MTL001", "1 rows");
        //$this->_testFilter("/genomic_browser/", "DCCID", "300001", "1 rows");
        //$this->_testFilter(
        //    "/genomic_browser/",
        //    "PSCID",
        //    "999999",
        //    "No result found."
        //);
        //$this->_testFilter(
        //    "/genomic_browser/",
        //    "DCCID",
        //    "999999",
        //    "No result found."
        //);
        //// test filter in GWAS Tab
        //$this->_testFilter(
        //    "/genomic_browser/gwas_browser/",
        //    "Chromosome",
        //    "chr14",
        //    "No result found."
        //);
        //$this->_testFilter(
        //    "/genomic_browser/gwas_browser/",
        //    "BP_Position",
        //    "19009011",
        //    "No result found."
        //);
        //$this->_testFilter(
        //    "/genomic_browser/gwas_browser/",
        //    "Chromosome",
        //    "999999",
        //    "No result found."
        //);
        //$this->_testFilter(
        //    "/genomic_browser/gwas_browser/",
        //    "BP_Position",
        //    "999999",
        //    "No result found."
        //);
        //// test filter in SNP Tab
        //$this->_testFilter(
        //    "/genomic_browser/snp_browser/",
        //    "rsID",
        //    "MTL001",
        //    "No result found."
        //);
        //$this->_testFilter(
        //    "/genomic_browser/snp_browser/",
        //    "rsID",
        //    "999999",
        //    "No result found."
        //);
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
        $this->safeFindElement(
            WebDriverBy::cssSelector("#tab-tabFiles")
        )->click();
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
