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
           - missing tests
               - Verify that module loads only data from user\'s
                 own site unless they have genomic_browser_view_allsites
                 permission.
               *** for each tab ***
               - Do the table columns sort upon clicking on the column headers
               - Test all filters. Does the "Show data" button apply filters
                 correctly.
               - Does the "Clear Form" button reset all filters
                 (except for user-site filter)
               - Does the dropdown "Display:" filter work? The "Summary fields"
                 option should display a dozen columns in the data table.
                 "All fields" should show many more columns.
               - Apply a Candidate or Gene filter, then click on a different
                 tab (CNV/SNP). Verify that the filter still applies.

    */

    /**
     * Tests that, when loading the genomic_browser module, the
     * breadcrumb is 'Genomic browser'.
     *
     * @return void
     */
/*----
    function testGenomicBrowserDoespageLoad()
    {
        $this->webDriver->get(
            $this->url . "?test_name=genomic_browser"
        );

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
        $this->webDriver->get($this->url . "?test_name=genomic_browser");
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
        $this->webDriver->get(
            $this->url . "?test_name=genomic_browser"
        );
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
        $this->webDriver->get(
            $this->url . "?test_name=genomic_browser"
        );
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
        $this->webDriver->get(
            $this->url . "?test_name=genomic_browser"
        );

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
        $this->webDriver->get(
            $this->url . "?test_name=genomic_browser&submenu=snp_browser"
        );

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
     * @depends testGenomicBrowserDoespageLoad
     *
     * @return void
     */
//*----
    function testGenomicBrowserCNVEmptyDatatable()
    {
        $this->_deleteCNVdata();

        $this->webDriver->get(
            $this->url . "?test_name=genomic_browser"
        );

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

    private function _insertCandidates()
    {
        $this->DB->insert("candidate", array(
            'CandID' => '000001',
            'PSCID'  => 'TST9999',
            'CenterID' => 1,
            'Active' => 'Y',
            'UserID' => 1,
            'Entity_type' => 'Human'
        ));

        $this->DB->insert("candidate", array(
            'CandID' => '000002',
            'PSCID'  => 'TST9998',
            'CenterID' => 1,
            'Active' => 'Y',
            'UserID' => 1,
            'Entity_type' => 'Human'
        ));
    }

    private function _insertCNVdata()
    {
        $this->_insertCandidates();

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
    }

    private function _deleteCNVdata()
    {
        $this->DB->delete("CNV", array("CNVID" => '9999999999'));
        $this->DB->delete("CNV", array("CNVID" => '9999999998'));
        $this->DB->delete("CNV", array("CNVID" => '9999999997'));
        $this->DB->delete("CNV", array("CNVID" => '9999999996'));
        $this->DB->delete("CNV", array("CNVID" => '9999999995'));
        $this->DB->delete("candidate", array('CandID' => '000001'));
        $this->DB->delete("candidate", array('CandID' => '000002'));
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
        $this->_deleteCNVdata();
        $this->_insertCNVdata();

        $this->webDriver->get(
            $this->url . "?test_name=genomic_browser"
        );

        $message = $this->webDriver->findElement(
            WebDriverBy::id("LogEntries")
        )->getText();
        $this->assertEquals("Variants found: 5 total", $message);
sleep(20);
        $rows = $this->webDriver->findElements(
            WebDriverBy::xPath("
                //div[@id='lorisworkspace']//table[contains(@class, 'dynamictable')//tr]
            ")
        );

        $this->assertCount(5, $rows, "");

        $this->_deleteCNVdata();
    }
}
?>
