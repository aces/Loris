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
    static $ForSite    = ".col-xs-12:nth-child(1) .form-control, [select]";
    static $Instrument = ".col-xs-12:nth-child(2) .form-control, [select]";
    static $VisitLabel = ".col-xs-12:nth-child(3) .form-control, [select]";
    static $CandID     = ".col-xs-12:nth-child(4) .form-control";
    static $PSCID      = ".col-xs-12:nth-child(5) .form-control";
    static $Question   = ".col-xs-12:nth-child(6) .form-control";
    static $Project    = ".col-xs-12:nth-child(7) .form-control, [select]";
    //filter location on resolved_conflicts page
    static $Timestamp  = ".col-xs-12:nth-child(7) .form-control";
    static $Project_RC = ".col-xs-12:nth-child(8) .form-control, [select]";
    //public location for both pages
    static $clearFilter = ".col-sm-9 > .btn";
    static $display     = ".table-header .col-xs-12";
    static $saveBtn     = ".btn-sm:nth-child(1)";
    static $resetBtn    = ".btn-sm:nth-child(2)";
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
        $bodyText = $this->getReactElementContent("body");
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
         $bodyText = $this->getReactElementContent("body");
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
         $bodyText = $this->getReactElementContent("body");
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
        $row = self::$display;
        $btn = self::$clearFilter;
        //testing data
        // site = montreal
        $this-> _testFilter(
            self::$ForSite,
            "20 rows displayed of 311",
            '2',
            $row,
            $btn
        );
        // Visit label = V1
        $this-> _testFilter(
            self::$VisitLabel,
            "displayed of 576",
            '1',
            $row,
            $btn
        );
        $this-> _testFilter(
            self::$CandID,
            "2 rows displayed of 2",
            '300004',
            $row,
            $btn
        );
        $this-> _testFilter(
            self::$PSCID,
            "2 rows displayed of 2",
            'MTL004',
            $row,
            $btn
        );
        $this-> _testFilter(
            self::$Question,
            "displayed of 181",
            'height_inches',
            $row,
            $btn
        );
         // project = Pumpernickel
        $this-> _testFilter(
            self::$Project,
            "3 rows displayed of 3",
            '1',
            $row,
            $btn
        );
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
        $row = self::$display;
        $btn = self::$clearFilter;
        $this-> _testFilter(self::$ForSite, "displayed of 14", '2', $row, $btn);
        $this-> _testFilter(self::$VisitLabel, "displayed of 33", '1', $row, $btn);
        $this-> _testFilter(self::$CandID, "1 row", '400167', $row, $btn);
        $this-> _testFilter(self::$PSCID, "1 row", 'ROM167', $row, $btn);
        $this-> _testFilter(self::$Question, "9 rows", 'date_taken', $row, $btn);
        $this-> _testFilter(
            self::$Timestamp,
            "1 row",
            '2016-08-16 18:35:51',
            $row,
            $btn
        );
    }
     /**
     * Tests save a unresolved conflicts to resolved
     * author: Wang Shen
     *
     * @return void
     */
    function testSaveUnresolvedToResolved()
    {
                  $this->DB->run('SET foreign_key_checks =0');
                  $this->DB->insert(
                      "conflicts_unresolved",
                      array(
                       'ConflictID'     => '34',
                       'TableName'      => 'bmi',
                       'ExtraKeyColumn' => null,
                       'ExtraKey1'      => '',
                       'ExtraKey2'      => '',
                       'FieldName'      => 'height_inches',
                       'CommentId1'     => '300000MTL0004121465351036',
                       'Value1'         => '5',
                       'CommentId2'     => 'DDE_300000MTL0004121465351036',
                       'Value2'         => '8',
                      )
                  );
                  $this->DB->insert(
                      "flag",
                      array(
                       'SessionID'      => '999999',
                       'CommentId'      => '300000MTL0004121465351036',
                      )
                  );
                  $this->DB->insert(
                      "session",
                      array(
                       'ID'             => '999999',
                       'CandID'         => 'MTL000',
                       'Active'         => 'Y',
                       'ProjectID'      => '1',
                      )
                  );
                  $this->DB->insert(
                      "candidate",
                      array(
                       'CandID'     => 'MTL000',
                       'PSCID'      => '300000',
                       'Active'     => 'Y',
                      )
                  );
         $this->safeGet($this->url . "/conflict_resolver/");
         //give a correct answer and save it for the first row
         $element = "tr:nth-child(1) .form-control";
         $value   = "2";
         $btn     = self::$saveBtn;
         $row     = self::$display;
         $this->reactDropdownSendKey($element, $value);
         $this->clickReactElement($btn);
         sleep(1);
         $bodyText = $this->getReactElementContent(".table-header .col-xs-12");
         $this->assertContains('575', $bodyText);
         $this->DB->delete(
             "conflicts_resolved",
             array('CommentId1'          => '300000MTL0004121465351036')
         );
         $this->DB->delete(
                      "flag",
                      array('SessionID'  => '999999')
         );
         $this->DB->delete(
                      "session",
                      array('ID'         => '999999')
         );
         $this->DB->delete(
                      "candidate",
                      array('PSCID'      => '300000')
         );
         $this->DB->run('SET foreign_key_checks =1');
    }
}
