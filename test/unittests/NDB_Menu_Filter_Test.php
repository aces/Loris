<?php
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
    /**
     * Set up sets a fake $_SESSION object that we can use for
     * assertions
     *
     * @return void
     */
    function setUp() : void
    {
        global $_SESSION;
        $this->Session = $this->getMockBuilder(stdClass::class)->addMethods(
            [
                'getProperty',
                'setProperty',
                'getUsername',
                'isLoggedIn'
            ]
        )->getMock();
        $_SESSION      = [
            'State' => $this->Session
        ];
    }

    /**
     * Helper function to use for creating stubs that stub out everything except
     * the method being tested
     *
     * @param [] $methods The methods to exclude
     *
     * @return []
     */
    function _getAllMethodsExcept($methods)
    {
        $AllMethods = get_class_methods('NDB_Menu_Filter');

        return array_diff($AllMethods, $methods);
    }

    /**
     * Test the _resetFilters function. This should, at the minimum, call
     * setProperty('filter', null) and setProperty('keyword', null)
     *
     * @covers NDB_Menu_Filter::_resetFilters
     *
     * @return void
     */
    function testResetFilters()
    {
        $method          = ['_resetFilters'];
        $allOtherMethods = $this->_getAllMethodsExcept($method);
        $stub            = $this->getMockBuilder('NDB_Menu_Filter')
            ->addMethods($allOtherMethods)
            ->disableOriginalConstructor()
            ->getMock();

        // Reset calls
        $this->Session->expects($this->exactly(2))
            ->method('setProperty')
            ->withConsecutive(
                ['filter', null],
                ['keyword', null]
            );

        $stub->_resetFilters();
    }

    /**
     * Test the SetSearchKeyword function. The function should result in
     * $this->searchKey being set to array('keyword' => param)
     *
     * @covers NDB_Menu_Filter::_setSearchKeyword
     *
     * @return void
     */
    function testSetSearchKeyword()
    {
        $method          = ['_setSearchKeyword'];
        $allOtherMethods = $this->_getAllMethodsExcept($method);
        $stub            = $this->getMockBuilder('NDB_Menu_Filter')
            ->addMethods($allOtherMethods)
            ->disableOriginalConstructor()
            ->getMock();

        $stub->_setSearchKeyword('abc');

        $this->assertEquals($stub->searchKey['keyword'], 'abc');
    }

    /**
     * Test the _setFilters function.
     * This should ensure that:
     *     1. Only form elements that are mapped in $formToFilter are set
     *     2. Invalid filters are thrown away.
     *     3. Only validFilters are set in $this->filter
     *     4. Only validHavingFilters are set in $this->having
     *     5. Values of all fields are (PHP) trimmed before being put into the
     *        filter
     *
     * @covers NDB_Menu_Filter::_setFilters
     *
     * @return void
     */
    function testSetFilters()
    {
        $method          = ['_setFilters'];
        $allOtherMethods = $this->_getAllMethodsExcept($method);
        $stub            = $this->getMockBuilder('NDB_Menu_Filter')
            ->addMethods($allOtherMethods)
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

        $stub->_setFilters($submittedValues);

        /*
        $this->assertEquals(
            $stub->filter,
            array(
                'table.column' => 'I should be put into filter',
            ),
            'Menu Filter $this->filter not set correctly'
        );
         */
        $this->assertEquals(
            $stub->having,
            [
                'abcd.def' => 'I should be put into having',
            ],
            'Menu Filter $this->having not set correctly'
        );
    }

    /**
     * Tests _setFilterSortOrder($order) function. This test should ensure
     * that:
     *   1. If function is called with an array of the form:
     *          [
     *              'field'      => *Form* Field Name,
     *              'fieldOrder' => 'ASC' OR 'DESC'
     *          ]
     *      then the filter is updated appropriately to be sorted by those
     *      columns while the rest of the filter is unaffected.
     *
     * @return void
     */
    function testSetFilterSortOrder()
    {
        $method          = ['_setFilterSortOrder'];
        $allOtherMethods = $this->_getAllMethodsExcept($method);
        $stub            = $this->getMockBuilder('NDB_Menu_Filter')
            ->addMethods($allOtherMethods)
            ->disableOriginalConstructor()
            ->getMock();

        $stub->headers      = ['FakeField', "FakeField2"];
        $stub->formToFilter = [
            'FakeField'  => 'table.column',
            'FakeField2' => 'table.column2'
        ];
        $stub->filter       = [
            'table.column'  => 'I am a saved filter',
            'table.column2' => 'I am a saved filter',
        ];

        $stub->_setFilterSortOrder(
            [
                'field'      => "FakeField",
                "fieldOrder" => "DESC",
            ]
        );

        $this->assertEquals(
            $stub->filter,
            [
                'table.column'  => 'I am a saved filter',
                'table.column2' => 'I am a saved filter',
                'order'         => [
                    'field'      => 'FakeField',
                    'fieldOrder' => "DESC",
                ]
            ]
        );

        $stub->_setFilterSortOrder(
            [
                'field'      => "FakeField2",
                "fieldOrder" => "ASC",
            ]
        );

        $this->assertEquals(
            $stub->filter,
            [
                'table.column'  => 'I am a saved filter',
                'table.column2' => 'I am a saved filter',
                'order'         => [
                    'field'      => 'FakeField2',
                    'fieldOrder' => "ASC",
                ]
            ]
        );

    }
    /**
     * TODO:
     * setupFilters
     */
}

