<?php
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/LorisForm.class.inc';

class LorisForms_Test extends PHPUnit_Framework_TestCase
{
    function setUp() {
        $this->form = new LorisForm();
    }

    function assertType($el, $type) {
        if(!isset($this->form->form[$el])) {
            $this->fail("Element $el does not exist");
            return;
        }
        $this->assertEquals($this->form->form[$el]['type'], $type, "Element $el was not of type $type");
    }

    function assertLabel($el, $label) {
        if(!isset($this->form->form[$el])) {
            $this->fail("Element $el does not exist");
            return;
        }
        $this->assertEquals($this->form->form[$el]['label'], $label, "Element $el's label did not match $label");
    }


    function testAddSelect() {
        $this->form->addSelect("abc", "Hello", array());

        $this->assertTrue(isset($this->form->form['abc']));
        $this->assertType("abc", "select");
        $this->assertLabel("abc", "Hello");
    }

    function testAddText() {
        $this->form->addText("abc", "Hello", array());
        $this->assertType("abc", "text");
        $this->assertLabel("abc", "Hello");
    }

    function testAddDate() {
        $this->form->addDate("abc", "Hello", array());
        $this->assertType("abc", "date");
        $this->assertLabel("abc", "Hello");
    }

    function testAddElementSelect() {
        $this->form = $this->getMockBuilder('LorisForm')
                           ->setMethods(array('addSelect', 'addDate',))
                           ->getMock();
        $this->form->expects($this->once())
                  ->method('addSelect');
        $this->form->addElement("select", "abc", "Hello");
    }
    function testAddElementDate() {
        $this->form = $this->getMockBuilder('LorisForm')
                           ->setMethods(array('addDate'))
                           ->getMock();
        $this->form->expects($this->once())
                  ->method('addDate');
        $this->form->addElement("date", "abc", "Hello");
    }
    function testAddElementText() {
        $this->form = $this->getMockBuilder('LorisForm')
                           ->setMethods(array('addText'))
                           ->getMock();
        $this->form->expects($this->once())
                  ->method('addText');
        $this->form->addElement("text", "abc", "Hello");
    }

}
?>
