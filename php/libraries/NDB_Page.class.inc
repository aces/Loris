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
     * If true, the default display function will not try to load any template.
     * This is intended to be used with, for instance, pages that completely
     * construct the DOM from javascript.
     */
    var $skipTemplate = false;

    /**
     * Template data to be passed to Smarty.
     *
     * FIXME: This should be private to ensure users go through the getter and setter
     * methods to safely update the template data, but all references that directly
     * use tpl_data must be updated first.
     */
    protected $tpl_data = array();

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param Module $module     The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return none
     */
    function __construct(
        \Module $module,
        string $page,
        string $identifier,
        string $commentID,
        string $formname
    ) {
        $this->Module = $module;
        $this->name   = $module->getName(); // for legacy purposes.

        $this->form       = new LorisForm($formname);
        $this->page       = $page;
        $this->identifier = $identifier;
        $this->commentID  = $commentID;
        $this->defaults   = array();

        $this->template = $page;
    }
    /**
     * Safely sets a smarty template variable.
     *
     * @param string $name  The name of the template variable to set
     * @param string $value The (unescaped, unsafe) value to set the template
     *                      variable to
     *
     * @return void
     */
    function setTemplateVar($name, $value)
    {
        $this->tpl_data[$name] = htmlspecialchars($value);
    }

    /**
     * Return the template data for this page.
     *
     * @return array Mapping of variable names to template value.
     */
    function getTemplateData()
    {
        return $this->tpl_data;
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
     * Wrapper to create a radio button
     *
     * @param string $name       The field name of this radio button
     * @param string $groupLabel The label to attach to this group of
     *                           radio buttons
     * @param array  $radios     The array of arrays describing radio
     *                           elements to be added as a group. Ex:
     *                           array('label'=>'Yes','value'=>'Y')
     * @param array  $options    Options to pass to LorisForm for this
     *                           radio button. Do not pass value here.
     *
     * @return none
     */
    function addRadio($name, $groupLabel, $radios, $options=array())
    {
        foreach ($radios as $radElement) {
            $tempOptions = array_merge(
                array(
                 'class' => 'form-control input-sm',
                 'value' => $radElement['value'],
                ),
                $options
            );
            $radGroup[]  = $this->createRadio(
                $name,
                $radElement['label'],
                $tempOptions
            );
        }
        $this->addGroup($radGroup, $name . '_group', $groupLabel, null, false);
    }

    /**
     * Adds a hidden element to the current page. Note if the hidden element
     * needs a value it should be added to the defaults.
     *
     * @param string $name       The name of the hidden element to add
     * @param array  $value      The value of the hidden element to add
     * @param array  $attributes Additional html attributes for element
     *
     * @return none
     */
    function addHidden($name, $value=null, $attributes=array())
    {
        $this->form->addElement('hidden', $name, $value, $attributes);
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
     * Create a QuickForm label element but does not add it to the form
     *
     * @param string $labelString The label to attach to the element
     *
     * @return HTML_QuickForm Label element
     */
    function createLabel(
        $labelString
    ) {
        return $this->form->createElement(
            "static",
            null,
            null,
            $labelString
        );
    }
    /**
     * Creates a QuickForm text element but does not add it to the form
     *
     * @param string $field   The field name for this text element
     * @param string $label   The label to attach to the element
     * @param array  $attribs Extra HTML attributes to add to the element
     *
     * @return HTML_QuickForm Text element
     */
    function createText(
        $field,
        $label=null,
        $attribs=array()
    ) {
        $attr =array_merge($attribs, array('class' => 'form-control input-sm'));
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
     * Creates an HTML radio button but does not add it to the form.
     *
     * @param string $field   The fieldname for this radio button
     * @param string $label   The label to attach to this radio button
     * @param string $options Options to pass to LorisForm
     *
     * @return QuickForm_Element representing radio button
     */
    function createRadio($field, $label, $options=null)
    {
        return $this->form->createElement(
            "radio",
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
     * Display the page to a logged in user.
     *
     * @param \User $user The user having the page displayed to them
     * @param array $get  The GET parameters from the request.
     * @param array $post The POST parameters from the request.
     *
     * @return string The final page content.
     */
    public function displayUserPage(\User $user, array $get, array $post)
    {
        // Create an output buffer which is flushed at the end of this function
        // (from every code path).
        ob_start();
        if ($this->_hasAccess() !== true) {
            throw new Exception("You do not have access to this page.", 403);
        }

        $request = $get + $post;

        $this->setup();

        if (method_exists($this, 'save')) {
            $this->save();
        }

        if ($get['format'] ?? '' === 'json') {
            $this->format = 'json';
            // Flush anything that was printed so we don't get invalid JSON,
            // but print it to the error log first so it's not lost forever.
            error_log(ob_get_contents());
            ob_end_clean();
            return $this->display();
        }

        $factory  = NDB_Factory::singleton();
        $settings = $factory->settings();

        $baseURL = $settings->getBaseURL();
        $config  = NDB_Config::singleton();

        // Set the page template variables
        $tpl_data = array(
                     'test_name' => $this->name,
                     'subtest'   => $this->page,
                    );

        // Basic page outline variables
        $tpl_data += array(
                      'study_title' => $config->getSetting('title'),
                      'baseurl'     => $baseURL,
                      'tabs'        => NDB_Config::getMenuTabs(),
                      'crumbs'      => (new NDB_Breadcrumb())->getBreadcrumb(),
                      'currentyear' => date('Y'),
                      'sandbox'     => ($config->getSetting("sandbox") === '1'),
                     );

        $tpl_data['candID']      = $request['candID'] ?? '';
        $tpl_data['sessionID']   = $request['sessionID'] ?? '';
        $tpl_data['commentID']   = $request['commentID'] ?? '';
        $tpl_data['dynamictabs'] = $request['dynamictabs'] ?? '';

        if (!empty($request['candID'])) {
            $candidate = Candidate::singleton($request['candID']);

            $tpl_data['candidate'] = $candidate->getData();
        }

        // Stuff that probably shouldn't be here, but exists because it was in
        // main.php

        // This seems to only be used in imaging_browser, it can probably be
        // moved to properly use OOP.
        $tpl_data['formaction'] = $this->FormAction ?? '';
        // Doesn't appear to be used
        $tpl_data['lastURL'] = $_SESSION['State']->getLastURL();
        // I don't think anyone uses this. It's not really supported
        $tpl_data['css'] = $config->getSetting('css');

        // This just feels wrong
        if (method_exists($this, 'getControlPanel')) {
            $tpl_data['control_panel'] = $this->getControlPanel();
        }
        if (method_exists($this, 'getFeedbackPanel')
            && $user->hasPermission('bvl_feedback')
        ) {
            $tpl_data['feedback_panel'] = $this->getFeedbackPanel(
                $get['candID'],
                $get['sessionID'] ?? null
            );

            $tpl_data['bvl_feedback'] = NDB_BVL_Feedback::bvlFeedbackPossible(
                $this->page
            );
        }

        // This shouldn't exist. (And if it does, it shouldn't reference
        // mantis..)
        $tpl_data['mantis_url'] = $config->getSetting('mantis_url');

        // We're back in the territory of stuff that belongs here..

        // Variables that get passed along to the LorisHelper javascript object.
        $tpl_data['studyParams'] = array(
                                    'useEDC'      => $config->getSetting('useEDC'),
                                    'useProband'  => $config->getSetting(
                                        'useProband'
                                    ),
                                    'useFamilyID' => $config->getSetting(
                                        'useFamilyID'
                                    ),
                                    'useConsent'  => $config->getSetting(
                                        'ConsentModule'
                                    )['useConsent'],
                                   );
        $tpl_data['jsonParams']  = json_encode(
            array(
             'BaseURL'   => $tpl_data['baseurl'],
             'TestName'  => $tpl_data['test_name'],
             'Subtest'   => $tpl_data['subtest'],
             'CandID'    => $tpl_data['candID'],
             'SessionID' => $tpl_data['sessionID'],
             'CommentID' => $tpl_data['commentID'],
            )
        );

        // User related template variables that used to be in main.php.
        $site_arr = $user->getData('CenterIDs');
        foreach ($site_arr as $key=>$val) {
            $site[$key]        = & Site::singleton($val);
            $isStudySite[$key] = $site[$key]->isStudySite();
        }

        $oneIsStudySite   = in_array("1", $isStudySite);
        $tpl_data['user'] = $user->getData();
        $tpl_data['user']['permissions']          = $user->getPermissions();
        $tpl_data['user']['user_from_study_site'] = $oneIsStudySite;
        $tpl_data['userNumSites']         = count($site_arr);
        $tpl_data['user']['SitesTooltip'] = str_replace(
            ";",
            "<br/>",
            $user->getData('Sites')
        );

        $tpl_data['hasHelpEditPermission'] = $user->hasPermission(
            'context_help'
        );

        // FIXME: This should be array_filter
        $realPerms = array();
        foreach ($user->getPermissions() as $permName => $hasPerm) {
            if ($hasPerm === true) {
                $realPerms[] = $permName;
            }
        }
        $tpl_data['userPerms'] = $realPerms;

        //Display the footer links, as specified in the config file
        $links = $config->getExternalLinks('FooterLink');

        $tpl_data['links'] = array();
        foreach ($links as $label => $url) {
            $WindowName = md5($url);

            $tpl_data['links'][] = array(
                                    'url'        => $url,
                                    'label'      => $label,
                                    'windowName' => $WindowName,
                                   );
        }

        // Finally, the actual content and render it..
        $tpl_data += array(
                      'jsfiles'   => $this->getJSDependencies(),
                      'cssfiles'  => $this->getCSSDependencies(),
                      'workspace' => $this->display(),
                     );

        // Assign the console template variable as the very, very last thing.
        $tpl_data['console'] = htmlspecialchars(ob_get_contents());
        ob_end_clean();

        $smarty = new Smarty_neurodb;
        $smarty->assign($tpl_data);

        // Finish the buffer created at the start of this function. Discard the
        // contents (it was put in the 'console' template variable.)
        return $smarty->fetch('main.tpl');
    }

    /**
     * Displays a page to an anonymous (not logged in) user.
     *
     * @param array $get  The GET parameters from the request.
     * @param array $post The POST parameters from the request.
     *
     * @return string the page content
     */
    public function displayAnonymousPage(array $get, array $post)
    {
        $this->setup();

        $factory  = NDB_Factory::singleton();
        $settings = $factory->settings();

        $baseURL = $settings->getBaseURL();
        $config  = NDB_Config::singleton();

        // Set the page template variables
        $tpl_data = array(
                     'test_name' => $this->name,
                     'subtest'   => $this->page,
                    );

        // Basic page outline variables
        $tpl_data += array(
                      'study_title' => $config->getSetting('title'),
                      'baseurl'     => $baseURL,
                      'currentyear' => date('Y'),
                      'sandbox'     => ($config->getSetting("sandbox") === '1'),
                     );

        // I don't think anyone uses this. It's not really supported
        $tpl_data['css'] = $config->getSetting('css');

        //Display the footer links, as specified in the config file
        $links =$config->getExternalLinks('FooterLink');

        $tpl_data['links'] = array();
        foreach ($links as $label => $url) {
            $WindowName = md5($url);

            $tpl_data['links'][] = array(
                                    'url'        => $url,
                                    'label'      => $label,
                                    'windowName' => $WindowName,
                                   );
        }

        // Finally, the actual content and render it..
        $tpl_data += array(
                      'jsfiles'   => $this->getJSDependencies(),
                      'cssfiles'  => $this->getCSSDependencies(),
                      'workspace' => $this->display(),
                     );

        $smarty = new Smarty_neurodb;
        $smarty->assign($tpl_data);
        return $smarty->fetch('public_layout.tpl');
    }

    /**
     * Displays the form
     *
     * @return a string of the content to be inserted into the template
     */
    function display()
    {
        if ($this->skipTemplate) {
            return "";
        }
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
        $min     = ($config->getSetting("sandbox") === '1') ? '' : '.min';

        // Currently jquery-ui is required for dialogs and datepickers to work.
        // In the future release, dialogs should be replaced with bootstrap dialogs
        // and datepickers only created by modernizr

        $files = array(
                  $baseurl . '/js/jquery/jquery-1.11.0.min.js',
                  $baseurl . '/js/helpHandler.js',
                  $baseurl . '/js/modernizr/modernizr.min.js',
                  // Only load minified file on production, not sandboxes
                  $baseurl . '/js/polyfills.js',
                  $baseurl . '/js/react/react-with-addons' . $min . '.js',
                  $baseurl . '/js/react/react-dom' . $min . '.js',
                  $baseurl . '/js/jquery/jquery-ui-1.10.4.custom.min.js',
                  $baseurl . '/js/jquery.dynamictable.js',
                  $baseurl . '/js/jquery.fileupload.js',
                  $baseurl . '/bootstrap/js/bootstrap.min.js',
                  $baseurl . '/js/components/Breadcrumbs.js',
                  $baseurl . '/vendor/sweetalert/sweetalert' . $min . '.js',
                  $baseurl . "/js/util/queryString.js",
                  $baseurl . '/js/components/Form.js',
                  $baseurl . '/js/components/Markdown.js',
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

        $files = array(
                  $baseurl . "/bootstrap/css/bootstrap.min.css",
                  $baseurl . "/bootstrap/css/custom-css.css",
                  $baseurl . "/js/jquery/datepicker/datepicker.css",
                  $baseurl . '/vendor/sweetalert/sweetalert.css',
                 );
        return $files;
    }

    /**
     * Does any setup required for this page. This is generally overridden
     * by NDB_Page subtypes to add form elements.
     *
     * @return none, but may have side-effects
     */
    function setup()
    {
    }

    /**
     * Returns false if user does not have access to page.
     *
     * Usage: the hasAccess() function in a child class should contain
     * something like:
     *
     *     // create user object
     *     $user =& User::singleton();
     *
     *     return $user->hasPermission('superuser');
     *
     * You do not need to overload hasAccess() if there are no access restrictions
     *
     * @note   overloaded function
     * @return bool
     * @access private
     */
    function _hasAccess()
    {
        return true;
    }
}
?>
