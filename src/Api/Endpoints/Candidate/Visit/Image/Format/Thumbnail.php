<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\Api\Endpoints\Candidate\Visit\Image\Format;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Api\Endpoint;

/**
 * This class handles request to an image thumbnail format.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Thumbnail extends Endpoint implements \LORIS\Middleware\ETagCalculator
{

    /**
     * The requested Image
     *
     * @var \LORIS\Image
     */
    private $_image;

    /**
     * Contructor
     *
     * @param \LORIS\Image $image The requested image
     */
    public function __construct(\LORIS\Image $image)
    {
        $this->_image = $image;
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
     * Delegates the request to a private handler appropriate to the request's
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
     * Creates a response with the thumbnail as body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        $info = $this->_image->getThumbnailFileInfo();

        if (!$info->isFile()) {
            error_log('Thumbnail not found');
            return new \LORIS\Http\Response\NotFound();
        }

        if (!$info->isReadable()) {
            error_log('Thumbnail exists but is not readable by webserver');
            return new \LORIS\Http\Response\NotFound();
        }

        $file     = $info->openFile('r');
        $filename = $info->getFilename();

        ob_start();
        $file->fpassthru();
        $content = ob_get_contents();
        ob_end_clean();

        $body = new \LORIS\Http\StringStream($content);

        return (new \LORIS\Http\Response())
            ->withHeader('Content-Type', 'image/jpeg')
            ->withHeader(
                'Content-Disposition',
                'attachment; filename=' . $filename
            )
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
        $info = $this->_image->getThumbnailFileInfo();

        if (!$info->isFile() || !$info->isReadable()) {
            return '';
        }

        $signature = array(
                      'filename' => $info->getFilename(),
                      'size'     => $info->getSize(),
                      'mtime'    => $info->getMTime(),
                     );

        return md5(json_encode($signature));
    }
}

