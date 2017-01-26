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
    var $useEDC;
    var $PSCID;

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

        $Projects = \Utility::getProjectList();
        foreach ($Projects as $id => $project) {
            if ($project === $ProjectName) {
                return $id;
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
        $projectName
    ) {
        $this->AutoHandleRequestDelegation = false;
        parent::__construct($method);

        $this->ProjectName = $projectName;

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

        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();
        
        $this->useEDC         = $config->getSetting("useEDC");
        $this->PSCID  = $config->getSetting("PSCID");
 
        $this->handleRequest();

    }

    /**
     * Handles a GET request for a project data
     *
     * @return none, but populates $this->JSON
     */
    function handleGET()
    {
        $PSCIDFormat = \Utility::structureToPCRE($this->PSCID['structure'], "SITE");
        $type = $this->PSCID['generation'] == 'sequential' ? 'auto' : 'prompt';
        
        $this->JSON = array(
            "Name" => $this->ProjectName,
            "useEDC" => $this->useEDC,
            "PSCID" => array(
                "Type"  => $type,
                "Regex" => $PSCIDFormat,
            )
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
        return md5('Project:' . json_encode($this->JSON, true));
    }

}

if (isset($_REQUEST['PrintProjectJSON'])) {
    $Proj = new Project(
        $_SERVER['REQUEST_METHOD'],
        $_REQUEST['Project']
    );

    header('content-type: application/json');
    print $Proj->toJSONString();
}
?>
