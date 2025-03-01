<?php declare(strict_types=1);

/**
 * This implements the Candidate endpoint class under Candidates.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Candidate;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling the /candidates/$candidate endpoint.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Candidate extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Candidate.
     *
     * @var \Candidate
     */
    private $_candidate;

    /**
     * Contructor
     *
     * @param \LORIS\LorisInstance $loris     The LORIS instance to retrieve data
     *                                        from.
     * @param \Candidate           $candidate The requested candidate.
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        \Candidate $candidate
    ) {
        $this->_candidate = $candidate;
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
     * Handles a request that starts with /candidates/$candid.
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

        // Delegate to sub-endpoints
        $visit_label = urldecode(array_shift($pathparts));
        $newrequest  = $request
            ->withAttribute('pathparts', $pathparts);

        $sessionid = array_search(
            $visit_label,
            $this->_candidate->getListOfVisitLabels()
        );

        try {
            $visit = \NDB_Factory::singleton()->timepoint(
                new \SessionID(strval($sessionid))
            );
        } catch (\LorisException | \TypeError | \DomainException $e) {
            $visit = null;
        }

        $version     = $request->getAttribute("LORIS-API-Version");
        $subendpoint = __NAMESPACE__ . '\\' . 'Visit\Visit';

        if ($version == 'v0.0.4-dev') {
            $subendpoint = __NAMESPACE__ . '\\' .'Visit\Visit_0_0_4_Dev';
        }

        $handler = new $subendpoint(
            $this->loris,
            $this->_candidate,
            $visit
        );

        return $handler->process(
            $newrequest,
            $handler
        );
    }

    /**
     * Returns an array representation of the requested candiate following
     * the API specifications.
     *
     * @return ResponseInterface
     */
    private function _handleGET() : ResponseInterface
    {
        // TODO :: User permission to acces this and subendpoints
        $array = (new \LORIS\api\Views\Candidate($this->_candidate))
            ->toArray();
        return new \LORIS\Http\Response\JsonResponse($array);
    }

    /**
     * Implements the ETagCalculator interface.
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        return md5(json_encode($this->_candidate));
    }
}
