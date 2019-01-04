<?php
/**
 * Automated integration tests for the dicom_archive module.
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * Automated integration tests for the dicom_archive module.
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DicomArchiveTestIntegrationTest extends LorisIntegrationTest
{
    //$location: css selector for react items
    static $patientID   = "#dicom_filter_filter".
                            ">div>div>fieldset>div:nth-child(2)>div>div>input";
    static $patientName = "#dicom_filter_filter".
                            ">div>div>fieldset>div:nth-child(3)>div>div>input";
    static $site        = "#dicom_filter_filter".
                            ">div>div>fieldset>div:nth-child(9)>div>div>select";
    static $sex         = "#dicom_filter_filter".
                            ">div>div>fieldset>div:nth-child(4)>div>div>input";
    static $dateOfBirth = "#dicom_filter_filter".
                            ">div>div>fieldset>div:nth-child(5)>div>div>input";
    static $clearFilter = "#dicom_filter_filter".
                          ">div>div:nth-child(10)>div>div>button";
    // first row of react table
    static $table = "#dynamictable > tbody > tr:nth-child(1)";
    /**
     * Insert testing data into the database
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
    }
    /**
     * Delete testing data from database
     *
     * @return void
     */
    function tearDown()
    {
        parent::tearDown();
    }
    /**
     * Tests that, when loading the dicom_archive module > viewDetails subtest, some
     * text appears in the body.
     *
     * @return void
     */
    function testdicomArchiveViewDetailsDoespageLoad()
    {
        $this->safeGet($this->url . "/dicom_archive/viewDetails/");
        $bodyText = $this->webDriver->findElement(WebDriverBy::cssSelector("body"))
            ->getText();
        $this->assertContains("View Details", $bodyText);
    }
    /**
     * Tests that help editor loads with the permission
     *
     * @return void
     */
    function testDicomArchivePermission()
    {
         $this->setupPermissions(array("dicom_archive_view_allsites"));
         $this->safeGet($this->url . "/dicom_archive/");
         $bodyText = $this->safeFindElement(
             WebDriverBy::cssSelector("body")
         )->getText();
          $this->assertNotContains(
              "You do not have access to this page.",
              $bodyText
          );
          $this->resetPermissions();
    }
    /**
     * Tests clear button in the form
     * The form should refreash and the data should be gone.
     *
     * @return void
     */
    function testdicomArchiveFilterClearBtn()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        //testing data from RBdata.sql
        $this-> _testFilter(self::$patientID, self::$table, null, "ibis");
        $this-> _testFilter(
            self::$patientName,
            self::$table,
            null,
            "MTL022_300022_V1"
        );
        $this-> _testFilter(self::$sex, self::$table, null, "M");
        $this-> _testFilter(self::$dateOfBirth, self::$table, null, "1972-10-10");
        $this-> _testFilter(self::$site, self::$table, "4", "4");
    }
    /**
     * Testing filter funtion and clear button
     *
     * @param string $element The input element loaction
     * @param string $table   The first row location in the table
     * @param string $records The records number in the table
     * @param string $value   The test value
     *
     * @return void
     */
    function _testFilter($element,$table,$records,$value)
    {
        // get element from the page
        if (strpos($element, "select") == false) {
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
            $this->assertContains($value, $bodyText);
        } else {
            $this->webDriver->executescript(
                "input = document.querySelector('$element');
                 input.selectedIndex = '$value';
                 event = new Event('change', { bubbles: true });
                 input.dispatchEvent(event);
                "
            );
            $bodyText = $this->webDriver->executescript(
                "return document.querySelector('#lorisworkspace > div >".
                " div.panel.panel-default > div.table-header.panel-heading".
                " > div > div').textContent"
            );
            // 4 means there are 4 records under this site.
            $this->assertContains($records, $bodyText);
        }
        //test clear filter
        $btn = self::$clearFilter;
        $this->webDriver->executescript(
            "document.querySelector('$btn').click();"
        );
        $inputText = $this->webDriver->executescript(
            "return document.querySelector('$element').value"
        );
        $this->assertEquals("", $inputText);
    }
    /**
     * Tests that the (view-details) link works
     *
     * @return void
     */
    function testLinksViewDetails()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "#dynamictable>tbody>tr:nth-child(1)>td:nth-child(8)>a";
        $text     = $this->webDriver->executescript(
            "return document.querySelector('$location').textContent"
        );
        $this->assertEquals('View Details', $text);
        $this->webDriver->executescript(
            "document.querySelector('$location').click()"
        );
        $text = $this->webDriver->getPageSource();
        $this->assertContains('View Details', $text);
    }
    /**
     * Tests that the (view-Images) link works
     *
     * @return void
     */
    function testLinksViewImages()
    {
        $this->safeGet($this->url . "/dicom_archive/");
        $location = "#dynamictable > tbody > tr:nth-child(1) > td:nth-child(9) > a";
        $text     = $this->webDriver->executescript(
            "return document.querySelector('$location').textContent"
        );
        $this->assertEquals('View Images', $text);
        $this->webDriver->executescript(
            "document.querySelector('$location').click()"
        );
        sleep(1);
        $text = $this->webDriver->getPageSource();
        $text = $this->webDriver->executescript(
            "return document.querySelector('#bc2>a:nth-child(3)>div').textContent"
        );
        $this->assertEquals('View Session', $text);
    }
}
?>
