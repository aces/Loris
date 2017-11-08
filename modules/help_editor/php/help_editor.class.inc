<?php
/**
 * This file contains code for editing context help section
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\help_editor;

/**
 * This file contains code for editing context help section
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Help_Editor extends \NDB_Menu_Filter
{
     /**
       *  Checking user permissions
       *
       * @return bool
       */
    function _hasAccess()
    {
        // create user object
        $user = \User::singleton();

        return $user->hasPermission('context_help');
    }
     /**
       * Setup Variables function
       *
       * @return bool
       */
    function _setupVariables()
    {
        $user = \User::singleton();

        // the base query
        $query = " FROM help helpChild LEFT JOIN help helpParent".
                 " ON (helpChild.parentID = helpParent.helpID )".
                 " WHERE helpChild.hash IS NOT NULL".
                 " AND helpChild.topic IS NOT NULL";

        // set the class variables
        $contentColumn  = "COALESCE(helpChild.projectContent,".
                         " helpChild.content) as Content";
        $this->columns  = array(
                           'helpChild.helpID as helpID',
                           'helpChild.topic as Topic',
                           'helpChild.parentID as Parent_ID',
                           'helpParent.parentID as ParentTopic_ID',
                           'helpParent.topic as Parent_Topic',
                           $contentColumn,
                          );
        $this->query    = $query;
        $this->order_by = 'helpChild.helpID';
        $this->headers  = array(
                           'HelpID',
                           'Topic',
                           'ParentID',
                           'ParentTopicID',
                           'Parent_Topic',
                           'Content',
                          );
        $this->tpl_data['hiddenHeaders']
            = json_encode(['HelpID', 'ParentID', 'ParentTopicID']);
        $this->validFilters = array('helpChild.topic');

        $this->formToFilter  = array('topic' => 'helpChild.topic');
        $this->searchKeyword = array(
                                'helpChild.topic',
                                'helpChild.content',
                               );
        return true;
    }

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return none
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        // add form elements
        $this->addBasicText('topic', 'Help topic:');
        $this->addBasicText('keyword', 'Search keyword');

        return true;
    }
     /**
       * SetDataTableRows
       *
       * @param string $count the value of count
       *
       * @return bool
       */
    function _setDataTableRows($count)
    {
        $DB = \Database::singleton();
        //Get the default values
        // $result will contain an array of size n by 2.
        // this must be transposed to create a dictionary of IDs to Topics
        $result = $DB->pselect("SELECT helpID, topic from help", array());
        foreach ($result as $row) {
            $helpTopics[$row['helpID']] = $row['topic'];
        }
        $x = 0;

        foreach ($this->list as $item) {
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;
            $i = 1;
            foreach ($item as $key => $val) {
                // Set front-end values for child topics
                $helpID = array_search($val, $helpTopics);
                if ($key === 'Topic') {
                    // $helpID will be a string representing a number or false
                    // so this logic statement should not provide unexpected results
                    // should $helpID = "0", for example
                    if (!$helpID) {
                        error_log("Could not find helpID for value $val");
                    } else {
                        $this->tpl_data['items'][$x][$i]['helpID'] = $helpID;
                    }
                    // set frontend parentID to item's parent topic, if it exists
                    $this->tpl_data['items'][$x][$i]['parentID']
                        = $item['Parent_Topic'];
                    // set item's parent topic to backend parent, if it exists
                    if (array_key_exists($item['Parent_Topic'], $helpTopics)) {
                        $item['Parent_Topic'] = $helpTopics[$item['Parent_Topic']];
                    }
                    // this is to make sure sorting is done
                    // on the topic and not the ID
                }
                // Set front-end values for parent topics
                if ($key === 'Parent_Topic') {
                    $this->tpl_data['items'][$x][$i]['parentID'] = '-1';
                    $this->tpl_data['items'][$x][$i]['helpID']   = $helpID;
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
        $factory = \NDB_Factory::singleton();
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
