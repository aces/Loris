<?php
/**
 * Implements PrefixRouter, a class for handling prefixes
 * of a URL and then delegating to other request handlers.
 *
 * PHP Version 7
 *
 * @category Router
 * @package  Router
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\Router;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\URIInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Server\RequestHandlerInterface;

/**
 * A PrefixRouter is a type of router which delegates to other
 * routers. It delegates to the first prefix which matches the
 * incoming request after stripping off the prefix.
 *
 * @category Router
 * @package  Router
 * @author   Dave MacFarlane <david.macfarlane2@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class PrefixRouter implements RequestHandlerInterface
{
    /**
     * The paths which this PrefixRouter handles
     *
     * @var \Traversable
     */
    protected $paths;

    /**
     * Constructs a PrefixRouter which handles paths.
     *
     * @param \Traversable $paths The paths which are handled
     *                            by this PrefixRouter. key
     *                            must be the path, and value
     *                            a valid PSR15 handler.
     */
    public function __construct(\Traversable $paths)
    {
        $this->paths = $paths;
    }

    /**
     * Determines whether or not $uri has the prefix of $prefix
     *
     * @param string       $prefix The prefix to check
     * @param URIInterface $uri    The URI to compare.
     *
     * @return bool
     */
    protected function hasPrefix(string $prefix, URIInterface $uri)
    {
        $path = $uri->getPath();
        return (strpos($path, $prefix) === 0);
    }

    /**
     * Given a URL which has a prefix, returns a new URL with the prefix
     * stripped off.
     *
     * @param string       $prefix The prefix to string.
     * @param URIInterface $uri    The URI to strip it from.
     *
     * @return URIInterface with string stripped from the beginning.
     */
    protected function stripPrefix(string $prefix, URIInterface $uri) : URIInterface
    {
        $path    = $uri->getPath();
        $newpath = substr($path, strlen($prefix));
        return $uri->withPath((string) $newpath);
    }

    /**
     * Handle checks each request that this PrefixRouter interface knows
     * about and delegates to the first one which matches.
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface The PSR15 Response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        foreach ($this->paths as $path => $subhandler) {
            if ($this->hasPrefix($path, $request->getURI())) {
                // Strip the prefix before passing it to the subhandler.
                $newURI  = $this->stripPrefix($path, $request->getURI());
                $request = $request->withURI($newURI);
                return $subhandler->handle($request);
            }
        }
        return new \LORIS\Http\Error($request, 404);
    }
}
