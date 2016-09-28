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

    /**
     * Include additional CSS files:
     *  1. instrument_builder.css
     *
     * @return array of CSS to be inserted
     */
    function getCSSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [$baseURL . "/instrument_builder/css/instrument_builder.css"]
        );
    }

    /**
     * Include additional JS files
     *
     * @return array of JS to be inserted
     */
    function getJSDependencies() {
        $factory = NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        $depends = parent::getJSDependencies();
        return array_merge(
            $depends,
            array(
             $baseurl . "/instrument_builder/js/instrument_builder.instrument.js",
             $baseurl . "/instrument_builder/js/instrument_builder.rules.js",
             $baseurl . "/instrument_builder/js/react.questions.js",
             $baseurl . "/instrument_builder/js/react.instrument_builder.js",
             $baseurl . "/js/FileSaver.min.js",
             $baseurl . "/js/components/Tabs.js",
            )
        );
    }
}
?>
