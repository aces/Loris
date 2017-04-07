<?php

namespace LORIS\single_page_module;

class single_page_module extends \NDB_Page
{
    /**
     * Determine whether the user has permission to view this page
     *
     * @return bool whether the user has access
     */
    function _hasAccess()
    {
        return true;
    }

    /**
     * Overrides base getJSDependencies() to add React app
     *
     * @return an array of extra JS files that this page depends on
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
                $baseURL . "/single_page_module/js/index.js",
            )
        );
    }

    function display() {
        return null;
    }

}
?>