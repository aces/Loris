<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It handles the basic routing for the module.
 *
 * PHP Version 7
 *
 * @category   API
 * @package    Main
 * @subpackage Login
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
namespace LORIS\api;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Class module implements the basic LORIS module functionality
 *
 * @category   Core
 * @package    Main
 * @subpackage Login
 * @author     Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris/
 */
class Module extends \Module
{

    /**
     * The API module is a module which is "public" so that the login endpoint
     * is accessible. Each endpoint must do its own validation of access levels
     *
     * @return bool
     */
    public function isPublicModule()
    {
        // The API is "public"  because the login endpoint needs to be public.
        return true;
    }

    /**
     * Implements the PSR15 RequestHandler interface for this module. The API
     * module does some preliminary verification of the request, converts the
     * version from the URL to a request attribute, and then falls back on the
     * default LORIS page handler.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $url    = $request->getURI()->getPath();
        $pieces = [];
        if (preg_match(
            "/^\/?(v[0-9]+\.[0-9]+\.[0-9]+[^\/]*)\/(.*)/",
            $url,
            $pieces
        ) !== 1
        ) {
            return new \LORIS\Http\Response\BadRequest(
                'You must specify a version of the API to use in the URL'
            );
        };

        $version  = $pieces[1];
        $endpoint = $pieces[2];

        // Strip the version and add it to a request attribute, then let the default
        // module handler kick in to delegate to the appropriate page.
        $newurl = $request->getURI()->withPath($endpoint);

        // Split the url into parts to form a queue for the endpoints to delegate
        // the request to subendpoints
        $pathparts = explode('/', $endpoint);

        $newrequest = $request
            ->withURI($newurl)
            ->withAttribute("LORIS-API-Version", $version)
            ->withAttribute('pathparts', $pathparts);

        $handlername = $pathparts[0];

        switch($handlername) {
        case 'candidates':
            $handler = new \LORIS\api\Endpoints\Candidates();
            break;
        case 'login':
            $handler = new \LORIS\api\Endpoints\Login();
            break;
        case 'projects':
            $handler = new \LORIS\api\Endpoints\Projects();
            break;
        default:
            return new \LORIS\Http\Response\NotFound();
        }

        // This disregards the parent handler from the base module class,
        // because most of the work it does (adding page decoration middleware,
        // delegating to a sub-page class in the Module, etc) is not relevant
        // for the API module.
        return $handler->process($newrequest, $handler);
    }
}
