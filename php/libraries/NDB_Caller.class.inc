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
    public $type;

    public $page;
    public $controlPanel;
    public $feedbackPanel;

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
     * @param \LORIS\LorisInstance $loris     The LORIS instance the call is being
     *                                        handled for.
     * @param string               $test_name The object type to load.  The test_name
     *                                        of the menu, form or instrument
     * @param string               $subtest   The subpage of the module to load
     * @param string               $CommentID The CommentID identifier to load the
     *                                        page with
     * @param ?string              $nextpage  The page to go to after submitting
     *                                        this
     * @param bool                 $anonymous True if the user has not logged in
     *
     * @return string rendered object, as html
     */
    function load(
        \LORIS\LorisInstance $loris,
        $test_name,
        $subtest,
        $CommentID='',
        $nextpage=null,
        $anonymous=true
    ) {
        $config = \NDB_Factory::singleton()->config();
        $base   = $config->getSetting('base');

        // Load is only used for survey instruments anymore, so we just
        // directly try to load either the linst or PHP class.
        $phpfile   = $base . "project/instruments/"
            . "NDB_BVL_Instrument_$test_name.class.inc";
        $linstfile = $base."project/instruments/$test_name.linst";
        if ($this->existsAndRequire($phpfile) || file_exists($linstfile)) {
            $html       = $this->loadInstrumentDirect(
                $loris,
                $test_name,
                $subtest,
                $CommentID,
                $nextpage
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
     * @param \LORIS\LorisInstance $loris               The LORIS instance the
     *                                                  survey is being loaded
     *                                                  for
     * @param string               $instrumentName      Name of the instrument to
     *                                                  load
     * @param string               $page                Page (subtest) of the
     *                                                  instrument
     * @param string               $commentID           CommentID of the instrument
     *                                                  to load
     * @param string|null          $redirectToOnSuccess URL to redirect to if the
     *                                                  page is loaded successfully.
     *
     * @return string HTML of the page to render.
     */
    function loadInstrumentDirect(
        \LORIS\LorisInstance $loris,
        string $instrumentName,
        string $page,
        string $commentID,
        ?string $redirectToOnSuccess=null
    ): string {
        // make an instance of the instrument's object
        $instrument = NDB_BVL_Instrument::factory(
            $loris,
            $instrumentName,
            $commentID,
            $page
        );

        $this->instrument = $instrument;
        $success          = $page === "finalpage" ? true : $instrument->save();

        if ($redirectToOnSuccess !== null && $success !== false) {
            header("Location: $redirectToOnSuccess");
            return "";
        }
        // create an instrument status object
        $status = new NDB_BVL_InstrumentStatus($loris);
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

