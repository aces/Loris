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

            $this->verifyField($data, 'Gender', ['Male', 'Female']);
            $this->verifyField($data, 'EDC', 'YYYY-MM-DD');
            $this->verifyField($data, 'DoB', 'YYYY-MM-DD');
            //Candidate::createNew
            try {
                $this->createNew(
                    $data['Candidate']['DoB'],
                    $data['Candidate']['EDC'],
                    $data['Candidate']['Gender'],
                    $data['Candidate']['PSCID']
                );
                $this->header("HTTP/1.1 201 Created");
                $this->JSON = [
                    'Meta' => [
                        "CandID" => "123456"
                    ]
                ];
            } catch(\LorisException $e) {
                $this->header("HTTP/1.1 400 Bad Request");
                $this->safeExit(0);
            }
        } else {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->safeExit(0);
        }
    }

    protected function verifyField($data, $field, $values) {
        if(!isset($data['Candidate'][$field])) {
            $this->header("HTTP/1.1 400 Bad Request");
            throw new \Exception("AAAAH $field");
            $this->safeExit(0);
        }
        if(is_array($values) && !in_array($data['Candidate'][$field], $values)) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->safeExit(0);
        }
        if($values === 'YYYY-MM-DD'
            && !preg_match("/\d\d\d\d\-\d\d\-\d\d/", $data['Candidate'][$field])
        ) {
            $this->header("HTTP/1.1 400 Bad Request");
            $this->safeExit(0);
        }
    }

    // Testable wrapper for Candidate::createNew
    public function createNew($DoB, $edc, $gender, $PSCID) {
        $user = \User::singleton();
        \Candidate::createNew(
            $user->getCenterID(),
            $DoB,
            $edc,
            $gender,
            $pscid
        );
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
