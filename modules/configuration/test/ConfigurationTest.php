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
    function setUp()
    {
        parent::setUp();
        $window = new WebDriverWindow($this->webDriver);
        $size   = new WebDriverDimension(1280, 1024);
        $window->setSize($size);
        $this->setUpConfigSetting("useProjects", "false");
    }

    /**
     * Delete test data
     *
     * @return void
     */
    public function tearDown()
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
    public function testConfigurationPageLoads()
    {
        $this->safeGet($this->url . "/configuration/");

        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Configuration", $bodyText);
    }
    /**
     * Tests that configuration loads with the permission
     *
     * @return void
     */
    public function testConfigPermission()
    {
         $this->setupPermissions(array("config"));
         $this->safeGet($this->url . "/configuration/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertNotContains("You do not have access to this page.", $bodyText);
         $this->resetPermissions();
    }
    /**
     * Tests that configuration can not load without the permission
     *
     * @return void
     */
    public function testConfigWithoutPermission()
    {
         $this->setupPermissions(array());
         $this->safeGet($this->url . "/configuration/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertContains("You do not have access to this page.", $bodyText);
         $this->resetPermissions();
    }
    /**
     * Tests that subproject panel in configuration
     *
     * @return void
     */
    public function testSubproject()
    {
         $this->safeGet($this->url . "/configuration/subproject/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertContains("SubprojectID", $bodyText);
    }
    /**
     * Tests that subproject navigate back to config page
     *
     * @return void
     */
    private function _testSubprojectBreadcrumbs()
    {
         $this->safeGet($this->url . "/configuration/subproject/");
         $webElement = $this->safeFindElement(
             WebDriverBy::Xpath("//*[@id='bc2']/a[2]/div")
         )->click();
         sleep(2);
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();

         $this->assertContains(
             "To configure study subprojects click here.",
             $bodyText
         );
    }
    /**
     * Tests links, click each link, the particular content shows on the page.
     *
     * @return void
     */
    public function testAllLinks()
    {

        $this->safeGet($this->url . "/configuration/");
        $this->_linkTest("Study");
        $this->_linkTest("Paths");
        $this->_linkTest("GUI");
        $this->_linkTest("WWW");
        $this->_linkTest("Dashboard");
        $this->_linkTest("Imaging Modules");
        $this->_linkTest("Statistics");
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
    private function _linkTest($text)
    {
        $webElement = $this->safeFindElement(WebDriverBy::linkText($text))->click();
        $webActives = $this->webDriver->findElements(
            WebDriverBy::cssSelector(".active")
        );
        $bodyText   = $webActives[1]->getText();
        $this->assertContains($text, $bodyText);

    }

    /**
      *  If test on local machine, then run this function.
      *
      *  @return void
      */
    public function testLocal()
    {
        $config  =& NDB_Config::singleton();
        $dev     = $config->getSetting("dev");
        $sandbox = $dev['sandbox'];
        if ($sandbox == '1') {

            $this->_testSubprojectBreadcrumbs();
            $this->_testUseProjects();

        }
    }
    /**
      * Test setting useProjects , if useProjects =
      *
      *  @return void
      */
    private function _testUseProjects()
    {
        $this->safeGet($this->url . "/configuration/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains(
            "To configure study projects click here.",
            $bodyText
        );

        $this->setUpConfigSetting("useProjects", "true");
        sleep(5);
        $this->safeGet($this->url . "/configuration/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains(
            "To configure study projects click here.",
            $bodyText
        );
        $this->setUpConfigSetting("useProjects", "false");
    }

}
?>
