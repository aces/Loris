<?php declare(strict_types=1);
/**
 * This implements a visit's dicom endpoint class
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints\Candidate\Visit\Dicom;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * A class for handling request for a visit specific dicom.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Dicom extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    protected $visit;

    /**
     * The requested Dicom filename
     *
     * @var string
     */
    protected $tarname;

    /**
     * Contructor
     *
     * @param \Timepoint $visit   The requested visit
     * @param string     $tarname The dicom filename
     */
    public function __construct(\Timepoint $visit, string $tarname)
    {
        $this->visit   = $visit;
        $this->tarname = $tarname;
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
        return array('v0.0.3-dev');
    }

    /**
     * Handles a request to /candidates/$candid/$visit_label/dicoms/$tarname
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

        // Delegate to sub-endpoints
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
        if (!isset($this->cache)) {
            // TODO :: Add a forUser function in the provisioner
            $provisioner = new \LORIS\api\VisitDicomRowProvisioner(
                $this->visit,
                $this->tarname
            );

            $data = (new \LORIS\Data\Table())
                ->withDataFrom($provisioner)
                ->toArray($request->getAttribute('user'));

            $info = new \SplFileInfo($data[0]['fullpath']);
            if (!$info->isFile()) {
                return new \LORIS\Http\Response\NotFound();
            }

            if (!$info->isReadable()) {
                return new \LORIS\Http\Response\NotFound();
            }

            $file        = $info->openFile('r');
            $this->cache = (new \LORIS\Http\Response())
                ->withHeader('Content-Type', 'application/x-tar')
                ->withHeader(
                    'Content-Disposition',
                    'attachment; filename=' . $this->tarname
                )
                ->withBody(
                    new \LORIS\Http\StringStream(
                        $file->fread($file->getSize())
                    )
                );
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
