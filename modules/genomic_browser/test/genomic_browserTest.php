<?php
/**
 * Genomic_browser automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Xavier Lecours <xavier.lecoursboucher@mcgill.ca>
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
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Xavier Lecours <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class GenomicBrowserTestIntegrationTest extends LorisIntegrationTest
{

    /**
     * Provide a list of the CNV form filters
     *
     * @return array The filters list
    */
    private function _getCNVFilters()
    {
        return array(
                'centerID',
                'SubprojectID',
                'DCCID',
                'gender',
                'External_ID',
                'PSCID',
                'Gene_Symbol',
                'Gene_Name',
                'Chromosome',
                'Platform',
                'CNV_Type',
                'Event_Name',
                'Characteristics',
                'Common_CNV',
                'Copy_Num_Change',
                'Inheritance',
                'CNV_Description',
               );
    }

    /**
     * Provide a list of the SNP form filters
     *
     * @return array The filters list
    */
    private function _getSNPFilters()
    {
        return array(
                'centerID',
                'DCCID',
                'PSCID',
                'gender',
                'SubprojectID',
                'dob',
                'External_ID',
                'rsID',
                'SNP_Name',
                'SNP_Description',
                'SNP_External_Source',
                'Allele_A',
                'Allele_B',
                'Reference_Base',
                'Minor_Allele',
                'Array_Report',
                'Markers',
                'Validation_Method',
                'Validated',
                'Function_Prediction',
                'Damaging',
                'Genotype_Quality',
                'Exonic_Function',
                'Chromosome',
                'Gene_Symbol',
                'Platform',
               );
    }

    /**
     * The data insertion function to be run before each test.
     *
     * @before
     * @return void
     */
    public function insertData()
    {
        $this->DB->insert(
            "candidate",
            array(
             'CandID'      => '000771',
             'PSCID'       => 'TST9779',
             'CenterID'    => 1,
             'Active'      => 'Y',
             'UserID'      => 1,
             'Entity_type' => 'Human',
            )
        );

        $this->DB->insert("psc", array("CenterID" => 92));

        $this->DB->insert(
            "candidate",
            array(
             'CandID'      => '000772',
             'PSCID'       => 'TST9778',
             'CenterID'    => 92,
             'Active'      => 'Y',
             'UserID'      => 1,
             'Entity_type' => 'Human',
            )
        );

        $this->DB->insert(
            "CNV",
            array(
             'CNVID'             => 9999999999,
             'CandID'            => '000771',
             'Description'       => 'CNV 1',
             'Type'              => 'gain',
             'EventName'         => 'Event 1',
             'Common_CNV'        => 'Y',
             'Characteristics'   => 'Benign',
             'CopyNumChange'     => 1,
             'Inheritance'       => 'de novo',
             'ArrayReport'       => 'Normal',
             'Markers'           => 'Marker 1',
             'ArrayReportDetail' => 'Array report detail 1',
             'ValidationMethod'  => 'Validation method 1',
            )
        );
        $this->DB->insert(
            "CNV",
            array(
             'CNVID'             => 9999999998,
             'CandID'            => '000771',
             'Description'       => 'CNV 2',
             'Type'              => 'gain',
             'EventName'         => 'Event 1',
             'Common_CNV'        => 'Y',
             'Characteristics'   => 'Benign',
             'CopyNumChange'     => 1,
             'Inheritance'       => 'de novo',
             'ArrayReport'       => 'Normal',
             'Markers'           => 'Marker 1',
             'ArrayReportDetail' => 'Array report detail 1',
             'ValidationMethod'  => 'Validation method 1',
            )
        );
        $this->DB->insert(
            "CNV",
            array(
             'CNVID'             => 9999999997,
             'CandID'            => '000771',
             'Description'       => 'CNV 3',
             'Type'              => 'gain',
             'EventName'         => 'Event 1',
             'Common_CNV'        => 'Y',
             'Characteristics'   => 'Benign',
             'CopyNumChange'     => 1,
             'Inheritance'       => 'de novo',
             'ArrayReport'       => 'Normal',
             'Markers'           => 'Marker 1',
             'ArrayReportDetail' => 'Array report detail 1',
             'ValidationMethod'  => 'Validation method 1',
            )
        );
        $this->DB->insert(
            "CNV",
            array(
             'CNVID'             => 9999999996,
             'CandID'            => '000772',
             'Description'       => 'CNV 4',
             'Type'              => 'gain',
             'EventName'         => 'Event 1',
             'Common_CNV'        => 'Y',
             'Characteristics'   => 'Benign',
             'CopyNumChange'     => 1,
             'Inheritance'       => 'de novo',
             'ArrayReport'       => 'Normal',
             'Markers'           => 'Marker 1',
             'ArrayReportDetail' => 'Array report detail 1',
             'ValidationMethod'  => 'Validation method 1',
            )
        );
        $this->DB->insert(
            "CNV",
            array(
             'CNVID'             => 9999999995,
             'CandID'            => '000772',
             'Description'       => 'CNV 5',
             'Type'              => 'loss',
             'EventName'         => 'Event 1',
             'Common_CNV'        => 'Y',
             'Characteristics'   => 'Benign',
             'CopyNumChange'     => 1,
             'Inheritance'       => 'de novo',
             'ArrayReport'       => 'Normal',
             'Markers'           => 'Marker 1',
             'ArrayReportDetail' => 'Array report detail 1',
             'ValidationMethod'  => 'Validation method 1',
            )
        );

        $this->DB->insert(
            "SNP",
            array(
             'SNPID' => 9999999999,
             'rsID'  => 'rs0000001',
            )
        );
        $this->DB->insert(
            "SNP",
            array(
             'SNPID' => 9999999998,
             'rsID'  => 'rs0000002',
            )
        );
        $this->DB->insert(
            "SNP",
            array(
             'SNPID' => 9999999997,
             'rsID'  => 'rs0000003',
            )
        );
        $this->DB->insert(
            "SNP",
            array(
             'SNPID' => 9999999996,
             'rsID'  => 'rs0000001',
            )
        );
        $this->DB->insert(
            "SNP",
            array(
             'SNPID' => 9999999995,
             'rsID'  => 'rs0000002',
            )
        );

        $this->DB->insert(
            "SNP_candidate_rel",
            array(
             'SNPID'  => 9999999999,
             'CandID' => '000771',
            )
        );

        $this->DB->insert(
            "SNP_candidate_rel",
            array(
             'SNPID'  => 9999999998,
             'CandID' => '000771',
            )
        );

        $this->DB->insert(
            "SNP_candidate_rel",
            array(
             'SNPID'  => 9999999997,
             'CandID' => '000771',
            )
        );

        $this->DB->insert(
            "SNP_candidate_rel",
            array(
             'SNPID'  => 9999999999,
             'CandID' => '000772',
            )
        );

        $this->DB->insert(
            "SNP_candidate_rel",
            array(
             'SNPID'  => 9999999998,
             'CandID' => '000772',
            )
        );

    }

    /**
     * The data deletion function to be run after each test.
     *
     * @after
     * @return void
     */
    public function deleteData()
    {
        $this->DB->delete("CNV", array("CNVID" => '9999999999'));
        $this->DB->delete("CNV", array("CNVID" => '9999999998'));
        $this->DB->delete("CNV", array("CNVID" => '9999999997'));
        $this->DB->delete("CNV", array("CNVID" => '9999999996'));
        $this->DB->delete("CNV", array("CNVID" => '9999999995'));
        $this->DB->delete("SNP_candidate_rel", array("SNPID" => '9999999999'));
        $this->DB->delete("SNP_candidate_rel", array("SNPID" => '9999999998'));
        $this->DB->delete("SNP_candidate_rel", array("SNPID" => '9999999997'));
        $this->DB->delete("SNP", array("SNPID" => '9999999999'));
        $this->DB->delete("SNP", array("SNPID" => '9999999998'));
        $this->DB->delete("SNP", array("SNPID" => '9999999997'));
        $this->DB->delete("SNP", array("SNPID" => '9999999996'));
        $this->DB->delete("SNP", array("SNPID" => '9999999995'));
        $this->DB->delete("candidate", array('CandID' => '000771'));
        $this->DB->delete("candidate", array('CandID' => '000772'));
        $this->DB->delete("psc", array('CenterID' => 92));
    }

    /**
     * An helper function to ensure the new page is load after a click.
     *
     * @param WebDriverElement $webDriverElement the element to click.
     *
     * @return void
     */
    public function clickToLoadNewPage($webDriverElement)
    {
        $webDriverElement->click();
        try {
            while (true) {
                $webDriverElement->getText();
            }
        } catch (StaleElementReferenceException $e) {
            return;
        }
    }

    /**
     * Helper function to assert the culumn content is sorted
     * upon click on the header.
     *
     * @param string $header     The header label
     * @param int    $col_number The column index (1 based)
     * @param string $asc        The expected value on ascending sort
     * @param string $desc       The expected value on descending sort
     *
     * @return void
     */
    public function assertColumnSorting($header, $col_number, $asc, $desc)
    {

        // ASC sorting
        $header_link = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /thead
                /tr
                /th
                /a[text()='$header']
            "
            )
        );
        $this->clickToLoadNewPage($header_link);
        $body            = $this->webDriver->findElement(
            WebDriverBy::xPath("//body")
        );
        $first_row_value = $body->findElement(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /tbody
                /tr[1]
                /td[$col_number]
            "
            )
        )->getText();
        $this->assertEquals($first_row_value, $asc);

        // DESC sorting
        $header_link = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /thead
                /tr
                /th
                /a[text()='$header']
            "
            )
        );
        $this->clickToLoadNewPage($header_link);
        $body            = $this->webDriver->findElement(
            WebDriverBy::xPath("//body")
        );
        $first_row_value = $body->findElement(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /tbody
                /tr[1]
                /td[$col_number]
            "
            )
        )->getText();
        $this->assertEquals($first_row_value, $desc);
    }

    /**
     * Helper function to assert data filtering.
     *
     * @param string $filter The name of the filter element
     * @param string $value  The value to be inputed
     * @param int    $count  the expected count of results in the datatable
     *
     * @return void
     */
    protected function assertFiltering($filter, $value, $count)
    {
        $this->webDriver->findElement(
            WebDriverBy::Name($filter)
        )->sendKeys("$value");

        $button = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //input[@name='filter']
            "
            )
        );
        $this->clickToLoadNewPage($button);

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();

        $button = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //input[@name='reset']
            "
            )
        );
        $this->clickToLoadNewPage($button);

        // Updated:
        $this->assertEquals("Profiles found: $count total", $message);
        // CNV tab: $this->assertEquals("Variants found: $count total", $message);
    }


    /**
     * Tests that, when loading the genomic_browser module, the
     * breadcrumb is 'Genomic browser'.
     *
     * @return void
     */
    function testGenomicBrowserDoespageLoad()
    {
        $this->markTestIncomplete(
            'Test should be updated for new main genomic browser tab.'
        );

        $this->safeGet($this->url . "/genomic_browser/");

        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@id='breadcrumbs']
                /div
                /div
                /div
                /a[2]
                /div
            "
            )
        )->getText();
        $this->assertEquals("Genomic Browser", $breadcrumbText);
    }

    /**
     * Tests that, when loading the genomic_browser module, the
     * breadcrumb is 'Genomic browser' or an error is given according
     * to the user's permissions.
     *
     * @depends testGenomicBrowserDoespageLoad
     *
     * @return void
     */
    function testGenomicBrowserDoespageLoadPermissions()
    {

        // Without permissions
        $this->setupPermissions(array(''));
        $this->webDriver->navigate()->refresh();
        $this->safeGet($this->url . "/genomic_browser/");
        $errorText = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@class='page-content inset']
                /div
                /ul
                /li
                /strong
            "
            )
        )->getText();
        $this->assertEquals(
            "You do not have access to this page.",
            $errorText,
            "Error message don't fit"
        );

        // With permission genomic_browser_view_site
        $this->setupPermissions(array('genomic_browser_view_site'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet($this->url . "/genomic_browser/");
        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@id='breadcrumbs']
                /div
                /div
                /div
                /a[2]
                /div
            "
            )
        )->getText();
        $this->assertEquals("Genomic Browser", $breadcrumbText);

        // With permission genomic_browser_view_allsites
        $this->setupPermissions(array('genomic_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->safeGet($this->url . "/genomic_browser/");
        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@id='breadcrumbs']
                /div
                /div
                /div
                /a[2]
                /div
            "
            )
        )->getText();
        $this->assertEquals("Genomic Browser", $breadcrumbText);

    }

    /**
     * Verify that Genomic module appears in Tool main menu only
     * if the user has permission "config".
     *
     * @return void
     */
    public function testConfigurationMenuDisplayWithPermissions()
    {
        $this->markTestIncomplete(
            'Test should be updated for new main genomic browser tab.'
        );

        // Without permissions
        $this->setupPermissions(array(''));
        $this->webDriver->navigate()->refresh();
        $this->assertFalse(
            $this->isMenuItemPresent('Tools', 'Genomic Browser'),
            "Menu item shoudn't be there."
        );

        // With permission genomic_browser_view_site
        $this->setupPermissions(array('genomic_browser_view_site'));
        $this->webDriver->navigate()->refresh();
        $this->assertTrue(
            $this->isMenuItemPresent('Tools', 'Genomic Browser'),
            "Menu item missing."
        );

        // With permission genomic_browser_view_allsites
        $this->setupPermissions(array('genomic_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->assertTrue(
            $this->isMenuItemPresent('Tools', 'Genomic Browser'),
            "Menu item missing."
        );
    }

    /**
     * Tests that, when loading the genomic_browser module
     * default submenu, the active tab text is CNV.
     *
     * @depends testGenomicBrowserDoespageLoad
     *
     * @return void
     */
    function testGenomicBrowserCNVBrowserDoespageLoad()
    {
        $this->markTestIncomplete(
            'Test should be updated for new main genomic browser tab.'
        );

        $this->safeGet($this->url . "/genomic_browser/?submenu=cnv_browser");

        $tabText = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@id='tabs']
                /ul
                /li[contains(@class, 'active')]
            "
            )
        )->getText();

        $this->assertEquals("CNV", $tabText);
    }

    /**
     * Tests that, a message is displayed when there is no data
     * in the CNV table.
     *
     * @depends testGenomicBrowserDoespageLoad
     *
     * @return void
     */
    function testGenomicBrowserCNVEmptyDatatable()
    {
        $this->deleteData();
        $this->safeGet($this->url . "/genomic_browser/?submenu=cnv_browser");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();
        $this->assertEquals("No variants found.", $message);

        $rows = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /tbody
                /tr
            "
            )
        );
        $this->assertCount(0, $rows, "");
    }

    /**
     * Tests that, CNV data is presented in the dynamictable.
     *
     * @depends testGenomicBrowserCNVEmptyDatatable
     *
     * @return void
     */
    function testGenomicBrowserCNVDatatable()
    {
        $this->safeGet($this->url . "/genomic_browser/?submenu=cnv_browser");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();
        $this->assertEquals("Variants found: 5 total", $message);
        $rows = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /tbody
                /tr
            "
            )
        );

        $this->assertCount(5, $rows, "There should be 5 records in the table.");
    }

    /**
     * Tests that, CNV data is sortable in the Dynamictable.
     *
     * @depends testGenomicBrowserCNVDatatable
     *
     * @return void
     */
    function testGenomicBrowserCNVDataSortableBrief()
    {
        $expected_headers = array(
                             'No.',
                             'DCCID',
                             'PSCID',
                             'Subproject',
                             'Chromosome',
                             'StartLoc',
                             'Size',
                             'Gene Name',
                             'Platform',
                             'CNV Type',
                             'CNV Description',
                             'Copy Num Change',
                             'Common CNV',
                            );

        $this->safeGet($this->url . "/genomic_browser/?submenu=cnv_browser");

        $headers = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /thead
                /tr
                /th
            "
            )
        );

        $this->assertCount(
            count($expected_headers),
            $headers,
            "There should be " . count($expected_headers) . " columns in the table."
        );

        foreach ($expected_headers as $index => $header) {
            switch ($header) {
            case 'No.':
                break;
            case 'DCCID':
                $this->assertColumnSorting($header, $index+1, '000771', '000772');
                break;
            case 'PSCID':
                $this->assertColumnSorting($header, $index+1, 'TST9778', 'TST9779');
                break;
            case 'CNV Type':
                $this->assertColumnSorting($header, $index+1, 'gain', 'loss');
                break;
            case 'CNV Description':
                $this->assertColumnSorting($header, $index+1, 'CNV 1', 'CNV 5');
                break;
            //TODO : Add more cases...
            }
        }
    }

    /**
     * Tests that, CNV data is displayed according to user's permissions
     *
     * @depends testGenomicBrowserCNVDatatable
     *
     * @return void
     */
    function testGenomicBrowserCNVSitePermission()
    {
        $this->setupPermissions(array('genomic_browser_view_site'));
        $this->safeGet($this->url . "/genomic_browser/?submenu=cnv_browser");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();

        $this->resetPermissions();
        $this->assertEquals("Variants found: 3 total", $message);
    }

    /**
     * Tests that, "Show data" button apply filters.
     *
     * @depends testGenomicBrowserCNVDatatable
     *
     * @return void
     */
    function testGenomicBrowserCNVFilters()
    {

        $this->safeGet($this->url . "/genomic_browser/?submenu=cnv_browser");
        $filters = $this->_getCNVFilters();

        foreach ($filters as $filter) {
            switch ($filter) {
            case 'CNV_Type':
                $this->assertFiltering($filter, 'loss', 1);
                break;
            case 'CNV_Description':
                $this->assertFiltering($filter, 'CNV 2', 1);
                break;
            }
        }
    }

    /**
     * Tests that, CNV 'Show brief fields' filter works.
     *
     * Note: the brief fields option should have been tested in
     * testGenomicBrowserCVNDataSortableBrief
     *
     * @-depends testGenomicBrowserCNVDatatable
     *
     * @return void
     */
    function testGenomicBrowserCNVShowBriefFields()
    {
        $this->markTestIncomplete(
            'Test should be updated for new main genomic browser tab.'
        );

        $expected_headers = array(
                             'No.',
                             'PSC',
                             'DCCID',
                             'PSCID',
                             'Gender',
                             'Subproje',
                             'DoB',
                             'ExternalID',
                             'Chromosome',
                             'Strand',
                             'StartLoc',
                             'EndLoc',
                             'Size',
                             'Gene Symbol',
                             'Gene Name',
                             'Platform',
                             'CNV Type',
                             'CNV Description',
                             'Copy Num Change',
                             'Event Name',
                             'Common CNV',
                             'Characteristics',
                             'Inheritance',
                             'Array Report',
                             'Markers',
                             'Validation Method',
                            );

        $this->safeGet($this->url . "/genomic_browser/?submenu=cnv_browser");

        // Apply filter
        $this->webDriver->findElement(
            WebDriverBy::Name('Show_Brief_Results')
        )->sendKeys("All fields");

        $button = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //input[@name='filter']
            "
            )
        );

        $this->clickToLoadNewPage($button);

        // Check column count
        $this->safeGet($this->url . "/genomic_browser/?submenu=cnv_browser");
        $headers = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /thead
                /tr
                /th
            "
            )
        );

        $this->assertCount(
            count($expected_headers),
            $headers,
            "There should be " . count($expected_headers) . " columns in the table."
        );

    }

    /**
     * Tests that, when loading the genomic_browser module
     *   > snp_browser submenu, the active tab text is SNP.
     *
     * @depends testGenomicBrowserDoespageLoad
     *
     * @return void
     */
    function testGenomicBrowserSNPBrowserDoespageLoad()
    {
        $this->safeGet($this->url . "/genomic_browser/?submenu=snp_browser");

        $tabText = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@id='tabs']
                /ul
                /li[contains(@class, 'active')]
            "
            )
        )->getText();

        $this->assertEquals("SNP", $tabText);
    }

    /**
     * Tests that, a message is displayed when there is no data
     * in the CNV table.
     *
     * @depends testGenomicBrowserSNPBrowserDoespageLoad
     *
     * @return void
     */
    function testGenomicBrowserSNPEmptyDatatable()
    {
        $this->deleteData();
        $this->safeGet($this->url . "/genomic_browser/?submenu=snp_browser");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();
        $this->assertEquals("No variants found.", $message);

        $rows = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /tbody
                /tr
            "
            )
        );
        $this->assertCount(0, $rows, "");
    }

    /**
     * Tests that, CNV data is presented in the dynamictable.
     *
     * @depends testGenomicBrowserSNPEmptyDatatable
     *
     * @return void
     */
    function testGenomicBrowserSNPDatatable()
    {
        $this->safeGet($this->url . "/genomic_browser/?submenu=snp_browser");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();
        $this->assertEquals("Variants found: 5 total", $message);
        $rows = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /tbody
                /tr
            "
            )
        );

        $this->assertCount(5, $rows, "There should be 5 records in the table.");
    }

    /**
     * Tests that, SNP data is displayed according to user's permissions
     *
     * @depends testGenomicBrowserSNPDatatable
     *
     * @return void
     */
    function testGenomicBrowserSNPSitePermission()
    {
        $this->setupPermissions(array('genomic_browser_view_site'));
        $this->safeGet($this->url . "/genomic_browser/?submenu=snp_browser");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();

        $this->resetPermissions();
        $this->assertEquals("Variants found: 3 total", $message);
    }

    /**
     * Tests that, SNP data is sortable in the Dynamictable.
     *
     * @depends testGenomicBrowserSNPDatatable
     *
     * @return void
     */
    function testGenomicBrowserSNPDataSortableBrief()
    {
        $expected_headers = array(
                             'No.',
                             'DCCID',
                             'PSCID',
                             'Subproject',
                             'Chromosome',
                             'StartLoc',
                             'Gene Name',
                             'Platform',
                             'RsID',
                             'SNP Name',
                             'SNP Description',
                             'Function Prediction',
                            );

        $this->safeGet($this->url . "/genomic_browser/?submenu=snp_browser");
        $headers = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /thead
                /tr
                /th
            "
            )
        );

        $this->assertCount(
            count($expected_headers),
            $headers,
            "There should be " . count($expected_headers) . " columns in the table."
        );

        foreach ($expected_headers as $i => $header) {
            switch ($header) {
            case 'No.':
                break;
            case 'DCCID':
                $this->assertColumnSorting($header, $i+1, '000771', '000772');
                break;
            case 'PSCID':
                $this->assertColumnSorting($header, $i+1, 'TST9778', 'TST9779');
                break;
            case 'RsID':
                $this->assertColumnSorting($header, $i+1, 'rs0000001', 'rs0000003');
                break;
            //TODO : Add more cases...
            }
        }
    }

    /**
     * Tests that, "Show data" button apply filters.
     *
     * @depends testGenomicBrowserSNPDatatable
     *
     * @return void
     */
    function testGenomicBrowserSNPFilters()
    {

        $this->safeGet($this->url . "/genomic_browser/?submenu=snp_browser");
        $filters = $this->_getSNPFilters();

        foreach ($filters as $filter) {
            switch ($filter) {
            case 'rsID':
                $this->assertFiltering($filter, 'rs0000002', 2);
                break;
            }
        }
    }

    /**
     * Tests that, SNP 'Show brief fields' filter works.
     *
     * Note: the brief fields option should have been tested in
     * testGenomicBrowserSNPDataSortableBrief
     *
     * @-depends testGenomicBrowserSNPDatatable
     *
     * @return void
     */
    function testGenomicBrowserSNPShowBriefFields()
    {
        $this->markTestIncomplete(
            'Test should be updated for new main genomic browser tab.'
        );

        $expected_headers = array(
                             'No.',
                             'PSC',
                             'DCCID',
                             'PSCID',
                             'Gender',
                             'Subproject',
                             'DoB',
                             'ExternalID',
                             'Chromosome',
                             'Strand',
                             'StartLoc',
                             'EndLoc',
                             'Size',
                             'Gene Symbol',
                             'Gene Name',
                             'Platform',
                             'RsID',
                             'SNP Name',
                             'SNP Description',
                             'External Source',
                             'Minor Allele',
                             'Reference Base',
                             'Allele A',
                             'Allele B',
                             'Array Report',
                             'Markers',
                             'Validation Method',
                             'Validated',
                             'Function Prediction',
                             'Damaging',
                             'Genotype Quality',
                             'Exonic Function',
                            );

        $this->safeGet($this->url . "/genomic_browser/?submendu=snp_browser");

        // Apply filter
        $this->webDriver->findElement(
            WebDriverBy::Name('Show_Brief_Results')
        )->sendKeys("All fields");

        $button = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //input[@name='filter']
            "
            )
        );

        $this->clickToLoadNewPage($button);

        // Check column count
        $this->safeGet($this->url . "/genomic_browser/?submenu=snp_browser");
        $headers = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //div[@id='lorisworkspace']
                //table[contains(@class, 'dynamictable')]
                /thead
                /tr
                /th
            "
            )
        );

        $this->assertCount(
            count($expected_headers),
            $headers,
            "There should be " . count($expected_headers) . " columns in the table."
        );

    }
}
?>
