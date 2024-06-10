<?php
/**
 * Battery Manager module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverSelect;

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Battery Manager module automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class BatteryManagerTest extends LorisIntegrationTest
{
    /**
     * Tests that, when loading the BatteryManager module, some
     * text appears in the body.
     *
     * @return void
     */
    function testBatteryManagerDoespageLoad()
    {
        $this->safeGet($this->url . "/battery_manager/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Battery Manager", $bodyText);
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
    }

    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testLoadsWithPermissionRead()
    {
        $this->setupPermissions(["battery_manager_view"]);
        $this->safeGet($this->url . "/battery_manager/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#dynamictable > thead > tr")
        )->getText();
        $this->assertStringNotContainsString(
            "Change Status",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "Edit Metadata",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testDoesNotLoadWithoutPermission()
    {
        $this->setupPermissions([]);
        $this->safeGet($this->url . "/battery_manager/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testLoadsWithPermissionEdit()
    {
        $this->setupPermissions(["battery_manager_edit"]);
        $this->safeGet($this->url . "/battery_manager/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#dynamictable > thead > tr")
        )->getText();
        $this->assertStringContainsString(
            "Change Status",
            $bodyText
        );
        $this->assertStringContainsString(
            "Edit Metadata",
            $bodyText
        );
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#dynamictable > tbody > tr:nth-child(1) > td:nth-child(13) > button"
            )
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div >".
                " div:nth-child(2) > div > div:nth-child(1)"
            )
        )->getText();
        $this->assertStringContainsString(
            "Edit Test",
            $bodyText
        );

        $this->resetPermissions();
    }
    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testEditform()
    {
        $this->safeGet($this->url . "/battery_manager/");
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#dynamictable > tbody > tr > td:nth-child(13) > button"
            )
        );
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div>div:nth-child(2)>div>div:nth-child(2)>form>".
                " div > div:nth-child(2) > div > div > select > option:nth-child(2)"
            )
        );

        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div> div:nth-child(2) > div > div:nth-child(2)".
                " > form > div > div:nth-child(3) > div > div > input"
            )
        )->clear()->sendKeys('0');
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#lorisworkspace>div> div:nth-child(2) > div > div:nth-child(2) ".
                "> form > div > div:nth-child(4) > div > div > input"
            )
        )->clear()->sendKeys('1');
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#lorisworkspace>div>div:nth-child(2)>div>div:nth-child(2)>form>".
                "div>div:nth-child(5) > div > div > select > option:nth-child(7)"
            )
        );
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div > div:nth-child(2) > div > div:nth-child(2)>".
                "form>div>div:nth-child(6) > div > div >select> option:nth-child(2)"
            )
        );
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div >div:nth-child(2) > div > div:nth-child(2) >".
                "form>div>div:nth-child(7) >div > div > select > option:nth-child(5)"
            )
        );

        $this->safeClick(
            WebDriverBy::cssSelector(
                "#lorisworkspace>div>div:nth-child(2)>div>div:nth-child(2)>form>".
                " div > div:nth-child(11) > div > div > button"
            )
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#swal2-title")
        )->getText();
        $this->assertStringContainsString(
            "Submission successful!",
            $bodyText
        );
    }

    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testAddNew()
    {
        $this->safeGet($this->url . "/battery_manager/");
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#default-panel > div > div > div.table-header >".
                " div > div > div:nth-child(2) > button:nth-child(1)"
            )
        );
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div > div:nth-child(2) > div > div:nth-child(2) ".
                "> form > div > div:nth-child(2)>div>div>select>option:nth-child(2)"
            )
        );

        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div > div:nth-child(2) > div ".
                "> div:nth-child(2)>form>div>div:nth-child(3) > div > div > input"
            )
        )->clear()->sendKeys('0');
        $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div > div:nth-child(2) > div >".
                " div:nth-child(2)>form > div > div:nth-child(4) > div > div >input"
            )
        )->clear()->sendKeys('1');
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div > div:nth-child(2)>div>div:nth-child(2)>form".
                " > div > div:nth-child(5) > div > div >select > option:nth-child(7)"
            )
        );
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#lorisworkspace > div >div:nth-child(2)>div>div:nth-child(2)>form ".
                "> div > div:nth-child(11) > div > div > button"
            )
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#swal2-title")
        )->getText();
        $this->assertStringContainsString(
            "Submission successful!",
            $bodyText
        );
    }


}
