<?php
/**
 * This serves as a hint to LORIS that this module is a real module.
 * It handles the basic routing for the module.
 *
 * PHP Version 5
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
        $validAPIVersions = [
                             "v0.0.1",
                             "v0.0.2",
                             "v0.0.3-dev",
                            ];
        $url    = $request->getURI()->getPath();
        $pieces = [];
        if (preg_match(
            "/^\/?(v[0-9]+\.[0-9]+\.[0-9]+[^\/]*)\/(.*)/",
            $url,
            $pieces
        ) !== 1
        ) {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/json")
                ->withStatus(400)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            [
                             'error' => "You must specify a version of the API "
                                . "to use in the URL.",
                            ]
                        )
                    )
                );
        };
        $version  = $pieces[1];
        $endpoint = $pieces[2];
        if (!in_array($version, $validAPIVersions)) {
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "application/json")
                ->withStatus(400)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode(
                            ['error' => "Unsupported LORIS API version " . $version]
                        )
                    )
                );
        }

        // Strip the version and add it to a request attribute, then let the default
        // module handler kick in to delegate to the appropriate page.
        $newurl     = $request->getURI()->withPath($endpoint);
        $newrequest = $request
            ->withURI($newurl)
            ->withAttribute("LORIS-API-Version", $version);

        $parentresp = parent::handle($newrequest);
        switch ($parentresp->getStatusCode()) {
        case 401:
        case 403:
        case 404:
            // If permission was denied, fake a 404 to avoid leaking metadata.
            // Also convert all 404s to the same message to ensure you can't
            // derive metadata by looking at the error message.
            return $parentresp
                ->withHeader("Content-Type", "application/json")
                ->withStatus(404)
                ->withBody(
                    new \LORIS\HTTP\StringStream(
                        json_encode(["error" => "not found"])
                    )
                );
        default:
            return $parentresp;
        }
    }
}
