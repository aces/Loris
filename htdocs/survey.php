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
class DirectDataEntryMainPage
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

        $this->caller =& NDB_Caller::singleton();

        $this->caller->setDataEntryType('Direct');

        if (empty($_REQUEST['key'])) {
            throw new Exception("Missing parameter", 403);
        }
        $this->key = $_REQUEST['key'];

        $DB = Database::singleton();
        $this->TestName = $DB->pselectOne(
            "SELECT Test_name FROM participant_accounts
            WHERE OneTimePassword=:key AND Status <> 'Complete'",
            array('key' => $this->key)
        );
        $this->CommentID = $DB->pselectOne(
            "SELECT CommentID FROM participant_accounts 
            WHERE OneTimePassword=:key AND Status <> 'Complete'",
            array('key' => $this->key)
        );
        $this->NumPages = $DB->pselectOne(
            "SELECT COUNT(*) FROM instrument_subtests WHERE Test_name=:TN",
            array('TN' => $this->TestName)
        );

        if (empty($this->TestName) && empty($this->CommentID)) {
            throw new Exception("Data has already been submitted.", 403);
        }
        $pageNum = null;

        if (!empty($_REQUEST['pageNum'])) {
            $pageNum = $_REQUEST['pageNum'];
        }


        if ($pageNum === 'finalpage') {
            $this->Subtest = 'finalpage';
        } else {
            $this->Subtest = $DB->pselectOne(
                "SELECT Subtest_name
                FROM instrument_subtests
                WHERE Test_name=:TN AND Order_number=:PN",
                array('TN' => $this->TestName, 'PN' => $pageNum)
            );
        }

        $totalPages = $DB->pselectOne(
            "SELECT COUNT(*)+1 from instrument_subtests WHERE Test_name=:TN",
            array('TN' => $this->TestName)
        );
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



    /**
     * Get the page which follows this page
     *
     * @param integer $currentPage The current page number
     *
     * @return The page which preceeded this one
     */
    function getNextPageNum($currentPage)
    {
        $DB = Database::singleton();
        if ($currentPage === null) {
            return 1;
        }
        return $DB->pselectOne(
            "SELECT Order_number FROM instrument_subtests
            WHERE Test_name=:TN AND Order_number > :PN 
            ORDER BY Order_number",
            array('TN' => $this->TestName, 'PN' => $currentPage)
        );
    }

    /**
     * Get the previous page number
     *
     * @param integer $currentPage The current page number
     *
     * @return string the previous page number or "top" if the user is on
     *         the top page
     */
    function getPrevPageNum($currentPage)
    {
        $DB = Database::singleton();
        if ($currentPage === null) {
            // On the top page or no page specified, do not include link
            return null;
        }

        if ($currentPage == 1) {
            // on the first subtest page the previous page is the top page
            return 'top';
        }

        if ($currentPage === 'finalpage') {
            return $DB->pselectOne(
                "SELECT MAX(Order_number) 
                FROM instrument_subtests 
                WHERE Test_name=:TN",
                array('TN' => $this->TestName)
            );
        }
        return $DB->pselectOne(
            "SELECT Order_number FROM instrument_subtests 
            WHERE Test_name=:TN AND Order_number < :PN ORDER BY Order_number DESC",
            array('TN' => $this->TestName, 'PN' => $currentPage)
        );
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
                'key' => $this->key
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
        $this->tpl_data['complete'] = false;
        $smarty = new Smarty_neurodb;
        $smarty->assign($this->tpl_data);
        $smarty->display('directentry.tpl');
        
    }

    /**
     * Updates the status of the current key
     *
     * @param string $status The status to be updated to
     *
     * @return True on success, false on failure
     */
    function updateStatus($status)
    {
        $DB = Database::singleton();

        $currentStatus = $DB->pselectOne(
            'SELECT Status FROM participant_accounts
            WHERE OneTimePassword=:key',
            array('key' => $this->key)
        );

        if (Utility::isErrorX($currentStatus)) {
            return false;
        }

        if ($currentStatus === 'Complete') {
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

    /**
     * Saves the comments that the user gave on the final page
     * to the database
     *
     * @param integer $ease     Integer rating of how easy the user found the 
     *                          survey to use
     * @param string  $comments Comments entered by survey user on review page
     *
     * @return none
     */
    function updateComments($ease, $comments)
    {
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

    /**
     * Saves all aspects of current request to a log file so that we ensure
     * that we never lose user data and can retrieve it in the event of an
     * emergency
     *
     * @return none
     */
    function logRequest()
    {
        $log = new Log("direct_entry");
        $logmsg = $_SERVER['REMOTE_ADDR'];
        if (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
            $logmsg .= " (" . $_SERVER['HTTP_X_FORWARDED_FOR'] . ")";
        }

        $logmsg .= substr(print_r($_REQUEST, true), 5);
        $log->addLog($logmsg);

    }

    /**
     * Loads the correct page and renders it to the user
     *
     * @return none
     */
    function display()
    {
        $DB = Database::singleton();
            $nextpage = null;

        $this->logRequest();
        
        if (isset($_REQUEST['nextpage'])) {
            $nextpage = "survey.php?key=$_REQUEST[key]&pageNum=$_REQUEST[nextpage]"; 
        }
        
        if (isset($_POST['ease'])) {
            // Comments is too comment of an instrument fieldname,
            // so just check if ease is set
            $this->updateComments(
                $_POST['ease'], 
                $_POST['comments']
            );
        }

        $workspace = $this->caller->load(
            $this->TestName,
            $this->Subtest,
            null,
            $this->CommentID,
            $nextpage
        );

        // Caller calls instrument's save function and might have errors,
        // so we still need to call it. But if nextpage is 'complete', 
        // then after that override with a "Thank you" message
        if ($_REQUEST['pageNum'] === 'finalpage') {
            if (isset($_POST['FinalPageSubmission'])
                && $_POST['FinalPageSubmission'] == "Yes"
            ) {
                // Data was submitted on the last page.
                $this->tpl_data['workspace'] = $workspace;
            } else {
                // We're just getting to the last page for the first time

                $this->tpl_data['workspace'] = '';
                $this->tpl_data['review']  = $this->caller->instrument->getReview();

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

if (!class_exists('UnitTestCase')) {
    $Runner = new DirectDataEntryMainPage();
    $Runner->run();
}
?>
