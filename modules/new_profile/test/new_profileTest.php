<?php
/**
 * new_profile automated integration tests
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
class newProfileTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the new_profile module, some
     * text appears in the body.
     *
     * @return void
     */
    function testNewProfileDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=new_profile");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("New Profile", $bodyText);
    }
}
?>