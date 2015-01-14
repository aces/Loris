<?php
set_include_path(get_include_path() . ":" . __DIR__ . "/../");

require_once 'Visit.php';

class CandidateInstrumentsJSON extends VisitJSON {
    public function __construct($CandID, $Visit) {
        // Parent will validate CandID and Visit Label and abort if necessary
        parent::__construct($CandID, $Visit);

        $Insts = $this->DB->pselect(
            "SELECT Test_name FROM flag f JOIN session s ON (s.ID=f.SessionID) WHERE s.CandID=:CID AND s.Active='Y' AND s.Visit_label=:VL",
            array('CID' => $CandID, 'VL' => $Visit)
        );

        $Instruments = array_column($Insts, 'Test_name');

        $this->JSON = [
            "Meta"   => [
                "CandID" => $CandID,
                'Visit'  => $Visit
            ],
            'Instruments' => $Instruments
        ];
    }
}

if(!isset($_REQUEST['NoInstruments'])) {
    $obj = new CandidateInstrumentsJSON($_REQUEST['CandID'], $_REQUEST['VisitLabel']);
    print $obj->toJSONString();
}

?>
