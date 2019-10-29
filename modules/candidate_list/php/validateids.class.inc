<?php
/**
 * The validateIDs endpoint is used to verify whether or not
 * a candidate PSCID and CandID match
 *
 * It takes two parameters (PSCID and CandID) and returns either
 * "1" or "0".
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Candidate_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\candidate_list;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Implements the ValidateIDs endpoint
 *
 * @category Main
 * @package  Candidate_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class ValidateIDs extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Same as the permissions for the main menu filter page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true iff the user has access to this page.
     */
    function _hasAccess(\User $user) : bool
    {
        return (
            $user->hasPermission('access_all_profiles')
            || ($user->hasStudySite() && $user->hasPermission('data_entry'))

        );
    }

    /**
     * This acts as an AJAX endpoint that only returns a "0" or "1" depending
     * on whether the candidate passed exists.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // The parent handles things like hasAccess checks.
        $resp = parent::handle($request);
        switch ($resp->getStatusCode()) {
        case 200:
            // If it was a 200 code, it just means display was called and
            // access validated. We still need to do other validations
            // and add the result body.
            break;
        default:
            return $resp;
        }

        // Ensure it's a GET request.
        if ($request->getMethod() != "GET") {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "GET")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        "Only GET requests are allowed"
                    )
                );
        }

        // Ensure CandID and PSCID are both passed.
        $gets = $request->getQueryParams();

        if (!ctype_digit($gets['CandID'])) {
            $exists = "0";
        } else {
            if (!isset($gets['CandID']) || !isset($gets['PSCID'])) {
                return (new \LORIS\Http\Response())
                    ->withHeader("Content-Type", "text/plain")
                    ->withStatus(400)
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            "Must provide PSCID and CandID to validate"
                        )
                    );
            }
            // Return "0" or "1" based on whether it exists or not.
            // We always return a 200 error code and not a 404, because
            // even if the CandID doesn't exist or match, the validateids
            // endpoint still exists and has a valid response.
            $exists = \Candidate::candidateExists(
                $gets['CandID'],
                $gets['PSCID']
            ) ? "1" : "0";
        }
        return (new \LORIS\Http\Response())
            ->withHeader("Content-Type", "text/plain")
            ->withStatus(200)
            ->withBody(new \LORIS\Http\StringStream($exists));
    }
}