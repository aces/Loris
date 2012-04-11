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
    }
    function save() {
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
