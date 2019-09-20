<?php declare(strict_types=1);
/**
 * This implements a visit's dicom endpoint class.
 *
 * PHP Version 7
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
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
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Dicom extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    private $_visit;

    /**
     * The requested Dicom filename
     *
     * @var string
     */
    private $_tarname;

    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     *
     * @var ResponseInterface
     */
    private $_cache;

    /**
     * Contructor
     *
     * @param \Timepoint $visit   The requested visit
     * @param string     $tarname The dicom filename
     */
    public function __construct(\Timepoint $visit, string $tarname)
    {
        $this->_visit   = $visit;
        $this->_tarname = $tarname;
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
     * Handles a request to /candidates/$candid/$visit_label/dicoms/$tarname.
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
     * Create an array representation of this endpoint's response body
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request): ResponseInterface
    {
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        try {
            $dicom = $this->_visit->getDicomTarByFilename($this->_tarname);
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\NotFound();
        }

        $tarchivepath = \NDB_factory::singleton()
            ->config()
            ->getSetting('tarchiveLibraryDir');

        $fullpath = $tarchivepath . $dicom->getArchiveLocation();
        $info     = new \SplFileInfo($fullpath);
        if (!$info->isFile()) {
            return new \LORIS\Http\Response\NotFound('');
        }

        if (!$info->isReadable()) {
            return new \LORIS\Http\Response\NotFound();
        }

        $file         = $info->openFile('r');
        $this->_cache = (new \LORIS\Http\Response())
            ->withHeader('Content-Type', 'application/x-tar')
            ->withHeader(
                'Content-Disposition',
                'attachment; filename=' . $this->_tarname
            )
            ->withBody(
                new \LORIS\Http\StringStream(
                    $file->fread($file->getSize())
                )
            );

        return $this->_cache;
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
        return md5(json_encode($this->_handleGET($request)->getBody()));
    }
}
