<?php

/**
 * admin_config class file
 *
 * PHP version 5
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Olga Tsibulevskaya <olgatsib@gmail.com> 
 * @license  GPLv3
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
 * @license  GPLv3
 * @link     https://github.com/aces/Loris-Trunk
*/
class NDB_Form_Configuration extends NDB_Form
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
        return $user->hasPermission('config');
    }

    /**
     * Constructor
     *
     * @return null
     */

    function configuration()
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

        // need a subtree with root = NULL only, others are repeating branches
        $this->tpl_data['config'] = $configs;
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
        foreach ($values as $key => $value) {
            if (is_numeric($key)) { //update
                $this->DB->update(
                    'Config', 
                    array('Value' => $value), 
                    array('ID' => $key)
                );
            } else { //add new or remove
                $id = split("-", $key);
                if ($id[0] === "add") {
                    $this->DB->insert(
                        'Config', 
                        array('ConfigID' => $id[1], 'Value' => $value)
                    );
                } elseif ($id[0] === "remove") {
                    $this->DB->delete('Config', array('ID' => $id[1]));
                }
            } 
        } 
        
        $this->configuration();
    }
}

?>
