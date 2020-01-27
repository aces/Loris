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
    //$location: css selector for react items
    static $FileName    = "#media_filter > div > div > fieldset".
                              " > div:nth-child(2) > div > div > input";
    static $PSCID       = "#media_filter > div > div > fieldset".
                              " > div:nth-child(3) > div > div > input";
    static $VisitLabel  = "#media_filter > div > div > fieldset".
                              " > div:nth-child(4) > div > div > select";
    static $Language    = "#media_filter > div > div > fieldset".
                              " > div:nth-child(5) > div > div > select";
    static $Instrument  = "#media_filter > div > div > fieldset".
                              " > div:nth-child(6) > div > div > select";
    static $Site        = "#media_filter > div > div > fieldset".
                              " > div:nth-child(7) > div > div > select";
    static $clearFilter = ".col-sm-4 .btn";
    // rows displayed of
    static $display = "#browse > div > div > div > div:nth-child(2) >".
                      " div:nth-child(1) > div > div > div:nth-child(1)";
    /**
     * Tests that the page does not load if the user does not have correct
     * permissions
     *
     * @return void
     */
    function testLoadsWithPermissionRead()
    {
        $this->setupPermissions(array("media_read"));
        $this->safeGet($this->url . "/media/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertNotContains("You do not have access to this page.", $bodyText);
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
        $this->setupPermissions(array());
        $this->safeGet($this->url . "/media/");
        $bodyText = $this->webDriver->findElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertContains("You do not have access to this page.", $bodyText);
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
        $this->_filterTest(self::$PSCID,self::$display,self::$clearFilter,"MTL002","2 rows");
        $this->_filterTest(self::$FileName,self::$display,self::$clearFilter,"MTL002_V1.txt","1 row");
        $this->_filterTest(self::$VisitLabel,self::$display,self::$clearFilter,"V2","3 rows");
        $this->_filterTest(self::$Language,self::$display,self::$clearFilter,"English","0 row");
        $this->_filterTest(self::$Instrument,self::$display,self::$clearFilter,"BMI Calculator","4 rows");
        $this->_filterTest(self::$Site,self::$display,self::$clearFilter,"Montreal","12 rows");


      //  $this->_testFilter(self::$FileName, self::$table, null, "MTL010");
      //  $this->_testFilter(self::$VisitLabel, self::$table, "3 rows", "2");
      //  $this->_testFilter(self::$Language, self::$table, "26", "2");
      //  $this->_testFilter(self::$Instrument, self::$table, "4 rows", "2");
      //  $this->_testFilter(self::$Site, self::$table, "12 rows", "2");

    }
    /**
     * Testing the link React filter in this page.
     *
     * @return void
     */
    function testVisitAndEditLink()
    {
        $this->markTestSkipped(
            'Skipping tests until Travis and Router get along better'
        );
        $this->safeGet($this->url . "/media/");
        // click the Visit Label link
        $this->webDriver->executescript(
            "document.querySelector('#dynamictable > tbody > tr:nth-child(1)".
            " > td:nth-child(4) > a').click()"
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector('body').textContent"
        );
        $this->assertContains("TimePoint", $text);

        $this->safeGet($this->url . "/media/");
        // click the Edit link
        $this->webDriver->executescript(
            "document.querySelector('#dynamictable > tbody > tr:nth-child(1)".
            " > td:nth-child(12) > a').click()"
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector('body').textContent"
        );
        $this->assertContains("Edit Media File", $text);

    }
}

