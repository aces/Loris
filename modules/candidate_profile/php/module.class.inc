<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\candidate_profile;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Behavioural
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{
    /**
     * The candidate_profile module overrides the default routing to ensure that
     * the "candidate_profile" subpage is loaded when called with an unknown
     * page. This makes it possible to provide routes which fallback on loading
     * the candidate_profile in the module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        try {
            $resp = parent::handle($request);
            if ($resp->getStatusCode() != 404) {
                  return $resp;
            }
        } catch (\NotFound $e) {
        }
        $candID = new \LORIS\StudyEntities\Candidate\CandID("965327");
        $request = $request->withAttribute(
            "CandID", $candID
        );

        $page = $this->loadPage("candidate_profile");
        return $page->process($request, $page);
    }


    public function getLongName() : string
    {
        return "Candidate Profile";
    }

    /**
     * {@inheritDoc}
     *
     * @param string $type The type of widgets to get
     * @param \User  $user The user widgets are being retrieved for.
     *
     * @return \LORIS\GUI\Widget[]
     */
    public function getWidgets(string $type, \User $user, array $options) : array
    {
        switch($type) {
        case 'candidate':
            $factory = \NDB_Factory::singleton();
            $baseurl = $factory->settings()->getBaseURL();

            $candidate = $options['candidate'];
            return [
                new CandidateWidget(
                    "Candidate Info",
                    $baseurl . "/candidate_profile/js/CandidateInfo.js",
                    "lorisjs.candidate_profile.CandidateInfo",
                    [],
                    1,
                    1,
                    -100,
                ),
            ];
        }
        return [];

    }
}
