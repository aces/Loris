<?php declare(strict_types=1);

/**
 * This implements the Instruments page class under Project
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Project;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling the /projects/$projectname/instruments endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Instruments extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * A cache of the results of the endpoint, so that
     * it doesn't need to be recalculated for the ETag and handler
     */
    private $_cache;

    /**
     * The requested project
     */
    private $_project;

    /**
     * Contructor
     *
     * @param \LORIS\LorisInstance $loris      The LORIS instance to retrieve data
     *                                         from.
     * @param \Project             $project    The requested project
     * @param string               $apiversion The version of the API being used
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        \Project $project,
        private string $apiversion = 'v0.0.3'
    ) {
        $this->_project = $project;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return ['GET'];
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return [
            'v0.0.3',
            'v0.0.4-dev',
        ];
    }

    /**
     * Handles a request that starts with /projects/$projectname/candidates
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');
        if (count($pathparts) === 0) {
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);

            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());
            default:
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }

        // Delegate to instrument specific endpoint.
        $instrumentname = array_shift($pathparts);
        try {
            $loris      = $request->getAttribute("loris");
            $instrument = \NDB_BVL_Instrument::factory(
                $loris,
                $instrumentname,
                '',
                '',
                true
            );

            $user = $request->getAttribute("user");
            if ($instrument->_hasAccess($user) == false) {
                return new \LORIS\Http\Response\JSON\Forbidden();
            }
        } catch (\Exception $e) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $endpoint = new Instrument\Instrument($instrument);
        $request  = $request->withAttribute('pathparts', $pathparts);

        return $endpoint->process($request, $endpoint);
    }

    /**
     * Create an array representation of this endpoint's reponse body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $prov = new \LORIS\api\Provisioners\ProjectInstrumentsRowProvisioner(
            $this->loris
        );
        $user = $request->getAttribute('user');

        $instruments = (new \LORIS\Data\Table())
            ->withDataFrom($prov)
            ->getRows($user);

        $array = (new \LORIS\api\Views\Project\Instruments(
            $this->_project,
            iterator_to_array($instruments),
            $this->apiversion
        ))->toArray();

        $this->_cache = new \LORIS\Http\Response\JsonResponse($array);

        return $this->_cache;
    }

    /**
     * Implements the ETagCalculator interface
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        return md5(json_encode($this->_handleGET($request)->getBody()));
    }
}
