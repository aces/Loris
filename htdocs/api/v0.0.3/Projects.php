<?php
/**
 * Handles requests to the projects portion of the API
 *
 * PHP Version 5.5+
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace Loris\API;
set_include_path(get_include_path() . ":" . __DIR__);
require_once 'APIBase.php';

/**
 * Handles requests to the projects portion of the API
 *
 * @category Main
 * @package  API
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Projects extends APIBase
{
    /**
     * Constructs a Projects handler
     *
     * @param string $method The HTTP request method
     */
    public function __construct($method)
    {
        parent::__construct($method);
    }

    /**
     * Handles a GET request
     *
     * @return none, but populates $this->JSON
     */
    public function handleGET()
    {
        $config = $this->Factory->config();
        $useProjects = $config->getSetting("useProjects");

        if ($useProjects && $useProjects !== "false" && $useProjects !== "0") {
            $this->JSON = \Utility::getProjectList();
        } else {
            $this->JSON = array("loris");
        }
    }

    /**
     * Calculates ETag for projects based on the JSON encoding
     *
     * @return string ETag for projects
     */
    function calculateETag()
    {
        $this->handleGET();
        $etag = md5(json_encode($this->JSON, true));
        return $etag;
    }
}

if (isset($_REQUEST['PrintProjects'])) {
    $obj = new Projects($_SERVER['REQUEST_METHOD']);

    header('content-type: application/json');
    print $obj->toJSONString();
}
?>
