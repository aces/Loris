<?php declare(strict_types=1);

/**
 * BreadcrumbTrail class tests
 *
 * PHP Version 8
 *
 * @category Tests
 * @package  Test
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use LORIS\BreadcrumbTrail;
use LORIS\Breadcrumb;
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
    protected ?BreadcrumbTrail $breadcrumbTrail = null;

    /**
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();
        $this->breadcrumbTrail = new BreadcrumbTrail();
    }

    /**
     * Test __toString() returns correct string
     *
     * @return void
     */
    public function testToString(): void
    {
        $testCases = [
            [
                'crumbs'   => [
                    ['testLabel', 'testLink'],
                    ['testLabel2', 'testLink2'],
                ],
                'expected' => '{"text":"testLabel","query":"testLink"},'
                            . '{"text":"testLabel2","query":"testLink2"}'
            ],
            [
                'crumbs'   => [
                    ['aLabel', 'aLink'],
                    ['anotherLabel', 'anotherLink'],
                ],
                'expected' => '{"text":"aLabel","query":"aLink"},'
                            . '{"text":"anotherLabel","query":"anotherLink"}'
            ]
        ];

        foreach ($testCases as $case) {
            $crumbs = array_map(
                fn($c) => new Breadcrumb($c[0], $c[1]),
                $case['crumbs']
            );

            $this->breadcrumbTrail = new BreadcrumbTrail(...$crumbs);

            $this->assertSame($case['expected'], (string)$this->breadcrumbTrail);
        }
    }
}

