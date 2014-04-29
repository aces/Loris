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
 * @license  Loris License
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
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk	
*/

class NDB_Menu_Filter_Form extends NDB_Menu_Filter
{


    /**
    	* Saves the form
    	* Attempts to validate the form (using the defined rules) and
    	* saves the validated data into the database
    	*
    	* @return void
    	* @throws PEAR_Error
    	* @access public
    */
    function save()
    {
        if ($_REQUEST['filter'] !='Show Data') {
            if ($this->form->validate()) {
                
                $success = $this->form->process(array(&$this, "_save"), false);
                if (Utility::isErrorX($success)
                ) {
                    return PEAR::raiseError(
                        "NDB_Form::save(): ".
                        $success->getMessage()
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
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError("NDB_Form::_save(): ".$success->getMessage());
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
        $this->form = new HTML_QuickForm('test_form');
    }

}
?>
