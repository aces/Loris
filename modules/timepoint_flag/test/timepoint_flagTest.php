<?php
/**
 * Timepoint flag automated integration tests
 * Timepoint_FlagTestIntegrationTest File Doc Comment
 * 
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ .
        "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Timepoint flag automated integration tests
 * Timepoint_FlagTestIntegrationTest Class Doc Comment
 * 
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Timepoint_FlagTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Timepoint flag module, some
     * text appears in the body.
     *
     * @return void
     */
    function testTimepointFlagDoespageLoad()
    {
        $this->safeGet($this->url . "/timepoint_flag/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertContains("Timepoint Flag", $bodyText);
    }
}
?>