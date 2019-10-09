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
    private $_loadingProfilesUI = array(
                                   'Profiles'          => '#onLoad > strong',
                                   'Candidate Filters' => '#lorisworkspace>div>'.
                                           'div:nth-child(2)>div>div>form>div:nth'.
                                           '-child(1)>div>div>div>div.panel-heading',
                                   'Genomic Filters'   => '#lorisworkspace>div>'.
                                           'div:nth-child(2)>div>div>form>'.
                                           'div:nth-child(2)>div>'.
                                           'div.form-group.col-sm-8>'.
                                           'div>div.panel-heading',
          // expected_headers
                                   'No.'               => '#dynamictable > thead',
                                   'PSCID'             => '#dynamictable > thead',
                                   'Sex'               => '#dynamictable > thead',
                                   'Subproject'        => '#dynamictable > thead',
                                   'File'              => '#dynamictable > thead',
                                   'SNP'               => '#dynamictable > thead',
                                   'CNV'               => '#dynamictable > thead',
                                   'CPG'               => '#dynamictable > thead',
                                  );
    // expect UIs for GWAS Tab
    private $_loadingGWASUI = array(
                               'Gwas Browser' => '#bc2 > a:nth-child(3) > div',
                               'GWAS Filters' => '#lorisworkspace > div > '.
                                           'div:nth-child(2) > div >div > form >'.
                                           'div>div>div.form-group.col-sm-8>div> '.
                                           'div.panel-heading',
                              );
    // expect UIs for SNP Tab
    private $_loadingSNPUI = array(
                              'SNP Filters'         => '#lorisworkspace > div >'.
                                           'div:nth-child(2) > div > div'.
                                           '> form > div > div:nth-child(2) >'.
                                           'div.form-group.col-sm-8 >'.
                                           ' div > div.panel-heading',
          // expected_headers
                              'No.'                 => '#dynamictable > thead',
                              'PSCID'               => '#dynamictable > thead',
                              'Sex'                 => '#dynamictable > thead',
                              'RsID'                => '#dynamictable > thead',
                              'Allele A'            => '#dynamictable > thead',
                              'Allele B'            => '#dynamictable > thead',
                              'Reference Base'      => '#dynamictable > thead',
                              'Minor Allele'        => '#dynamictable > thead',
                              'Function Prediction' => '#dynamictable > thead',
                              'Damaging'            => '#dynamictable > thead',
                              'Exonic Function'     => '#dynamictable > thead',
                             );
    // expect UIs for Methylation Tab
    private $_MethylationUI = array(
                               'Candidate Filters'     => '#lorisworkspace > div >'.
                                           ' div:nth-child(2) > div> div > form >'.
                                           ' div>div:nth-child(1)>div.form-group.'.
                                           'col-sm-7 > div > div.panel-heading',
                               'Genomic Range Filters' => '#lorisworkspace > div >'.
                                           'div:nth-child(2)> div > div > form>div'.
                                           '>div:nth-child(1)>div.form-group.col-sm'.
                                           '-5 > div > div.panel-heading',
                               'CpG Filters'           => '#lorisworkspace > div >'.
                                           ' div:nth-child(2) > div > div'.
                                           ' > form > div > div:nth-child(2) >'.
                                           ' div.form-group.col-sm-8 >'.
                                           ' div > div.panel-heading',
                              );
    // expect UIs for Files Tab
    private $_FilesUI = array(
                         'Genomic File Filters' => '#genomic_upload > div >'.
                             ' div.col-sm-10.col-md-8 > div > div.panel-heading',
                        );
    /**
      * Tests that, when loading the genomic_browser module, the
      * breadcrumb is 'Genomic browser' or an error is given according
      * to the user's permissions.
      *
      * @return void
      */
    function testGenomicBrowserWithoutPermission()
    {
         $this->setupPermissions(array());
         $this->safeGet($this->url . "/genomic_browser/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertContains("You do not have access to this page.", $bodyText);
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
             array(
              "genomic_browser_view_allsites",
              "genomic_browser_view_site",
             )
         );
         $this->safeGet($this->url . "/genomic_browser/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertNotContains("You do not have access to this page.", $bodyText);
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
        $this->_testPageUIs("/genomic_browser/", $this->_loadingProfilesUI);
        $this->_testPageUIs("/genomic_browser/gwas_browser/", $this->_loadingGWASUI);
        $this->_testPageUIs("/genomic_browser/snp_browser/", $this->_loadingSNPUI);
        $this->_testPageUIs("/genomic_browser/cpg_browser/", $this->_MethylationUI);
        $this->_testPageUIs(
            "/genomic_browser/genomic_file_uploader/",
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
        $this->safeGet($this->url . $url);
        foreach ($ui as $key => $value) {
            $text = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
            $this->assertContains($key, $text);
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
                  $this->assertContains($expectDataRows, $text);
    }
    /**
      * Tests that, when clicking the upload button,the upload window should show up
      *
      * @return void
      */
    function testUploadFile()
    {
        $this->safeGet($this->url . "/genomic_browser/genomic_file_uploader/");
        $this->safeFindElement(
            WebDriverBy::Name("upload")
        )->click();
        $value    = "#myModalLabel";
            $text = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
            $this->assertContains("Upload File", $text);
    }
}
