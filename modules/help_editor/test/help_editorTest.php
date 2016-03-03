<?php
/**
 * help_editor automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen 
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__ . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
class helpEditorTestIntegrationTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the help_editor module, some
     * text appears in the body.
     *
     * @return void
     */
    function testHelpEditorDoesPageLoad()
    {
        $this->safeGet($this->url . "/help_editor/");
        $assertText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        
        $this->assertContains("Help Editor", $assertText);
    }
    /**
     * Tests that, when loading the help_editor module > edit help submodule, some
     * text appears in the body.
     *
     * @return void
     */
    function testHelpEditorEditHelpContentDoesPageLoad()
    {
        $this->safeGet($this->url . "/help_editor/edit_help_content/");
        $assertText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))->getText();
        
        $this->assertContains("Edit Help Content", $assertText);
    }
    /**
     * Tests that, when loading the help editor, search Hand Preference, click show data, the hand preference should appear.
     * 
     * @return void
     */
    public function testHelpEditor_SearchTopic()
    {
        $this->safeGet($this->url . '/help_editor/');
        $searchbox = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#panel-body > form > div:nth-child(1) > div:nth-child(1) > div > input"));
        $searchbox->sendKeys("Hand Preference");
        $showdata = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#panel-body > form > div:nth-child(2) > div > div.col-sm-4.col-sm-offset-4 > input"));
        $showdata->click();
        $assertText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#Topic > a"))->getText();
        $this->assertContains("Hand Preference", $assertText);
    }
// /**
    //  * Tests that, when loading the help editor, search Hand Preference, click show data, the hand preference should appear.
    //  * 
    //  * @return void
    //  */
    public function testHelpEditor_SearchKeyWord()
    {
        $this->safeGet($this->url . '/help_editor/');
        $searchbox = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#panel-body > form > div:nth-child(1) > div:nth-child(2) > div > input"));
        $searchbox->sendKeys("Under Construction");
        $showdata = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#panel-body > form > div:nth-child(2) > div > div.col-sm-4.col-sm-offset-4 > input"));
        $showdata->click();
        $assertText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#Topic > a"))->getText();
        $this->assertContains("Hand Preference", $assertText);
    }
// /**
    //  * Tests that, when loading the help editor, search Hand Preference, click clear form, the text Hand Preference should disappear.
    //  * 
    //  * @return void
    //  */
    public function testHelpEditor_ClearForm()
    {
        $this->safeGet($this->url . '/help_editor/');
        $searchbox = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#panel-body > form > div:nth-child(1) > div:nth-child(1) > div > input"));
        $searchbox->sendKeys("Hand Preference");
        $clearform = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#panel-body > form > div:nth-child(2) > div > div.col-sm-4.col-sm-offset-4 > input"));
        $clearform->click();
        $assertText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("#panel-body > form > div:nth-child(1) > div:nth-child(1) > div > input"))->getText();
        $this->assertSame('',$assertText);
    }
}
?>
