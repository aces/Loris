<?php
/**
 * PHP 5.5+
 */
namespace Loris\API;
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'APIBase.php';

class Candidates extends APIBase {
    public function __construct($method) {
        $this->AllowedMethods = ['GET', 'POST'];

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
}

if(isset($_REQUEST['PrintCandidates'])) {
    $obj = new Candidates($_SERVER['REQUEST_METHOD']);
    print $obj->toJSONString();
}
?>
