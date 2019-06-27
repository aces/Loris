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
    public function setUp(): void
    {
        parent::setUp();
        $window = new WebDriverWindow($this->webDriver);
        $size   = new WebDriverDimension(1024, 1768);
        $window->setSize($size);
        $this->DB->insert(
            "document_repository_categories",
            array(
             'id'            => '9999999',
             'category_name' => 'TESTTESTTESTTEST',
             'parent_id'     => '0',
             'comments'      => 'Test Comment',
            )
        );
        $this->DB->insert(
            "document_repository",
            array(
             'record_id'     => '9999999',
             'Date_uploaded' => '2016-05-16 15:34:35',
             'Data_dir'      => 'admin/README.md',
             'File_name'     => 'README.md',
             'File_type'     => 'NULL',
             'File_size'     => '3305',
             'uploaded_by'   => 'admin',
             'For_site'      => '3',
             'comments'      => 'tester',
             'EARLI'         => '0',
             'hide_video'    => '0',
             'File_category' => '9999999',
            )
        );

    }
    /**
     * Deleting test data
     *
     * @return void
     */
    public function tearDown(): void
    {
        $this->DB->delete(
            "document_repository_categories",
            array('category_name' => 'TestTestTest')
        );
        $this->DB->delete(
            "document_repository_categories",
            array('category_name' => 'test')
        );
        $this->DB->delete(
            "document_repository",
            array('record_id' => '9999999')
        );
        $this->DB->delete(
            "document_repository_categories",
            array('id' => '9999999')
        );
        parent::tearDown();
    }
     /**
      * Tests that configuration loads with the permission
      *
      * @return void
      */
    public function testSuperUserPermission(): void
    {
         $this->setupPermissions(array("superuser"));
         $this->safeGet($this->url . "/document_repository/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertStringNotContainsString(
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
    function testDocumentRepositoryDoespageLoad(): void
    {
        $this->safeGet($this->url . "/document_repository/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertRegexp("/Upload File/", $bodyText);
    }
    /**
     * Tests creating a category and a sub-category.
     *
     * @return void
     */
    function testDocumentRepositoryCreateCategory(): void
    {
        //insert a category TestTestTest
        $this->markTestSkipped("This method isn't working properly on travis.");
        $this->safeGet($this->url . "/document_repository/");
        $this->safeFindElement(
            WebDriverBy::Name("addCategory"),
            3000
        )->click();
        sleep(3);
        $this->safeFindElement(
            WebDriverBy::Name(
                "category_name"
            )
        )->sendKeys("TestTestTest");
        $this->safeFindElement(WebDriverBy::Id("postCategory"))->click();
        sleep(3);
        $selectAll = $this->webDriver->findElement(
            WebDriverBy::Id("dir-tree")
        )->getText();
        $this->assertStringContainsString("TestTestTest", $selectAll);

        //insert a sub category test under TestTestTest
        $this->safeGet($this->url . "/document_repository/");
        $this->safeFindElement(WebDriverBy::Name("addCategory"), 2000)
            ->click();
        $this->safeFindElement(
            WebDriverBy::Name("category_name")
        )->sendKeys("test");
        $select  = $this->safeFindElement(WebDriverBy::Id("parent_id"));
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText("TestTestTest");
        $this->safeFindElement(WebDriverBy::Id("postCategory"))->click();
        sleep(3);
        $this->safeFindElement(
            WebDriverBy::Xpath("//*[@id='TestTestTesta']/td/span"),
            3000
        )->click();
        $test = $this->safeFindElement(WebDriverBy::Id("testa"))
            ->getText();
        $this->assertStringContainsString("test", $test);

    }
    /**
     * Tests that, upload function in document_repository module
     *
     * @return void
     */
    function testDocumentRepositoryUploadFile(): void
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
        $this->assertStringContainsString("README.md", $test);

    }
    /**
     * Tests that, upload function in document_repository module
     *
     * @return void
     */
    function testDocumentRepositoryUploadFileEditDeleteComment(): void
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
         $this->assertStringContainsString("This is a test comment!", $text);

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


