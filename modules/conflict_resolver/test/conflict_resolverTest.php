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
    static $ForSite        = ".col-xs-12:nth-child(1) .form-control, [select]";
    static $Instrument     = ".col-xs-12:nth-child(2) .form-control, [select]";
    static $VisitLabel     = ".col-xs-12:nth-child(3) .form-control, [select]";
    static $CandID         = ".col-xs-12:nth-child(4) .form-control";
    static $PSCID          = ".col-xs-12:nth-child(5) .form-control";
    static $Question       = ".col-xs-12:nth-child(6) .form-control";
    static $Project        = ".col-xs-12:nth-child(7) .form-control, [select]";

    //filter location on resolved_conflicts page
    static $Timestamp      = ".col-xs-12:nth-child(7) .form-control";
    static $Project_RC     = ".col-xs-12:nth-child(8) .form-control, [select]";

    //public location for both pages
    static $clearFilter    = ".col-sm-9 > .btn";
    static $display        = ".table-header .col-xs-12";
    static $saveBtn        = ".btn-sm:nth-child(1)";
    static $resetBtn       = ".btn-sm:nth-child(2)";
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
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertNotContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertContains(
            "Resolved Conflicts",
            $bodyText
        );
        
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
             . "/conflict_resolver/resolved_conflicts/"
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
    /**
     * Tests clear button in the form
     * The form should refreash and the data should be gone.
     *
     * @return void
     */
    function testFiltersForUnresolvedConflicts()
    {
        $this->setUpConfigSetting("useProjects", "true");
        $this->safeGet($this->url . "/conflict_resolver/");
       
        //testing data 
        $this-> _testFilter(self::$ForSite, "20 rows displayed of 319", '2');
        $this-> _testFilter(self::$VisitLabel, "displayed of 581", '1');
        $this-> _testFilter(self::$CandID, "8 rows displayed of 8", '300001');
        $this-> _testFilter(self::$PSCID, "8 rows displayed of 8", 'MTL001');
        $this-> _testFilter(self::$Question, "displayed of 182", 'height_inches');
        $this-> _testFilter(self::$Project, "3 rows displayed of 3", '2');
    }
    /**
     * Testing filter funtion and clear button
     *
     * @param string $element The input element loaction
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
        $this->safeGet($this->url."/conflict_resolver/resolved_conflicts/");

        $this-> _testFilter(self::$ForSite, "14 rows", '2');
        $this-> _testFilter(self::$VisitLabel, "displayed of 33", '1');
        $this-> _testFilter(self::$CandID, "1 row", '400167');
        $this-> _testFilter(self::$PSCID, "1 row", 'ROM167');
        $this-> _testFilter(self::$Question, "9 rows", 'date_taken');
        $this-> _testFilter(self::$Timestamp, "1 row", '2016-08-16 14:35:51');
        $this-> _testFilter(self::$Project_RC, "1 row", '2');

    }
     /**
     * Tests save a unresolved conflicts to resolved
     * author: Wang Shen
     *
     * @return void
     */
    function testSaveUnresolvedToResolved()
    {
         $this->safeGet($this->url . "/conflict_resolver/");
         //give a correct answer and save it for the first row
         $element = "tr:nth-child(1) .form-control";
         $value   = "2";
         $btn     = self::$saveBtn;
         $row     = self::$display; 
         $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 input.selectedIndex = '$value';
                "
            );        
         $this->webDriver->executescript(
                "document.querySelector('$btn').click()"
         );sleep(1);
         //todo find this
         $bodyText = $this->webDriver->executescript(
                "return document.querySelector('$row').textContent"
            );
            // 4 means there are 4 records under this site.
         $this->assertContains("of 584", $bodyText); 
         
    }
}

