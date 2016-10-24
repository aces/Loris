<?php
/**
 * This file contains a class which encapsulates the concept of a "module"
 * in LORIS.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * The Module class encapsulates all details of a module which are not specific
 * to a certain page.
 *
 * @category Main
 * @package  Loris
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Module
{
    protected $name;
    protected $dir;

    /**
     * Returns a Module instance for the module named $name. The returned
     * value may be a subtype of the base LORIS module class and override
     * it's method.
     *
     * This also sets up PHP class autoloading for the module that is loaded,
     * such that files in the module/php directory can be autoloaded.
     *
     * @param string $name The module name we'd like information about
     *
     * @return a Module
     */
    static public function factory($name)
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();
        $base    = $config->getSetting("base");

        $mpath = "";
        // TODO: Module search path should be a config option.
        if (is_dir($base . "project/modules/$name")) {
            $mpath = $base . "project/modules/$name";
        } else if (is_dir($base . "modules/$name")) {
            $mpath = $base . "modules/$name";
        } else {
                throw new LorisNoSuchModuleException("No such module: $name");
        }

        if (!file_exists($mpath . "/php/module.class.inc")) {
            // Check if there's a module class to see if the module has been
            // updated. This can be removed once support for old Modules has
            // been removed. If it hasn't been updated, fall back on the old
            // style.
            throw new LorisModuleMissingException("$name is missing Module class");
        }
        // Manually do dependency injection for the module's php/ directory,
        // since composer doesn't know anything about our modules and we only
        // want *this* module's classes autoloaded anyways.
        spl_autoload_register(
            function ($class) use ($name,
                $mpath
            ) {
                if (strpos($class, "LORIS\\$name\\") === 0) {
                    $fpath = $mpath . "/php/"
                    . strtolower(substr($class, strlen("LORIS\\$name\\")))
                    . ".class.inc";
                    include $fpath;
                }
            }
        );

        // Manually do the require for the module descriptor because of
        // namespacing
        //require_once $mpath . "/php/Module.class.inc";
        $className = "\LORIS\\$name\Module";
        $cls       = new $className($name);
        $cls->dir  = $mpath;

        return $cls;
    }

    /**
     * Creates a new module instance
     *
     * @param string $name The name of the module
     */
    protected function __construct($name)
    {
        $this->name = $name;
    }

    /**
     * Returns true if this module should be publicly available to people who
     * are not logged in to LORIS.
     *
     * @return false: not that this is not currently possible because main.php
     *         checks that the user is logged in before it calls NDB_Caller.
     */
    public function isPublicModule()
    {
        return false;
    }

    /**
     * Loads a page within this module and calls all necessary setup.
     *
     * @param string $page The name of the page within the module to load.
     *
     * @return a NDB_Page subclass representing this page.
     */
    public function loadPage($page)
    {
        $className = "\LORIS\\" . $this->name . "\\$page";
        error_log("Class name: $className");

        $cls = new $className();
        // Smarty needs the Module name as a parameter to autoload the right
        // templates. Every type of page uses this.
        $cls->Module = $this->name;

        // Hacks so that existing display() functions load the right template
        // for different page types.
        $cls->menu     = $page;
        $cls->template = $page;

        $identifier = isset($_REQUEST['identifier']) ? $_REQUEST['identifier'] : '';
        $commentID  = isset($_REQUEST['commentID']) ? $_REQUEST['commentID'] : '';
        $formname   = $page;
        $cls->setup();
        $cls->_setupPage($this->name, $page, $identifier, $commentID, $formname);

        if (!$cls->_hasAccess()) {
            throw new \LorisException("You do not have access to this page.", 403);
        }

        // Handles form submission
        if (method_exists($cls, 'save')) {
            $cls->save();
        }

        return $cls;
    }

    /**
     * Returns help content for a page in the module.
     *
     * @param string $page The module subpage to get help for.
     *
     * @return string the content of the page help.
     */
    public function getHelp($page)
    {
        $helpFile = $this->dir . "/help/$page.md";
        if (file_exists($helpFile)) {
                return file_get_contents($helpFile);
        }
        return "No help available for $page ($helpFile)";
    }
}
