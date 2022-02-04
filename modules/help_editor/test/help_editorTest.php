<?php
/**
 * Help editor automated integration tests
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
use Facebook\WebDriver\WebDriverBy;
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
     * @return void
     */
    function setUp(): void
    {
        parent::setUp();
        $md5String = md5("TestTestTest");
        $this->DB->insert(
            "help",
            [
                'helpID'  => '999999',
                'hash'    => $md5String,
                'topic'   => 'Test Topic',
                'content' => 'This is a test content.',
                'created' => '2013-04-05 00:00:00',
            ]
        );
    }
    /**
     * Delete testing data from database
     *
     * @return void
     */
    function tearDown(): void
    {
        parent::tearDown();
        $this->DB->delete("help", ['helpID' => '999999']);
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
        $bodyText = $this->safeFindElement(WebDriverBy::cssSelector("#breadcrumbs"))
            ->getText();
        $this->assertStringContainsString("Help Editor", $bodyText);
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

        $this->assertStringContainsString("Edit Help Content", $assertText);

    }//end test_page_load()

    /**
     * Tests that help editor loads with the permission
     *
     * @return void
     */
    function testHelpEditorPermission()
    {
         $this->setupPermissions(["context_help"]);
         $this->safeGet($this->url . "/help_editor/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
         $this->resetPermissions();
    }
    /**
     * Tests that help editor does not load with the permission
     *
     * @return void
     */
    function testHelpEditorWithoutPermission()
    {
         $this->setupPermissions([]);
         $this->safeGet($this->url . "/help_editor/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
         $this->resetPermissions();
    }
    /**
     * Tests that help editor does not load with the permission
     *
     * @return void
     */
    function testHelpEditorSearchByTopic()
    {
        $this->safeGet($this->url . "/help_editor/");
        $this->safeFindElement(
            WebDriverBy::Name("topic")
        )->sendKeys("Test Topic");
         //click the [show data] button
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#dynamictable>tbody:nth-child(2)>".
                "tr:nth-child(1)>td:nth-child(2)>a:nth-child(1)"
            )
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector('.panel-body')
        )->getText();
        $this->assertStringContainsString("test", $bodyText);
    }
    /**
     * Tests that help editor does not load with the permission
     *
     * @return void
     */
    function testHelpEditorSearchByKeyword()
    {
        $this->safeGet($this->url . "/help_editor/");
        $this->safeFindElement(
            WebDriverBy::Name("content")
        )->sendKeys("test");
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#dynamictable>tbody:nth-child(2)>".
                "tr:nth-child(1)>td:nth-child(2)>a:nth-child(1)"
            )
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector('.panel-body')
        )->getText();
        $this->assertStringContainsString("test", $bodyText);
    }

}

