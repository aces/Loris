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
require_once 'PEAR.php';
require_once 'User.class.inc';
require_once 'NDB_Menu.class.inc';

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
class NDB_Caller extends PEAR
{
    /**
     * Identifies what type of script is being run (menu, form or instrument)
     * @var    string
     */
    var $type;

    /**
     * Determines how data entry is being performed (directly from a study
     * participant, or by a data entry staff.)
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
     * @throws PEAR_Error
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
        // if no first argument, return
        if (empty($test_name)) {
            return;
        }
        if (empty($CommentID) && isset($_REQUEST['commentID'])) {
            $CommentID = $_REQUEST['commentID'];
        }
        // get the files path, aka the base directory
        $config =& NDB_Config::singleton();
        $base   = $config->getSetting('base');

        if (is_dir($base . "modules/$test_name")) {
            // New module style
            // Only supports Menu_Filters and Forms.
            // Modules can not have instruments or reliability.
            set_include_path(
                $base . "project/libraries:"
                . $base . "modules/$test_name:"
                . $base . "modules/$test_name/php:"
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

                $mode = isset($_REQUEST['mode']) ? $_REQUEST['mode'] : '';
                if ($submenu !== null) {
                    $html = $this->loadMenu($submenu, $mode);
                } else {
                    $html = $this->loadMenu($test_name, $mode);
                }
                if (Utility::isErrorX($html)) {
                    return PEAR::raiseError($html->getMessage());
                }

                $this->type = 'menu';
                return $html;
            } else if ($this->existsAndRequire("NDB_Form_$test_name.class.inc")) {
                $identifier = isset($_REQUEST['identifier'])
                    ? $_REQUEST['identifier']
                    : '';
                $html       = $this->loadForm($test_name, $subtest, $identifier);

                if (Utility::isErrorX($html)) {
                    return PEAR::raiseError($html->getMessage());
                }

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

                $mode = isset($_REQUEST['mode']) ? $_REQUEST['mode'] : '';
                $html = $this->loadMenu($test_name, $mode);
                if (Utility::isErrorX($html)) {
                    return PEAR::raiseError($html->getMessage());
                }

                $this->type = 'menu';
                return $html;
            }

            // it is a form
            $proj_form = $base."project/libraries/NDB_Form_$test_name.class.inc";
            $php_form  = $base."php/libraries/NDB_Form_$test_name.class.inc";
            if ($this->existsAndRequire($proj_form)
                || $this->existsAndRequire($php_form)
            ) {

                $identifier = isset($_REQUEST['identifier'])
                    ? $_REQUEST['identifier']
                    : '';
                $html       = $this->loadForm($test_name, $subtest, $identifier);
                if (Utility::isErrorX($html)) {
                    return PEAR::raiseError($html->getMessage());
                }

                $this->type = 'form';
                return $html;
            }

            // it is a reliability form
            $proj_reliable = $base . "project/libraries/"
                                   . "NDB_Reliability_$test_name.class.inc";
            $php_reliable  = $base . "php/libraries/"
                                   . "NDB_Reliability_$test_name.class.inc";
            if ($this->existsAndRequire($proj_reliable)
                || $this->existsAndRequire($php_reliable)
            ) {

                $html = $this->loadReliability(
                    $test_name,
                    $subtest,
                    $_REQUEST['identifier'],
                    $_REQUEST['reliability_center_id']
                );
                if (Utility::isErrorX($html)) {
                    return PEAR::raiseError($html->getMessage());
                }

                $this->type = 'reliability';
                return $html;
            }

            // it is an intrument
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

                if (Utility::isErrorX($html)) {
                    return PEAR::raiseError($html->getMessage());
                }

                $this->type = 'instrument';
                return $html;
            } else if (file_exists($linstfile)) {
                $html = $this->loadInstrument($test_name, $subtest, $CommentID);
                if (Utility::isErrorX($html)) {
                    return PEAR::raiseError($html->getMessage());
                }
                $this->type = 'instrument';
                return $html;
            }
        }

        // it is nothing!
        return PEAR::raiseError(
            "This page ($test_name) is under construction.",
            404
        );
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
        if (Utility::isErrorX($menu)) {
            return PEAR::raiseError($menu->getMessage());
        }

        $success = $menu->setup();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "NDB_Caller::loadMenu() save: ".$success->getMessage()
            );
        }

        if (method_exists($menu, 'getControlPanel')) {
            $this->controlPanel = $menu->getControlPanel();
        }
        $html = $menu->display();
        if (method_exists($menu, 'save')) {
            $success = $menu->save();
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError(
                    "NDB_Caller::loadForm() save: ".$success->getMessage()
                );
            }
        }
        if (Utility::isErrorX($html)) {
            return PEAR::raiseError(
                "NDB_Caller::loadMenu() display: ".$html->getMessage()
            );
        }

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
        if (Utility::isErrorX($form)) {
            return PEAR::raiseError($form->getMessage());
        }

        if (method_exists($form, 'getControlPanel')) {
            $this->controlPanel = $form->getControlPanel();
        }
        $success = $form->save();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "NDB_Caller::loadForm() save: ".$success->getMessage()
            );
        }

        if (method_exists($form, 'getControlPanel')) {
            $this->controlPanel = $form->getControlPanel();
        }
        $html = $form->display();
        if (Utility::isErrorX($html)) {
            return PEAR::raiseError(
                "NDB_Caller::loadForm() display: ".$html->getMessage()
            );
        }

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
        $form = NDB_Reliability::factory(
            $class,
            $page,
            $identifier,
            $reliability_center_id
        );
        if (Utility::isErrorX($form)) {
            return PEAR::raiseError($form->getMessage());
        }

        $success = $form->save();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "NDB_Caller::loadReliability() save: ".$success->getMessage()
            );
        }

        $html = $form->display();
        if (Utility::isErrorX($html)) {
            return PEAR::raiseError(
                "NDB_Caller::loadReliability() display: ".$html->getMessage()
            );
        }

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
            return "<script language='javascript'>"
                . "window.location='$redirectToOnSuccess'"
                . "</script>";
        }
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        if ($_REQUEST['sessionID']) {
            $timepoint =& TimePoint::singleton($_REQUEST['sessionID']);
            if (Utility::isErrorX($timepoint)) {
                return PEAR::raiseError(
                    "NDB_Caller::loadInstrument, Timepoint Error: "
                    .$timepoint->getMessage()
                );
            }
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
        if (Utility::isErrorX($instrument)) {
            return $instrument;
        }

        // save instrument form data
        $success = $instrument->save();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "NDB_Caller::loadInstrument() save: ".$success->getMessage()
            );
        }

        if ($redirectToOnSuccess !== null && $success !== false) {
            return "<script language='javascript'>"
                .   "window.location='$redirectToOnSuccess'"
                . "</script>";
        }
        // create an instrument status object
        $status  = new NDB_BVL_InstrumentStatus;
        $success = $status->select($commentID);
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "Instrument Status Error ($commentID): ".$success->getMessage()
            );
        }

        // freeze the form to prevent data entry
        if ($status->getDataEntryStatus() != 'In Progress'
            || !$user->hasPermission('data_entry')
            || $user->getData("CenterID") != $timepoint->getData("CenterID")
        ) {
            if ($instrument->preview !== true && $this->DataEntry !== 'Direct') {
                $instrument->freeze();
            }
        }

        $html = $instrument->display();
        if (Utility::isErrorX($html)) {
            return PEAR::raiseError(
                "NDB_Caller::loadInstrument() display: ".$html->getMessage()
            );
        }

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
