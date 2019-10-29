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
class NDB_BVL_Instrument_Instrument_Preview
    extends \Loris\Behavioural\NDB_BVL_Instrument_LINST
{
    /**
     * Loads a LINST file and rules from the data posted to it in order
     * to preview how Loris would render that file.
     *
     * @param string|null $commentID The CommentID being loaded
     * @param string|null $page      The page being loaded
     *
     * @return void
     */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->commentID = $commentID;
        $this->page      = $page;

        $this->form = new \HTML_Quickform('test_form');

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
     * @return bool
     */
    function save(): bool
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
        return false;
    }

    /**
     * Overwrites the save function to not save data since this is only a preview.
     *
     * @param array $values Unused, but required so that function as same signature
     *                      as base class
     *
     * @return void
     */
    function _save(array $values): void
    {
        return;
    }

    /**
     * Does not allow saving of flags in preview mode.
     *
     * @param string $status ignored
     *
     * @return void
     */
    function _setDataEntryCompletionStatus(string $status): void
    {
        return;
    }
}

