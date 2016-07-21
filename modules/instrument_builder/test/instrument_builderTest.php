<?php
/**
 * Instrument_builder automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class instrumentBuilderTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the Instrument builder module, some
     * text appears in the body.
     *
     * @return void
     */
    function testInstrumentBuilderDoespageLoad()
    {
        $this->safeGet($this->url . "/instrument_builder/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
                   ->getText();
        $this->assertContains("Instrument Builder", $bodyText);
    }
    /**
     * Tests that, when loading the Instrument builder module with permission, some
     * text appears in the body.
     *
     * @return void
     */
    function testInstrumentBuilderDoespageLoadWithPermission()
    {
        $this->setupPermissions(array("instrument_builder"));
        $this->safeGet($this->url . "/instrument_builder/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
                   ->getText();
        $this->assertContains("Instrument Builder", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that, when loading the Instrument builder module without permisson, some
     * text appears in the body.
     *
     * @return void
     */
    function testInstrumentBuilderDoespageLoadWithoutPermission()
    {
        $this->setupPermissions(array(""));
        $this->safeGet($this->url . "/instrument_builder/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
                   ->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
    /**
     * Tests that, when loading the Instrument builder module without permisson, some
     * text appears in the body.
     *
     * @return void
     */
    function testInstrumentBuilderBuildTabAddEditDeleteQuestion()
    {
        //Insert a text content
        $this->safeGet($this->url . "/instrument_builder/");
        $this->webDriver->findElement(WebDriverBy::cssSelector(".SelectOne"))->click();
        $this->webDriver->findElement(WebDriverBy::ID("header"))->click();
        $this->webDriver->findElement(WebDriverBy::ID("questionText"))
              ->sendKeys("Test Header");
        $this->webDriver->findElement(WebDriverBy::ID("AddRow"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector(
               "#sortable > tbody > tr > td.col-xs-8 > div > h2"))->getText();
        $this->assertContains("Test Header", $bodyText);

        //Edit this text content
        $this->webDriver->findElement(WebDriverBy::cssSelector(".editButton"))->click();
        $this->webDriver->findElement(WebDriverBy::ID("questionText"))
             ->sendKeys("Header changed");
        $this->webDriver->findElement(WebDriverBy::ID("EditRow"))->click();
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector(
                 "#sortable > tbody > tr > td.col-xs-8 > div > h2"))->getText();
        $this->assertContains("Header changed", $bodyText);

        //Delete this text content
        $this->webDriver->findElement(WebDriverBy::cssSelector(".deleteButton"))->click();
        $element = $this->webDriver->findElement(WebDriverBy::cssSelector(
               "#sortable>tbody")
               )->getText();
        $this->assertEquals(Null, $element);
    }

    /** Tests that, when loading the load tab in Instrument builder module , some
     * text appears in the body.
     *
     * @return void
     */
    function testInstrumentBuilderTab()
    {
//        $this->_testInstrumentBuilderTabLink("load","Load Instrument");
        $this->_testInstrumentBuilderTabLink("save","Save Instrument");
        $this->_testInstrumentBuilderTabLink("build","Build your Instrument");

    }
    /** Use this method to verify all the links, if the link gets click, some text should
     * appears in the body.
     * @param $id  id of the tab link.
     * @param $text  the text of assertion.
     *
     * @return void
     */
    private function _testInstrumentBuilderTabLink($id,$text)
    {
        $this->safeGet($this->url . "/instrument_builder/");
        $this->webDriver->findElement(WebDriverBy::ID($id))->click();
        $uniqueSelector = "#".ucfirst($id).">h1";
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector(
                $uniqueSelector
                ))->getText();
        $this->assertContains($text, $bodyText);
    }

}
?>
