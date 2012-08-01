<?
require_once "NDB_Page.class.inc";
require_once "PEAR.php";
require_once "HTML/QuickForm.php";
require_once 'HTML/QuickForm/Renderer/ArraySmarty.php';

/**
 * Base Form class
 * @package main
 */
class NDB_Form extends NDB_Page
{
    /**
     * Class name
     * @var    string
     * @access private
     */
    var $name;

    /**
     * Page name
     * @var    string
     * @access private
     */
    var $page;
 
    /**
     * Stores the form data
     * @var    HTML_QuickForm 
     * @access private
     */
    var $form;
 
    /**
     * Stores the template
     * @var    string 
     * @access private
     */
    var $template;
 
    /**
     * Identifies the item to edit
     * @var    string 
     * @access private
     */
    var $identifier;

    /**
     * Redirect URL
     * @var    string 
     * @access private
     */
    var $redirect;

    /**
     * Form defaults
     * @var    array 
     * @access private
     */
    var $defaults = array();

    /**
     * Separates the group elements
     * @var    string
     * @access private
     */
    var $_GUIDelimiter = "&nbsp;\n";
    
    /**
    * additional template data
    * @var array
    * @access private
    */
    var $tpl_data = array();
    

    /**
     * Generates a new form instance and runs the appropriate method
     *
     * @param  string      Identifies the form
     * @param  string      Identifies the page to show
     * @param  string      Variables passed to form
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function &factory($name, $page, $identifier)
    {
        // check that the form class exists
        if (class_exists("NDB_Form_$name")) {
            $class = "NDB_Form_$name";
        } else {
            return PEAR::raiseError("The form class ($name) is not defined.");
        }

        // create a form instance
        $obj = new $class;

        // set the local variables
        $obj->_setupPage($name, $page, $identifier, null, 'test_form'); 

       /** $obj->form = new HTML_QuickForm('test_form');
        $obj->name = $name;
        $obj->page = $page;
        $obj->identifier = $identifier; */  
       
        $access = $obj->_hasAccess();
        if (PEAR::isError($access)) {
            return PEAR::raiseError("NDB_Form::factory() access: ".$access->getMessage());
        }

        // check that user has access
        if ($access == false) {
            return PEAR::raiseError("You do not have access to this page.", 403);
        }

 	    if (method_exists($obj, $page)) {
	        $success = $obj->$page();
            if (PEAR::isError($success)) {
                return PEAR::raiseError("NDB_Form::factory() page: ".$success->getMessage());
            }
            $obj->template = $page;
	    }
 	    elseif (method_exists($obj, $name)) {
	        $success = $obj->$name();
            if (PEAR::isError($success)) {
                return PEAR::raiseError("NDB_Form::factory() name: ".$success->getMessage());
            }
            $obj->template = $name;
	    }
        else {
            return PEAR::raiseError("Form does not exist: $name $page");
        }

        return $obj;
    }


    /**
     * Returns false if user does not have access to page
     *
     * Usage: the hasAccess() function in a child class should contain something like:
     *
     *     // create user object
     *     $user =& User::singleton();
     *     if(PEAR::isError($user)) {
     *         return PEAR::raiseError("User Error: ".$user->getMessage());
     *     }
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


    /**
     * Displays the form
     *
     * @return void
     * @access public
     */
    function display()
    {
        if(!$this->form->isFrozen()) {
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
        if (PEAR::isError($localDefaults)) {
            return PEAR::raiseError("NDB_Form::display(): ".$localDefaults->getMessage());
        }
        if(!is_array($localDefaults)) { $localDefaults = array(); }
        // set the quickform object defaults
        $this->form->setDefaults(array_merge($this->defaults, $localDefaults));

	    // trim all values
    	$this->form->applyFilter('__ALL__', 'trim');

        // display the HTML_Quickform object
        $smarty = new Smarty_neurodb;
        $renderer =& new HTML_QuickForm_Renderer_ArraySmarty($smarty);
        $this->form->accept($renderer);
        $smarty->assign('form', $renderer->toArray());
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("form_$this->template.tpl");
        return $html;
        //return $this->form->toHTML();
    }


    /**
     * Returns the form-specific defaults
     *
     * @note   overloaded function
     * @return array
     * @access private
     */
    function _getDefaults()
    {
        return array();
    }


    /**
     * Saves the form
     *
     * Attempts to validate the form (using the defined rules) and
     * saves the validated data into the database
     *
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function save()
    {
        if ($this->form->validate()) {
            $success = $this->form->process(array(&$this, "_save"), false);
            if (PEAR::isError($success)) {
                return PEAR::raiseError("NDB_Form::save(): ".$success->getMessage());
            }
        }
    }
    

    /**
     * Preprocesses the array of values to be saved into the database
     *
     * @param  array    the array of values ready to be passed to a Database::replace call as the set array
     * @return void
     * @access private
     */
    function _save($values)
    {
        unset($values['test_name'], $values['subtest'], $values['identifier'], $values['fire_away']);

        // clear any fields starting with __
        foreach (array_keys($values) AS $key) {
            if (strpos($key, '__') === 0) {
                unset($values[$key]);
            }
        }

        $success = $this->_process($values);
        if (PEAR::isError($success)) {
            return PEAR::raiseError("NDB_Form::_save(): ".$success->getMessage());
        }
    }


    /**
     * Processes the values and saves to database
     *
     * @note            overloaded function
     * @param  array    form values
     * @return void
     * @access private
     */
    function _process($values)
    {
        return true;
    }

    /**
     * Resets the form
     * 
     * Usage: Call this function if you do not want to display the frozen form
     * after saving but just want to dump a message and maybe some links
     *
     * @return void
     * @access private
     */
    function _resetForm()
    {
       $this->_setupPage(null, null, null, null, 'test_form');
       // $this->form = new HTML_QuickForm('test_form');
    }
}
?>
