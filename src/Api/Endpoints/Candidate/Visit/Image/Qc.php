<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints\Candidate\Visit\Image;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * This class handles request to an image QC status.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Qc extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    protected $visit;

    /**
     * The requested Image
     *
     * @var \LORIS\Image
     */
    protected $image;

    /**
     * Contructor
     *
     * @param \Timepoint   $visit The requested visit
     * @param \LORIS\Image $image The requested image
     */
    public function __construct(\Timepoint $visit, \LORIS\Image $image)
    {
        $this->visit = $visit;
        $this->image = $image;
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
            $view = (new \LORIS\Api\Views\Visit\Image\Qc(
                $this->visit,
                $this->image
            ))->toArray();

            $this->cache = new \LORIS\Http\Response\JsonResponse($view);
        }
        return $this->cache;
    }

    /**
     * Handles a PUT request that replace an image qc status
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePUT(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');
        $data = json_decode((string) $request->getBody(), true);

        $inputcandid = $data['Meta']['CandID'] ?? null;
        if ($inputcandid != $this->visit->getCandID()) {
            return new \LORIS\Http\Response\BadRequest(
                'Candidate from URL does not match JSON metadata.'
            );
        }

        $inputvisit = $data['Meta']['Visit'] ?? null;
        if ($inputvisit != $this->visit->getVisitLabel()) {
            return new \LORIS\Http\Response\BadRequest(
                'Visit from URL does not match JSON metadata.'
            );
        }

        $inputfilename = $data['Meta']['File'] ?? null;
        if ($inputfilename != $this->image->asDTO()->getFilename()) {
            return new \LORIS\Http\Response\BasRequest(
                'File name from URL does not match JSON metadata.'
            );
        }

        $inputqcstatus = $data['QCStatus'] ?? null;
        if (!in_array($inputqcstatus, ['Pass', 'Fail'], true)) {
            return new \LORIS\Http\Response\BadRequest(
                'Invalid value for QCStatus . Must be Pass or Fail.'
            );
        }

        $inputselected = $data['Selected'] ?? null;
        if (!is_bool($inputselected)) {
            return new \LORIS\Http\Response\BadRequest(
                'Invalid value for Selected. Must be true or false.'
            );
        }


        // TODO :: This is (and was) not checking or handling Caveats
        try {
            $this->image->saveQcStatus(new \LORIS\ImageQcStatus(
                $inputqcstatus,
                $inputselected
            ));
        } catch (\DatabaseException $e) {
            error_log($e->getMessage());
            return new \LORIS\Http\Response\InternalServerError(
                'QC status not updated.'
            );
        } catch (\Throwable $e) {
            return  new \LORIS\Http\Response\BadRequest();
        }

        return (new \LORIS\Http\Response())
            ->withStatus(204);
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
