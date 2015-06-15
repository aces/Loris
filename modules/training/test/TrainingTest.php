<?php
/**
 * Training module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Training module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class TrainingTest extends LorisIntegrationTest
{

    /**
     * Tests that, when loading the training module, the word "Training" appears
     * somewhere in the body
     *
     * @return void
     */
    public function testTrainingPageLoads()
    {
        $this->webDriver->get($this->url . "?test_name=training");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Training", $bodyText);
    }
}
?>