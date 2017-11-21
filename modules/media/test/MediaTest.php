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
     * UI elements and locations
     * breadcrumb - 'Access Profile'
     * Table headers
     */
    private $_loadingBrowseUI
        =  array(
            //Browse UIs
            'Browse'      => '#tab-browse',
            //Browse table header
            'No.'         => '#dynamictable > thead:nth-child(1) > tr:nth-child(1)',
            'File Name'   => '#dynamictable > thead:nth-child(1) > tr:nth-child(1)',
            'PSCID'       => '#dynamictable > thead:nth-child(1) > tr:nth-child(1)',
            'Visit Label' => '#dynamictable > thead:nth-child(1) > tr:nth-child(1)',
            'Instrument'  => '#dynamictable > thead:nth-child(1) > tr:nth-child(1)',
            'Site'        => '#dynamictable > thead:nth-child(1) > tr:nth-child(1)',
            'Uploaded By' => '#dynamictable > thead:nth-child(1) > tr:nth-child(1)',
            'Date Taken'  => '#dynamictable > thead:nth-child(1) > tr:nth-child(1)',
            'Comments'    => '#dynamictable > thead:nth-child(1) > tr:nth-child(1)',
           );
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
      * Testing UI elements when page loads
      *
      * @return void
      */
    function testPageBrowseUIs()
    {
        $this->safeGet($this->url . "/media/");
        sleep(1);
        foreach ($this->_loadingBrowseUI as $key => $value) {
            $text = $this->webDriver->executescript(
                "return document.querySelector('$value').textContent"
            );
            $this->assertContains($key, $text);
        }
    }
    /**
      * Testing React filter in this page.
      *
      * @return void
      */
    function testBrowseFilter()
    {
        $this->_testFilter("/media/", "pSCID", "MTL010", "1 rows");
        $this->_testFilter("/media/", "fileName", "MTL010", "1 rows");
        $this->_testFilter(
            "/media/",
            "fileType",
            "text/plain",
            "20 rows displayed of 26"
        );
        $this->_testFilter(
            "/media/",
            "visitLabel",
            "V1",
            "20 rows displayed of 26"
        );
        $this->_testFilter(
            "/media/",
            "site",
            "Data Coordinating Center",
            "20 rows displayed of 26"
        );
        $this->_testFilter(
            "/media/",
            "uploadedBy",
            "admin",
            "20 rows displayed of 26"
        );
        $this->_testFilter(
            "/media/",
            "instrument",
            "BMI Calculator",
            "20 rows displayed of 26"
        );

    }
    /**
      * Testing the link React filter in this page.
      *
      * @return void
      */
    function testBrowseVisitLink()
    {
        $this->safeGet($this->url . "/media/");
        sleep(1);
        // click the file Name link
        $this->webDriver->executescript(
            "document.querySelector('#dynamictable > tbody > tr:nth-child(1)".
               " > td:nth-child(4) > a').click()"
        );
        $text = $this->webDriver->executescript(
            "return document.querySelector('".
            " #bc2 > a:nth-child(4) > div').textContent"
        );
        $this->assertContains("TimePoint", $text);

    }
    /**
      * This function could test filter function in each Tabs.
      *
      * @param string $url            this is for the url which needs to be tested.
      * @param string $filter         the filter which needs to be tested.
      * @param string $testData       the test data.
      * @param string $expectDataRows the expect rows in the table.
      *
      * @return void
      */
    function _testFilter($url,$filter,$testData,$expectDataRows)
    {
        $this->safeGet($this->url . $url);
        $this->safeFindElement(
            WebDriverBy::Name($filter)
        )->sendKeys($testData);
        $text = $this->webDriver->executescript(
            "return document.querySelector('.table-header').textContent"
        );
        $this->webDriver->executescript(
            "document.querySelector('#media_filter_form > div >".
            " div:nth-child(9) > div > div > button').click()"
        );

        $this->assertContains($expectDataRows, $text);
    }
}
?>
