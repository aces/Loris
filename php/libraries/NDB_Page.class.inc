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
use \Psr\Http\Server\RequestHandlerInterface;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

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
class NDB_Page implements RequestHandlerInterface
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
     * @var \LorisForm
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
     * A list of arrays to be used as field options on
     * front-end forms and menu filters.
     */
    var $fieldOptions = array();

    /**
     * Date Options used as default
     */
    var $dateOptions = array();

    /**
     * The format that the page content should be returned in. This is generally
     * the value of the `?format=` GET parameter from the request, and is usually
     * either 'json' or empty (for the default return value of HTML format).
     */
    protected $format = '';

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
     * FIXME: $formname is never used. - Alexandra Livadas
     *
     * @param Module $module     The test name being accessed
     * @param string $page       The subtest being accessed (may be an empty string)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
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

        $this->form       = new LorisForm();
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
     * @param array  $attribs Options to pass to the form for this
     *                        file chooser.
     *
     * @return void
     */
    function addFile($name, $label, $attribs=array())
    {
        $this->form->addElement(
            'file',
            $name,
            $label,
            array(),
            array_merge(array('class' => 'fileUpload'), $attribs)
        );
    }

    /**
     * Wrapper to create a header
     *
     * @param string $header The text to put in the header
     *
     * @return void
     */
    function addHeader($header)
    {
        $this->form->addElement('header', null, $header);
    }

    /**
     * Wrapper to create a select drop-down list
     *
     * @param string $name    The field name of this select dropdown
     * @param string $label   The label to attach to this dropdown
     * @param array  $options Options to pass to QuickForm for this
     *                        select
     * @param array  $attribs Optional extra HTML attributes to add
     *                        to the select
     *
     * @return void
     */
    function addSelect($name, $label, $options, $attribs=array())
    {
        $attribs = array_merge(
            array('class' => 'form-control input-sm'),
            $attribs
        );
        $this->form->addElement('select', $name, $label, $options, $attribs);
    }

    /**
     * Wrapper to create a static label to the current page
     *
     * @param string $label The text to add to the label.
     *
     * @return void
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
     * @return void
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
     * @param array  $attribs QuickForm attributes to pass to addElement
     *
     * @return void
     */
    function addBasicText($field, $label, $attribs=array())
    {
        $attribs = array_merge(array('class' => 'form-control input-sm'), $attribs);
        $this->form->addElement('text', $field, $label, array(), $attribs);
    }

    /**
     * Adds a text area to the current page with no accompanying not answered
     * option.
     *
     * @param string $field   The name of the text area to add
     * @param string $label   Label to attach to the text area field
     * @param array  $attribs Extra HTML options to add to the textarea
     *
     * @return void
     */
    function addBasicTextArea(
        $field,
        $label,
        $attribs=array()
    ) {
        $attribs = array_merge(
            array('class' => 'form-control input-sm'),
            $attribs
        );
        $this->form->addElement('textarea', $field, $label, array(), $attribs);
    }

    /**
     * Adds a date field (without an accompanying not answered option) to the
     * current page.
     *
     * @param string $field   The name of the date field
     * @param string $label   Label to attach to the date field in the frontend
     * @param array  $options Options to pass to HTML_QuickForm
     * @param array  $attribs Extra HTML attributes to add to the date group.
     *
     * @return void
     *
     * @note The 'style' information was removed because it is not an attribute
     *       added to an element in the LorisForm library. -Alexandra Livadas
     */
    function addBasicDate(
        $field,
        $label,
        $options=array(),
        $attribs=array(
            'class' => 'form-control input-sm',
            'style' => 'max-width:33%; display:inline-block;',
        )
    ) {
        if ($options === array() && !empty($this->dateOptions)) {
            $options = $this->dateOptions;
        }
        $this->form->addElement('date', $field, $label, $options, $attribs);
    }

    /**
     * Wrapper to create a checkbox
     *
     * @param string $name    The field name of this checkbox
     * @param string $label   The label to attach to this checkbox
     * @param array  $options Options to pass to QuickForm for this
     *                        checkbox
     * @param array  $attribs Optional extra HTML attributes to add
     *                        to the checkbox
     *
     * @return void
     *
     * @note The optional array is never actually put into the element
     *       because LorisForm::addHeader does not take it as a parameter.
     *       The 'class' attribute is now added to the $options array instead
     *       whereas before it was in the $optional array.
     *        - Alexandra Livadas
     */
    function addCheckbox($name, $label, $options, $attribs=array())
    {
        $attribs = array_merge(
            array('class' => 'form-control input-sm'),
            $attribs
        );
        $this->form->addElement('advcheckbox', $name, $label, $options, $attribs);
    }

    /**
     * Wrapper to create a radio button
     * FIXME: Should this be "addRadioGroup"? There is no method
     *        that just adds 1 radio element. - Alexandra Livadas
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
     * @return void
     */
    function addRadio($name, $groupLabel, $radios, $options=array())
    {
        $radGroup = array();
        foreach ($radios as $radElement) {
            $radGroup[] = $this->createRadio(
                $name,
                $radElement['label'],
                $options,
                array(
                    'class' => 'form-control input-sm',
                    'value' => $radElement['value'],
                )
            );
        }
        $this->addGroup($radGroup, $name . '_group', $groupLabel, null, false);
    }

    /**
     * Adds a hidden element to the current page. Note if the hidden element
     * needs a value it should be added to the defaults.
     *
     * @param string $name    The name of the hidden element to add
     * @param array  $value   The value of the hidden element to add
     * @param array  $attribs Additional html attributes for element
     *
     * @return void
     */
    function addHidden($name, $value=null, $attribs=array())
    {
        $this->form->addElement('hidden', $name, $value, array(), $attribs);
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
     * @return void
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
     * @param string $field   The name of the password field to add
     * @param string $label   The label to attach to this element
     * @param array  $attribs List of extra HTML attributes to add to the element
     *
     * @return void
     */
    function addPassword(
        $field,
        $label=null,
        $attribs=array('class' => 'form-control input-sm')
    ) {
        $this->form->addElement('password', $field, $label, array(), $attribs);
    }

    /**
     * Adds a QuickForm rule to an element on the page.
     *
     * @param string $element The name of the element to have the rule
     * @param string $message The message to show on failure
     * @param string $type    The type of rule to add
     * @param string $format  See QuickForm documentation.
     *
     * @return void
     *
     * @note The fourth parameter ($format) was removed because
     *       LorisForm::addRule does not have this fourth parameter. It is
     *       still included in the function declaration because this function
     *       may be called with four parameters elsewhere in the codebase!
     *       - Alexandra Livadas
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
     * @return void
     */
    function addGroupRule($group, $arg1, $type='', $format=null)
    {
        $this->form->addGroupRule($group, $arg1, $type);
    }

    /**
     * Adds a group (array of elements created by $this->create*
     * wrappers) to the current page.
     *
     * @param array  $elements  The group of elements to add to the page
     * @param string $name      The name to give this group
     * @param string $label     A label to attach to the group
     * @param string $delimiter The separator to use between group elements
     * @param string $options   An optional array to include prefix_wrapper and
     *                          postfix_wrapper strings - html that will be
     *                          placed before and after the group html
     *
     * @return void
     *
     * @note The names of the last two parameters were changed to match
     *       the parameters of LorisForm::addGroup and make their purposes
     *       more clear - Alexandra Livadas
     */
    function addGroup($elements, $name, $label, $delimiter, $options=null)
    {
        $this->form->addGroup($elements, $name, $label, $delimiter, $options);
    }

    /**
     * Creates a QuickForm Select dropdown but does not add it to the page
     *
     * @param string $field   The field name for this select
     * @param string $label   The label to attach to the element
     * @param array  $options Extra options to pass to QuickForm
     * @param array  $attr    Extra HTML attributes to add to the element
     *
     * @return array representing select element
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
     * FIXME: LorisForm::createElement does not use the label parameter when
     *        the element type is "static". Also, the $labelString paramter here
     *        has been placed as the fourth parameter which is actually the $options
     *        array in the createElement function! - Alexandra Livadas
     *
     * @param string $labelString The label to attach to the element
     *
     * @return array representing label element
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
     * @return array representing text element
     */
    function createText(
        $field,
        $label=null,
        $attribs=array()
    ) {
        $attr =array_merge($attribs, array('class' => 'form-control input-sm'));
        return $this->form->createElement("text", $field, $label, null, $attr);
    }

    /**
     * Creates a QuickForm TextArea element but does not add it to the form.
     *
     * @param string $field The field name for the TextArea
     * @param string $label The label to attach to this TextArea
     *
     * @return array representing textarea element
     */
    function createTextArea($field, $label=null)
    {
        return $this->form->createElement(
            "textarea",
            $field,
            $label,
            null,
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
     * @return array representing date element
     *
     * @note The 'style' information was removed because it is not an attribute
     *       added to an element in the LorisForm library. -Alexandra Livadas
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
     * FIXME: $closer is never used or explained. - Alexandra Livadas
     *
     * @param string $field   The fieldname for this checkbox
     * @param string $label   The label to attach to this checkbox
     * @param string $options Options to pass to HTML_QuickForm
     * @param string $closer  ?????
     *
     * @return array representing checkbox
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
     * @param array  $attribs An array of extra HTML attributes to
     *                        add to the element.
     *
     * @return array representing radio button
     */
    function createRadio($field, $label, $options=null, $attribs=null)
    {
        return $this->form->createElement(
            "radio",
            $field,
            $label,
            $options,
            $attribs
        );
    }

    /**
     * Creates a password form element but does not add it to the page
     *
     * @param string $field The fieldname for the password box
     * @param string $label The label to attach to the form element
     * @param array  $attr  List of HTML attributes to add to the element
     *
     * @return array representing form element
     */
    function createPassword(
        $field,
        $label=null,
        $attr=array('class' => 'form-control input-sm')
    ) {
        return $this->form->createElement('password', $field, $label, null, $attr);
    }

    /**
     * An NDB_Page can act as both a middleware, or a handler, depending on the
     * context. When treated as a middleware, the page is responsible for setting
     * up any middleware required to access the page. By default, this will
     * implement the page decoration middlewares which is responsible for adding
     * the LORIS menu's/headers/footers/etc.
     * This can be overridden by modules who don't want this behaviour (such
     * as API endpoints).
     *
     * @param ServerRequestInterface  $request The PSR7 request being processed.
     * @param RequestHandlerInterface $handler The handler to handle the request
     *                                         after processing the middleware.
     *
     * @return ResponseInterface the PSR15 response that was generated by the
     * middleware
     */
    public function process(
        ServerRequestInterface $request,
        RequestHandlerInterface $handler
    ) : ResponseInterface {
        $user = $request->getAttribute("user");
        if ($this->_hasAccess($user ?? new AnonymousUser()) !== true) {
            return (new \LORIS\Middleware\PageDecorationMiddleware($user))
                ->process(
                    $request,
                    new \LORIS\Http\StringStream("Permission Denied")
                )->withStatus(403);
        }

        // The NDB_Page object itself is sometimes required by middleware,
        // but since the PSR15 Middleware interface is fixed, it needs to be
        // carried along with the request object. We use a pageclass attribute
        // here so that middleware that needs it is able to access it.
        //
        // This is currently required by the page decoration middleware, because
        // of the call to getControlPanel which is used in the main.tpl template,
        // but may eventually be removed.
        $request = $request->withAttribute("pageclass", $this);

        // FIXME: For historical compatibility with NDB_Menu_Filter.
        // Format should be deprecated and getting the page in different formats
        // should be a different endpoint or use HTTP content negotiation headers.
        $get = $request->getQueryParams();
        if (isset($get['format'])) {
            $this->format = $get['format'];
            return $handler->handle($request)
                ->withHeader("Content-Type", "application/json");
        }
        return (new \LORIS\Middleware\PageDecorationMiddleware($user))
            ->process($request, $handler)
            ->withHeader("Content-Type", "text/html");
    }

    /**
     * An NDB_Page can act as both a middleware, or a handler, depending on the
     * context. When treated as a handler, an NDB_Page calls display() and
     * converts the output to a PSR7 stream.
     *
     * @param ServerRequestInterface $request The PSR15 Request being handled
     *
     * @return ResponseInterface The PSR15 response for the page.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->setup();
        return (new \LORIS\Http\Response())
            ->withBody(new \LORIS\Http\StringStream($this->display() ?? ""));
    }

    /**
     * Displays the form
     *
     * @return string of the content to be inserted into the template
     */
    function display()
    {
        switch($this->format) {
        case 'json':
            return $this->toJSON();
        }
        if ($this->skipTemplate) {
            return "";
        }
        if (!$this->form->isFrozen()) {
            // hidden values
              $this->addHidden('test_name', $this->name);
              $this->addHidden('subtest', $this->page);
              $this->addHidden('identifier', $this->identifier);
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
                    // $baseurl . '/js/react/react-with-addons' . $min . '.js',
                    // $baseurl . '/js/react/react-dom' . $min . '.js',
            $baseurl . ($min === '' ?
                      '/vendor/js/react/react.development.js' :
                      '/vendor/js/react/react.production' . $min . '.js'),
            $baseurl . ($min === '' ?
                      '/vendor/js/react/react-dom.development.js' :
                      '/vendor/js/react/react-dom.production' . $min . '.js'),

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
     * @return void (but may have side-effects)
     */
    function setup()
    {
    }

    /**
     * Returns true if user has access to this page.
     *
     * You do not need to overload hasAccess() if there are no access restrictions.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        $label    = ucwords(str_replace('_', ' ', $this->name));
        $sublabel = ucwords(str_replace('_', ' ', $this->page));

        if ($label == $sublabel) {
            return new \LORIS\BreadcrumbTrail(
                new \LORIS\Breadcrumb($label, "/$this->name")
            );
        }

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb($label, "/$this->name"),
            new \LORIS\Breadcrumb($sublabel, "/$this->name/$this->page")
        );
    }
}

