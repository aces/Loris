<?php

// Stub class.. all this does is check permissions, since everything else is
// done in the template/javascript
class NDB_Form_instrument_builder extends NDB_Form
{

    function _hasAccess() 
    {
        return $this->_has_perm('instrument_builder');
    }
    // Wrapper to get the user object and check the permission.
    function _has_perm($perm)
    {
        $user =& User::singleton();
        return $user->hasPermission($perm);
    }
    function instrument_builder()
    {

    }

    function getJSDependencies() {
        $factory = NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = parent::getJSDependencies();
        return array_merge(
            $depends,
            array(
             $baseurl . "/instrument_builder/js/instrument_builder.instrument.js",
             $baseurl . "/instrument_builder/js/instrument_builder.rules.js",
             $baseurl . "/instrument_builder/js/react.elements.js",
             $baseurl . "/instrument_builder/js/react.questions.js",
             $baseurl . "/instrument_builder/js/react.instrument_builder.js",
             $baseurl . "/js/FileSaver.min.js",
            )
        );
    }
}
?>
