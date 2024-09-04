<?php
/**
 * Document_repository automated integration tests
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
use Facebook\WebDriver\WebDriverBy;

require_once __DIR__ .
       "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Document_repository automated integration tests
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
class DocumentRepositoryTestIntegrationTest extends LorisIntegrationTest
{

    /**
     * Does basic setting up of Loris variables for this test,after testing
     * a test data, remove the testing data from database.
     *
     * @return void
     */
    public function setUp(): void
    {
        parent::setUp();
    }
    /**
     * Deleting test data
     *
     * @return void
     */
    public function tearDown(): void
    {
        parent::tearDown();
    }
     /**
      * Tests that configuration loads with the permission
      *
      * @return void
      */
    public function testSuperUserPermission()
    {
         $this->setupPermissions(["superuser"]);
         $this->safeGet($this->url . "/document_repository/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
        $this->resetPermissions();

    }



    /**
     * Tests that, when loading the document_repository module, some
     * text appears in the body.
     *
     * @return void
     */
    function testDocumentRepositoryDoespageLoad()
    {
        $this->safeGet($this->url . "/document_repository/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#bc2 > a:nth-child(2) > div")
        )->getText();
        $this->assertStringContainsString("Document Repository", $bodyText);
    }
    /**
     * Tests Upload page.
     *
     * @return void
     */
    function testDocumentRepositoryUploadPage()
    {
        $this->safeGet($this->url . "/document_repository/#upload");
        $text = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#upload > div > div > ".
                "form > div > div:nth-child(1) > h3"
            )
        )->getText();
        $this->assertStringContainsString("Upload files", $text);

    }
    /**
     * Tests Category page.
     *
     * @return void
     */
    function testDocumentRepositoryAddCategoryPage()
    {
        $this->safeGet($this->url . "/document_repository/#addCategory");
        $text = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#addCategory > div > div > form >".
                " div > div:nth-child(1) > h3"
            )
        )->getText();
        $this->assertStringContainsString("Add a category", $text);

    }
    /**
     * Tests add a Category .
     *
     * @return void
     */
    function testDocumentRepositoryAddCategory()
    {
        $this->safeGet($this->url . "/document_repository/#addCategory");
        $this->safeFindElement(
            WebDriverBy::Name("categoryName")
        )->sendKeys("test");
        $this->safeClick(
            WebDriverBy::cssSelector(
                "
              #addCategory > div > div > ".
                "form > div > div:nth-child(6) > div > div > button
            "
            )
        );
        $this->safeGet($this->url . "/document_repository/");
        $text = $this->safeFindElement(
            WebDriverBy::cssSelector("#dynamictable")
        )->getText();
        $this->assertStringContainsString("test", $text);

    }
}


