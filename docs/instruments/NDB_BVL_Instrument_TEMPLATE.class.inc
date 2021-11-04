<?php
/**
 * This file contains the NDB_BVL_Instrument_TEMPLATE
 * class
 *
 * PHP Version 5
 *
 * @category Instrument
 * @package  TEMPLATE
 * @author   Author Name
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/loris/
 */

/**
 * Creates the form elements for the Boston_Diagnostic_Aphasia_Exam instrument
 *
 * @category Instrument
 * @package  TEMPLATE
 * @author   Author Name
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/loris/
 */
class NDB_BVL_Instrument_TEST_NAME extends NDB_BVL_Instrument
{
    use \LorisFormDictionaryImpl;


    /**
     * Sets up basic data.
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

        //The array of selects with multiple answers allowed
        $this->selectMultipleElements = array();

        // required fields for data entry completion status
        $this->_requiredElements = array(
                                    'Examiner',
                                    '<FIRST QUESTION OF EACH PAGE>',
                                   );

        // setup the form
        $this->_setupForm();

    }

    /**
     * Builds the object into a paginated form
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
        // Defines the call back function to use in validation
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

    /**
     * {@inheritDoc}
     *
     * @return string|null
     */
    public function getFullName(): ?string
    {
        return "TEMPLATE TEST NAME";
    }

    /**
     * {@inheritDoc}
     *
     * @return array
     */
    function getSubtestList(): array
    {
        $subtest = [
            ['Name'=>'<TEST_NAME>_page1','Description'=>'Subtest One'],
            ['Name'=>'<TEST_NAME>_page2','Description'=>'Subtest Two'],
        ];
        return $subtest;
    }
}
