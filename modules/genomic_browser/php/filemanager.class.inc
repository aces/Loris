<?php declare(strict_types=1);

namespace LORIS\genomic_browser;

use LORIS\genomic_browser\Provisioners\FilesProvisioner;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

/**
 * The FileManager Class.
 *
 * This class provides the php code to create the menu filter form that
 * allows filemanager to be processed as part of the genomic browser.
 * Used for populating the Genomic Browser (Files FilterDataTable).
 *
 * @category Loris
 * @package  Genomic_Browser
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class FileManager extends \NDB_Page implements ETagCalculator
{

    /**
     * This function will return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET or POST request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        case 'POST':
            return $this->_handlePOST($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }
    /**
     * Initialize setup, the extra values for the
     * create timepoint form. (psc & errors)
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();
        // GET request for downloading file by ID.
        if ($values['filename']) {
            $factory  = \NDB_Factory::singleton();
            $config   = $factory->config();
            $filesDir = \Utility::appendForwardSlash(
                $config->getSetting('GenomicDataPath')
            );
            try {
                $downloadhandler = new \LORIS\FilesDownloadHandler(
                    new \SplFileInfo($filesDir)
                );
                $request         = $request->withAttribute(
                    'filename',
                    $values['filename']
                );
                return $downloadhandler->handle($request);
            } catch (\LorisException $e) {
                // FilesUploadHandler throws an exception if there's a problem with
                // the downloaddir.
                return new \LORIS\Http\Response\JSON\InternalServerError(
                    $e->getMessage()
                );
            }
        }

        $provisioner = new FilesProvisioner();
        $user        = $request->getAttribute('user');

        $data = (new \LORIS\Data\Table())
            ->withDataFrom($provisioner)
            ->toArray($user);
        $body = [
            'data'         => $data,
            'fieldOptions' => $this->_getFieldOptions(),
            'cohorts'      => \Utility::getCohortList(),
            'permissions'  => [
                'user'           => $user->getUsername(),
                'upload_allowed' => $user->hasPermission(
                    'genomic_data_manager'
                ),
            ],
        ];
        return new \LORIS\Http\Response\JsonResponse($body);
    }

    /**
     * Provide the select inputs options
     *
     * @return array Dynamic field options
     */
    private function _getFieldOptions() : array
    {
        return (new \LORIS\genomic_browser\Views\File())->toArray();
    }

    /**
     * Processes the values & saves to database and return a json response.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values = $request->getParsedBody();

        // Genomic File for uploading task.
        $genomicFile = new \LORIS\genomic_browser\uploading\Genomicfile();

        // handles upload process - returns status of file upload.
        $response = $genomicFile->setupUploading(
            $request->getAttribute('user'), // user
            $_FILES, // file data
            $values // post request values.
        );

        // Send file upload status.
        return new \LORIS\Http\Response\JsonResponse(
            $response
        );
    }

    /**
     * An ETagCalculator provides the ability to calculate an ETag for
     * an incoming HTTP request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return string The value to use for the ETag header.
     */
    public function ETag(ServerRequestInterface $request): string
    {
        return md5(json_encode((string) $this->_handleGET($request)->getBody()));
    }

    /**
     * Returns true if the user has permission to access
     * the Genomic Browser module
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'genomic_browser_view_allsites',
                'genomic_browser_view_site'
            ]
        );
    }

    /**
     * Return an array of valid HTTP methods for this endpoint
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return [
            'GET',
            'POST',
        ];
    }

}
