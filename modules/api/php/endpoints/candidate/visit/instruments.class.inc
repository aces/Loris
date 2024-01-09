<?php declare(strict_types=1);
/**
 * This implements the visit's instruments endpoint class
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Candidate\Visit;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling request for a visit instruments.
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
     * The requested Visit
     *
     * @var \Timepoint
     */
    private $_visit;

    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     */
    private $_cache;

    /**
     * Contructor
     *
     * @param \Timepoint $visit The requested visit
     */
    public function __construct(\Timepoint $visit)
    {
        $this->_visit = $visit;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return ['GET', 'POST'];
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
     * Handles a request that starts with /candidates/$candid
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $pathparts = $request->getAttribute('pathparts');
        $loris     = $request->getAttribute("loris");
        $version   = $request->getAttribute("LORIS-API-Version");
        if (count($pathparts) === 0) {
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);
            case 'POST':
                return $this->_handlePOST($request);
            case 'OPTIONS':
                if ($version == 'v0.0.3') {
                    return (new \LORIS\Http\Response())
                        ->withHeader('Allow', ['GET']);
                }
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

        $battery = new \NDB_BVL_Battery();
        $battery->selectBattery($this->_visit->getSessionID());

        $entry = array_filter(
            $battery->getBatteryVerbose(),
            function ($item) use ($instrumentname) {
                return $item['Test_name'] == $instrumentname;
            }
        );

        if (empty($entry)) {
            // The instrument must exists in the flag table. (start next stage)
            return new \LORIS\Http\Response\JSON\NotFound('Instrument not found');
        }

        $dde       = array_search('dde', $pathparts) !== false;
        $arraykey  = $dde ? 'DDECommentID' : 'CommentID';
        $commentid = array_pop($entry)[$arraykey] ?? null;

        try {
            $instrument = \NDB_BVL_Instrument::factory(
                $loris,
                $instrumentname,
                $commentid,
                '',
                true
            );

            $user = $request->getAttribute('user');
            if ($instrument->_hasAccess($user) == false) {
                return new \LORIS\Http\Response\JSON\Forbidden();
            };
        } catch (\Exception $e) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $endpoint = new Instrument\Instrument($this->_visit, $instrument);
        $request  = $request->withAttribute('pathparts', $pathparts);

        return $endpoint->process($request, $endpoint);
    }

    /**
     * Create an array representation of this endpoint's response body
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $view = (new \LORIS\api\Views\Visit\Instruments(
            $this->_visit
        ))->toArray();

        $this->_cache = new \LORIS\Http\Response\JsonResponse($view);

        return $this->_cache;
    }

    /**
     * Handle an incoming post request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request): ResponseInterface
    {
        $version = $request->getAttribute("LORIS-API-Version");
        $user    = $request->getAttribute("user");
        $loris   = $request->getAttribute("loris");

        if ($version == 'v0.0.3') {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $requestdata = json_decode($request->getBody()->__toString(), true);
        if (empty($requestdata)) {
            return new \LORIS\Http\Response\JSON\BadRequest();
        }
        foreach ($requestdata['Instruments'] as $instrument) {
            try {
                $instrument = \NDB_BVL_Instrument::factory(
                    $loris,
                    $instrument,
                    '',
                    '',
                    true
                );
                if (!$instrument->_hasAccess($user)) {
                    return new \LORIS\Http\Response\JSON\Forbidden();
                }
            } catch (\NotFound $e) {
                return new \LORIS\Http\Response\JSON\NotFound(
                    "Instrument does not exist"
                );
            } catch (\Exception $e) {
                return new \LORIS\Http\Response\JSON\InternalServerError();
            }
        }
        $battery = new \NDB_BVL_Battery();
        $battery->selectBattery($this->_visit->getSessionID());
        $existingBattery = $battery->getBattery();
        foreach ($requestdata['Instruments'] as $instrument) {
            if (in_array($instrument, $existingBattery, true)) {
                continue;
            }
            $battery->addInstrument($loris, $instrument);
        }

        $view = (new \LORIS\api\Views\Visit\Instruments(
            $this->_visit
        ))->toArray();
        return new \LORIS\Http\Response\JsonResponse($view);
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
