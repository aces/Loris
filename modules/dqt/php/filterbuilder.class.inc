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
            return $this->_handleGET();
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
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET() : ResponseInterface
    {
        // create DB object
        $DB = \Database::singleton();

        $result = $DB->pselect(
            "SELECT
                        CandID,
                        PSCID
                    FROM candidate",
            []
        );
        $data   = [];
        for ($i=0; $i<=count($result); $i++) {
            array_push(
                $data,
                [$result[$i]['CandID'] => $result[$i]['PSCID']]
            );
        }
        // Return result to the user.
        return new \LORIS\Http\Response\JsonResponse(
            $data
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
