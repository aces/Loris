<?php
/**
 * This returns the instrument passed in by the Instrument GET parameter
 * and serializes it as JSON for the REST API.
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  API
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
//Load config file and ensure paths are correct
set_include_path(get_include_path() . ":" . __DIR__ . "/../");
require_once 'APIBase.php';

class InstrumentForm extends APIBase {
    var $Instrument;

    function __construct($method, $Instrument) {
        $this->AutoHandleRequestDelegation = false;
        parent::__construct($method);

        try {
            $this->Instrument = NDB_BVL_Instrument::factory($Instrument, null, null, true);
        } catch(Exception $e) {
            header("HTTP/1.1 404 Not Found");
            print json_encode(["error" => "Invalid Instrument"]);
            exit(0);
        }

        $this->handleRequest();
    }

    function handleGET() {
        $this->JSON = json_decode($this->Instrument->toJSON());
    }
}

if(isset($_REQUEST['PrintInstrumentForm'])) {
    $obj = new InstrumentForm($_SERVER['REQUEST_METHOD'], $_REQUEST['Instrument']);
    print $obj->toJSONString();
}
?>
