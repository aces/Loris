<?php declare(strict_types=1);

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
class NDB_Page extends \LORIS\Http\Endpoint implements RequestHandlerInterface
{
    use Psr\Log\LoggerAwareTrait;

    /**
     * The name of the test_name being accessed
     */
    var $name;

    /**
     * The name of the page (subtest) being accessed
     */
    public $page;

    /**
     * Reference to the HTML QuickForm
     *
     * @var \LorisForm
     */
    public $form;

    /**
     * The identifier for the item to edit
     * (ie. the CommentID)
     */
    var $identifier;
    var $commentID;

    /**
     * Form defaults
     */
    var $defaults = [];

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
    var $fieldOptions = [];

    public $Module;
    public $template;

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
     *
     * @var array<mixed>
     */
    protected $tpl_data = [];

    /**
     * The default dateOptions to send to LorisForm to render elements
     * on this page. This is usually set by subclasses of NDB_Page which
     * need to modify the options to show on a date (ie. min year, max year,
     * etc.). Default values can be added here, which can be overriden.
     *
     * @var array
     */
    public $dateOptions = [
        'maxYear' => '9999'
    ];

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param \LORIS\LorisInstance $loris      The LORIS instance that the page is
     *                                         serving
     * @param Module               $module     The test name being accessed
     * @param string               $page       The subtest being accessed (may be
     *                                         an empty string)
     * @param string               $identifier The identifier for the data to load
     *                                         on this page
     * @param string               $commentID  The CommentID to load the data for
     */
    function __construct(
        protected \LORIS\LorisInstance $loris,
        \Module $module,
        string $page,
        string $identifier,
        string $commentID
    ) {
        parent::__construct($loris);

        $this->Module = $module;
        $this->name   = $module->getName(); // for legacy purposes.

        $this->form       = new LorisForm();
        $this->page       = $page;
        $this->identifier = $identifier;
        $this->commentID  = $commentID;
        $this->defaults   = [];

        $this->template = $page;

        $loglevel = $loris->getConfiguration()
            ->getLogSettings()
            ->getRequestLogLevel();

        $this->logger = new \LORIS\Log\ErrorLogLogger($loglevel);

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
        $this->tpl_data[$name] = htmlspecialchars(
            strval($value),
            ENT_QUOTES | ENT_SUBSTITUTE | ENT_HTML5,
            'UTF-8',
            false
        );
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
     * @param array  $attribs Attributes to pass to the form for this
     *                        file chooser.
     *
     * @return void
     */
    function addFile($name, $label, $attribs=[])
    {
        $this->form->addElement(
            'file',
            $name,
            $label,
            [],
            array_merge(['class' => 'fileUpload'], $attribs)
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
        $this->form->addElement('header', '', $header);
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
    function addSelect(
        string $name,
        string $label,
        array $options,
        array $attribs=[]
    ) {
        $attribs = array_merge(
            ['class' => 'form-control input-sm'],
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
        $this->form->addElement('static', '', $label);
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
     * @param array  $options QuickForm options to pass to addElement
     * @param array  $attribs QuickForm attributes to pass to addElement
     *
     * @return void
     */
    function addBasicText($field, $label, $options=[], $attribs=[])
    {
        $attribs = array_merge(['class' => 'form-control input-sm'], $attribs);
        $this->form->addElement('text', $field, $label, $options, $attribs);
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
        $attribs=[]
    ) {
        $attribs = array_merge(
            ['class' => 'form-control input-sm'],
            $attribs
        );
        $this->form->addElement('textarea', $field, $label, [], $attribs);
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
        $options=[],
        $attribs=[
            'class' => 'form-control input-sm',
            'style' => 'max-width:33%; display:inline-block;',
        ]
    ) {
        $options = ($options ?? []) + $this->dateOptions;
        $this->form->addElement('date', $field, $label, $options, $attribs);
    }

    /**
     * Wrapper to create a checkbox
     *
     * @param string $name    The field name of this checkbox
     * @param string $label   The label to attach to this checkbox
     * @param array  $attribs Optional extra HTML attributes to add
     *                        to the checkbox
     *
     * @return void
     */
    function addCheckbox($name, $label, $attribs=[])
    {
        $attribs = array_merge(
            ['class' => 'form-control input-sm'],
            $attribs
        );
        $this->form->addElement('advcheckbox', $name, $label, [], $attribs);
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
    function addRadio($name, $groupLabel, $radios, $options=[])
    {
        $radGroup = [];
        foreach ($radios as $radElement) {
            $radGroup[] = $this->createRadio(
                $name,
                $radElement['label'],
                $options,
                [
                    'class' => 'form-control input-sm',
                    'value' => $radElement['value'],
                ]
            );
        }
        $this->addGroup($radGroup, $name . '_group', $groupLabel, '');
    }

    /**
     * Adds a hidden element to the current page. Note if the hidden element
     * needs a value it should be added to the defaults.
     *
     * @param string  $name    The name of the hidden element to add
     * @param ?string $value   The value of the hidden element to add
     * @param array   $attribs Additional html attributes for element
     *
     * @return void
     */
    function addHidden($name, $value=null, $attribs=[])
    {
        $this->form->addElement('hidden', $name, $value, [], $attribs);
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
        $not_answered_options=[
            ''             => '',
            'not_answered' => 'Not Answered',
        ]
    ) {
        $group   = [];
        $group[] = $this->createTextArea($field, '');
        $group[] = $this->createSelect(
            $field . '_status',
            '',
            $not_answered_options,
            ['class' => 'form-control input-sm not-answered']
        );

        $this->addGroup($group, $field . '_group', $label, '');

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
        $attribs=[]
    ) {
        $attribs = array_merge(['class' => 'form-control input-sm'], $attribs);
        $this->form->addElement('password', $field, $label, [], $attribs);
    }

    /**
     * Adds a QuickForm rule to an element on the page.
     *
     * @param string|array $element The name of the element to have the rule
     * @param string       $message The message to show on failure
     * @param string       $type    The type of rule to add
     * @param string       $format  See QuickForm documentation.
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
     * @param ?array $options   An optional array to include prefix_wrapper and
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
     * @param array  $attribs Extra HTML attributes to add to the element
     *
     * @return array representing select element
     */
    function createSelect(
        $field,
        $label,
        $options=null,
        $attribs=['class' => 'form-control input-sm']
    ) {
        return $this->form->createElement(
            "select",
            $field,
            $label,
            $options,
            $attribs
        );
    }

    /**
     * Create a QuickForm label element but does not add it to the form
     *
     * @param string $labelString The label to attach to the element
     *
     * @return array representing label element
     */
    function createLabel($labelString)
    {
        return $this->form->createElement(
            "static",
            '',
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
        $attribs=[]
    ) {
        $attr = array_merge(['class' => 'form-control input-sm'], $attribs);
        return $this->form->createElement("text", $field, $label, [], $attr);
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
            [],
            ['class' => 'form-control input-sm']
        );
    }

    /**
     * Creates a QuickForm date element but does not add it to the form.
     *
     * @param string $field       The fieldname for this date field
     * @param string $label       The label to attach to this date
     * @param array  $dateOptions List of options to pass to QuickForm
     * @param array  $attribs     List of HTML attributes to add to the date
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
        $dateOptions=[],
        $attribs=[
            'class' => 'form-control input-sm',
            'style' => 'max-width:33%; display:inline-block;',
        ]
    ) {
        return $this->form->createElement(
            "date",
            $field,
            $label,
            ($dateOptions ?? []) + $this->dateOptions,
            $attribs
        );
    }

    /**
     * Creates an HTML checkbox but does not add it to the form.
     *
     * @param string $field   The fieldname for this checkbox
     * @param string $label   The label to attach to this checkbox
     * @param array  $attribs Attributes to pass to HTML_QuickForm
     *
     * @return array representing checkbox
     */
    function createCheckbox($field, $label, $attribs=null)
    {
        return $this->form->createElement(
            "advcheckbox",
            $field,
            $label,
            [],
            $attribs
        );
    }

    /**
     * Creates an HTML radio button but does not add it to the form.
     *
     * @param string $field   The fieldname for this radio button
     * @param string $label   The label to attach to this radio button
     * @param array  $options Options to pass to LorisForm
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
     * @param string $field   The fieldname for the password box
     * @param string $label   The label to attach to the form element
     * @param array  $attribs List of HTML attributes to add to the element
     *
     * @return array representing form element
     */
    function createPassword(
        $field,
        $label=null,
        $attribs=['class' => 'form-control input-sm']
    ) {
        return $this->form->createElement(
            'password',
            $field,
            $label,
            [],
            $attribs
        );
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
        $this->logger->debug("NDB_Page middleware called");
        $user = $request->getAttribute("user");
        if ($this->_hasAccess($user ?? new \LORIS\AnonymousUser()) !== true) {
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
        if (isset($get['format']) && $get['format'] === 'json') {
            $this->format = $get['format'];
            return $handler->handle($request)
                ->withHeader("Content-Type", "application/json");
        }

        return (new \LORIS\Middleware\PageDecorationMiddleware($user))
            ->process($request, $handler);
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
        $this->logger->debug("NDB_Page handle called");

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
        $this->logger->debug("Rendering page via display function");
        switch ($this->format) {
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

            // $this->form->addElement('hidden', 'test_name', $this->name);
            // $this->form->addElement('hidden', 'subtest', $this->page);
            // $this->form->addElement('hidden', 'identifier', $this->identifier);
        }

        // get the defaults
        $localDefaults = $this->_getDefaults();
        if (!is_array($localDefaults)) {
            $localDefaults = [];
        }
        // set the quickform object defaults
        $this->_setDefaults(array_merge($this->defaults, $localDefaults));

            // trim all values
        $this->form->applyFilter('__ALL__', 'trim');

        // display the HTML_Quickform object
        $smarty = new Smarty_NeuroDB($this->name);

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
    function _setDefaults($defaults = [])
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
        $baseurl = $factory->settings()->getBaseURL();
        $config  = $factory->config();

        $min = ($config->getSetting("sandbox") === '1') ? '' : '.min';

        // Currently jquery-ui is required for dialogs and datepickers to work.
        // In the future release, dialogs should be replaced with bootstrap dialogs
        // and datepickers only created by modernizr

        $files = [
            $baseurl . '/js/jquery/jquery-1.11.0.min.js',
            $baseurl . '/js/loris-scripts.js',
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
            $baseurl . "/js/util/queryString.js",
            $baseurl . '/js/components/Help.js',
        ];
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
        $baseurl = $factory->settings()->getBaseURL();

        $files = [
            $baseurl . "/bootstrap/css/bootstrap.min.css",
            $baseurl . "/bootstrap/css/custom-css.css",
            $baseurl . "/js/jquery/datepicker/datepicker.css"
        ];
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
        // If the page name is the same as the module directory name,
        // there should only be 1 level of breadcrumb.
        $pagename = ucwords(str_replace('_', ' ', $this->name));
        $sublabel = ucwords(str_replace('_', ' ', $this->page));

        if ($pagename == $sublabel) {
            return new \LORIS\BreadcrumbTrail(
                new \LORIS\Breadcrumb($this->Module->getLongName(), "/$this->name")
            );
        }

        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb($this->Module->getLongName(), "/$this->name"),
            new \LORIS\Breadcrumb($sublabel, "/$this->name/$this->page")
        );
    }

    /**
     * Converts the results of this form to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the options to send to the form
     */
    function toJSON(): string
    {
        return json_encode(['error' => 'Not implemented']);
    }
}
