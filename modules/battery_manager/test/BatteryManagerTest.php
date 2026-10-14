<?php declare(strict_types=1);

/**
 * Battery Manager module automated integration tests
 *
 * PHP Version 8
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverWait;
use Facebook\WebDriver\WebDriverSelect;

require_once __DIR__ .
    "/../../../test/integrationtests/LorisIntegrationTest.class.inc";

/**
 * Battery Manager module automated integration tests
 *
 * PHP Version 8
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class BatteryManagerTest extends LorisIntegrationTest
{
    //Filter locations
    static $instrument = 'select[name="testName"]';
    static $minimumAge = 'input[name="minimumAge"]';
    static $maximumAge = 'input[name="maximumAge"]';
    //General locations
    static $display     = '.table-header > div > div > div:nth-child(1)';
    static $clearFilter = '.nav-tabs a';
    //Action locations
    static $newTest          = 'button.action-new-test';
    static $editMetadata     = '.action-edit-metadata button';
    static $activate         = '.action-activate button';
    static $deactivate       = '.action-deactivate button';
    static $firstRowCheckbox = '#dynamictable > tbody > tr:nth-child(1) '
        . 'input[type="checkbox"]';
    static $modalForm        = 'form[name="modal"]';

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
            "An error occurred while loading the page.",
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
        $this->assertCount(
            0,
            $this->webDriver->findElements(
                WebDriverBy::cssSelector(self::$editMetadata)
            )
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
     * Tests filter in the form.
     * Uses explicit waits to handle React re-render timing.
     *
     * @return void
     */
    function testFilter()
    {
        $this->safeGet($this->url . "/battery_manager/");

        // Wait for data to load before filtering
        $this->_waitForFilterResult(self::$display, 'rows displayed');

        // Test instrument filter (select dropdown)
        $el = new WebDriverSelect(
            $this->safeFindElement(
                WebDriverBy::cssSelector(self::$instrument)
            )
        );
        $el->selectByVisibleText('AOSI');
        $text = $this->_waitForFilterResult(
            self::$display,
            '3 rows'
        );
        $this->assertStringContainsString('3 rows', $text);
        $this->safeClick(WebDriverBy::cssSelector(self::$clearFilter));
        $this->_waitForFilterResult(self::$display, 'rows displayed');

        // Test minimumAge filter (text input)
        $el = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$minimumAge)
        );
        $el->sendKeys('4300');
        $text = $this->_waitForFilterResult(
            self::$display,
            '1 row'
        );
        $this->assertStringContainsString('1 row', $text);
        $this->safeClick(WebDriverBy::cssSelector(self::$clearFilter));
        $this->_waitForFilterResult(self::$display, 'rows displayed');

        // Test maximumAge filter (text input)
        $el = $this->safeFindElement(
            WebDriverBy::cssSelector(self::$maximumAge)
        );
        $el->sendKeys('0');
        $text = $this->_waitForFilterResult(
            self::$display,
            '0 rows'
        );
        $this->assertStringContainsString('0 rows', $text);
        $this->safeClick(WebDriverBy::cssSelector(self::$clearFilter));
    }

    /**
     * Waits for the display element to contain the expected text.
     * Polls every 500ms for up to 10 seconds.
     *
     * @param string $selector CSS selector for display element
     * @param string $expected Expected substring in display text
     *
     * @return string The display text once it contains the expected string
     */
    private function _waitForFilterResult(
        string $selector,
        string $expected
    ): string {
        $resultText = '';
        $wait       = new WebDriverWait($this->webDriver, 10, 500);
        $wait->until(
            function () use ($selector, $expected, &$resultText) {
                $resultText = $this->webDriver->findElement(
                    WebDriverBy::cssSelector($selector)
                )->getText();
                return strpos($resultText, $expected) !== false;
            },
            "Timed out waiting for '$expected' in '$selector'"
        );
        return $resultText;
    }

    /**
     * Tests that a user with edit permission sees the row actions and can
     * open the edit form for a selected row.
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
        $this->safeFindElement(WebDriverBy::cssSelector(self::$editMetadata));
        $this->safeFindElement(WebDriverBy::cssSelector(self::$activate));
        $this->safeFindElement(WebDriverBy::cssSelector(self::$deactivate));

        $this->_openEditForm();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString(
            "Edit Test",
            $bodyText
        );

        $this->resetPermissions();
    }

    /**
     * Tests editing the selected test through the Edit Metadata row action.
     *
     * @return void
     */
    function testEditform()
    {
        $this->safeGet($this->url . "/battery_manager/");
        $this->_openEditForm();
        $this->_fillTestForm();
        $this->_submitTestForm();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#swal2-title")
        )->getText();
        $this->assertStringContainsString(
            "Submission Successful!",
            $bodyText
        );
    }

    /**
     * Tests adding a new test through the New Test action.
     *
     * @return void
     */
    function testAddNew()
    {
        $this->safeGet($this->url . "/battery_manager/");
        $this->safeClick(WebDriverBy::cssSelector(self::$newTest));
        $this->_fillTestForm();
        $this->_submitTestForm();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#swal2-title")
        )->getText();
        $this->assertStringContainsString(
            "Submission Successful!",
            $bodyText
        );
    }

    /**
     * Tests changing the status of the selected test through the
     * Deactivate row action.
     *
     * @return void
     */
    function testActivebtn()
    {
        $this->safeGet($this->url . "/battery_manager/");
        $this->safeClick(WebDriverBy::cssSelector(self::$firstRowCheckbox));
        $this->safeClick(WebDriverBy::cssSelector(self::$deactivate));
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#swal2-title")
        )->getText();
        $this->assertStringContainsString(
            "Submission Successful!",
            $bodyText
        );
    }

    /**
     * Selects the first row and opens the Edit Metadata form.
     *
     * @return void
     */
    private function _openEditForm(): void
    {
        $this->safeClick(WebDriverBy::cssSelector(self::$firstRowCheckbox));
        $this->safeClick(WebDriverBy::cssSelector(self::$editMetadata));
        $this->safeFindElement(
            WebDriverBy::cssSelector(self::$modalForm . ' [name="ageMinDays"]')
        );
    }

    /**
     * Fills the open test form with valid values.
     *
     * @return void
     */
    private function _fillTestForm(): void
    {
        $instrument = new WebDriverSelect(
            $this->safeFindElement(
                WebDriverBy::cssSelector(
                    self::$modalForm . ' select[name="testName"]'
                )
            )
        );
        $instrument->selectByIndex(2);
        $this->safeFindElement(
            WebDriverBy::cssSelector(self::$modalForm . ' [name="ageMinDays"]')
        )->clear()->sendKeys('0');
        $this->safeFindElement(
            WebDriverBy::cssSelector(self::$modalForm . ' [name="ageMaxDays"]')
        )->clear()->sendKeys('1');
        $stage = new WebDriverSelect(
            $this->safeFindElement(
                WebDriverBy::cssSelector(
                    self::$modalForm . ' select[name="stage"]'
                )
            )
        );
        $stage->selectByIndex(1);
    }

    /**
     * Submits the open test form.
     *
     * @return void
     */
    private function _submitTestForm(): void
    {
        $this->safeClick(
            WebDriverBy::xpath(
                '//form[@name="modal"][.//*[@name="ageMinDays"]]' .
                '//button[@type="submit"]'
            )
        );
    }
}
