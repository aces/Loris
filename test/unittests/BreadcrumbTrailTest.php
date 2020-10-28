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
     * TODO: Add potential edge cases (such as white space)
     *
<<<<<<< e609003289431fdc2d56c2ef27b0ac2ea93811aa
     * @param []     $data1 A label/link pair
     * @param []     $data2 A label/link pair
     * @param string $c     The value to compare
     *
=======
>>>>>>> start of change to php7.4
     * @dataProvider toStringProvider
     * @covers       Breadcrumb::__toString
     * @return       void
     */
    public function testToString($data1, $data2, $c)
    {
        $this->breadcrumbTrail = new BreadcrumbTrail(
<<<<<<< e609003289431fdc2d56c2ef27b0ac2ea93811aa
            new Breadcrumb($data1[0], $data1[1]),
=======
            new Breadcrumb($data1[0], $data1[1]), 
>>>>>>> start of change to php7.4
            new Breadcrumb($data2[0], $data2[1])
        );
        $this->assertEquals($c, $this->breadcrumbTrail);
    }

    /**
     * ToString Provider
     *
     * @return []
     */
    public function toStringProvider()
<<<<<<< e609003289431fdc2d56c2ef27b0ac2ea93811aa
    {
=======
    {    
>>>>>>> start of change to php7.4
        return [
            [
                ["testLabel", "testLink"],
                ["testLabel2", "testLink2"],
                '{"text":"testLabel","query":"testLink"},'
                . '{"text":"testLabel2","query":"testLink2"}'
            ],
            [
                ["aLabel", "aLink"],
                ["anotherLabel", "anotherLink"],
                '{"text":"aLabel","query":"aLink"},'
                . '{"text":"anotherLabel","query":"anotherLink"}'
            ]
        ];
    }
}

