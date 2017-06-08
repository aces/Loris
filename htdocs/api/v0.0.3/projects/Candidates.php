<?php
/**
 * This class handles project's candidates related API requests
 *
 * PHP Version 5
 *
 * @category Main
 * @package  API
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API\Projects;

set_include_path(get_include_path() . ":" . __DIR__ . "/..");
require_once 'APIBase.php';

/**
 * This class handles project's candidates related API requests
 *
 * PHP Version 5
 *
 * @category Main
 * @package  API
 * @author   Xavier Lecours Boucher <xavier.lecoursboucher@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Candidates extends \Loris\API\APIBase
{
    private $_project;

    /**
     * Constructs an object to handle JSON serialization
     *
     * @param string $method      The HTTP request method of the request
     * @param string $projectName The project name
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
    }

    /**
     * Handles a GET request for a project data
     *
     * @return none, but populates $this->JSON
     */
    function handleGET()
    {
        $this->JSON = $this->_project->getCandidateIds();
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

if (isset($_REQUEST['format'])) {
    switch ($_REQUEST['format'])
    {
    case 'json':
        $candidates = new Candidates(
            $_SERVER['REQUEST_METHOD'],
            $_REQUEST['Project']
        );

        $candidates->handleRequest();

        print $candidates->toJSONString();
        break;
    default:
        error_log('Loris\API\Projects\Project - Unsupported format');
        header('"Bad Request", true, 400');
    }

} else {
    header('"Bad Request", true, 400');
}
?>
