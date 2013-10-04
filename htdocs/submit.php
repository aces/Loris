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
        $this->caller->setDataEntryType('Direct');

        if(empty($_REQUEST['key'])) {
            throw new Exception("Missing parameter", 403);
        }
        $this->key = $_REQUEST['key'];

        $DB = Database::singleton();
        $this->TestName = $DB->pselectOne("SELECT Test_name FROM participant_accounts WHERE OneTimePassword=:key AND Complete='No'", array('key' => $this->key));
        $this->NumPages = $DB->pselectOne("SELECT COUNT(*) FROM instrument_subtests WHERE Test_name=:TN", array('TN' => $this->TestName));

        $pageNum = null;
        if(!empty($_REQUEST['pageNum']))  {
            $pageNum = $_REQUEST['pageNum'];
        }

        $this->Subtest = $DB->pselectOne("SELECT Subtest_name FROM instrument_subtests WHERE Test_name=:TN AND Order_number=:PN", array('TN' => $this->TestName, 'PN' => $pageNum));

        $this->NextPageNum = $this->getNextPageNum($pageNum);
        $this->PrevPageNum = $this->getPrevPageNum($pageNum);

        $this->tpl_data = array(
            'nextpage' => $this->NextPageNum, 
            'prevpage' => $this->PrevPageNum, 
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
        return $DB->pselectOne("SELECT Order_number FROM instrument_subtests WHERE Test_name=:TN AND Order_number < :PN ORDER BY Order_number DESC", array('TN' => $this->TestName, 'PN' => $currentPage));
    }

    function run() {
        $this->initialize();
        $this->display();
    }

    function display() {
        $workspace = $this->caller->load($this->TestName, $this->Subtest, 'FakeCommentID');
        $this->tpl_data['workspace'] = $workspace;
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

