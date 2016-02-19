<?php
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

require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

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

        $breadcrumbText = $this->webDriver->findElement(
            WebDriverBy::xPath("//div[@class='page-content inset']/div/a/label")
        )->getText();
        $this->assertEquals("Configuration", $breadcrumbText);
    }

    /**
     * Verify that Config module appears in Admin main menu only
     * if the user has permission "config".
     *
     * @return void
     */
    public function testConfigurationMenuDisplayWithPermission()
    {
        $this->setupPermissions(array('config'));

        $this->webDriver->navigate()->refresh();

        $configMenu = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "
                //ul[@class='nav navbar-nav']
                //a[contains(text(), 'Admin')]
                /..
                /ul[@class='dropdown-menu']
                //a[contains(text(), 'Configuration')]
                "
            )
        );
        $this->assertCount(
            1,
            $configMenu,
            "There must be exacly 1 configuration menu when the user have permission"
        );
    }

    /**
     * Verify that Config module appears in Admin main menu only
     * if the user has permission "config".
     *
     * @return void
     */
    public function testConfigurationMenuDisplayWithoutPermission()
    {
        $this->setupPermissions(array());

        $this->webDriver->navigate()->refresh();

        $configMenu = $this->webDriver->findElements(
            WebDriverBy::xPath(
                "   
                //ul[@class='nav navbar-nav']
                //a[contains(text(), 'Admin')]
                /..
                /ul[@class='dropdown-menu']
                //a[contains(text(), 'Configuration')]
                "
            )
        );
        $this->assertCount(
            0,
            $configMenu,
            "Configuration menu must not be there if user don't have permission"
        );
    }

}
?>
