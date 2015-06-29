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
     * @param string  $method       The HTTP method of the request
     * @param string  $projectName  The project to be serialized
     * @param boolean $bCandidates  If true, candidates for project should
     *                              be included in
     *                              serialization
     * @param boolean $bInstruments If true, list of instruments for project
     *                              should be included in serialization
     * @param boolean $bVisits      If true, visits for project should be
     *                              included in serialization
     */
    public function __construct(
        $method,
        $projectName,
        $bCandidates,
        $bInstruments,
        $bVisits
    ) {
        $this->AutoHandleRequestDelegation = false;
        parent::__construct($method);

        $this->bCandidates  = $bCandidates;
        $this->bInstruments = $bInstruments;
        $this->bVisits      = $bVisits;

        $this->ProjectName = $projectName;
        include_once 'Utility.class.inc';

        $this->ProjectID = $this->getProjectID($projectName);

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
     * @return none, but populates $this->JSON
     */
    function handleGET()
    {
        $JSONArray = [
                      "Meta" => [
                                 "Project" => $this->ProjectName,
                                ],
                     ];

        if ($this->bCandidates) {
            $rows    = $this->DB->pselect(
                "SELECT CandID FROM candidate WHERE ProjectID=:projID",
                array("projID" => $this->ProjectID)
            );
            $CandIDs = [];

            foreach ($rows as $row) {
                $CandIDs[] = $row['CandID'];
            }

            $JSONArray['Candidates'] = $CandIDs;
        }

        if ($this->bInstruments) {
            $Instruments = \Utility::getAllInstruments();
            $JSONArray['Instruments'] = array_keys($Instruments);
        }

        if ($this->bVisits) {
            $Visits     = \Utility::getExistingVisitLabels($this->ProjectID);
            $VisitNames = array_keys($Visits);

            $JSONArray['Visits'] = $VisitNames;
        }

        $this->JSON = $JSONArray;
    }
}

if (isset($_REQUEST['PrintProjectJSON'])) {
    $Proj = new Project(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['Project'],
        isset($_REQUEST['Candidates'])  ? true : false,
        isset($_REQUEST['Instruments']) ? true : false,
        isset($_REQUEST['Visits'])      ? true : false
    );

    print $Proj->toJSONString();
}
?>
