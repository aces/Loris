<?php
/**
 * File to handle instrument data request through Loris REST API
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */

namespace Loris\API\Candidates\Candidate;
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'Instruments.php';

/**
 * Class to handle Instrument Data HTTP requests
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class InstrumentData extends \Loris\API\Candidates\Candidate\Instruments
{
    var $Instrument;

    /**
     * Construct a request handler for candidate instrument data
     *
     * @param string  $method     The HTTP method to be handled
     * @param string  $CandID     The CandID this API call is for
     * @param string  $Visit      The Visit this API call is for
     * @param string  $Instrument The instrument this API call is for
     * @param boolean $bDDE       If true, handle DDE instrument instead of
     *                            normal instrument data
     * @param boolean $bFlags     If true, include instrument flag data in
     *                            serialization
     */
    public function __construct(
        $method,
        $CandID,
        $Visit,
        $Instrument,
        $bDDE,
        $bFlags
    ) {
        if (empty($this->AllowedMethods)) {
            $this->AllowedMethods = [
                                     'GET',
                                     'PUT',
                                     'PATCH',
                                     'OPTIONS',
                                    ];
        }
        $this->AutoHandleRequestDelegation = false;
        $this->bDDE   = $bDDE;
        $this->bFlags = $bFlags;

        parent::__construct($method, $CandID, $Visit);

        // instruments may need access to project libraries
        set_include_path(
            get_include_path()
            . ":" . __DIR__ . "/../../../../project/libraries"
        );
        include_once "NDB_BVL_Instrument.class.inc";

        $CommentID = $this->DB->pselectOne(
            "SELECT CommentID FROM flag f
                LEFT JOIN session s ON (s.ID=f.SessionID AND s.Visit_label=:VL)
                LEFT JOIN candidate c USING (CandID)
            WHERE Test_name=:TN AND s.CandID=:CID AND
                  s.Active='Y' AND c.Active='Y' AND f.CommentID NOT LIKE 'DDE%'",
            array(
             'VL'  => $this->VisitLabel,
             'TN'  => $Instrument,
             'CID' => $this->CandID,
            )
        );

        if (empty($CommentID)) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error("Invalid instrument for candidate");
            $this->safeExit(0);
        }
        if ($this->bDDE) {
            $CommentID = 'DDE_' . $CommentID;
        }

        try {
            $this->Instrument = \NDB_BVL_Instrument::factory(
                $Instrument,
                $CommentID,
                null,
                true
            );
        } catch(\Exception $e) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error("Invalid instrument");
            $this->safeExit(0);
        }

        $this->handleRequest();

    }

    /**
     * Handle a GET request
     *
     * @return void (but modifies $this->JSON)
     */
    function handleGET()
    {
        $this->JSON = [
                       "Meta" => [
                                  "Instrument" => $this->Instrument->testName,
                                  "Visit"      => $this->VisitLabel,
                                  "Candidate"  => $this->CandID,
                                  "DDE"        => $this->bDDE,
                                 ],
                      ];

        if (!$this->bFlags) {
            $Values = \NDB_BVL_Instrument::loadInstanceData($this->Instrument);

            unset(
                $Values['CommentID'],
                $Values['UserID'],
                $Values['Testdate'],
                $Values['Data_entry_completion_status']
            );

            $this->JSON[$this->Instrument->testName] = $Values;
        } else {
            $flags = $this->DB->pselectRow(
                "SELECT Data_entry, Administration, Validity
                 FROM flag WHERE CommentID=:CID",
                ['CID' => $this->Instrument->getCommentID()]
            );

            if (!$this->Instrument->ValidityEnabled) {
                unset($flags['Validity']);
            }
            $this->JSON['Flags'] = $flags;
        }
    }

    /**
     * Handle an OPTIONS request
     *
     * @return void (but modifies HTTP headers sent)
     */
    function handleOPTIONS()
    {
        $this->Header(
            "Access-Control-Allow-Methods: ".
            join(",", $this->AllowedMethods)
        );
    }

    /**
     * Handle a PUT request
     *
     * @return void (but populates $this->JSON and writes to database)
     */
    function handlePUT()
    {
        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        parse_str(urldecode($data), $data);
        if ($this->Instrument->validate($data)) {
            $this->Instrument->clearInstrument();
            $this->Instrument->_save($data[$this->Instrument->testName]);
            $this->JSON = array("success" => "Updated");
        } else {
            $this->Header("HTTP/1.1 403 Forbidden");
            if (!$this->Instrument->determineDataEntryAllowed()) {
                $msg = "Can not update instruments that"
                       . " are flagged as complete";

                $this->JSON = array('error' => $msg);
            } else {
                $this->JSON = array("error" => "Could not update.");
            }
        }
    }

    /**
     * Handle a PUT request
     *
     * @return void (but populates $this->JSON and writes to database)
     */
    function handlePATCH()
    {
        $fp   = fopen("php://input", "r");
        $data = '';
        while (!feof($fp)) {
            $data .= fread($fp, 1024);
        }
        fclose($fp);

        parse_str(urldecode($data), $data);
        if ($this->Instrument->validate($data)) {
            $this->Instrument->_save($data[$this->Instrument->testName]);
            $this->JSON = array("success" => "Updated");
        } else {
            $this->Header("HTTP/1.1 403 Forbidden");
            if (!$this->Instrument->determineDataEntryAllowed()) {
                $msg = "Can not update instruments that"
                       . " are flagged as complete";

                $this->JSON = array('error' => $msg);
            } else {
                $this->JSON = array("error" => "Could not update.");
            }
        }
    }

}

if (isset($_REQUEST['PrintInstrumentData'])) {
    $obj = new InstrumentData(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['CandID'],
        $_REQUEST['Visit'],
        $_REQUEST['Instrument'],
        isset($_REQUEST['DDE'])   ? true : false,
        isset($_REQUEST['flags']) ? true : false
    );
    print $obj->toJSONString();
}
?>
