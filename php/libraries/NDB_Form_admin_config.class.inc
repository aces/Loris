<?php

/**
 * admin_config class file
 *
 * PHP version 5
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Loris team <info-loris.mni@mcgill.ca> 
 * @license  Loris License
 * @link     https://github.com/aces/Loris-Trunk
*/

require_once 'NDB_Form.class.inc';

/**
 * Log Class
 *
 * This class is to configure the system
 * 
 * @category Behavioural
 * @package  Main 
 * @author   Loris team <info-loris.mni@mcgill.ca> 
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
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
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
        
        //print_r ($tree['']['Children']);  
        // need a subtree with root = NULL only, others are repeating branches
        $this->tpl_data['configs'] = $tree['']['Children'];
        $this->tpl_data['options'] = array('0'=>'0', '1'=>'1');
        foreach ($configs as &$tag) {
            //print_r ($tag['Value']);
            if ($tag['Type'] == "bool") { 
                $this->tpl_data['dropdown'][$tag['ID']]['options'] = array('0'=>'0', '1'=>'1');
                //$this->addSelect($tag['ID'], $tag['Name'], array('0' => '0', '1' => '1'));
                $this->tpl_data['dropdown'][$tag['ID']]['ID'] = $tag['ID'];
                $this->tpl_data['dropdown'][$tag['ID']]['Description'] = $tag['Description'];
                // how to get values out of array? how to print several forms?
                $this->tpl_data['dropdown'][$tag['ID']]['Value'] = $tag['Value'];
            } else if ($tag['Type'] == "text") {
                //$this->addBasicText($tag['ID'], $tag['Name']);
                $this->tpl_data['text'][$tag['ID']]['ID'] = $tag['ID'];
                $this->tpl_data['text'][$tag['ID']]['Description'] = $tag['Description'];
                $this->tpl_data['text'][$tag['ID']]['Value'] = $tag['Value'];
            }
        }
    }
  
    /**
     * Sets up the Filter Form
     *
     * @return boolean
     */
    function _setFilterForm()
    {
           
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
        
    }

    
}

?>
