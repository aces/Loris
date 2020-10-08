<?php

declare(strict_types=1);
use Facebook\WebDriver\WebDriverBy;
require_once __DIR__
    . "/../../../test/integrationtests/LorisIntegrationTest.class.inc";
/**
 * ImagingQCIntegrationTest automated integration tests
 *
 * PHP Version 7
 *
 * @category Test
 * @package  Loris
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class ImagingQCIntegrationTest extends LorisIntegrationTest
{
    //Filter options
    static $site       = 'select[name="site"]';
    static $PSCID      = 'input[name="pSCID"]';
    static $DCCID      = 'input[name="candId"]';
    static $project    = 'select[name="project"]';
    static $visitLabel = 'select[name="visitLabel"]';

    static $display     = ".table-header > div > div > div:nth-child(1)";
    static $clearFilter = ".nav-tabs a";

    /**
     * Does basic setting up of Loris variables for this test, such as
     * instantiting the config and database objects, creating a user
     * to user for the tests, and logging in.
     *
     * @return void
     */
    public function setUp() : void
    {
        parent::setUp();
        $this->DB->update(
            "user_psc_rel",
            ["CenterID" => 2],
            ["UserID" => 999990]
        );
    }

    /**
     * Teardown and delete testing data
     *
     * @return void
     */
    function tearDown() : void
    {
        $this->DB->update(
            "user_psc_rel",
            ["CenterID" => 2],
            ["UserID" => 999990]
        );
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
            '/imaging_qc/',
            ['imaging_quality_control_view'],
            "Imaging Quality Control"
        );
    }

    /**
     * Test all filters on the main page. Test that the Clear Filter works.
     *
     * @return void
     */
    function testFilters()
    {
        $this->setupPermissions(['imaging_quality_control_view']);
        $this->safeGet($this->url . "/imaging_qc/");

        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clearFilter,
            'MTL002',
            "6 rows"
        );
        $this->_filterTest(
            self::$PSCID,
            self::$display,
            self::$clearFilter,
            'TST0002',
            "0 rows"
        );
        $this->_filterTest(
            self::$DCCID,
            self::$display,
            self::$clearFilter,
            '300001',
            "4 rows"
        );
        $this->_filterTest(
            self::$DCCID,
            self::$display,
            self::$clearFilter,
            '900001',
            "0 rows"
        );
        $this->_filterTest(
            self::$site,
            self::$display,
            self::$clearFilter,
            'Montreal',
            "0 rows"
        );
        $this->_filterOptionsTest(
            self::$site,
            'Ottawa',
            false
        );
        $this->_filterTest(
            self::$project,
            self::$display,
            self::$clearFilter,
            'Pumpernickel',
            "of 514."
        );
        $this->_filterOptionsTest(
            self::$project,
            'Challah',
            false
        );
        $this->_filterTest(
            self::$visitLabel,
            self::$display,
            self::$clearFilter,
            'V1',
            "of 328."
        );
        $this->_filterTest(
            self::$visitLabel,
            self::$display,
            self::$clearFilter,
            'V4',
            "0 rows"
        );
    }
}
