<?php declare(strict_types=1);

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
use Facebook\WebDriver\WebDriverBy;
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
    //$location: css selector for react items
    static $FileName    = 'input[name="fileName"]';
    static $PSCID       = 'input[name="pscid"]';
    static $VisitLabel  = 'select[name="visitLabel"]';
    static $Instrument  = 'select[name="instrument"]';
    static $Language    = 'select[name="language"]';
    static $Site        = 'select[name="site"]';
    static $clearFilter = ".navbar-right:nth-child(1) a";
    // first row of react table
    static $table = "#dynamictable > tbody > tr:nth-child(1)";
    // rows displayed of
    static $display = ".table-header > .row > div > div:nth-child(1)";
    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testLoadsWithPermissionRead()
    {
        $this->setupPermissions(["media_read"]);
        $this->safeGet($this->url . "/media/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
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
    function testLoadsWithPermissionWrite()
    {
        $this->setupPermissions(["media_write"]);
        $this->safeGet($this->url . "/media/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString(
            "You do not have access to this page.",
            $bodyText
        );
        $this->assertStringNotContainsString(
            "An error occured while loading the page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testDoesNotLoadWithoutPermission()
    {
        $this->setupPermissions([]);
        $this->safeGet($this->url . "/media/");
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
     * Testing React filter in this page.
     *
     * @return void
     */
    function testBrowseFilter()
    {
        $this->safeGet($this->url . "/media/");
        $this->_testFilter(self::$PSCID, self::$table, null, "MTL010");
        $this->_testFilter(self::$FileName, self::$table, null, "MTL010");
        $this->_testFilter(self::$VisitLabel, self::$table, "3 rows", "2");
        $this->_testFilter(self::$Language, self::$table, "27", "2");
        $this->_testFilter(self::$Instrument, self::$table, "4 rows", "2");
        //$this->_testFilter(self::$Site, self::$table, "12 rows", "2");rewirte later

    }
    /**
     * Testing the link React filter in this page.
     *
     * @return void
     */
    function testVisitAndEditLink()
    {
        $this->safeGet($this->url . "/media/");

        // click the Visit Label link
        $this->safeClick(
            WebDriverBy::cssSelector(
                '#dynamictable > tbody > tr:nth-child(1) > td:nth-child(4) > a'
            )
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector('body').textContent"
        );
        $this->assertStringContainsString("TimePoint", $text);

        $this->safeGet($this->url . "/media/");

        // click the Edit link
        $this->safeClick(
            WebDriverBy::cssSelector(
                '#dynamictable > tbody > tr:nth-child(1) > td:nth-child(13) button'
            )
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector('body').textContent"
        );
        $this->assertStringContainsString("Edit Media File", $text);

    }
    /**
     * Testing filter function and clear button
     *
     * @param string  $element The input element loaction
     * @param string  $table   The first row location in the table
     * @param ?string $records The records number in the table
     * @param string  $value   The test value
     *
     * @return void
     */
    function _testFilter($element,$table,$records,$value)
    {
        // get element from the page
        $this->safeFindElement(WebDriverBy::cssSelector($element));
        if (strpos($element, "select") === false) {
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 lastValue = input.value;
                 input.value = '$value';
                 event = new Event('input', { bubbles: true });
                 input._valueTracker.setValue(lastValue);
                 input.dispatchEvent(event);
                "
            );
            $bodyText = $this->webDriver->executescript(
                "return document.querySelector('$table').textContent"
            );
            $this->assertStringContainsString($value, $bodyText);
        } else {
            $this->safeFindElement(WebDriverBy::cssSelector($element));
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
            $row      = self::$display;
            $bodyText = $this->safeFindElement(
                WebDriverBy::cssSelector($row)
            )->getText();
            // 4 means there are 4 records under this site.
            $this->assertStringContainsString($records, $bodyText);
        }
        //test clear filter
            $btn = self::$clearFilter;
            $this->safeClick(WebDriverBy::cssSelector($btn));

            $inputText = $this->webDriver->executeScript(
                "return document.querySelector('$element').value"
            );
        $this->assertEquals("", $inputText);
    }
    /**
     * Testing Browse tab and coulumn clicking
     *
     * @return void
     */
    function testBrowseTab()
    {
        $this->safeGet($this->url . "/media/");

        $this->checkColumn(2, "DCC090_V1_bmi.txt");
        $this->checkColumn(3, "DCC090");
        $this->checkColumn(4, "V1");
        $this->checkColumn(5, "");
        $this->checkColumn(6, "");
        $this->checkColumn(7, "Data Coordinating Center");
        $this->checkColumn(8, "Pumpernickel");
    }
    /**
     * Test Browse tab and coulumn clicking-middleware
     *
     * @param int    $columnNumber columnNumber
     * @param string $expectedText expectedText
     *
     * @return void
     */
    function checkColumn($columnNumber, $expectedText)
    {
        $this->safeClick(
            WebDriverBy::cssSelector(
                "#dynamictable > thead > tr > th:nth-child($columnNumber)"
            )
        );
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector(
                "#dynamictable > tbody > tr:nth-child(1)".
                " > td:nth-child($columnNumber)"
            )
        )->getText();
            $this->assertEquals($expectedText, $bodyText);
    }
}

