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
     * breadcrumb is 'Genomic browser'.
     *
     * @return void
     */
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
    public function testConfigurationMenuDisplayWithPermissions()
    {
        // Without permissions
        $this->setupPermissions(array(''));
        $this->webDriver->navigate()->refresh();
        $this->assertFalse(
            $this->assertMenuItemPresent('Tools', 'Genomic Browser'),
            "Menu item shoudn't be there."
        );

        // With permission genomic_browser_view_site
        $this->setupPermissions(array('genomic_browser_view_site'));
        $this->webDriver->navigate()->refresh();
        $this->assertTrue(
            $this->assertMenuItemPresent('Tools', 'Genomic Browser'),
            "Menu item missing."
        );

        // With permission genomic_browser_view_allsites
        $this->setupPermissions(array('genomic_browser_view_allsites'));
        $this->webDriver->navigate()->refresh();
        $this->assertTrue(
            $this->assertMenuItemPresent('Tools', 'Genomic Browser'),
            "Menu item missing."
        );
    }

    /**
     * Tests that, when loading the genomic_browser module
     * default submenu, the active tab text is CNV.
     *
     * @return void
     */
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
     * @return void
     */
    function testGenomicBrowserSNPBrowserDoespageLoad()
    {
        $this->webDriver->get(
            $this->url . "?test_name=genomic_browser&submenu=snp_browser"
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

        $this->assertEquals("SNP", $tabText);
    }

}
?>
