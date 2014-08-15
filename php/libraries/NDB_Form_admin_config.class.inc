<?php

/**
 * admin_config class file
 *
 * PHP version 5
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Olga Tsibulevskaya <olgatsib@gmail.com> 
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
*/

require_once 'NDB_Form.class.inc';

/**
 * Admin_Config Class
 *
 * This class is to configure the system settings
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Olga Tsibulevskaya <olgatsib@gmail.com> 
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
*/
class NDB_Form_Admin_Config extends NDB_Form
{
    /**
     * _has_access returns true
     * if the user has the specific permission
     *
     * @return boolean
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }
        return true;
    }

    /**
     * Constructor
     *
     * @return null
     */

    function admin_config()
    {
        $this->DB = Database::singleton();
        if (Utility::isErrorX($this->DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
            die();
        }

        $configs = $this->DB->pselect(
            "SELECT * FROM ConfigSettings", 
            array()
        );
        // add values
        foreach ($configs as &$tag) {
            $value = $this->DB->pselect(
                "SELECT ID, Value FROM Config WHERE ConfigID=:ID",
                array('ID' => $tag{'ID'})
            );
            if ($value) {
                foreach ($value as $subvalue) {
                    $tag['Value'][$subvalue['ID']] = $subvalue['Value'];
                }
            }
        }

        // build a tree from configs array
        foreach ($configs as &$node) {
            $node['Children'] = array();
            $tree[$node['ID']] = &$node;
            
        }
        foreach ($configs as &$node) {
            $tree[$node['Parent']]['Children'][] = &$node;
        }
        
        // need a subtree with root = NULL only, others are repeating branches
        $this->tpl_data['configs'] = $tree['']['Children'];
        $this->tpl_data['options'] = array('0'=>'0', '1'=>'1');
    }

    /**
     * process the form
     *
     * @param Array $values the array of values from the form
     * 
     * @return NULL
     */

    function _process($values)
    {
        ksort($values);
        foreach ($values as $key => $value) {
            /*
               In the sorted array the first value is the name of the button.
               In 'Remove' array the key is of the form: "remove-id".
               In case of 'Save' can be two possibilities: update and add new
             */
            if ($value === "Remove") {
                $id = split("-", $key);
                $this->DB->delete('Config', array('ID' => $id[1]));
                break;
            } else { // 'Save'
                if ($value === "Save") {
                    continue;
                } else { 
                    /*
                       If 'Update', the key is the id of the value,
                       if 'Add new', the key is "id-index" 
                       where 'id' is the id of the tag. 
                     */ 
                    if (is_numeric($key)) { //update
                        $this->DB->update(
                            'Config', 
                            array('Value' => $value), 
                            array('ID' => $key)
                        );
    
                    } else { //add new
                        $id = split("-", $key);
                        $this->DB->insert(
                            'Config', 
                            array('ConfigID' => $id[0], 'Value' => $value)
                        );
                    }
                }
            } //end of if 'Action'
        } //end of foreach
        $this->admin_config();
    }
}

?>
