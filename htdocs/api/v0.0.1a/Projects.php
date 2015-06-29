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
            $projects   = \Utility::getProjectList();
            $this->JSON = [
                           "Projects" => array_values($projects),
                          ];
        } else {
            $this->JSON = [
                           "Projects" => ["loris"],
                          ];
        }
    }
}

if (isset($_REQUEST['PrintProjects'])) {
    $obj = new Projects($_SERVER['REQUEST_METHOD']);
    print $obj->toJSONString();
}
?>
