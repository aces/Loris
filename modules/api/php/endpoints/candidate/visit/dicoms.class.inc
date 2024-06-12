<?php declare(strict_types=1);
/**
 * This implements the visit's dicoms endpoint class.
 *
 * PHP Version 7
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
     * @param \Timepoint $visit The requested visit
     */
    public function __construct(\Timepoint $visit)
    {
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
        if (count($files) !== 1) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'There should be 1 and only 1 file uploaded per POST request.'
            );
        }
        if (!isset($files['mriFile'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'The input key for the uploaded file should be mriFile.'
            );
        }
        $uploadedfile = $files['mriFile'];

        $data = $request->getParsedBody();

        $inputcandid = $data['CandID'] ?? '';
        $visitcandid = $this->_visit->getCandID();
        if ($inputcandid != (string) $visitcandid) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'CandID in POST data do not match URL.'
            );
        }

        $pscid = $data['PSCID'] ?? '';
        if (!\Candidate::candidateExists($visitcandid, $pscid)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'PSCID and CandID in POST data do not refer to the same candidate.'
            );
        }

        $visitlabel = $data['Visit'] ?? null;
        if ($visitlabel !== $this->_visit->getVisitLabel()) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'Visit label in URL and POST data do not match.'
            );
        }

        $isphantom = $data['IsPhantom'] ?? null;
        if (!in_array($isphantom, ['true', 'false'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'IsPhantom must be a the string "true" or "false".'
            );
        }

        $filename    = $uploadedfile->getClientFilename();
        $patientname = $pscid. "_" . $inputcandid . "_" . $visitlabel;
        if (!preg_match("/^{$patientname}/", $filename) && $isphantom !== 'true') {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Filename must start with $patientname."
            );
        }

        // *************************
        // *** Upload file *********
        // *************************
        $incomingpath = \NDB_factory::singleton()
            ->config()
            ->getSetting('MRIUploadIncomingPath');

        $incomingdir = new \SplFileInfo($incomingpath);

        $uploader = (new \LORIS\FilesUploadHandler($incomingdir))
            ->withPermittedMIMETypes(
                'application/gzip',
                'application/tar',
                'application/tar+gzip',
                'application/x-tar'
            );

        if ($request->getHeaderLine('LORIS-Overwrite') == 'overwrite') {
            $uploader = $uploader->withOverwrite(true);
        }

        $uploadresponse = $uploader->handle($request);
        if ($uploadresponse->getStatusCode() !== 201) {
            return $uploadresponse;
        }

        // *************************
        // *** Update Database *****
        // *************************
        $filepath = $incomingdir->getPathname() . '/' . $filename;
        $fileinfo = new \SplFileInfo($filepath);
        if (!$fileinfo->isFile()) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                'Upload failed (see error_log.)'
            );
        }

        try {
            $this->_visit->addMRIUpload(
                $user,
                $fileinfo,
                $patientname,
                ($isphantom === 'true')
            );
        } catch (\Throwable $e) {
            error_log($e->getMessage());
            return new \LORIS\Http\Response\JSON\InternalServerError(
                'Database insertion failed (see error_log.)'
            );
        }

        // This concatenation is here because the API part is removed from the URL by
        // the module, which may not be a good idea.
        $path = '/api/v0.0.4-dev/' . $request->getUri()->getPath() . '/'
            . $filename . '/processes';

        $processeslocation = $request->getUri()
            ->withPath($path)
            ->withQuery('');

        return new \LORIS\Http\Response\JSON\SeeOther($processeslocation);
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
