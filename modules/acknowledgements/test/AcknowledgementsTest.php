<?php
/**
 * AcknowledgementsIntegrationTest automated integration tests
 *
 * PHP Version 5
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
 require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * AcknowledgementsIntegrationTest
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class AcknowledgementsIntegrationTest extends LorisIntegrationTest
{

    // Initial array data

    static $testData = array(
                        'ID'            => '999',
                        'ordering'      => '999',
                        'full_name'     => 'Demo Test',
                        'citation_name' => "Demo's Citation",
                        'affiliations'  => 'mcgill',
                        'degrees'       => 'bachelors',
                        'roles'         => 'investigators',
                        'start_date'    => '2015-01-01',
                        'end_date'      => '2016-01-01',
                        'present'       => 'Yes',
                       );
    static $newData  = array(
                        'ordering'      => '9999',
                        'full_name'     => 'Test Test',
                        'citation_name' => "Test's Citation",
                        'affiliations'  => 'McGill',
                        'degrees'       => 'Bachelors',
                        'roles'         => 'Investigators',
                        'start_date'    => '2015-11-11',
                        'end_date'      => '2016-11-11',
                        'present'       => 'Yes',
                       );
    /**
     * Insert testing data into the database
     * author: Wang Shen
     *
     * @return void
     */
    function setUp()
    {
        parent::setUp();
        $this->DB->insert(
            "acknowledgements",
            self::$testData
        );

    }
    /**
     * Delete testing data from database
     * author: Wang Shen
     *
     * @return void
     */
    function tearDown()
    {
        $this->DB->delete("acknowledgements", array('ID' => '999'));
        $this->DB->delete("acknowledgements", array('full_name' => 'Test Test'));
        parent::tearDown();
    }
    /**
     * Tests that, the homepage should have "Acknowledgements" on the page.
     *
     * @return void
     */
    function testPageLoads()
    {
        $this->safeGet($this->url . "/acknowledgements/");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains("Acknowledgements", $bodyText);
    }
    /**
     * Tests that, the homepage should have "You do not have access to this page."
     * on the page without permission.
     *
     * @return void
     */
    function testPageLoadsWithoutPermissions()
    {
        $this->setupPermissions(array("violated_scans_view_allsites"));
        $this->safeGet($this->url . "/acknowledgements/");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains(
            "You do not have access to this page.",
            $bodyText
        );
        $this->resetPermissions();
    }
    /**
     * Tests that, after clicking the "filter" button, all of the
     * advanced filters appear on the page.
     *
     * @return void
     */
    function testFilterWithData()
    {
        $this->_testFilter("fullName", self::$testData['full_name']);
        $this->_testFilter("citatioName", self::$testData['citation_name']);
        $this->_testFilter("startDate", self::$testData['start_date']);
        $this->_testFilter("endDate", self::$testData['end_date']);
        $this->_testFilter("present", self::$testData['present']);

    }
    /**
     * Test filter function
     *
     * @param string $element the test element
     * @param string $value   the value
     *
     * @return void
     */
    private function _testFilter($element,$value)
    {
        $this->safeGet($this->url . "/acknowledgements/");
        if ($element == "startDate" || $element == "endDate") {
            $this->webDriver->executescript(
                "document.getElementsByName('$element')[0].value='$value'"
            );
        } elseif ($element == "present") {
            $select  = $this->safeFindElement(WebDriverBy::Name($element));
            $element = new WebDriverSelect($select);
            $element->selectByVisibleText($value);
        } else {
             $this->webDriver->findElement(
                 WebDriverBy::Name($element)
             )->sendKeys($value);
        }
        $this->webDriver->findElement(
            WebDriverBy::ID("showdata_advanced_options")
        )->click();
        $this->safeGet($this->url . "/acknowledgements/?format=json");
        $bodyText = $this->webDriver
            ->findElement(WebDriverBy::cssSelector("body"))->getText();
        $this->assertContains($value, $bodyText);
    }
    /**
     * Tests that, adding a new record, then this record appears on the page.
     *
     * @return void
     */
    function testAddNewRecord()
    {
        $this->safeGet($this->url . "/acknowledgements/");
        //insert ordering
        $this->webDriver->findElement(
            WebDriverBy::Name("addOrdering")
        )->sendKeys(self::$newData['ordering']);
        //insert Full name
        $this->webDriver->findElement(
            WebDriverBy::Name("addFullName")
        )->sendKeys(self::$newData['full_name']);
        //insert Citation name
        $this->webDriver->findElement(
            WebDriverBy::Name("addCitationName")
        )->sendKeys(self::$newData['citation_name']);
        //expecting to find the value,after clicking save button
        $this->webDriver->findElement(
            WebDriverBy::Name("fire_away")
        )->click();
        //test filter
        $this->_testFilter("fullName", self::$newData['full_name']);
    }
}

