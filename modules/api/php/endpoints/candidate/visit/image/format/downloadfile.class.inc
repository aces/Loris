<?php declare(strict_types=1);

/**
 * PHP Version 8
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
    private $_format;
    private $_info;
    private $_file_type;
    private $_content_type;

    /**
     * Contructor
     *
     * @param \LORIS\Image $image  The requested image
     * @param string       $format The format user wishes to download
     */
    public function __construct(\LORIS\Image $image, string $format)
    {
        $this->_format = $format;

        switch ($this->_format) {
        case 'thumbnail':
            $this->_info         = $image->getThumbnailFileInfo();
            $this->_file_type    = "Thumbnail";
            $this->_content_type = 'image/jpeg';
            break;
        case 'nifti':
            $this->_info         = $image->getNiiFileInfo();
            $this->_file_type    = "NIfTI";
            $this->_content_type = 'application/octet-stream';
            break;
        case 'bval':
            $this->_info         = $image->getBvalFileInfo();
            $this->_file_type    = "NIfTI BVAL";
            $this->_content_type = 'application/text';
            break;
        case 'bvec':
            $this->_info         = $image->getBvecFileInfo();
            $this->_file_type    = "NIfTI BVEC";
            $this->_content_type = 'application/text';
            break;
        case 'bidsjson':
            $this->_info         = $image->getBidsJsonFileInfo();
            $this->_file_type    = "BIDS JSON";
            $this->_content_type = 'application/json';
            break;
        }
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
        if (!$this->_info->isFile()) {
            $this->logger->error("$this->_file_type file not found");
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        if (!$this->_info->isReadable()) {
            $this->logger->error(
                "$this->_file_type file exists but is not readable by webserver"
            );
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $filename = $this->_info->getFilename();
        $realpath = $this->_info->getRealPath();
        if ($realpath === false) {
            $realpath = $this->_info->getPath() . "/" . $this->_info->getFilename();
        }

        $body = new \LORIS\Http\FileStream($realpath, 'r');

        return new \LORIS\Http\Response(
            $body,
            200,
            [
                'Content-Type'        => $this->_content_type,
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

        if (!$this->_info->isFile() || !$this->_info->isReadable()) {
            return '';
        }

        $signature = [
            'filename' => $this->_info->getFilename(),
            'size'     => $this->_info->getSize(),
            'mtime'    => $this->_info->getMTime(),
        ];

        return md5(json_encode($signature));
    }
}

