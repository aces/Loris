<?php
/**
 * This file contains code for editing help content.
 * It holds the processing of adding/updating content
 * for all modules.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Loris
 * @author   Zaliqa Rosli <zaliqa.rosli@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */

namespace LORIS\help_editor;

$user = \User::singleton();
if (!$user->hasPermission('context_help')) {
    header("HTTP/1.1 403 Forbidden");
    exit(
        "You do not have the correct permissions for this operation."
    );
}

$DB = (\NDB_Factory::singleton())->database();

if (!empty($_POST['helpID'])
    && !empty($_POST['title'])
    && !empty($_POST['content'])
) {
    $helpID    = $_POST['helpID'];
    $help_file = HelpFile::factory($helpID);
    // update the help file
    $help_file->update(
        array(
         'topic'   => $_POST['title'],
         'content' => $_POST['content'],
         'updated' => date(
             'Y-m-d h:i:s',
             time()
         ),
        )
    );
} else {
    //content does not exist insert the help file
    if (!empty($_POST['section'])
        && $_POST['subsection'] != 'undefined'
        && empty($_POST['parentID'])
    ) {
        //create parent help section first
        $parentID = HelpFile::insert(
            array(
             'hash'    => md5($_POST['section']),
             'topic'   => "",
             'content' => "Under construction",
             'created' => date(
                 'Y-m-d h:i:s',
                 time()
             ),
            )
        );
         // check errors
    }
    if (!empty($_POST['section'])
        && $_POST['subsection'] != 'undefined'
        && !empty($_POST['parentID'])
    ) {

        // insert the help file
        $helpID = HelpFile::insert(
            array(
             'parentID' => $_POST['parentID'],
             'hash'     => md5($_POST['subsection']),
             'topic'    => $_POST['title'],
             'content'  => $_POST['content'],
             'created'  => date(
                 'Y-m-d h:i:s',
                 time()
             ),
            )
        );

    } else if (!empty($_POST['section'])
        && $_POST['subsection'] == 'undefined'
    ) {
        //default case
        $helpID = HelpFile::insert(
            array(
             'hash'    => md5($_POST['section']),
             'topic'   => $_POST['title'],
             'content' => $_POST['content'],
             'created' => date(
                 'Y-m-d h:i:s',
                 time()
             ),
            )
        );
    }
}

