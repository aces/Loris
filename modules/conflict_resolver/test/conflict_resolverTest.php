<?php
/**
 * Automated integration tests for conflict resolver module
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Implements tests for conflict resolver
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ConflictResolverTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the conflict_resolver module, some
     * text appears in the body.
     *
     * @return void
     */
    function testConflictResolverDoespageLoad()
    {
        $this->webDriver->get($this->url . "?test_name=conflict_resolver");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Conflict Resolver", $bodyText);
    }

    /**
     * Tests that, when loading the resolved_conflicts submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testConflictResolverResolvedCoflictsDoespageLoad()
    {
        $this->webDriver->get(
            $this->url
            . "?test_name=conflict_resolver&submenu=resolved_conflicts"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Resolved Conflicts", $bodyText);
    }
}
?>
