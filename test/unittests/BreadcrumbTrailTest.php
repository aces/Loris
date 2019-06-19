<?php
/**
 * BreadcrumbTrail class tests
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Test
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use \LORIS\BreadcrumbTrail;
use \LORIS\Breadcrumb;
use PHPUnit\Framework\TestCase;
/**
 * Unit test for Breadcrumb class
 *
 * @category Tests
 * @package  Main
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class BreadcrumbTrailTest extends TestCase
{
    /**
     * Breadcrumb list used for testing
     *
     * @var Breadcrumb[]
     */
    protected $breadcrumbTrail;
    
    /**
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
    }
    
    /**
     * Test __toString() returns correct string
     *
     * TODO: Add potential edge cases (such as white space)
     * @dataProvider toStringProvider
     * @covers Breadcrumb::__toString
     * @return void
     */
    public function testToString($data1, $data2, $c)
    {
	$this->breadcrumbTrail = new BreadcrumbTrail(new Breadcrumb($data1[0], $data1[1]), new Breadcrumb($data2[0], $data2[1]));
        $this->assertEquals($c, $this->breadcrumbTrail->__toString());
    }

    public function toStringProvider()
    {	
        return [
            [["testLabel", "testLink"], ["testLabel2", "testLink2"], '{"text":"testLabel","query":"testLink"},{"text":"testLabel2","query":"testLink2"}'],
            [["aLabel", "aLink"], ["anotherLabel", "anotherLink"], '{"text":"aLabel","query":"aLink"},{"text":"anotherLabel","query":"anotherLink"}']          
        ];
    }
}

