<?php
/**
 * imaging_browser automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class imagingBrowserTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the imaging_browser module, some
     * text appears in the body.
     *
     * @return void
     */
    function testImagingBrowserDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=imaging_browser");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Imaging Browser", $bodyText);
    }

    /**
     * Tests that, when loading the imaging_browser module > viewSession subtest, some
     * text appears in the body.
     *
     * @return void
     */
    function testImagingBrowserViewSessionDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=imaging_browser&subtest=viewSession");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("View Session", $bodyText);
    }
}
?>