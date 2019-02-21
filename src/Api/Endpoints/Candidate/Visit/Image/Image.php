<?php declare(strict_types=1);
/**
 * This implements the visit's images endpoint class
 *
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
 * A class for handling request for a visit dicoms.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Image extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    protected $visit;

    /**
     * The requested Image filename
     *
     * @var string
     */
    protected $filename;

    /**
     * Contructor
     *
     * @param \Timepoint $visit    The requested visit
     * @param string     $filename The requested image filename
     */
    public function __construct(\Timepoint $visit, string $filename)
    {
        $this->visit    = $visit;
        $this->filename = $filename;
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

        // Delegate to sub-endpoints
        $subendpoint = array_shift($pathparts);
        switch($subendpoint) {
        case 'format':
            $handler = new Format($this->visit, $this->filename);
            break;
        case 'headers':
            $handler = new Headers($this->visit, $this->filename);
            break;
        case 'qc':
            $handler = new Qc($this->visit, $this->filename);
            break;
        default:
            return new \LORIS\Http\Response\NotFound();
        }

        $newrequest = $request
            ->withAttribute('pathparts', $pathparts);

        return $handler->process(
            $newrequest,
            $handler
        );
    }

    /**
     * Create an array representation of this endpoint's response body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (!isset($this->cache)) {
            try {
                $imagedto = $this->visit->getImageByFilename($this->filename);
            } catch (\NotFound $e) {
                return new \LORIS\Http\Response\NotFound($e->getMessage());
            }

            $image    = new \LORIS\Image($imagedto->getFileid());
            $mimetype = substr($image->getHeader('header'), 0, 4) === 'hdf5' ?
                'application/x.minc2' : 'application/octet-stream';

            $imagepath = \NDB_factory::singleton()
                ->config()
                ->getSetting('mincPath');

            $fullpath = $imagepath . $imagedto->getFilelocation();

            $info = new \SplFileInfo($fullpath);
            if (!$info->isFile()) {
                error_log('file in database but not in file system');
                return new \LORIS\Http\Response\NotFound();
            }

            if (!$info->isReadable()) {
                error_log('file exist but is not readable by webserver');
                return new \LORIS\Http\Response\NotFound();
            }

            $file        = $info->openFile('r');
            $this->cache = (new \LORIS\Http\Response())
                ->withHeader('Content-Type', $mimetype)
                ->withHeader(
                    'Content-Disposition',
                    'attachment; filename=' . $this->filename
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
