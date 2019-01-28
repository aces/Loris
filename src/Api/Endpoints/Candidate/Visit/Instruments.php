<?php declare(strict_types=1);
/**
 * This implements the visit's instruments endpoint class
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints\Candidate\Visit;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * A class for handling request for a visit instruments.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Instruments extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    protected $visit;

    /**
     * Contructor
     *
     * @param \Timepoint $visit The requested visit
     */
    public function __construct(\Timepoint $visit)
    {
        $this->visit = $visit;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return array('GET');
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return array(
                'v0.0.1',
                'v0.0.2',
                'v0.0.3-dev',
               );
    }

    /**
     * Handles a request that starts with /candidates/$candid
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
                return new \LORIS\Http\Response\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }

        // Delegate to instrument specific endpoint.
        $instrumentname = array_shift($pathparts);

        $battery = new \NDB_BVL_Battery();
        $battery->selectBattery($this->visit->getSessionID());

        $entry = array_filter(
            $battery->getBatteryVerbose(),
            function ($item) use ($instrumentname) {
                return $item['Test_name'] == $instrumentname;
            }
        );

        $dde       = array_search('dde', $pathparts) !== false;
        $arraykey  = $dde ? 'DDECommentID' : 'CommentID';
        $commentid = array_pop($entry)[$arraykey] ?? null;
        if ($commentid === null) {
            return new \LORIS\Http\Response\NotFound();
        }

        try {
            $instrument = \NDB_BVL_Instrument::factory(
                $instrumentname,
                $commentid,
                null,
                true
            );
        } catch (\Exception $e) {
            return new \LORIS\Http\Response\NotFound();
        }

        $endpoint = new Instrument\Instrument($this->visit, $instrument);
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
        if (!isset($this->cache)) {
            $provisioner = new \LORIS\api\VisitInstrumentsRowProvisioner(
                $this->visit
            );
            $data        = (new \LORIS\Data\Table())
                ->withDataFrom($provisioner)
                ->toArray($request->getAttribute('user'));

            $view = (new \LORIS\Api\Views\Visit\Instruments(
                $this->visit,
                array_values($data)
            ))->toArray();

            $this->cache = new \LORIS\Http\Response\JsonResponse($view);
        }
        return $this->cache;
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
