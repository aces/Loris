<?php
namespace Loris\API\Candidates\Candidate;
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'Instruments.php';

class InstrumentData extends \Loris\API\Candidates\Candidate\Instruments {
    var $Instrument;
    public function __construct($method, $CandID, $Visit, $Instrument, $bDDE, $bFlags) {
        $this->AllowedMethods = ['GET', 'PUT', 'PATCH'];
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
            header("HTTP/1.1 404 Not Found");
            print json_encode(["error" => "Invalid instrument for candidate"]);
            exit(0);
        }
        if($this->bDDE) {
            $CommentID = 'DDE_' . $CommentID;
        }

        try {
            $this->Instrument = NDB_BVL_Instrument::factory($Instrument, $CommentID, null, true);
        } catch(Exception $e) {
            header("HTTP/1.1 404 Not Found");
            print json_encode(["error" => "Invalid instrument"]);
            exit(0);
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
            $Values = NDB_BVL_Instrument::loadInstanceData($this->Instrument);

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

}

if(isset($_REQUEST['PrintInstrumentData'])) {
    $obj = new CandidateInstrumentDataJSON(
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
