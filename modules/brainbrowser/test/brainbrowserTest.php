<?php
/**
 * Brainbrowser automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/"
    . "LorisIntegrationTest.class.inc";

/**
 * Implements automated integration tests for BrainBrowser within Loris
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class BrainBrowserTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Brainbrowser module, some
     * text appears in the body.
     *
     * @return void
     */
    function testBrainbrowserDoespageLoad()
    {
        $this->safeGet($this->url . "/brainbrowser/?minc_id=[]");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Brainbrowser", $bodyText);
    }
}

