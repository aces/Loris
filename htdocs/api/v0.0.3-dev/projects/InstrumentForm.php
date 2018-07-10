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
namespace Loris\API\Projects;
//Load config file and ensure paths are correct
set_include_path(get_include_path() . ":" . __DIR__ . "/../");
require_once 'APIBase.php';

/**
 * Class which handles serialization of instrument forms in Loris API
 *
 * @category Loris
 * @package  API
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class InstrumentForm extends \Loris\API\APIBase
{
    var $Instrument;

    /**
     * Construct the object to handle requests. This will instantiate
     * the NDB_BVL_Instrument object and call toJSON to return the
     * JSON to the client.
     *
     * @param string $method     The HTTP method used for the request
     * @param string $Instrument The instrument to be serialized
     */
    function __construct($method, $Instrument)
    {
        $this->AutoHandleRequestDelegation = false;
        parent::__construct($method);

        try {
            $this->Instrument = \NDB_BVL_Instrument::factory(
                $Instrument,
                null,
                null,
                true
            );
        } catch(\Exception $e) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error("Invalid Instrument");
            $this->safeExit(0);
        }

        // JSON is used by both calculateETag and handleGET, so do it
        // before either is called.
        $this->JSONString = $this->Instrument->toJSON();
        $this->handleRequest();
    }


    /**
     * Handles a GET request to this URL
     *
     * @return void but populates JSON class variable
     */
    function handleGET()
    {
        $this->JSON = json_decode($this->JSONString, true);
    }

    /**
     * Calculates the ETag for this instrument by just taking
     * an MD5 of the JSON
     *
     * @return string ETag for this instrument
     */
    function calculateETag()
    {
        return md5('Instrument:' . $this->JSONString);
    }

}

if (isset($_REQUEST['PrintInstrumentForm'])) {
    $obj = new InstrumentForm($_SERVER['REQUEST_METHOD'], $_REQUEST['Instrument']);
    print $obj->toJSONString();
}
?>
