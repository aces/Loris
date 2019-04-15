<?php
/**
 * This file contains the NDB_BVL_Instrument_TEMPLATE
 * class
 *
 * PHP Version 5
 *
 * @category Instrument
 * @package  TEMPLATE
 * @author   Stella Lee <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/loris/
 */

/**
 * Creates the form elements for the Boston_Diagnostic_Aphasia_Exam instrument
 *
 * @category Instrument
 * @package  TEMPLATE
 * @author   Stella Lee <slee.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/loris/
 */
class NDB_BVL_Instrument_TEST_NAME extends NDB_BVL_Instrument
{

    /**
     * Sets up basic data such as the HTML_Quickform object, database references
     *
     * @param string $commentID the CommentID identifying the data to load
     * @param string $page      if a multipage form, the page to show
     *
     * @return void
     * @access public
     */
    function setup(?string $commentID = null, ?string $page = null): void
    {
        $this->formType ="XIN";
        $this->form     = new LorisForm('test_form');
        $this->page     = $page;            // page label (number or
        // string - used by
        // user-defined child classes)

        // set the object properties
        // Corresponds to the Test_name column in test_names table
        $this->testName = "<TEST_NAME>";
        // name of database table corresponding to instrument
        $this->table = '<TEST_NAME>';
        // data keyed by commentID
        $this->commentID = $commentID;

        //The array of dates/timestamps to convert to database dates/timestamps
        //Any HTML_Quickform date elements must be listed here
        $this->dateTimeFields =array("Date_taken");

        //The array of selects with multiple answers allowed
        //Any HTML_Quickform multiple selects must be listed here
        $this->_selectMultipleElements = array();

        // required fields for data entry completion status
        $this->_requiredElements = array(
                                    'Examiner',
                                    '<FIRST QUESTION OF EACH PAGE>',
                                   );

        // setup the form
        $this->_setupForm();

    }

    /**
     * Builds the HTML_Quickform object into a paged form
     *
     * @return void
     * @access private
     */
    function _setupForm()
    {
        if (preg_match("/<TEST_NAME>(_page[0-9]+)/", $this->page, $matches)) {
            $this->_page($matches[1]);
        } else {
            $this->_main();
        }
        // Defines the call back function for HTML Quickform to use in validation
        $this->form->addFormRule(array(&$this, 'XINValidate'));
    }

    /**
     * Generates the main page of the form.
     *
     * @return void
     * @access private
     */
    function _main()
    {
        // display test name
        $this->addHeader("<INSTRUMENT TITLE>");

        // automatically adds examiner & date of administration
        $this->_addMetadataFields();

        // If the instrument is not paged,
        // remove the switch from the _setupForm method
        // and add all the form Elements in this function
    }

    /**
     * Page 1
     *
     * @return void
     **/
    function _page1()
    {
        //add form Elements here as needed.
        //continue onto further pages, if needed.
    }

    /**
     * Page 2
     *
     * @return void
     **/
    function _page2()
    {
        //add form Elements here as needed.
        //continue onto further pages, if needed.
    }

}
?>
