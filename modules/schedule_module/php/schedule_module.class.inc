<?php
namespace LORIS\schedule_module;
class schedule_module extends \NDB_Page {
    public $skipTemplate = true;

    function _hasAccess(\User $user) : bool
    {

        return ($user->hasPermission('schedule_module'));
    }

    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
                $deps,
                array(
                    $baseURL . "/schedule_module/js/index.js",
                     )
                );
    }

    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/schedule_module/css/schedule_module.css")
        );
    }
}
