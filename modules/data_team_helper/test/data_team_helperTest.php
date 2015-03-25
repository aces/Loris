<?php
/**
 * data_team_helper automated integration tests
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
class dataTeamHelperTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the data_team_helper module, some
     * text appears in the body.
     *
     * @return void
     */
    function testDataTeamHelperDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=data_team_helper");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Data Team Helper", $bodyText);
    }
}
?>