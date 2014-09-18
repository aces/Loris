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

require_once "NDB_Form.class.inc";
require_once "Utility.class.inc";
require_once "HelpFile.class.inc";

/**
 * A class for holding a set of functions to add/update content 
 * for all modules
 *
 * @category Main
 * @package  Loris
 * @author   Rathi Sekaran <sekaranrathi@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

class NDB_Form_help_editor extends NDB_Form
{
    var $indent = "&nbsp;&nbsp;&nbsp;&nbsp;";
     /**
     * Determine if user has permission to access this page
     *
     * @return boolean true if access is permitted
     */

    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

            // check user permissions
        return $user->hasPermission('context_help');
    }
     /**
      * Returns default help content of the page
      *
      * @return default array
      */
    function _getDefaults()
    {
        $DB =& Database::singleton();
        //Get the default values
        if (PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".
                                     $DB->getMessage());
        } 
        if (isset($_REQUEST['helpID'])) {
            $helpID = $_REQUEST['helpID'];
        }
        if (!empty($_REQUEST['section'])) {
            $helpID = HelpFile::hashToID(md5($_REQUEST['section']));
        } 
        if (!empty($_REQUEST['section']) 
            && $_REQUEST['subsection'] != 'undefined' ) {
            $helpID = HelpFile::hashToID(md5($_REQUEST['subsection']));
        }
        $this->tpl_data['section']    = $_REQUEST['section'] ;
        $this->tpl_data['subsection'] = $_REQUEST['subsection'] ;
        if (!empty($helpID)) {
            $help_file           =& HelpFile::factory($helpID);
            $data                = $help_file->toArray(); 
            $defaults['title']   = $data['topic'];
            $defaults['content'] = trim($data['content']);
            if (isset($_REQUEST['helpID'])) {
                $defaults['module_name'] = "Help Editor";
            }

        }
        if (empty($defaults['title'])) {
            if (!empty($_REQUEST['section'])) {
                $defaults['title'] = str_replace("_", " ", $_REQUEST['section']);
            }
            // if not module and not instrument, should be a subtest
            if (empty($label) && $_REQUEST['subsection'] != 'undefined') { 
                $defaults['title'] = str_replace("_", " ", $_REQUEST['subsection']); 
            }
        }
        $this->tpl_data['module_name'] = $defaults['title'];
        if (empty($defaults['content'])) {
            $defaults['content'] = 'Under Construction';
        }

        if (isset($_COOKIE["LastUrl"]) ) { 
            $this->tpl_data['url'] = $_COOKIE["LastUrl"];
        }
        return $defaults;
    }

    function _process($values)
    { 
        $DB =& Database::singleton();
        //Get the default values
        if (PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".
                                     $DB->getMessage());
        }
        if (isset($_REQUEST['helpID'])) {
            $helpID = $_REQUEST['helpID'];
        }
        if (isset($_REQUEST['parentID'])) {
            $parentID = $_REQUEST['parentID'];
        }

        if (!empty($_REQUEST['section'])) {
            $helpID = HelpFile::hashToID(md5($_REQUEST['section']));
        }
        if (!empty($_REQUEST['section']) 
            && $_REQUEST['subsection'] != 'undefined' ) {
            $helpID   = HelpFile::hashToID(md5($_REQUEST['subsection']));
            $parentID = HelpFile::hashToID(md5($_REQUEST['section']));
        } 
        if (!empty($helpID)) {
            $help_file =& HelpFile::factory($helpID);
            // update the help file
            $success = $help_file->update(array(
                        'topic' => $values['title'],
                        'content' => $values['content'],
                        'updated' => date('Y-m-d h:i:s', time())
                        ));
            if (PEAR::isError($success)) {
                $this->tpl_data['error_message'][] = $success->getMessage();
            }
        } else {
            //content does not exist insert the help file
            if (!empty($_REQUEST['section']) 
                && $_REQUEST['subsection'] != 'undefined'
                && empty($parentID)) { 
                //create parent help section first
                $parentID = HelpFile::insert(array(
                            'hash' => md5($_REQUEST['section']),
                            'topic' => "",
                            'content' => "Under construction",
                            'created' => date('Y-m-d h:i:s', time())
                            ));
                 // check errors
                if (PEAR::isError($parentID)) {
                    $this->tpl_data['error_message'][] = $parentID->getMessage();
                }

            }
            if (!empty($_REQUEST['section']) 
                && $_REQUEST['subsection'] != 'undefined'
                && !empty($parentID)) { 
 
                // insert the help file
                $helpID = HelpFile::insert(array(
                            'parentID' => $parentID,
                            'hash' => md5($_REQUEST['subsection']),
                            'topic' => $values['title'],
                            'content' => $values['content'],
                            'created' => date('Y-m-d h:i:s', time())
                            ));

                // check errors
                if (PEAR::isError($helpID)) {
                    $this->tpl_data['error_message'][] = $helpID->getMessage();
                }
            } else if ( !empty($_REQUEST['section']) 
                        && $_REQUEST['subsection'] == 'undefined') { 
                //default case
                $helpID = HelpFile::insert(array(
                            'hash' => md5($_REQUEST['section']),
                            'topic' => $values['title'],
                            'content' => $values['content'],
                            'created' => date('Y-m-d h:i:s', time())
                            ));

                // check errors
                if (PEAR::isError($helpID)) {
                    $this->tpl_data['error_message'][] = $helpID->getMessage();
                }
            }

        }
        $this->tpl_data['success'] =  true;

    } 

    function edit_help_content()
    {  
        $this->addBasicText('title', 'Title');
        $this->addBasicTextArea('content', 'Content', array('cols'=>140, 'rows'=>30));
        
    }

}    

?>
