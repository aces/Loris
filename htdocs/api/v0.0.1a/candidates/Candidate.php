<?php
namespace Loris\API\Candidates;
set_include_path(get_include_path() . ":" . __DIR__ . "/../");
require_once 'APIBase.php';

class Candidate extends \Loris\API\APIBase {
    var $Candidate;
    public function __construct($method, $CandID) {
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;

        $this->AutoHandleRequestDelegation = false;
        $this->CandID = $CandID;

        parent::__construct($method);

        if(!is_numeric($CandID)
            || $CandID < 100000
            || $CandID > 999999
        ) {
            $this->header("HTTP/1.1 400 Bad Request");
            print json_encode(["error" => "Invalid CandID format"]);
            $this->safeExit(0);

        }

        try {
            $this->Candidate = \Candidate::singleton($CandID);
        } catch(Exception $e) {
            $this->header("HTTP/1.1 404 Not Found");
            print json_encode(["error" => "Unknown CandID"]);
            $this->safeExit(0);
        }

        if($requestDelegationCascade) {
            $this->handleRequest();
        }
    }

    public function handleGET() {

        $this->JSON = [
            "Meta"   => [ "CandID" => $this->CandID ],
            "Visits" => array_values($this->Candidate->getListOfVisitLabels())
        ];
    }
}

if(isset($_REQUEST['PrintCandidate'])) {
    $obj = new \Loris\API\Candidates\Candidate(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID']
    );
    print $obj->toJSONString();
}
?>
