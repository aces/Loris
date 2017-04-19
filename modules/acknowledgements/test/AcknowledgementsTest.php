<?php
/**
 * AcknowledgementsIntegrationTest automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * AcknowledgementsIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class AcknowledgementsIntegrationTest extends LorisIntegrationTest
{
    /**
     * The expected result when searches successfully retrieve candidate
     *  TST0001.
     *  All items represent the text of each column in the displayed HTML
     *  candidate table.
     */
    /**
     * Backs up the useEDC config value and sets the value to a known
     * value (true) for testing.
     *
     * @return none
     */
    function setUp()
    {
    }
    /**
     * Restore the values backed up in the setUp function
     *
     * @return none
     */
    function tearDown()
    {
    }

    function testCandidateListPageLoads()
    {
        $this->safeGet($this->url . "/acknowledgements/");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Acknowledgements", $bodyText);
    }
    /**
     * Tests that, after clicking the "Advanced" button, all of the
     * advanced filters appear on the page and are the correct element type.
     *
     * @return void
     */
    function testCandidateListPageLoadsWithoutPermissions()
    {
        $this->setupPermissions(array("violated_scans_view_allsites"));
        $this->safeGet($this->url . "/acknowledgements/");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("You do not have access to this page.",
                              $bodyText
        );
        $this->resetPermissions();
    }

}
?>
