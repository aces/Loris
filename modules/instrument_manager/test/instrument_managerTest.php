<?php
/**
 * Instrument_manager automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ .
         "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Instrument_manager automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class InstrumentManagerTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the instrument_manager module, some
     * text appears in the body.
     *
     * @return void
     */
    function testInstrumentManagerDoespageLoad()
    {
        $this->safeGet($this->url . "/instrument_manager/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Instrument Manager", $bodyText);
    }
    /**
     * Tests that, when loading the instrument_manager module with permission,
     * some text appears in the body.
     *
     * @return void
     */
    function testInstrumentManagerDoespageLoadWithpermission()
    {
        // Check read permission, 'instrument_manager_read'
        $this->setupPermissions(array('instrument_manager_read'));
        $this->safeGet($this->url . "/instrument_manager/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Instrument Manager", $bodyText);
        $this->resetPermissions();

        // Check write permission, 'instrument_manager_write'
        $this->setupPermissions(array('instrument_manager_write'));
        $this->safeGet($this->url . "/instrument_manager/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("Instrument Manager", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that, when loading the instrument_manager module without
     * permission, some text appears in the body.
     *
     * @return void
     */
    function testInstrumentManagerDoespageLoadWithoutpermission()
    {
        $this->setupPermissions(array());
        $this->safeGet($this->url . "/instrument_manager/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }


}

