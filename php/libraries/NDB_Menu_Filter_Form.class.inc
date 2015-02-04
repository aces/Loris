<?php
/**
 * This class over-rides the NDB_Menu_Filter class by including the functionality
 * of saving/processing the form.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

require_once 'NDB_Menu_Filter.class.inc';

/**
 * Menu_Filter_Form Class
 *
 * This class over-rides the NDB_Menu_Filter class by including the functionality
 * to save/process the form.
 *
 * @category Behavioural
 * @package  Main
 * @author   Zia Mohaddes  <zia.mohades@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class NDB_Menu_Filter_Form extends NDB_Menu_Filter
{
    /*
     * Use HTML_QuickForm for Menu_Filter_Forms, since the Form part makes it more complicated
     * than Menu_Filters
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        $this->form       = new HTML_QuickForm($formname);
        $this->name       = $name;
        $this->page       = $page;
        $this->identifier = $identifier;
        $this->commentID  = $commentID;
        $this->defaults   = array();
    }

    function _resetForm()
    {
        $this->form = new HTML_QuickForm('test_form');
    }

    function display()
    {
        // dump the html for the menu
        $smarty   = new Smarty_neurodb($this->Module);
        $renderer = new HTML_QuickForm_Renderer_ArraySmarty($smarty);
        $this->form->accept($renderer);
        $smarty->assign('mode', $this->mode);
        $smarty->assign('form', $renderer->toArray());
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("menu_$this->menu.tpl");
        return $html;
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
        print "WHAT";
        if (!isset($_REQUEST['filter'])
            && isset($_REQUEST['fire_away'])
            || !empty($_REQUEST['fire_away'])
        ) {
            print "VALIDATING";
            if ($this->form->validate()) {
                print "I R VALID?";
                $success = $this->form->process(array(&$this, "_save"), false);
                // QuickForm may have returned a PEAR error, so convert it
                // to an exception. If this is ever upgraded to QF2, this
                // if statement can probably be removed.
                if (Utility::isErrorX($success) ) {
                    throw new Exception(
                        "NDB_Form::save(): ". $success->getMessage()
                    );
                }
            }
        }
    }



    /**
     * Preprocesses the array of values to be saved into the database
     *
     * @param array $values the array of values ready to be passed to
                             a Database::replace call as the set array
     *
     * @return void
     * @access private
     */
    function _save($values)
    {
        unset($values['test_name'], $values['subtest'],
        $values['identifier'], $values['fire_away']);

        // clear any fields starting with __
        foreach (array_keys($values) AS $key) {
            if (strpos($key, '__') === 0) {
                unset($values[$key]);
            }
        }

        $success = $this->_process($values);

        // Who knows what lurks in the hearts of overridden methods.
        // Convert PEAR errors to exceptions.
        if (Utility::isErrorX($success)) {
            throw new Exception("NDB_Form::_save(): ".$success->getMessage());
        }
    }


    /**
     * Processes the values and saves to database
     *
     * @param array $values form values
     *
     * @return void
     * @access private
     */
    function _process($values)
    {
        return true;
    }

}
?>
