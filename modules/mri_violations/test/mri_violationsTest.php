<?php
/**
 * Mri_violations automated integration tests
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
class MriViolationsTestIntegrationTest extends LorisIntegrationTest
{
    protected $url = 'http://localhost/main.php?test_name=mri_violations';

    /**
     * Tests that, when loading the Mri_violations module, some
     * text appears in the body.
     *
     * @return void
     */
    function testMriViolationsDoespageLoad()
    {
        $this->webDriver->get($this->url);
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("mri_violations", $bodyText);
    }
}
?>