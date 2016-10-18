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
        $this->_linkTest("DICOM Archive");
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
}
?>
