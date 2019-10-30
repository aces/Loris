<?php declare(strict_types=1);
/**
 * This implements the visit's imaging qc endpoint class
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
 * A class for handling request for a visit imaging qc.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Qc extends Endpoint implements \LORIS\Middleware\ETagCalculator
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
        return array(
            'GET',
            'PUT',
        );
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
        if (count($pathparts) === 1 && array_pop($pathparts) === 'imaging') {
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);

            case 'PUT':
                return $this->_handlePUT($request);

            case 'OPTIONS':
                return (new \LORIS\Http\Response())
                    ->withHeader('Allow', $this->allowedMethods());

            default:
                return new \LORIS\Http\Response\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }
        return new \LORIS\Http\Response\NotFound();
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

        $qcstatus = $this->_visit->getImagingQC();

        $view = (new \LORIS\api\Views\Visit\Qc($this->_visit, $qcstatus))
            ->toArray();

        $this->_cache = new \LORIS\Http\Response\JsonResponse($view);

        return $this->_cache;
    }

    /**
     * Sets new value for this session imaging qc.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePUT(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $data = json_decode((string) $request->getBody(), true);

        $requiredfields = array(
            'Meta',
            'SessionQC',
            'Pending',
        );
        $diff           = array_diff($requiredfields, array_keys($data));
        if (!empty($diff)) {
            return new \LORIS\Http\Response\BadRequest(
                'Field(s) missing: ' . implode(', ', $diff)
            );
        }

        $candid = $data['Meta']['CandID'] ?? null;
        if (intval($candid) !== $this->_visit->getCandID()) {
            return new \LORIS\Http\Response\BadRequest(
                'Candidate from URL does not match metadata'
            );
        }

        $visitlabel = $data['Meta']['Visit'] ?? null;
        if ($visitlabel !== $this->_visit->getVisitLabel()) {
            return new \LORIS\Http\Response\BadRequest(
                'Visit from URL does not match metadata'
            );
        }

        $qcstatus  = $data['SessionQC'];
        $ispending = $data['Pending'] ? 'Y' : 'N';

        try {
            $this->_visit->setData(array('MRIQCStatus' => $qcstatus));
        } catch (\DatabaseException $e) {
            return new \LORIS\Http\Response\BadRequest(
                'MRIQCStatus value not acceptable'
            );
        }

        try {
            $this->_visit->setData(array('MRIQCPending' => $ispending));
        } catch (\DatabaseException $e) {
            return new \LORIS\Http\Response\BadRequest(
                'MRIQCPending value not acceptable'
            );
        }

        $link = '/' . $request->getUri()->getPath();
        return (new \LORIS\Http\Response())
            ->withStatus(204)
            ->withHeader('Content-Location', $link);
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
