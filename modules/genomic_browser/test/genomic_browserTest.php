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
    /**
     * Tests that, when loading the genomic_browser module, some
     * text appears in the body.
     *
     * @return void
     */
    function testGenomicBrowserDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=genomic_browser");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Genomic Browser", $bodyText);
    }

    /**
     * Tests that, when loading the genomic_browser module
     *   > snp_browser submenu, some
     * text appears in the body.
     *
     * @return void
     */
    function testGenomicBrowserSnpBrowserDoespageLoad()
    {
        $this->webDriver
            ->get($this->url . "?test_name=genomic_browser&submenu=snp_browser");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Genomic Browser", $bodyText);
    }

}
?>