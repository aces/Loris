<?php
/**
 * This file contains code for editing context help section 
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once 'NDB_Menu_Filter.class.inc';
require_once 'NDB_Form.class.inc';

/**
 * This file contains code for editing context help section 
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

class NDB_Menu_Filter_help_editor extends NDB_Menu_Filter
{
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        return $user->hasPermission('context_help');
    }

    function _setupVariables()
    {
        $user = User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // the base query
        $query = " FROM help WHERE hash IS NOT NULL AND topic IS NOT NULL";


        // set the class variables
        $this->columns      = array('topic as Topic', 'parentID as Main_Topic', 
                               'content as Content' );
        $this->query        = $query;
        $this->order_by     = 'helpID';
        $this->headers      = array('Topic','Parent Topic', 'Content');
        $this->validFilters = array('topic','content');

        $this->formToFilter = array(
                'topic' => 'topic',
                'Main_Topic'=>'parentID',
                'helpID'=>'helpID'
                );
        $this->searchKeyword = array('topic','content');
        return true;
    }


    function _setFilterForm()
    {

        // add form elements
        $this->addBasicText('topic', 'Help topic:');
        $this->addBasicText('keyword', 'Search keyword');       

        return true;
    }

    function _setDataTableRows($count)
    {
        $DB = Database::singleton();
        //Get the default values
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError("Could not connect to database: ".
                                     $DB->getMessage());
        }
        $help = $DB->pselect("SELECT helpID, topic from help", array());
        foreach ($help as $row) {
            $help_section[$row['helpID']] = $row['topic'];
        }
        $x = 0;

        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;
            $i                                       = 1;
            foreach ($item as $key => $val) {
                if (substr($key, "Topic") == 0) {
                    $this->tpl_data['items'][$x][$i]['helpID']   = array_search($val,
                                                                   $help_section);
                    $this->tpl_data['items'][$x][$i]['parentID'] = $item['Main_Topic'];
                }
                if ($key == "Main_Topic") {
                    $this->tpl_data['items'][$x][$i]['parentID'] = "-1";
                    $this->tpl_data['items'][$x][$i]['helpID']   = $val;
                    if ($val == "-1") {
                        $val = "-";
                    } else {
                        $val = $help_section[$val];
                    }
                }
                $this->tpl_data['items'][$x][$i]['name']  = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;

                $i++;
            }

            $x++;
        } 
        setCookie("LastUrl", "?test_name=help_editor"); 
        return true;

    } 
}
?>
