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
class Configuration extends \Loris\API\APIBase
{
    var $ProjectID;
    var $ProjectName;

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
        $projectName
    ) {
        $this->AutoHandleRequestDelegation = false;
        parent::__construct($method);

        $this->ProjectName = $projectName;
        //include_once 'Utility.class.inc';

        /*
        $this->ProjectID = $this->getProjectID($projectName);

        if (!is_numeric($this->ProjectID)) {
            $this->header("HTTP/1.1 404 Not Found");
            $this->error(['error' => 'Invalid project']);
            $this->safeExit(0);
        }
         */

        $this->handleRequest();

    }

    /**
     * Handles a GET request for a project data
     *
     * @return none, but populates $this->JSON
     */
    function handleGET()
    {
        $config = $this->Factory->config();
        $Settings = [];

        $JSONArray = [
            "Meta" => [
                "Project" => $this->ProjectName,
                "DocType" => "Configuration"
            ]
        ];

        $Settings['useProjects'] = $config->getSetting("useProjects");
        $Settings['useEDC'] = $config->getSetting("useEDC");

        $PSCID = $config->getSetting("PSCID");
        $Settings["PSCID"] = [
            "generation" => $PSCID["generation"],
            'regex' => \Utility::structureTOPCRE($PSCID['structure'], 'SITE')
        ];

        $JSONArray['Settings'] = $Settings; 
        $this->JSON = $JSONArray;
    }
}

if (isset($_REQUEST['PrintConfigJSON'])) {
    $Proj = new Configuration(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['Project']
    );

    print $Proj->toJSONString();
}
?>
