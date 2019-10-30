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
 * This class handles request to an image raw format.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Raw extends Endpoint implements \LORIS\Middleware\ETagCalculator
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
        $info = $this->_image->getFileInfo();

        if (!$info->isFile()) {
            error_log('file in database but not in file system');
            return new \LORIS\Http\Response\NotFound();
        }

        if (!$info->isReadable()) {
            error_log('file exist but is not readable by webserver');
            return new \LORIS\Http\Response\NotFound();
        }

        $mincpath = \NDB_Factory::singleton()->config()
            ->getSetting('MINCToolsPath');

        $minctooldir = new \SPLFileInfo($mincpath);
        if (!$minctooldir->isDir() || !$minctooldir->isReadable()) {
            return new \LORIS\Http\Response\InternalServerError(
                'Invalid MINCToolsPath configuration setting.'
            );
        }

        if (!`$mincpath/bin/minctoraw -v`) {
            return new \LORIS\Http\Response\InternalServerError(
                'minctoraw not installed'
            );
        }

        $filename = $info->getFilename();
        $fullpath = escapeshellarg($info->getPathname());

        $callback = function () use ($mincpath, $fullpath) {
            return shell_exec(
                "${mincpath}/bin/minctoraw -byte -unsigned -normalize $fullpath"
            );
        };

        return (new \LORIS\Http\Response())
            ->withHeader('Content-Type', 'application/x.raw')
            ->withHeader('Content-Disposition', "attachment; filename=${filename}")
            ->withBody(new \Zend\Diactoros\CallbackStream($callback));
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
        $info = $this->_image->getFileInfo();

        exec("minctoraw -v 2>&1", $output);

        $signature = array(
            'minctoraw' => $output,
            'mtime'     => $info->getMTime(),
            'fullpath'  => $info->getPathname(),
        );

        return md5(json_encode($signature));
    }
}

