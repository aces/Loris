<?php
/**
 * Bvl_Feedback module automated integration tests
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
    . "/../../../test/integrationtests/".
    "LorisIntegrationTest.class.inc";
/**
 * Configuration module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class BvlFeedbackTest extends LorisIntegrationTest
{
    /**
     *  Behavioural feedback button (notepad in the toolbar)
     *  should show up on the following pages:
     *  Candidate Profile
     *  Instrument List
     *  Any instrument
     *
     * @return void
     */
    public function testBVLFeedbackLoads()
    {
        // Candidate Profile
        $this->safeGet($this->url . "/300002/");
        $this->webDriver->executescript(
            "document.querySelector('#nav-right >".
            " li:nth-child(1) > a > span').click()"
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector".
                      "('#bvl_feedback_menu > div.breadcrumb-panel > a').textContent"
        );

        $this->assertContains("Feedback for PSCID: ", $text);
        // Instrument List
        $this->safeGet($this->url . "/instrument_list/?candID=300001&sessionID=1");
        $this->webDriver->executescript(
            "document.querySelector('#nav-right > li:nth-child(1) > a > span').".
            "click()"
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector".
            "('#bvl_feedback_menu > div.breadcrumb-panel > a').textContent"
        );

        $this->assertContains("Feedback for PSCID: ", $text);
        //Todo: Any instrument

    }
    /**
     * Click on the behavioural feedback button. A slide-out panel
     * should appear on the right-hand side with the following:
     * Open Thread Summary
     * New profile level feedback
     * Feedback Threads
     *
     * @return void
     */
    public function testBVLFeedbackContent()
    {
        $this->safeGet($this->url . "/300001/");
        $this->webDriver->executescript(
            "document.querySelector('#nav-right > li:nth-child(1)".
            " > a > span').click()"
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector".
            "('#panel_content').textContent"
        );

        $this->assertContains("Open Thread Summary", $text);

        $this->assertContains("New profile level feedback", $text);

        $this->assertContains("Feedback Threads", $text);
    }
    /**
     * A`fter clicking save button: Feedback threads
     * The Feedback Type should appear under 'Type'
     * Current user and date should appear under 'Author'
     * 'Status' should be set to 'opened'
     *
     * @return void
     */
    public function testFeedbackAfterSave()
    {
        $this->safeGet($this->url . "/300001/");
        $this->webDriver->executescript(
            "document.querySelector('#nav-right > li:nth-child(1) > a > span')".
            ".click()"
        );
        $this->webDriver->executescript(
            "document.querySelector('#comment').value ='test feedback'"
        );
        // save_data
        $this->webDriver->executescript(
            "document.querySelector('#save_data').click()"
        );
        sleep(200);
        $text = $this->webDriver->executescript(
            "return document.querySelector('#comment').textContent"
        );

        $this->assertContains("The new thread has been submitted!", $text);

        $text = $this->webDriver->executescript(
            "return document.querySelector('#bvl_feedback_menu').textContent"
        );

        $this->assertContains("Type", $text);
        $this->assertContains("Author", $text);
        $this->assertContains("opened", $text);

    }
    /**
     * Click on the chevron next to the status. You should be able to
     * see the original text box thread entry.
     *
     * @return void
     */
    public function testFeedbackChevron()
    {
        $this->safeGet($this->url . "/300001/");
        $this->webDriver->executescript(
            "document.querySelector('#nav-right > li:nth-child(1) > a > span').".
            "click()"
        );
        $this->webDriver->executescript(
            "document.querySelector('#current_thread_table > tbody > tr >".
            "td:nth-child(3)>span.glyphicon.glyphicon-chevron-right.glyphs".
            "').click()"
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector('#current_thread_table > tbody >".
            " tr.thread_entry').textContent"
        );

        $this->assertContains("test feedback", $text);

    }
}
?>
