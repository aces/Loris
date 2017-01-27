<?php
/**
 * Contains class to get the list of instruments for a candidate's
 * visit through the API.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API\Projects;
set_include_path(get_include_path() . ":" . __DIR__ . "/../");
require_once 'APIBase.php';

/**
 * Class to handle HTTP requests for a candidate's instruments.
 * Extends Visit because the visit for the candidate also needs
 * to be validated before the instruments can be serialized.
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Instruments extends \Loris\API\APIBase
{

    var $projectName;

    /**
     * Construct an Instruments API handler
     *
     * @param string $method      The HTTP request method
     * @param string $projectName The project short name
     */
    public function __construct($method, $projectName)
    {
        parent::__construct($method);

        $this->AllowedMethods = ['GET'];
        $this->projectName    = $projectName;
        $this->HTTPMethod     = $method;

        $this->handleRequest();
    }

    /**
     * Handles a GET request for this API call.
     *
     * @return none, but populates $this->JSON
     */
    public function handleGET()
    {
        $instruments    = \Utility::getAllProjectInstruments($this->projectName);
        $ddeInstruments = \Utility::getAllDDEInstruments();
        $this ->JSON    = [];

        array_walk(
            $instruments,
            function ( $fullName, $shortName, $ddeInstruments) {
                $subGroup = \Utility::getInstrumentSubgroupName($shortName);
                $dde      = array_key_exists($shortName, $ddeInstruments);

                array_push(
                    $this->JSON,
                    array(
                     "ShortName"             => $shortName,
                     "FullName"              => $fullName,
                     "Subgroup"              => $subGroup,
                     "DoubleDataEntryEnable" => $dde,
                    )
                );
            },
            $ddeInstruments
        );
    }

    /**
     * Calculates the ETag for this project by taking an MD5 of the
     * JSON
     *
     * @return string ETag for project
     */
    function calculateETag()
    {
        return md5('Project:Instruments:' . json_encode($this->JSON, true));
    }
}

if (isset($_REQUEST['PrintJSON'])) {
    $obj = new Instruments(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['Project']
    );

    header('content-type: application/json');
    print $obj->toJSONString();
}

?>
