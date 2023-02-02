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
namespace LORIS\api\Endpoints\Candidate\Visit\Image\Format;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * This class handles request to an image thumbnail format.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class DownloadFile extends Endpoint implements \LORIS\Middleware\ETagCalculator
{

    /**
     * The requested Image
     *
     * @var \LORIS\Image
     */
    private $_image;
    private $_format;

    /**
     * Contructor
     *
     * @param \LORIS\Image $image The requested image
     */
    public function __construct(\LORIS\Image $image, string $format)
    {
        $this->_image = $image;
        $this->_format = $format;
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
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );

        }
    }

    /**
     * Creates a response with the thumbnail as body
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(): ResponseInterface
    {
        switch ($this->_format) {
            case 'thumbnail':
                $info         = $this->_image->getThumbnailFileInfo();
                $file_type    = "Thumbnail";
                $content_type = 'image/jpeg';
                break;
            case 'nifti':
                $info         = $this->_image->getNiiFileInfo();
                $file_type    = "NIfTI";
                $content_type = 'application/octet-stream';
                break;
            case 'bval':
                $info         = $this->_image->getBvalFileInfo();
                $file_type    = "NIfTI BVAL";
                $content_type = 'application/text';
                break;
            case 'bvec':
                $info         = $this->_image->getBvecFileInfo();
                $file_type    = "NIfTI BVEC";
                $content_type = 'application/text';
                break;
            case 'bidsjson':
                $info = $this->_image->getBidsJsonFileInfo();
                $file_type    = "BIDS JSON";
                $content_type = 'application/json';
                break;
            default:
                return new \LORIS\Http\Response\JSON\UnsupportedMediaType();
        }

        if (!$info->isFile()) {
            error_log("$file_type file not found");
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        if (!$info->isReadable()) {
            error_log("$file_type file exists but is not readable by webserver");
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $filename = $info->getFilename();
        $realpath = $info->getRealPath();
        if ($realpath === false) {
            $realpath = $info->getPath() . "/" . $info->getFilename();
        }

        $body = new \LORIS\Http\FileStream($realpath, 'r');

        return new \LORIS\Http\Response(
            $body,
            200,
            [
                'Content-Type'        => $content_type,
                'Content-Disposition' => 'attachment; filename=' . $filename,
            ]
        );
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
        switch ($this->_format) {
            case 'thumbnail':
                $info = $this->_image->getThumbnailFileInfo();
                break;
            case 'nifti':
                $info = $this->_image->getNiiFileInfo();
                break;
            case 'bval':
                $info = $this->_image->getBvalFileInfo();
                break;
            case 'bvec':
                $info = $this->_image->getBvecFileInfo();
                break;
            case 'bidsjson':
                $info = $this->_image->getBidsJsonFileInfo();
                break;
            default:
                return '';
        }

        if (!$info->isFile() || !$info->isReadable()) {
            return '';
        }

        $signature = [
            'filename' => $info->getFilename(),
            'size'     => $info->getSize(),
            'mtime'    => $info->getMTime(),
        ];

        return md5(json_encode($signature));
    }
}

