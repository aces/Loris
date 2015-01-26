<?php
/**
 * PHP 5.5+
 */
namespace Loris\API;
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'APIBase.php';

class Candidates extends APIBase {
    var $RequestData;
    public function __construct($method, $data=null) {
        $this->AllowedMethods = ['GET', 'POST'];
        $this->RequestData = $data;

        parent::__construct($method);
    }

    public function handleGET() {
        $candidates = $this->DB->pselect(
            "SELECT CandID FROM candidate WHERE Active='Y'",
            []
        );

        $candValues = array_column($candidates, "CandID");

        $this->JSON = [
            "Candidates" =>  $candValues
        ];
    }

    public function handlePOST() {
        if(isset($this->RequestData['candidate'])) {
            $data = json_decode($this->RequestData['candidate'], true);
            if($data === null) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->safeExit(0);
            }
            if(!isset($data['Candidate']['Gender']) ||
                !in_array($data['Candidate']['Gender'], ['Male', 'Female'])
            ) {
                //print "Invalid Gender $data[Candidate][Gender]";
                $this->header("HTTP/1.1 400 Bad Request");
                $this->safeExit(0);
            }
            //Candidate::createNew
            $this->header("HTTP/1.1 201 Created");
            $this->JSON = [
                'Meta' => [
                    "CandID" => "ABC"
                ]
            ];
        } else {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->safeExit(0);
        }
    }
}

if(isset($_REQUEST['PrintCandidates'])) {
    if($_SERVER['REQUEST_METHOD'] === 'POST') {
        $obj = new Candidates($_SERVER['REQUEST_METHOD'], $_POST);
    } else {
        $obj = new Candidates($_SERVER['REQUEST_METHOD']);
    }
    print $obj->toJSONString();
}
?>
