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
namespace Loris\API\Candidates\Candidate;
set_include_path(get_include_path() . ":" . __DIR__ . "/../");

require_once 'Visit.php';

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
class Instruments extends Visit
{
    /**
     * Construct an Instruments API handler
     *
     * @param string $method The HTTP request method
     * @param string $CandID The CandID to get the instruments for
     * @param string $Visit  The visit label for $CandID to retrieve
     *                       instruments for
     */
    public function __construct($method, $CandID, $Visit)
    {
        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = ['GET'];
        }
        $requestDelegationCascade = $this->AutoHandleRequestDelegation;
        // Parent will validate CandID and Visit Label and abort if necessary
        parent::__construct($method, $CandID, $Visit);

        if ($requestDelegationCascade) {
            $this->handleRequest();
        }
    }

    /**
     * Handles a GET request for this API call.
     *
     * @return void but populates $this->JSON
     */
    public function handleGET()
    {
        $Insts = $this->DB->pselect(
            "SELECT DISTINCT Test_name"
            .    " FROM flag f"
            .       " JOIN session s ON (s.ID=f.SessionID)"
            . " WHERE s.CandID=:CID AND s.Active='Y' AND s.Visit_label=:VL",
            array(
             'CID' => $this->CandID,
             'VL'  => $this->VisitLabel,
            )
        );

        //array_column only exists in PHP 5.5+, need to use array_map
        //until we no longer support 5.4..
        //$Instruments = array_column($Insts, 'Test_name');
        $Instruments = array_map(
            function ($element) {
                return $element['Test_name'];
            },
            $Insts
        );

        $this->JSON = [
                       "Meta"        => [
                                         "CandID" => $this->CandID,
                                         'Visit'  => $this->VisitLabel,
                                        ],
                       'Instruments' => $Instruments,
                      ];
    }
}

if (isset($_REQUEST['PrintInstruments'])) {
    $obj = new Instruments(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['VisitLabel']
    );
    print $obj->toJSONString();
}


