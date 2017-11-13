<?php
/**
 * This file contains the base class for an NDB_Menu. An NDB_Menu is the
 * base class for any menu page for a Loris module.
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
 * Base Menu class
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Menu extends NDB_Page
{
    /**
     * The menu's name
     *
     * @var    string
     * @access private
     */
    var $menu;

    /**
     * The menu's mode
     *
     * @var    string
     * @access private
     */
    var $mode;

    public function __construct(\Module $module, string $page, $identifier, $commentID, $formname)
    {
        parent::__construct($module, $page, $identifier, $commentID, $formname);
        $this->menu = $module->getName();
    }
    /**
     * Generates a new menu instance
     *
     * @param string $menu The name of the menu to use
     * @param string $mode The menu's mode
     *
     * @return object The new object of $menu type
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
            throw new Exception("The menu class ($menu) is not defined.");
        }

        // create a new menu object
        try {
            if (isset($_REQUEST['test_name'])) {
                $module = \Module::factory($_REQUEST['test_name']);
            } else {
                $module = \Module::factory($menu);
            }
        } catch(\ModuleMissingException $e) {
            $module = new Module($menu);
        }

        $obj = new $class($module, $menu, '', '', 'menu');

        // set the local variables
        $obj->mode = $mode;
        $access    = $obj->_hasAccess();

        // check that user has access
        if ($access == false) {
            throw new Exception("You do not have access to this page.", 403);
        }

        $factory  = NDB_Factory::singleton();
        $settings = $factory->settings();
        $obj->setTemplateVar('baseurl', $settings->getBaseURL());

        return $obj;
    }

    /**
     * Displays the menu page
     *
     * @return void
     * @access public
     */
    function display()
    {
        if ($this->skipTemplate) {
            return "";
        }
        // dump the html for the menu
        $smarty = new Smarty_neurodb($this->Module->getName());
        $smarty->assign('mode', $this->mode);
        $smarty->assign($this->getTemplateData());
        $html = $smarty->fetch("menu_$this->menu.tpl");
        return $html;
    }
}
?>
