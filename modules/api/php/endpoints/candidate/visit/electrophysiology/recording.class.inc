<?php declare(strict_types=1);
/**
 * This implements the visit's electrophysiology endpoint class.
 *
 * PHP Version 7
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Candidate\Visit\Electrophysiology;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling request for a visit electrophysiology recording.class.
 *
 * @category API
 * @package  LORIS
 * @author   Cecile Madjar <cecile.madjar@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Recording extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    private $_visit;

    /**
     * The requested electrophysiology recording.class filename
     *
     * @var string
     */
    private $_filename;

    /**
     * Contructor
     *
     * @param \Timepoint $visit    The requested visit
     * @param string     $filename The requested recording.class filename
     */
    public function __construct(\Timepoint $visit, string $filename)
    {
        $this->_visit    = $visit;
        $this->_filename = $filename;
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
     * Versions of the LORIS API which are supported by this endpoint.
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
     * Handles a request that starts with /candidates/$candid.
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
                return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                    $this->allowedMethods()
                );
            }
        }

        // Delegate to sub-endpoints
        // At this point, the recording must exist
        $user = $request->getAttribute('user');
        try {
            $recording = $this->_visit->getRecordingByFilename(
                $user,
                $this->_filename
            );
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\NotFound($e->getMessage());
        }

        $subendpoint = array_shift($pathparts);
        switch($subendpoint) {
        case 'metadata':
            $handler = new Metadata($this->_visit, $recording);
            break;
        case 'channels':
            $handler = new Channels($this->_visit, $recording);
            break;
        case 'electrodes':
            $handler = new Electrodes($this->_visit, $recording);
            break;
        case 'events':
            $handler = new Events($this->_visit, $recording);
            break;
        case 'bidsfiles':
            $handler = new BidsFile($recording);
            break;
        default:
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $newrequest = $request
            ->withAttribute('pathparts', $pathparts);

        return $handler->process(
            $newrequest,
            $handler
        );
    }

    /**
     * Create an array representation of this endpoint's response body.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        $user = $request->getAttribute('user');

        try {
            $recording = $this->_visit->getRecordingByFilename(
                $user,
                $this->_filename
            );
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\NotFound($e->getMessage());
        }

        $mimetype = substr($recording->getMetadata('header'), 0, 4) === 'hdf5' ?
            'application/x.minc2' : 'application/octet-stream';

        $info = $recording->getFileInfo();

        if (!$info->isFile()) {
            error_log('file in database but not in file system');
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        if (!$info->isReadable()) {
            error_log('file exist but is not readable by webserver');
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $body = new \LORIS\Http\FileStream($info->getRealPath(), 'r');

        return (new \LORIS\Http\Response())
            ->withHeader('Content-Type', $mimetype)
            ->withHeader(
                'Content-Disposition',
                'attachment; filename=' . $this->_filename
            )
            ->withBody($body);
    }

    /**
     * Implements the ETagCalculator interface.
     *
     * @param ServerRequestInterface $request The PSR7 incoming request.
     *
     * @return string etag summarizing value of this request.
     */
    public function ETag(ServerRequestInterface $request) : string
    {
        $user = $request->getAttribute('user');

        try {
            $recording = $this->_visit->getRecordingByFilename(
                $user,
                $this->_filename
            );
        } catch (\Throwable $e) {
            return '';
        }

        $info = $recording->getFileInfo();

        $signature = array(
            'filename' => $this->_filename,
            'size'     => $info->getSize(),
            'mtime'    => $info->getMTime(),
        );

        return md5(json_encode($signature));
    }
}