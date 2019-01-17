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
    public $skipTemplate = true;

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
       * @return void
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
        $contentColumn      = "helpChild.content as Content";
        $this->columns      = array(
                               'helpChild.helpID as helpID',
                               'helpChild.topic as Topic',
                               'helpChild.parentID as Parent_ID',
                               'helpParent.parentID as ParentTopic_ID',
                               'helpParent.topic as Parent_Topic',
                               $contentColumn,
                              );
        $this->query        = $query;
        $this->order_by     = 'helpChild.helpID';
        $this->headers      = array(
                               'HelpID',
                               'Topic',
                               'ParentID',
                               'ParentTopicID',
                               'Parent_Topic',
                               'Content',
                              );
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
     * @return void
     */
    function setup()
    {
        parent::setup();

        // add form elements
        $this->addBasicText('topic', 'Help topic:');
        $this->addBasicText('keyword', 'Search keyword:');
    }
    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result = $this->toArray();
        $result['hiddenHeaders'] = [
                                    'HelpID',
                                    'ParentID',
                                    'ParentTopicID',
                                   ];
        $result['form']          = $this->form->form;

        return json_encode($result);
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
            array($baseURL . "/help_editor/js/help_editor.js")
        );
    }
}
?>
