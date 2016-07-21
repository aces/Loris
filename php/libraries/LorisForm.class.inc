<?php
/**
 * This class represents an attempt to re-implement the API for
 * HTML_QuickForm (Version 1) in Loris since QuickForm1 isn't
 * maintained anymore, and QuickForm2 is a completely different API.
 *
 * It only reimplements the minimal set required for Loris to work,
 * and doesn't do it in a particularly elegant way, but prevents
 * PHP warnings that QuickForm1 generates since QuickForm1 was written
 * for PHP4.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Reimplementation of QuickForm API from scratch
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class LorisForm
{

    var $form          = array();
    var $defaultValues = array();
    var $formRules     = array();
    var $errors        = array();
    var $filters       = array();
    var $frozen        = false;

    /**
     * Creates and returns an element that can be added
     * to the $this->form array. This handles any options
     * that are shared between every type of element,
     * things specific to one type of element X should go in
     * the createX function.
     *
     * @param string $name    The form name of the element being added
     * @param string $label   The label to attach to the GUI in the form
     * @param array  $attribs An array of extra HTML attributes to be
     *                        added to this element.
     *
     * @return array describing the form element
     */
    protected function &createBase($name, $label, $attribs=array())
    {
        $el = array(
               'label' => $label,
               'name'  => $name,
              );
        if (isset($attribs['class'])) {
            $el['class'] = $attribs['class'];
        }
        if (isset($attribs['id'])) {
            $el['id'] = $attribs['id'];
        }
        if (isset($attribs['onchange'])) {
            $el['onchange'] = $attribs['onchange'];
        }
        if (isset($attribs['value'])) {
            $el['value'] = $attribs['value'];
        }
        if (isset($attribs['oninvalid'])) {
            $el['oninvalid'] = $attribs['oninvalid'];
        }
        if (isset($attribs['pattern'])) {
            $el['pattern'] = $attribs['pattern'];
        }
        if (isset($attribs['disabled'])) {
            $el['disabled'] = true;
        }
        if (isset($attribs['required']) && $attribs['required'] === true) {
            $el['required'] = true;
        }
        if (isset($attribs['align'])) {
            $el['align'] = $attribs['align'];
        }

        return $el;
    }
    /**
     * Adds an element to the $this->form array. Handles the creation
     * of any shared attributes that are shared between different
     * element types.
     *
     * @param string $name    The element name.
     * @param string $label   The label to attach to this element.
     * @param array  $attribs An array of other attributes that should
     *                        get added. Currently only the "class"
     *                        attribute gets added.
     *
     * @return &array A reference to the array that was added to $this->form
     */
    protected function &addBase($name, $label, $attribs = array())
    {
        $el = $this->createBase($name, $label, $attribs);
        $this->form[$name] =& $el;
        return $el;
    }

    /**
     * Reimplementation of HTML_QuickForm's "addSelect" API.
     *
     * @param string $name    The element name.
     * @param string $label   The label to attach to this element.
     * @param array  $options An array of the options (values) to add
     *                        to this select dropdown.
     * @param array  $attribs An array of other attributes that should
     *                        get added. Currently only the "class"
     *                        attribute gets added.
     *
     * @return &array
     */
    public function addSelect($name, $label, $options, $attribs = array())
    {
        $el            =& $this->addBase($name, $label, $attribs);
        $el['type']    = 'select';
        $el['options'] = $options;
        if (isset($attribs['multiple'])) {
            $el['multiple'] = $attribs['multiple'];
        }
        return $el;
    }

    /**
     * Creates a static element to be rendered on the page
     *
     * Reimplementation of HTML_QuickForm's "addStatic" API.
     *
     * @param string $name  The element name.
     * @param string $label The label to attach to this element.
     *
     * @return &array
     */
    public function addStatic($name, $label)
    {
        $el         =& $this->addBase($name, $label, array());
        $el['type'] = 'static';
        return $el;
    }

    /**
     * Reimplementation of HTML_QuickForm's "addPassword" API.
     *
     * @param string $name    The element name.
     * @param string $label   The label to attach to this element.
     * @param array  $options An array of other attributes that should
     *                        get added. Currently only the "class"
     *                        attribute gets added.
     *
     * @return &array
     */
    public function addPassword($name, $label, $options=array())
    {
        $el         =& $this->addBase($name, $label, $options);
        $el['type'] = 'password';
        return $el;
    }

    /**
     * Reimplementation of HTML_QuickForm's "addHidden" API.
     *
     * @param string $name  The element name.
     * @param string $value The element value.
     *
     * @return &array
     */
    public function addHidden($name, $value)
    {
        $el         =& $this->addBase($name, null, array('value' => $value));
        $el['type'] = 'hidden';
        return $el;
    }

    /**
     * Reimplementation of HTML_QuickForm's "addText" API.
     *
     * @param string $name    The element name.
     * @param string $label   The label to attach to this element.
     * @param array  $options An array of other attributes that should
     *                        get added. Currently only the "class"
     *                        attribute gets added.
     *
     * @return &array
     */
    public function addText($name, $label, $options=array())
    {
        $el         =& $this->addBase($name, $label, $options);
        $el['type'] = 'text';
        return $el;
    }

    /**
     * Reimplementation of HTML_QuickForm's "addTextArea" API.
     *
     * @param string $elname  The element name.
     * @param string $label   The label to attach to this element.
     * @param array  $options An array of other attributes that should
     *                        get added. Currently only the "class",
     *                        "rows", and "cols" attributes will get
     *                        added.
     *
     * @return &array
     */
    public function addTextArea($elname, $label, $options=array())
    {
        $el         =& $this->addBase($elname, $label, $options);
        $el['type'] = 'textarea';
        if (isset($options['cols'])) {
            $el['cols'] = $options['cols'];
        }
        if (isset($options['rows'])) {
            $el['rows'] = $options['rows'];
        }
        return $el;
    }
    /**
     * Reimplementation of HTML_QuickForm's "addDate" API. The behaviour
     * of this varies slightly from QuickForm in that this will use an
     * HTML5 input type="date" element, while QuickForm added three dropdowns
     * for year/month/day.
     *
     * @param string $name    The element name.
     * @param string $label   The label to attach to this element.
     * @param array  $options An array of options that should get added,
     *                        such as the date format, min or max date etc.
     * @param array  $attribs An array of other attributes that should
     *                        get added. Currently only the "class"
     *                        attribute gets added.
     *
     * @return &array
     */
    public function addDate($name, $label, $options, $attribs = array())
    {
        $el            =& $this->addBase($name, $label, $attribs);
        $el['type']    = 'date';
        $el['options'] = $options;
        return $el;
    }

    /**
     * Adds a file to the current form.
     *
     * @param string $name    The element name.
     * @param string $label   The label to attach to this element.
     * @param array  $options An array of other attributes that should
     *                        get added. Currently only the "class"
     *                        attribute gets added.
     *
     * @return &array
     */
    function addFile($name, $label, $options)
    {
        $el         =& $this->addBase($name, $label, $options);
        $el['type'] = 'file';
        return $el;
    }

    /**
     * Adds a checkobox to the current form.
     *
     * @param string $name    The element name.
     * @param string $label   The label to attach to this element.
     * @param array  $options An array of other attributes that should
     *                        get added. Currently only the "value"
     *                        attribute gets added.
     *
     * @return &array
     */
    function addCheckbox($name, $label, $options)
    {
        $el         =& $this->addBase($name, $label, $options);
        $el['type'] = 'advcheckbox';
        return $el;
    }

    /**
     * Adds a header element to this LorisForm.
     *
     * @param string $name    The name of the header element, may be null
     * @param string $label   The description for the header
     * @param array  $options Other options for this header element
     *
     * @return &array
     */
    function addHeader($name, $label, $options = array())
    {
        $name = $this->_generateName($name);

        $el         =& $this->addBase($name, $label, $options);
        $el['type'] = 'header';
        return $el;
    }
    /**
     * Generates a unique element name for anonymous elements to use
     * to differentiate things in the internal elements array.
     *
     * @param string $name The current element name
     *
     * @return $name if it exists, otherwise a unique new name.
     */
    private function _generateName($name)
    {
        static $num = 1;
        if (!empty($name)) {
            return $name;
        }
        return 'anonymous' . ($num++);
    }

    /**
     * An implementation of QuickForm's addElement function. This only
     * calls the appropriate $this->addX wrapper based on the "type"
     * passed to the function call.
     *
     * @param string $type    The type of element to add.
     * @param string $name    The element name.
     * @param string $label   The label to attach to this element.
     * @param array  $options An array of other options that should
     *                        be added. This generalls maps to the
     *                        third option of the addX wrapper.
     * @param array  $attribs Other attributes to be added. This is
     *                        mostly only used for the "select" type,
     *                        where "options" has a different meaning
     *                        and attribs takes the place of what "options"
     *                        is for other types.
     *
     * @return none, but modifies this->form as a side-effect
     */
    public function addElement(
        $type,
        $name,
        $label,
        $options=array(),
        $attribs=array()
    ) {
        $el = null;
        switch($type)  {
        case 'select':
            $el = $this->addSelect($name, $label, $options, $attribs);
            break;
        case 'date':
            $el = $this->addDate($name, $label, $options, $attribs);
            break;
        case 'file':
            $el = $this->addFile($name, $label, $options);
            break;
        case 'static':
            $el = $this->addStatic($name, $label);
            break;
        case 'textarea':
            $el = $this->addTextArea($name, $label, $options);
            break;
        case 'password':
            $el = $this->addPassword($name, $label, $options);
            break;
        case 'header':
            $el = $this->addHeader($name, $label, $options);
            break;
        case 'advcheckbox':
            $el = $this->addCheckbox($name, $label, $options);
            break;
        case 'hidden':
            $el = $this->addHidden($name, $label);
            break;
        case 'text':
        default:
            $el = $this->addText($name, $label, $options);
            break;
        }
    }

    /**
     * Reimplementation of HTML_QuickForm's createText function.
     *
     * Creates a text element that can be added to the page but
     * does not itself add the element.
     *
     * @param string $elname  The name of the element to be added to
     *                        the form
     * @param string $label   The name of the label to attach to the
     *                        form
     * @param array  $attribs An array of extra HTML attributes to be
     *                        added to this element.
     *
     * @return array of the form that can be added to $this->form
     */
    function createText($elname, $label, $attribs = array())
    {
        $el         =& $this->createBase($elname, $label, $attribs);
        $el['type'] = 'text';
        return $el;
    }

    /**
     * Reimplementation of HTML_QuickForm's createSubmit function.
     *
     * Creates a text element that can be added to the page but
     * does not itself add the element.
     *
     * @param string $elname  The name of the element to be added to
     *                        the form
     * @param string $value   The value of the element to be added to
     *                        the form
     * @param array  $attribs An array of extra HTML attributes to be
     *                        added to this element.
     *
     * @return array of the form that can be added to $this->form
     */
    function createSubmit($elname, $value, $attribs = array())
    {
        $attribs['value'] = $value;
        $el         =& $this->createBase($elname, null, $attribs);
        $el['type'] = 'submit';
        return $el;
    }

    /**
     * Reimplementation of HTML_QuickForm's createTextArea function.
     *
     * Creates a text element that can be added to the page but
     * does not itself add the element.
     *
     * @param string $elname The name of the element to be added to
     *                       the form
     * @param string $label  The name of the label to attach to the
     *                       form
     *
     * @return array of the form that can be added to $this->form
     */
    function createTextArea($elname, $label)
    {
        $el         =& $this->createBase($elname, $label);
        $el['type'] = 'textarea';
        return $el;
    }


    /**
     * Retrives the default value to populate for a form element.
     * If it was POSTed by the user, use that value, otherwise use
     * the form default.
     *
     * @param string $name The form element name to retrieve the value
     *                     for.
     *
     * @return string The value to use for the form element.
     */
    function getValue($name)
    {
        // Not all elements of the form go into $_REQUEST, thus the isset test
        if (isset($_REQUEST[$name])) {
            // If submitted value in $_REQUEST is an array return the array
            // of filtered values
            if (is_array($_REQUEST[$name])) {
                $filteredValues = array();
                foreach ($_REQUEST[$name] as $k => $v) {
                    // Checkbox values get converted from (on,off) to (1,0)
                    if ($this->_isAdvCheckbox("{$name}[$k]")) {
                        $rawValue = $_REQUEST[$name][$k] == 'on' ? 1 : 0;
                    } else {
                        $rawValue = $_REQUEST[$name][$k];
                    }
                    // This is more for consistency since it would be odd to apply a
                    // filter to a checkbox value
                    $filteredValues[$k]
                        = $this->_getFilteredValue("[$name}[$k]", $rawValue);
                }

                return $filteredValues;
            } else {
                // if submitted value is not an array, filter it
                return $this->_getFilteredValue($name, $_REQUEST[$name]);
            }
        }

        // Check to see if the element name is of the form name[idx]
        // (if so there should be a 'name' array in $_REQUEST)
        $bracketIdx = strpos($name, '[');
        if ($bracketIdx !== false) {
            $fieldName = strstr($name, '[', true);
            $fieldIdx  = substr($name, $bracketIdx+1);
            $fieldIdx  = strstr($fieldIdx, ']', true);
            // This should always be true
            if (isset($_REQUEST[$fieldName])) {
                if ($this->_isAdvCheckbox($name)) {
                    // Only the checkboxes turned on are put in $_REQUEST,
                    // thus the isset check
                    $value = isset($_REQUEST[$fieldName][$fieldIdx])
                        ? $_REQUEST[$fieldName][$fieldIdx] : null;

                    $rawValue = $value == 'on' ? 1 : 0;
                    return $this->_getFilteredValue($name, $rawValue);
                }

                return $this->_getFilteredValue(
                    $name,
                    $_REQUEST[$fieldName][$fieldIdx]
                );
            }
        }

        if (isset($this->defaultValues[$name])) {
            return $this->_getFilteredValue(
                $name,
                $this->defaultValues[$name]
            );
        }

        return null;
    }

    /**
     * Determines if a fomr element if of type 'advcheckbox'.
     *
     * @param string $elementName Name of a form element that exists in the $form.
     *
     * @return boolean true if the element is a checkbox, false otherwise.
     */
    private function _isAdvCheckbox($elementName)
    {
        // If the element is not in a group
        if (isset($this->form[$elementName])) {
            return $this->form[$elementName]['type'] == 'advcheckbox';
        }

        // Element is in a groug: check in each group
        foreach ($this->form as $element) {
            if (is_array($element) && $element['type'] == 'group') {
                // Check all elements of the current group for the element
                foreach ($element['elements'] as $groupElement) {
                    // Check if name is right
                    if ($groupElement['name'] == $elementName) {
                        return $groupElement['type'] == 'advcheckbox';
                    }
                }
            }
        }

        // Should not happen
        return false;
    }

    /**
     * Gets the value of form element $name, after all filters have been
     * applied. If there are no filters registered for element $name, then
     * the original unmodified value is returned.
     *
     * @param string $name  name of the form element in the $form.
     * @param string $value value of the form element in $_REQUEST or null if
     *               none was found.
     *
     * @return string value of the form element once all registered filters
     *                (if any) have been applied.
     */
    private function _getFilteredValue($name, $value)
    {
        // Apply field specific filters
        if (isset($this->filters[$name])) {
            if (in_array('trim', $this->filters[$name])) {
                $new_value = trim($value);
            }
        }

        // Apply filters that should be applied on all fields
        if (isset($this->filters['__ALL__'])) {
            foreach ($this->filters['__ALL__'] as $filterType) {
                if (in_array('trim', $this->filters['__ALL__'])) {
                    // Value for the element is in array so filter all
                    // elements in the array of values
                    if (is_array($value)) {
                        $newValue = array();
                        foreach ($value as $k => $v) {
                            $newValue[$k]
                                = $this->_getFilteredValue("{$name}[$k]", $v);
                        }
                    } else {
                        // Submitted value not an array: trim it
                        $newValue = trim($value);
                    }
                }
            }
        }

        return $newValue;
    }

    /**
     * Generates the HTML to add to the page when rendered for a select
     * element.
     *
     * @param array $el The element to render from $this->form
     *
     * @return string A string of the HTML markup to render
     */
    protected function selectHTML($el)
    {
        $strOptions    = '';
        $options       = $el['options'];
        $cls           = '';
        $changehandler = '';
        $multiple      = '';
        $id            = '';
        $disabled      = '';

        foreach ($options as $optionKey => $optionVal) {
            $selected = '';

            if (!is_null($optionKey)) {
                $optionKey = (string) $optionKey;
            }

            if ($optionKey === $this->getValue($el['name'])) {
                $selected = 'selected="selected"';
            } elseif (isset($el['selected'])
                && $optionKey === $el['selected']
                && $this->getValue($el['name']) === null
            ) {
                $selected = 'selected="selected"';
            }

            $strOptions .= "<option value='$optionKey' $selected>"
                .$optionVal
                . "</option>";
        }

        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        if (isset($el['id'])) {
            $id = "id=\"$el[id]\"";
        }
        if (isset($el['disabled'])) {
            $disabled = 'disabled';
        }
        if (isset($el['onchange'])) {
            $changehandler = "onchange=\"$el[onchange]\"";
        }
        if (isset($el['multiple'])) {
            $multiple = "multiple=\"multiple\"";
        }

        $retVal = "<select name=\"$el[name]\" $cls $id $changehandler $multiple "
            . $disabled;

        if (isset($el['required']) && $el['required']) {
            $retVal .= ' required';
            if ($el['requireMsg']) {
                $retVal .= ' onChange="this.setCustomValidity('
                    . 'this.value === \'\' ? \''
                    . $el['requireMsg']
                    . "' : '')\"";
            }
        }
        $retVal .= ">$strOptions</select>";

        return $retVal;
    }

    /**
     * Generates the HTML to add to the page when rendered for a static
     * element.
     *
     * @param array $el The element to render from $this->form
     *
     * @return string A string of the HTML markup to render
     */
    function staticHTML($el)
    {
        if (empty($el['name'])) {
            return $el['label'];
        }
        $val = $this->getValue($el['name']);

        return $val;
    }
    /**
     * Generates the HTML to add to the page when rendered for a date
     * element.
     *
     * @param array $el The element to render from $this->form
     *
     * @return string A string of the HTML markup to render
     */
    function dateHTML($el)
    {
        $cls      = '';
        $minYear  = '';
        $maxYear  = '';
        $disabled = '';
        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        if (isset($el['disabled'])) {
            $disabled = 'disabled';
        }
        if (isset($el['options']['minYear'])) {
            $minYear = "min=\"" . $el['options']['minYear'] . "-01-01\"";
        }
        if (isset($el['options']['maxYear'])) {
            $maxYear = "max=\"" . $el['options']['maxYear'] . "-12-31\"";
        }
        $msg      = isset($el['requireMsg']) ? $el['requireMsg'] : 'Required';
        $required = isset($el['required']) ? "this.value === '' ? '$msg' : ''" : '';
        $value    = $this->getValue($el['name']);
        $elmnt    = "<input name=\"$el[name]\" type=\"date\" $cls $minYear $maxYear "
            . $disabled
            . " onChange=\"this.setCustomValidity($required)\""
            . (isset($el['required']) ? "required" : '')
            . (
            !empty($value)
                ? ' value="' . $this->getValue($el['name']) . '" '
                : ''
            )
            . ">";

        return $elmnt;
    }

    /**
     * Generates the HTML to add to the page when rendered for a group
     * element. This will render all subelements and return the HTML
     * for the entire group.
     *
     * @param array $el The element to render from $this->form
     *
     * @return string A string of the HTML markup to render
     */
    function groupHTML(&$el)
    {
        $retVal = '';
        foreach ($el['elements'] as &$element) {
            if (isset($el['options']['prefix_wrapper'])) {
                $retVal .= $el['options']['prefix_wrapper'];
            }

            $element['html'] = $this->renderElement($element);
            $retVal         .= $element['html'];

            if (isset($el['options']['postfix_wrapper'])) {
                $retVal .= $el['options']['postfix_wrapper'];
            }
            $retVal .= $el['delimiter'];
        }
        return $retVal;
    }

    /**
     * Generates the HTML to add to the page when rendered for a text
     * element.
     *
     * @param array  $el   The element to render from $this->form
     * @param string $type The HTML input type to user for this input
     *                     box
     *
     * @return string A string of the HTML markup to render
     */
    function textHTML($el, $type='text')
    {
        $cls      = '';
        $disabled = '';
        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        if (isset($el['disabled'])) {
            $disabled = 'disabled';
        }
        $value = $this->getValue($el['name']);
        return "<input name=\"$el[name]\" type=\"$type\" $cls"
            . (
                isset($el['onchange']) && $el['onchange']
                ? " onchange=\"{$el['onchange']}\"" : ''
              )
            . (
                isset($el['oninvalid']) && $el['oninvalid']
                ? " oninvalid=\"{$el['oninvalid']}\"" : ''
              )
            . (
                isset($el['pattern']) && $el['pattern']
                ? " pattern=\"{$el['pattern']}\"" : ''
              )
            . (
                isset($el['required']) && $el['required']
                ? ' required' : ''
              )
            . (
                (!empty($value) || $value === '0')
                ? ' value="' . $this->getValue($el['name']) . '"'
                : ''
              )
            . $disabled
            .">";
    }

    /**
     * Generates the HTML to add to the page when rendered for a submit
     * element.
     *
     * @param array  $el   The element to render from $this->form
     * @param string $type The HTML input type to user for this input
     *                     box
     *
     * @return string A string of the HTML markup to render
     */
    function submitHTML($el, $type='submit')
    {
        $cls = '';
        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        $value = '';
        if (isset($el['value'])) {
            $value = "value=\"$el[value]\"";
        }
        return "<input name=\"$el[name]\" type=\"$type\" $cls $value>";
    }

    /**
     * Generates the HTML to add to the page when rendered for a hidden
     * element.
     *
     * @param array  $el   The element to render from $this->form
     * @param string $type The HTML input type to user for this input
     *                     box
     *
     * @return string A string of the HTML markup to render
     */
    function hiddenHTML($el, $type='hidden')
    {
        $value = '';
        if (isset($el['value'])) {
            $value = "value=\"$el[value]\"";
        }
        return "<input name=\"$el[name]\" type=\"$type\" $value>";
    }

    /**
     * Generates the HTML to add to the page when a file is
     * added to the form.
     *
     * @param array $el The element to render from $this->form
     *
     * @return string A string of the HTML markup to render
     */
    function fileHTML($el)
    {
        $cls      = '';
        $disabled = '';
        $val      = $this->getValue($el['name']);
        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        if (isset($el['disabled'])) {
            $disabled = 'disabled';
        }
        return "<input name=\"$el[name]\" type=\"file\" $cls"
            . (
                !empty($val)
                ? ' value="' . $val . '"'
                : ''
              )
            . $disabled
            .">";
    }

    /**
     * Generates the HTML to add to the page when a textarea is
     * added to the form.
     *
     * @param array $el The element to render from $this->form
     *
     * @return string A string of the HTML markup to render
     */
    function textareaHTML($el)
    {
        $cls      = '';
        $dims     = '';
        $disabled = '';
        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        if (isset($el['disabled'])) {
            $disabled = 'disabled';
        }
        if (isset($el['rows'])) {
            $dims .= " rows=\"$el[rows]\"";
        }
        if (isset($el['cols'])) {
            $dims .= " cols=\"$el[cols]\"";
        }
        $value = $this->getValue($el['name']);
        return "<textarea name=\"$el[name]\" $cls $dims $disabled>"
            . (
                !empty($value)
                ? $this->getValue($el['name']) : ''
              )
            ."</textarea>";
    }



    /**
     * Reimplements the HTML_QuickForm setDefaults API.
     *
     * @param array $arr The array to use as the default values for the form
     *                   elements
     *
     * @return none
     */
    function setDefaults($arr)
    {
        $this->defaultValues = $arr;
    }

    /**
     * Reimplementation of HTML_QuickForm isSubmitted API.
     *
     * @return true if data was submitted by the user to the form.
     */
    function isSubmitted()
    {
        return (!empty($_FILES) || !empty($_POST));
    }
    /**
     * Reimplements the HTML_QuickForm validate API.
     *
     * @return true if all registered rules passed
     */
    function validate()
    {
        if (!$this->isSubmitted()) {
            return false;
        }
        $values = $this->getSubmitValues();
        $errors = array();
        foreach ($this->form as $elName => $el) {
            $value = $this->getValue($el['name']);
            if (isset($el['required'])
                && $el['required'] === true
                && empty($value)
            ) {
                //$this->setElementError($el['name'], "$el[name] required.");
                $errors[$el['name']] = "required fail";
            }

            if (isset($el['compare'])
                && $value != $this->getValue($el['compare'])
            ) {
                // These don't seem to show up in the original, so just make
                // the validation fail by adding something to the errors array
                // but don't call setElementError..
                $errors[$el['name']] = "comparison fail";
            }
        }
        foreach ($this->formRules as $rule) {
            $violations = call_user_func($rule, $values);
            if (!empty($violations)) {
                foreach ($violations as $element => $msg) {
                    $this->setElementError($element, $msg);
                    $errors[$element] = "custom fail";
                }
            }
        }

        return empty($errors);
    }

    /**
     * Reimplements the HTML_Quickform API.
     *
     * @param callable $func The callback to use to process this form.
     *
     * @return none
     */
    function process($func)
    {
        call_user_func($func, $this->getSubmitValues());
    }

    /**
     * Reimplements the HTML_QuickForm applyFilter API.
     * Only trim operations are supported. Passing the special
     * __ALL__ $elementName will apply the filter to every element
     * in the form.
     *
     * @param string $elementName name of the element to which the filter
     *                            should be applied.
     * @param string $filterType  type of filter to apply.
     *
     * @return none
     */
    function applyFilter($elementName, $filterType)
    {
        if ($filterType == 'trim') {
            if (!isset($this->filters[$elementName])) {
                $this->filters[$elementName] = array();
            }

            $this->filters[$elementName][] = 'trim';
        }

        // Eventually, support for more filter types will be added here
    }

    /**
     * Stub function so that API is compatible with HTML_QuickForm.
     *
     * Not currently supported.
     *
     * @return none
     */
    function freeze()
    {
        $this->frozen = true;
    }

    /**
     * Reimplement the HTML_QuickForm isFrozen API.
     * TODO: Implement this in *HTML functions.
     *
     * @return boolean true if the form should be frozen for input.
     */
    function isFrozen()
    {
        return $this->frozen;
    }

    /**
     * Renders an element by calling the correct wrapper for the
     * type, or throws an exception if given an unsupported element
     * type.
     *
     * @param array $el An array of the form used by $this->form
     *
     * @return string the HTML for the given element.
     */
    function renderElement(&$el)
    {
        switch($el['type']) {
        case 'date':
            return $this->dateHTML($el);
        case 'select':
            return $this->selectHTML($el);
        case 'static':
            return $this->staticHTML($el);
        case 'textarea':
            return $this->textareaHTML($el);
        case 'file':
            return $this->fileHTML($el);
        case 'password':
            return $this->textHTML($el, 'password');
        case 'text':
            return $this->textHTML($el);
        case 'advcheckbox':
            return $this->checkboxHTML($el);
        case 'group':
            return $this->groupHTML($el);
        case 'header':
            return $this->headerHTML($el);
        case 'page':
            return '';
        case 'submit':
            return $this->submitHTML($el);
        case 'hidden':
            return $this->hiddenHTML($el);
        }
        throw new LorisException(
            "Unsupported element type $el[type] in renderElement"
        );
    }

    /**
     * Generates the HTML for a header type element
     *
     * @param array $el An array of the form used by $this->form
     *                  for a header
     *
     * @return string The HTML for the given header element
     */
    function headerHTML($el)
    {
        $cls   = '';
        $align = '';

        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        if (isset($el['align'])) {
            $align = "align=\"$el[align]\"";
        }

        return "<h2 $cls $align>$el[label]</h2>";
    }

    /**
     * Generates the HTML for an advcheckbox type element
     *
     * @param array $el An array of the form used by $this->form
     *                  for a checkbox
     *
     * @return string the HTML for the given checkbox element.
     */
    function checkboxHTML($el)
    {
        $val      = $this->getValue($el['name']);
        $checked  = '';
        $value    = '';
        $disabled = '';
        if (!empty($val)) {
            $checked = 'checked="checked"';
        }
        if (isset($el['value'])) {
            $value = "value=\"$el[value]\"";
        }
        if (isset($el['disabled'])) {
            $disabled = 'disabled';
        }
        return "<input name=\"$el[name]\" type=\"checkbox\" $checked $value "
            . "$disabled/>"
            . " $el[label]";
    }
    /**
     * This is a slight difference from the HTML_QuickForm API.
     * Whereas in HTML_QuickForm, you instantiated an array renderer,
     * and the called toArray on it, in LorisForm you directly call
     * toArray on the form. This returns an array in a format that
     * can be bound to a smarty template for rendering.
     *
     * @return array An associative array of elements that can be
     *               passed to Smarty. Each element will have an
     *               'html' attribute populated that can be used
     *               to display the HTML for that attribute.
     */
    function toArray()
    {
        foreach ($this->form as &$el) {
            switch($el['type']) {
            case 'date':
                $el['html'] = $this->dateHTML($el);
                break;
            case 'select':
                $el['html'] = $this->selectHTML($el);
                break;
            case 'static':
                $el['html'] = $this->staticHTML($el);
                break;
            case 'text':
                $el['html'] = $this->textHTML($el);
                break;
            case 'file':
                $el['html'] = $this->fileHTML($el);
                break;

            }
            $el['html'] = $this->renderElement($el);
        }

        $retVal           = $this->form;
        $retVal['errors'] = $this->errors;
        return $retVal;
    }

    /**
     * Returns the current form in a format where the elements go
     * within an "elements" attribute, similarly to how the QuickForm
     * renderer used by instruments is used. This is different from
     * how the "toArray" works in that toArray generates an array
     * in a format suitable to smarty, while this is suitable to
     * instrument serialization.
     *
     * @return array where each form element is in an "elements" attribute
     */
    function toElementArray()
    {

        $curPage = array(
                    'elements' => array(),
                    'type'     => 'page',
                   );
        $retVal  = $curPage;

        // Hack to populate the HTML elements
        $this->toArray();

        foreach ($this->form as &$el) {
            if ($el['type'] === 'page') {
                if (!empty($curPage['Description'])) {
                    $retVal['elements'][] = $curPage;
                }

                $curPage = array(
                            'elements'    => array(),
                            'Description' => $el['label'],
                            'type'        => 'page',
                           );
            } else {
                $curPage['elements'][] = $el;
            }
        }
        if (empty($retVal['elements'])) {
            return $curPage;
        }

        $retVal['elements'][] = $curPage;
        return $retVal;
    }
    /**
     * Reimplement Smarty's addRule API.
     *
     * Only 'require' and 'compare' will be implemented
     * since those are the only ones we used.
     *
     * @param string $element The element name to add the rule to.
     *                        If this is a 'compare' rule, it will
     *                        be an array of 2 element names.
     * @param string $message The message to display if the rule is violated
     * @param string $type    The rule type. 'compare' or 'required'
     *
     * @return none
     */
    function addRule($element, $message, $type)
    {
        if (is_array($element)) {
            if ($type === 'compare') {
                $this->form[$element[0]]['compare'] = $element[1];
                $this->form[$element[1]]['compare'] = $element[0];
            }
            return;
        }
        if (!is_string($element)) {
            throw new \LorisException("Element name is not a string");
        }
        if (!isset($this->form[$element])) {
            throw new \LorisException("Invalid Element $element");
        }

        if ($type === 'required') {
            $this->form[$element]['required']   = true;
            $this->form[$element]['requireMsg'] = $message;
        }
    }

    /**
     * Register a rule type to be added from the QuickForm API. This
     * is unlikely to ever be implemented.
     *
     * @return none.
     */
    function registerRule()
    {
    }

    /**
     * Reimplementation of QuickForm API.
     *
     * Adds a rule to a group.
     * TODO: Implement this so that instruments can use LorisForm.
     *
     * @return none.
     */
    function addGroupRule()
    {
    }

    /**
     * Reimplementation of QuickForm API.
     *
     * Adds a PHP callback to use to enforce rules.
     *
     * @param callable $func The callback to use to validate this form.
     *
     * @return none.
     */
    function addFormRule($func)
    {
        $this->formRules[] = $func;
    }

    /**
     * Reimplementation of QuickForm API.
     *
     * Adds an element group to the form.
     *
     * @param array  $array     An array of elements created by $this->create*
     *                          to be in the group.
     * @param string $name      The name of the group
     * @param string $label     The label to attach to the group
     * @param string $delimiter The delimiter to use to separate group elements
     * @param array  $options   An optional array to include prefix_wrapper and
     *                          postfix_wrapper strings - html that will be
     *                          placed before and after the group html
     *
     * @return none
     */
    function addGroup($array, $name, $label, $delimiter, $options = array())
    {
        $this->form[$name] = array(
                              'type'      => 'group',
                              'name'      => $name,
                              'elements'  => $array,
                              'label'     => $label,
                              'delimiter' => empty($delimiter) ? ' ' : $delimiter,
                              'options'   => $options,
                             );

    }

    /**
     * Adds a page break, such that each element added after this
     * page break goes on a new page.
     *
     * @param string $name    The name to use for the new page (in the URL)
     * @param string $label   The label to show to the user for the new page
     * @param string $attribs Extra attributes for this page.
     *
     * @return None
     */
    function addPageBreak($name, $label, $attribs)
    {
        $el   =& $this->createBase($name, $label, $attribs);
        $name = $this->_generateName($name);

        $el         =& $this->addBase($name, $label, $attribs);
        $el['type'] = 'page';
    }
    /**
     * Reimplementation of QuickForm API.
     *
     * Creates an element without adding it to the form.
     *
     * @param string $type    The type of element to be created.
     * @param string $elname  The name of the element to be added
     * @param string $label   The label to attach to the element
     * @param array  $options Element specific options to pass
     *                        to create* wrappers
     * @param array  $attribs An array of extra HTML attributes to
     *                        add to the element.
     *
     * @return array of the form supported by $this->form
     */
    function createElement($type, $elname, $label, $options, $attribs=array())
    {
        switch($type) {
        case 'text':
            return $this->createText($elname, $label, $options, $attribs);
        case 'select':
            return $this->createSelect($elname, $label, $options, $attribs);
        case 'submit':
            return $this->createSubmit($elname, $label, $options);
        case 'static':
            /* Label seems to usually be the wrong attribute for static
             * elements?
             */
            $el         = $this->createBase($elname, $options, $attribs);
            $el['type'] = 'static';
            break;
        case 'advcheckbox':
        case 'textarea':
        case 'date':
        case 'password':
            $el         = $this->createBase($elname, $label, $options);
            $el['type'] = $type;
            break;
        default:
            throw new LorisException("Unsupported QuickForm type $type");
        }
        return $el;
    }

    /**
     * Creates a select element but does not add it to the page.
     *
     * @param string $name    The name of the element to be added
     * @param string $label   The label to attach to the element
     * @param array  $options Array of options to add to the select
     *                        dropdown.
     * @param array  $attribs An array of extra HTML attributes to
     *                        add to the element.
     *
     * @return array of the form supported by $this->form
     */
    public function createSelect($name, $label, $options, $attribs = array())
    {
        $el            =& $this->createBase($name, $label, $attribs);
        $el['type']    = 'select';
        $el['options'] = $options;
        if (isset($attribs['multiple'])) {
            $el['multiple'] = $attribs['multiple'];
        }
        return $el;

    }

    /**
     * Iterates through an array of elements and populates the array
     * passed as a reference with the values that come from the POST
     * request.
     *
     * This may recursively call itself to also get the values out of
     * groups, or be called directly by getSubmitValues() with the
     * whole form as the "group".
     *
     * @param array $submitKeys The elements that need to have their
     *                             values extracted.
     * @param array $arr        A reference to an array to store the
     *                             extracted values into.
     *
     * @return none, but will modify &$arr parameter passed as a side-effect
     */
    function getGroupValues($submitKeys, &$arr)
    {
        foreach ($submitKeys as $key) {
            if (!isset($this->form[$key])) {
                $arr[$key] = $_REQUEST[$key];
                continue;
            }
            $el = $this->form[$key];
            // If it's a group, recursively go through the elements
            // of that group.
            if ($el['type'] === 'group') {
                $this->getGroupValues(array_keys($el['elements']), $arr);
                continue;
            }

            // If it was an element of the form $elemname[idx],
            // which PHP converts to an array of $elemname, then
            // we need to check for $elemname, not $elemname[idx]
            $name       = $el['name'];
            $bracketIdx = strpos($name, '[');
            if ($bracketIdx !== false) {
                $fieldName = substr($name, 0, $bracketIdx);
                $fieldIdx  = substr($name, $bracketIdx+1);
                $fieldIdx  = strstr($fieldIdx, ']', true);
                if (!isset($arr[$fieldName])) {
                    $arr[$fieldName] = $this->getValue($fieldName);
                }
                continue;
            }

            // Check to see it the element type is a header or is a static
            // element without a request variable. If so do not add to the
            // reference array
            if (!($el['type'] === 'header'
                || ($el['type'] === 'static' && empty($_REQUEST[$name])))
            ) {
                  $arr[$name] = $this->getValue($name);
            }

            if ($el['type'] === 'date') {
                // Convert dates to the type of group that was used
                // by HTML_QuickForm. This should eventually be modified
                // to just use a normal HTML5 date.
                $vals       = explode("-", $arr[$name]);
                $arr[$name] = array(
                               'Y' => $vals[0],
                               'M' => $vals[1],
                               'd' => $vals[2],
                              );
            }
        }
    }

    /**
     * Reimplementation of QuickForm API.
     *
     * Gets the values submitted by the user
     *
     * @return none
     */
    function getSubmitValues()
    {
        $retVal = array();
        $this->getGroupValues(array_keys($_POST), $retVal);
        return $retVal;
    }

    /**
     * Reimplementation of HTML_QuickForm getElement
     *
     * Extracts the element from the page.
     *
     * @param string $name The name of the element to extract.
     *
     * @return useless object which has the same methods as
     *         those used by QuickForm, so that the LorisForm
     *         is API compatible.
     */
    function getElement($name)
    {
        if ($this->form[$name]['type'] === 'file') {
            return new LorisFormFileElement($this->form[$name]);
        }
        return new LorisFormElement($this->form[$name]);
    }

    /**
     * Sets an error for the given element to be displayed to the
     * user
     *
     * @param string $el    The name of the element which has an error
     * @param string $error The error to display with the element.
     *
     * @return none
     */
    function setElementError($el, $error)
    {
        $this->errors[$el] = $error;
    }

    /**
     * Extracts the current error associated with an element
     *
     * @param string $el The name of the element whose error we'd like
     *                   to know.
     *
     * @return string the error message of the element
     */
    function getElementError($el)
    {
        if (isset($this->errors[$el])) {
            return $this->errors[$el];
        }

        return;
    }
}

/**
 * A stub class so that calls to getElement that try and do something
 * with that element do not crash.
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class LorisFormElement
{
    /**
     * Stub. Does nothing.
     *
     * @return none
     */
    function freeze()
    {
    }

    /**
     * Stub. Does nothing.
     *
     * @return none
     */
    function getValue()
    {
    }
};

/**
 * A stub class which adds file related functions to LorisFormElement.
 * (And implements them.)
 *
 * @category Main
 * @package  Main
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class LorisFormFileElement extends LorisFormElement
{
    var $el;
    var $file;

    /**
     * Constructor.
     *
     * @param array $el The element from $this->form which
     *                  we need an object wrapper around.
     */
    function __construct($el)
    {
        $this->el   = $el;
        $this->file = $_FILES[$this->el['name']];
    }

    /**
     * Returns true if the file was uploaded by the user.
     *
     * @return true if the file was uploaded by the user.
     */
    function isUploadedFile()
    {
        return isset($_FILES[$this->el['name']]);
    }

    /**
     * Moves the file to the destination directory after it's been uploaded
     * by the user and processed by the script.
     *
     * @param string $destinationDir      The directory to move the file into
     * @param string $destinationFileName The filename to use in that directory.
     *
     * @return none
     */
    function moveUploadedFile($destinationDir, $destinationFileName)
    {
        return move_uploaded_file(
            $this->file['tmp_name'],
            $destinationDir . $destinationFileName
        );
    }

    /**
     * Extracts the value of the file as represented in PHP $_FILES
     * superglobal. This seems to be how QuickForm handled it.
     *
     * @return array of the form used by $_FILES superglobal
     */
    function getValue()
    {
        if (!$this->isUploadedFile()) {
            return false;
        }
        return $_FILES[$this->el['name']];
    }
}
?>
