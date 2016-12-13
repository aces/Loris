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
     * @return none
     */
    function setUp()
    {
        parent::setUp();
        $window = new WebDriverWindow($this->webDriver);
        $size   = new WebDriverDimension(1024, 1768);
        $window->setSize($size);
        $this->DB->insert(
            "issues",
            array(
             'issueID'         => '999999',
             'title'           => 'Test Issue',
             'status'          => 'new',
             'priority'        => 'low',
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
        $this->DB->delete("issues", array('issueID' => '999999'));
    }

    /**
     * Tests that, when loading the Issue Tracker module, some
     * text appears in the body.
     *
     * @return void
     */
    function testIssueTrackerDoespageLoad()
    {
        $this->webDriver->get($this->url . "/issue_tracker/");
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
        $this->webDriver->get($this->url . "/issue_tracker/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Issues", $bodyText);
        $this->resetPermissions();
    }
    
    function testFilter()
    {
       $this->webDriver->get($this->url . "/issue_tracker/");
       $this->webDriver->findElement(
            WebDriverBy::Name("keyword"))->sendKeys("Test Issue");
       $this->webDriver->findElement(
            WebDriverBy::Name("filter"))->click();
       $this->webDriver->get($this->url . "/issue_tracker/?format=json");
       $bodyText = $this->webDriver->getPageSource();
       $this->assertContains("Test Issue",$bodyText);

    }    
}
?>
