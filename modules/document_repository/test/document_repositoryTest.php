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
    public function setUp()
    {
        parent::setUp();
    }
    /**
     * Deleting test data
     *
     * @return void
     */
    public function tearDown()
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
         $this->setupPermissions(array("superuser"));
         $this->safeGet($this->url . "/document_repository/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertNotContains(
             "You do not have access to this page.",
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
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("test", $bodyText);
    }
    /**
     * Tests Upload page.
     *
     * @return void
     */
    function testDocumentRepositoryUploadPage()
    {
        $this->markTestSkipped("This method isn't working properly on travis.");
        $this->safeGet($this->url . "/document_repository/");
        $this->webDriver->executescript(
            "document.querySelector('#tab-upload').click()"
        );sleep(300);
        $text = $this->webDriver->executescript(
            "return document.querySelector('#upload > div > div > form > div >".
            "div:nth-child(1) > h3').textContent"
        );
        $this->assertContains("Upload a file", $text);

    }
    /**
     * Tests that, upload function in document_repository module
     *
     * @return void
     */
    function testDocumentRepositoryUploadFile()
    {
        //check a upload file under TestTestTest category
        $this->markTestSkipped("This method isn't working properly on travis.");
        $this->safeGet($this->url . "/document_repository/");
        $this->safeFindElement(
            WebDriverBy::Xpath("//*[@id='TESTTESTTESTTESTa']/td/span"),
            3000
        )->click();
        $test = $this->safeFindElement(
            WebDriverBy::linkText("README.md")
        )->getText();
        $this->assertContains("README.md", $test);

    }
    /**
     * Tests that, upload function in document_repository module
     *
     * @return void
     */
    function testDocumentRepositoryUploadFileEditDeleteComment()
    {
        $this->markTestSkipped("This method isn't working properly on travis.");
         $this->safeGet($this->url . "/document_repository/");
         $this->safeFindElement(
             WebDriverBy::Xpath("//*[@id='TESTTESTTESTTESTa']/td/span")
         )->click();
         $this->safeFindElement(
             WebDriverBy::Id("9999999")
         )->click();

         // modify comment,search it and check it
         $select  = $this->safeFindElement(WebDriverBy::Id("categoryEdit"));
         $element = new WebDriverSelect($select);
         $element->selectByVisibleText("TESTTESTTESTTEST");
         $site        = $this->safeFindElement(WebDriverBy::Id("siteEdit"));
         $elementSite = new WebDriverSelect($site);
         $elementSite->selectByVisibleText("Any");
         $this->safeFindElement(WebDriverBy::Id("commentsEdit"))
             ->sendKeys("This is a test comment!");
         $this->safeFindElement(WebDriverBy::Id("postEdit"))->click();
         sleep(3);

         $this->safeFindElement(
             WebDriverBy::Name("File_name")
         )->sendKeys("README.md");
         $this->safeFindElement(
             WebDriverBy::Name("filter")
         )->click();
         $text = $this->safeFindElement(
             WebDriverBy::cssSelector("#dir-tree > tr"),
             3000
         )
             ->getText();
         $this->assertContains("This is a test comment!", $text);

         // delete upload file

         $this->safeFindElement(
             WebDriverBy::linkText("Delete"),
             3000
         )->click();

         $this->safeFindElement(WebDriverBy::Id("postDelete"))->click();
         $this->safeFindElement(
             WebDriverBy::Name("File_name")
         )->sendKeys("README.md");
         $this->safeFindElement(
             WebDriverBy::Name("filter")
         )->click();
         sleep(3);
         $text = $this->safeFindElement(WebDriverBy::cssSelector("tbody"), 3000)
             ->getText();
         $this->assertEquals('', $text);

    }
}


