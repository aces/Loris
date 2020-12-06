<?php
 /**
  * Automated integration tests for conflict resolver module
  *
  * PHP Version 7
  *
  * @category Test
  * @package  Loris
  * @author   Wang Shen <wangshen.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
use Facebook\WebDriver\WebDriverSelect;
use Facebook\WebDriver\WebDriverBy;
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
    function setUp(): void
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
    function tearDown(): void
    {
        parent::tearDown();
        $this->restoreConfigSetting("useProjects");
        // if data not exist then insert the origin test data
        $CommentId1 = $this->DB->pselectOne(
            'SELECT CommentId1 FROM conflicts_unresolved
             WHERE CommentId1 ="475906DCC4222142111524502652"',
            []
        );
        if ($CommentId1 == null) {
            $this->DB->insert(
                "conflicts_unresolved",
                [
                    'TableName'  => 'radiology_review',
                    'FieldName'  => 'Scan_done',
                    'CommentId1' => '475906DCC4222142111524502652',
                    'Value1'     => 'yes',
                    'CommentId2' => 'DDE_475906DCC4222142111524502652',
                    'Value2'     => 'no'
                ]
            );
        }
        $this->DB->delete(
            "conflicts_resolved",
            ["CommentId1" => "475906DCC4222142111524502652"]
        );
    }

     /**
      * Tests that conflict resolver loads with the permission
      *
      * @return void
      */
    function testConflictResolverPermission()
    {
        $this->checkPagePermissions(
            '/conflict_resolver/',
            [
                'conflict_resolver'
            ],
            "Conflict Resolver"
        );
        $this->checkPagePermissions(
            '/conflict_resolver/resolved_conflicts/',
            [
                'conflict_resolver'
            ],
            "Resolved Conflicts"
        );
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
        $this->_filterTest(
            self::$ForSite,
            self::$display,
            self::$clearFilter,
            'Montreal',
            "20 rows displayed of 311"
        );
        $this->_filterTest(
            self::$VisitLabel,
            self::$display,
            self::$clearFilter,
            'V1',
            "displayed of 576"
        );
        $this->_filterTest(
            self::$CandID,
            self::$display,
            self::$clearFilter,
            '300004',
            "2 rows displayed of 2"
        );
        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clearFilter,
            'MTL004',
            "2 rows displayed of 2"
        );
        $this->_filterTest(
            self::$Question,
            self::$display,
            self::$clearFilter,
            'height_inches',
            "displayed of 181"
        );
        $this->_filterTest(
            self::$Project,
            self::$display,
            self::$clearFilter,
            'Pumpernickel',
            "573"
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
        $this->_filterTest(
            self::$ForSite,
            self::$display,
            self::$clearFilter,
            "Montreal",
            "displayed of 14"
        );
        $this->_filterTest(
            self::$VisitLabel,
            self::$display,
            self::$clearFilter,
            "V1",
            "displayed of 33"
        );
        $this->_filterTest(
            self::$CandID,
            self::$display,
            self::$clearFilter,
            '400167',
            "1 row"
        );
        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clearFilter,
            'ROM167',
            "1 row"
        );
        $this->_filterTest(
            self::$Question,
            self::$display,
            self::$clearFilter,
            'date_taken',
            "9 rows"
        );
        $this->_filterTest(
            self::$Timestamp,
            self::$display,
            self::$clearFilter,
            '2016-08-16 18:35:51',
            "1 row"
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
         //set canID 475906 to resolved
        $this->safeGet(
            $this->url .
            "/conflict_resolver/?candidateID=475906&instrument=radiology_review"
        );
         $element    = "tr:nth-child(1) .form-control";
         $btn        = self::$saveBtn;
         $row        = self::$display;
        $el_dropdown = new WebDriverSelect(
            $this->safeFindElement(WebDriverBy::cssSelector("$element"))
        );
        $el_dropdown->selectByVisibleText("yes");
        $this->safeClick(WebDriverBy::cssSelector($btn));
         //todo find this
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector($row)
        )->getText();
         // 4 means there are 4 records under this site.
        $this->assertContains("of 575", $bodyText);
    }
}
