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
    
}
?>
