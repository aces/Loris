<?php
/**
 * Media module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Media module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class MediaTest extends LorisIntegrationTest
{

    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */

    function testUpload()
    {
        $this->safeGet($this->url . "/media/ajax/FileUpload.php?action=getData");sleep(30);
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        print_r($bodyText);
        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
    function testAajx()
    {
        $this->safeGet($this->url . "/media/ajax/FileUpload.php?action=getData&idMediaFile=1");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        print_r($bodyText);
        $this->assertNotContains("You do not have access to this page.", $bodyText);
        $this->resetPermissions();
    }
}
?>
