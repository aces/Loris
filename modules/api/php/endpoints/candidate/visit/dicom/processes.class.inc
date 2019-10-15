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
namespace LORIS\api\Endpoints\Candidate\Visit\Dicom;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

use \LORIS\server_processes_manager\ServerProcessLauncher;
use \LORIS\server_processes_manager\ServerProcessesMonitor;

/**
 * A class for handling request for a visit specific dicom processes.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Processes extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    private $_visit;

    /**
     * The requested dicom filename
     *
     * @var string
     */
    private $_tarname;
    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
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
        return array(
                'GET',
                'POST',
               );
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
     * Handles a request to a Dicom file processes.
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

            case 'POST':
                return $this->_handlePOST($request);

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
        $handler = new Process\Process(
            $this->_visit,
            $this->_tarname
        );

        return $handler->process(
            $request,
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
        // *************************
        // *** Permission checks ***
        // *************************
        $user = $request->getAttribute('user');
        if (!$user->hasPermission('imaging_uploader')) {
            return new \LORIS\Http\Response\Forbidden();
        }

        try {
            $mriuploads = $this->_visit->getMRIUploadsByFilename(
                $user,
                $this->_tarname
            );
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\NotFound();
        }

        $array = (new \LORIS\api\Views\Visit\Dicom\Processes($mriuploads))
            ->toArray();

        return new \LORIS\Http\Response\JsonResponse($array);
    }

    /**
     * Launch the MRI pipeline for the dicom.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request): ResponseInterface
    {
        // *************************
        // *** Permission checks ***
        // *************************
        $user = $request->getAttribute('user');
        if (!$user->hasPermission('imaging_uploader')) {
            return new \LORIS\Http\Response\Forbidden();
        }

        $data = $request->getParsedBody();

        $processtype = $data['ProcessType'] ?? null;
        if (!in_array($processtype, ['mri_upload'])) {
            return new \LORIS\Http\Response\BadRequest(
                'Invalid ProcessType.'
            );
        }

        $mriuploadid = $data['MRIUploadID'] ?? null;
        if (!is_numeric($mriuploadid)) {
            return new \LORIS\Http\Response\BadRequest(
                'Invalid ProcessType.'
            );
        }

        try {
            $mriupload = $this->_visit->getMRIUploadsById(
                $user,
                (int) $mriuploadid
            );
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\NotFound(
                'filename and MRIUploadID do not match'
            );
        }

        // Instantiate the server process module to autoload
        // its namespace classes
        \Module::factory('server_processes_manager');
        try {
            $processid = (new ServerProcessLauncher())->mriupload(
                $mriuploadid,
                $mriupload->getUploadLocation()
            );
        } catch (\LorisException $e) {
            error_log($e->getMessage());
            return new \LORIS\Http\Response\InternaleServerError(
                'mri_upload process can not be launched (see error_log.)'
            );
        }

        $ids = array($processid);
        $serverProcessesMonitor = new ServerProcessesMonitor();
        $processesState         = $serverProcessesMonitor->getProcessesState(
            $ids,
            $user->getUsername(),
            $processtype
        );

        $lorispath = $request->getQueryParams()['lorispath'] ?? '';
        $newpath   = $lorispath . '/' .$processid;

        $processlocation = $request->getUri()
            ->withPath($newpath)
            ->withQuery('');

        $body = array(
                 'link'          => (string) $processlocation,
                 'process_state' => $processesState,
                );

        return new \LORIS\Http\Response\Accepted($body);
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
