<?php declare(strict_types=1);

/**
 * PHP Version 8
 *
 * @category API
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
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
 * A class for handling request for a visit specific DICOM processes.
 *
 * @category API
 * @package  Loris
 * @author   Loris Team <loris-dev@bic.mni.mcgill.ca>
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
     * The requested DICOM filename
     *
     * @var string
     */
    private $_tar_name;
    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     */
    private $_cache;

    /**
     * Contructor
     *
     * @param \Timepoint $visit    The requested visit
     * @param string     $tar_name The DICOM study filename
     */
    public function __construct(\Timepoint $visit, string $tar_name)
    {
        $this->_visit    = $visit;
        $this->_tar_name = $tar_name;
    }

    /**
     * Return which methods are supported by this endpoint.
     *
     * @return array supported HTTP methods
     */
    protected function allowedMethods() : array
    {
        return [
            'GET',
            'POST',
        ];
    }

    /**
     * Versions of the LORIS API which are supported by this
     * endpoint.
     *
     * @return array a list of supported API versions.
     */
    protected function supportedVersions() : array
    {
        return ['v0.0.4-dev'];
    }

    /**
     * Handles a request to a DICOM file processes.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $path_parts = $request->getAttribute('pathparts');
        if (count($path_parts) === 0) {
            switch ($request->getMethod()) {
            case 'GET':
                return $this->_handleGET($request);

            case 'POST':
                return $this->_handlePOST($request);

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
        $handler = new Process\Process(
            $this->_visit,
            $this->_tar_name
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
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $loris = $request->getAttribute('loris');

        // *************************
        // *** Permission checks ***
        // *************************
        $user = $request->getAttribute('user');
        if (!$user->hasPermission('imaging_uploader')) {
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        try {
            $mri_uploads = $this->_visit->getMRIUploadsByFilename(
                $loris,
                $user,
                $this->_tar_name
            );
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\NotFound();
        }

        $array = (new \LORIS\api\Views\Visit\Dicom\Processes($loris, $mri_uploads))
            ->toArray();

        $this->_cache = new \LORIS\Http\Response\JsonResponse($array);

        return $this->_cache;
    }

    /**
     * Launch the MRI pipeline on the DICOM study.
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
            return new \LORIS\Http\Response\JSON\Forbidden();
        }

        $data         = json_decode($request->getBody()->__toString(), true);
        $process_type = $data['ProcessType'] ?? null;
        if (!in_array($process_type, ['mri_upload'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Invalid ProcessType.'
            );
        }

        $mri_upload_id = $data['MriUploadID'] ?? null;
        if (!is_numeric($mri_upload_id)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Invalid ProcessType.'
            );
        }

        try {
            $mri_upload = $this->_visit->getMRIUploadsById(
                $user,
                (int) $mri_upload_id
            );
        } catch (\NotFound $e) {
            return new \LORIS\Http\Response\JSON\NotFound(
                'Filename and MRIUploadID do not match'
            );
        }

        try {
            $process_id = (new ServerProcessLauncher())->mriupload(
                $mri_upload_id,
                $mri_upload->getUploadLocation()
            );
        } catch (\LorisException $e) {
            $this->logger->log(\Psr\Log\LogLevel::ERROR, $e->getMessage());
            return new \LORIS\Http\Response\JSON\InternalServerError(
                'MRI upload process can not be launched (see error log)'
            );
        }

        $ids = [$process_id];
        $server_processes_monitor = new ServerProcessesMonitor();
        $processes_state          = $server_processes_monitor->getProcessesState(
            $ids,
            $user->getUsername(),
            $process_type
        );

        $api_version = $request->getAttribute("LORIS-API-Version");
        $api_path    = $request->getUri()->getPath();
        $path        = "/api/{$api_version}/{$api_path}/{$process_id}";

        $process_location = $request->getUri()
            ->withPath($path)
            ->withQuery('');

        $body = [
            'Link'         => (string) $process_location,
            'ProcessState' => $processes_state,
        ];

        return new \LORIS\Http\Response\JSON\Accepted($body);
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
