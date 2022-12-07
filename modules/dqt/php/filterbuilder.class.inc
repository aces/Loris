<?php declare(strict_types=1);
/**
 * The FiltersBuilder class for requests.
 * returns data used for Define Filters
 * when user imports data by CSV.
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  DQT
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\dqt;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * The FiltersBuilder class for requests.
 * returns data used for Define Filters
 * when user imports data by CSV.
 *
 * @category Loris
 * @package  DQT
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Filterbuilder extends \NDB_Page
{
    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure allowed request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ['GET']
            );
        }
    }

    /**
     * CSV Import data needs CandID mapped to PSCID
     * concerning sessions for filters to be built
     * when searching for CandID.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // create DB object
        $DB = $request->getAttribute('loris')->getDatabaseConnection();

        $result        = $DB->pselect(
            "SELECT
                        candidate.CandID,
                        PSCID,
                        s.Visit_label
                    FROM
                        candidate
                        JOIN session s ON candidate.CandID = s.CandID",
            []
        );
        $data          = [];
        $allCandidates = [];
        for ($i=0; $i<=count($result); $i++) {
            if (!isset($allCandidates[$result[$i]['PSCID']])) {
                $allCandidates[$result[$i]['PSCID']] = [];
            }
            if (!in_array(
                $result[$i]['Visit_label'],
                $allCandidates[$result[$i]['PSCID']]
            )
            ) {
                array_push(
                    $allCandidates[$result[$i]['PSCID']],
                    $result[$i]['Visit_label']
                );
            }
            array_push(
                $data,
                [$result[$i]['CandID'] => $result[$i]['PSCID']]
            );
        }
        // Return result to the user.
        return new \LORIS\Http\Response\JsonResponse(
            ['mapping' => $data, 'allCandidates' => $allCandidates]
        );
    }

    /**
     * Returns true if the user has permission
     * for accessing the DQT module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('dataquery_view');
    }

}
