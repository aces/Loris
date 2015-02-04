<?php
namespace Loris\API\Candidates\Candidate;
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'Instruments.php';

class InstrumentData extends \Loris\API\Candidates\Candidate\Instruments {
    var $Instrument;
    public function __construct($method, $CandID, $Visit, $Instrument, $bDDE, $bFlags) {
        if(empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET', 'PUT', 'PATCH', 'OPTIONS'];
        }
        $this->AutoHandleRequestDelegation = false;
        $this->bDDE = $bDDE;
        $this->bFlags = $bFlags;

        parent::__construct($method, $CandID, $Visit);

        // instruments may need access to project libraries
        set_include_path(get_include_path() . ":" . __DIR__ . "/../../../../project/libraries");
        require_once "NDB_BVL_Instrument.class.inc";

        $CommentID = $this->DB->pselectOne(
            "SELECT CommentID FROM flag f
                LEFT JOIN session s ON (s.ID=f.SessionID AND s.Visit_label=:VL)
                LEFT JOIN candidate c USING (CandID)
            WHERE Test_name=:TN AND s.CandID=:CID AND s.Active='Y' AND c.Active='Y' AND f.CommentID NOT LIKE 'DDE%'", array('VL' => $this->VisitLabel, 'TN' => $Instrument, 'CID' => $this->CandID)
        );

        if(empty($CommentID)) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error("Invalid instrument for candidate");
            $this->safeExit(0);
        }
        if($this->bDDE) {
            $CommentID = 'DDE_' . $CommentID;
        }

        try {
            $this->Instrument = \NDB_BVL_Instrument::factory($Instrument, $CommentID, null, true);
        } catch(Exception $e) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error("Invalid instrument");
            $this->safeExit(0);
        }

        $this->handleRequest();


    }

    function handleGET() {
        $this->JSON = [
            "Meta" => [
                "Instrument" => $this->Instrument->testName,
                "Visit"      => $this->VisitLabel,
                "Candidate"  => $this->CandID,
                "DDE"        => $this->bDDE
            ]
        ];

        if(!$this->bFlags) {
            $Values = \NDB_BVL_Instrument::loadInstanceData($this->Instrument);

            unset($Values['CommentID']);
            unset($Values['UserID']);
            unset($Values['Testdate']);
            unset($Values['Data_entry_completion_status']);

            $this->JSON[$this->Instrument->testName] = $Values;
        } else {
            $flags = $this->DB->pselectRow("SELECT Data_entry, Administration, Validity FROM flag WHERE CommentID=:CID", ['CID' => $this->Instrument->getCommentID()]);

            if(!$this->Instrument->ValidityEnabled) {
                unset($flags['Validity']);
            }
            $this->JSON['Flags'] = $flags;
        }
    }

    function handleOPTIONS() {
        $this->Header("Access-Control-Allow-Methods: ".
            join($this->AllowedMethods, ",")
        );
    }

    function handlePUT() {
        $fp = fopen("php://input", "r");
        $data = '';
        while(!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        $data = json_decode($data, true);
        if($this->Instrument->validate($data)) {
            $this->Instrument->clearInstrument();
            $this->Instrument->_save($data[$this->Instrument->testName]);
            $this->JSON = array("success" => "Updated");
        } else {
            $this->Header("HTTP/1.1 403 Forbidden");
            if(!$this->Instrument->determineDataEntryAllowed()) {
                $this->JSON = array('error' => "Can not update instruments that are flagged as complete");
            } else {
                $this->JSON = array("error" => "Could not update.");
            }
        }
    }

}

if(isset($_REQUEST['PrintInstrumentData'])) {
    $obj = new InstrumentData(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['Visit'],
        $_REQUEST['Instrument'],
        isset($_REQUEST['DDE'])   ? true : false,
        isset($_REQUEST['flags']) ? true : false
    );
    print $obj->toJSONString();
}
?>
