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
namespace LORIS\Api\Endpoints\Candidate\Visit\Image\Format;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * This class handles request to an image raw format.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  Loris license
 * @link     https://github.com/aces/Loris
 */
class Raw extends Endpoint implements \LORIS\Middleware\ETagCalculator
{

    /**
     * The requested Image
     *
     * @var \LORIS\Image
     */
    protected $image;

    /**
     * Contructor
     *
     * @param \LORIS\Image $image The requested image
     */
    public function __construct(\LORIS\Image $image)
    {
        $this->image = $image;
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
     * Delegates the request to a private handler appropriate to the requets's
     * method.
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
        $info = $this->image->getFileInfo();

        if (!$info->isFile()) {
            error_log('file in database but not in file system');
            return new \LORIS\Http\Response\NotFound();
        }

        if (!$info->isReadable()) {
            error_log('file exist but is not readable by webserver');
            return new \LORIS\Http\Response\NotFound();
        }

        if (!`which minctoraw`) {
            return new \LORIS\Http\Response\InternalServerError(
                'minctoraw not installed'
            );
        }

        $filename = $info->getFilename();
        $fullpath = escapeshellarg($info->getPathname());

        ob_start();
        passthru("minctoraw -byte -unsigned -normalize $fullpath");
        $content = ob_get_contents();
        ob_end_clean();

        $body = new \LORIS\Http\StringStream($content);

        return (new \LORIS\Http\Response())
            ->withHeader('Content-Type', 'application/x.raw')
            ->withHeader('Content-Length', $body->getSize())
            ->withHeader('Content-Disposition', "attachment; filename=${filename}")
            ->withBody($body);
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
        $info = $this->image->getFileInfo();

        exec("minctoraw -v 2>&1", $output);

        $signature = array(
                      'minctoraw' => $output,
                      'mtime'     => $info->getMTime(),
                      'fullpath'  => $info->getPathname(),
                     );

        return md5(json_encode($signature));
    }
}

