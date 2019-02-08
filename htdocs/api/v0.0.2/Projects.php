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
     * @return void (but populates $this->JSON)
     */
    public function handleGET()
    {
        if (!empty($this->JSON)) {
            return;
        }
        $config = $this->Factory->config();

        $useProjects = $config->getSetting("useProjects");
        $useEDC      = $config->getSetting("useEDC");

        if ($useEDC === '1' || $useEDC === 'true') {
            $useEDC = true;
        } else {
            $useEDC = false;
        }
        $PSCID       = $config->getSetting("PSCID");
        $PSCIDFormat = \Utility::structureToPCRE($PSCID['structure'], "SITE");

        $type = $PSCID['generation'] == 'sequential' ? 'auto' : 'prompt';

        $settings = [
                     "useEDC" => $useEDC,
                     "PSCID"  => [
                                  "Type"  => $type,
                                  "Regex" => $PSCIDFormat,
                                 ],
                    ];

        if ($useProjects && $useProjects !== "false" && $useProjects !== "0") {
            $projects  = \Utility::getProjectList();
            $projArray = [];
            foreach ($projects as $project) {
                $projArray[$project] = $settings;
            }
            $this->JSON = ["Projects" => $projArray];
        } else {
            $this->JSON = [
                           "Projects" => array("loris" => $settings),
                          ];
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
    print $obj->toJSONString();
}
?>
