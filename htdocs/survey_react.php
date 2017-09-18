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

/**
 * Implements the survey page
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class DirectDataEntryMainPage
{
    var $tpl_data = array();

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

        $factory  = NDB_Factory::singleton();
        $config   = $factory->config();
        $settings = $factory->settings();

        $this->tpl_data['baseurl'] = $settings->getBaseURL();
        $this->key = $_REQUEST['key'];

        $DB = Database::singleton();
        $this->SurveyInfo = $DB->pselect(
            "SELECT Status, Test_name, CommentID FROM participant_accounts
            WHERE OneTimePassword=:key",
            array('key' => $this->key)
        );

        if (empty($this->SurveyInfo)) {
            throw new Exception("The given survey doesn't exist", 404);
        } else if (count($this->SurveyInfo) > 1) {
            throw new Exception("Well looks like we made a mistake :(", 500);
        } else if ($this->SurveyInfo[0]['Status'] === 'Complete') {
            throw new Exception("Data has already been submitted.", 403);
        }

        $this->SurveyInfo = $this->SurveyInfo[0];

    }

    /**
     * Handles a request by delegating to the appropriate
     * handle method
     *
     * @return none
     */
    function handleRequest()
    {
        switch($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            $this->handleGET();
            break;
        case 'PUT':
            $this->handlePUT();
            break;
        case 'PATCH':
            $this->handlePATCH();
            break;
        case 'POST':
            $this->handlePOST();
            break;
        default:
            $this->header("HTTP/1.1 501 Not Implemented");
            break;
        }
    }

    /**
     * Handle a GET request. This will render and display the page.
     *
     * @return none
     */
    function handleGET()
    {

        try {
            $this->Instrument = \NDB_BVL_Instrument::factory(
                $this->SurveyInfo['Test_name'],
                $this->SurveyInfo['CommentID'],
                null,
                true
            );
        } catch(\Exception $e) {
            throw new Exception("Instrument not found", 405);
        }

        $this->tpl_data['InstrumentJSON'] = $this->Instrument->toDirectJSON();

        $Values = \NDB_BVL_Instrument::loadInstanceData($this->Instrument);

        unset($Values['CommentID']);
        unset($Values['UserID']);
        // unset($Values['Testdate']);
        unset($Values['Data_entry_completion_status']);

        $this->tpl_data['Values'] = json_encode($Values);

        $this->display();
    }

    /**
     * Handle a PATCH request. This will update a single field
     *
     * @return none
     */
    function handlePATCH() {

        try {
            $this->Instrument = \NDB_BVL_Instrument::factory(
                $this->SurveyInfo['Test_name'],
                $this->SurveyInfo['CommentID'],
                null,
                true
            );
        } catch(\Exception $e) {
            throw new Exception("Instrument not found", 405);
        }

        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        $data            = json_decode($data);
        $instrument_name = $this->Instrument->testName;

        if(count($data) !== 1) {
            // The survey module will only PATCH one variable at a time.
            header("HTTP/1.0 400 Bad Request");
        }

        if ($this->Instrument->validate($data)) {
            try {
                $this->Instrument->_save($data);
                
            } catch (Exception $e) {
                header("HTTP/1.0 400 Bad Request");
            }
        } else {
            $this->Header("HTTP/1.1 403 Forbidden");
            if (!$this->Instrument->determineDataEntryAllowed()) {
                $msg = "Can not update instruments that"
                       . " are flagged as complete";
                // $this->JSON = array('error' => $msg);
            } else {
                // $this->JSON = array("error" => "Could not update.");
            }
        }
    }

    /**
     * Handle a PATCH request. This will update a single field
     *
     * @return none
     */
    function handlePUT() {

        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        $data = json_decode($data, true);
        $subtest = null;

        if($data['page'] > 0) {
            $subtest = $this->SurveyInfo['Test_name'] . "_page" . $data['page'];
        }

        try {
            $this->Instrument = \NDB_BVL_Instrument::factory(
                $this->SurveyInfo['Test_name'],
                $this->SurveyInfo['CommentID'],
                $subtest,
                true
            );
        } catch(\Exception $e) {
            throw new Exception("Instrument not found", 405);
        }

        $this->Instrument->form->directEntry = true;
        $this->Instrument->form->directValues = $data['data'];

        if($this->Instrument->form->validate()) {
            if($data['FinalPage']) {
                echo $this->Instrument->getReactReview();
            } else {
                echo $this->Instrument->toDirectJSON();
            }
        } else {
            header("HTTP/1.0 400 Bad Request");
            echo json_encode($this->Instrument->form->errors);
        }

    }  

    /**
     * Handle a PATCH request. This will update a single field
     *
     * @return none
     */
    function handlePOST() {
        
        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        $data = json_decode($data, true);

        try {
            $this->Instrument = \NDB_BVL_Instrument::factory(
                $this->SurveyInfo['Test_name'],
                $this->SurveyInfo['CommentID'],
                null,
                true
            );
        } catch(\Exception $e) {
            throw new Exception("Instrument not found", 405);
        }

        $valid = $this->Instrument->directEntryValidation();

        if($valid === true) {
            header("HTTP/1.0 200 OK");
            $DB = Database::singleton();
            $DB->update(
                "participant_accounts",
                array('Status' => "Complete"),
                array('OneTimePassword' => $this->key)
            );
        } else {
            header("HTTP/1.0 400 Bad Request");
            echo json_encode($valid);
        }

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
            $this->handleRequest();
        } catch(Exception $e) {
            $this->displayError($e);
        }
    }

    /**
     * Loads the correct page and renders it to the user
     *
     * @return none
     */
    function display()
    {
        $smarty = new Smarty_neurodb;
        $smarty->assign($this->tpl_data);
        $smarty->display('directentryreact.tpl');
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
}

if (!class_exists('UnitTestCase')) {
    $Runner = new DirectDataEntryMainPage();
    $Runner->run();
}
?>
