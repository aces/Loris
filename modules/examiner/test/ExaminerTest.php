<?php
/**
 * Examiner module automated integration tests
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
 * Examiner module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ExaminerTest extends LorisIntegrationTest
{

    /**
     * Tests that, when loading the examiner module, the word "Examiner" appears
     * somewhere in the body
     *
     * @return void
     */
    public function testExaminerPageLoads()
    {
        $this->webDriver->get($this->url . "?test_name=examiner");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Examiner", $bodyText);
    }

    /**
     * Tests that, when loading the examiner module, the words
     * "Edit Examiner" appears somewhere in the body
     *
     * @return void
     */
    public function testEditExaminerPageLoads()
    {
        $this->webDriver->get(
            $this->url . "?test_name=examiner&subtest=editExaminer"
        );
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Edit Examiner", $bodyText);
    }
}
?>