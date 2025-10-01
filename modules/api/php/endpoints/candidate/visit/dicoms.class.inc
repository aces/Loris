<?php declare(strict_types=1);

/**
 * This implements the visit's dicoms endpoint class.
 *
 * PHP Version 8
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\api\Endpoints\Candidate\Visit;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\api\Endpoint;

/**
 * A class for handling request for a visit dicoms.
 *
 * @category API
 * @package  Loris
 * @author   Xavier Lecours Boucher <xavier.lecours@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Dicoms extends Endpoint implements \LORIS\Middleware\ETagCalculator
{
    /**
     * The requested Visit
     *
     * @var \Timepoint
     */
    private $_visit;

    /**
     * A cache of the endpoint results, so that it doesn't need to be
     * recalculated for the ETag and handler.
     */
    private $_cache;

    /**
     * Contructor
     *
     * @param \LORIS\LorisInstance $loris The LORIS instance to retrieve data
     *                                    from.
     * @param \Timepoint           $visit The requested visit.
     */
    public function __construct(
        protected \LORIS\LorisInstance $loris,
        \Timepoint $visit
    ) {
        $this->_visit = $visit;
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
        return [
            'v0.0.3',
            'v0.0.4-dev',
        ];
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
        $tarname     = array_shift($pathparts);
        $subendpoint = array_shift($pathparts);
        switch ($subendpoint) {
        case 'processes':
            $handler = new Dicom\Processes(
                $this->_visit,
                $tarname
            );
            break;

        default:
            $handler = new Dicom\Dicom(
                $this->_visit,
                $tarname
            );
            break;
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
        if (isset($this->_cache)) {
            return $this->_cache;
        }

        $dicomtars = $this->_visit->getDicomTars(
            $this->loris,
            $request->getAttribute('user')
        );

        $version = $request->getAttribute('LORIS-API-Version');
        switch ($version) {
        case "v0.0.3":
            $view = (new \LORIS\api\Views\Visit\Dicoms(
                $this->_visit,
                ...$dicomtars
            ))->toArray();
            break;
        default:
            $view = (new \LORIS\api\Views\Visit\Dicoms_0_0_4_Dev(
                $this->_visit,
                ...$dicomtars
            ))->toArray();
        }
        $this->_cache = new \LORIS\Http\Response\JsonResponse($view);

        return $this->_cache;
    }

    /**
     * Upload the DICOM study file and add it to the timepoint's MRIUploads
     * A successful upload should return a 303 response toward this DICOM
     * processes.
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

        // *************************
        // *** Input Validation ****
        // *************************
        $files = $request->getUploadedFiles();
        if (count($files) === 0) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'No file found, there should be one file uploaded per request. '
                    . 'If a file was uploaded, it might be larger than the maximum '
                    . 'upload file size that is configured on this server.'
            );
        }

        if (count($files) > 1) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Multiple files found, there should only be one file uploaded per '
                    . 'request.'
            );
        }

        if (!isset($files['File'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'The request should have a "File" attribute with the uploaded file.'
            );
        }

        $uploaded_file = $files['File'];

        $request_body = $request->getParsedBody();
        if (!isset($request_body['Json'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'The request should have a "Json" form attribute containing the '
                    . 'request data.'
            );
        }

        $data = json_decode($request_body['Json'], true);

        $input_candid = $data['CandID'] ?? null;
        $visit_candid = $this->_visit->getCandID();
        if ((string) $input_candid !== (string) $visit_candid) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'CandID in POST data do not match URL.'
            );
        }

        $pscid = $data['PSCID'] ?? null;
        if (!\Candidate::candidateExists($visit_candid, $pscid)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'PSCID and CandID in POST data do not refer to the same candidate.'
            );
        }

        $visit_label = $data['VisitLabel'] ?? null;
        if ($visit_label !== $this->_visit->getVisitLabel()) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Visit label in URL and POST data do not match.'
            );
        }

        $is_phantom = $data['IsPhantom'] ?? null;
        if (!is_bool($is_phantom)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'IsPhantom must be a boolean.'
            );
        }

        $overwrite = $data['Overwrite'] ?? false;
        if (!is_bool($overwrite)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Overwrite must be a boolean.'
            );
        }

        $file_name    = $uploaded_file->getClientFilename();
        $patient_name = $pscid . "_" . $input_candid . "_" . $visit_label;
        if (!preg_match("/^{$patient_name}/", $file_name) && !$is_phantom) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Filename must start with $patient_name."
            );
        }

        // *************************
        // *** Upload file *********
        // *************************
        $incoming_path = \NDB_factory::singleton()
            ->config()
            ->getSetting('MRIUploadIncomingPath');

        $incoming_dir = new \SplFileInfo($incoming_path);

        $uploader = (new \LORIS\FilesUploadHandler($incoming_dir))
            ->withPermittedMIMETypes(
                'application/gzip',
                'application/tar',
                'application/tar+gzip',
                'application/x-tar'
            );

        if ($overwrite) {
            $uploader = $uploader->withOverwrite(true);
        }

        $upload_response = $uploader->handle($request);
        if ($upload_response->getStatusCode() !== 201) {
            return $upload_response;
        }

        // *************************
        // *** Update Database *****
        // *************************
        $file_path = $incoming_dir->getPathname() . '/' . $file_name;
        $file_info = new \SplFileInfo($file_path);
        if (!$file_info->isFile()) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                'Upload failed, please contact your LORIS administrator.'
            );
        }

        try {
            $this->_visit->getOrAddMRIUpload(
                $user,
                $file_info,
                $patient_name,
                $is_phantom,
            );
        } catch (\Throwable $e) {
            $this->logger->log(\Psr\Log\LogLevel::ERROR, $e->getMessage());
            return new \LORIS\Http\Response\JSON\InternalServerError(
                'Database insertion failed, please contact your LORIS '
                    . 'administrator.'
            );
        }

        $api_version = $request->getAttribute("LORIS-API-Version");
        $api_path    = $request->getUri()->getPath();
        $path        = "/api/{$api_version}/{$api_path}/{$file_name}/processes";

        $processes_location = $request->getUri()
            ->withPath($path)
            ->withQuery('');

        return new \LORIS\Http\Response\JSON\SeeOther($processes_location);
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
