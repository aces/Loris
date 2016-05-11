<?php
/**
 * Configuration module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Tara Campbell <tara.campbell@mail.mcgill.ca>
 * @author   Wang Shen <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc"

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
     * Tests links, click each link, the particular content shows on the page.
     *
     * @return void
     */
    public function testAllLinks()
    {
        $this->safeGet($this->url . "/configuration/");
        $contentArea = WebDriverBy::cssSelector("body");

        $this->linkTest(
            WebDriverBy::linkText("Study"),
            $contentArea,
            "Settings related to details of the study"
        );
        $this->linkTest(
            WebDriverBy::linkText("Paths"),
            $contentArea,
            "pecify directories where LORIS-related files are stored or created."
        );
        $this->linkTest(
            WebDriverBy::linkText("GUI"),
            $contentArea,
            "Settings related to the overall display of LORIS"
        );
        $this->linkTest(
            WebDriverBy::linkText("WWW"),
            $contentArea,
            "Web address settings"
        );
        $this->linkTest(
            WebDriverBy::linkText("Dashboard"),
            $contentArea,
            "Settings that affect the appearance of the dashboard and its charts"
        );
        $this->linkTest(
            WebDriverBy::linkText("DICOM Archive"),
            $contentArea,
            "DICOM Archive settings"
        );
        $this->linkTest(
            WebDriverBy::linkText("Statistics"),
            $contentArea,
            "Statistics module settings"
        );
        $this->linkTest(
            WebDriverBy::linkText("Email"),
            $contentArea,
            "LORIS email settings"
        );
        $this->linkTest(
            WebDriverBy::linkText("Uploads"),
            $contentArea,
            "Settings related to file uploading"
        );
        $this->linkTest(
            WebDriverBy::linkText("API Keys"),
            $contentArea,
            "Specify any API keys required for LORIS"
        );
    }
    /**
     * Tests that configration loads with the permission
     *
     * @return void
     */
    function testConfigPermission()
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
     * Tests that conflict resolver does not load with the permission
     *
     * @return void
     */
    function testConfigWithoutPermission()
    {
         $this->setupPermissions(array());
         $this->safeGet($this->url . "/configuration/");
         $bodyText = $this->webDriver->findElement(
             WebDriverBy::cssSelector("body")
         )->getText();
         $this->assertContains("You do not have access to this page.", $bodyText);
         $this->resetPermissions();
    }

}
?>
