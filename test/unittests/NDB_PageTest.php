<?php declare(strict_types=1);
/**
 * Unit tests for NDB_Page class
 *
 * PHP Version 7
 *
 * @category Tests
 * @package  Main
 * @author   Alexandra Livadas <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use PHPUnit\Framework\TestCase;
/**
 * Unit test for NDB_Config class
 *
 * @category Tests
 * @package  Main
 * @author   Shen Wang <alexandra.livadas@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_PageTest extends TestCase
{

    /**
     * The NDB_Page object used for testing
     *
     * @var NDB_Page
     */
    private $_page;

    /**
     * The Module object used for testing
     *
     * @var Module
     */
    private $_module;

    /**
     * This method is called before each test is executed
     *
     * @return void
     */
    protected function setUp()
    {
        parent::setUp();
        $this->_module = new Module("test_module", "php/libraries/");
        $this->_page = new NDB_Page(
            $this->_module, "test_page", "515", "123", "test_form"
        );
    }

    /**
     * This method is called after each test is executed
     *
     * @return void
     */
    protected function tearDown()
    {
        parent::tearDown();
    }

    /**
     * Test that the _construct function sets all variables correctly
     *
     * @covers NDB_Page::_construct
     * @return void
     */
    public function testConstruct()
    {
        $this->assertEquals("test_module", $this->_page->name);
        $this->assertEquals("test_page", $this->_page->page);
        $this->assertEquals("515", $this->_page->identifier);
        $this->assertEquals("123", $this->_page->commentID);
        $this->assertEquals("test_page", $this->_page->template);
    }

    /**
     * Test that setTemplateVar correctly sets a value in the 
     * tpl_data array and that getTemplateData returns the correct information
     *
     * @covers NDB_Page::setTemplateVar
     * @covers NDB_Page::getTemplateData
     * @return void
     */
    public function testSetAndGetTemplateVar()
    {
        $this->_page->setTemplateVar("test_var", "test_value");
        $data = $this->_page->getTemplateData();
        $this->assertEquals("test_value", $data['test_var']);
    }

    /**
     * Test that addFile calls addElement from LorisForm and properly adds
     * an element to the page's form
     *
     * @covers NDB_Page::addFile
     * @return void
     */
    public function testAddFile()
    {
        $this->_page->addFile("test_name", "test_label");
        $this->assertEquals(
            array('name'  => 'test_name',
                  'label' => 'test_label',
                  'type'  => 'file',
                  'class' => 'fileUpload'), 
            $this->_page->form->form['test_name']
        );
    }

    /**
     * Test that addHeader calls addElement from LorisForm and properly adds
     * an element to the page's form
     * FIXME: This is incomplete because the addHeader method sets the name value
     *        to null which makes it hard to define the element or to find it in the
     *        form->form array! See fixme commmet in addHeader method 
     *        - Alexandra Livadas
     *
     * @covers NDB_Page::addHeader
     * @return void
     */
    public function testAddHeader()
    {
        $this->markTestIncomplete("This test is incomplete!");
        $this->_page->addHeader("test_header");
        $this->assertEquals(
            array('label' => 'test_header',
                  'type'  => 'header'),
            $this->_page->form->form['anonymous1']
        );
    }

    /**
     * Test that addSelect calls addElement from LorisForm and properly adds
     * an element to the page's form
     *
     * @covers NDB_Page::addSelect
     * @return void
     */
    public function testAddSelect()
    {
        $this->_page->addSelect("test_name", "test_label", array());
        $this->assertEquals(
            array('name'    => 'test_name',
                  'label'   => 'test_label',
                  'type'    => 'select',
                  'class'   => 'form-control input-sm',
                  'options' => array()),
            $this->_page->form->form['test_name']
        );
    }

    /**
     * Test that addLabel calls addElement from LorisForm and properly adds
     * an element to the page's form
     * FIXME: Same as testAddHeader: This is incomplete because the addLabel
     *        method sets the name value to null which makes it hard to 
     *        define the element or to find it in the form->form array! 
     *        See fixme commmet in addHeader method
     *        - Alexandra Livadas
     *
     * @covers NDB_Page::addLabel
     * @return void
     */
    public function testAddLabel()
    {
        $this->markTestIncomplete("This test is incomplete!");
        $this->_page->addLabel("test_label");
        $this->assertEquals(
            array('label'   => 'test_label',
                  'type'    => 'static'),
            $this->_page->form->form['anonymous2']
        );
    }

    /**
     * Test that addScoreColumn calls addElement from LorisForm and properly adds
     * an element to the page's form
     *
     * @covers NDB_Page::addScoreColumn
     * @return void
     */
    public function testAddScoreColumn()
    {
        $this->_page->addScoreColumn("test_name", "test_label");
        $this->assertEquals(
            array('name'    => 'test_name',
                  'label'   => 'test_label',
                  'type'    => 'static'),
            $this->_page->form->form['test_name']
        );
    }

    /**
     * Test that addBasicText calls addElement from LorisForm and properly adds
     * an element to the page's form
     *
     * @covers NDB_Page::addBasicText
     * @return void
     */
    public function testAddBasicText()
    {
        $this->_page->addBasicText("test_name", "test_label");
        $this->assertEquals(
            array('name'    => 'test_name',
                  'label'   => 'test_label',
                  'type'    => 'text',
                  'class'   => 'form-control input-sm'),
            $this->_page->form->form['test_name']
        );
    }

    /**
     * Test that addBasicTextArea calls addElement from LorisForm and properly adds
     * an element to the page's form
     *
     * @covers NDB_Page::addBasicTextArea
     * @return void
     */
    public function testAddBasicTextArea()
    {
        $this->_page->addBasicTextArea("test_name", "test_label");
        $this->assertEquals(
            array('name'    => 'test_name',
                  'label'   => 'test_label',
                  'type'    => 'textarea',
                  'class'   => 'form-control input-sm'),
            $this->_page->form->form['test_name']
        );
    }

    /**
     * Test that addBasicDate calls addElement from LorisForm and properly adds
     * an element to the page's form when dateOptions is not set. Since
     * dateOptions is not set, the options array should remain empty. 
     *
     * @covers NDB_Page::addBasicDate
     * @return void
     */
    public function testAddBasicDateWithNoDateOptions()
    {
        $this->_page->addBasicDate("test_name", "test_label");
        $this->assertEquals(
            array('name'    => 'test_name',
                  'label'   => 'test_label',
                  'type'    => 'date',
                  'class'   => 'form-control input-sm',
                  'options' => array()),
            $this->_page->form->form['test_name']
        );
    }

    /**
     * Test that addBasicDate calls addElement from LorisForm and properly adds
     * an element to the page's form when dateOptions is set. Since
     * dateOptions is set, the options array should have information in it.
     *
     * @covers NDB_Page::addBasicDate
     * @return void
     */
    public function testAddBasicDateWithDateOptionsSet()
    {
        $this->_page->dateOptions = array('someOption' => 'true');
        $this->_page->addBasicDate("test_name", "test_label");
        $this->assertEquals(
            array('name'    => 'test_name',
                  'label'   => 'test_label',
                  'type'    => 'date',
                  'class'   => 'form-control input-sm',
                  'options' => array('someOption' => 'true')),
            $this->_page->form->form['test_name']
        );
    }

    /**
     * Test that addCheckbox calls addElement from LorisForm and properly adds
     * an element to the page's form
     * TODO: Update this test once addCheckbox method is fixed.
     *
     * @covers NDB_Page::addCheckbox
     * @return void
     */
    public function testAddCheckbox()
    {
        $this->_page->addCheckbox("test_name", "test_label", array());
        $this->assertEquals(
            array('name'    => 'test_name',
                  'label'   => 'test_label',
                  'type'    => 'advcheckbox'),
            $this->_page->form->form['test_name']
        );
    }

    /**
     * Test that addRadio calls LorisForm::addGroup and properly creates a 
     * group of radio elements.
     *
     * @note See fixme comment for NDB_Page::addRadio
     *
     * @covers NDB_Page::addRadio
     * @return void
     */
    public function testAddRadio()
    {
        $radios = array(
                      array('label' => 'label1',
                            'value' => 'value1'),
                      array('label' => 'label2',
                            'value' => 'value2'));
        $elementsArray = array(
                             array('name' => 'test_radio',
                                   'label' => 'label1',
                                   'value' => 'value1',
                                   'type' => 'radio',
                                   'class' => 'form-control input-sm'),
                             array('name' => 'test_radio',
                                   'label' => 'label2',
                                   'value' => 'value2',
                                   'type' => 'radio',
                                   'class' => 'form-control input-sm'));
        $this->_page->addRadio("test_radio", "group_label", $radios);
        $this->assertEquals(
            array('name' => 'test_radio_group',
                  'label' => 'group_label', 
                  'type' => 'group',
                  'delimiter' => ' ',
                  'options' => false,
                  'elements' => $elementsArray),
            $this->_page->form->form['test_radio_group']
        );
    }

    /** 
     * Test that addHidden calls addElement from LorisForm and properly adds
     * an element to the page's form
     *
     * @covers NDB_Page::addHidden
     * @return void
     */
    public function testAddHidden()
    {
        $this->_page->addHidden("test_name", "test_value");
        $this->assertEquals(
            array('name'    => 'test_name',
                  'label'   => null,
                  'value'   => 'test_value',
                  'type'    => 'hidden'),
            $this->_page->form->form['test_name']
        );
    }

    /**
     * Test that addTextAreaGroup adds a group of elements that consists of
     * a text area element and a 'not_answered' select element.
     *
     * @covers NDB_Page::addTextAreaGroup
     * @return void
     */
    public function testAddTextAreaGroup()
    {
        $options = array(''             => '',
                         'not_answered' => 'Not Answered');
        $elementsArray = array(
                             array('name' => 'test_field',
                                   'label' => '', 
                                   'type' => 'textarea',
                                   'class' => 'form-control input-sm'),
                             array('name' => 'test_field_status',
                                   'label' => '', 
                                   'type' => 'select',
                                   'options' => $options,
                                   'class' => 'form-control input-sm not-answered')
                         );

        $this->_page->addTextAreaGroup("test_field", "test_label");
        $this->assertEquals(
            array('name' => 'test_field_group',
                  'type' => 'group',
                  'label' => 'test_label',
                  'delimiter' => ' ',
                  'options' => false,
                  'elements' => $elementsArray),
            $this->_page->form->form['test_field_group']
        );
    }

    /**
     * Test that createDate returns an array representing a date element
     *
     * @covers NDB_Page::createDate
     * @return void
     */
    public function testCreateDate()
    {
        $this->assertEquals(
            array('name' => 'test_field', 
                  'label' => 'test_label',
                  'type' => 'date',
                  'class' => 'form-control input-sm',
                  'options' => null),
            $this->_page->createDate("test_field", "test_label")
        );
    }
}
