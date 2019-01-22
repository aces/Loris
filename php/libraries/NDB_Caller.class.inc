<?php declare(strict_types=1);
/**
 * Contains NDB_Caller class to dispatch to the appropriate library
 * for the URL being loaded.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

/**
 * Caller class
 *
 * Dispatches to the right library to return HTML for the type of page being
 * loaded.
 *
 * @category Main
 * @package  Main
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class NDB_Caller
{
    /**
     * Identifies what type of script is being run (menu, form or instrument)
     *
     * @var string
     */
    var $type;

    /**
     * Determines how data entry is being performed (directly from a study
     * participant, or by a data entry staff.)
     *
     * @var string
     */
    var $DataEntry;

    /**
     * The NDB_BVL_Instrument instantiation of the instrument which was loaded.
     */
    var $instrument;

    /**
     * Singleton method
     *
     * @return NDB_Caller
     * @access public
     * @static
     */
    static function &singleton(): NDB_Caller
    {
        static $instance;
        if (is_null($instance)) {
            $instance = new NDB_Caller();
        }
        return $instance;
    }

    /**
     * Renders the called menu, form or the instrument into html
     *
     * @param string      $test_name The object type to load.  The test_name of the
     *                               menu, form or instrument
     * @param string      $subtest   The subpage of the module to load
     * @param string      $CommentID The CommentID identifier to load the page with
     * @param string|null $nextpage  The page to go to after submitting this
     * @param bool        $anonymous True if the user has not logged in.
     *
     * @return string rendered object, as html
     */
    function load(
        string $test_name,
        string $subtest,
        string $CommentID='',
        ?string $nextpage=null,
        bool $anonymous=true
    ): string {
        $factory  = NDB_Factory::singleton();
        $config   = $factory->config();
        $settings = $factory->settings();
        // if no first argument, return
        if (empty($test_name)) {
            return '';
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST'
            && isset($_POST['login']) && $test_name != 'login'
        ) {
            header("HTTP/1.1 303 See Other");
            $url  = $settings->getBaseURL();
            $url .= self::removeCommonAffix($url, $_SERVER['REQUEST_URI']);
            // sending user to the url that was requested
            header("Location: $url");
            return '';
        }
        if (empty($CommentID) && isset($_REQUEST['commentID'])) {
            $CommentID = $_REQUEST['commentID'];
        }
        // get the files path, aka the base directory
        $base = $config->getSetting('base');

        if (!empty($_REQUEST['Module'])) {
             // TODO: We should transition our code to refer to
             //       $_REQUEST['Module'] instead of test_name for modules.
             //       test_name only makes sense in the context of
             //       instruments. It's only for legacy reasons that there's
             //       no way to distinguish them. After transitioning our
             //       code, module detection can be simplified and remove
             //       the magic is_dir guessing.
             $mname = $_REQUEST['Module'];
        } else {
             // For legacy reasons, we still need to support test_name. We
             // should eventually rename the parameters to NDB_Caller..
             $mname = $test_name;
        }
        try {
            // This will throw an exception if the module name doesn't exist, so
            // below this we can assume a valid module.
            $m = Module::factory($mname);
            if (!$m->isPublicModule() && $anonymous) {
                throw new Exception(403);
            }
            if (!empty($subtest)) {
                // We shouldn't care what type of page something is, we should
                // just load it and let the module do whatever it wants.
                $p = $subtest;
            } else {
                // There was no subtest, so load the page with the same name as the
                // module.
                $p = $mname;
            }
            $this->page = $m->LoadPage($p);

            // FIXME: These two method_exists calls were hacks that were previously
            // in the load* classes, which for now need to be preserved for
            // compatibility with existing modules.
            //
            // The proper solution is probably to re-write anything that uses them
            // in React.
            if (method_exists($this->page, 'getControlPanel')) {
                $this->controlPanel = $this->page->getControlPanel();
            }
            if (method_exists($this->page, 'getFeedbackPanel')) {
                $this->feedbackPanel = $this->page->getFeedbackPanel(
                    $_REQUEST['candID'],
                    $_REQUEST['sessionID'] ?? null
                );
            }
            return $this->page->display();
        } catch (LorisModuleMissingException $e) {
            //print_r($e);
            // There was no module, so fall back on the old way of doing things.
        } catch (LorisNoSuchModuleException $e) {
            // Its an instrument, not a module
        }
        if (is_dir($base . "project/modules/$test_name")
            || is_dir($base . "modules/$test_name")
        ) {
            // Modules should be updated to use the (much simpler!)
            // Module->LoadPage() above. Since it's new and work hasn't even
            // started yet, we need to keep compatability. Uncomment this error
            // sometime in the 17.x line, so by LORIS 18.0 we can remove all
            // this code. If we do it right now, absolutely every page will
            // include an error.. at the very least, this should be uncommented
            // in 18.0 so that we can delete the old code for 19.0.
            error_log(
                "Module $test_name is missing Module class descriptor. "
                . "Modules missing a Module file will stop working in a future"
                . "version of LORIS."
            );
            $ModuleDir = is_dir($base . "project/modules/$test_name")
                ? $base . "project/modules/$test_name"
                : $base . "modules/$test_name";
            // Newer module style
            // Only supports Menu_Filters and Forms.
            // Modules can not have instruments or reliability.
            set_include_path(
                "$ModuleDir/php:"
                . get_include_path()
            );
            $submenu = null;
            if (!empty($_REQUEST['submenu'])) {
                $submenu = $_REQUEST['submenu'];
                $subtest = $submenu;
            }

            $menu_filter_testname = "NDB_Menu_Filter_$test_name.class.inc";
            $menu_form_testname   = "NDB_Menu_Filter_Form_$test_name.class.inc";
            $menu_testname        = "NDB_Menu_$test_name.class.inc";

            $menu_filter_form_subtest = "NDB_Menu_Filter_Form_$submenu.class.inc";

            if (((empty($subtest)
                && $submenu === null)
                && ($this->existsAndRequire($menu_filter_testname)
                || $this->existsAndRequire($menu_form_testname)
                || $this->existsAndRequire($menu_testname))) || ($submenu !== null
                && ($this->existsAndRequire("NDB_Menu_Filter_$submenu.class.inc")
                || $this->existsAndRequire("NDB_Menu_$submenu.class.inc")
                || $this->existsAndRequire($menu_filter_form_subtest)))
            ) {
                // No subtest, load the menu

                $mode = $_REQUEST['mode'] ?? '';
                if ($submenu !== null) {
                    $html = $this->loadMenu($submenu, $mode);
                } else {
                    $html = $this->loadMenu($test_name, $mode);
                }

                $this->type = 'menu';
                return $html;
            } else if ($this->existsAndRequire("NDB_Form_$test_name.class.inc")) {
                $identifier = $_REQUEST['identifier'] ?? '';
                $html       = $this->loadForm($test_name, $subtest, $identifier);

                $this->type = 'form';
                return $html;
            }
            // Exit to make sure we don't accidentally mix old style and
            // new style. If something is a module, it should remain a
            // module.
            error_log("Could not load Loris module $test_name.");
            exit(-1);
        } else {
            // it is an instrument
            $phpfile   = $base . "project/instruments/"
                               . "NDB_BVL_Instrument_$test_name.class.inc";
            $linstfile = $base."project/instruments/$test_name.linst";
            if ($this->existsAndRequire($phpfile)
                || $test_name=='instrument_preview'
            ) {
                if ($this->DataEntry === 'Direct') {
                    $html = $this->loadInstrumentDirect(
                        $test_name,
                        $subtest,
                        $CommentID,
                        $nextpage
                    );
                } else {
                    $html = $this->loadInstrument(
                        $test_name,
                        $subtest,
                        $CommentID,
                        $nextpage
                    );
                }
                $this->type = 'instrument';
                return $html;
            } else if (file_exists($linstfile)) {
                if ($this->DataEntry === 'Direct') {
                    $html = $this->loadInstrumentDirect(
                        $test_name,
                        $subtest,
                        $CommentID
                    );
                } else {
                    $html = $this->loadInstrument(
                        $test_name,
                        $subtest,
                        $CommentID
                    );
                }

                $this->type = 'instrument';
                return $html;
            }
        }

        // it is nothing!
        throw new Exception("This page ($test_name) is under construction.", 404);
    }

    /**
     * Renders html for a Menu
     *
     * @param string $menu The Menu being loaded
     * @param string $mode The Menu mode
     *
     * @return string HTML for the menu to display
     */
    function loadMenu(string $menu, string $mode): string
    {
        // make an instance of the menu's object
        $menu = NDB_Menu::factory($menu, $mode);

        $success = $menu->setup();

        if (isset($_REQUEST['format'])) {
            switch ($_REQUEST['format']) {
            case 'csv':
                if (method_exists($menu, "getCSVData")) {
                    $csv_data = $menu->getCSVData();
                    header("HTTP/1.1 200 OK");
                    print $csv_data;
                    exit(2);
                } else {
                    error_log(
                        "ERROR: This download of this table's data is "
                        . "not yet implemented."
                    );
                    header("HTTP/1.1 501 Not Implemented");
                    exit(5);
                }
                break;
            case 'json':
                header('Content-Type: application/json');
                print $menu->toJSON();
                exit(0);
                break;
            default:
                error_log(
                    "ERROR: This format is not yet supproted."
                );
                header("HTTP/1.1 501 Not Implemented");
                exit(5);
            }
        }

        if (method_exists($menu, 'getControlPanel')) {
            $this->controlPanel = $menu->getControlPanel();
        }
        if (method_exists($menu, 'getFeedbackPanel')) {
            $this->feedbackPanel = $menu->getFeedbackPanel(
                $_REQUEST['candID'],
                $_REQUEST['sessionID'] ?? null
            );
        }
        if (method_exists($menu, 'save')) {
            $success = $menu->save();
        }
        $this->page = $menu;
        $html       = $menu->display();

        return $html;
    }

    /**
     * Renders html for a Form
     *
     * @param string $class      The Form to load
     * @param string $page       The page of the Form to load
     * @param string $identifier The identifier of the Form
     *
     * @return string HTML to return to browser
     */
    function loadForm(string $class, string $page, string $identifier): string
    {
        // make an instance of the form's object
        $form = NDB_Form::factory($class, $page, $identifier);

        if (method_exists($form, 'getControlPanel')) {
            $this->controlPanel = $form->getControlPanel();
        }

        $form->save();

        if (method_exists($form, 'getControlPanel')) {
            $this->controlPanel = $form->getControlPanel();
        }
        $this->page = $form;
        $html       = $form->display();
        return $html;
    }

    /**
     * Renders html for an Instrument
     *
     * @param string      $instrumentName      Name of the instrument to load
     * @param string      $page                Page (subtest) of the instrument
     * @param string      $commentID           CommentID of the instrument to load
     * @param string|null $redirectToOnSuccess URL to redirect to if the page is
     *                                         loaded successfully.
     *
     * @return string HTML of the page to render.
     */
    function loadInstrument(
        string $instrumentName,
        string $page,
        string $commentID,
        ?string $redirectToOnSuccess=null
    ): string {
        if ($page === 'finalpage') {
            $instrument = \NDB_BVL_Instrument::factory(
                $instrumentName,
                $commentID,
                $page
            );

            $this->instrument = $instrument;
            header("Location: $redirectToOnSuccess");
            return "";
        }
        $user = User::singleton();

        if ($_REQUEST['sessionID']) {
            $timepoint = \TimePoint::singleton(
                intval($_REQUEST['sessionID'])
            );
        }

        // make an instance of the instrument's object
        $instrument = NDB_BVL_Instrument::factory(
            $instrumentName,
            $commentID,
            $page
        );

        $this->instrument = $instrument;

        if (method_exists($instrument, 'getControlPanel')) {
            $this->controlPanel = $instrument->getControlPanel();
        }
        if (method_exists($instrument, 'getFeedbackPanel')) {
            $this->feedbackPanel = $instrument->getFeedbackPanel(
                intval($_REQUEST['candID']),
                intval($_REQUEST['sessionID'])
            );
        }

        // save instrument form data
        $success = false;
        if (!isset($_REQUEST['ClearInstrument'])) {
            // If ClearInstrument was set, it's the control
            // panel, not the instrument that needs to be
            // saved.
            $success = $instrument->save();
        }

        if ($redirectToOnSuccess !== null && $success !== false) {
            header("Location: $redirectToOnSuccess");
            return "";
        }
        // create an instrument status object
        $status = new NDB_BVL_InstrumentStatus;
        $status->select($commentID);

        // freeze the form to prevent data entry
        if ($status->getDataEntryStatus() != 'In Progress'
            || !$user->hasPermission('data_entry')
            || (isset($timepoint)
            && !in_array(
                $timepoint->getData("CenterID"),
                $user->getData("CenterIDs")
            ))
        ) {

            if ($instrument->preview !== true && $this->DataEntry !== 'Direct') {
                $instrument->freeze();
            }
        }

        $this->page = $instrument;
        $html       = $instrument->display();

        return $html;
    }

    /**
     * Renders html for a direct data entry Instrument
     *
     * @param string      $instrumentName      Name of the instrument to load
     * @param string      $page                Page (subtest) of the instrument
     * @param string      $commentID           CommentID of the instrument to load
     * @param string|null $redirectToOnSuccess URL to redirect to if the page is
     *                                         loaded successfully.
     *
     * @return string HTML of the page to render.
     */
    function loadInstrumentDirect(
        string $instrumentName,
        string $page,
        string $commentID,
        ?string $redirectToOnSuccess=null
    ): string {
        if ($page === 'finalpage') {
            $instrument = NDB_BVL_Instrument::factory(
                $instrumentName,
                $commentID,
                $page
            );

            $this->instrument = $instrument;
            header("Location: $redirectToOnSuccess");
            return "";
        }

        // make an instance of the instrument's object
        $instrument = NDB_BVL_Instrument::factory(
            $instrumentName,
            $commentID,
            $page
        );

        $this->instrument = $instrument;
        $success          = $instrument->save();
        if ($redirectToOnSuccess !== null && $success !== false) {
            header("Location: $redirectToOnSuccess");
            return "";
        }
        // create an instrument status object
        $status = new NDB_BVL_InstrumentStatus;
        $status->select($commentID);

        $this->page = $instrument;
        $html       = $instrument->display();

        return $html;
    }

    /**
     * Checks if a library exists, and requires it if it does.
     *
     * @param string $library name of class to be included.
     *
     * @return bool true if file exists, otherwise false
     */
    function existsAndRequire(string $library): bool
    {
        if (stream_resolve_include_path($library) !== false) {
            include_once $library;
            return true;
        }

        return false;
    }

    /**
     * Sets the data entry type being performed.
     *
     * @param string $type "normal" or "direct", the type of data entry
     *                     being performed.
     *
     * @return void
     */
    function setDataEntryType(string $type): void
    {
        $this->DataEntry = $type;
    }

    /**
     * This function takes two strings. If one string has a
     * suffix which is a prefix of the other, it will return
     * the part of the second string minus the common
     * suffix/prefix.
     *
     * This is mostly used for removing pieces of a relative
     * URL in a way that can be concatinated to an absolute
     * URL without duplicating components. ie.
     *
     * removeCommonAffix("http://localhost/foo", "/foo/bar")
     *
     * would return "/bar", which can then be concatenated
     * to "http://localhost/foo" to form the URL
     * "http://loclahost/foo/bar"
     *
     * @param string $suffixStr The string which may contain a common affix
     *                          at the end of the string
     * @param string $prefixStr The string to compare the suffix string to
     *
     * @return string $prefixStr minus the largest common piece of $suffixStr
     */
    static function removeCommonAffix(
        string $suffixStr,
        string $prefixStr
    ): string {
        $lastFound = '';
        // Start from the end of $suffixStr and work backwords, to make sure
        // it fails fast in the event that there's nothing in common.
        for ($i = strlen($suffixStr)-1; $i >= 0; $i -= 1) {
            $piece = substr($suffixStr, $i);
            $found = strpos($prefixStr, $piece);
            if ($found === 0) {
                // The current substring starts at index 0 in prefixStr, so we
                // know that it's a prefix. Keep track of it.
                $lastFound = $piece;
            } else if ($found === false) {
                // The current substring doesn't appear anywhere in
                // $prefixStr, so return the last known complete prefix.
                // There's no chance that a larger string is going to
                // be a prefix either.
                return substr($prefixStr, strlen($lastFound));
            } else {
                // Otherwise, the string appears somewhere, but isn't at the
                // beginning of the string. Keep going because this might be
                // the middle of a larger prefix.
            }
        }
        return $prefixStr;
    }
}

