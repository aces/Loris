<?php
/**
 * File contains Instrument Preview class.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Behavioural
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
require_once "NDB_Form.class.inc";

/**
 * Extends NDB_BVL_Instrument class in order to load the LINST file from
 * the request and preview what the page should look like. Forbids anything
 * that modifies data or saves to the database.
 *
 * @category Main
 * @package  Behavioural
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_BVL_Instrument_Instrument_Preview extends NDB_BVL_Instrument
{

    /**
     * Everyone has access to preview since it does nothing
     *
     * @return true
     */
    function _hasAccess()
    {
        return true;
    }

    /**
     * Loads a LINST file and rules from the data posted to it in order
     * to preview how Loris would render that file.
     */
    function NDB_BVL_Instrument_Instrument_Preview()
    {
        $this->loadInstrumentFile(
            "data:text/plain;base64," . base64_encode($_REQUEST['instrumentdata']),
            true
        );
        $this->form->addElement(
            'hidden',
            'instrumentdata',
            $_REQUEST['instrumentdata']
        );

        if ($_REQUEST['instrumentrules']) {
            $rules = $_REQUEST['instrumentrules'];
            $this->loadInstrumentRules(
                "data:text/plain;base64," . base64_encode($rules),
                true
            );
            $this->form->addElement(
                'hidden',
                'instrumentrules',
                $_REQUEST['instrumentrules']
            );
        }
        $this->testName = 'instrument_preview';
    }

    /**
     * Overwrites the save function to not save data since this is only a preview.
     *
     * @return none
     */
    function save()
    {
        if ($this->form->validate()) {
            ; // don't save the data
        } else {
            // but display the errors;
            $submittedData = $this->form->getSubmitValues();

            if (count($submittedData)) {
                foreach (array_keys($submittedData) as $key) {
                    $error = $this->form->getElementError($key);
                    if (!empty($error)) {
                        $element = $this->form->getElement($key);
                        if (method_exists($element, "getLabel")) {
                            print "<font color='red'>".$element->getLabel()
                                .": $error</font><br>\n";
                        }
                    }
                }
            }
        }
        return;
    }

    /**
     * Overwrites the save function to not save data since this is only a preview.
     *
     * @return none
     */
    function _save()
    {
        return;
    }

    /**
     * Does not allow saving of flags in preview mode.
     *
     * @param string $status ignored
     *
     * @return none
     */
    function _setDataEntryCompletionStatus($status)
    {
        return;
    }
}
?>
