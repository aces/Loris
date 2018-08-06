<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It does nothing but implement the module class in the module's namespace.
 *
 * PHP Version 5
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
     * 404 errors.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        try {
            $resp = parent::handle($request);
            // hasAccess from the parent returns a 403
            if ($resp->getStatusCode() != 404) {
                return $resp;
            }
        } catch (\LorisException $e) {
            // Calling hasAccess from the loader would have failed with
            // an exception saying it needs a timepoint/candidate if loading
            // the instrument_list page, which we set below.
        }

        // Falling back to instrument_list, ensure that the CandID
        // and SessionID are valid, and if so attach the models to
        // the request.
        $page = $this->loadPage("instrument_list");

        $gets = $request->getQueryParams();

        $attribute = $request->getAttribute("CandID");
        if ($attribute !== null) {
            $candidate = \Candidate::singleton($attribute);
        } else {
            $candidate = \Candidate::singleton($gets['candID'] ?? '');
        }
        $request = $request->withAttribute("Candidate", $candidate);

        $attribute = $request->getAttribute("timePoint");
        if ($attribute === null) {
            $request = $request->withAttribute(
                "timePoint",
                \TimePoint::singleton($gets['sessionID'])
            );
        }

        // We need to set the internal page properties for hasAccess to succeed.
        $page->setCandidate($candidate);
        $page->setTimePoint($request->getAttribute("timePoint"));

        return $page->process($request, $page);

    }
}
