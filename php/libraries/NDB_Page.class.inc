<?php
/**
 * This file contains the NDB_Page base class. This file should
 * contain ALL of the references to HTML_QuickForm (or any library
 * used to render HTML.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Base class that contains a number of wrapper functions for adding
 * elements to the current page.
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Page
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
     *
     * @var LorisForm
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

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return none
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        $this->form       = new LorisForm($formname);
        $this->name       = $name;
        $this->page       = $page;
        $this->identifier = $identifier;
        $this->commentID  = $commentID;
        $this->defaults   = array();
    }


    /**
     * Wrapper to create a file element and add it to the current page
     *
     * @param string $name    The name of this file element
     * @param string $label   The label to attach to this element
     * @param array  $options Options to pass to the form for this
     *                        file chooser.
     *
     * @return none
     */
    function addFile($name, $label, $options=array())
    {
        $this->form->addElement(
            'file',
            $name,
            $label,
            array_merge(array('class' => 'fileUpload'), $options)
        );
    }

    /**
     * Wrapper to create a header
     *
     * @param string $header The text to put in the header
     *
     * @return none
     */
    function addHeader($header)
    {
        $this->form->addElement('header', null, $header);
    }

    /**
     * Wrapper to create a select drop-down list
     *
     * @param string $name     The field name of this select dropdown
     * @param string $label    The label to attach to this dropdown
     * @param array  $options  Options to pass to QuickForm for this
     *                         select
     * @param array  $optional Optional extra HTML attributes to add
     *                         to the select
     *
     * @return none
     */
    function addSelect($name, $label, $options, $optional=array())
    {
        $optional = array_merge(
            array('class' => 'form-control input-sm'),
            $optional
        );
        $this->form->addElement('select', $name, $label, $options, $optional);
    }

    /**
     * Wrapper to create a static label to the current page
     *
     * @param string $label The text to add to the label.
     *
     * @return none
     */
    function addLabel($label)
    {
        $this->form->addElement('static', null, $label);
    }

    /**
     * Wrapper to create a static score column
     *
     * @param string $name  The name of the score column
     * @param string $label Label to attach to the score
     *
     * @return none
     */
    function addScoreColumn($name, $label)
    {
        $this->form->addElement('static', $name, $label);
    }


    /**
     * Adds a text element to the current page with no accompanying
     * not answered option
     *
     * @param string $field   The name of the text element to add
     * @param string $label   Label to attach to the text element
     * @param array  $options QuickForm options to pass to addElement
     *
     * @return none
     */
    function addBasicText($field, $label, $options=array())
    {
        $options = array_merge(array('class' => 'form-control input-sm'), $options);
        $this->form->addElement('text', $field, $label, $options);
    }

    /**
     * Adds a text area to the current page with no accompanying not answered
     * option.
     *
     * @param string $field          The name of the text area to add
     * @param string $label          Label to attach to the text area field
     * @param array  $specifications Extra HTML options to add to the textarea
     *
     * @return none
     */
    function addBasicTextArea(
        $field,
        $label,
        $specifications=array()
    ) {
        $specifications = array_merge(
            array('class' => 'form-control input-sm'),
            $specifications
        );
        $this->form->addElement('textarea', $field, $label, $specifications);
    }

    /**
     * Adds a date field (without an accompanying not answered option) to the
     * current page.
     *
     * @param string $field   The name of the date field
     * @param string $label   Label to attach to the date field in the frontend
     * @param array  $options Options to pass to HTML_QuickForm
     * @param array  $attr    Extra HTML attributes to add to the date group.
     *
     * @return none
     */
    function addBasicDate(
        $field,
        $label,
        $options=array(),
        $attr=array(
               'class' => 'form-control input-sm',
               'style' => 'max-width:33%; display:inline-block;',
              )
    ) {
        $this->form->addElement('date', $field, $label, $options, $attr);
    }

    /**
     * Wrapper to create a checkbox
     *
     * @param string $name     The field name of this checkbox
     * @param string $label    The label to attach to this checkbox
     * @param array  $options  Options to pass to QuickForm for this
     *                         checkbox
     * @param array  $optional Optional extra HTML attributes to add
     *                         to the checkbox
     *
     * @return none
     */
    function addCheckbox($name, $label, $options, $optional=array())
    {
        $optional = array_merge(
            array('class' => 'form-control input-sm'),
            $optional
        );
        $this->form->addElement('advcheckbox', $name, $label, $options, $optional);
    }

    /**
     * Adds a hidden element to the current page. Note if the hidden element
     * needs a value it should be added to the defaults.
     *
     * @param string $name  The name of the hidden element to add
     * @param array  $value The value of the hidden element to add
     *
     * @return none
     */
    function addHidden($name, $value=null)
    {
        $this->form->addElement('hidden', $name, $value);
    }

    /**
     * Adds a group with a TextArea and a 'not_answered' option to the current
     * page.
     *
     * @param string $field                The name of the text area to add
     * @param string $label                The label to attach to this field
     * @param array  $not_answered_options List of options to use in the "_status"
     *                                     dropdown.
     *
     * @return none
     */
    function addTextAreaGroup(
        $field,
        $label,
        $not_answered_options=array(
                               ''             => '',
                               'not_answered' => 'Not Answered',
                              )
    ) {
        $group   = array();
        $group[] = $this->createTextArea($field, '');
        $group[] = $this->createSelect(
            $field . '_status',
            '',
            $not_answered_options,
            array('class' => 'form-control input-sm not-answered')
        );

        $this->addGroup($group, $field . '_group', $label, null, false);

    }

    /**
     * Creates a password element and adds it to the current form.
     *
     * @param string $field The name of the password field to add
     * @param string $label The label to attach to this element
     * @param array  $attr  List of extra HTML attributes to add to the element
     *
     * @return none
     */
    function addPassword(
        $field,
        $label=null,
        $attr=array('class' => 'form-control input-sm')
    ) {
        $this->form->addElement('password', $field, $label, $attr);
    }

    /**
     * Adds a QuickForm rule to an element on the page.
     *
     * @param string $element The name of the element to have the rule
     * @param string $message The message to show on failure
     * @param string $type    The type of rule to add
     * @param string $format  See QuickForm documentation.
     *
     * @return none
     */
    function addRule($element, $message, $type, $format=null)
    {
        $this->form->addRule($element, $message, $type, $format);
    }

    /**
     * Register a rule that applies to a group.
     *
     * @param string $group  The name of the group with the rule attached
     * @param mixed  $arg1   The rule to add in QuickForm syntax
     * @param string $type   The type of rule to add (ie 'required', 'compare')
     *                       See QuickForm documentation for details.
     * @param string $format The group format. (See QuickForm documentation)
     *
     * @return none
     */
    function addGroupRule($group, $arg1, $type='', $format=null)
    {
        $this->form->addGroupRule($group, $arg1, $type, $format);
    }

    /**
     * Adds a group (array of elements created by $this->create*
     * wrappers) to the current page.
     *
     * @param array  $elements   The group of elements to add to the page
     * @param string $name       The name to give this group
     * @param string $label      A label to attach to the group
     * @param string $separator  The separator to use between group elements
     * @param string $appendName ????
     *
     * @return none
     */
    function addGroup($elements, $name, $label, $separator, $appendName=null)
    {
        $this->form->addGroup($elements, $name, $label, $separator, $appendName);
    }

    /**
     * Creates a QuickForm Select dropdown but does not add it to the page
     *
     * @param string $field   The field name for this select
     * @param string $label   The label to attach to the element
     * @param array  $options Extra options to pass to QuickForm
     * @param array  $attr    Extra HTML attributes to add to the element
     *
     * @return HTML_QuickForm select element
     */
    function createSelect(
        $field,
        $label,
        $options=null,
        $attr=array('class' => 'form-control input-sm')
    ) {
        return $this->form->createElement("select", $field, $label, $options, $attr);
    }

    /**
     * Creates a QuickForm text element but does not add it to the form
     *
     * @param string $field The field name for this text element
     * @param string $label The label to attach to the element
     * @param array  $attr  Extra HTML attributes to add to the element
     *
     * @return HTML_QuickForm Text element
     */
    function createText(
        $field,
        $label=null,
        $attr=array('class' => 'form-control input-sm')
    ) {
        return $this->form->createElement("text", $field, $label, $attr);
    }

    /**
     * Creates a QuickForm TextArea element but does not add it to the form.
     *
     * @param string $field The field name for the TextArea
     * @param string $label The label to attach to this TextArea
     *
     * @return HTML_QuickForm textarea element
     */
    function createTextArea($field, $label=null)
    {
        return $this->form->createElement(
            "textarea",
            $field,
            $label,
            array('class' => 'form-control input-sm')
        );
    }

    /**
     * Creates a QuickForm date element but does not add it to the form.
     *
     * @param string $field       The fieldname for this date field
     * @param string $label       The label to attach to this date
     * @param array  $dateOptions List of options to pass to QuickForm
     * @param array  $attr        List of HTML attributes to add to the date
     *                            group.
     *
     * @return HTML_QuickForm date element
     */
    function createDate(
        $field,
        $label,
        $dateOptions=null,
        $attr=array(
               'class' => 'form-control input-sm',
               'style' => 'max-width:33%; display:inline-block;',
              )
    ) {
        return $this->form->createElement(
            "date",
            $field,
            $label,
            $dateOptions,
            $attr
        );
    }

    /**
     * Creates an HTML checkbox but does not add it to the form.
     *
     * @param string $field   The fieldname for this checkbox
     * @param string $label   The label to attach to this checkbox
     * @param string $options Options to pass to HTML_QuickForm
     * @param string $closer  ?????
     *
     * @return QuickForm_Element representing checkbox
     */
    function createCheckbox($field, $label, $options=null, $closer='</label>')
    {
        return $this->form->createElement(
            "advcheckbox",
            $field,
            $label,
            $options,
            array()
        );
    }

    /**
     * Creates a password form element but does not add it to the page
     *
     * @param string $field The fieldname for the password box
     * @param string $label The label to attach to the form element
     * @param array  $attr  List of HTML attributes to add to the element
     *
     * @return QuickForm_Element Form element
     */
    function createPassword(
        $field,
        $label=null,
        $attr=array('class' => 'form-control input-sm')
    ) {
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
        if (!$this->form->isFrozen()) {
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
        if (!is_array($localDefaults)) {
            $localDefaults = array();
        }
        // set the quickform object defaults
        $this->_setDefaults(array_merge($this->defaults, $localDefaults));

            // trim all values
        $this->form->applyFilter('__ALL__', 'trim');

        // display the HTML_Quickform object
        $smarty = new Smarty_neurodb($this->name);

        $smarty->ModuleName = $this->name;

        $smarty->assign('form', $this->form->toArray());
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("form_$this->template.tpl");
        return $html;
        //return $this->form->toHTML();
    }


    /**
     * Returns the form-specific defaults
     *
     * @return array
     */
    function _getDefaults()
    {
        return $this->defaults;
    }

    /**
     * Sets the form-specific defaults for this page
     *
     * @param array $defaults The defaults to set form elements to
     *
     * @return array The defaults
     */
    function _setDefaults($defaults = array())
    {
        $this->defaults = $defaults;
        $this->form->setDefaults($defaults);
        return $defaults;
    }

    /**
     * Returns an ordered list of javascript dependencies that this page depends
     * on.  These will get loaded into the template in order, so that
     * interdependent files can be included in the correct order.
     *
     * @return array of strings with URLs to retrieve JS resources
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $www     = $config->getSetting('www');
        $baseurl = $www['url'];

        $paths = $config->getSetting("paths");

        $TestName = $this->name;

        $files = array(
                  $baseurl . '/js/jquery/jquery-1.11.0.min.js',
                  $baseurl . '/js/helpHandler.js',
                  $baseurl . '/js/modernizr.min.js',
                  $baseurl . '/js/react-with-addons-0.13.3.min.js',
                  $baseurl . '/js/jquery/jquery-ui-1.10.4.custom.min.js',
                  $baseurl . '/js/jquery.dynamictable.js',
                  $baseurl . '/js/jquery.fileupload.js',
                  $baseurl . '/js/polyfiller.js',
                  $baseurl . '/bootstrap/js/bootstrap.min.js',
                  $baseurl . '/js/components/react.breadcrumb.js',
                  $baseurl . '/js/components/Form.js',
                 );
        return $files;
    }


    /**
     * Returns an ordered list of CSS dependencies that this page depends
     * on.  These will get loaded into the template in order, so that
     * interdependent files can be included in the correct order.
     *
     * @return array of strings with URLs to retrieve CSS resources
     */
    function getCSSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();

        $www     = $config->getSetting('www');
        $baseurl = $www['url'];

        $paths = $config->getSetting("paths");

        $TestName = $this->name;

        $files = array(
                  $baseurl . "/bootstrap/css/bootstrap.min.css",
                  $baseurl . "/bootstrap/css/custom-css.css",
                 );

        if (file_exists($paths['base'] . "modules/$TestName/css/$TestName.css")) {
            error_log(
                "WARNING: Relying on $TestName.css getting automatically loaded will"
                . " soon be removed. "
                . "Override getCSSDependencies() instead"
            );

            $files[] = $baseurl . "/$TestName/css/$TestName.css";
        }

        return $files;
    }

}
?>
