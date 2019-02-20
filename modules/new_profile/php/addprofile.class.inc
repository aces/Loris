<?php
/**
 * Create both PSCID and DCCID for a candidate
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Candidate_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\new_profile;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Create PSCID and DCCID for a candidate
 *
 * @category Main
 * @package  Candidate_List
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class AddProfile extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Same as the permissions for the main page.
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
     * This function will return a json file with DCCID and PSCID
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure it's a POST request.
        if ($request->getMethod() != "POST") {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "POST")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        "Only POST requests are allowed"
                    )
                );
        }
        $values    = $request->getParsedBody();
        $DB        = \Database::singleton();
        $user      = \User::singleton();
        $config    = \NDB_Config::singleton();
        $site_arr  = $user->getData('CenterIDs');
        $num_sites = count($site_arr);
        if ($num_sites >=1) {
            $candID = \Candidate::createNew(
                $values['site'],
                $values['dateTaken'],
                $values['edcDateTaken'] ?? null,
                $values['sex'],
                $values['pscid'] ?? null
            );
        } else {
            $centerIDs = $user->getData('CenterIDs');
            $centerID  = $centerIDs[0];
            $candID    = \Candidate::createNew(
                $centerID,
                $values['dateTaken'],
                $values['edcDateTaken'] ?? null,
                $values['sex'],
                $values['pscid'] ?? null
            );
        }
        // get the candidate
        $candidate = \Candidate::singleton($candID);
        // setup the project for candidate
        if (isset($values['project'])) {
            $candidate->setData(array('ProjectID' => $values['project']));
        }
        $result           = array();
        $result['candID'] = $candID;
        $result['pscid']  = $candidate->getPSCID();

        return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withHeader("Allow", "POST")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($result)
                    )
                );
    }
}

