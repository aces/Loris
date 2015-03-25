<?php
/**
 * final_radiological_review automated integration tests
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
class finalRadiologicalReviewTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the final_radiological_review module, some
     * text appears in the body.
     *
     * @return void
     */
    function testFinalRadiologicalReviewDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=final_radiological_review");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Final Radiological Review", $bodyText);
    }

    /**
     * Tests that, when loading the final_radiological_review module > final_radiological_review submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testFinalRadiologicalReviewSubtestDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=final_radiological_review&subtest=final_radiological_review");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Final Radiological Review", $bodyText);
    }

}
?>