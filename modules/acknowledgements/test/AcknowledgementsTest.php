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

        $this->setUpConfigSetting("citation_policy", "citation policy test text");

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
        $this->restoreConfigSetting("citation_policy");
        $this->DB->delete("acknowledgements", ['ID' => '999']);
        $this->DB->delete("acknowledgements", ['full_name' => 'Test Test']);
        parent::tearDown();
    }
    /**
     * Tests that, when loading the Acknowledgements module, some
     * text appears in the body.
     *
     * @return void
     */
    function testAcknowledgementsDoespageLoadWithView()
    {
        $this->setupPermissions(["acknowledgements_view"]);
        $this->safeGet($this->url . "/acknowledgements/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Acknowledgements", $bodyText);
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
     * Tests that, when loading the Acknowledgements module, some
     * text appears in the body.
     *
     * @return void
     */
    function testAcknowledgementsDoespageLoadwithEdit()
    {
        $this->setupPermissions(["acknowledgements_edit"]);
        $this->safeGet($this->url . "/acknowledgements/");
        $bodyText = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringContainsString("Acknowledgements", $bodyText);
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
            "30"
        );
    }

    /**
     * Tests that, can't find Add Acknowledgement button on the page if
     * user doesn't have acknowledgements_edit permission
     *
     * @return void
     */
    function testCantAddNewRecord()
    {
        $this->setupPermissions(["acknowledgements_view"]);
        $this->safeGet($this->url . "/acknowledgements/");
        $pagetext = $this->safeFindElement(
            WebDriverBy::cssSelector("body")
        )->getText();
        $this->assertStringNotContainsString("Add Acknowledgement", $pagetext);

    }
    /**
     * Tests that, can't find Add Acknowledgement button on the page if
     * user doesn't have acknowledgements_edit permission
     *
     * @return void
     */
    function testConfigSettingPolicy()
    {
        $this->safeGet($this->url . "/acknowledgements/");
        $pagetext = $this->safeFindElement(
            WebDriverBy::cssSelector("#citationPolicy")
        )->getText();
        $this->assertStringContainsString("citation policy test text", $pagetext);
    }
}

