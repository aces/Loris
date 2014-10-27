<?php

require_once "PEAR.php";
require_once "HTML/QuickForm.php";
include_once ('HTML/QuickForm/Renderer/Default.php');

class NDB_Page extends PEAR
{
    /**
     * The name of the test_name being accessed
     */
    var $name;

    /**
     * The name of the page (subtest) being accessed
     */
    var $page;

    /**
     * Reference to the HTML QuickForm
     */
    var $form;

    /**
     * The identifier for the item to edit
     * (ie. the CommentID)
     */
    var $identifier;
    var $commentID;

    /**
     * Form defaults
     */
    var $defaults = array();

    function _setupPage($name, $page, $identifier, $commentID, $formname) {
        $this->form = new HTML_QuickForm($formname);
        $this->name = $name;
        $this->page = $page;
        $this->identifier = $identifier;
        $this->commentID = $commentID;
        $this->defaults = array();
    }
    
    
    /**
    * Wrapper to create a file element
    */
    function addFile($name, $label) {
        $this->form->addElement('file', $name, $label);
    }

     /**
    * Wrapper to create a header
    */

    function addHeader($header) {
        $this->form->addElement('header', null, $header);
    }

    /**
    * Wrapper to create a select drop-down list
    */

    function addSelect($name, $label, $options, $optional=array()) {
        $optional = array_merge(array('class' => 'form-control input-sm'), $optional);
        $this->form->addElement('select', $name, $label, $options, $optional);
    }

    /**
    * Wrapper to create a static label
    */

    function addLabel($label) {
        $this->form->addElement('static', null, $label);
    }

    /**
    * Wrapper to create a static score column
    */

    function addScoreColumn($name, $label) {
        $this->form->addElement('static', $name, $label);
    }


    function addBasicText($field, $label, $options=array()) {
        $options = array_merge(array('class' => 'form-control input-sm'), $options);
        $this->form->addElement('text', $field, $label, $options);
    }

    function addBasicTextArea($field, $label, $specifications=array('class' => 'form-control input-sm')) {
        $this->form->addElement('textarea', $field, $label, $specifications);
    }

    function addBasicDate($field, $label, $options=array(), $attr=array('class' => 'form-control input-sm', 'style' => 'max-width:33%; display:inline-block;')) {
        $this->form->addElement('date', $field, $label, $options, $attr);
    }
 
    function addHidden($label, $attributes=null) {
        $this->form->addElement('hidden', $label, $attributes);
    }

    function addTextAreaGroup($field, $label,$not_answered_options=array('' =>'', 'not_answered' => 'Not Answered')) {
        $group = array();
        $group[] = $this->createTextArea($field, '');
        $group[] = $this->createSelect($field . '_status', '', $not_answered_options, array('class' => 'form-control input-sm not-answered'));

        $this->addGroup($group, $field . '_group', $label, null, false); 


    }
    function addRule($element, $message, $type, $format=null) {
        $this->form->addRule($element, $message, $type, $format);
    }

    function addGroupRule($group, $arg1, $type='', $format=null) {
        $this->form->addGroupRule($group, $arg1, $type, $format);
    }

    function addGroup($elements, $name, $label, $separator, $appendName=null) {
        $this->form->addGroup($elements, $name, $label, $separator, $appendName);
    }
    function addPassword($field, $label=null, $attr=array('class' => 'form-control input-sm')){
        $this->form->addElement('password', $field, $label, $attr);
    }

    function createSelect($field, $label, $options=null, $attr=array('class' => 'form-control input-sm')) {
	   return $this->form->createElement("select", $field, $label, $options, $attr);
    }

    function createText($field, $label=null, $attr=array('class' => 'form-control input-sm')) {
       return $this->form->createElement("text", $field, $label, $attr);
    } 

    function createTextArea($field, $label=null) {
       return $this->form->createElement("textarea", $field, $label, array('class' => 'form-control input-sm'));
    } 
    function createDate($field, $label, $dateOptions=null, $attr=array('class' => 'form-control input-sm', 'style' => 'max-width:33%; display:inline-block;')) {
        return $this->form->createElement("date", $field, $label, $dateOptions, $attr);
    }
    function createCheckbox($field, $label, $options=null, $closer='</label>'){
        $group = array();
        $group[] = $this->form->createElement('static', null, null, '<label>');
        // $html = '<label><input type=\'checkbox\'> '.$label.'</label>';
        $group[] = $this->form->createElement('advcheckbox', $field, null, null, $options);
        $group[] = $this->form->createElement('static', 'checkLabel', null, $label.$closer);
        return $group;
        // return $this->form->createElement('static', null, null, $html);
    }
    function createPassword($field, $label=null, $attr=array('class' => 'form-control input-sm')){
        return $this->form->createElement('password', $field, $label, $attr);
    }

    /**
     * Displays the form
     *
     * @return void
     * @access public
     */
    function display()
    {
        if(!$this->form->isFrozen()) {
            // hidden values
              $this->addHidden('test_name', $this->name);
              $this->addHidden('subtest', $this->page);
              $this->addHidden('identifier', $this->identifier);

           // $this->form->addElement('hidden', 'test_name', $this->name);
           // $this->form->addElement('hidden', 'subtest', $this->page);
           // $this->form->addElement('hidden', 'identifier', $this->identifier);
         }

        // get the defaults
        $localDefaults = $this->_getDefaults();
        if (PEAR::isError($localDefaults)) {
            return PEAR::raiseError("NDB_Form::display(): ".$localDefaults->getMessage());
        }
        if(!is_array($localDefaults)) { $localDefaults = array(); }
        // set the quickform object defaults
        $this->_setDefaults(array_merge($this->defaults, $localDefaults));

            // trim all values
        $this->form->applyFilter('__ALL__', 'trim');

        // display the HTML_Quickform object
        $smarty = new Smarty_neurodb($this->name);
        $renderer = new HTML_QuickForm_Renderer_ArraySmarty($smarty);
        $this->form->accept($renderer);
        $smarty->ModuleName = $this->name;

        $smarty->assign('form', $renderer->toArray());
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("form_$this->template.tpl");
        return $html;
        //return $this->form->toHTML();
    }


    /**
     * Returns the form-specific defaults
     *
     * @note   overloaded function
     * @return array
     * @access private
     */
    function _getDefaults()
    {
        return $this->defaults;
    }

    /**
     * Sets the form-specific defaults for this page
     *
     * @return array The defaults
     */
    function _setDefaults($defaults = array()) {
        $this->defaults = $defaults;
        $this->form->setDefaults($defaults);
        return $defaults;
    }
}
?>
