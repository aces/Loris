<?php
/**
 * Configuration module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__
    . "/../../../test/integrationtests/".
    "LorisIntegrationTest.class.inc";
/**
 * Configuration module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ConfigurationTest extends LorisIntegrationTest
{
    /**
     * Insert test data
     *
     * @return void
     */
    function setUp(): void
    {
        parent::setUp();
        $window = new WebDriverWindow($this->webDriver);
        $size   = new WebDriverDimension(1280, 1024);
        $window->setSize($size);
    }

    /**
     * Delete test data
     *
     * @return void
     */
    public function tearDown(): void
    {
        $this->DB->delete(
            "subproject",
            array('title' => 'Test Test Test')
        );
        parent::tearDown();
    }

    /**
     * Tests that, when loading the Configuration module, the word
     * "Configuration" appears somewhere on the page
     *
     * @return void
     */
    public function testConfigurationPageLoads(): void
    {
        $this->safeGet($this->url . "/configuration/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertRegexp(
            "/Please enter the various configuration variables/",
            $bodyText
        );
    }
    /**
     * Tests that configuration loads with the permission
     *
     * @return void
     */
    public function testConfigPermission(): void
    {
         $this->setupPermissions(array("config"));
         $this->safeGet($this->url . "/configuration/");
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
     * Tests that configuration can not load without the permission
     *
     * @return void
     */
    public function testConfigWithoutPermission(): void
    {
         $this->setupPermissions(array());
         $this->safeGet($this->url . "/configuration/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertStringContainsString(
             "You do not have access to this page.",
             $bodyText
         );
         $this->resetPermissions();
    }
    /**
     * Tests that subproject panel in configuration
     *
     * @return void
     */
    public function testSubproject(): void
    {
         $this->safeGet($this->url . "/configuration/subproject/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertStringContainsString("SubprojectID", $bodyText);
    }
    /**
     * Tests that subproject navigate back to config page
     *
     * @return void
     */
    private function _testSubprojectBreadcrumbs(): void
    {
         $this->safeGet($this->url . "/configuration/subproject/");
         $webElement = $this->safeFindElement(
             WebDriverBy::Xpath("//*[@id='bc2']/a[2]/div")
         )->click();
         $bodyText   = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();

         $this->assertStringContainsString(
             "To configure study subprojects click here.",
             $bodyText
         );
    }
    /**
     * Tests links, click each link, the particular content shows on the page.
     *
     * @return void
     */
    public function testAllLinks(): void
    {

        $this->safeGet($this->url . "/configuration/");
        $this->_linkTest("Study");
        $this->_linkTest("Paths");
        $this->_linkTest("GUI");
        $this->_linkTest("WWW");
        $this->_linkTest("Dashboard");
        $this->_linkTest("Imaging Modules");
        // $this->_linkTest("Statistics"); will be rewritten by REACT test
        $this->_linkTest("Email");
        $this->_linkTest("Uploads");
        $this->_linkTest("API Keys");

    }
    /**
      * Add a method for testing the link. After click the link,the page
      * shows particular content.
      *
      * @param string $text the text that should be shown in the assert.
      *
      * @return void
      */
    private function _linkTest($text): void
    {
        $this->safeClick(WebDriverBy::linkText($text));
        $webActives = $this->webDriver->findElements(
            WebDriverBy::cssSelector(".active")
        );
        $bodyText   = $webActives[1]->getText();
        $this->assertStringContainsString($text, $bodyText);
    }

    /**
      *  If test on local machine, then run this function.
      *
      *  @return void
      */
    public function testLocal(): void
    {
        $config  =& NDB_Config::singleton();
        $dev     = $config->getSetting("dev");
        $sandbox = $dev['sandbox'];
        if ($sandbox == '1') {

            $this->_testSubprojectBreadcrumbs();
            $this->_testProjectsLink();
        } else {
            $this->assertEquals(true, 1);
        }
    }
    /**
      * Test project link appears
      *
      *  @return void
      */
    private function _testProjectsLink(): void
    {
        $this->safeGet($this->url . "/configuration/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "To configure study projects click here.",
            $bodyText
        );
    }

}

