<?php
/**
 * Dashboard automated integration tests
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
 * Dashboard module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DashboardTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Dashboard, the word "Welcome" appears
     * in the welcome panel
     *
     * @return void
     */
    public function testDashboardPageLoads()
    {
        $this->safeGet($this->url . '/dashboard/');

        $welcomeText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector(".welcome"))->getText();
        $this->assertContains("Welcome", $welcomeText);
    }
    /**
     * Tests that, when loading Document Repository, the word "Document" appears
     * in the Document Repository panel
     *
     * @return void
     */
    public function testDashboard()
    {
        $this->safeGet($this->url . '/document_repository/');

        $welcomeText = $this->webDriver
            ->findElement(
                WebDriverBy::cssSelector(
                    ".alert >".
                    " a:nth-child(1) > label:nth-child(1)"
                )
            )->getText();
        $this->assertContains("Document Repository", $welcomeText);
    }
}
?>
