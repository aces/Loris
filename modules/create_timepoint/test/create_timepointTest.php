<?php
/**
 * create_timepoint automated integration tests
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
class createTimepointTestIntegrationTest extends LorisIntegrationTestWithCandidate
{
    /**
     * Tests that, when loading the create_timepoint module, some
     * text appears in the body.
     *
     * @return void
     */
    function testCreateTimepointDoespageLoad()
    {
        $this->safeGet($this->url . "/create_timepoint/?candID=000000&identifier=000000");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Create Time Point", $bodyText);
    }
}
?>
