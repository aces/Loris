<?php
/**
 * Help_editor automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__."/../../../test/integrationtest"
."s/LorisIntegrationTest.class.inc";
 /**
  * Help_editor automated integration tests
  *
  * PHP Version 5
  *
  * @category Test
  * @package  Loris
  * @author   Wang Shen <wangshen.mcin@gmail.com>
  * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
  * @link     https://github.com/aces/Loris
  */
class HelpEditorTestIntegrationTest extends LorisIntegrationTest
{

    /**
     * Insert testing data into the database
     *
     * @return none
     */
    function setUp()
    {
        parent::setUp();
        $this->DB->insert(
            "help",
            array(
             'helpID'   => '999999',
             'parentID' => '-1',
             'hash'     => '7292dd87f9a200f21bf40ded779a58c2',
             'topic'    => 'Test Topic',
             'content'  => 'This is a test content.',
             'created'  => '2013-04-05 00:00:00',
             'updated'  => 'NULL',
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
        $this->DB->delete("help", array('helpID' => '999999'));

    }

    /**
     * Tests that, when loading the help_editor module, some
     * text appears in the body.
     *
     * @category Test
     * @package  Loris
     * @author   Wang Shen <wangshen.mcin@gmail.com>
     * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
     * @link     https://github.com/aces/Loris
     *
     * @return void
     */
    function testHelpPageLoad()
    {
        $this->safeGet($this->url . "/help_editor/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertContains("Help Editor", $bodyText);
    }//end test_help_pageload()
    /**
     * Tests that, when loading the help_editor module > edit help submodule, some
     * text appears in the body.
     *
     * @return void
     */
function testPageLoad()
{
    $this->safeGet($this->url."/help_editor/edit_help_content/");
    $assertText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
        ->getText();

    $this->assertContains("Edit Help Content", $assertText);

}//end test_page_load()


    /**
     * Tests that, when loading the help editor, search Test Topic, click show data,
     * the Test Data should appear.
     *
     * @return void
     */
public function testSearchTopic()
{
    $this->safeGet($this->url.'/help_editor/');
    $searchbox = $this->webDriver
        ->findElement(WebDriverBy::Name("topic"));
    $searchbox->sendKeys("Test Topic");
    $showdata = $this->webDriver
        ->findElement(WebDriverBy::Name("filter"));
    $showdata->click();
    $assertText = $this->webDriver
        ->findElement(WebDriverBy::Id("Topic"))->getText();
    $this->assertContains("Test Topic", $assertText);

}//end test_search_topic()

    /**
     * Tests that, when loading the help editor, search the keywork with This is
     * a test content,
     * click show data, the hand preference should appear.
     *
     * @return void
     */
public function testSearchKeyword()
{
    $this->safeGet($this->url.'/help_editor/');
    $searchbox = $this->webDriver
        ->findElement(WebDriverBy::Name("keyword"));
    $searchbox->sendKeys("This is a test content.");
    $showdata = $this->webDriver
        ->findElement(WebDriverBy::Name("filter"));
    $showdata->click();
    $assertText = $this->webDriver
        ->findElement(WebDriverBy::Id("Topic"))->getText();
    $this->assertContains("Test Topic", $assertText);

}//end test_search_keyword()


    /**
     * Tests that, when loading the help editor, search Hand Preference,
     * click clear form, the text Hand Preference should disappear.
     *
     * @return void
     */
public function testClearForm()
{
    $this->safeGet($this->url.'/help_editor/');
    $searchbox = $this->webDriver
        ->findElement(WebDriverBy::Name("topic"));
    $searchbox->sendKeys("Hand Preference");
    $clearform = $this->webDriver
        ->findElement(WebDriverBy::Name("reset"));
    $clearform->click();
    $assertText = $this->webDriver
        ->findElement(WebDriverBy::Name("topic"))->getText();
    $this->assertEquals(null, $assertText);

}//end test_clear_form()


}//end class
?>
