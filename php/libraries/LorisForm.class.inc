<?php
namespace Loris;
class LorisForm {
    var $form = array();
    var $defaultValues = array();

    function &addBase($name, $label) {
        $el = array('label' => $label, 'name' => $name);
        $this->form[$name] =& $el;
        return $el;
    }

    function addSelect($name, $label, $options) {
        $el =& $this->addBase($name, $label);
        $el['type'] = 'select';
        $el['options'] = $options;
    }

    function addText($name, $label) {
        $el =& $this->addBase($name, $label);
        $el['type'] = 'text';
    }

    function addDate($name, $label, $options) {
        $el =& $this->addBase($name, $label);
        $el['type'] = 'date';
    }

    function selectHTML($el) {
        $strOptions = '';
        $options = $el['options'];
        foreach($options as $optionKey => $optionVal) {
            $selected = '';

            if(isset($this->defaultValues[$el['name']]) && $optionKey == $this->defaultValues[$el['name']]) {
                $selected = 'selected="selected"';
            }

            $strOptions .= "<option value='$optionKey' $selected>$optionVal</option>";
        }

        $retVal = "<select name=\"$el[name]\"";
        if(isset($el['required']) && $el['required']) {
            $retVal .= ' required';
            if($el['requireMsg']) {
                $retVal .= " oninvalid=\"this.setCustomValidity('$el[requireMsg]')\"";
            }
        }
        $retVal .= ">$strOptions</select>";

        return $retVal;
    }

    function dateHTML($el) {
        $msg = isset($el['requireMsg']) ? $el['requireMsg'] : 'Required';
        return "<input name=\"$el[name]\" type=\"date\" "
            . "oninvalid=\"this.setCustomValidity('$msg')\""

            . (isset($el['required']) ? "required" : '')
            . (isset($this->defaultValues[$el['name']]) ? ' value="' . $this->defaultValues[$el['name']] . '" ' : '')
            . ">";

    }

    function textHTML($el) {
        return "<input name=\"$el[name]\" type=\"text\""
            . (
                isset($this->defaultValues[$el['name']]) ? ' value="' . $this->defaultValues[$el['name']] . '"' : ''
            ) .">";
    }

    function addElement($type, $name, $label, $options, ...$params) {
        $el = null;
        switch($type)  {
        case 'select':
            $el = $this->addSelect($name, $label, $options);
            break;
        case 'date':
            $el = $this->addDate($name, $label, $options);
            break;
        case 'text':
        default:
            $el = $this->addText($name, $label, $options);
            break;
        }
    }

    function setDefaults($arr) {
        $this->defaultValues = $arr;
    }

    function validate() {
    }

    function applyFilter() {
    }

    function isFrozen() {
        return false;
    }

    function toArray() {
        foreach($this->form as &$el) {
            switch($el['type']) {
            case 'date':
                $el['html'] = $this->dateHTML($el);
                break;
            case 'select':

                $el['html'] = $this->selectHTML($el);
                break;
            case 'text':
                $el['html'] = $this->textHTML($el);
                break;

            }
        }
        return $this->form;
    }

    function addRule($element, $message, $type, ...$params) {
        if(is_array($element)) {
            if($type === 'compare') {
                $this->form[$element[0]]['compare'] = $this->form[$element[1]];
                $this->form[$element[1]]['compare'] = $this->form[$element[0]];
            }
            return;
        }
        if(!is_string($element)) {
            throw new \LorisException("Element name is not a string");
        }
        if(!isset($this->form[$element])) {
            throw new \LorisException("Invalid Element $element");
        }

        if($type === 'required') {
            $this->form[$element]['required'] = true;
            $this->form[$element]['requireMsg'] = $message;
        }
    }

    function registerRule() {
    }
    function addGroupRule() {
    }

    function addFormRule() {
    }
    function addGroup() {
    }

    function createElement() {
    }
    function getSubmitValues() {
    }
}
?>
