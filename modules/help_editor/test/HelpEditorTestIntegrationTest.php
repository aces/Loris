<?php declare(strict_types=1);

/**
 * Help editor automated integration tests
 *
 * PHP Version 8
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
  * PHP Version 8
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
    }

    /**
     * Delete testing data from database
     *
     * @return void
     */
    function tearDown(): void
    {
        parent::tearDown();
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
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
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
        )->sendKeys("bmi");

        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector('.panel-body')
        )->getText();
        $this->assertStringContainsString("bmi", $bodyText);
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
        )->sendKeys("BMI");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector('.panel-body')
        )->getText();
        $this->assertStringContainsString("BMI", $bodyText);
    }
}

