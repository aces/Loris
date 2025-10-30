<?php declare(strict_types=1);

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/NDB_Menu_Filter.class.inc';

use PHPUnit\Framework\TestCase;
/**
 * Session stub class for testing.
 *
 * Provides dummy session behavior for unit tests.
 *
 * @category Tests
 * @package  LORIS\TestStubs
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
/**
 * File-level Phan suppression for PHPUnit mocks.
 *
 * @phan-file-suppress PhanUndeclaredMethod
 * @phan-file-suppress PhanUndeclaredProperty
 * @phan-file-suppress PhanTypeMismatchProperty
 * @license            http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class SessionStub
{
    /**
     * Set a session property.
     *
     * @param string $key   Property name
     * @param mixed  $value Property value
     *
     * @return void
     */
    public function setProperty($key, $value)
    {
    }

    /**
     * Get a session property.
     *
     * @param string $key Property name
     *
     * @return mixed|null The value of the property or null if not set
     */
    public function getProperty($key)
    {
        return null;
    }

    /**
     * Get the username from the session.
     *
     * @return string The username
     */
    public function getUsername()
    {
        return 'testuser';
    }

    /**
     * Check if the session is logged in.
     *
     * @return bool True if logged in
     */
    public function isLoggedIn()
    {
        return true;
    }
}
/**
 * Unit test for NDB_Menu_Filter class
 *
 * PHP Version 8
 *
 * @category Tests
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class NDB_Menu_Filter_Test extends TestCase
{
    protected $Session;

    /**
     * Sets up a fake $_SESSION object before each test.
     *
     * @return void
     */
    protected function setUp(): void
    {
        $this->Session = new SessionStub();
        global $_SESSION;
        $_SESSION = [
            'State' => $this->Session
        ];
    }

    /**
     * Get all methods of NDB_Menu_Filter except the specified ones.
     *
     * @param array $methods List of method names to exclude
     *
     * @return array Remaining method names
     */
    protected function getAllMethodsExcept(array $methods): array
    {
        $AllMethods = get_class_methods('NDB_Menu_Filter');
        return array_diff($AllMethods, $methods);
    }

    /**
     * Test the resetFilters function of NDB_Menu_Filter.
     *
     * @return void
     */
    public function testResetFilters(): void
    {
        $method          = ['_resetFilters'];
        $allOtherMethods = $this->getAllMethodsExcept($method);

        $stub = $this->getMockBuilder('NDB_Menu_Filter')
            ->onlyMethods($allOtherMethods)
            ->disableOriginalConstructor()
            ->getMock();

        $mockSession = $this->getMockBuilder(SessionStub::class)
            ->onlyMethods(['setProperty'])
            ->getMock();

        $mockSession->expects($this->exactly(2))
            ->method('setProperty')
            ->willReturnCallback(
                function ($key, $value) {
                    static $call = 0;
                    if ($call === 0) {
                        TestCase::assertEquals('filter', $key);
                        TestCase::assertNull($value);
                    } elseif ($call === 1) {
                        TestCase::assertEquals('keyword', $key);
                        TestCase::assertNull($value);
                    }
                    $call++;
                }
            );

        global $_SESSION;
        $_SESSION['State'] = $mockSession;
        //@phan-suppress-next-line PhanUndeclaredMethod
        $stub->_resetFilters();
    }

    /**
     * Test that the search keyword is set correctly.
     *
     * This test verifies that the setSearchKeyword method
     * updates the internal state as expected.
     *
     * @return void
     */
    public function testSetSearchKeyword(): void
    {
        $method          = ['_setSearchKeyword'];
        $allOtherMethods = $this->getAllMethodsExcept($method);

        $stub = $this->getMockBuilder('NDB_Menu_Filter')
            ->onlyMethods($allOtherMethods)
            ->disableOriginalConstructor()
            ->getMock();
        //@phan-suppress-next-line PhanUndeclaredMethod
        $stub->_setSearchKeyword('abc');

        $this->assertEquals('abc', $stub->searchKey['keyword']);
    }

    /**
     * Test that filters are set correctly.
     *
     * This test verifies that the setFilters method properly
     * updates the internal filter state.
     *
     * @return void
     */
    public function testSetFilters(): void
    {
        $method          = ['_setFilters'];
        $allOtherMethods = $this->getAllMethodsExcept($method);

        $stub = $this->getMockBuilder('NDB_Menu_Filter')
            ->onlyMethods($allOtherMethods)
            ->disableOriginalConstructor()
            ->getMock();

        $stub->form = new LorisForm();
        $stub->form->applyFilter('__ALL__', 'trim');

        $submittedValues = [
            'FakeField'        => '      I should be put into filter     ',
            'FakeInvalidField' => 'I should not be set',
            'FakeHaving'       => 'I should be put into having'
        ];
        $_REQUEST        =& $submittedValues;

        $stub->formToFilter       = [
            'FakeField'  => 'table.column',
            'FakeHaving' => 'abcd.def'
        ];
        $stub->validFilters       = ['table.column', 'abcd.def'];
        $stub->validHavingFilters = ['abcd.def'];
        //@phan-suppress-next-line PhanUndeclaredMethod
        $stub->_setFilters($submittedValues);

        $this->assertEquals(
            ['abcd.def' => 'I should be put into having'],
            $stub->having,
            'Menu Filter $this->having not set correctly'
        );
    }
}

