<?php
/**
 * Breadcrumb class tests
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Test
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

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
class BreadcrumbTest extends TestCase
{
    /**
     * Breadcrumb object used for testing
     *
     * @var Breadcrumb object
     */
    private $breadcrumb;

    /**
     * The label to display to the frontend user
     *
     * @var string
     */
    protected $label;


    /**
     * The hyperlink for this breadcrumb
     *
     * @var string
     */
    protected $link;

    /**
     * This method is called before each test is executed.
     *
     * @return void
     */
    protected function setUp(): void
    {
        parent::setUp();

	$this->label = "testLabel";

	$this->link = "testLink";

        $this->breadcrumb = new Breadcrumb($this->label, $this->link);

    }

    /**
     * Test __toString() returns correct string
     *
     * TODO: Add potential edge cases (such as white space)
     * @covers Breadcrumb::__toString
     * @return void
     */
    public function testToString(): void
    {
        $this->assertEquals('{"text":"testLabel","query":"testLink"}', $this->breadcrumb->__toString());
    }

}
