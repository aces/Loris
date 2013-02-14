<?php
/**
 * context help script
 *
 * @bug if you refresh while creating a help file, it creates another new file
 * @package main
 * @subpackage unused
 */
ob_start('ob_gzhandler');
require_once "NDB_Client.class.inc";
$client = new NDB_Client();
$client->initialize();

require_once "HelpFile.class.inc";

// create DB object
$DB =& Database::singleton();
if(PEAR::isError($DB)) {
    return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
}

// create user object
$user =& User::singleton($_SESSION['State']->getUsername());
if (PEAR::isError($user)) {
    $tpl_data['error_message'] = $user->getMessage();
}

// define help IDs of common help files
define('FRONTPAGE_ID', 1);
define('HOWTO_ID', 2);
define('GUIDELINES_ID', 3);

// define parent IDs for hash-created help files
define('INSTRUMENTS_ID', 5);

// store some request information
if(!empty($_REQUEST['helpID'])){
	$helpID = $_REQUEST['helpID'];
} else{
	if (!empty($_REQUEST['test_name'])) {
		$helpID = HelpFile::hashToID(md5($_REQUEST['test_name']));

	}
}
/*
 * behave according to the requested display mode
 */
switch ($_REQUEST['mode']) {
    /*
     * Static links
     */
 case 'Browse': // browse by topic
     // get the entire tree
     $help_file =& HelpFile::factory(-1);
     if (PEAR::isError($help_file)) {
         $tpl_data['error_message'][] = $help_file->getMessage();
     } else {
         $tpl_data['list'] = $help_file->tree();
         if (PEAR::isError($tpl_data['list'])) {
             $tpl_data['error_message'][] = $tpl_data['list']->getMessage();
         }
     }

     // set the template
     $tpl_data['pagetitle'] = 'Browse by Topic';
     $template_suffix = '_browse';
     $tpl_data['menu'] = true;
     break;

 case 'Index': // browse alphabetically
     // get all help files and take the first letter
     $DB->select("SELECT helpID, topic, updated, LEFT(topic, 1) AS section FROM help ORDER BY topic ASC", $result);
     if (PEAR::isError($result)) {
         $tpl_data['error_message'][] = $result->getMessage();
     } else {
         $tpl_data['list'] = $result;
     }

     // set the template
     $tpl_data['pagetitle'] = 'Manual Index';
     $template_suffix = '_index';
     $tpl_data['menu'] = true;
     break;

 case 'Updates': // browse reverse chronologically
     // get all help files and take the date
     $DB->select("SELECT helpID, topic, updated, DATE_FORMAT(updated, '%W, %M %e, %Y') AS section FROM help ORDER BY updated DESC", $result);
     if (PEAR::isError($result)) {
         $tpl_data['error_message'][] = $result->getMessage();
     } else {
         $tpl_data['list'] = $result;
     }
        
     // set the template
     $tpl_data['pagetitle'] = 'Recent Updates';
     $template_suffix = '_index';
     $tpl_data['menu'] = true;
     break;
    
     /*
      * Search
      */
 case 'Search':
     // search the topics
     $DB->select("SELECT helpID, topic, updated FROM help WHERE Match (topic) AGAINST('" . $_REQUEST['search'] . "')", $result);
     if (PEAR::isError($result)) {
         $tpl_data['error_message'][] = $result->getMessage();
     } else {
         $tpl_data['topics'] = $result;
     }

     // search the contents
     $DB->select("SELECT helpID, topic, updated, content FROM help WHERE Match (content) AGAINST('" . $_REQUEST['search'] . "')", $result);
     if (PEAR::isError($result)) {
         $tpl_data['error_message'][] = $result->getMessage();
     } else {
         $tpl_data['contents'] = $result;
     }
        
     // get the array of search words
     $words = $patterns = explode(' ', preg_quote($_REQUEST['search']));

     // set up the replacement patterns for later
     array_walk($patterns, 'makePattern');
     $patterns = array_merge($patterns, "/\n/", "/\r/", "/(&hellip; ){2,}/");
     $replacements = array_merge(array_fill(0, count($words), "<em>\\0</em>"), "&hellip; ", "&hellip; ", "&hellip; ");

     // get content snippets
     foreach ($tpl_data['contents'] as $key => $row) {
         // remove tags and slashes from searchable text
         $row['content'] = stripslashes(strip_tags($row['content']));

         // try to get a snippet for each word
         foreach ($words as $word) {
             // get some text on either side of the keyword (you can change how much text to take)
             preg_match("/\b.{0,50}$word.{0,50}\b/is", $row['Content'], $snippets);
             // put the value into the array with ellipses on either side
             if (!empty($snippets[0])) {
                 $tpl_data['contents'][$key]['snippet'] .= "&hellip; $snippets[0] &hellip;<br />";
             }
         }

         // emphasize words, replace line breaks, and remove extra ellipses
         $tpl_data['contents'][$key]['snippet'] = preg_replace($patterns, $replacements, $tpl_data['contents'][$key]['snippet']);
     }
        
     // set the template
     $tpl_data['pagetitle'] = 'Search Results';
     $template_suffix = '_search';
     $tpl_data['menu'] = true;
     break;
    
     /*
      * Editing popups
      */
 case 'Change Parent':
     // make sure we have editing privileges
     if ($user->hasPermission('context_help')) {
         if (isset($_POST['submit'])) {
             $help_file =& HelpFile::factory($helpID);

             if (PEAR::isError($help_file)) {
                 $tpl_data['error_message'][] = $help_file->getMessage();
             } else {
                 // keep in touch with family, if desired
                 if ($_POST['add'] == 1) {
                     $success = $help_file->addLinks($help_file->ParentIDs());
                     if (PEAR::isError($success)) {
                         $tpl_data['error_message'][] = $success->getMessage();
                     }
                 }
                
                 // remove the new parent from related links
                 $success = $help_file->removeLinks($_POST['parentID']);
                 if (PEAR::isError($success)) {
                     $tpl_data['error_message'][] = $success->getMessage();
                 }

                 // update the help file
                 $success = $help_file->update(array(
                                                     'parentID' => $_POST['parentID'],
                                                     'topic' => strip_tags($_POST['topic']),
                                                     'content' => $_POST['content']
                                                     ));
                 if (PEAR::isError($success)) {
                     $tpl_data['error_message'][] = $success->getMessage();
                 }
             }

             // set the template
             $tpl_data['URL'] = "context_help_popup.php?helpID=$helpID&mode=Edit";
             $template_suffix = '_close_window';
         } else {
             $help_file =& HelpFile::factory($helpID);

             if (PEAR::isError($help_file)) {
                 $tpl_data['error_message'][] = $help_file->getMessage();
             } else {
                 // get the help file's data
                 $tpl_data['help_file'] = $help_file->toArray();

                 // get all possible parents
                 $tpl_data['parents'] = $help_file->strangerData(1);
                 if (PEAR::isError($tpl_data['parents'])) {
                     $tpl_data['error_message'][] = $tpl_data['parents']->getMessage();
                 }
             }

             // set the template
             $tpl_data['is_popup'] = true;
             $tpl_data['pagetitle'] = 'Change Parent';
             $template_suffix = '_change_parent';
         }
     }
     break;

 case 'Add Links':
     // make sure we have editing privileges
     if ($user->hasPermission('context_help')) {
         if (isset($_POST['submit'])) {
             $help_file =& HelpFile::factory($helpID);

             if (PEAR::isError($help_file)) {
                 $tpl_data['error_message'][] = $help_file->getMessage();
             } else {
                 // add the links
                 $success = $help_file->addLinks($_POST['relatedID']);
                 if (PEAR::isError($success)) {
                     $tpl_data['error_message'][] = $success->getMessage();
                 }

                 // update the help file
                 $success = $help_file->update(array(
                                                     'topic' => strip_tags($_POST['topic']),
                                                     'content' => $_POST['content']
                                                     ));
                 if (PEAR::isError($success)) {
                     $tpl_data['error_message'][] = $success->getMessage();
                 }
             }

             // set the template
             $tpl_data['URL'] = "context_help_popup.php?helpID=$helpID&mode=Edit";
             $template_suffix = '_close_window';
         } else {
             $help_file =& HelpFile::factory($helpID);

             if (PEAR::isError($help_file)) {
                 $tpl_data['error_message'][] = $help_file->getMessage();
             } else {
                 // get the help file's data
                 $tpl_data['help_file'] = $help_file->toArray();

                 // get all possible new links
                 $strangers = $help_file->strangerData();
                 if (PEAR::isError($strangers)) {
                     $tpl_data['error_message'][] = $strangers->getMessage();
                 }
                 $relations = $help_file->relationIDs();
                 if (PEAR::isError($relations)) {
                     $tpl_data['error_message'][] = $relations->getMessage();
                 }
                 $tpl_data['links'] = array_diff_multi($strangers, $relations, 'helpID');
             }

             // set the template
             $tpl_data['note'] = "Please select the topics you would like to add under this topic's related links. If a topic is not listed below, it has already been added as a related link, is a subtopic of this topic, or is the parent of this topic. You may select more than one topic. Use Ctrl+Left Click to add or remove topics from your selection. To remove topics, you may click \"Remove Links\" once you are done with this dialog window.";
             $tpl_data['is_popup'] = true;
             $tpl_data['pagetitle'] = 'Add Links';
             $template_suffix = '_links';
         }
     }
     break;

 case 'Remove Links':
     // make sure we have editing privileges
     if ($user->hasPermission('context_help')) {
         if (isset($_POST['submit'])) {
             $help_file =& HelpFile::factory($helpID);

             if (PEAR::isError($help_file)) {
                 $tpl_data['error_message'][] = $help_file->getMessage();
             } else {
                 // remove the links
                 $success = $help_file->removeLinks($_POST['relatedID']);
                 if (PEAR::isError($success)) {
                     $tpl_data['error_message'][] = $success->getMessage();
                 }

                 // update the help file
                 $success = $help_file->update(array(
                                                     'topic' => strip_tags($_POST['topic']),
                                                     'content' => $_POST['content']
                                                     ));
                 if (PEAR::isError($success)) {
                     $tpl_data['error_message'][] = $success->getMessage();
                 }
             }

             // set the template
             $tpl_data['URL'] = "context_help_popup.php?helpID=$helpID&mode=Edit";
             $template_suffix = '_close_window';
         }
         else {
             $help_file =& HelpFile::factory($helpID);

             if (PEAR::isError($help_file)) {
                 $tpl_data['error_message'][] = $help_file->getMessage();
             } else {
                 // get the help file's data
                 $tpl_data['help_file'] = $help_file->toArray();

                 // get all related links
                 $tpl_data['links'] = $help_file->relationData();
                 if (PEAR::isError($tpl_data['links'])) {
                     $tpl_data['error_message'][] = $tpl_data['links']->getMessage();
                 }
             }

             // set the template
             $tpl_data['note'] = "Please select the topics you would like to remove from this topic's related links. If a topic is not listed below, it is not a related link, is a subtopic of this topic, or is the parent of this topic. You may select more than one topic. Use Ctrl+Left Click to add or remove topics from your selection. To add topics, you may click \"Add Links\" once you are done with this dialog window.";
             $tpl_data['is_popup'] = true;
             $tpl_data['pagetitle'] = 'Remove Links';
             $template_suffix = '_links';
         }
     }
     break;

     /*
      * Editing modes
      */
 case 'Save': // save and continue editing
     // make sure we have editing privileges
     if ($user->hasPermission('context_help')) {
         $help_file =& HelpFile::factory($helpID);

         if (PEAR::isError($help_file)) {
             $tpl_data['error_message'][] = $help_file->getMessage();
         } else {
             // update the help file            
             $success = $help_file->update(array(
                                                 'parentID' => $_POST['parentID'],
                                                 'topic' => strip_tags($_POST['topic']),
                                                 'content' => $_POST['content'],
                                                 'updated' => date('Y-m-d h:i:s', time())
                                                 ));
             if (PEAR::isError($success)) {
                 $tpl_data['error_message'][] = $success->getMessage();
             }
         }
     }
     // no break
    
 case 'Edit':
     // make sure we have editing privileges
     if ($user->hasPermission('context_help')) {
         // output the help file
         $help_file =& HelpFile::factory($helpID);

         if (PEAR::isError($help_file)) {
             $tpl_data['error_message'][] = $help_file->getMessage();
         } else {
             $tpl_data['help_file'] = $help_file->toArray();
             $tpl_data['related_links'] = $help_file->relationData();
             if (PEAR::isError($tpl_data['related_links'])) {
                 $tpl_data['error_message'][] = $tpl_data['related_links']->getMessage();
             }
             $tpl_data['subtopics'] = $help_file->childData(1);
             if (PEAR::isError($tpl_data['subtopics'])) {
                 $tpl_data['error_message'][] = $tpl_data['subtopics']->getMessage();
             }
             $tpl_data['parent'] = $help_file->parentData();
             if (PEAR::isError($tpl_data['parent'])) {
                 $tpl_data['error_message'][] = $tpl_data['parent']->getMessage();
             }
         }
            
         // set the template
         $tpl_data['pagetitle'] = 'Editing ' . $tpl_data['help_file']['topic'];
         $template_suffix = '_edit';
         $tpl_data['menu'] = true;
     }
     break;

 case 'Create':
     // make sure we have editing privileges
    if ($user->hasPermission('context_help')) {
         // it is a subtopic
         if (intval($_REQUEST['parentID']) > 0) {
             $parentID = $_REQUEST['parentID'];
         }
         // it is a subtest
         elseif (!empty($_REQUEST['test_name']) && !empty($_REQUEST['subtest'])) {
             $parentID = HelpFile::hashToID(md5($_REQUEST['test_name']));
             if (PEAR::isError($parentID)) {
                 $tpl_data['error_message'][] = $parentID->getMessage();
             }
             // the intruments does not exist yet
             if (empty($parentID)) {
                 $parentID = INSTRUMENTS_ID;
             }
         }
         // it is an instrument
         elseif (!empty($_REQUEST['test_name'])) {
             $parentID = INSTRUMENTS_ID;
         }
         // it is an orphan
         else {
             $parentID = FRONTPAGE_ID;
         }

         // create the hash
         $hash = makeHash();

         // get the topic
         $topic = makeTopic();
         if (PEAR::isError($topic)) {
             $tpl_data['error_message'][] = $topic->getMessage();
         } elseif (PEAR::isError($parentID)) {
             $tpl_data['error_message'][] = $parentID->getMessage();
         } else {
             // insert the help file
             $helpID = HelpFile::insert(array(
                                              'parentID' => $parentID,
                                              'hash' => $hash,
                                              'topic' => strip_tags($topic),
                                              'content' => 'Put the content here',
                                              'created' => date('Y-m-d h:i:s', time())
                                              ));

             // check errors
             if (PEAR::isError($helpID)) {
                 $tpl_data['error_message'][] = $helpID->getMessage();
             }
         }

         // output the help file
         $help_file =& HelpFile::factory($helpID);
         if (PEAR::isError($help_file)) {
             $tpl_data['error_message'][] = $help_file->getMessage();
         } else {
             $tpl_data['help_file'] = $help_file->toArray();
             $tpl_data['parent'] = $help_file->parentData();
             if (PEAR::isError($tpl_data['parent'])) {
                 $tpl_data['error_message'][] = $tpl_data['parent']->getMessage();
             }
         }

         // set the template
         $tpl_data['pagetitle'] = 'Editing ' . $tpl_data['help_file']['topic'];
         $template_suffix = '_edit';
         $tpl_data['menu'] = true;
     }
     break;

 case 'Finish': // save and quit
     // make sure we have editing privileges
     if ($user->hasPermission('context_help')) {
         $help_file =& HelpFile::factory($helpID);

         if (PEAR::isError($help_file)) {
             $tpl_data['error_message'][] = $help_file->getMessage();
         } else {
             $success = $help_file->update(array(
                                                 'parentID' => $_POST['parentID'],
                                                 'topic' => strip_tags($_POST['topic']),
                                                 'content' => $_POST['content'],
                                                 'updated' => date('Y-m-d h:i:s', time())
                                                 ));
             if (PEAR::isError($success)) {
                 $tpl_data['error_message'][] = $success->getMessage();
             }
         }
     }

 default:
     if (empty($helpID)) {
         // try to get the help ID by hash
         $hash = makeHash();

         if (!empty($hash)) {
             // try to get the help ID
             $helpID = HelpFile::hashToID($hash);
             if (PEAR::isError($helpID)) {
                 $tpl_data['error_message'][] = $helpID->getMessage();
             }
             // default to the general instruments page
             elseif (empty($helpID)) {
                 $helpID = INSTRUMENTS_ID;

                 // make the link to create documentation
                 $tpl_data['hash'] = $hash;
                 $tpl_data['query'] = $_SERVER['QUERY_STRING'];

                 // make the topic
                 $topic = makeTopic();
                 if (PEAR::isError($topic)) {
                     $tpl_data['error_message'][] = $topic->getMessage();
                 } else {
                     $tpl_data['topic'] = $topic;
                 }
             }
         } else {
             $helpID = FRONTPAGE_ID;
         }
     }
        
     // output the help file
     $help_file =& HelpFile::factory($helpID);
     if (PEAR::isError($help_file)) {
         $tpl_data['error_message'][] = $help_file->getMessage();
     } else {
         // get the help file's data
         $tpl_data['help_file'] = $help_file->toArray();
         $tpl_data['related_links'] = $help_file->relationData();
         if (PEAR::isError($tpl_data['related_links'])) {
             $tpl_data['error_message'][] = $tpl_data['related_links']->getMessage();
         }
         $tpl_data['subtopics'] = $help_file->childData(1);
         if (PEAR::isError($tpl_data['subtopics'])) {
             $tpl_data['error_message'][] = $tpl_data['subtopics']->getMessage();
         }
         $tpl_data['parent'] = $help_file->parentData();
         if (PEAR::isError($tpl_data['parent'])) {
             $tpl_data['error_message'][] = $tpl_data['parent']->getMessage();
         }
     }
        
     // set the template
     $tpl_data['pagetitle'] = $tpl_data['help_file']['topic'];
     $template_suffix = '_view';
     $tpl_data['menu'] = true;
     break;
}

// list the main manual sections
$frontpage =& HelpFile::factory(FRONTPAGE_ID);
if (PEAR::isError($frontpage)) {
    $tpl_data['error_message'][] = $frontpage->getMessage();
} else {
    $tpl_data['sections'] = $frontpage->childData(1);
}

// set editorial privileges
$tpl_data['editor'] = $user->hasPermission('context_help');

// add links to common help files
$tpl_data['frontpage']['helpID'] = FRONTPAGE_ID;
$tpl_data['instruments']['helpID'] = INSTRUMENTS_ID;
$tpl_data['howto']['helpID'] = HOWTO_ID;
$tpl_data['guide']['helpID'] = GUIDELINES_ID;

//Output template using Smarty
$smarty = new Smarty_neurodb;
$smarty->assign($tpl_data);
// get the right section of the page
if (isset($template_suffix)) {
    $smarty->assign('page_data', $smarty->fetch("help/help$template_suffix.tpl"));
}
$smarty->display('help/help.tpl');

ob_end_flush();

/*
 * Local functions
 */

/**
 * Makes a hash based on requested information
 *
 * @return string MD5 hash
 * @access public
 */
function makeHash()
{
    $hash = '';
    
    // base the hash on the request
    if (!empty($_REQUEST['test_name'])) {
        $hash .= $_REQUEST['test_name'];
    }
    if (!empty($_REQUEST['subtest'])) {
        $hash .= $_REQUEST['subtest'];
    }

    return (!empty($hash)) ? md5($hash) : NULL;
}


/**
 * Makes a default name for the topic
 *
 * @return string
 * @throws PEAR_Error
 * @access public
 */
function makeTopic()
{
    // create DB object
    $DB =& Database::singleton();
    if(PEAR::isError($DB)) {
        return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
    }
    
    // initiate the topic's title
    $topic = array();

    // try to base the topic on the full names, otherwise settle for 
    if (!empty($_REQUEST['test_name'])) {
      $query = "SELECT topic FROM help WHERE hash = :Test_Name";
      $Where = array('Test_Name'=> md5($_REQUEST['test_name']));
      $topic[0] = $DB->pselectOne($query,$Where);
      if (PEAR::isError($topic[0])) {
            return PEAR::raiseError("Could not get name of test ".$_REQUEST['test_name'].": ".$topic[0]->getMessage());
        }
        if (empty($topic[0])) {
            $topic[0] = ucwords(strtr($_REQUEST['test_name'], '_', ' '));
        }
    }
    if (!empty($_REQUEST['subtest'])) {
        $query = "SELECT Description FROM instrument_subtests WHERE Subtest_name = :Subtest_Name";
        $Where = array('Subtest_Name'=> $_REQUEST['subtest']);

        $topic[1] = $DB->pselectOne($query,$Where);
        if (PEAR::isError($topic[1])) {
            return PEAR::raiseError("Could not get name of subtest ".$_REQUEST['subtest'].": ".$topic[1]->getMessage());
        }
        if (!empty($topic[1])) {
            $topic[1] = ucwords(strtr($_REQUEST['subtest'], '_', ' '));
        }
    }
    $topic = rtrim(implode(' ', $topic));
    
    // set default for new topics
    if (empty($topic)) {
        $topic = 'Put the topic here';
    }

    return $topic;
}

/**
 * Computes the difference of arrays where the left array is multi-dimensional
 *
 * @param  array   left array
 * @param  array   right array
 * @param  array   key from left array
 * @return array
 * @access public
 */
function array_diff_multi($a, $b, $key) {
    $result = array();

    foreach ($a as $v) {
        if (!in_array($v[$key], $b)) {
            $result[] = $v;
        }
    }

    return $result;
}



/**
 * Formats a string as a PCRE pattern
 *
 * @return string
 * @access public
 */
function makePattern(&$item)
{
    $item = "/$item/i";
}
?>
