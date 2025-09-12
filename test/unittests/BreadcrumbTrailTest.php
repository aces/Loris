<?php declare(strict_types=1);

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
     * @var BreadcrumbTrail
     */
    protected $breadcrumbTrail;

    /**
     * Setup before each test
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->breadcrumbTrail = null;
    }

    /**
     * Test __toString() returns correct string
     *
     * @dataProvider toStringProvider
     * @covers Breadcrumb::__toString
     */
    public function testToString(array $data1, array $data2, string $expected): void
    {
        $this->breadcrumbTrail = new BreadcrumbTrail(
            new Breadcrumb($data1[0], $data1[1]),
            new Breadcrumb($data2[0], $data2[1])
        );

        $this->assertEquals($expected, (string)$this->breadcrumbTrail);
    }

    /**
     * Test empty BreadcrumbTrail returns empty string
     *
     * @covers Breadcrumb::__toString
     */
    public function testEmptyBreadcrumbTrailReturnsEmptyString(): void
    {
        $this->breadcrumbTrail = new BreadcrumbTrail();
        $this->assertEquals('', (string)$this->breadcrumbTrail);
    }

    /**
     * Test single Breadcrumb behaves correctly
     *
     * @covers Breadcrumb::__toString
     */
    public function testSingleBreadcrumb(): void
    {
        $this->breadcrumbTrail = new BreadcrumbTrail(
            new Breadcrumb('OnlyLabel', 'OnlyLink')
        );

        $expected = '{"text":"OnlyLabel","query":"OnlyLink"}';
        $this->assertEquals($expected, (string)$this->breadcrumbTrail);
    }

    /**
     * Data provider for testToString()
     *
     * @return array<int, array{0:array,1:array,2:string}>
     */
    public function toStringProvider(): array
    {
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
            ],
            [
                ["Label With Spaces", "Link With Spaces"],
                ["Second Label", "Second Link"],
                '{"text":"Label With Spaces","query":"Link With Spaces"},'
                . '{"text":"Second Label","query":"Second Link"}'
            ],
        ];
    }
}
