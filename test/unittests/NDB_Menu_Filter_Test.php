<?php declare(strict_types=1);

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/NDB_Menu_Filter.class.inc';

use PHPUnit\Framework\TestCase;
/**
 * Stub class to simulate session methods
 */
class SessionStub {
    public function setProperty($key, $value) {}
    public function getProperty($key) { return null; }
    public function getUsername() { return 'testuser'; }
    public function isLoggedIn() { return true; }
}
/**
 * Unit test for NDB_Menu_Filter class
 */
class NDB_Menu_Filter_Test extends TestCase
{
    protected $Session;


    /**
     * Set up a fake $_SESSION object
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
     * Helper function to get all methods except the ones being tested
     */
    protected function _getAllMethodsExcept(array $methods): array
    {
        $AllMethods = get_class_methods('NDB_Menu_Filter');
        return array_diff($AllMethods, $methods);
    }

    /**
     * Test the _resetFilters function
     */
    public function testResetFilters(): void
    {
        $method          = ['_resetFilters'];
        $allOtherMethods = $this->_getAllMethodsExcept($method);

        $stub = $this->getMockBuilder('NDB_Menu_Filter')
            ->onlyMethods($allOtherMethods)
            ->disableOriginalConstructor()
            ->getMock();

        // Replace with PHP 12 compatible callback for consecutive calls
        $mockSession = $this->getMockBuilder(SessionStub::class)
            ->onlyMethods(['setProperty'])
            ->getMock();

        $mockSession->expects($this->exactly(2))
            ->method('setProperty')
            ->willReturnCallback(function($key, $value) {
                static $call = 0;
                if ($call === 0) {
                    TestCase::assertEquals('filter', $key);
                    TestCase::assertNull($value);
                } elseif ($call === 1) {
                    TestCase::assertEquals('keyword', $key);
                    TestCase::assertNull($value);
                }
                $call++;
            });

        global $_SESSION;
        $_SESSION['State'] = $mockSession;

        $stub->_resetFilters();
    }

    /**
     * Test the _setSearchKeyword function
     */
    public function testSetSearchKeyword(): void
    {
        $method          = ['_setSearchKeyword'];
        $allOtherMethods = $this->_getAllMethodsExcept($method);

        $stub = $this->getMockBuilder('NDB_Menu_Filter')
            ->onlyMethods($allOtherMethods)
            ->disableOriginalConstructor()
            ->getMock();

        $stub->_setSearchKeyword('abc');

        $this->assertEquals('abc', $stub->searchKey['keyword']);
    }

    /**
     * Test the _setFilters function
     */
    public function testSetFilters(): void
    {
        $method          = ['_setFilters'];
        $allOtherMethods = $this->_getAllMethodsExcept($method);

        $stub = $this->getMockBuilder('NDB_Menu_Filter')
            ->onlyMethods($allOtherMethods)
            ->disableOriginalConstructor()
            ->getMock();

        // Setup form with trim filter
        $stub->form = new LorisForm();
        $stub->form->applyFilter('__ALL__', 'trim');

        $submittedValues = [
            'FakeField'        => '      I should be put into filter     ',
            'FakeInvalidField' => 'I should not be set',
            'FakeHaving'       => 'I should be put into having'
        ];
        $_REQUEST =& $submittedValues;

        $stub->formToFilter       = [
            'FakeField'  => 'table.column',
            'FakeHaving' => 'abcd.def'
        ];
        $stub->validFilters       = ['table.column', 'abcd.def'];
        $stub->validHavingFilters = ['abcd.def'];

        $stub->_setFilters($submittedValues);

        $this->assertEquals(
            ['abcd.def' => 'I should be put into having'],
            $stub->having,
            'Menu Filter $this->having not set correctly'
        );
    }
}

