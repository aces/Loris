<?php
/**
 * Instrument_list automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <shen.wang2@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Instrument_list automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <shen.wang2@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

class InstrumentListTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * UI elements and locations
     * breadcrumb - 'Access Profile'
     * Table headers
     */
    private $_loadingUI
        =  array(
            'Access Profile'  => '#bc2 > a:nth-child(2) > div',
            '300001 / MTL001' => '#bc2 > a:nth-child(3) > div',
            'TimePoint V1'    => '#bc2 > a:nth-child(4) > div',
        );
    /**
     * Tests that, when loading the Instrument list module, some
     * text appears in the body.
     *
     * @return void
     */
    function testInstrumentListDoespageLoad()
    {
        $this->webDriver->get(
            $this->url .
            "/instrument_list/?candID=300001&sessionID=1"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Behavioral Battery of Instruments", $bodyText);
    }

    /**
     * Tests that Instrument list loads with permission
     *
     * @return void
     */
    function testInstrumentListDoespageLoadWithPermission()
    {
        $this->setupPermissions(array("access_all_profiles"));
        $this->webDriver->get(
            $this->url .
            "/instrument_list/?candID=300001&sessionID=1"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Behavioral Battery of Instruments", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that Instrument list loads with without permission
     *
     * @return void
     */
    function testInstrumentListDoespageLoadWithoutPermission()
    {
        $this->setupPermissions(array(""));
        $this->webDriver->get(
            $this->url .
            "/instrument_list/?candID=300001&sessionID=1"
        );
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains("Behavioral Battery of Instruments", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Testing UI elements when page loads
     *
     * @return void
     */
    function testPageUIs()
    {
        $this->safeGet($this->url . "/instrument_list/?candID=300001&sessionID=1");
        $this->webDriver->wait(3, 500)->until(
            WebDriverExpectedCondition::presenceOfElementLocated(
                WebDriverBy::Id('lorisworkspace')
            )
        );
        foreach ($this->_loadingUI as $key => $value) {
            $text = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
            $this->assertContains($key, $text);
        }
    }
}

