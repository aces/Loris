<?php
/**
 * @package main
 */
set_include_path(get_include_path().":../project/libraries:../php/libraries:");
// start benchmarking
require_once 'NDB_Config.class.inc';
require_once 'Smarty_hook.class.inc';
require_once 'NDB_Caller.class.inc';
require_once 'NDB_Client.class.inc';
require_once 'NDB_BVL_Instrument.class.inc';
require_once 'Log.class.inc';

class DirectDataEntryMainPage {
    var $key;

    var $TestName;
    var $Subtest;

    var $NumPages;
    var $NextPageNum;
    var $PrevPageNum;

    var $tpl_data;
    var $caller;

    function HandleError() {
        switch($error->code) {
        case 404: header("HTTP/1.1 404 Not Found"); break;
        case 403: header("HTTP/1.1 403 Forbidden"); break;
        }
        if(empty($error->code)) {
            //print $error->message;
        }
    }

    function initialize() {
        ob_start('ob_gzhandler');
        $client = new NDB_Client();
        $client->makeCommandLine();
        $client->initialize();

        $this->caller =& NDB_Caller::singleton();

        //$this->caller->setErrorHandling(PEAR_ERROR_CALLBACK, array($this, 'HandleError'));
        //PEAR::setErrorHandling(PEAR_ERROR_CALLBACK, array($this, 'HandleError'));
        $this->caller->setDataEntryType('Direct');

        if(empty($_REQUEST['key'])) {
            throw new Exception("Missing parameter", 403);
        }
        $this->key = $_REQUEST['key'];

        $DB = Database::singleton();
        $this->TestName = $DB->pselectOne("SELECT Test_name FROM participant_accounts WHERE OneTimePassword=:key AND Status <> 'Complete'", array('key' => $this->key));
        $this->CommentID = $DB->pselectOne("SELECT CommentID FROM participant_accounts WHERE OneTimePassword=:key AND Status <> 'Complete'", array('key' => $this->key));
        $this->NumPages = $DB->pselectOne("SELECT COUNT(*) FROM instrument_subtests WHERE Test_name=:TN", array('TN' => $this->TestName));

        if(empty($this->TestName) && empty($this->CommentID)) {
            throw new Exception("Data has already been submitted.", 403);
        }
        $pageNum = null;

        if(!empty($_REQUEST['pageNum']))  {
            $pageNum = $_REQUEST['pageNum'];
        }


        if($pageNum === 'finalpage') {
            $this->Subtest = 'finalpage';
        } else {
            $this->Subtest = $DB->pselectOne("SELECT Subtest_name FROM instrument_subtests WHERE Test_name=:TN AND Order_number=:PN", array('TN' => $this->TestName, 'PN' => $pageNum));
        }

        $totalPages = $DB->pselectOne("SELECT COUNT(*)+1 from instrument_subtests WHERE Test_name=:TN", array('TN' => $this->TestName));
        $this->NextPageNum = $this->getNextPageNum($pageNum);
        $this->PrevPageNum = $this->getPrevPageNum($pageNum);

        $this->CommentID   = $this->getCommentID();
        $this->tpl_data = array(
            'nextpage' => $this->NextPageNum, 
            'prevpage' => $this->PrevPageNum, 
            'pageNum'  => $pageNum ? $pageNum + 1: 1,
            'totalPages' => $totalPages,
            'key' => $this->key);
    }



    function GetNextPageNum($currentPage) {
        $DB = Database::singleton();
        if($currentPage === null) {
            return 1;
        }
        return $DB->pselectOne("SELECT Order_number FROM instrument_subtests WHERE Test_name=:TN AND Order_number > :PN ORDER BY Order_number", array('TN' => $this->TestName, 'PN' => $currentPage));
    }

    function GetPrevPageNum($currentPage) {
        $DB = Database::singleton();
        if($currentPage === null) {
            // On the top page or no page specified, do not include link
            return null;
        }

        if($currentPage == 1) {
            // on the first subtest page the previous page is the top page
            return 'top';
        }

        if($currentPage === 'finalpage') {
            return $DB->pselectOne("SELECT MAX(Order_number) FROM instrument_subtests WHERE Test_name=:TN", array('TN' => $this->TestName));
        }
        return $DB->pselectOne("SELECT Order_number FROM instrument_subtests WHERE Test_name=:TN AND Order_number < :PN ORDER BY Order_number DESC", array('TN' => $this->TestName, 'PN' => $currentPage));
    }

    function getDefaults() {
    }

    function run() {
        try {

        $this->initialize();
        $this->display();
        } catch(Exception $e) {
            $this->displayError($e);
        }
    }

    function getCommentID() {
        $DB = Database::singleton();
        return $DB->pselectOne(
            "SELECT CommentID FROM participant_accounts WHERE OneTimePassword=:key AND Status <> 'Complete'",
            array(
                'key' => $this->key
            )
        );
    }

    function displayError($e) {
        switch($e->getCode()) {
        case 404: header("HTTP/1.1 404 Not Found"); break;
        case 403: header("HTTP/1.1 403 Forbidden"); break;
        }

        $this->tpl_data['workspace'] = $e->getMessage();
        $this->tpl_data['complete'] = false;
        $smarty = new Smarty_neurodb;
        $smarty->assign($this->tpl_data);
        $smarty->display('directentry.tpl');
        
    }

    /**
     * Updates the status of the current key
     *
     * @param status string The status to be updated to
     *
     * @return True on success, false on failure
     */
    function updateStatus($status) {
        $DB = Database::singleton();

        $currentStatus = $DB->pselectOne('SELECT Status FROM participant_accounts WHERE OneTimePassword=:key', array('key' => $this->key));

        if(Utility::isErrorX($currentStatus)) {
            return false;
        }

        if($currentStatus === 'Complete') {
            // Already completed, don't want to accidentally change it back to
            // started or some other status..
            return false;
        }

        $DB->update(
            "participant_accounts",
            array('Status' => $status),
            array('OneTimePassword' => $this->key)
        );

        return true;
    }

    function updateComments($ease, $comments) {
        $DB = Database::singleton();
        $DB->update(
            "participant_accounts",
            array(
                'UserEaseRating' => $ease,
                'UserComments'   => $comments
            ),
            array('OneTimePassword' => $this->key)
        );
    }
    function logRequest() {
        $log = new Log("direct_entry");
        $logmsg = $_SERVER['REMOTE_ADDR'];
        if(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $logmsg .= " (" . $_SERVER['HTTP_X_FORWARDED_FOR'] . ")";
        }

        $logmsg .= substr(print_r($_REQUEST, true), 5);
        $log->addLog($logmsg);

    }
    function display() {
        $DB = Database::singleton();
            $nextpage = null;

        $this->logRequest();
        
        if (isset($_REQUEST['nextpage'])) {
        //if (isset($_REQUEST['nextpage'])) {
            $nextpage = "survey.php?key=$_REQUEST[key]&pageNum=$_REQUEST[nextpage]"; 
        }
        
        if(isset($_POST['ease'])) {
            // Comments is too comment of an instrument fieldname,
            // so just check if ease is set
            $this->updateComments(
                $_POST['ease'], 
                $_POST['comments']
            );
        }

        $workspace = $this->caller->load($this->TestName, $this->Subtest, null, $this->CommentID, $nextpage);

        // Caller calls instrument's save function and might have errors, so we still need to call it.
        // But if nextpage is 'complete', then after that override with a "Thank you" message
        if ($_REQUEST['pageNum'] === 'finalpage') {
            if(isset($_POST['ease'])) {
                // Data was submitted on the last page.
                $this->tpl_data['workspace'] = $workspace;
            } else {
                // We're just getting to the last page for the first time

                $this->tpl_data['workspace'] = '';
                $this->tpl_data['questions'] = $DB->pselect(
                    "SELECT Description as question, SourceField FROM parameter_type WHERE SourceFrom=:TN AND SourceField NOT IN ('Validity', 'Administration')",
                    array(
                        'TN' => $this->TestName 
                    )
                );

                $Responses = $DB->pselectRow(
                    "SELECT * FROM " . $this->TestName . " WHERE CommentID=:CID",
                    array('CID' => $this->CommentID)
                );

                foreach($this->tpl_data['questions'] as &$row) {
                    if(isset($Responses[$row['SourceField']])) {
                        $row['response'] = $Responses[$row['SourceField']];
                    }
                }

            }
            $this->tpl_data['lastpage'] = "survey.php?key=$_REQUEST[key]";
            $this->tpl_data['finalpage'] = true;
        } else if ($_REQUEST['pageNum'] === 'complete') {
            $this->tpl_data['workspace'] = "Thank you for completing this survey.";
            $this->tpl_data['complete'] = true;
            
            $this->updateStatus('Complete');
            $Responses = $DB->update(
                $this->TestName,
                array(
                    'Date_taken' => date('Y-m-d')
                ),
                array(
                    'CommentID' => $this->CommentID
                )
            );

        } else {
            $this->updateStatus('In Progress');
            $this->tpl_data['workspace'] = $workspace;
        }
        $smarty = new Smarty_neurodb;
        $smarty->assign($this->tpl_data);
        $smarty->display('directentry.tpl');
    }
}

if(!class_exists('UnitTestCase')) {
    $Runner = new DirectDataEntryMainPage();
    $Runner->run();
}
?>
