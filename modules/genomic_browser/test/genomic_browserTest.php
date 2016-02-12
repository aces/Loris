<?php
/**
 * Genomic_browser automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
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
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class GenomicBrowserTestIntegrationTest extends LorisIntegrationTest
{
    /* TODO
       - Does the dropdown "Display:" filter work? The "Summary fields"
         option should display a dozen columns in the data table.
         "All fields" should show many more columns.
       - Apply a Candidate or Gene filter, then click on a different
         tab (CNV/SNP). Verify that the filter still applies.
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
             'CNV_Description'
        );
    }

    /**
     * @before
     */ 
    public function insertData()
    {
        $this->DB->insert("candidate", array(
            'CandID' => '000001',
            'PSCID'  => 'TST9999',
            'CenterID' => 1,
            'Active' => 'Y',
            'UserID' => 1,
            'Entity_type' => 'Human'
        ));

        $this->DB->insert("psc", array("CenterID" => 2));

        $this->DB->insert("candidate", array(
            'CandID' => '000002',
            'PSCID'  => 'TST9998',
            'CenterID' => 2,
            'Active' => 'Y',
            'UserID' => 1,
            'Entity_type' => 'Human'
        ));

        $this->DB->insert("CNV", array(
            'CNVID' => 9999999999,
            'CandID' => '000001',
            'Description' => 'CNV 1',
            'Type' => 'gain',
            'EventName' => 'Event 1',
            'Common_CNV' => 'Y',
            'Characteristics' => 'Benign',
            'CopyNumChange' => 1,
            'Inheritance' => 'de novo',
            'ArrayReport' => 'Normal',
            'Markers' => 'Marker 1',
            'ArrayReportDetail' => 'Array report detail 1',
            'ValidationMethod' => 'Validation method 1'
        ));
        $this->DB->insert("CNV", array(
            'CNVID' => 9999999998,
            'CandID' => '000001',
            'Description' => 'CNV 2',
            'Type' => 'gain',
            'EventName' => 'Event 1',
            'Common_CNV' => 'Y',
            'Characteristics' => 'Benign',
            'CopyNumChange' => 1,
            'Inheritance' => 'de novo',
            'ArrayReport' => 'Normal',
            'Markers' => 'Marker 1',
            'ArrayReportDetail' => 'Array report detail 1',
            'ValidationMethod' => 'Validation method 1'
        ));
        $this->DB->insert("CNV", array(
            'CNVID' => 9999999997,
            'CandID' => '000001',
            'Description' => 'CNV 3',
            'Type' => 'gain',
            'EventName' => 'Event 1',
            'Common_CNV' => 'Y',
            'Characteristics' => 'Benign',
            'CopyNumChange' => 1,
            'Inheritance' => 'de novo',
            'ArrayReport' => 'Normal',
            'Markers' => 'Marker 1',
            'ArrayReportDetail' => 'Array report detail 1',
            'ValidationMethod' => 'Validation method 1'
        ));
        $this->DB->insert("CNV", array(
            'CNVID' => 9999999996,
            'CandID' => '000002',
            'Description' => 'CNV 4',
            'Type' => 'gain',
            'EventName' => 'Event 1',
            'Common_CNV' => 'Y',
            'Characteristics' => 'Benign',
            'CopyNumChange' => 1,
            'Inheritance' => 'de novo',
            'ArrayReport' => 'Normal',
            'Markers' => 'Marker 1',
            'ArrayReportDetail' => 'Array report detail 1',
            'ValidationMethod' => 'Validation method 1'
        ));
        $this->DB->insert("CNV", array(
            'CNVID' => 9999999995,
            'CandID' => '000002',
            'Description' => 'CNV 5',
            'Type' => 'loss',
            'EventName' => 'Event 1',
            'Common_CNV' => 'Y',
            'Characteristics' => 'Benign',
            'CopyNumChange' => 1,
            'Inheritance' => 'de novo',
            'ArrayReport' => 'Normal',
            'Markers' => 'Marker 1',
            'ArrayReportDetail' => 'Array report detail 1',
            'ValidationMethod' => 'Validation method 1'
        ));

        $this->DB->insert("SNP", array(
            'SNPID' => 9999999999,
            'CandID' => '000001',
            'rsID' => 'rs0000001'
        ));
        $this->DB->insert("SNP", array(
            'SNPID' => 9999999998,
            'CandID' => '000001',
            'rsID' => 'rs0000002'
        ));
        $this->DB->insert("SNP", array(
            'SNPID' => 9999999997,
            'CandID' => '000001',
            'rsID' => 'rs0000003'
        ));
        $this->DB->insert("SNP", array(
            'SNPID' => 9999999996,
            'CandID' => '000002',
            'rsID' => 'rs0000001'
        ));
        $this->DB->insert("SNP", array(
            'SNPID' => 9999999995,
            'CandID' => '000002',
            'rsID' => 'rs0000002'
        ));
    }

    /**
     * @after
     */ 
    public function deleteData()
    {
        $this->DB->delete("CNV", array("CNVID" => '9999999999'));
        $this->DB->delete("CNV", array("CNVID" => '9999999998'));
        $this->DB->delete("CNV", array("CNVID" => '9999999997'));
        $this->DB->delete("CNV", array("CNVID" => '9999999996'));
        $this->DB->delete("CNV", array("CNVID" => '9999999995'));
        $this->DB->delete("SNP", array("SNPID" => '9999999999'));
        $this->DB->delete("SNP", array("SNPID" => '9999999998'));
        $this->DB->delete("SNP", array("SNPID" => '9999999997'));
        $this->DB->delete("SNP", array("SNPID" => '9999999996'));
        $this->DB->delete("SNP", array("SNPID" => '9999999995'));
        $this->DB->delete("candidate", array('CandID' => '000001'));
        $this->DB->delete("candidate", array('CandID' => '000002'));
        $this->DB->delete("psc", array('CenterID' => 2));
    } 

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

    protected function onNotSuccessfulTest($exception)
    {
        $this->deleteData();
        throw $exception;
    }

    private function assertColumnSorting($header, $column_number, $asc_value, $desc_value)
    {
var_dump($column_number);
        // ASC sorting
        $header_link = $this->webDriver->findElement(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')]/thead/tr/th/a[text()='$header']
            ")
        ); 
        $this->clickToLoadNewPage($header_link);
        $body = $this->webDriver->findElement(
            WebDriverBy::xPath("//body")
        ); 
        $first_row_value = $body->findElement(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')]/tbody/tr[1]/td[$column_number]
            ")
        )->getText(); 
        $this->assertEquals($first_row_value, $asc_value);

        // DESC sorting
        $header_link = $this->webDriver->findElement(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')]/thead/tr/th/a[text()='$header']
            ")
        );
        $this->clickToLoadNewPage($header_link);
        $body = $this->webDriver->findElement(
            WebDriverBy::xPath("//body")
        ); 
        $first_row_value = $body->findElement(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')]/tbody/tr[1]/td[$column_number]
            ")
        )->getText();
        $this->assertEquals($first_row_value, $desc_value);
    }

    protected function assertFiltering($filter, $value, $count)
    {
        $this->webDriver->findElement(
            WebDriverBy::Name($filter)
        )->sendKeys("$value");

        $this->webDriver->findElement(
            WebDriverBy::xPath("
                //input[@name='filter']
            ")
        )->click();

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();

        $this->webDriver->findElement(
            WebDriverBy::xPath("
                //input[@name='reset']
            ")
        )->click();

        $this->assertEquals("Variants found: $count total", $message);
    }


    /**
     * Tests that, when loading the genomic_browser module, the
     * breadcrumb is 'Genomic browser'.
     *
     * @return void
     */
/*----
    function testGenomicBrowserDoespageLoad()
    {
        $this->webDriver->get($this->url . "/genomic_browser/");

        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@class='page-content inset']
                /div
                /a
                /label
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
/*----
    function testGenomicBrowserDoespageLoadPermissions()
    {

        // Without permissions
        $this->setupPermissions(array(''));
        $this->webDriver->navigate()->refresh();
        $this->webDriver->get($this->url . "/genomic_browser/");
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
        $this->webDriver->get($this->url . "/genomic_browser/");
        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@class='page-content inset']
                /div
                /a
                /label
            "
            )
        )->getText();
        $this->assertEquals("Genomic Browser", $breadcrumbText);

        // With permission genomic_browser_view_allsites
        $this->setupPermissions(array('genomic_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->webDriver->get($this->url . "/genomic_browser/");
        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::xPath(
                "
                //div[@class='page-content inset']
                /div
                /a
                /label
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
/*----
    public function testConfigurationMenuDisplayWithPermissions()
    {
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
/*----
    function testGenomicBrowserCNVBrowserDoespageLoad()
    {
        $this->webDriver->get($this->url . "/genomic_browser/");

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
/*----
    function testGenomicBrowserCNVEmptyDatatable()
    {
        $this->deleteData();
        $this->webDriver->get($this->url . "/genomic_browser/");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();
        $this->assertEquals("No variants found.", $message);

        $rows = $this->webDriver->findElements(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')//tr]
            ")
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
/*----
    function testGenomicBrowserCNVDatatable()
    {
        $this->webDriver->get($this->url . "/genomic_browser/");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();
        $this->assertEquals("Variants found: 5 total", $message);
        $rows = $this->webDriver->findElements(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')]/tbody/tr
            ")
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
/*----
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

        $this->webDriver->get($this->url . "/genomic_browser/");

        $headers = $this->webDriver->findElements(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')]/thead/tr/th
            ")
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
                    $this->assertColumnSorting($header, $index+1, '000001', '000002');
                    break;
                case 'PSCID':
                    $this->assertColumnSorting($header, $index+1, 'TST9998', 'TST9999');
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
/*----
    function testGenomicBrowserCNVSitePermission()
    {
        $this->setupPermissions(array('genomic_browser_view_site'));
        $this->webDriver->get($this->url . "/genomic_browser/");

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
/*----
    function testGenomicBrowserCNVFilters()
    {

        $this->webDriver->get($this->url . "/genomic_browser/");
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
     * Tests that, when loading the genomic_browser module
     *   > snp_browser submenu, the active tab text is SNP.
     *
     * @depends testGenomicBrowserDoespageLoad
     *
     * @return void
     */
/*----
    function testGenomicBrowserSNPBrowserDoespageLoad()
    {
        $this->webDriver->get($this->url . "/genomic_browser/?submenu=snp_browser");

        $tabText = $this->webDriver->findElement(
            WebDriverBy::xPath("
                //div[@id='tabs']
                /ul
                /li[contains(@class, 'active')]
            ")
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
/*----
    function testGenomicBrowserSNPEmptyDatatable()
    {
        $this->deleteData();
        $this->webDriver->get($this->url . "/genomic_browser/?submenu=snp_browser");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();
        $this->assertEquals("No variants found.", $message);

        $rows = $this->webDriver->findElements(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')//tr]
            ")
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
/*----
    function testGenomicBrowserSNPDatatable()
    {
        $this->webDriver->get($this->url . "/genomic_browser/");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();
        $this->assertEquals("Variants found: 5 total", $message);
        $rows = $this->webDriver->findElements(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')]/tbody/tr
            ")
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
/*----
    function testGenomicBrowserSNPSitePermission()
    {
        $this->setupPermissions(array('genomic_browser_view_site'));
        $this->webDriver->get($this->url . "/genomic_browser/?submenu=snp_browser");

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();

        $this->resetPermissions();
        $this->assertEquals("Variants found: 3 total", $message);
    }
//*/

    /**
     * Tests that, SNP data is sortable in the Dynamictable.
     *
     * @********************************** depends testGenomicBrowserSNPDatatable
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
            'Function Prediction'
        );

        $this->webDriver->get($this->url . "/genomic_browser/?submenu=snp_browser");
        $headers = $this->webDriver->findElements(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')]/thead/tr/th
            ")
        );

        $this->assertCount(
            count($expected_headers), 
            $headers, 
            "There should be " . count($expected_headers) . " columns in the table."
        );

        foreach ($expected_headers as $index => $header) {
//            $this->webDriver->get($this->url . "/genomic_browser/?submenu=snp_browser");
            switch ($header) {
                case 'No.':
                    break;
                case 'DCCID':
                    $this->assertColumnSorting($header, $index+1, '000001', '000002');
                    break;
                case 'PSCID':
                    $this->assertColumnSorting($header, $index+1, 'TST9998', 'TST9999');
                    break;
                case 'RsID':
                    $this->assertColumnSorting($header, $index+1, 'rs0000001', 'rs0000003');
                    break;
        //TODO : Add more cases...
            }
        }
    }


}
?>
