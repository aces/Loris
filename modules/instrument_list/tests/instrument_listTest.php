<?php
/**
 * Instrument_list automated integration tests
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
class instrumentListTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Instrument list module, some
     * text appears in the body.
     *
     * @return void
     */
    function testInstrumentListDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=instrument_list");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("instrument_list", $bodyText);
    }
}
?>