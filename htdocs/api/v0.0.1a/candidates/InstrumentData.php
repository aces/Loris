<?php
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'Instruments.php';

class CandidateInstrumentDataJSON extends CandidateInstrumentsJSON {
    public function __construct($CandID, $Visit, $Instrument, $bDDE, $bFlags) {
        // Parent will validate
        parent::__construct($CandID, $Visit);
        set_include_path(get_include_path() . ":" . __DIR__ . "/../../../../project/libraries");
        require_once "NDB_BVL_Instrument.class.inc";

        $this->JSON = [
            "Meta" => [
                "Instrument" => $Instrument,
                "Visit"      => $Visit,
                "Candidate"  => $CandID,
                "DDE"        => $bDDE
            ]
        ];


        $CommentID = $this->DB->pselectOne(
            "SELECT CommentID FROM flag f
                LEFT JOIN session s ON (s.ID=f.SessionID AND s.Visit_label=:VL)
                LEFT JOIN candidate c USING (CandID)
            WHERE Test_name=:TN AND s.CandID=:CID AND s.Active='Y' AND c.Active='Y' AND f.CommentID NOT LIKE 'DDE%'", array('VL' => $Visit, 'TN' => $Instrument, 'CID' => $CandID)
        );
        if($bDDE) {
            $CommentID = 'DDE_' . $CommentID;
        }

        try {
        $inst = NDB_BVL_Instrument::factory($Instrument, $CommentID, null);
        } catch(Exception $e) {
            header("HTTP/1.1 404 Not Found");
            print json_encode(["error" => "Invalid instrument"]);
            exit(0);
        }

        if(!$bFlags) {
            $Values = NDB_BVL_Instrument::loadInstanceData($inst);

            unset($Values['CommentID']);
            unset($Values['UserID']);
            unset($Values['Testdate']);
            unset($Values['Data_entry_completion_status']);

            $this->JSON[$Instrument] = $Values;
        } else {
            $flags = $this->DB->pselectRow("SELECT Data_entry, Administration, Validity FROM flag WHERE CommentID=:CID", ['CID' => $CommentID ]);

            if(!$inst->ValidityEnabled) {
                unset($flags['Validity']);
            }
            $this->JSON['Flags'] = $flags;
        }
    }

}

$obj = new CandidateInstrumentDataJSON(
    $_REQUEST['CandID'],
    $_REQUEST['Visit'],
    $_REQUEST['Instrument'],
    isset($_REQUEST['DDE'])   ? true : false,
    isset($_REQUEST['flags']) ? true : false
);
print $obj->toJSONString();
?>
