<?php
/**
 * This is used by the Loris survey module to retrieve the email
 * template for the current instrument. It is used in the survey_accounts
 * page via AJAX to update the email template with the current page
 *
 * PHP Version 5
 *
 * @category Survey
 * @package  Loris
 * @author   Jordan Stirling <jstirling91@gmail.com>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris/
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
                '',
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

        // Unset score values
        $json_instrument = json_decode($this->tpl_data['InstrumentJSON']);
        $this->unsetScores($Values, $json_instrument->Elements, $json_instrument->ScoreLabels);

        $this->tpl_data['Values'] = json_encode($Values);
        $this->tpl_data['InstrumentJSON'] = json_encode($json_instrument);

        echo json_encode($this->tpl_data); 

        // $this->display();
    }

    /**
     * Unsets Score values so that they are not transferred to the frontend
     *
     * @return none
     */ 
    function unsetScores(&$values, &$elements, $scoreLabels) {
        foreach ($elements as $element) {
            if($element->Type === 'ElementGroup') {
                $this->unsetScores($values, $element->Elements, $scoreLabels);
                if(in_array($element->Description, $scoreLabels)) {
                    $this->deleteElement($element, $elements);
                }
            } else if(
                $element->Type === 'label' &&
                array_key_exists($element->Name, $values)
            ) {
                unset($values[$element->Name]);
            }
        }
    }

    /**
     * Remove an element from an array.
     *
     * @param string|int $element
     * @param array $array
     */
    function deleteElement($element, &$array){
        $index = array_search($element, $array);
        if($index !== false){
            unset($array[$index]);
        }
    }

    /**
     * Handle a PATCH request. This will update a single field
     *
     * @return none
     */
    function handlePATCH() {


        $s=$this->SurveyInfo['Test_name'];
        try {
            $this->Instrument = \NDB_BVL_Instrument::factory(
                $this->SurveyInfo['Test_name'],
                $this->SurveyInfo['CommentID'],
                '',
                true
            );
        } catch(\Exception $e) {
            throw new Exception("Instrument  not found", 405);
        }

        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        $data            = json_decode($data,true);
        $instrument_name = $this->Instrument->testName;

        if(count($data) !== 1) {
            // The survey module will only PATCH one variable at a time.
            header("HTTP/1.0 400 Bad Request");
        }


        if ($this->Instrument->validate($data)) {
            try {
                $this->Instrument->_save($data);
                //On Saving Data; the status has to be updated
                $this->updateStatus('In Progress');

                
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
        $subtest = '';

        if($data['page'] !== 0) {
            $subtest = $data['page'];
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
                '',
                true
            );
        } catch(\Exception $e) {
            throw new Exception("Instrument not found", 405);
        }

        $valid = $this->Instrument->directEntryValidation();

        if($valid === true) {
            $this->Instrument->score();
            header("HTTP/1.0 200 OK");
            $DB = Database::singleton();
            $DB->update(
                "participant_accounts",
                array('Status' => "Complete"),
                array('OneTimePassword' => $this->key)
            );
            $DB->update(
                $this->SurveyInfo['Test_name'],
                array(
                 'Date_taken' => date('Y-m-d'),
                ),
                array(
                 'CommentID' => $this->SurveyInfo['CommentID'],
                )
            );
            $DB->update(
                'flag',
                array(
                 'Data_entry'     => 'Complete',
                 'Administration' => 'All',
                ),
                array(
                 'CommentID' => $this->SurveyInfo['CommentID'],
                )
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
    function updateStatus($status)
    {
        $DB = Database::singleton();
        $this->key = $_REQUEST['key'];

        $currentStatus = $DB->pselectOne(
            'SELECT Status FROM participant_accounts
            WHERE OneTimePassword=:key',
            array('key' => $this->key)
        );

        if ($currentStatus != 'Complete' || $currentStatus !='In Progress' ) {
            // Already completed, don't want to accidentally change it back to
            // started or some other status..
            //Already In Progress, don't want to update that as well
            $DB->update(
                "participant_accounts",
                array('Status' => $status),
                array('OneTimePassword' => $this->key)
            );
        }

        return true;
    }
}

if (!class_exists('UnitTestCase')) {
    $Runner = new DirectDataEntryMainPage();
    $Runner->run();
}
?>
