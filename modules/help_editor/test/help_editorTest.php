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
        $window = new WebDriverWindow($this->webDriver);
        $window->maximize();
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
        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("body"))
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
        $assertText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )
            ->getText();

        $this->assertContains("Edit Help Content", $assertText);

    }//end test_page_load()


    /**
     * Tests that, when loading the help editor, search Test Topic, click show data
     * the Test Data should appear.
     *
     * @return void
     */
    public function testSearchTopic()
    {
        $this->safeGet($this->url.'/help_editor/');
      try{
        $searchbox = $this->safeFindElement(WebDriverBy::Name("topic"));
        $searchbox->sendKeys("Test Topic");
        $showdata  = $this->safeClick(
                WebDriverBy::Xpath(
                    "//*[@id='panel-body']".
                    "/form/div[2]/div/div[1]/input"
                )
            );
        $assertText = $this->safeFindElement(WebDriverBy::Id("Topic"))->getText();
        $this->assertContains("Test Topic", $assertText);
        }catch (WebDriverException $ex){}
    }//end test_search_topic()

    /**
     * Tests that, when loading the help editor, search the keyword with This is
     * a test content, click show data, the Test Topic should appear.
     *
     * @return void
     */
    public function testSearchKeyword()
    {
      try{
        $this->safeGet($this->url.'/help_editor/');
        $searchbox = $this->safeFindElement(WebDriverBy::Name("keyword"));
        $searchbox->sendKeys("This is a test content.");
        $showdata = $this->safeClick(
                WebDriverBy::Xpath(
                    "//*[@id='panel-body']".
                    "/form/div[2]/div/div[1]/input"
                )
            );
        $assertText = $this->safeFindElement(WebDriverBy::Id("Topic"))->getText();
        $this->assertContains("Test Topic", $assertText);
        }catch (WebDriverException $ex){}
    }//end test_search_keyword()
    /**
     * Tests that, when loading the help editor, search the keyword with This is
     * a test content, click show data, and link to detail.
     *
     * @return void
     */
    public function testSearchKeywordLinkToDetail()
    {
        try{
        $this->safeGet($this->url.'/help_editor/');
        $searchbox = $this->safeFindElement(WebDriverBy::Name("keyword"));
        $searchbox->sendKeys("This is a test content.");
        $showdata = $this->safeClick(
                WebDriverBy::Xpath(
                    "//*[@id='panel-body']".
                    "/form/div[2]/div/div[1]/input"
                )
            );
        $linkDetail = $this->safeClick(
            WebDriverBy::Xpath("//*[@id='Topic']/a")
        );
        $assertText = $this->safeFindElement(
            WebDriverBy::XPath(
                "//*[@id='edit_help_content']/div/div/div[2]/div/textarea"
            )
        )->getText();
        $this->assertContains("This is a test content.", $assertText);
        }catch (WebDriverException $ex){}
    }//end test_search_keyword_to_detail()



    /**
     * Tests that, when loading the help editor, search Hand Preference,
     * click clear form, the text Hand Preference should disappear.
     *
     * @return void
     */
    public function testClearForm()
    {
      try{
        $this->safeGet($this->url.'/help_editor/');
        $searchbox = $this->safeFindElement(WebDriverBy::Name("topic"));
        $searchbox->sendKeys("Hand Preference");
        $clearform = $this->safeClick(
                WebDriverBy::Xpath(
                    "//*[@id='panel-body']/".
                    "form/div[2]/div/div[2]/input"
                )
            );
        $assertText = $this->safeFindElement(WebDriverBy::Name("topic"))->getText();
        $this->assertEquals(null, $assertText);
        }catch (WebDriverException $ex){}
    }//end test_clear_form()

    /**
     * Tests that help editor loads with the permission
     *
     * @return void
     */
    function testHelpEditorPermission()
    {
         $this->setupPermissions(array("context_help"));
         $this->safeGet($this->url . "/help_editor/");
         $bodyText = $this->safeFindElement(
             WebDriverBy::XPath("//*[@id='lorisworkspace']/table/tbody/tr/td[1]")
         )->getText();
         $this->assertContains("List of Topics", $bodyText);
         $this->resetPermissions();
    }
    /**
     * Tests that help editor does not load with the permission
     *
     * @return void
     */
    function testHelpEditorWithoutPermission()
    {
         $this->setupPermissions(array());
         $this->safeGet($this->url . "/help_editor/");
         $bodyText = $this->safeFindElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertContains("You do not have access to this page.", $bodyText);
         $this->resetPermissions();
    }

}
?>                
