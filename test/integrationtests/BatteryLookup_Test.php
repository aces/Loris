<?php
/**
 * This tests the LorisForm replacement for HTML_QuickForm used by
 * Loris.
 *
 * PHP Version 5
 *
 * @category Tests
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../../vendor/autoload.php';
use PHPUnit\Framework\TestCase;
/**
 * This tests the LorisForm replacement for HTML_QuickForm used by
 * Loris.
 *
 * @category Tests
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_BVL_Battery_Test extends TestCase
{
    /**
     * Set up the data needed for the integration tests.
     *
     * @return void
     */
    function setUp(): void
    {
        $client = new NDB_Client();
        $client->makeCommandLine();
        $client->initialize();

        $this->DB = Database::singleton();

        $this->DB->setFakeTableData(
            "test_names",
            array(
                array(
                    'ID'            => 1,
                    'Test_name'     => 'ActiveTestByAge',
                    'Full_name'     => 'Active Test 1',
                    'Sub_group'     => 1,
                    'IsDirectEntry' => 0
                ),
                array(
                    'ID'            => 2,
                    'Test_name'     => 'ActiveTestByAge2',
                    'Full_name'     => 'Active Test 2',
                    'Sub_group'     => 1,
                    'IsDirectEntry' => 0
                ),
                array(
                    'ID'            => 3,
                    'Test_name'     => 'InactiveTest',
                    'Full_name'     => 'Inactive Test 1',
                    'Sub_group'     => 1,
                    'IsDirectEntry' => 0
                ),
                array(
                    'ID'            => 4,
                    'Test_name'     => 'ActiveTestByVisit',
                    'Full_name'     => 'Active Test by Visit 1',
                    'Sub_group'     => 1,
                    'IsDirectEntry' => 0
                ),
                array(
                    'ID'            => 5,
                    'Test_name'     => 'ActiveTestByVisit2',
                    'Full_name'     => 'Active Test by Visit 2',
                    'Sub_group'     => 1,
                    'IsDirectEntry' => 0
                ),
                array(
                    'ID'            => 6,
                    'Test_name'     => 'ActiveTestByFirstVisit',
                    'Full_name'     => 'Active Test by First Visit 2',
                    'Sub_group'     => 1,
                    'IsDirectEntry' => 0
                ),
                array(
                    'ID'            => 7,
                    'Test_name'     => 'ActiveTestByNotFirstVisit',
                    'Full_name'     => 'Active Test by Not First Visit 2',
                    'Sub_group'     => 1,
                    'IsDirectEntry' => 0
                ),
            )
        );
        $this->DB->setFakeTableData(
            "test_battery",
            array(
                array(
                    'ID'           => 1,
                    'Test_name'    => 'ActiveTestByAge',
                    'AgeMinDays'   => 0,
                    'AgeMaxDays'   => 100,
                    'Active'       => 'Y',
                    'Stage'        => 'Visit',
                    'SubprojectID' => 1,
                    'Visit_label'  => null,
                    'CenterID'     => null,
                    'firstVisit'   => null,
                ),
                array(
                    'ID'           => 2,
                    'Test_name'    => 'ActiveTestByAge2',
                    'AgeMinDays'   => 0,
                    'AgeMaxDays'   => 100,
                    'Active'       => 'Y',
                    'Stage'        => 'Visit',
                    'SubprojectID' => 1,
                    'Visit_label'  => null,
                    'CenterID'     => '1',
                    'firstVisit'   => null,
                ),
                array(
                    'ID'           => 3,
                    'Test_name'    => 'InactiveTest',
                    'AgeMinDays'   => 0,
                    'AgeMaxDays'   => 0,
                    'Active'       => 'N',
                    'Stage'        => 'Visit',
                    'SubprojectID' => 2,
                    'Visit_label'  => 'V01',
                    'CenterID'     => '1',
                    'firstVisit'   => null,
                ),
                array(
                    'ID'           => 4,
                    'Test_name'    => 'ActiveTestByVisit',
                    'AgeMinDays'   => 0,
                    'AgeMaxDays'   => 0,
                    'Active'       => 'Y',
                    'Stage'        => 'Visit',
                    'SubprojectID' => 2,
                    'Visit_label'  => 'V01',
                    'CenterID'     => null,
                    'firstVisit'   => null,
                ),
                array(
                    'ID'           => 5,
                    'Test_name'    => 'ActiveTestByVisit2',
                    'AgeMinDays'   => 0,
                    'AgeMaxDays'   => 0,
                    'Active'       => 'Y',
                    'Stage'        => 'Visit',
                    'SubprojectID' => 2,
                    'Visit_label'  => 'V01',
                    'CenterID'     => '1',
                    'firstVisit'   => null,
                ),
                array(
                    'ID'           => 6,
                    'Test_name'    => 'ActiveTestByFirstVisit',
                    'AgeMinDays'   => 0,
                    'AgeMaxDays'   => 100,
                    'Active'       => 'Y',
                    'Stage'        => 'Visit',
                    'SubprojectID' => 1,
                    'Visit_label'  => null,
                    'CenterID'     => '1',
                    'firstVisit'   => 'Y',
                ),
                array(
                    'ID'           => 7,
                    'Test_name'    => 'ActiveTestByNotFirstVisit',
                    'AgeMinDays'   => 0,
                    'AgeMaxDays'   => 100,
                    'Active'       => 'Y',
                    'Stage'        => 'Visit',
                    'SubprojectID' => 1,
                    'Visit_label'  => null,
                    'CenterID'     => '1',
                    'firstVisit'   => 'N',
                ),
            )
        );

    }

    /**
     * Remove test data from mock database.
     *
     * @return void
     */
    function tearDown(): void
    {
        $this->DB->run("DROP TEMPORARY TABLE test_names");
        $this->DB->run("DROP TEMPORARY TABLE test_battery");

    }

    /**
     * Test lookupBattery function by age.
     *
     * @return void
     */
    function testLookupBatteryByAge(): void
    {
        $battery = new NDB_BVL_Battery();

        $instruments = $battery->lookupBattery(
            50,
            1,
            'Visit',
            'V01',
            '1',
            null
        );

        $this->assertEquals(
            $instruments,
            array(
                'ActiveTestByAge',
                'ActiveTestByAge2',
                'ActiveTestByFirstVisit',
                'ActiveTestByNotFirstVisit',
            )
        );
    }

    /**
     * Test lookupBattery function.
     *
     * @return void
     */
    function testLookupBatteryByVisit(): void
    {
        $battery = new NDB_BVL_Battery();

        $instruments = $battery->lookupBattery(50, 2, 'Visit', 'V01', '1', true);

        $this->assertEquals(
            $instruments,
            array(
                'ActiveTestByVisit',
                'ActiveTestByVisit2',
            )
        );
    }

    /**
     * Test that the lookupBattery function returns the correct results when
     * queried without using CenterID.
     *
     * @return void
     */
    function testLookupBatteryWithoutCenterID(): void
    {
        $battery = new NDB_BVL_Battery();

        $instrumentsByAge   = $battery->lookupBattery(
            50,
            1,
            'Visit',
            'V01',
            '2',
            true
        );
        $instrumentsByVisit = $battery->lookupBattery(
            50,
            2,
            'Visit',
            'V01',
            '2',
            true
        );

        $this->assertEquals(
            $instrumentsByAge,
            array(
                'ActiveTestByAge',
                'ActiveTestByFirstVisit',
            )
        );

        $this->assertEquals(
            $instrumentsByVisit,
            array(
                'ActiveTestByVisit',
            )
        );
    }

    /**
     * Test that the lookupBattery() function's "first visit" flag returns the
     * first visit information when passed.
     *
     * @return void
     */
    function testLookupBatteryByFirstVisit(): void
    {
        $battery = new NDB_BVL_Battery();

        $firstVisitInstruments = $battery->lookupBattery(
            50,
            1,
            'Visit',
            'V01',
            '1',
            true
        );

        $this->assertEquals(
            $firstVisitInstruments,
            array(
                'ActiveTestByAge',
                'ActiveTestByAge2',
                'ActiveTestByFirstVisit',
            )
        );

        $notFirstVisitInstruments = $battery->lookupBattery(
            50,
            1,
            'Visit',
            'V01',
            '1',
            false
        );

        $this->assertEquals(
            $notFirstVisitInstruments,
            array(
                'ActiveTestByAge',
                'ActiveTestByAge2',
                'ActiveTestByNotFirstVisit',
            )
        );
    }

}

