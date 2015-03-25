<?php
/**
 * data_integrity_flag automated integration tests
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
class dataIntegrityFlagTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the data_integrity_flag module, some
     * text appears in the body.
     *
     * @return void
     */
    function testDataIntegrityFlagDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=data_integrity_flag");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Data Integrity Flag", $bodyText);
    }
}
?>