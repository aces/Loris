<?php
/**
 * Created by PhpStorm.
 * User: evanmcilroy
 * Date: 15-06-05
 * Time: 12:52 PM
 */

require_once "NDB_Form.class.inc";

class NDB_Form_bvl_feedback extends NDB_Form
{
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: " . $user->getMessage());
        }

        $site =& Site::singleton($user->getData('CenterID'));
        if (Utility::isErrorX($site)) {
            return PEAR::raiseError("Unable to construct the list_of_sites array: " . $site->getMessage());
        }
        if ($site->isStudySite()) {
            return $user->hasPermission('bvl_feedback');
        }

        return false;
    }

    function bvl_feedback()
    {
        $field_names = Utility::getSourcefields($_REQUEST['test_name']);


    }
}