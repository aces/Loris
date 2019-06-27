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
 * @author   Wang Shen <wangshen.mcin@gmail.com>
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
     * Insert testing data into the database
     * author: Wang Shen
     *
     * @return void
     */
    function setUp(): void
    {
        parent::setUp();
        $window = new WebDriverWindow($this->webDriver);
        $window->maximize();
        $this->DB->insert(
            "conflicts_resolved",
            array(
             'ResolvedID'          => '999999',
             'UserID'              => 'demo',
             'ResolutionTimestamp' => '2015-11-03 16:21:49',
             'User1'               => 'Null',
             'User2'               => 'Null',
             'TableName'           => 'Test',
             'ExtraKey1'           => 'NULL',
             'ExtraKey2'           => 'NULL',
             'FieldName'           => 'TestTestTest',
             'CommentId1'          => '589569DCC000012291366553230',
             'CommentId2'          => 'DDE_589569DCC000012291366653254',
             'OldValue1'           => 'Mother',
             'OldValue2'           => 'Father',
             'NewValue'            => 'NULL',
            )
        );
         $this->DB->insert(
             "conflicts_unresolved",
             array(
              'TableName'      => 'TestTestTest',
              'ExtraKeyColumn' => 'Test',
              'ExtraKey1'      => 'Null',
              'ExtraKey2'      => 'Null',
              'FieldName'      => 'TestTestTest',
              'CommentId1'     => '963443000111271151398976899',
              'Value1'         => 'no',
              'CommentId2'     => 'DDE_963443000111271151398976899',
              'Value2'         => 'no',
             )
         );
    }
     /**
     * Delete testing data from database
     * author: Wang Shen
     *
     * @return void
     */
    function tearDown(): void
    {
        $this->DB->delete("conflicts_resolved", array('ResolvedID' => '999999'));
        $this->DB->delete(
            "conflicts_unresolved",
            array('TableName' => 'TestTestTest')
        );
        parent::tearDown();
    }

     /**
     * Tests that, when loading the conflict_resolver module, some
     * text appears in the body.
     *
     * @return void
     */
    function testConflictResolverDoespageLoad(): void
    {
        $this->safeGet($this->url . "/conflict_resolver/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::id("onLoad")
        )->getText();
        $this->assertStringContainsString("Unresolved Conflicts", $bodyText);
    }

     /**
     * Tests that, when loading the resolved_conflicts submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testConflictResolverResolvedCoflictsDoespageLoad(): void
    {
        $this->safeGet(
            $this->url
            . "/conflict_resolver/resolved_conflicts/"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Resolved Conflicts", $bodyText);
    }

     /**
     * Tests that conflict resolver loads with the permission
     *
     * @return void
     */
    function testConflictResolverPermission(): void
    {
         $this->setupPermissions(array("conflict_resolver"));
         $this->safeGet($this->url . "/conflict_resolver/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::id("onLoad")
         )->getText();
         $this->assertStringContainsString("Unresolved Conflicts", $bodyText);
         $this->resetPermissions();
    }

     /**
     * Tests that resolved conflicts loads with the permission
     *
     * @return void
     */
    function testConflictResolverResolvedConflictsPermission(): void
    {
         $this->setupPermissions(array("conflict_resolver"));
         $this->safeGet(
             $this->url
             . "/conflict_resolver/resolved_conflicts/"
         );
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertStringContainsString("Resolved Conflicts", $bodyText);
         $this->resetPermissions();
    }

     /**
     * Tests that conflict resolver does not load with the permission
     *
     * @return void
     */
    function testConflictResolverWithoutPermission(): void
    {
         $this->setupPermissions(array());
         $this->safeGet($this->url . "/conflict_resolver/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertStringContainsString(
             "You do not have access to this page.",
             $bodyText
         );
         $this->resetPermissions();
    }
     /**
     * Tests research function in resolved conflicts
     * author: Wang Shen
     *
     * @return void
     */
    function testSearchConflictResolved(): void
    {
        $this->markTestSkipped(
            'Rewrite this part later'
        );
         $this->safeGet($this->url."/conflict_resolver/?submenu=resolved_conflicts");
         $keywordElement = $this->webDriver->findElement(
             WebDriverBy::Name("Question")
         );
         $keywordElement->sendkeys('TestTestTest');
         //click show data button
         $this->webDriver->findElement(WebDriverBy::ID("testShowData1"))->click();
         $this->safeGet(
             $this->url .
             "/conflict_resolver/?submenu=resolved_conflicts&format=json"
         );
         $bodyText = $this->webDriver->getPageSource();
         $this->assertStringContainsString("TestTestTest", $bodyText);
    }
     /**
     * Tests research function in unresolved conflicts
     * author: Wang Shen
     *
     * @return void
     */
    function testSearchUnresolvedConflicts(): void
    {
        $this->markTestSkipped(
            'Rewrite this part later'
        );
         $this->safeGet($this->url . "/conflict_resolver/");
         $keywordElement = $this->webDriver->findElement(
             WebDriverBy::Name("Question")
         );
         $keywordElement->sendkeys('TestTestTest');
         //click show data button
         $this->webDriver->findElement(WebDriverBy::ID("testShowData1"))->click();
         $this->safeGet($this->url . "/conflict_resolver/?format=json");
         $bodyText = $this->webDriver->getPageSource();
         $this->assertStringContainsString("TestTestTest", $bodyText);
    }
     /**
     * Tests Clear Form function in unresolved conflicts
     * author: Wang Shen
     *
     * @return void
     */
    function testClearFormUnresolvedConflicts(): void
    {
         $this->safeGet($this->url . "/conflict_resolver/");
         $keywordElement = $this->webDriver->findElement(
             WebDriverBy::Name("Question")
         );
         $keywordElement->sendkeys('TestTestTest');
         //click clear form button
         $this->webDriver->findElement(WebDriverBy::ID("testClearForm1"))->click();
         $bodyText =$this->webDriver->findElement(
             WebDriverBy::Name("Question")
         )->getText();
         $this->assertStringNotContainsString("TestTestTest", $bodyText);
    }
     /**
     * Tests Clear Form function in resolved conflicts
     * author: Wang Shen
    *
     * @return void
     */
    function testClearFormResolvedConflicts(): void
    {
         $this->safeGet($this->url."/conflict_resolver/?submenu=resolved_conflicts");
         $keywordElement = $this->webDriver->findElement(
             WebDriverBy::Name("Question")
         );
         $keywordElement->sendkeys('TestTestTest');
         //click clear form button
         $this->webDriver->findElement(WebDriverBy::ID("testClearForm1"))->click();
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::Name("Question")
         )->getText();
         $this->assertStringNotContainsString("TestTestTest", $bodyText);
    }


}

