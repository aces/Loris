<?php
/**
 * This file sets up the Edit Help Content page and form.
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
 * A class for holding a set of functions to add/update content
 * for all modules
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */

class Edit_Help_Content extends \NDB_Form
{
     /**
      * Determine if user has permission to access this page
      *
      * @param \User $user The user whose access is being checked
      *
      * @return bool true if access is permitted
      */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('context_help');
    }

     /**
      * Returns default help content of the page
      *
      * @return array An associative array containing the title and content
      *         for the default help information.
      */
    function _getDefaults()
    {
        $DB = \Database::singleton();
        //Get the default values
        $defaults = array();

        // Sanitize user input
        $safeSection    = $_REQUEST['section'] ?
            htmlspecialchars($_REQUEST['section']) : '';
        $safeSubsection = $_REQUEST['subsection'] ?
            htmlspecialchars($_REQUEST['subsection']) : '';

        $defaults = array();

        if (isset($_REQUEST['helpID'])) {
            $helpID = htmlspecialchars($_REQUEST['helpID']);
        }
        if (isset($_GET['parentID'])) {
            $parentID = htmlspecialchars($_GET['parentID']);
        }
        if (!empty($_REQUEST['section'])) {
            $helpID = HelpFile::hashToID(md5($_REQUEST['section']));
        }
        if (!empty($_REQUEST['section'])
            && $_REQUEST['subsection'] != 'undefined'
        ) {
            $helpID   = HelpFile::hashToID(md5($_REQUEST['subsection']));
            $parentID = HelpFile::hashToID(md5($_GET['section']));
        }
        $this->tpl_data['section']    = $safeSection;
        $this->tpl_data['subsection'] = $safeSubsection;
        $this->tpl_data['helpID']     = $helpID ? $helpID : '';
        $this->tpl_data['parentID']   = $parentID ? $parentID : '';

        if (!empty($helpID)) {
            $help_file = HelpFile::factory($helpID);
            $data      = $help_file->toArray();
            $defaults['title']   = $data['topic'];
            $defaults['content'] = utf8_encode(trim($data['content']));
            if (isset($_REQUEST['helpID'])) {
                $this->tpl_data['module_name'] = "Help Editor";
            } else {
                $this->tpl_data['module_name'] = $defaults['title'];
            }

        }
        // let escaped html display as intended in form
        $defaults['content'] = htmlspecialchars_decode($defaults['content']);
        // case where no help content exists
        if (empty($defaults['title'])) {
            if (!empty($_REQUEST['section'])) {
                $defaults['title'] = str_replace("_", " ", $safeSection);
            }
            // if not module and not instrument, should be a subtest
            if (!empty($_REQUEST['subsection'])
                && $_REQUEST['subsection'] != 'undefined'
            ) {
                $defaults['title'] = str_replace("_", " ", $safeSubsection);
            }
            $this->tpl_data['module_name'] = $defaults['title'];
        }
        if (empty($defaults['content'])) {
            $defaults['content'] = 'Under Construction';
        }

        if (isset($_SERVER['HTTP_REFERER']) ) {
            $this->tpl_data['url'] = $_SERVER['HTTP_REFERER'];
        }
        return $defaults;
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

        $this->addBasicText('title', 'Title');
        $this->addBasicTextArea(
            'content',
            'Content',
            array(
                'cols' => 140,
                'rows' => 30,
            )
        );

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
            )
        );
    }
}


