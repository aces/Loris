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
    var $frozen = false;

    protected function &createBase($name, $label, $attribs) {
        $el = array(
               'label' => $label,
               'name'  => $name,
              );
        if (isset($attribs['class'])) {
            $el['class'] = $attribs['class'];
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
    protected function &addBase($name, $label, $attribs)
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
     * @return none, modifies $this->form as a side-effect.
     */
    public function addSelect($name, $label, $options, $attribs = array())
    {
        $el            =& $this->addBase($name, $label, $attribs);
        $el['type']    = 'select';
        $el['options'] = $options;

    }

    public function addStatic($name, $label) {
        $el =& $this->addBase($name, $label, array());
        $el['type']    = 'static';
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
     * @return none, modifies $this->form as a side-effect.
     */
    public function addText($name, $label, $options=array())
    {
        $el         =& $this->addBase($name, $label, $options);
        $el['type'] = 'text';
    }

    /**
     * Reimplementation of HTML_QuickForm's "addDate" API. The behaviour
     * of this varies slightly from QuickForm in that this will use an
     * HTML5 input type="date" element, while QuickForm added three dropdowns
     * for year/month/day.
     *
     * @param string $name    The element name.
     * @param string $label   The label to attach to this element.
     * @param array  $options An array of other attributes that should
     *                        get added. Currently only the "class"
     *                        attribute gets added.
     *
     * @return none, modifies $this->form as a side-effect.
     */
    public function addDate($name, $label, $options)
    {
        $el         =& $this->addBase($name, $label, $options);
        $el['type'] = 'date';
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
     * @return none, modifies $this->form as a side-effect.
     */
    function addFile($name, $label, $options)
    {
        $el         =& $this->addBase($name, $label, $options);
        $el['type'] = 'file';
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
            $el = $this->addDate($name, $label, $options);
            break;
        case 'file':
            $el = $this->addFile($name, $label, $options);
            break;
        case 'static':
            $el = $this->addStatic($name, $label);
            break;
        case 'text':
        default:
            $el = $this->addText($name, $label, $options);
            break;
        }
    }

    function createText($elname, $label) {
        $el =& $this->createBase($elname, $label);
        $el['type'] = 'text';
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
        if (isset($_REQUEST[$name])) {
            return $_REQUEST[$name];
        }
        if (isset($this->defaultValues[$name])) {
            return $this->defaultValues[$name];
        }
        return null;
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
        $strOptions = '';
        $options    = $el['options'];
        $cls        = '';
        foreach ($options as $optionKey => $optionVal) {
            $selected = '';

            if ($optionKey == $this->getValue($el['name'])) {
                $selected = 'selected="selected"';
            }

            $strOptions .= "<option value='$optionKey' $selected>"
                .$optionVal
                . "</option>";
        }

        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        $retVal = "<select name=\"$el[name]\" $cls";
        if (isset($el['required']) && $el['required']) {
            $retVal .= ' required';
            if ($el['requireMsg']) {
                $retVal .= ' onChange="this.setCustomValidity(this.value === \'\' ? \''
                    . $el['requireMsg']
                    . "' : '')\"";
            }
        }
        $retVal .= ">$strOptions</select>";

        return $retVal;
    }

    function staticHTML($el) {
        return $this->getValue($el['name']);
        /*
        if (empty($el['name'])) {
            print "EMPTY";
        }
        return '';
         */
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
        $cls = '';
        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        $msg = isset($el['requireMsg']) ? $el['requireMsg'] : 'Required';
        $elmnt = "<input name=\"$el[name]\" type=\"date\" $cls"
            . "onChange=\"this.setCustomValidity(this.value === '' ? '$msg' : '')\""
            . (isset($el['required']) ? "required" : '')
            . (
                !empty($this->getValue($el['name']))
                ? ' value="' . $this->getValue($el['name']) . '" '
                : ''
              )
            . ">";
        /*
        if(isset($this->errors[$el['name']])) {
            $elmnt .= $this->errors[$el['name']];
        }
         */
        return $elmnt;

    }
    function groupHTML($el) {
        $retVal = '';
        foreach($el['elements'] as $element) {
            $retVal .= $this->rednerElement($el);
            $retVal .= $el['delimiter'];
        }
        return $retVal;
    }

    /**
     * Generates the HTML to add to the page when rendered for a text
     * element.
     *
     * @param array $el The element to render from $this->form
     *
     * @return string A string of the HTML markup to render
     */
    function textHTML($el)
    {
        $cls = '';
        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        return "<input name=\"$el[name]\" type=\"text\" $cls"
            . (
                !empty($this->getValue($el['name']))
                ? ' value="' . $this->getValue($el['name']) . '"'
                : ''
              )
            .">";
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
        $cls = '';
        $val = $this->getDefault($el['name']);
        if (isset($el['class'])) {
            $cls = "class=\"$el[class]\"";
        }
        return "<input name=\"$el[name]\" type=\"file\" $cls"
            . (
                !empty($val)
                ? ' value="' . $val . '"'
                : ''
              )
            .">";
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
     * Reimplements the HTML_QuickForm validate API.
     *
     * @return true if all registered rules passed
     */
    function validate()
    {
        $values = $this->getSubmitValues();
        $errors = array();
        foreach ($this->form as $elName => $el) {
            $value = $this->getValue($el['name']);
            if (empty($value)) {
                //$this->setElementError($el['name'], "$el[name] required.");
                $errors[$el['name']] = "required fail";
            }

            if(isset($el['compare'])
                && $value != $this->getValue($el['compare'])
            )
            {
                // These don't seem to show up in the original, so just make the validation
                // fail but don't setElementError..
                //$this->setElementError($el['name'], "$el[name] comparison to $el[compare] failed.");
                $errors[$el['name']] = "comparison fail";
            }
        }
        foreach ($this->formRules as $rule) {
            $violations = $rule($values);
            if (!empty($violations)) {
                foreach($violations as $element => $msg) {
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
     * TODO: Implement this. We only ever use "trim", so that will be the only
     *       thing implemented.
     *
     * @return none
     */
    function applyFilter()
    {
    }

    function freeze() {
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

    function renderElement($el) {
        switch($el['type']) {
        case 'date':
            return $this->dateHTML($el);
        case 'select':
            return $this->selectHTML($el);
        case 'static':
            return $this->staticHTML($el);
        case 'text':
        case 'password':
            return $this->textHTML($el);
        case 'group':
            return $this->groupHTML($el);
        }
        print_r($el);
        throw new LorisException("Unsupported element type $el[type]");
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

        $retVal = $this->form;
        $retVal['errors'] = $this->errors;
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
     * Adds an eleent group to the form.
     * TODO: Implement this so that instruments (and others?)
     *       can use LorisForm.
     *
     * @return none
     */
    function addGroup($array, $name, $label, $delimiter)
    {
        $this->form[$name] = array(
            'type' => 'group',
            'elements' => $array,
            'delimiter' => empty($delimiter) ? ' ' : $delimiter
        );

    }

    /**
     * Reimplementation of QuickForm API.
     *
     * Creates an element without adding it to the form, mostly for the
     * sake of adding it to a group to be added with addGroup.
     *
     * TODO: Implement this so that instruments (and others?)
     *       can use LorisForm.
     *
     * @return none
     */
    function createElement($type, $elname, $label, $options)
    {
        switch($type) {
        case 'text':
            return $this->createText($elname, $label, $options);
        case 'static':
        case 'advcheckbox':
        case 'password':
            $el = $this->createBase($type, $elname, $label, $options);
            $el['type'] = $type;
            break;
        default:
            throw new LorisException("Unsupported QuickForm type $type");
        }
        return $el;
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
        foreach ($this->form as $el) {
            $name = $el['name'];

            $retVal[$name] = $_REQUEST[$name];
            if($el['type'] === 'date') {
                // Convert dates to the type of group that was used
                // by HTML_QuickForm. This should eventually be modified
                // to just use a normal HTML5 date.
                $vals = explode("-", $retVal[$name]);
                $retVal[$name] = array(
                    'Y' => $vals[0],
                    'M' => $vals[1],
                    'd' => $vals[2]
                );
            }
        }
        return $retVal;
    }

    function setElementError($el, $error) {
        $this->errors[$el] = $error;
    }

    function getElementError($el) {
        if(isset($this->errors[$el])) {
            return $this->errors[$el];
        }
        return;
    }
}
?>
