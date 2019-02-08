<?php
/**
 * This class handles project related API requests. Depending on how it
 * is called it can include either the candidates, visits, instruments,
 * or all of the above that should be serialized.
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

set_include_path(get_include_path() . ":" . __DIR__ . "/..");
require_once 'APIBase.php';

/**
 * This class handles project related API requests. Depending on how it
 * is called it can include either the candidates, visits, instruments,
 * or all of the above that should be serialized.
 *
 * PHP Version 5
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Project extends \Loris\API\APIBase
{
    var $ProjectID;
    var $ProjectName;
    var $ProjectInstruments;

    /**
     * Gets the ProjectID for the project name that was requested with the
     * API.
     *
     * @param string $ProjectName The project name whose ID we would like
     *
     * @return integer The id of $ProjectName
     */
    protected function getProjectID($ProjectName)
    {
        $config = $this->Factory->config();

        $Projects = $config->getSetting("Projects")["project"];
        foreach ($Projects as $project) {
            if ($project['title'] === $ProjectName) {
                return $project['id'];
            }
        }
    }

    /**
     * Constructs an object to handle JSON serialization
     *
     * @param string  $method             The HTTP method of the request
     * @param string  $projectName        The project to be serialized
     * @param boolean $bCandidates        If true, candidates for project
     *                                    should be included in serialization
     *                                    be included in serialization be
     *                                    included in serialization
     * @param boolean $bInstruments       If true, list of instruments for
     *                                    project should be included in
     *                                    serialization should be included
     *                                    in serialization should be included
     *                                    in serialization
     * @param boolean $bVisits            If true, visits for project should be
     *                                    included in serialization included in
     *                                    serialization included in serialization
     * @param boolean $bInstrumentDetails If true, InstrumentDetails are populated
     *                                    instead of instrument names
     */
    public function __construct(
        $method,
        $projectName,
        $bCandidates,
        $bInstruments,
        $bVisits,
        $bInstrumentDetails = false
    ) {
        $this->AutoHandleRequestDelegation = false;
        parent::__construct($method);

        $this->bCandidates        = $bCandidates;
        $this->bInstruments       = $bInstruments;
        $this->bInstrumentDetails = $bInstrumentDetails;
        $this->bVisits            = $bVisits;

        $this->ProjectName = $projectName;
        include_once 'Utility.class.inc';

        if ($projectName === 'loris') {
            $this->ProjectID = 0;
        } else {
            $this->ProjectID = $this->getProjectID($projectName);
        }

        if (!is_numeric($this->ProjectID)) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error(['error' => 'Invalid project']);
            $this->safeExit(0);
        }

        $this->handleRequest();

    }

    /**
     * Handles a GET request for a project data
     *
     * @return void (but populates $this->JSON)
     */
    function handleGET()
    {
        if (!empty($this->JSON)) {
            return $this->JSON;
        }

        $JSONArray = [
                      "Meta" => [
                                 "Project" => $this->ProjectName,
                                ],
                     ];

        if ($this->bCandidates) {
            if ($this->ProjectID === 0) {
                $rows = $this->DB->pselect(
                    "SELECT CandID FROM candidate",
                    array()
                );
            } else {
                $rows = $this->DB->pselect(
                    "SELECT CandID FROM candidate WHERE ProjectID=:projID",
                    array("projID" => $this->ProjectID)
                );
            }
            $CandIDs = [];

            foreach ($rows as $row) {
                $CandIDs[] = $row['CandID'];
            }

            $JSONArray['Candidates'] = $CandIDs;
        }

        if ($this->bInstruments) {
            $Instruments = \Utility::getAllInstruments();

            if ($this->bInstrumentDetails) {
                $dets   = [];
                $config = $this->Factory->config();
                $DB     = $this->Factory->database();

                $DDE = $config->getSetting("DoubleDataEntryInstruments");

                foreach ($Instruments as $instrument=> $FullName ) {
                    $subgroup = $DB->pselectOne(
                        "SELECT sg.Subgroup_name
                            FROM test_names tn
                            LEFT JOIN test_subgroups sg ON (tn.Sub_group=sg.ID)
                        WHERE tn.Test_name=:inst",
                        array('inst' => $instrument)
                    );

                    $DDEEn = in_array($instrument, $DDE);

                    $dets[$instrument] = [
                                          'FullName'               => $FullName,
                                          'Subgroup'               => $subgroup,
                                          'DoubleDataEntryEnabled' => $DDEEn,
                                         ];
                }
                $JSONArray['Instruments'] = $dets;
            } else {
                $JSONArray['Instruments'] = array_keys($Instruments);
            }
        }

        if ($this->bVisits) {
            $Visits     = \Utility::getExistingVisitLabels($this->ProjectID);
            $VisitNames = array_keys($Visits);

            $JSONArray['Visits'] = $VisitNames;
        }

        $this->JSON = $JSONArray;
    }

    /**
     * Calculates the ETag for this project by taking an MD5 of the
     * JSON
     *
     * @return string ETag for project
     */
    function calculateETag()
    {
        return md5('Project:' . json_encode($this->JSON, true));
    }

}

if (isset($_REQUEST['PrintProjectJSON'])) {
    $Proj = new Project(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['Project'],
        isset($_REQUEST['Candidates'])  ? true : false,
        isset($_REQUEST['Instruments']) ? true : false,
        isset($_REQUEST['Visits'])      ? true : false,
        isset($_REQUEST['InstrumentDetails'])      ? true : false
    );

    print $Proj->toJSONString();
}
?>
