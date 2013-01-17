<?php
require_once "NDB_Form.class.inc";

class NDB_BVL_Instrument_instrument_preview extends NDB_BVL_Instrument
{

    function _hasAccess() 
    {
        return true;
    }

    function NDB_BVL_Instrument_instrument_preview()
    {
        $this->loadInstrumentFile("data:text/plain;base64," . base64_encode($_REQUEST['instrumentdata']), true);
        $this->form->addElement('hidden', 'instrumentdata', $_REQUEST['instrumentdata']);
        if($_REQUEST['instrumentrules']) {
            $this->loadInstrumentRules("data:text/plain;base64," . base64_encode($_REQUEST['instrumentrules']), true);
            $this->form->addElement('hidden', 'instrumentrules', $_REQUEST['instrumentrules']);
        }
        $this->testName = 'instrument_preview';
    }
    function save() {
        if($this->form->validate()) {
            ; // don't save the data
        } else {
            // but display the errors;
            $submittedData = $this->form->getSubmitValues();

            if(count($submittedData)) {
                foreach(array_keys($submittedData) as $key) {
                    $error = $this->form->getElementError($key);
                    if(!empty($error)) {
                        $element = $this->form->getElement($key);
                        if(method_exists($element, "getLabel")){
                            print "<font color='red'>".$element->getLabel().": $error</font><br>\n";
                        }
                    }
                }
            }
        }
        return;
    }

    function _save() {
        return;
    }
    function _setDataEntryCompletionStatus($status) {
        return;
    }
}
?>
