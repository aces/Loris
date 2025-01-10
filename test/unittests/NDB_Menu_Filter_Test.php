<?php declare(strict_types=1);

require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/NDB_Menu_Filter.class.inc';

use PHPUnit\Framework\TestCase;

/**
 * Unit test for NDB_Menu_Filter class
 *
 * PHP Version 7
 *
 * @category Tests
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
 */
class NDB_Menu_Filter_Test extends TestCase
{
    protected $sessionMock;

    /**
     * Set up a fake $_SESSION object for assertions.
     */
    protected function setUp(): void
    {
        $this->sessionMock = $this->createMock(stdClass::class);
        $this->sessionMock->method('setProperty');
        $this->sessionMock->method('getProperty');
        $this->sessionMock->method('getUsername');
        $this->sessionMock->method('isLoggedIn');

        $_SESSION = [
            'State' => $this->sessionMock,
        ];
    }

    /**
     * Helper function to return all methods of NDB_Menu_Filter except the given ones.
     */
    private function getAllMethodsExcept(array $methods): array
    {
        $allMethods = get_class_methods(NDB_Menu_Filter::class);
        return array_diff($allMethods, $methods);
    }

    /**
     * Test the _resetFilters function.
     *
     * @covers NDB_Menu_Filter::_resetFilters
     */
    public function testResetFilters(): void
    {
        $stub = $this->getMockBuilder(NDB_Menu_Filter::class)
            ->onlyMethods($this->getAllMethodsExcept(['_resetFilters']))
            ->disableOriginalConstructor()
            ->getMock();

        $this->sessionMock->expects($this->exactly(2))
            ->method('setProperty')
            ->withConsecutive(
                ['filter', null],
                ['keyword', null]
            );

        $stub->_resetFilters();
    }

    /**
     * Test the _setSearchKeyword function.
     *
     * @covers NDB_Menu_Filter::_setSearchKeyword
     */
    public function testSetSearchKeyword(): void
    {
        $stub = $this->getMockBuilder(NDB_Menu_Filter::class)
            ->onlyMethods($this->getAllMethodsExcept(['_setSearchKeyword']))
            ->disableOriginalConstructor()
            ->getMock();

        $stub->_setSearchKeyword('abc');

        $this->assertEquals('abc', $stub->searchKey['keyword'] ?? null);
    }

    /**
     * Test the _setFilters function.
     *
     * @covers NDB_Menu_Filter::_setFilters
     */
    public function testSetFilters(): void
    {
        $stub = $this->getMockBuilder(NDB_Menu_Filter::class)
            ->onlyMethods($this->getAllMethodsExcept(['_setFilters']))
            ->disableOriginalConstructor()
            ->getMock();

        $stub->form = $this->createMock(LorisForm::class);
        $stub->form->expects($this->once())
            ->method('applyFilter')
            ->with('__ALL__', 'trim');

        $submittedValues = [
            'FakeField'        => '      I should be put into filter     ',
            'FakeInvalidField' => 'I should not be set',
            'FakeHaving'       => 'I should be put into having',
        ];
        $_REQUEST = $submittedValues;

        $stub->formToFilter = [
            'FakeField'  => 'table.column',
            'FakeHaving' => 'abcd.def',
        ];
        $stub->validFilters = ['table.column', 'abcd.def'];
        $stub->validHavingFilters = ['abcd.def'];

        $stub->_setFilters($submittedValues);

        $this->assertEquals(
            [
                'table.column' => 'I should be put into filter',
            ],
            $stub->filter,
            'Menu Filter $filter not set correctly'
        );

        $this->assertEquals(
            [
                'abcd.def' => 'I should be put into having',
            ],
            $stub->having,
            'Menu Filter $having not set correctly'
        );
    }
}

