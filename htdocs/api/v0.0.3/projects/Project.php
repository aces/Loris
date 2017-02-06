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
    private $_project;

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
    public function __construct($method, $projectName)
    {
        $this->AutoHandleRequestDelegation = false;
        parent::__construct($method);

        try {
            $this->_project = $this->Factory->project($projectName);
        } catch (\LorisException $e) {
            // This projectName does not exists
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
        $config = $this->Factory->config();
        $PSCID  = $config->getSetting("PSCID");

        $type  = $PSCID['generation'] == 'sequential' ? 'auto' : 'prompt';
        $regex = \Utility::structureToPCRE($PSCID['structure'], "SITE");

        $this->JSON = array(
            'name'   => $this->_project->getName(),
            'useEDC' => $this->_project->isUsingEDC(),
            'PSCID'  => array(
                'Type'  => null,
                'Regex' => null
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
        $_REQUEST['Project'],
        isset($_REQUEST['Candidates'])  ? true : false,
        isset($_REQUEST['Instruments']) ? true : false,
        isset($_REQUEST['Visits'])      ? true : false,
        isset($_REQUEST['InstrumentDetails'])      ? true : false
    );

    print $Proj->toJSONString();
}
?>
