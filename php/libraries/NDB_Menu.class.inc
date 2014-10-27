<?php
require_once 'PEAR.php';
require_once 'NDB_Page.class.inc';

/**
 * Base Menu class
 *
 * @package main
 */
class NDB_Menu extends NDB_Page
{
    /**
     * The menu's name
     * @var    string 
     * @access private
     */
    var $menu;

    /**
     * The menu's mode
     * @var    string 
     * @access private
     */
    var $mode;

    /**
     * The template data for Smarty
     * @var    array 
     * @access private
     */
    var $tpl_data;


    /**
     * Generates a new menu instance
     *
     * @param  string      The name of the menu to use
     * @param  string      The menu's mode
     * @return object      The new object of $menu type
     * @throws PEAR_Error
     * @access public
     */
    static function &factory($menu, $mode)
    {
        // get the name of the class
        if (class_exists("NDB_Menu_$menu")) {
            $class = "NDB_Menu_$menu";
        } elseif (class_exists("NDB_Menu_Filter_$menu")) {
            $class = "NDB_Menu_Filter_$menu";
        } elseif (class_exists("NDB_Menu_Filter_Form_$menu")) {
            $class = "NDB_Menu_Filter_Form_$menu";
        } else {
            return PEAR::raiseError("The menu class ($menu) is not defined.");
        }

        // create a new menu object
        $obj = new $class;

        if(isset($_REQUEST['test_name'])) {
            $obj->Module = $_REQUEST['test_name'];
        } else {
            $obj->Module = $menu;
        }
        // set the local variables
        $obj->menu = $menu;
        $obj->mode = $mode;        
        $access = $obj->_hasAccess();
        if (Utility::isErrorX($access)) {
            return PEAR::raiseError("NDB_Menu::factory(): ".$access->getMessage());
        }

        // check that user has access
        if ($access == false) {
            return PEAR::raiseError("You do not have access to this page.", 403);
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
     *     if(Utility::isErrorX($user)) {
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
     * Calls other member functions to do all the work necessary to create the menu
     *
     * @note   overloaded function
     * @return void
     * @access public
     */
    function setup()
    {
        return true;
    }

    /**
     * Displays the menu page
     *
     * @return void
     * @access public
     */
    function display()
    {
        // dump the html for the menu
        $smarty = new Smarty_neurodb($this->Module);
        $smarty->assign('mode', $this->mode);
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("menu_$this->menu.tpl");
        return $html;
    }
}
?>
