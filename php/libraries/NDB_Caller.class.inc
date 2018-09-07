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
    * @param string $subtest   The subpage of the module to load.
    * @param string $CommentID The CommentID identifier to load the page with
    * @param string $nextpage  The page to go to after submitting this page (surveys
    *                          only)
    * @param string $anonymous True if the user has not logged in.
    *
    * @return string rendered object, as html
    */
    function load(
        $test_name,
        $subtest,
        $CommentID='',
        $nextpage=null,
        $anonymous=true
    ) {
        // Load is only used for survey instruments anymore, so we just
        // directly try to load either the linst or PHP class.
        $phpfile   = $base . "project/instruments/"
            . "NDB_BVL_Instrument_$test_name.class.inc";
        $linstfile = $base."project/instruments/$test_name.linst";
        if ($this->existsAndRequire($phpfile)
            || $test_name=='instrument_preview'
        ) {
            $html       = $this->loadInstrumentDirect(
                $test_name,
                $subtest,
                $CommentID,
                $nextpage
            );
            $this->type = 'instrument';
            return $html;
        } else if (file_exists($linstfile)) {
            $html       = $this->loadInstrumentDirect(
                $test_name,
                $subtest,
                $CommentID
            );
            $this->type = 'instrument';
            return $html;
        }
        // it is nothing!
        throw new Exception("This page ($test_name) is under construction.", 404);
    }

    /**
     * Renders html for a direct data entry Instrument
     *
     * @param string $instrumentName      Name of the instrument to load
     * @param string $page                Page (subtest) of the instrument
     * @param string $commentID           CommentID of the instrument to load
     * @param string $redirectToOnSuccess URL to redirect to if the page is loaded
     *                                    successfully.
     *
     * @return string HTML of the page to render.
     */
    function loadInstrumentDirect(
        $instrumentName,
        $page,
        $commentID,
        $redirectToOnSuccess=null
    ) {
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
        $status  = new NDB_BVL_InstrumentStatus;
        $success = $status->select($commentID);

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
     * @return void
     */
    function setDataEntryType($type)
    {
        $this->DataEntry = $type;
    }
}
?>
