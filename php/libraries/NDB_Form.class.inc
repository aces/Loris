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
     * @var    string
     * @access private
     */
    var $template;

    /**
     * Redirect URL
     * @var    string
     * @access private
     */
    var $redirect;

    /**
     * Separates the group elements
     * @var    string
     * @access private
     */
    var $_GUIDelimiter = "&nbsp;\n";

    /**
    * Additional template data
    */
    var $tpl_data = array();


    /**
     * Generates a new form instance and runs the appropriate method
     *
     * @param string $name       Identifies the form
     * @param string $page       Identifies the page to show
     * @param string $identifier Variables passed to form
     *
     * @return void
     */
    static function &factory($name, $page, $identifier)
    {
        // check that the form class exists
        if (class_exists("NDB_Form_$name")) {
            $class = "NDB_Form_$name";
        } else {
            throw new Exception("The form class ($name) is not defined.");
        }

        // create a form instance
        $obj = new $class;

        // set the local variables
        $obj->_setupPage($name, $page, $identifier, null, 'test_form');

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

        return $obj;
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
            $success = $this->form->process(array(&$this, "_save"), false);
            // Just in case QuickForm returned a PEAR error instead of an
            // exception..
            if (Utility::isErrorX($success)) {
                throw new Exception($success->getMessage());
            }
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

        $success = $this->_process($values);
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
        $this->_setupPage($name, $page, $identifier, null, 'test_form');
        // $this->form = new HTML_QuickForm('test_form');
    }
}
?>
