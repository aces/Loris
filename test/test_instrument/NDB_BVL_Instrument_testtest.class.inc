<?php
/**
 * Creates the form elements for the ABC instrument
 *
 * @category Instrument
 * @author   Gregory Luneau <gluneau.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/LORIS/
 */
class NDB_BVL_Instrument_Testtest extends NDB_BVL_Instrument
{
    use \LegacyInstrumentTrait;

    /**
     * Sets up basic data, such as the LorisForm object, and so on.
     *
     * @param string|null $commentID the CommentID identifying the data to load
     * @param string|null $page      if a multipage form, the page to show
     *
     * @return void

     * @access public
     */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->formType = 'XIN';
        $this->form     = new LorisForm();
        // page label (number or string - used by user-defined child classes)
        $this->page = $page;

        // set the object properties
        $this->testName = 'testtest'; // test_names.Test_name
        // name of database table corresponding to instrument
        $this->table     = 'testtest';
        $this->commentID = $commentID; // data keyed by commentID

        $config = NDB_Config::singleton();

        // setup the form
        $this->_setupForm();
    }

    /**
     * Method to build the LorisForm object into a paged form
     *
     * @return void
     * @access private
     */
    function _setupForm(): void
    {
        //determine page to display
        if (preg_match("/testtest(_page[0-9]+)/", $this->page, $matches)) {
            call_user_method($matches[1], $this);
        } else {
            $this->_main();
        }

        // Defines the call back function for LorisForm
        // to use when validating the form.
        // $this->form->addFormRule(array(&$this, 'XINValidate'));
    }

    /**
     * Generates the main page of the form.
     *
     * @return void
     * @access private
     */
    function _main(): void
    {

        $this->form->addElement(
            'header',
            'instrument_title',
            "Test Instrument Title"
        );
        $this->addCheckbox(
            'testCheckbox',
            'Check this checkbox default value is 1',
            ['value' => '1']
        );
        $this->form->addElement(
            "text",
            'testText',
            "text_input",
            ["class" => "encrypt required"]
        );
        $yesNo   = [null=>"", 'yes'=>"Yes", 'no'=>"No"];
        $group   = [];
        $group[] = $this->form->createElement("select", "consent", "", $yesNo);
        $this->XINRegisterRule(
            "consent",
            ["code{@}=={@}"],
            "Required.",
            "consent_group"
        );
        $this->form->addGroup(
            $group,
            "consent_group",
            "Test selecting 'Yes' from the dropdown menu.",
            '',
        );
        unset($group);
    }

    /**
     * Return the HTML for the review section of the survey module
     * By default, this will show every question from the parameter_type
     * table for this instrument, but it can be overridden/customized by
     * a instrument if that isn't the desired behaviour.
     *
     * @return string The HTML to be inserted into the review section of
     *                the final page of the survey module for this instrument.
     */
    function getReview(): string
    {
        return '';
    }
}
