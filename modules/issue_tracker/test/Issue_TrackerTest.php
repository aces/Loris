<?php
/**
 * Issue Tracker automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Issue Tracker automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class Issue_TrackerTest extends LorisIntegrationTest
{

    /**
     * Insert testing data into the database
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
         $this->DB->insert(
             "psc",
             array(
              'CenterID'  => '55',
              'Name'      => 'TESTinPSC',
              'Alias'     => 'tst',
              'MRI_alias' => 'test',
             )
         );
         $this->DB->insert(
             "users",
             array(
              'ID'     => '999998',
              'UserID' => 'TestUser',
             )
         );
         $this->DB->insert(
             "issues",
             array(
              'issueID'  => '999999',
              'title'    => 'Test Issue',
              'status'   => 'new',
              'priority' => 'low',
              'reporter' => 'TestUser',
              'centerID' => '55',
             )
         );
    }

    /**
     * Delete testing data from database
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
        $this->DB->delete("issues", array('issueID' => '999999'));
        $this->DB->delete("users", array('ID' => '999998'));
        $this->DB->delete("psc", array('CenterID' => '55'));
    }

    /**
     * Tests that, when loading the Issue Tracker module, some
     * text appears in the body.
     *
     * @return void
     */
    function testIssueTrackerDoespageLoad()
    {
        $this->safeGet($this->url . "/issue_tracker/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Issues", $bodyText);
    }

    /**
     * Tests that Issue Tracker loads with permission
     *
     * @return void
     */
    function testIssueTrackerDoespageLoadWithPermission()
    {
        $this->setupPermissions(array("issue_tracker_reporter"));
        $this->safeGet($this->url . "/issue_tracker/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Issues", $bodyText);
        $this->resetPermissions();
    }

    /**
     * Tests that Issue Tracker's filters
     *
     * @return void
     */
    function testIssueTrackerFilter()
    {
        $this->_testFilter('issueID', '999999');
        $this->_testFilter('status', 'new');
        $this->_testFilter('priority', 'low');
        $this->_testFilter('reporter', 'TestUser');
    }
    /**
     * Tests that Issue Tracker filter
     *
     * @param string $name  input the element name which we need test
     * @param string $value input the value that we expect
     *
     * @return void
     */
    private function _testFilter($name,$value)
    {
        $this->webDriver->get($this->url . "/issue_tracker/?format=json");
        $bodyText = $this->webDriver->getPageSource();
        $this->assertContains($value, $bodyText);

    }
    /**
     * Tests Clear Form function in Issue Tracker
     *
     * @return void
     */
    function testClearFormIssueTracker()
    {
         //$this->safeGet($this->url . "/issue_tracker/");
         //$keywordElement = $this->webDriver->findElement(
         //    WebDriverBy::Name("keyword")
         //);
         //$keywordElement->sendkeys('TestTestTest');
         ////click clear form button
         //$this->webDriver->findElement(WebDriverBy::Name("reset"))->click();
         //$bodyText =$this->webDriver->findElement(
         //    WebDriverBy::Name("keyword")
         //)->getText();
         //$this->assertNotContains("TestTestTest", $bodyText);
    }
}

