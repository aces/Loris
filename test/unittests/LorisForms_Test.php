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
namespace PHPUNIT
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
    function assertType($el, $type): void
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
    function assertLabel($el, $label): void
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
     * Test that the addSelect wrapper adds an element of the appropriate
     * type to the page
     *
     * @return void
     */
    function testAddSelect(): void
    {
        $this->form->addSelect("abc", "Hello", array());

        $this->assertTrue(isset($this->form->form['abc']));
        $this->assertType("abc", "select");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addSelect wrapper adds an element of the appropriate
     * type to the page
     *
     * @return void
     */
    function testAddMultiSelect(): void
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
     * Test that the addText wrapper adds an element of the appropriate
     * type to the page
     *
     * @return void
     */
    function testAddText(): void
    {
        $this->form->addText("abc", "Hello", array());
        $this->assertType("abc", "text");
        $this->assertLabel("abc", "Hello");
    }

    /**
     * Test that the addDate wrapper adds an element of the appropriate
     * type to the page
     *
     * @return void
     */
    function testAddDate(): void
    {
        $this->form->addDate("abc", "Hello", array());
        $this->assertType("abc", "date");
        $this->assertLabel("abc", "Hello");
    }


    /**
     * Test that the addDate wrapper adds an element of the appropriate
     * type to the page
     *
     * @return void
     */
    function testAddFile(): void
    {
        $this->form->addFile("abc", "Hello", array());
        $this->assertType("abc", "file");
        $this->assertLabel("abc", "Hello");
    }


    /**
     * Test that the addDate wrapper adds an element of the appropriate
     * type to the page
     *
     * @return void
     */
    function testAddPassword(): void
    {
        $this->form->addPassword("abc", "Hello", array());
        $this->assertType("abc", "password");
        $this->assertLabel("abc", "Hello");
    }


    /**
     * Test that the addElement wrapper with type "select" adds an element of
     * the appropriate type to the page
     *
     * @return void
     */
    function testAddElementSelect(): void
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
     * @return void
     */
    function testAddElementDate(): void
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
     * @return void
     */
    function testAddElementText(): void
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
     * @return void
     */
    function testAddElementFile(): void
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
     * @return void
     */
    function testAddElementPassword(): void
    {
        $this->form = $this->getMockBuilder('LorisForm')
            ->setMethods(array('addPassword'))
            ->getMock();
        $this->form->expects($this->once())
            ->method('addPassword');
        $this->form->addElement("password", "abc", "Hello");
    }


}
?>
