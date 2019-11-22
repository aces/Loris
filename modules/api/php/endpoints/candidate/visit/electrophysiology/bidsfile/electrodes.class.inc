<?php declare(strict_types=1);
/**
 * PHP Version 7
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Candidate\Visit\Electrophysiology\BidsFile;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * This class handles request to a recording's electrode BIDS TSV file.
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Electrodes extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested recording
     *
     * @var \LORIS\Recording
     */
    private $_recording;

    /**
     * Contructor
     *
     * @param \LORIS\Recording $recording The requested recording
     */
    public function __construct(\LORIS\Recording $recording)
    {
        $this->_recording = $recording;
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
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    $this->allowedMethods()
                );

        }
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
        $info = $this->_recording->getElectrodesFileInfo();

        if (!$info->isFile()) {
            error_log('file in database but not in file system');
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        if (!$info->isReadable()) {
            error_log('file exist but is not readable by webserver');
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $filename = $info->getFilename();
        $body     = new \LORIS\Http\FileStream($info->getRealPath(), 'r');

        return new \LORIS\Http\Response(
            $body,
            200,
            array(
                'Content-Type'        => 'recording/tsv',
                'Content-Disposition' => 'attachment; filename=' . $filename,
            )
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
        return md5(json_encode($this->_handleGET($request)->getBody()));
    }
}