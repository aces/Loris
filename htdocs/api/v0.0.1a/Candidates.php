<?php
/**
 * PHP 5.5+
 */
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'APIBase.php';

class CandidatesJSON extends APIBase {
    public function __construct() {
        parent::__construct();

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


$obj = new CandidatesJSON();
print $obj->toJSONString();
?>
