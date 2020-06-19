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
    static $fullname       = 'input[name="fullname"]'; 
    static $citationName   = 'input[name="citationName"]';
    static $startDate      = 'input[name="startDate"]';
    static $endDate        = 'input[name="endDate"]'; 
    static $present        = 'select[name="present"]';

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
     * Ensures that the module loads if and only if the user has one of the
     * module permissions codes.
     *
     * @return void
     */
    public function testPermissions(): void
    {
        $this->checkPagePermissions(
            '/acknowledgements/',
            array(
                'acknowledgements_view',
                'acknowledgements_edit'
            ),
            "Acknowledgements"
        );
    }

    /**
     * Tests clear button in the form
     * The form should refreash and the data should be gone.
     *
     * @return void
     */
    function testFilters()
    {
        $this->safeGet($this->url . "/acknowledgements/");sleep(10);
        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clearFilter,
            'test',
            "0 rows",
        );
    }
    /**
     * Tests that, adding a new record, then this record appears on the page.
     *
     * @return void
     */
    function testAddNewRecord()
    {
        $this->markTestSkipped(
            'Skipping tests until Travis and React get along better.'
        );

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

