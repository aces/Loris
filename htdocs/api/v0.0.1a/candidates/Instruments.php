<?php
namespace Loris\API\Candidates\Candidate;
set_include_path(get_include_path() . ":" . __DIR__ . "/../");

require_once 'Visit.php';

class Instruments extends Visit {
    public function __construct($method, $CandID, $Visit) {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;
        // Parent will validate CandID and Visit Label and abort if necessary
        parent::__construct($method, $CandID, $Visit);

        if($requestDelegationCascade) {
            $this->handleRequest();
        }
    }

    public function handleGET() {
        $Insts = $this->DB->pselect(
            "SELECT Test_name FROM flag f JOIN session s ON (s.ID=f.SessionID) WHERE s.CandID=:CID AND s.Active='Y' AND s.Visit_label=:VL",
            array('CID' => $this->CandID, 'VL' => $this->VisitLabel)
        );

        $Instruments = array_column($Insts, 'Test_name');

        $this->JSON = [
            "Meta"   => [
                "CandID" => $this->CandID,
                'Visit'  => $this->VisitLabel
            ],
            'Instruments' => $Instruments
        ];
    }
}

if(isset($_REQUEST['PrintInstruments'])) {
    $obj = new CandidateInstrumentsJSON(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel']
    );
    print $obj->toJSONString();
}

?>
