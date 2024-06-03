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
    static $ForSite    = 'select[name="Site"]';
    static $Instrument = 'select[name="instrument"]';
    static $VisitLabel = 'select[name="visitLabel"]';
    static $CandID     = 'input[name="candidateID"]';
    static $PSCID      = 'input[name="PSCID"]';
    static $Question   = 'input[name="Question"]';
    static $Project    = 'select[name="Project"]';
    //filter location on resolved_conflicts page
    static $Timestamp = 'input[name="ResolutionTimestamp"]';

    //public location for both pages
    static $clearFilter = 'a[name="reset"]';
    static $display     = ".table-header";
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
                    'TestName'   => 'radiology_review',
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
        $permissionList = ["conflict_resolver","data_dict_edit","data_dict_view"];
        $this->setupPermissions($permissionList);
        $this->safeGet($this->url . "/conflict_resolver/");
        $bodyElement = $this->safeFindElement(WebDriverBy::cssSelector("body"));
        $bodyText    = $bodyElement->getText();
        $accessError = "You do not have access to this page.";
        $this->assertStringNotContainsString($accessError, $bodyText);
        $loadingError = "An error occured while loading the page.";
        $this->assertStringNotContainsString($loadingError, $bodyText);
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
            "displayed of 573"
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
            "displayed of 180"
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
        $this->safeGet($this->url."/conflict_resolver/");
        $this->safeClick(WebDriverBy::cssSelector("#tab-resolved"));
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
            "displayed of 32"
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
            "8 rows"
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
        $this->markTestSkipped(
            'rewrite later'
        );
         //set canID 475906 to resolved
        $this->safeGet(
            $this->url .
            "/conflict_resolver/?CandID=475906&instrument=radiology_review"
        );
         $element    = "tr:nth-child(1) .form-control";
         $row        = self::$display;
        $el_dropdown = new WebDriverSelect(
            $this->safeFindElement(WebDriverBy::cssSelector("$element"))
        );
        $el_dropdown->selectByVisibleText("no");
        $this->safeGet($this->url."/conflict_resolver/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector($row)
        )->getText();
         // 4 means there are 4 records under this site.
        $this->assertStringContainsString("of 575", $bodyText);
    }
}
