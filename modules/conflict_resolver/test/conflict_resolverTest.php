<?php
/**
 * Automated integration tests for conflict resolver module
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Justin Kat <justin.kat@mail.mcgill.ca>
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
 * @author   Justin Kat <justin.kat@mail.mcgill.ca>
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
        $this->safeGet($this->url . "/conflict_resolver/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::id("onLoad")
        )->getText();
        $this->assertContains("Unresolved Conflicts", $bodyText);
    }

    /**
     * Tests that, when loading the resolved_conflicts submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testConflictResolverResolvedCoflictsDoespageLoad()
    {
        $this->safeGet(
            $this->url
            . "/conflict_resolver/?submenu=resolved_conflicts"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Resolved Conflicts", $bodyText);
    }

    /**
     * Tests that conflict resolver loads with the permission
     *
     * @return void
     */
    function testConflictResolverPermission()
    {
         $this->setupPermissions(array("conflict_resolver"));
         $this->safeGet($this->url . "/conflict_resolver/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::id("onLoad")
         )->getText();
         $this->assertContains("Unresolved Conflicts", $bodyText);
         $this->resetPermissions();
    }

    /**
     * Tests that resolved conflicts loads with the permission
     *
     * @return void
     */
    function testConflictResolverResolvedConflictsPermission()
    {
         $this->setupPermissions(array("conflict_resolver"));
         $this->safeGet(
             $this->url
             . "/conflict_resolver/?submenu=resolved_conflicts"
         );
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertContains("Resolved Conflicts", $bodyText);
         $this->resetPermissions();
    }

    /**
     * Tests that conflict resolver does not load with the permission
     *
     * @return void
     */
    function testConflictResolverWithoutPermission()
    {
         $this->setupPermissions(array());
         $this->safeGet($this->url . "/conflict_resolver/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertContains("You do not have access to this page.", $bodyText);
         $this->resetPermissions();
    }

}
?>
