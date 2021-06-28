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
use Facebook\WebDriver\WebDriverBy;
use Facebook\WebDriver\WebDriverSelect;
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
    //filter location
    static $fullname     = 'input[name="fullName"]';
    static $citationName = 'input[name="citationName"]';
    static $startDate    = 'input[name="startDate"]';
    static $endDate      = 'input[name="endDate"]';
    static $present      = 'select[name="present"]';
    static $display      = '.table-header > .row > div > div:nth-child(1)';
    static $clearFilter  = 'a[name="reset"]';

    // Initial array data

    static $testData = [
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
    ];
    static $newData  = [
        'ordering'      => '9999',
        'full_name'     => 'Test Test',
        'citation_name' => "Test's Citation",
        'affiliations'  => 'McGill',
        'degrees'       => 'Bachelors',
        'roles'         => 'Investigators',
        'start_date'    => '2016-11-11',
        'end_date'      => '2017-11-11',
        'present'       => 'Yes',
    ];
    /**
     * Insert testing data into the database
     * author: Wang Shen
     *
     * @return void
     */
    function setUp(): void
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
    function tearDown(): void
    {
        $this->DB->delete("acknowledgements", ['ID' => '999']);
        $this->DB->delete("acknowledgements", ['full_name' => 'Test Test']);
        parent::tearDown();
    }

    /**
     * Ensures that the module loads if and only if the user has one of the
     * module permissions codes.
     *
     * @return void
     */
    public function testPermissions(): void
    {
        $this->checkPagePermissions(
            '/acknowledgements/',
            [
                'acknowledgements_view',
                'acknowledgements_edit'
            ],
            "Acknowledgements"
        );
    }

    /**
     * Tests filter and clearfilter function
     *
     * @return void
     */
    function testFilters()
    {
        $this->safeGet($this->url . "/acknowledgements/");
        $this->_filterTest(
            self::$fullname,
            self::$display,
            self::$clearFilter,
            self::$testData['full_name'],
            "1 row"
        );
        $this->_filterTest(
            self::$citationName,
            self::$display,
            self::$clearFilter,
            self::$testData['citation_name'],
            "1 row"
        );
        $this->_filterTest(
            self::$startDate,
            self::$display,
            self::$clearFilter,
            self::$testData['start_date'],
            "1 row"
        );
        $this->_filterTest(
            self::$endDate,
            self::$display,
            self::$clearFilter,
            self::$testData['end_date'],
            "1 row"
        );
        $this->_filterTest(
            self::$present,
            self::$display,
            self::$clearFilter,
            self::$testData['present'],
            "31"
        );
    }
    /**
     * Tests that, adding a new record, then this record appears on the page.
     *
     * @return void
     */
    function testAddNewRecord()
    {
        $this->safeGet($this->url . "/acknowledgements/");
        $this->safeFindElement(
            WebDriverBy::cssSelector("div:nth-child(2) > .btn:nth-child(1)")
        )->click();
        //insert ordering
        $this->safeFindElement(
            WebDriverBy::Name("addOrdering")
        )->sendKeys(self::$newData['ordering']);
        //insert Full name
        $this->safeFindElement(
            WebDriverBy::Name("addFullName")
        )->sendKeys(self::$newData['full_name']);
        //insert Citation name
        $this->safeFindElement(
            WebDriverBy::Name("addCitationName")
        )->sendKeys(self::$newData['citation_name']);
        $this->safeFindElement(
            WebDriverBy::Name("addStartDate")
        )->sendKeys(self::$newData['start_date']);
        $el_dropdown = new WebDriverSelect(
            $this->safeFindElement(WebDriverBy::Name("addPresent"))
        );
        $el_dropdown->selectByVisibleText("Yes");
        //expecting to find the value,after clicking save button
        $this->safeFindElement(
            WebDriverBy::cssSelector('button[name="fire_away"]')
        )->click();
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("#swal2-title")
        )->getText();
        $this->assertStringContainsString("Success!", $bodyText);
    }
}

