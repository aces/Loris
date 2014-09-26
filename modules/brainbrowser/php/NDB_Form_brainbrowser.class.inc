<?php
require_once "NDB_Form.class.inc";

// Stub class.. all this does is check permissions, since everything else is
// done in the template/javascript
class NDB_Form_brainbrowser extends NDB_Form
{

    function _hasAccess() 
    {
        return true;
        //$this->_has_perm('superuser');
    }
    // Wrapper to get the user object and check the permission.
    function _has_perm($perm)
    {
        $user =& User::singleton();
        if (PEAR::isError($user)) {
            return PEAR::raiseError("User Error: " .$user->getMessage());
        }
        return $user->hasPermission($perm);
    }
    function brainbrowser()
    {

    }
}
?>
