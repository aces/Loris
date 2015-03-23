<?php
/**
 * Reliability automated integration tests
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
class reliabilityTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Reliability module, some
     * text appears in the body.
     *
     * @return void
     */
    function testReliabilityDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=reliability");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("reliability", $bodyText);
    }
}
?>