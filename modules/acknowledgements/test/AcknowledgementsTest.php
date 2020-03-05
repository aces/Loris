<?php
/**
 * AcknowledgementsIntegrationTest automated integration tests
 *
 * PHP Version 7
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
    static $FileName     = ".col-xs-12:nth-child(2) > .row .form-control";
    static $CitationName = ".col-xs-12:nth-child(3) > .row .form-control";
    static $StartDate    = ".col-xs-12:nth-child(4) .form-control";
    static $EndDate      = ".col-xs-12:nth-child(5) .form-control";
    static $Present      = ".col-xs-12:nth-child(6) .form-control, select";
    static $clearFilter  = ".col-sm-9 > .btn";
    static $display      = ".table-header > .row > div > div:nth-child(1)";

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
     * Testing React filter in this page.
     *
     * @return void
     */
    function testBrowseFilter()
    {
        $this->safeGet($this->url . "/acknowledgements/");
        $this->_filterTest(
            self::$FileName,
            self::$display,
            self::$clearFilter,
            "Happy",
            "1 rows"
        );
        $this->_filterTest(
            self::$CitationName,
            self::$display,
            self::$clearFilter,
            "Travis",
            "1 row"
        );
        $this->_filterTest(
            self::$StartDate,
            self::$display,
            self::$clearFilter,
            "2016-12-31",
            "2 rows"
        );
        $this->_filterTest(
            self::$Present,
            self::$display,
            self::$clearFilter,
            "Yes",
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

