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
     * Insert testing data into the database
     *
     * @return none
     */
    function setUp()
    {
        parent::setUp();
        $this->DB->insert(
            "conflicts_resolved",
            array(
             'ResolvedID'         => '999999',
             'UserID'       => 'demo',
             'ResolutionTimestamp'           => '2015-11-03 16:21:49',
             'User1'          => 'Null',
             'User2'        => 'Null',
             'TableName'        => 'Test',
             'ExtraKey1'        => 'NULL',
             'ExtraKey2'        => 'NULL',
             'FieldName'        => 'TestTestTest',
             'CommentId1'        => '589569DCC000012291366553230',
             'CommentId2'        => 'DDE_589569DCC000012291366653254',
             'OldValue1'        => 'Mother',
             'OldValue2'        => 'Father',
             'NewValue'        => 'NULL',
             'ConflictID'        => 'NULL',
            )
        );
    }
    /**
     * Delete testing data from database
     *
     * @return none
     */
    function tearDown()
    {
        parent::tearDown();
        $this->DB->delete("conflicts_resolved", array('ResolvedID' => '999999'));
    }

    /**
     * Tests that, when loading the conflict_resolver module, some
     * text appears in the body.
     *
     * @return void
     */
    function testConflictResolverDoespageLoad()
    {
        $this->webDriver->get($this->url . "/conflict_resolver/");
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
            . "/conflict_resolver/?submenu=resolved_conflicts"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Resolved Conflicts", $bodyText);
    }
}
?>
