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
        $this->assertStringContainsString("Feedback for PSCID: ", $text);
        // Instrument List
        $this->safeGet($this->url . "/instrument_list/?candID=300001&sessionID=1");
        $this->webDriver->executescript(
            "document.querySelector('#nav-right > li:nth-child(1) > a > span').".
            "click()"
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector".
            "('#bvl_feedback_menu').textContent"
        );
        $this->assertStringContainsString("Feedback for PSCID: ", $text);
        //Todo: Any instrument

    }
}

