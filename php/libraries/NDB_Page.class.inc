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

    function addBasicText($field, $label) {
        $this->form->addElement('text', $field, $label);
    }
 
    function addHidden($label, $attributes) {
        $this->form->addElement('hidden', $label, $attributes);
    }


}
?>
