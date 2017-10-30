<?php
/**
 * Contains NDB_Caller class to dispatch to the appropriate library
 * for the URL being loaded.
 *
 * PHP Version 5
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
    static function &singleton()
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
    * @param string $test_name The object type to load.  The test_name of the
    *                          menu, form or instrument
    * @param string $subtest   The subtest.  The page of the form or instrument.
    * @param string $CommentID The commentid being loaded.
    * @param string $nextpage  A page to forward to on completion of save.
    *                          Used in direct data entry.
    *
    * @return string rendered object, as html
    */
    function load($test_name, $subtest, $CommentID = '', $nextpage=null)
    {
        $factory  = NDB_Factory::singleton();
        $config   = $factory->config();
        $settings = $factory->settings();
        // if no first argument, return
        if (empty($test_name)) {
            return;
        }
        if ($_SERVER['REQUEST_METHOD'] === 'POST'
            && isset($_POST['login'])
        ) {
            header("HTTP/1.1 303 See Other");
            $url  = $settings->getBaseURL();
            $url .= Utility::removeCommonAffix($url, $_SERVER['REQUEST_URI']);
            // sending user to the url that was requested
            header("Location: $url");
            return;
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
            //error_log("Module $mname is missing Module class descriptor. " .
            //     . "Modules missing a Module file will stop working in a future"
            //     . "version of LORIS.");
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
            // Old precedence style for "modules"
            // This (except for instruments and reliability) should be removed
            // in LORIS 18.0 now that all modules are updated, but we forgot
            // to include a warning in the 16.x line so that we could have
            // removed it in 17.0.
            error_log(
                "php/libraries 'modules' are deprecated and will be "
                . " removed in a future release. Please update your code in "
                . "$test_name to use proper LORIS style modules. See the loris-dev"
                . "  mailing list for help if required."
            );
            // it is a menu
            $proj_menu = $base . "project/libraries/NDB_Menu_$test_name.class.inc";
            $php_menu  = $base . "php/libraries/NDB_Menu_$test_name.class.inc";

            $proj_menu_filter = $base . "project/libraries/"
                                      . "NDB_Menu_Filter_$test_name.class.inc";
            $php_menu_filter  = $base . "php/libraries/"
                                      . "NDB_Menu_Filter_$test_name.class.inc";

            $proj_menu_filter_form = $base . "project/libraries/"
                . "NDB_Menu_Filter_Form_$test_name.class.inc";
            $php_menu_filter_form  = $base . "php/libraries/"
                . "NDB_Menu_Filter_Form_$test_name.class.inc";

            if (empty($subtest) && ($this->existsAndRequire($proj_menu)
                || $this->existsAndRequire($php_menu)
                || $this->existsAndRequire($proj_menu_filter)
                || $this->existsAndRequire($php_menu_filter)
                || $this->existsAndRequire($proj_menu_filter_form)
                || $this->existsAndRequire($php_menu_filter_form))
            ) {

                $mode = $_REQUEST['mode'] ?? '';
                $html = $this->loadMenu($test_name, $mode);

                $this->type = 'menu';
                return $html;
            }

            // it is a form
            $proj_form = $base."project/libraries/NDB_Form_$test_name.class.inc";
            $php_form  = $base."php/libraries/NDB_Form_$test_name.class.inc";
            if ($this->existsAndRequire($proj_form)
                || $this->existsAndRequire($php_form)
            ) {

                $identifier = $_REQUEST['identifier'] ?? '';
                $html       = $this->loadForm($test_name, $subtest, $identifier);

                $this->type = 'form';
                return $html;
            }

            // it is a reliability form
            $proj_reliable = $base . "project/reliability/"
                                   . "NDB_Reliability_$test_name.class.inc";
            if ($this->existsAndRequire($proj_reliable)
            ) {

                $html = $this->loadReliability(
                    $test_name,
                    $subtest,
                    $_REQUEST['identifier'],
                    $_REQUEST['reliability_center_id']
                );

                $this->type = 'reliability';
                return $html;
            }

            // it is an instrument
            $phpfile   = $base . "project/instruments/"
                               . "NDB_BVL_Instrument_$test_name.class.inc";
            $linstfile = $base."project/instruments/$test_name.linst";

            if ($this->existsAndRequire($phpfile)
                || $test_name=='instrument_preview'
            ) {
                $html = $this->loadInstrument(
                    $test_name,
                    $subtest,
                    $CommentID,
                    $nextpage
                );

                $this->type = 'instrument';
                return $html;
            } else if (file_exists($linstfile)) {
                $html = $this->loadInstrument($test_name, $subtest, $CommentID);

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
    * @return string HTML for the menu to display.
    */
    function loadMenu($menu, $mode)
    {
        // make an instance of the menu's object
        $menu =& NDB_Menu::factory($menu, $mode);

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
    function loadForm($class, $page, $identifier)
    {
        // make an instance of the form's object
        $form = NDB_Form::factory($class, $page, $identifier);

        if (method_exists($form, 'getControlPanel')) {
            $this->controlPanel = $form->getControlPanel();
        }
        $success = $form->save();

        if (method_exists($form, 'getControlPanel')) {
            $this->controlPanel = $form->getControlPanel();
        }
        $this->page = $form;
        $html       = $form->display();
        return $html;
    }

    /**
     * Renders html for a Reliability Form
     *
     * @param string $class                 The Form to load
     * @param string $page                  The page of the Form to load
     * @param string $identifier            The identifier of the Form
     * @param string $reliability_center_id The id of the center at which the
     *                                      reliability test is being performed.
     *
     * @return string HTML to render to browser
     */
    function loadReliability($class, $page, $identifier, $reliability_center_id)
    {
        // make an instance of the form's object
        $form = NDB_Reliability::reliabilityfactory(
            $class,
            $page,
            $identifier,
            $reliability_center_id
        );

        $success = $form->save();

        $this->page = $form;
        $html       = $form->display();

        return $html;
    }

    /**
    * Renders html for a quickform Instrument
    *
    * @param string $instrumentName      Name of the instrument to load
    * @param string $page                Page (subtest) of the instrument
    * @param string $commentID           CommentID of the instrument to load
    * @param string $redirectToOnSuccess URL to redirect to if the page is loaded
    *                                    successfully.
    *
    * @return string HTML of the page to render.
    */
    function loadInstrument(
        $instrumentName,
        $page,
        $commentID,
        $redirectToOnSuccess=null
    ) {
        if ($page === 'finalpage') {
            $instrument =& NDB_BVL_Instrument::factory(
                $instrumentName,
                $commentID,
                $page
            );

            $this->instrument = $instrument;
            header("Location: $redirectToOnSuccess");
            return "";
        }
        $user =& User::singleton();

        if ($_REQUEST['sessionID']) {
            $timepoint =& TimePoint::singleton($_REQUEST['sessionID']);
        }

        // make an instance of the instrument's object
        $instrument =& NDB_BVL_Instrument::factory(
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
                $_REQUEST['candID'],
                $_REQUEST['sessionID']
            );
        }

        // save instrument form data
        $success = $instrument->save();

        if ($redirectToOnSuccess !== null && $success !== false) {
            header("Location: $redirectToOnSuccess");
            return "";
        }
        // create an instrument status object
        $status  = new NDB_BVL_InstrumentStatus;
        $success = $status->select($commentID);

        // freeze the form to prevent data entry
        if ($status->getDataEntryStatus() != 'In Progress'
            || !$user->hasPermission('data_entry')
            || !in_array(
                $timepoint->getData("CenterID"),
                $user->getData("CenterIDs")
            )
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
     * Checks if a library exists, and requires it if it does.
     *
     * @param string $library name of class to be included.
     *
     * @return bool true if file exists, otherwise false
     */
    function existsAndRequire($library)
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
     * @return none
     */
    function setDataEntryType($type)
    {
        $this->DataEntry = $type;
    }
}
?>
