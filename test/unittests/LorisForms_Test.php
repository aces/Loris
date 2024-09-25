<?php
/**
 * This tests the LorisForm replacement for HTML_QuickForm used by
 * Loris.
 *
 * PHP Version 5
 *
 * @category Tests
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once __DIR__ . '/../../vendor/autoload.php';
require_once __DIR__ . '/../../php/libraries/LorisForm.class.inc';
use PHPUnit\Framework\TestCase;
/**
 * This tests the LorisForm replacement for HTML_QuickForm used by
 * Loris.
 *
 * @category Tests
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class LorisForms_Test extends TestCase
{
    /**
     * A LorisForm to test. This is a non-mocked form
     * set up by the setup function. Tests using a mock
     * use their own local variables.
     *
     * @var \LorisForm
     */
    protected $form;

    /**
     * Creates a new LorisForm to use for testing
     *
     * @return void
     */
    function setUp(): void
    {
        $this->form = new LorisForm();
    }

    /**
     * Custom assertion to assert that the type of an element
     * is equal to the provided type. Use this instead of
     *
     * @param string $el   The element name
     * @param string $type The expected type of this element
     *                     (ie select, checkbox, etc)
     *
     * @return void but makes assertions
     */
    function assertType($el, $type)
    {
        if (!isset($this->form->form[$el])) {
            $this->fail("Element $el does not exist");
            return;
        }
        $this->assertEquals(
            $this->form->form[$el]['type'],
            $type,
            "Element $el was not of type $type"
        );
    }

    /**
     * Custom assertion to assert that the label of an element
     * is correct
     *
     * @param string  $el    The element name
     * @param ?string $label The expected label for this element
     *
     * @return void but makes assertions
     */
    function assertLabel($el, $label)
    {
        if (!isset($this->form->form[$el])) {
            $this->fail("Element $el does not exist");
            return;
        }
        $this->assertEquals(
            $this->form->form[$el]['label'],
            $label,
            "Element $el's label did not match $label"
        );
    }

    /**
     * Custom assertion to assert that some attribute of an element
     * is correct
     *
     * @param string               $el          The element name
     * @param string               $attribute   The attribute name to assert
     *                                          (ie class, id, value, etc)
     * @param string|array|boolean $attribValue The expected content of the
     *                                          attribute
     *
     * @return void but makes assertions
     */
    function assertAttribute($el, $attribute, $attribValue)
    {
        if (!isset($this->form->form[$el])) {
            $this->fail("Element $el does not exist");
            return;
        }

        if (is_array($attribValue)) {
            $msg = "[";
            foreach ($attribValue as $i => $val) {
                if (isset($val['name'])) {
                    $msg .= $val['name'];
                } else {
                    $msg .= $val;
                }
                if ($i != count($attribValue)-1) {
                    $msg .= ', ';
                }
            }
            $msg .= "]";
        } else {
            $msg = $attribValue;
        }
        $this->assertEquals(
            $this->form->form[$el][$attribute],
            $attribValue,
            "Element $el's $attribute did not match $msg"
        );
    }


    /**
     * Test that the addSelect wrapper adds an element of the appropriate
     * type to the page
     *
     * @covers LorisForm::addSelect
     * @return void
     */
    function testAddSelect()
    {
        $this->form->addSelect("abc", "Hello", []);

        $this->assertTrue(isset($this->form->form['abc']));
        $this->assertType("abc", "select");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addSelect wrapper adds an element of the appropriate
     * type to the page and that it correctly sets the 'multiple' attribute
     *
     * @covers LorisForm::addSelect
     * @return void
     */
    function testAddMultiSelect()
    {
        $this->form->addSelect(
            "abc",
            "Hello",
            ['3' => 'Option 3'],
            ['multiple' => 'multiple']
        );

        $this->assertTrue(isset($this->form->form['abc']));
        $this->assertType("abc", "select");
        $this->assertLabel("abc", "Hello");

        $rendered = $this->form->renderElement($this->form->form['abc']);

        $html = new DOMDocument();
        // Add the HTML/body tags, because loadHTML will implicitly add them anyways
        // and this makes it a little clearer how the DOM will be parsed.
        $html->loadHTML("<html><body>$rendered</body></html>");

        // documentElement is the <html> element, first child of that is the <body>,
        // first child of that is the rendered element
        $element = $html->documentElement->firstChild->firstChild;

        // The DOMNode $element needs to be a DOMElement for
        // hasAttribute to exist.
        assert($element instanceof \DOMElement);
        $this->assertEquals($element->nodeName, "select");

        $this->assertTrue($element->hasAttribute("multiple"));
    }

    /**
     * Test that the addStatic wrapper adds an elements of the appropriate
     * type to the page
     *
     * @covers LorisForm::addStatic
     * @return void
     */
    function testAddStatic()
    {
        $this->form->addStatic("abc", "Hello");
        $this->assertType("abc", "static");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addText wrapper adds an element of the appropriate
     * type to the page
     *
     * @covers LorisForm::addText
     * @return void
     */
    function testAddText()
    {
        $this->form->addText("abc", "Hello", []);
        $this->assertType("abc", "text");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addDate wrapper adds an element of the appropriate
     * type to the page and that the 'options' attribute is set
     *
     * @covers LorisForm::addDate
     * @return void
     */
    function testAddDate()
    {
        $this->form->addDate("abc", "Hello", [], []);
        $this->assertType("abc", "date");
        $this->assertLabel("abc", "Hello");
        $this->assertTrue(isset($this->form->form["abc"]["options"]));
    }


    /**
     * Test that the addFile wrapper adds an element of the appropriate
     * type to the page
     *
     * @covers LorisForm::addFile
     * @return void
     */
    function testAddFile()
    {
        $this->form->addFile("abc", "Hello", []);
        $this->assertType("abc", "file");
        $this->assertLabel("abc", "Hello");
    }


    /**
     * Test that the addPassword wrapper adds an element of the appropriate
     * type to the page
     *
     * @covers LorisForm::addPassword
     * @return void
     */
    function testAddPassword()
    {
        $this->form->addPassword("abc", "Hello", []);
        $this->assertType("abc", "password");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addHidden wrapper adds an element of the appropriate
     * type to the page
     *
     * @covers LorisForm::addHidden
     * @return void
     */
    function testAddHidden()
    {
        $this->form->addHidden("abc", "value1", []);
        $this->assertType("abc", "hidden");
        //The addHidden method sets the label to null in every case
        $this->assertLabel("abc", null);
        // The second parameter taken by the addHidden method
        // sets the "value" attribute of the element
        $this->assertAttribute("abc", "value", "value1");
    }

    /**
     * Test that the addTextArea wrapper adds an element of the appropriate
     * type to the page
     *
     * @covers LorisForm::addTextArea
     * @return void
     */
    function testAddTextArea()
    {
        $this->form->addTextArea("abc", "Hello", []);
        $this->assertType("abc", "textarea");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addTextArea wrapper adds an element of the appropriate
     * type to the page and that the rows and cols attributes
     * are set correctly if specified
     *
     * @note This test is added because the addTextArea wrapper
     *       sets the rows and cols attributes itself and
     *       not using the createBase method
     *
     * @covers LorisForm::addTextArea
     * @return void
     */
    function testAddTextAreaWithRowsOrCols()
    {
        $rowAttrib = ['rows' => 'row1'];
        $colAttrib = ['cols' => 'col1'];

        $this->form->addTextArea("abc", "Hello", $rowAttrib);
        $this->assertType("abc", "textarea");
        $this->assertLabel("abc", "Hello");
        $this->assertAttribute("abc", "rows", "row1");

        $this->form->addTextArea("abc", "Hello", $colAttrib);
        $this->assertType("abc", "textarea");
        $this->assertLabel("abc", "Hello");
        $this->assertAttribute("abc", "cols", "col1");
    }

    /**
     * Test that the addCheckbox wrapper adds an element of the appropriate
     * type to the page
     *
     * @covers LorisForm::addCheckbox
     * @return void
     */
    function testAddCheckbox()
    {
        $this->form->addCheckbox("abc", "Hello", []);
        $this->assertType("abc", "advcheckbox");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addHeader wrapper adds an element of the appropriate
     * type to the page
     *
     * @covers LorisForm::addHeader
     * @return void
     */
    function testAddHeader()
    {
        $this->form->addHeader("abc", "Hello", []);
        $this->assertType("abc", "header");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addLink wrapper adds an element of the appropriate
     * type to the page
     *
     * @covers LorisForm::addLink
     * @return void
     */
    function testAddLink()
    {
        $this->form->addLink("abc", "Hello", "example_url.com", "link1");
        $this->assertType("abc", "link");
        $this->assertLabel("abc", "Hello");
        $this->assertAttribute("abc", "url", "example_url.com");
        $this->assertAttribute("abc", "link", "link1");
    }

    /**
     * Test that the addRadio wrapper adds an element of the appropriate
     * type to the page and that the options attribute is set
     *
     * @covers LorisForm::addRadio
     * @return void
     */
    function testAddRadio()
    {
        $this->form->addRadio("abc", "Hello", [], []);
        $this->assertType("abc", "radio");
        $this->assertLabel("abc", "Hello");
        $this->assertTrue(isset($this->form->form['abc']['options']));
    }

    /**
     * Test that the addGroup wrapper adds a group element to the form
     * with the correct 'elements' array
     *
     * @covers LorisForm::addGroup
     * @return void
     */
    function testAddGroup()
    {
        $testOptions = ['prefix_wrapper' => 'abc_prefix',
            'postfix_wrapper' => 'abc_postfix'
        ];
        $textEl      = $this->form->createText("abc_text", "Hello_text", []);
        $textareaEl  = $this->form->createTextArea("abc_textarea", "Hello_textarea");
        $this->form->addGroup(
            [$textEl, $textareaEl],
            "abc_group",
            "Hello",
            ", ",
            $testOptions
        );

        $this->assertType('abc_group', 'group');
        $this->assertLabel('abc_group', 'Hello');
        $this->assertAttribute('abc_group', 'elements', [$textEl, $textareaEl]);
        $this->assertAttribute('abc_group', 'delimiter', ', ');
        $this->assertAttribute('abc_group', 'options', $testOptions);
    }

    /**
     * Test that addPageBreak wrappers adds a page break element to the form
     *
     * @covers LorisForm::addPageBreak
     * @return void
     */
    function testAddPageBreak()
    {
        $this->form->addPageBreak("abc", "Hello", []);
        $this->assertType("abc", "page");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "select" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementSelect()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addSelect', 'addDate'])
            ->getMock();
        $form->expects($this->once())
            ->method('addSelect');

        '@phan-var \LorisForm $form';
        $form->addElement("select", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "date" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementDate()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addDate'])
            ->getMock();
        $form->expects($this->once())
            ->method('addDate');

        '@phan-var \LorisForm $form';
        $form->addElement("date", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "text" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementText()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addText'])
            ->getMock();
        $form->expects($this->once())
            ->method('addText');

        '@phan-var \LorisForm $form';
        $form->addElement("text", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "text" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementFile()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addFile'])
            ->getMock();
        $form->expects($this->once())
            ->method('addFile');

        '@phan-var \LorisForm $form';
        $form->addElement("file", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "password" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementPassword()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addPassword'])
            ->getMock();
        $form->expects($this->once())
            ->method('addPassword');

        '@phan-var \LorisForm $form';
        $form->addElement("password", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "static" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementStatic()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addStatic'])
            ->getMock();
        $form->expects($this->once())
            ->method('addStatic');

        '@phan-var \LorisForm $form';
        $form->addElement("static", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "textarea" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementTextArea()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addTextArea'])
            ->getMock();
        $form->expects($this->once())
            ->method('addTextArea');

        '@phan-var \LorisForm $form';
        $form->addElement("textarea", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "header" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementHeader()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addHeader'])
            ->getMock();
        $form->expects($this->once())
            ->method('addHeader');

        '@phan-var \LorisForm $form';
        $form->addElement("header", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "radio" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementRadio()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addRadio'])
            ->getMock();
        $form->expects($this->once())
            ->method('addRadio');

        '@phan-var \LorisForm $form';
        $form->addElement("radio", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "hidden" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementHidden()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addHidden'])
            ->getMock();
        $form->expects($this->once())
            ->method('addHidden');

        '@phan-var \LorisForm $form';
        $form->addElement("hidden", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "link" adds an element of
     * the appropriate type to the page
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementLink()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['addLink'])
            ->getMock();
        $form->expects($this->once())
            ->method('addLink');

        '@phan-var \LorisForm $form';
        $form->addElement("link", "abc", "Hello");
    }

    /**
     * Test that the addElement wrapper with type "advcheckbox" adds an element of
     * the appropriate type and with the checkStates and text attributes if specified
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementAdvCheckboxWithStatesAndText()
    {
        $testAttributes  = ['disabled' => 'yes'];
        $testCheckStates = ['on' => 'default_off',
            'off' => 'default_on'
        ];
        $this->form->addElement(
            "advcheckbox",
            "abc",
            "Hello",
            "text",
            $testAttributes,
            $testCheckStates
        );
        $this->assertType("abc", "advcheckbox");
        $this->assertEquals(
            $testCheckStates,
            $this->form->form['abc']['checkStates']
        );
        $this->assertEquals("text", $this->form->form['abc']['_text']);
    }

    /**
     * Test that the addElement wrapper with type "advcheckbox" adds an element of
     * the appropriate type
     *
     * @covers LorisForm::addElement
     * @return void
     */
    function testAddElementAdvCheckboxWithoutExtra()
    {
        $testAttributes = ['disabled' => 'yes'];
        $this->form->addElement("advcheckbox", "abc", "Hello", $testAttributes);
        $this->assertType("abc", "advcheckbox");
        $this->assertTrue(!isset($this->form->form['abc']['checkStates']));
        $this->assertTrue(!isset($this->form->form['abc']['checkStates']));
    }

    /**
     * Test that createElement wrapper with type "text" creates an element
     * of the appropriate type
     *
     * @covers LorisForm::createElement
     * @return void
     */
    function testCreateElementText()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['createText'])
            ->getMock();
        $form->expects($this->once())
            ->method('createText');

        '@phan-var \LorisForm $form';
        $form->createElement("text", "abc", "Hello", [], []);
    }

    /**
     * Test that createElement wrapper with type "select" creates an element
     * of the appropriate type
     *
     * @covers LorisForm::createElement
     * @return void
     */
    function testCreateElementSelect()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['createSelect'])
            ->getMock();
        $form->expects($this->once())
            ->method('createSelect');

        '@phan-var \LorisForm $form';
        $form->createElement("select", "abc", "Hello", [], []);
    }

    /**
     * Test that createElement wrapper with type "submit" creates an element
     * of the appropriate type
     *
     * @covers LorisForm::createElement
     * @return void
     */
    function testCreateElementSubmit()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['createSubmit'])
            ->getMock();
        $form->expects($this->once())
            ->method('createSubmit');

        '@phan-var \LorisForm $form';
        $form->createElement("submit", "abc", "Hello", [], []);
    }

    /**
     * Test that createElement wrapper with type "static" creates an element
     * of the appropriate type
     *
     * @covers LorisForm::createElement
     * @return void
     */
    function testCreateElementStatic()
    {
        $testStatic = $this->form->createElement("static", "abc");
        $this->assertEquals("static", $testStatic['type']);
    }

    /**
     * Test that createElement wrapper with type "advcheckbox" creates an element
     * of the appropriate type with the checkStates and text attributes set
     *
     * @covers LorisForm::createElement
     * @return void
     */
    function testCreateElementAdvCheckboxWithStatesAndText()
    {
        $testAttributes  = ['disabled' => 'yes'];
        $testCheckStates = ['on' => 'default_on',
            'off' => 'default_off'
        ];
        $testAdv         = $this->form->createElement(
            "advcheckbox",
            "abc",
            "Hello",
            "text",
            $testAttributes,
            $testCheckStates
        );
        $this->assertEquals("advcheckbox", $testAdv['type']);
        $this->assertEquals($testCheckStates, $testAdv['checkStates']);
        $this->assertEquals("text", $testAdv['_text']);
    }

    /**
     * Test that createElement wrapper with type "advcheckbox" creates an element
     * of the appropriate type without the checkStates and text attributes set
     *
     * @covers LorisForm::createElement
     * @return void
     */
    function testCreateElementAdvCheckboxWithoutExtra()
    {
        $testAttributes = ['disabled' => 'yes'];
        $testAdv        = $this->form->createElement(
            "advcheckbox",
            "abc",
            "Hello",
            $testAttributes
        );
        $this->assertEquals("advcheckbox", $testAdv['type']);
        $this->assertTrue(!isset($testAdv['checkStates']));
        $this->assertTrue(!isset($testAdv['_text']));
    }

    /**
     * Test that createElement wrapper with type "date" creates an element
     * of the appropriate type
     *
     * @covers LorisForm::createElement
     * @return void
     */
    function testCreateElementDate()
    {
        $testDate = $this->form->createElement("date", "abc");
        $this->assertEquals("date", $testDate['type']);
        $this->assertTrue(isset($testDate['options']));
    }

    /**
     * Test that createElement wrapper with type "radio" creates an element
     * of the appropriate type
     *
     * @covers LorisForm::createElement
     * @return void
     */
    function testCreateElementRadio()
    {
        $testRadio = $this->form->createElement("radio", "abc");
        $this->assertEquals("radio", $testRadio['type']);
    }

    /**
     * Test that createElement wrapper with type "password" creates an element
     * of the appropriate type
     *
     * @covers LorisForm::createElement
     * @return void
     */
    function testCreateElementPassword()
    {
        $testPassword = $this->form->createElement("password", "abc");
        $this->assertEquals("password", $testPassword['type']);
    }

    /**
     * Test that createElement wrapper throws an exception
     * if an invalid element type is given
     *
     * @covers LorisForm::createElement
     * @return void
     */
    function testCreateElementThrowsException()
    {
        $this->expectException('\LorisException');
        $this->form->createElement("invalid_type", "abc");
    }

    /**
     * Test that getValue returns null if no default value is set for the element
     *
     * @covers LorisForm::getValue
     * @return void
     */
    function testGetValueReturnsNullWithNoDefaultSet()
    {
        $this->form->addSelect("abc", "Hello", []);
        $this->assertEquals(null, $this->form->getValue("abc"));
    }

    /**
     * Test that getValue returns the correct default value for the form element
     * and that setDefaults sets the default value for the form element
     *
     * @covers LorisForm::getValue
     * @covers LorisForm::setDefaults
     * @return void
     */
    function testGetValue()
    {
        $this->form->addSelect("abc", "Hello", []);
        $this->form->setDefaults(['abc' => 'abc_default']);
        $this->assertEquals('abc_default', $this->form->getValue("abc"));
    }

    /**
     * Test that getGroupValues returns an array with null values when
     * no defaults are set for the elements given
     *
     * @covers LorisForm::getGroupValues
     * @return void
     */
    function testGetGroupValuesReturnsNullWithNoDefaults()
    {
        $this->form->addElement("select", "abc", "Hello");
        $this->form->addElement("text", "xyz", "Bye");
        $result = [];
        $this->form->getGroupValues(["abc", "xyz"], $result);
        $this->assertEquals(
            ['abc' => null,
                'xyz' => null
            ],
            $result
        );
    }

    /**
     * Test that getGroupValues returns an array with the default values
     * of the array of elements given
     *
     * @covers LorisForm::getGroupValues
     * @return void
     */
    function testGetGroupValues()
    {
        $this->form->addElement("select", "abc", "Hello");
        $this->form->addElement("text", "xyz", "Bye");
        $this->form->setDefaults(
            ['abc' => 'abc_default',
                'xyz' => 'xyz_default'
            ]
        );
        $result = [];
        $this->form->getGroupValues(["abc", "xyz"], $result);
        $this->assertEquals(
            ['abc' => 'abc_default',
                'xyz' => 'xyz_default'
            ],
            $result
        );
    }

    /**
     * Test that getGroupValues iterates through the elements of a group element
     *
     * @covers LorisForm::getGroupValues
     * @return void
     */
    function testGetGroupValuesWithGroupElement()
    {
        $this->form->addElement("select", "abc", "Hello");

        $testOptions = ['prefix_wrapper' => 'abc_prefix',
            'postfix_wrapper' => 'abc_postfix'
        ];
        $textEl      = $this->form->createText("abc_text", "Hello_text", []);
        $textareaEl  = $this->form->createTextArea("abc_textarea", "Hello_textarea");
        $this->form->addGroup(
            [$textEl, $textareaEl],
            "abc_group",
            "Hello",
            ", ",
            $testOptions
        );

        $this->form->setDefaults(
            ['abc' => 'abc_default',
                'abc_group' => 'group_default'
            ]
        );
        $result = [];
        $this->form->getGroupValues(["abc", "abc_group"], $result);
        $this->assertEquals(
            ['abc' => 'abc_default',
                0     => null,
                1     => null
            ],
            $result
        );
    }

    /**
     * Test that staticHTML returns null if there is no default value for the element
     *
     * @covers LorisForm::staticHTML
     * @return void
     */
    function testStaticHTMLReturnsNullWithNoDefault()
    {
        $this->form->addStatic("abc", "Hello");
        $this->assertEquals(null, $this->form->staticHTML($this->form->form["abc"]));
    }

    /**
     * Test that staticHTML returns the default value of the element
     * if the default is set
     *
     * @covers LorisForm::staticHTML
     * @covers LorisForm::setDefaults
     * @return void
     */
    function testStaticHTMLReturnsDefaultValue()
    {
        $this->form->addStatic("abc", "Hello");
        $this->form->setDefaults(['abc' => 'abc_default']);
        $this->assertEquals(
            "abc_default",
            $this->form->staticHTML($this->form->form["abc"])
        );
    }

    /**
     * Test that dateHTML returns the correctly formatted HTML
     * when no attributes or options are specified
     *
     * @covers LorisForm::dateHTML
     * @return void
     */
    function testDateHTMLWithNoOptions()
    {
        $this->form->addDate("abc", "Hello", []);
        //The string below is written this way to stay within the 85 char. limit
        $this->assertEquals(
            "<input name=\"abc\" type=\"date\"".
                "    onChange=\"this.setCustomValidity('')\" >",
            $this->form->dateHTML($this->form->form["abc"])
        );
    }

    /**
     * Test that dateHTML returns the correctly formatted HTML
     * with the given attributes and options. This returns the HTML when 'format'
     * is set to either 'my' or 'ym' in the options array
     *
     * @covers LorisForm::dateHTML
     * @return void
     */
    function testDateHTMLWithFormatNotSetToY()
    {
        $testAttributes = ['class' => 'class1',
            'disabled'   => 'yes',
            'requireMsg' => 'requireMsg1',
            'required'   => 'required1'
        ];
        $testOptions    = ['minYear' => '2010',
            'maxYear' => '2019',
            'format'  => 'ym'
        ];

        $this->form->addDate("abc", "Hello", $testOptions, $testAttributes);
        $this->form->setDefaults(['abc' => 'abc_default']);
        //The string below is written this way to stay within the 85 character limit
        $this->assertEquals(
            "<input name=\"abc\" type=\"month\" class=\"class1\"".
                " min=\"2010-01\" max=\"2019-12\" onChange=".
                "\"this.setCustomValidity('')\" disabled  value=\"abc_default-\" >",
            $this->form->dateHTML($this->form->form["abc"])
        );
    }

    /**
     * Test that dateHTML calls the yearHTML function
     * when 'format' is set to 'y' in the options array
     *
     * @covers LorisForm::dateHTML
     * @return void
     */
    function testDateHTMLWithFormatSetToY()
    {
        $testAttributes = ['class' => 'class1',
            'disabled'   => 'yes',
            'requireMsg' => 'requireMsg1',
            'required'   => 'required1'
        ];
        $testOptions    = ['minYear' => '2010',
            'maxYear' => '2019',
            'format'  => 'y'
        ];

        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['yearHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('yearHTML')
            ->willReturn('called yearHTML function');

        '@phan-var \LorisForm $form';
        $form->addDate("abc", "Hello", $testOptions, $testAttributes);
        $this->assertEquals(
            "called yearHTML function",
            $form->dateHTML($form->form["abc"])
        );
    }

    /**
     * Test that groupHTML returns the correct HTML format
     *
     * @covers LorisForm::groupHTML
     * @return void
     */
    function testGroupHTML()
    {
        $testOptions = ['prefix_wrapper' => 'abc_prefix',
            'postfix_wrapper' => 'abc_postfix'
        ];
        $textEl      = $this->form->createText("abc_text", "Hello_text", []);
        $textareaEl  = $this->form->createTextArea("abc_textarea", "Hello_textarea");
        $this->form->addGroup(
            [$textEl, $textareaEl],
            "abc_group",
            "Hello",
            ", ",
            $testOptions
        );

        $this->assertEquals(
            "abc_prefix<input name=\"abc_text\" type=\"text\"".
                "  >abc_postfix, abc_prefix<textarea name=\"abc_textarea\"".
                "   ></textarea>abc_postfix, ",
            $this->form->groupHTML($this->form->form['abc_group'])
        );
    }

    /**
     * Test that textHTML returns the correctly formatted HTML
     * when no attributes or options are specified
     *
     * @covers LorisForm::textHTML
     * @return void
     */
    function testTextHTMLWithNoOptions()
    {
        $this->form->addText("abc", "Hello");
        $this->assertEquals(
            "<input name=\"abc\" type=\"text\"  >",
            $this->form->textHTML($this->form->form["abc"])
        );
    }

    /**
     * Test that textHTML returns the proper HTML string
     * when the options array is set
     *
     * @covers Utility::textHTML
     * @return void
     */
    function testTextHTMLWithOptionsSet()
    {
        $testOptions = ['class' => 'class1',
            'disabled'    => 'disabled',
            'readonly'    => 'readonly',
            'onchange'    => 'onchange1',
            'oninvalid'   => 'oninvalid1',
            'pattern'     => 'pattern1',
            'required'    => 'required1',
            'placeholder' => 'holder'
        ];
        $this->form->setDefaults(['abc' => 'abc_default']);
        $this->form->addText("abc", "Hello", $testOptions);
        $this->assertEquals(
            "<input name=\"abc\" type=\"text\" class=\"class1\"".
                " onchange=\"onchange1\" oninvalid=\"oninvalid1\"".
                " pattern=\"pattern1\" placeholder=\"holder\" value=\"abc_default\"".
                "disabled readonly>",
            $this->form->textHTML($this->form->form["abc"])
        );
    }

    /**
     * Test that submitHTML returns the correctly formatted HTML
     * when no attributes or options are specified
     *
     * @covers LorisForm::submitHTML
     * @return void
     */
    function testSubmitHTMLWithNoOptions()
    {
        $submit = $this->form->createSubmit("abc", "value1", []);
        $this->assertEquals(
            "<input name=\"abc\" type=\"submit\"  value=\"value1\">",
            $this->form->submitHTML($submit)
        );
    }

    /**
     * Test that submitHTML returns the correctly formatted HTML
     * when the 'class' attribute is specified
     *
     * @covers LorisForm::submitHTML
     * @return void
     */
    function testSubmitHTMLWithOptionsSet()
    {
        $submit = $this->form->createSubmit(
            "abc",
            "value1",
            ['class' => 'class1']
        );
        $this->assertEquals(
            "<input name=\"abc\" type=\"submit\" class=\"class1\" value=\"value1\">",
            $this->form->submitHTML($submit)
        );
    }

    /**
     * Test that submitHTML returns the correctly formatted HTML when the type is
     * specified to be something other than 'submit'
     *
     * @covers LorisForm::textHTML
     * @return void
     */
    function testSubmitHTMLWithDifferentTypeSpecified()
    {
        $submit = $this->form->createSubmit(
            "abc",
            "value1",
            ['class' => 'class1']
        );
        $this->assertEquals(
            "<input name=\"abc\" type=\"text\" class=\"class1\" value=\"value1\">",
            $this->form->submitHTML($submit, 'text')
        );
    }

    /**
     * Test that hiddenHTML returns the correct HTML when no attributes are set
     *
     * @covers LorisForm::hiddenHTML
     * @return void
     */
    function testHiddenHTMLWithNoAttributes()
    {
        $this->form->addHidden("abc", "value1", []);

        $this->assertEquals(
            "<input  name=\"abc\" value=\"value1\" type=\"hidden\">",
            $this->form->hiddenHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that hiddenHTML returns the correct HTML when attributes are set
     *
     * @covers LorisForm::hiddenHTML
     * @return void
     */
    function testHiddenHTMLWithAttributesSet()
    {
        $testAttributes = ['class' => 'class1',
            'pattern' => 'pattern1'
        ];
        $this->form->addHidden("abc", "value1", $testAttributes);
        $this->assertEquals(
            "<input  name=\"abc\" class=\"class1\"".
                " value=\"value1\" pattern=\"pattern1\" type=\"hidden\">",
            $this->form->hiddenHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that linkHTML returns the correct HTML
     *
     * @covers LorisForm::linkHTML
     * @return void
     */
    function testLinkHTML()
    {
        $this->form->addLink("abc", "Hello", "test_url.com", "test_link");
        $this->assertEquals(
            "<a href=\"test_url.com\">test_link</a>",
            $this->form->linkHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that fileHTML returns the correct HTML when no attributes are set
     *
     * @covers LorisForm::fileHTML
     * @return void
     */
    function testFileHTMLWithNoAttributes()
    {
        $this->form->addFile("abc", "Hello", []);
        $this->assertEquals(
            "<input name=\"abc\" type=\"file\" >",
            $this->form->fileHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that fileHTML returns the correct HTML when attributes are set
     *
     * @covers LorisForm::fileHTML
     * @return void
     */
    function testFileHTMLWithAttributesSet()
    {
        $testAttributes = ['class' => 'class1',
            'disabled' => 'yes'
        ];
        $this->form->addFile("abc", "Hello", $testAttributes);
        $this->form->setDefaults(['abc' => 'abc_default']);
        $this->assertEquals(
            "<input name=\"abc\" type=\"file\"".
                " class=\"class1\" value=\"abc_default\"disabled>",
            $this->form->fileHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that textareaHTML returns the correct HTML when no attributes are set
     *
     * @covers LorisForm::textareaHTML
     * @return void
     */
    function testTextAreaHTMLWithNoAttributes()
    {
        $this->form->addTextArea("abc", "Hello", []);
        $this->assertEquals(
            "<textarea name=\"abc\"   ></textarea>",
            $this->form->textareaHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that textareaHTML returns the correct HTML when attributes are set
     *
     * @covers LorisForm::textareaHTML
     * @return void
     */
    function testTextAreaHTMLWithAttributesSet()
    {
        $testAttributes = ['class' => 'class1',
            'disabled' => 'yes',
            'rows'     => '2',
            'cols'     => '5'
        ];
        $this->form->addTextArea("abc", "Hello", $testAttributes);
        $this->form->setDefaults(['abc' => 'abc_default']);
        $this->assertEquals(
            "<textarea name=\"abc\" class=\"class1\"".
                "  rows=\"2\" cols=\"5\" disabled>abc_default</textarea>",
            $this->form->textareaHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that checkboxHTML returns the correct HTML
     * when no attributes are specified
     *
     * @covers LorisForm::checkboxHTML
     * @return void
     */
    function testCheckboxHTMLWithNoAttributes()
    {
        $this->form->addCheckbox("abc", "Hello", []);
        $this->assertEquals(
            "<span style='white-space: nowrap;vertical-align: middle;'>" .
            "<input name='abc' type='checkbox'     " .
            "style='vertical-align: baseline; margin-top: 0'/> </span>Hello",
            $this->form->checkboxHTML($this->form->form['abc'])
        );

    }

    /**
     * Test that checkboxHTML returns the correctly formatted HTML when
     * attributes are specified
     *
     * @covers LorisForm::checkboxHTML
     * @return void
     */
    function testCheckboxHTMLWithAttributesSet()
    {
        $testAttributes = ['value' => 'value1',
            'disabled' => 'yes'
        ];
        $this->form->addCheckbox("abc", "Hello", $testAttributes);
        $this->form->setDefaults(['abc' => 'abc_default']);
        $this->assertEquals(
            "<span style='white-space: nowrap;vertical-align: middle;'>".
            "<input name='abc' type='checkbox' checked=\"checked\" value=\"value1\"".
            " disabled  style='vertical-align: baseline; margin-top: 0'/>".
            " </span>Hello",
            $this->form->checkboxHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that checkboxHTML calls the advCheckboxHTML function
     * if the element is an advcheckbox type element
     *
     * @covers LorisForm::checkboxHTML
     * @return void
     */
    function testCheckboxHTMLCallsAdvCheckboxHTML()
    {
        $testAttributes  = ['disabled' => 'yes'];
        $testCheckStates = ['on' => 'default_off',
            'off' => 'default_on'
        ];

        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['advCheckboxHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('advCheckboxHTML');

        '@phan-var \LorisForm $form';
        $form->addElement(
            'advcheckbox',
            "abc",
            "Hello",
            "text",
            $testAttributes,
            $testCheckStates
        );
        $form->setDefaults(['abc' => 'default_on']);
        $this->assertEquals(
            null,
            $form->checkboxHTML($form->form['abc'])
        );
    }

    /**
     * Test that radioHTML returns the correct HTML when no attributes specified
     *
     * @covers LorisForm::radioHTML
     * @return void
     */
    function testRadioHTMLWithNoAttributes()
    {
        $this->form->addRadio("abc", "Hello", [], []);
        $this->assertEquals(
            "<input name=\"abc\" type=\"radio\" checked=\"checked\"  /> Hello",
            $this->form->radioHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that radioHTML returns the correct HTML when attributes are specified
     *
     * @covers LorisForm::radioHTML
     * @return void
     */
    function testRadioHTMLWithAttributesSet()
    {
        $testAttributes = ['value' => 'abc_default',
            'disabled' => 'yes'
        ];
        $this->form->addRadio("abc", "Hello", [], $testAttributes);
        $this->form->setDefaults(['abc' => 'abc_default']);
        $this->assertEquals(
            "<input name=\"abc\" type=\"radio\" checked=\"checked\"".
                " value=\"abc_default\" disabled/> Hello",
            $this->form->radioHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that headerHTML returns the correct HTML
     *
     * @covers LorisForm::headerHTML
     * @return void
     */
    function testHeaderHTML()
    {
        $testAttributes = ['class' => 'class1',
            'align' => 'left'
        ];
        $this->form->addHeader("abc", "Hello", $testAttributes);
        $this->assertEquals(
            "<h2 class=\"class1\" align=\"left\">Hello</h2>",
            $this->form->headerHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that advCheckboxHTML returns the correct HTML
     *
     * @covers LorisForm::advCheckboxHTML
     * @return void
     */
    function testAdvCheckboxHTML()
    {
        $testAttributes  = ['disabled' => 'yes'];
        $testCheckStates = ['default_off', 'default_on'];
        $this->form->addElement(
            'advcheckbox',
            "abc",
            "Hello",
            "text",
            $testAttributes,
            $testCheckStates
        );
        $this->form->setDefaults(['abc' => 'default_on']);
        $this->assertEquals(
            "<input name=\"abc\" type=\"hidden\" value=\"default_off\"".
                "><input name=\"abc\" type=\"checkbox\" checked=\"checked\"".
                " value=\"default_on\" disabled/> text",
            $this->form->advCheckboxHTML($this->form->form['abc'])
        );
    }

    /**
     * Test that createText creates an element of type text
     *
     * @covers LorisForm::createText
     * @return void
     */
    function testCreateText()
    {
        $testText = $this->form->createText("abc", "Hello", []);
        $this->assertEquals("text", $testText['type']);
        $this->assertEquals("Hello", $testText['label']);
    }

    /**
     * Test that createSubmit creates an element of type submit
     * with a null label and the proper value
     *
     * @covers LorisForm::createSubmit
     * @return void
     */
    function testCreateSubmit()
    {
        $testSubmit = $this->form->createSubmit("abc", "value1", []);
        $this->assertEquals("submit", $testSubmit['type']);
        $this->assertEquals(null, $testSubmit['label']);
        $this->assertEquals("value1", $testSubmit['value']);
    }

    /**
     * Test that createTextArea creates an element of type textarea
     *
     * @covers LorisForm::createTextArea
     * @return void
     */
    function testCreateTextArea()
    {
        $testText = $this->form->createTextArea("abc", "Hello");
        $this->assertEquals("textarea", $testText['type']);
        $this->assertEquals("Hello", $testText['label']);
    }

    /**
     * Test that createSelect creates an element of type 'select'
     * and that the options attribute is properly set
     *
     * @covers LorisForm::createSelect
     * @return void
     */
    function testCreateSelect()
    {
        $testSelect = $this->form->createSelect("abc", "Hello", [], []);
        $this->assertEquals("select", $testSelect['type']);
        $this->assertEquals("Hello", $testSelect['label']);
        $this->assertTrue(isset($testSelect['options']));
        $this->assertTrue(!isset($testSelect['multiple']));
    }

    /**
     * Test that createSelect creates an element of type 'select
     * and that the 'multiple' attribute is set if specified
     *
     * @covers LorisForm::createSelect
     * @return void
     */
    function testCreateMultiSelect()
    {
        $testSelect = $this->form->createSelect(
            "abc",
            "Hello",
            [],
            ['multiple' => 'multiple']
        );
        $this->assertEquals("select", $testSelect['type']);
        $this->assertEquals("Hello", $testSelect['label']);
        $this->assertTrue(isset($testSelect['options']));
        $this->assertTrue(isset($testSelect['multiple']));
    }

    /**
     * Test that isSubmitted returns true/false if the $_POST array
     * is set or not set
     *
     * @covers LorisForm::isSubmitted
     * @return void
     */
    function testIsSubmittedWithPostArraySet()
    {
        $_POST = "test";
        $this->assertTrue($this->form->isSubmitted());
        unset($_POST);
        $this->assertFalse($this->form->isSubmitted());
    }

    /**
     * Test that isSubmitted returns true/false if the $_FILES array
     * is set or not set
     *
     * @covers LorisForm::isSubmitted
     * @return void
     */
    function testIsSubmittedWithFilesArraySet()
    {
        $_FILES = "test";
        $this->assertTrue($this->form->isSubmitted());
        unset($_FILES);
        $this->assertFalse($this->form->isSubmitted());
    }

    /**
     * Test that toArray returns the correctly formatted array
     * for the element in the form
     *
     * @covers LorisForm::toArray
     * @return void
     */
    function testToArray()
    {
        $testAttributes = ['value' => 'radio_default',
            'disabled' => 'yes'
        ];
        $this->form->addRadio("radio_el", "Hello", [], $testAttributes);

        $testAttributes = ['class' => 'class1',
            'disabled' => 'yes',
            'rows'     => '2',
            'cols'     => '5'
        ];

        //The two expected HTMLs based on the attributes given:
        $radioHTML    = '<input name="radio_el" type="radio" checked="checked"'.
                         ' value="radio_default" disabled/> Hello';
        $textareaHTML = '<textarea name="textarea_el" class="class1"  rows="2"'.
                            ' cols="5" disabled>textarea_default</textarea>';

        $this->form->addTextArea("textarea_el", "Hello", $testAttributes);
        $this->form->setDefaults(
            ['radio_el' => 'radio_default',
                'textarea_el' => 'textarea_default'
            ]
        );

        $result = ['radio_el' => ['value' => 'radio_default',
            'type'     => 'radio',
            'disabled' => true,
            'label'    => 'Hello',
            'options'  => [],
            'html'     => $radioHTML,
            'name'     => 'radio_el'
        ],
            'textarea_el' => ['class' => 'class1',
                'disabled' => true,
                'rows'     => '2',
                'cols'     => '5',
                'type'     => 'textarea',
                'label'    => 'Hello',
                'html'     => $textareaHTML,
                'name'     => 'textarea_el'
            ],
            'errors'      => []
        ];
        $this->assertEquals(
            $result,
            $this->form->toArray()
        );
    }

    /**
     * Test that toElementArray returns the correctly formatted
     * array for the element in the form
     *
     * @covers LorisForm::toElementArray
     * @return void
     */
    function testToElementArray()
    {
        $testAttributes = ['value' => 'radio_default',
            'disabled' => 'yes'
        ];
        $this->form->addRadio("radio_el", "Hello", [], $testAttributes);

        $testAttributes = ['class' => 'class1',
            'disabled' => 'yes',
            'rows'     => '2',
            'cols'     => '5'
        ];
        //The expected HTMLs for the two elements
        $radioHTML    = '<input name="radio_el" type="radio" checked="checked"'.
                         ' value="radio_default" disabled/> Hello';
        $textareaHTML = '<textarea name="textarea_el" class="class1"  rows="2"'.
                            ' cols="5" disabled>textarea_default</textarea>';
        $this->form->addTextArea("textarea_el", "Hello", $testAttributes);
        $this->form->setDefaults(
            ['radio_el' => 'radio_default',
                'textarea_el' => 'textarea_default'
            ]
        );

        $result = ['elements' => [
            ['value' => 'radio_default',
                'type'     => 'radio',
                'disabled' => true,
                'label'    => 'Hello',
                'options'  => [],
                'html'     => $radioHTML,
                'name'     => 'radio_el'
            ],
            ['class' => 'class1',
                'disabled' => true,
                'rows'     => '2',
                'cols'     => '5',
                'type'     => 'textarea',
                'label'    => 'Hello',
                'html'     => $textareaHTML,
                'name'     => 'textarea_el'
            ]
        ],
            'type'     => 'page',
            'errors'   => [],
            'enctype'  => ''
        ];
        $this->assertEquals(
            $result,
            $this->form->toElementArray()
        );
    }

    /**
     * Test that addRule throws a LorisException if the rule type
     * is not one of the allowed rules
     *
     * @covers LorisForm::addRule
     * @return void
     */
    function testAddRuleIfIncorrectType()
    {
        $this->expectException('\LorisException');
        $this->form->addText("abc", "Hello", []);
        $this->form->addRule($this->form->form['abc'], "message", "not_a_type");
    }

    /**
     * Test that when a 'compare' rule is added, it adds the 'compare' attribute to
     * both elements with the other element's name as its value
     *
     * @covers LorisForm::addRule
     * @return void
     */
    function testAddRuleIfCompareType()
    {
        $this->form->addText("abc", "Hello", []);
        $this->form->addText("xyz", "Bye", []);
        $this->form->addRule(["abc", "xyz"], "Compare them!", "compare");

        $this->assertAttribute('abc', 'compare', 'xyz');
        $this->assertAttribute('xyz', 'compare', 'abc');
    }

    /**
     * Test that when a 'requiredIf' rule is added, it adds the
     * correct rule information to the formRules array of the form object
     *
     * @covers LorisForm::addRule
     * @return void
     */
    function testAddRuleIfRequiredIfType()
    {
        $this->form->addText("abc", "Hello", []);
        $this->form->addText("xyz", "Bye", []);
        $this->form->addRule(
            ["abc", "xyz"],
            "Required if!",
            "requiredIf",
            "format"
        );

        $this->assertEquals(
            ["elements" => ["abc", "xyz"],
                "format"   => "format",
                "message"  => "Required if!"
            ],
            $this->form->formRules[0]['requiredIf']
        );
    }

    /**
     * Test that addRule throws a LorisException if the element
     * is not set in the form
     *
     * @covers LorisForm::addRule
     * @return void
     */
    function testAddRuleIfElementNotSet()
    {
        $this->expectException('\LorisException');
        $this->form->addRule("abc", "Message", "required");
    }

    /**
     * Test that when a 'required' rule is added, the correct information is added
     * to the 'required' and 'requiredMsg' attributes of the element
     *
     * @covers LorisForm::addRule
     * @return void
     */
    function testAddRuleForRequiredType()
    {
        $this->form->addText("abc", "Hello", []);
        $this->form->addRule("abc", "Required!", "required");
        $this->assertAttribute("abc", "required", true);
        $this->assertAttribute("abc", "requireMsg", "Required!");
    }

    /**
     * Test that when a 'numeric' rule is added, the correct information is added
     * to the 'numeric' and 'numericMsg' attributes of the element
     *
     * @covers LorisForm::addRule
     * @return void
     */
    function testAddRuleForNumericType()
    {
        $this->form->addText("abc", "Hello", []);
        $this->form->addRule("abc", "Numeric!", "numeric");
        $this->assertAttribute("abc", "numeric", true);
        $this->assertAttribute("abc", "numericMsg", "Numeric!");
    }

    /**
     * Test that when a 'regex' rule is added, the correct information is added
     * to the 'regex' attribute of the element
     *
     * @covers LorisForm::addRule
     * @return void
     */
    function testAddRuleForRegexType()
    {
        $this->form->addText("abc", "Hello", []);
        $this->form->addRule("abc", "Regex!", "regex", "match_regex");
        $this->assertEquals(
            ['regexMsg' => 'Regex!',
                'match'    => 'match_regex'
            ],
            $this->form->form['abc']['regex'][0]
        );
    }

    /**
     * Test that when a 'email' rule is added, the correct information is added
     * to the 'email' and 'emailMsg' attributes of the element
     *
     * @covers LorisForm::addRule
     * @return void
     */
    function testAddRuleForEmailType()
    {
        $this->form->addText("abc", "Hello", []);
        $this->form->addRule("abc", "Email!", "email");
        $this->assertAttribute("abc", "email", true);
        $this->assertAttribute("abc", "emailMsg", "Email!");
    }

    /**
     * Test that when a 'maxlength' rule is added, the correct information is added
     * to the 'maxlength' attribute of the element
     *
     * @covers LorisForm::addRule
     * @return void
     */
    function testAddRuleForMaxLengthType()
    {
        $this->form->addText("abc", "Hello", []);
        $this->form->addText("abc", "Hello", []);
        $this->form->addRule("abc", "Max Length!", "maxlength", 20);
        $this->assertEquals(
            ['message' => "Max Length!",
                'maxlength' => 20
            ],
            $this->form->form['abc']['maxlength']
        );
    }

    /**
     * Test that addFormRule adds the given function to the formRules array
     *
     * @covers LorisForm::addFormRule
     * @return void
     */
    function testAddFormRule()
    {
        $callback = [$this->form, 'validate'];
        $this->form->addFormRule($callback);
        $this->assertEquals(
            $callback,
            $this->form->formRules[0]
        );
    }

    /**
     * Test that getElement returns a new LorisFormElement() when
     * the type of the element is not 'file'
     *
     * @covers LorisForm::getElement
     * @return void
     */
    function testGetElement()
    {
        $this->form->addSelect("abc", "Hello", [], []);
        $this->assertEquals(
            new LorisFormElement(),
            $this->form->getElement("abc")
        );
    }

    /**
     * Test that setElementError correctly sets the 'error' attribute of the element
     * and adds to the errors array of the form
     *
     * @covers LorisForm::setElementError
     * @return void
     */
    function testSetElementError()
    {
        $this->form->addText("abc", "Hello", []);
        $this->form->setElementError("abc", "abc has an error!");
        $this->assertAttribute("abc", "error", "abc has an error!");
        $this->assertEquals("abc has an error!", $this->form->errors['abc']);
    }

    /**
     * Test that getElementError returns the correct error message i
     * for the given element
     *
     * @covers LorisForm::getElementError
     * @return void
     */
    function testGetElementError()
    {
        $this->form->addText("abc", "Hello", []);
        $this->form->setElementError("abc", "abc has an error!");
        $this->assertEquals(
            "abc has an error!",
            $this->form->getElementError("abc")
        );
    }

    /**
     * Test that getElementError returns null if the element
     * does not have an error message
     *
     * @covers LorisForm::getElementError
     * @return void
     */
    function testGetElementErrorReturnsNull()
    {
        $this->form->addText("abc", "Hello", []);
        $this->assertEquals(null, $this->form->getElementError("abc"));
    }

    /**
     * Test that updateAttributes properly updates the 'action'
     * and 'encrypt' attributes of the form
     *
     * @covers LorisForm::updateAttributes
     * @return void
     */
    function testUpdateAttributes()
    {
        $testAttributes = ['action' => 'new_action',
            'encrypt' => 'new_encrypt'
        ];
        $this->form->updateAttributes($testAttributes);
        $this->assertEquals("action='new_action'", $this->form->action);
        $this->assertEquals("encrypt='new_encrypt'", $this->form->encrypt);
    }

    /**
     * Test that updateAttributes throws a LorisException
     * if the attribute is not of type 'action' or 'encrypt'
     *
     * @covers LorisForm::updateAttributes
     * @return void
     */
    function testUpdateAttributesThrowsException()
    {
        $this->expectException('\LorisException');
        $testAttributes = ['invalid_attrib' => 'value'];
        $this->form->updateAttributes($testAttributes);
    }

    /**
     * Test that applyFilter correctly edits the filters array when the 'trim'
     * filter is added to an element
     *
     * @covers LorisForm::applyFilter
     * @return void
     */
    function testApplyFilterTrimAlreadySet()
    {
        $this->form->addSelect("abc", "Hello", [], []);
        $this->form->applyFilter("abc", "trim");
        $this->assertEquals('trim', $this->form->filters['abc'][0]);
    }

    /**
     * Test that freeze sets the boolean frozen to true
     *
     * @covers LorisForm::freeze
     * @return void
     */
    function testFreeze()
    {
        $this->form->freeze();
        $this->assertTrue($this->form->frozen);
    }

    /**
     * Test that isFrozen returns the correct boolean value
     *
     * @covers LorisForm::isFrozen
     * @return void
     */
    function testIsFrozen()
    {
        $this->assertEquals($this->form->frozen, $this->form->isFrozen());
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'date'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementDate()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['dateHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('dateHTML');

        '@phan-var \LorisForm $form';
        $form->addElement("date", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'select'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementSelect()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['selectHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('selectHTML');

        '@phan-var \LorisForm $form';
        $form->addElement("select", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'static'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementStatic()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['staticHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('staticHTML');

        '@phan-var \LorisForm $form';
        $form->addElement("static", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'textarea'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementTextArea()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['textareaHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('textareaHTML');

        '@phan-var \LorisForm $form';
        $form->addElement("textarea", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'file'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementFile()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['fileHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('fileHTML');

        '@phan-var \LorisForm $form';
        $form->addElement("file", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'password'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementPassword()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['textHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('textHTML');

        '@phan-var \LorisForm $form';
        $form->addElement("password", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'text'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementText()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['textHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('textHTML');

        '@phan-var \LorisForm $form';
        $form->addElement("text", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'advcheckbox'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementCheckbox()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['checkboxHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('checkboxHTML');

        '@phan-var \LorisForm $form';
        $form->addElement("advcheckbox", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'radio'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementRadio()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['radioHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('radioHTML');

        '@phan-var \LorisForm $form';
        $form->addElement("radio", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'group'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementGroup()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['groupHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('groupHTML');

        '@phan-var \LorisForm $form';
        $testText = $form->createText("text1", "textlabel", []);
        $form->addGroup([$testText], "abc", "Hello", ", ", []);
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'header'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementHeader()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['headerHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('headerHTML');

        '@phan-var \LorisForm $form';

        $form->addElement("header", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'submit'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementSubmit()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['submitHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('submitHTML');
        '@phan-var \LorisForm $form';

        $testSubmit = $form->createSubmit("abc", "Hello", []);
        $form->renderElement($testSubmit);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'hidden'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementHidden()
    {
        $form = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['hiddenHTML'])
            ->getMock();
        $form->expects($this->once())
            ->method('hiddenHTML');
        '@phan-var \LorisForm $form';

        $form->addElement("hidden", "abc", "Hello");
        $form->renderElement($form->form['abc']);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'time'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementTime()
    {
        $f = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['timeHTML'])
            ->getMock();
        $f->expects($this->once())
            ->method('timeHTML');
        '@phan-var \LorisForm $f';

        $testTime = $f->createElement(
            "time",
            "abc",
            "Hello",
            [],
            []
        );

        $f->renderElement($testTime);
    }

    /**
     * Test that renderElement renders the correct HTML
     * when the element is of type 'link'
     *
     * @covers LorisForm::renderElement
     * @return void
     */
    function testRenderElementLink()
    {
        $f = $this->getMockBuilder('LorisForm')
            ->onlyMethods(['linkHTML'])
            ->getMock();
        $f->expects($this->once())
            ->method('linkHTML');

        '@phan-var \LorisForm $f';

        $f->addElement("link", "abc", "Hello");
        $f->renderElement($f->form['abc']);
    }

    /**
     * Test that addGroupRule adds the proper information
     * to the group element attributes
     * and to the group error attributes
     *
     * @covers LorisForm::addGroupRule
     * @return void
     */
    function testAddGroupRule()
    {
        $testOptions = ['prefix_wrapper' => 'abc_prefix',
            'postfix_wrapper' => 'abc_postfix'
        ];
        $textEl      = $this->form->createText("abc_text", "Hello_text", []);
        $textareaEl  = $this->form->createTextArea("abc_textarea", "Hello_textarea");
        $this->form->addGroup(
            [$textEl, $textareaEl],
            "abc_group",
            "Hello",
            ", ",
            $testOptions
        );
        $testRules = [
            [
                ["Message for text!", 'required']
            ],
            [
                ["Message for textarea!", 'numeric']
            ]
        ];
        $this->form->addGroupRule("abc_group", $testRules);

        $this->assertEquals(
            "Message for text!",
            $this->form->form['abc_group']['elements'][0]['requireMsg']
        );
        $this->assertTrue($this->form->form['abc_group']['elements'][0]['required']);
        $this->assertEquals(
            "Message for textarea!",
            $this->form->form['abc_group']['elements'][1]['numericMsg']
        );
        $this->assertTrue($this->form->form['abc_group']['elements'][1]['numeric']);
    }

    /**
     * Test that addGroupRule adds the correct information
     * to the group and group element if only one element has rules
     *
     * @covers LorisForm::addGroupRule
     * @return void
     */
    function testAddGroupRuleWithOneElement()
    {
        $testOptions = ['prefix_wrapper' => 'abc_prefix',
            'postfix_wrapper' => 'abc_postfix'
        ];
        $textEl      = $this->form->createText("abc_text", "Hello_text", []);
        $textareaEl  = $this->form->createTextArea("abc_textarea", "Hello_textarea");
        $this->form->addGroup(
            [$textEl, $textareaEl],
            "abc_group",
            "Hello",
            ", ",
            $testOptions
        );

        $testRules = [1 => [["Message for textarea!", "numeric"]]];
        $this->form->addGroupRule("abc_group", $testRules);

        $this->assertEquals(
            "Message for textarea!",
            $this->form->form['abc_group']['elements'][1]['numericMsg']
        );
        $this->assertTrue(
            $this->form->form['abc_group']['elements'][1]['numeric']
        );
    }

    /**
     * Test that addGroupRule throws a LorisException if
     * the rule is not of type "required" or "numeric"
     *
     * @covers LorisForm::addGroupRule
     * @return void
     */
    function testAddGroupRuleInvalidType()
    {
        $this->expectException('\LorisException');
        $textEl     = $this->form->createText("abc_text", "Hello_text", []);
        $textareaEl = $this->form->createTextArea("abc_textarea", "Hello_textarea");
        $this->form->addGroup(
            [$textEl, $textareaEl],
            "abc_group",
            "Hello",
            ", ",
            []
        );
        $testRules = [
            [
                ["Message for text!", 'invalid_type']
            ],
            [
                ["Message for textarea!", 'invalid_type']
            ]
        ];
        $this->form->addGroupRule("abc_group", $testRules);
    }

    /**
     * Test that addGroupRule throws an InvalidArgumentException
     * if the paramter is not an array
     *
     * @covers LorisForm::addGroupRule
     * @return void
     */
    function testAddGroupRuleInvalidArgument()
    {
        $this->expectException('\InvalidArgumentException');
        $textEl     = $this->form->createText("abc_text", "Hello_text", []);
        $textareaEl = $this->form->createTextArea("abc_textarea", "Hello_textarea");
        $this->form->addGroup(
            [$textEl, $textareaEl],
            "abc_group",
            "Hello",
            ", ",
            []
        );

        $this->form->addGroupRule("abc_group", "Message!", "numeric");
    }
}

