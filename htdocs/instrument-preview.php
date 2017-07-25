<?php
/**
 * This implements the portion of Loris which is user-facing for the survey
 * module. Survey participants should have received an email with a URL
 * pointing to this page with a unique one-time key, and this page will handle
 * loading the correct instrument, displaying it to them in a user-friendly
 * manner and saving the data to the database.
 *
 * PHP Version 5
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
ini_set('default_charset', 'utf-8');
require_once __DIR__ . "/../vendor/autoload.php";
require_once 'NDB_Config.class.inc';
require_once 'Smarty_hook.class.inc';
require_once 'NDB_Caller.class.inc';
require_once 'NDB_Client.class.inc';
require_once 'NDB_BVL_Instrument.class.inc';
require_once 'Log.class.inc';

/**
 * Implements the survey page
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class InstrumentPreview
{
    var $key;

    var $TestName;
    var $Subtest;

    var $NumPages;
    var $NextPageNum;
    var $PrevPageNum;

    var $tpl_data;
    var $caller;

    /**
     * Initialize all of the class variables and things required from the
     * REQUEST.
     *
     * @return none, but as a side-effect modifies class
     */
    function initialize()
    {
        ob_start('ob_gzhandler');
        $client = new NDB_Client();
        $client->makeCommandLine();
        $client->initialize();
    }

    /**
     * Run the current page, consists of initializing and then displaying the page
     *
     * @return none
     */
    function run()
    {
        try {
            $this->initialize();
            $this->display();
        } catch(Exception $e) {
            $this->displayError($e);
        }
    }

    /**
     * Get the CommentID associated with the current page's key
     *
     * @return string a valid CommentID for this page
     */
    function getCommentID()
    {
        $DB = Database::singleton();
        return $DB->pselectOne(
            "SELECT CommentID FROM participant_accounts
            WHERE OneTimePassword=:key AND Status <> 'Complete'",
            array(
             'key' => $this->key,
            )
        );
    }

    /**
     * Display an error page in the event of an exception.
     *
     * @param Exception $e The exception which was thrown by the code
     *
     * @return none, but as a side-effect changes the HTTP return code
     */
    function displayError($e)
    {
        switch($e->getCode())
        {
        case 404:
            header("HTTP/1.1 404 Not Found");
            break;
        case 403:
            header("HTTP/1.1 403 Forbidden");
            break;
        }

        $this->tpl_data['workspace'] = $e->getMessage();
        $this->tpl_data['complete']  = false;
        $smarty = new Smarty_neurodb;
        $smarty->assign($this->tpl_data);
        $smarty->display('directentry.tpl');

    }

    /**
     * Loads the correct page and renders it to the user
     *
     * @return none
     */
    function display()
    {
        $factory = NDB_Factory::singleton();
        $config  = $factory->config();
        $base    = $config->getSetting('base');

        $instruments = [];

        foreach (glob($base."project/instruments/*.json") as $file) {
            $instrument = json_decode(file_get_contents($file), true);
            $instrument["Elements"] = \Loris\Behavioural\NDB_BVL_Instrument_JSON::inlineCalcFormulas($instrument["Elements"]);
            array_push($instruments, $instrument);
        }

        $this->tpl_data['lang'] = $_REQUEST['lang'] ? $_REQUEST['lang'] : 'en-ca';
        $this->tpl_data['instruments'] = htmlspecialchars(json_encode($instruments));
        $smarty = new Smarty_neurodb;
        $smarty->assign($this->tpl_data);
        $smarty->display('instrument-preview.tpl');
    }
}

if (!class_exists('UnitTestCase')) {
    $Runner = new InstrumentPreview();
    $Runner->run();
}
?>
