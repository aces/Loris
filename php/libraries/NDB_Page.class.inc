<?php

require_once "PEAR.php";
require_once "HTML/QuickForm.php";
include_once ('HTML/QuickForm/Renderer/Default.php');

class NDB_Page extends PEAR
{
    function _setupPage($name, $page, $identifier, $commentID, $formname) {
        $this->form = new HTML_QuickForm($formname);
        $this->name = $name;
        $this->page = $page;
        $this->identifier = $identifier;
        $this->commentID = $commentID;
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

    function addSelect($name, $label, $options=array()) {
        $this->form->addElement('select', $name, $label, $options);
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
        $this->form->addElement('text', $field, $label, $options);
    }

    function addBasicTextArea($field, $label, $specifications=array()) {
        $this->form->addElement('textarea', $field, $label, $specifications);
    }

    function addBasicDate($field, $label, $options=array()) {
        $this->form->addElement('date', $field, $label, $options);
    }
 
    function addHidden($label, $attributes) {
        $this->form->addElement('hidden', $label, $attributes);
    }


}
?>
