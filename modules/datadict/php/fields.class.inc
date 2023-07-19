<?php
namespace LORIS\datadict;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Return the dynamic field options for the data dictionary filter
 * as a JSON object.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link    https://github.com/aces/Loris
 */
class Fields extends \NDB_Page
{
    /**
     * Returns a list of instruments to use as the "Source From"
     * filter options and the list of subprojects for the current
     * user as JSON.
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // get subprojects
        $user        = \NDB_Factory::singleton()->user();
        $projects    = $user->getProjectIDs();
        $subprojects = [];
        foreach ($projects AS $projectID) {
            $subprojects = $subprojects + \Utility::getSubprojectList($projectID);
        }
        return new \LORIS\Http\Response\JSON\OK(
            [
                'sourceFrom'  => \Utility::getAllInstruments(),
                'subprojects' => $subprojects
            ]
        );
    }
}
