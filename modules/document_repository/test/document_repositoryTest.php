<?php
/**
 * document_repository automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ . 
       "/../../../test/integrationtests/LorisIntegrationTestForDocRepo.class.inc";
class documentRepositoryTestIntegrationTest extends LorisIntegrationTestForDocRepo
{
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
                          WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Document Repository", $bodyText);
    }
    /**
     * Tests creating a category and a sub category.
     *
     * @return void
     */
    function testDocumentRepositoryCreateCategory()
    {
       //insert a category TestTestTest
        $this->safeGet($this->url . "/document_repository/");
        $this->safeFindElement(WebDriverBy::Name("addCategory"))->click();
        $this->safeFindElement(WebDriverBy::Name(
                      "category_name"),2000)->sendKeys("TestTestTest");
        $this->safeFindElement(WebDriverBy::Id("postCategory"))->click();
        sleep(10);
        $selectAll = $this->webDriver->findElement(
                    WebDriverBy::Id("dir-tree"))->getText();
        $this->assertContains("TestTestTest", $selectAll);
       
       //insert a sub category test under TestTestTest
        $this->safeGet($this->url . "/document_repository/");
        $this->safeFindElement(WebDriverBy::Name("addCategory"))->click();
        $this->safeFindElement(WebDriverBy::Name("category_name"),
                       2000)->sendKeys("test");
        $select = $this->safeFindElement(WebDriverBy::Id("parent_id"));
        $element = new WebDriverSelect($select);
        $element->selectByVisibleText("TestTestTest");
        $this->safeFindElement(WebDriverBy::Id("postCategory"))->click();
        sleep(10);
        $this->safeFindElement(
               WebDriverBy::Xpath("//*[@id='TestTestTesta']/td/span"))->click();
        $test = $this->safeFindElement(WebDriverBy::Id("testa"))->getText();
        $this->assertContains("test", $test);

    }
}
?>
