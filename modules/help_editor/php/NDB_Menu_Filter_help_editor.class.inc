<?php
/**
 * This file contains code for editing context help section 
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * This file contains code for editing context help section 
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

class NDB_Menu_Filter_help_editor extends NDB_Menu_Filter
{
    function _hasAccess()
    {
        // create user object
        $user = User::singleton();

        return $user->hasPermission('context_help');
    }

    function _setupVariables()
    {
        $user = User::singleton();

        // the base query
        $query = " FROM help helpChild LEFT JOIN help helpParent ON (helpChild.parentID = helpParent.helpID )WHERE helpChild.hash IS NOT NULL AND helpChild.topic IS NOT NULL";


        // set the class variables
        $this->columns      = array('helpChild.helpID as helpID','helpChild.topic as Topic', 'helpChild.parentID as Parent_ID','helpParent.parentID as ParentTopic_ID','helpParent.topic as Parent_Topic','COALESCE(helpChild.projectContent, helpChild.content) as Content' );
        $this->query        = $query;
        $this->order_by     = 'helpChild.helpID';
        $this->headers      = array('HelpID','Topic','ParentID','ParentTopicID','Parent_Topic','Content');
        $this->tpl_data['hiddenHeaders'] = json_encode(['HelpID','ParentID','ParentTopicID']);
        $this->validFilters = array('helpChild.topic');

        $this->formToFilter = array(
                'topic' => 'helpChild.topic'
                );
        $this->searchKeyword = array('helpChild.topic','helpChild.content');
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
                    $this->tpl_data['items'][$x][$i]['parentID'] = $item['Parent_Topic'];
                    $item['Parent_Topic'] = $help_section[$item['Parent_Topic']];// this is to make sure sorting is done on the topic and not the ID
                }
                if ($key == "Parent_Topic") {
                    $this->tpl_data['items'][$x][$i]['parentID'] = "-1";
                    $this->tpl_data['items'][$x][$i]['helpID']   = $val;
                    if ($val == "-1") {
                        $val = "-";
                    } else {
                        $val = $help_section[$val];
                    }
                }
                $this->tpl_data['items'][$x][$i]['name']  = $key;
                $this->tpl_data['items'][$x][$i]['value'] = utf8_encode($val);

                $i++;
            }

            $x++;
        } 
        setCookie("LastUrl", "?test_name=help_editor"); 
        return true;

    } 
    
    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/help_editor/js/help_editor_helper.js",
             $baseURL . "/help_editor/js/columnFormatter.js",
            )
        );
    }
}
?>
