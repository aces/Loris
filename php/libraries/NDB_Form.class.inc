<?php
/**
 * Contains the base code to use for all NeuroDB forms
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
/**
 * Base Form class that is overwritten by specific form pages
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Form extends NDB_Page
{
    /**
     * Stores the template
     *
     * @var    string
     * @access private
     */
    var $template;

    /**
     * Redirect URL
     *
     * @var    string
     * @access private
     */
    var $redirect;

    /**
     * Separates the group elements
     *
     * @var    string
     * @access private
     */
    var $_GUIDelimiter = "&nbsp;\n";

    /**
     * Generates a new form instance and runs the appropriate method
     *
     * @param string $name       Identifies the form
     * @param string $page       Identifies the page to show
     * @param string $identifier Variables passed to form
     *
     * @return \NDB_Form
     */
    static function &factory($name, $page, $identifier)
    {
        // check that the form class exists
        if (class_exists("NDB_Form_$name")) {
            $class = "NDB_Form_$name";
        } else {
            throw new Exception("The form class ($name) is not defined.");
        }

        // create a new menu object
        try {
            if (isset($_REQUEST['test_name'])) {
                $module = \Module::factory($_REQUEST['test_name']);
            } else {
                $module = \Module::factory($name);
            }
        } catch(\LorisModuleMissingException $e) {
            $module = new Module($name, "");
        }

        // create a form instance
        $obj = new $class($module, $page, $identifier, '', 'test_form');

        $obj->registerDefaultFilter();

        $access = $obj->_hasAccess();

        // check that user has access
        if ($access == false) {
            throw new Exception("You do not have access to this page.", 403);
        }

        if (method_exists($obj, $page)) {
            $success       = $obj->$page();
            $obj->template = $page;
        } elseif (method_exists($obj, $name)) {
            $success       = $obj->$name();
            $obj->template = $name;
        } else {
            throw new Exception("Form does not exist: $name $page", 404);
        }

        $factory  = NDB_Factory::singleton();
        $settings = $factory->settings();
        $obj->setTemplateVar('baseurl', $settings->getBaseURL());

        return $obj;
    }

    /**
     * By default, trim all fields on the form before any processing/validation
     * is done. Derived classes can override this behavior if needed.
     *
     * @return void
     * @access public
     */
    function registerDefaultFilter()
    {
        $this->form->applyFilter('__ALL__', 'trim');
    }


    /**
     * Saves the form
     *
     * Attempts to validate the form (using the defined rules) and
     * saves the validated data into the database
     *
     * @return void
     * @access public
     */
    function save()
    {
        if ($this->form->validate()) {
            $this->form->process(array(&$this, "_save"));
        }
    }


    /**
     * Preprocesses the array of values to be saved into the database
     *
     * @param array $values the array of values ready to be passed to
     *                      a Database::replace call as the set array
     *
     * @return void
     */
    function _save($values)
    {
        unset(
            $values['test_name'],
            $values['subtest'],
            $values['identifier'],
            $values['fire_away']
        );

        // clear any fields starting with __
        foreach (array_keys($values) AS $key) {
            if (strpos($key, '__') === 0) {
                unset($values[$key]);
            }
        }

        $this->_process($values);
    }


    /**
     * Processes the values and saves to database. Usually overridden
     * by form instance.
     *
     * @param array $values form values
     *
     * @return void
     */
    function _process($values)
    {
        return true;
    }

    /**
     * A form extends the basic page handler to call save() on a POST request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The PSR15 response to the request.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $this->setup();
        if ($request->getMethod() === "POST") {
            $this->save();
        }

        return (new \LORIS\Http\Response())
            ->withBody(new \LORIS\Http\StringStream($this->display() ?? ""));
    }
}

