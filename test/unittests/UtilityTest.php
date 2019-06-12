<?php
/**
 * Utility class tests
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Test
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

require_once __DIR__ . '/../../php/libraries/Utility.class.inc';
//use \LORIS\Utility;
use PHPUnit\Framework\TestCase;
/**
 * Unit test for Utility class
 * @category Tests
 * @package  Main
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UtilityTest extends TestCase
{
    /** Utility object used for testing
     *
     * @var Utility object
     */
    private $utility;

    /**
     * This method is called before each test
     *
     * @return void
     */
    protected function setUp(): void
    {	
        parent::setUp();
	$this->utility = new Utility();
    }

    /**
     * Test that calculateAge returns the proper age
     *
     * @covers Utility::calculateAge
     * @return void
     */
    public function testCalculateAge()
    {
        $array = $this->utility->calculateAge("1998-08-25", "2019-06-11");
        $this->assertEquals($array['year'], 20);
        $this->assertEquals($array['mon'], 9);
        $this->assertEquals($array['day'], 16);
    }

    /*
     * Test that calculateAge() method fails when the dates have the incorrect format
     * 
     * @dataProvider ageIncorrectFormatProvider
     * @covers Utility:calculateAge
     * @return void
     */
    public function testCalculateAgeFormat()
    {
        $this->expectException('\LorisException');
	$this->utility->calculateAge("1998\\08\\25", "2019\\07\\23");
    }

    public function ageIncorrectFormatProvider()
    {
        return [
            ["19980825", "20190611"],
            ["1990\\07\\05", "2018\\05\\23"],
            ["1990", "2018"],
            ["1990_07_05", "2019_09_65"],
            [" ", " "]
        ];
    }

}
