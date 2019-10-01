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
        $bodyText = $this->getReactElementContent(
                       'body'
                    );
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
    public function testConfigPermission()
    {
         $this->setupPermissions(array("config"));
         $this->safeGet($this->url . "/configuration/");
         $bodyText = $this->getReactElementContent(
                       'body'
                    );
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
         $bodyText = $this->getReactElementContent(
                       'body'
                    );
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
         $bodyText = $this->getReactElementContent('body');
         $this->assertContains("SubprojectID", $bodyText);
    }
    /**
     * Tests links, click each link, the particular content shows on the page.
     *
     * @return void
     */
    public function testAllLinks()
    {

        $this->safeGet($this->url . "/configuration/");
        $this->_linkTest("study");
        $this->_linkTest("paths");
        $this->_linkTest("gui");
        $this->_linkTest("www");
        $this->_linkTest("dashboard");
        $this->_linkTest("imaging_modules");
        $this->_linkTest("statistics");
        $this->_linkTest("mail");
        $this->_linkTest("uploads");
        $this->_linkTest("imaging_pipeline");

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
        $href = "document.querySelector(\"[href='#".$text."']\").click()";
        $this->webDriver->executescript("$href");
        $bodyText = $this->webDriver->executescript("
                  return document.querySelector('.active').textContent"
        );
        $text = str_replace("_", " ", $text);
        $this->assertContains($text,strtolower($bodyText));
    }

}

