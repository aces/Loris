<?php
require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/NDB_Menu_Filter.class.inc';

class NDBMenuFilterTest extends PHPUnit_Framework_TestCase
{
    /**
     * Set up sets a fake $_SESSION object that we can use for
     * assertions
     */
    function setUp() {
        global $_SESSION;
        $this->Session = $this->getMock('stdClass', array('getProperty', 'setProperty'));

        $_SESSION = array(
            'State' => $this->Session
        );
    }

    /**
     * Helper function to use for creating stubs that stub out everything except
     * the method being tested
     */
    function _getAllMethodsExcept($methods) {
        $AllMethods = get_class_methods('NDB_Menu_Filter');

        return array_diff($AllMethods, $methods);
    }

    /**
     * Test the _resetFilters function. This should, at the minimum, call
     * setProperty('filter', null) and setProperty('keyword', null)
     *
     * @covers NDB_Menu_Filter::_resetFilters
     */
    function testResetFilters() {
        $method = array('_resetFilters');
        $allOtherMethods = $this->_getAllMethodsExcept($method);
        $stub = $this->getMock('NDB_Menu_Filter', $this->_getAllMethodsExcept($method));

        // Reset calls
        $this->Session->expects($this->exactly(2))
            ->method('setProperty')
            ->withConsecutive(
                array('filter', null),
                array('keyword', null)
            );

        $stub->_resetFilters();
    }

    /**
     * Test the SetSearchKeyword function. The function should result in
     * $this->searchKey being set to array('keyword' => param)
     *
     * @covers NDB_Menu_Filter::_setSearchKeyword
     */
    function testSetSearchKeyword() {
        $method = array('_setSearchKeyword');
        $allOtherMethods = $this->_getAllMethodsExcept($method);
        $stub = $this->getMock('NDB_Menu_Filter', $this->_getAllMethodsExcept($method));

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
     *
     * @covers NDB_Menu_Filter::_setFilters
     */
    function testSetFilters() {
        $method = array('_setFilters');
        $allOtherMethods = $this->_getAllMethodsExcept($method);
        $stub = $this->getMock('NDB_Menu_Filter', $this->_getAllMethodsExcept($method));

        $stub->formToFilter = array(
            'FakeField'  => 'table.column',
            'FakeHaving' => 'abcd.def'
        );
        $stub->validFilters = array('table.column', 'abcd.def');
        $stub->validHavingFilters = array('abcd.def');

        $stub->_setFilters(
            array(
                'FakeField'        => 'I should be put into filter',
                'FakeInvalidField' => 'I should not be set',
                'FakeHaving'       => 'I should be put into having'
            )
            );

        $this->assertEquals(
            $stub->filter,
            array(
                'table.column' => 'I should be put into filter',
            ),
            'Menu Filter $this->filter not set correctly'
        );
        $this->assertEquals(
            $stub->having,
            array(
                'abcd.def' => 'I should be put into having',
            ),
            'Menu Filter $this->having not set correctly'
        );
    }

    /*
     * TODO:
     * setFilterSortOrder
     * setupFilters
}
?>
