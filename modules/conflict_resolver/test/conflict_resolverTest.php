<?php
 /**
 * Automated integration tests for conflict resolver module
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
 * Implements tests for conflict resolver
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ConflictResolverTestIntegrationTest extends LorisIntegrationTest
{
    //filter location on conflict_resolver page
    static $ForSite    = 'select[name="Site"]';
    static $Instrument = 'select[name="instrument"]';
    static $VisitLabel = 'select[name="VisitLabel"]';
    static $CandID     = 'input[name="CandID"]';
    static $PSCID      = 'input[name="PSCID"]';
    static $Question   = 'input[name="Question"]';
    static $Project    = 'select[name="Project"]';

    //filter location on resolved_conflicts page
    static $Timestamp = 'input[name="ResolutionTimestamp"]';

    //public location for both pages
    static $clearFilter = 'button[type="reset"]';
    static $display     = '.table-header';
    /**
     * Insert testing data into the database
     * author: Wang Shen
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
        $this->setUpConfigSetting("useProjects", "true");
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
    function tearDown()
    {
        parent::tearDown();
        $this->restoreConfigSetting("useProjects");
        $this->DB->delete("conflicts_resolved", array('ResolvedID' => '999999'));
        $this->DB->delete(
            "conflicts_unresolved",
            array('TableName' => 'TestTestTest')
        );
    }

     /**
     * Tests that conflict resolver loads with the permission
     *
     * @return void
     */
    function testConflictResolverPermission()
    {
        $this->setupPermissions(array("conflict_resolver"));
        $this->safeGet($this->url . "/conflict_resolver");

        $filters = $this->webDriver->findElement(
            WebDriverBy::id('unresolved_filter')
        );
        $this->assertTrue(!empty($filters));
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
            . "/conflict_resolver"
        );
        $this->webDriver->executescript(
            "document.querySelector('#tab-resolved').click();"
        );
        $filters = $this->webDriver->findElement(
            WebDriverBy::id('resolved_filter')
        );
        $this->assertTrue(!empty($filters));
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
         $this->safeGet($this->url . "/conflict_resolver");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::id('lorisworkspace')
         )->getText();
         $this->assertContains("You do not have access to this page.", $bodyText);
         $this->resetPermissions();
    }
    /**
     * Tests clear button in the form
     * The form should refreash and the data should be gone.
     *
     * @return void
     */
    function testFiltersForUnresolvedConflicts()
    {
        $this->safeGet($this->url . "/conflict_resolver/");
        //testing data
        // site = montreal
        $this-> _testFilter(self::$ForSite, "20 rows displayed of 311", '2');
        // Visit label = V1
        $this-> _testFilter(self::$VisitLabel, "displayed of 576", '1');
        $this-> _testFilter(self::$CandID, "2 rows displayed of 2", '300004');
        $this-> _testFilter(self::$PSCID, "2 rows displayed of 2", 'MTL004');
        $this-> _testFilter(self::$Question, "displayed of 181", 'height_inches');
         // project = Pumpernickel
        $this-> _testFilter(self::$Project, "3 rows displayed of 3", '1');
    }
    /**
     * Testing filter funtion and clear button
     *
     * @param string $element The input element location
     * @param string $records The records number in the table
     * @param string $value   The test value
     *
     * @return void
     */
    function _testFilter($element,$records,$value)
    {
        // get element from the page
        if (strpos($element, "select") === false) {
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 lastValue = input.value;
                 input.value = '$value';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);
                "
            );
        } else {
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
        }
            $row      = self::$display;
            $bodyText = $this->webDriver->executescript(
                "return document.querySelector('$row').textContent"
            );
            // 4 means there are 4 records under this site.
            $this->assertContains($records, $bodyText);
            //test clear filter
            $btn = self::$clearFilter;
            $this->webDriver->executescript(
                "document.querySelector('$btn').click();"
            );
            $inputText = $this->webDriver->executescript(
                "return document.querySelector('$element').value"
            );
            $this->assertEquals("", $inputText);
    }
     /**
     * Tests filter in resolved conflicts
     * author: Wang Shen
     *
     * @return void
     */
    function testFiltersForResolvedConflicts()
    {
        $this->safeGet($this->url."/conflict_resolver");
        $this->webDriver->executescript(
            "document.querySelector('#tab-resolved').click();"
        );
        $this-> _testFilter(self::$ForSite, "displayed of 14", '2');
        $this-> _testFilter(self::$VisitLabel, "displayed of 33", '1');
        $this-> _testFilter(self::$CandID, "1 row", '400167');
        $this-> _testFilter(self::$PSCID, "1 row", 'ROM167');
        $this-> _testFilter(self::$Question, "9 rows", 'date_taken');
        $this-> _testFilter(self::$Timestamp, "1 row", '2016-08-16 18:35:51');

    }
     /**
     * Tests save a unresolved conflicts to resolved
     * author: Wang Shen
     *
     * @return void
     */
    function testSaveUnresolvedToResolved()
    {
        $this->markTestSkipped(
            'Todo:Rewrite this test function.'
        );
    }
}

