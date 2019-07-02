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
use PHPUnit\Framework\TestCase;
class LorisForms_Test extends TestCase
{
    /**
     * Creates a new LorisForm to use for testing
     *
     * @return void
     */
    function setUp()
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
     * @param string $el    The element name
     * @param string $label The expected type of this element
     *                      (ie select, checkbox, etc)
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
     * @param string $el           The element name
     * @param string $attribute    The attribute name to assert
                                   (ie class, id, value, etc)
     * @param string $attribValue  The expected content of the attribute
     *
     * @return void but makes assertions
     */
    function assertAttribute($el, $attribute, $attribValue)
    {
        if (!isset($this->form->form[$el])) {
            $this->fail("Element $el does not exist");
            return;
        }
        $this->assertEquals(
            $this->form->form[$el][$attribute],
            $attribValue,
            "Element $el's $attribute did not match $attribValue"
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
        $this->form->addSelect("abc", "Hello", array());

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
        $this->form->addSelect("abc", "Hello", array('3' => 'Option 3'), array('multiple' => 'multiple'));

        $this->assertTrue(isset($this->form->form['abc']));
        $this->assertType("abc", "select");
        $this->assertLabel("abc", "Hello");

        $rendered = $this->form->renderElement($this->form->form['abc']);

        $html = new DOMDocument();
        // Add the HTML/body tags, because loadHTML will implicitly add them anyways
        // and this makes it a little clearer how the DOM will be parsed.
        $html->loadHTML("<html><body>$rendered</body></html>");

        // documentElement is the <html> element, first child of that is the <body>, and
        // first child of that is the rendered element
        $element = $html->documentElement->firstChild->firstChild;

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
        $this->form->addText("abc", "Hello", array());
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
        $this->form->addDate("abc", "Hello", array(), array());
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
        $this->form->addFile("abc", "Hello", array());
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
        $this->form->addPassword("abc", "Hello", array());
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
        $this->form->addHidden("abc", "value1", array());
        $this->assertType("abc", "hidden");
        //The addHidden method sets the label to null in every case
        $this->assertLabel("abc", null);
        //The second parameter taken by the addHidden method sets the "value" attribute of the element
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
        $this->form->addTextArea("abc", "Hello", array());
        $this->assertType("abc", "textarea");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addTextArea wrapper adds an element of the appropriate
     * type to the page and that the rows and cols attributes are set correctly if specified
     * @note This test is added because the addTextArea wrapper sets the rows and cols
     *       attributes itself and not using the createBase method
     * 
     * @covers LorisForm::addTextArea
     * @return void
     */
    function testAddTextAreaWithRowsOrCols()
    {
        $rowAttrib = array('rows' => 'row1');
        $colAttrib = array('cols' => 'col1');

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
        $this->form->addCheckbox("abc", "Hello", array());
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
        $this->form->addHeader("abc", "Hello", array());
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
        $this->form->addRadio("abc", "Hello", array(), array());
        $this->assertType("abc", "radio");
        $this->assertLabel("abc", "Hello");
        $this->assertTrue(isset($this->form->form['abc']['options']));
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
        $this->form = $this->getMockBuilder('LorisForm')
            ->setMethods(array('addSelect', 'addDate'))
            ->getMock();
        $this->form->expects($this->once())
            ->method('addSelect');
        $this->form->addElement("select", "abc", "Hello");
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
        $this->form = $this->getMockBuilder('LorisForm')
            ->setMethods(array('addDate'))
            ->getMock();
        $this->form->expects($this->once())
            ->method('addDate');
        $this->form->addElement("date", "abc", "Hello");
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
        $this->form = $this->getMockBuilder('LorisForm')
            ->setMethods(array('addText'))
            ->getMock();
        $this->form->expects($this->once())
            ->method('addText');
        $this->form->addElement("text", "abc", "Hello");
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
        $this->form = $this->getMockBuilder('LorisForm')
            ->setMethods(array('addFile'))
            ->getMock();
        $this->form->expects($this->once())
            ->method('addFile');
        $this->form->addElement("file", "abc", "Hello");
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
        $this->form = $this->getMockBuilder('LorisForm')
            ->setMethods(array('addPassword'))
            ->getMock();
        $this->form->expects($this->once())
            ->method('addPassword');
        $this->form->addElement("password", "abc", "Hello");
    }

    /**
     * Test that getValue returns the correct default value for the form element
     * TODO This should ideally not return null
     *
     * @covers LorisForm::getValue
     * @return void
     */
    function testGetValue()
    {
        $this->form->addSelect("abc", "Hello", array());
        $this->assertEquals(null, $this->form->getValue("abc"));
    }

    /**
     * Test that staticHTML returns the correctly formatted HTML
     * TODO This returns null as of now because it uses the getValue method
     *      Should return an actual value
     *     
     * @covers LorisForm::staticHTML
     * @return void
     */
    function testStaticHTML()
    {
	$this->form->addStatic("abc", "Hello");
	$this->assertEquals(null, $this->form->staticHTML($this->form->form["abc"]));
    }

    /**
     * Test that dateHTML returns the correctly formatted HTML when no attributes or options are specified
     *
     * @covers LorisForm::dateHTML
     * @return void
     */
    function testDateHTMLWithNoOptions()
    {
        $this->form->addDate("abc", "Hello", array());
        $this->assertEquals(
            "<input name=\"abc\" type=\"date\"    onChange=\"this.setCustomValidity('')\" >", 
            $this->form->dateHTML($this->form->form["abc"])
        );
    } 

    /**
     * Test that dateHTML returns the correctly formatted HTML with the given attributes and options
     * This returns the HTML when 'format' is set to either 'my' or 'ym' in the options array
     *
     * @covers LorisForm::dateHTML
     * @return void
     */
    function testDateHTMLWithFormatNotSetToY()
    {
        $testAttributes = array('class' => 'class1',
                             'disabled' => 'yes',
                             'requireMsg' => 'requireMsg1',
                             'required' => 'required1');
        $testOptions = array('minYear' => '2010',
                             'maxYear' => '2019',
                             'format' => 'ym');
        
        $this->form->addDate("abc", "Hello", $testOptions, $testAttributes);
        $this->assertEquals(
            "<input name=\"abc\" type=\"month\" class=\"class1\" min=\"2010-01\" max=\"2019-12\" onChange=\"this.setCustomValidity('')\" disabled >", 
            $this->form->dateHTML($this->form->form["abc"])
        );
    }

    /**
     * Test that dateHTML calls the yearHTML function when 'format' is set to 'y' in the options array
     *
     * @covers LorisForm::dateHTML
     * @return void
     */
    function testDateHTMLWithFormatSetToY()
    {
        $testAttributes = array('class' => 'class1',
                             'disabled' => 'yes',
                             'requireMsg' => 'requireMsg1',
                             'required' => 'required1');
        $testOptions = array('minYear' => '2010',
                             'maxYear' => '2019',
                             'format' => 'y');

        $this->form = $this->getMockBuilder('LorisForm')
            ->setMethods(array('yearHTML'))
            ->getMock();
        $this->form->expects($this->once())
            ->method('yearHTML');
        $this->form->addDate("abc", "Hello", $testOptions, $testAttributes);
        $this->form->dateHTML($this->form->form["abc"]);
    }

    /**
     * Test that createText creates an element of type text
     *
     * @covers LorisForm::createText
     * @return void
     */
    function testCreateText()
    {
        $testText = $this->form->createText("abc", "Hello", array());
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
        $testSubmit = $this->form->createSubmit("abc", "value1", array());
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

}
?>
