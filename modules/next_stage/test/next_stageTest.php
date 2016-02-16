<?php
/**
 * Next_stage automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTestWithCandidate.class.inc";
class nextStageTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    /**
     * Tests that, when loading the Next_stage module, some
     * text appears in the body.
     *
     * @return void
     */
    function testNextStageDoespageLoad()
    {
        $this->markTestSkipped("Permissions not correctly set up for next_page test");
        /*
        $this->safeGet($this->url . "?test_name=next_stage&identifier=999999");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Next Stage", $bodyText);
         */
    }
}
?>
