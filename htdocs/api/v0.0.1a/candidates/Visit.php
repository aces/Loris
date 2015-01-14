<?php
set_include_path(get_include_path() . ":" . __DIR__ . "/../");

require_once 'Candidate.php';

class VisitJSON extends CandidateJSON {
    public function __construct($CandID, $VisitLabel) {
        // Parent constructor will handle validation of
        // CandID
        parent::__construct($CandID);

        $Visits = array_values($this->Candidate->getListOfVisitLabels());

        if(!in_array($VisitLabel, $Visits)) {
            header("HTTP/1.1 404 Not Found");
            print json_encode(["error" => "Invalid visit $VisitLabel"]);
            exit(0);
        }

        $this->JSON = [
            "Meta"   => [
                "CandID" => $CandID,
                'Visit'  => $VisitLabel
            ],
        ];
    }
}

if(!isset($_REQUEST['NoVisit'])) {
    $obj = new VisitJSON($_REQUEST['CandID'], $_REQUEST['VisitLabel']);
    print $obj->toJSONString();
}
?>
