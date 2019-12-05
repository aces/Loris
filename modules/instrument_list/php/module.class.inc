<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 7
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\instrument_list;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

use LORIS\StudyEntities\Candidate\CandID;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Imaging
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Module extends \Module
{

    /**
     * The instrument_list module falls back to the instrument_list page regardless
     * of what the page loaded was. This ensures that routes which use the CandID
     * (and not the word "instrument_list") are still able to be loaded and not
     * give 404 errors.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $resp = parent::handle($request);
        // hasAccess from the parent returns a 403
        if ($resp->getStatusCode() != 404) {
            return $resp;
        }

        /* If the response code above was a 404, it could have been caused by
         * the \NotFound exception in instrument_list.class.inc. This means
         * that the route used to access the module contained either a candID
         * or a timepoint but not both.
         * The code below extracts this information from the server so that the
         * module can load properly even in cases like the above where
         * "instrument_list" isn't actually in the URL path.
         */

        // Falling back to instrument_list, ensure that the CandID
        // and SessionID are valid, and if so attach the models to
        // the request.
        $page = $this->loadPage("instrument_list");

        $gets = $request->getQueryParams();

        try {
            $attribute = $request->getAttribute("CandID");
            if ($attribute !== null) {
                $candidate = \Candidate::singleton(new CandID($attribute));
            } else {
                $candidate = \Candidate::singleton(new CandID($gets['candID']));
            }
            $request = $request->withAttribute("Candidate", $candidate);

            $attribute = $request->getAttribute("timePoint");
            if ($attribute === null) {
                $request = $request->withAttribute(
                    "timePoint",
                    \TimePoint::singleton(intval($gets['sessionID']))
                );
            }

            // We need to set the internal page properties for hasAccess to succeed.
            $page->setCandidate($candidate);
            $page->setTimePoint($request->getAttribute("timePoint"));

        } catch (\LorisException $e) {
            $user    = $request->getAttribute("user") ?? new \LORIS\AnonymousUser();
            $message = 'Could not find candidate information for candidate '
                . htmlspecialchars($gets['candID']) . ' and session '
                . htmlspecialchars($gets['sessionID']) . '.';
            return (new \LORIS\Middleware\PageDecorationMiddleware(
                $user
            ))->process(
                $request,
                new \LORIS\Router\NoopResponder(
                    new \LORIS\Http\Error(
                        $request,
                        404,
                        $message
                    )
                )
            );

        }
        return $page->process($request, $page);
    }

    public function getLongName() : string {
        return "Instrument List";
    }
}
