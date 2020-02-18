<?php declare(strict_types=1);

namespace LORIS\issue_tracker\endpoints;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;
use \LORIS\api\Endpoint;

/**
 * The Attachment class for the POST requests.
 *
 * @category Loris
 * @package  IssueTracker
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Attachment extends Endpoint implements ETagCalculator
{
    public $skipTemplate = true;

    /**
     * This function will return a json object
     * for the specific attachment request.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        // Ensure GET, POST, or DELETE request.
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGET($request);
        case 'POST':
            return $this->_handlePOST($request);
        case 'DELETE':
            return $this->_handleDELETE($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(
                $this->allowedMethods()
            );
        }
    }

    /**
     * Handle GET requests for attachment
     * and used for downloading attachment.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();

        $file_hash = $values['file_hash'];
        $filename  = $values['filename'];
        $mime_type = $values['mime_type'];

        $config = \NDB_Config::singleton();
        $attachment_data_dir = rtrim(
            $config->getSetting('IssueTrackerDataPath'),
            '/'
        );

        $fileToDownload = trim($attachment_data_dir) .
            '/attachments/' .
            $file_hash;

        if (!is_readable($fileToDownload)) {
            throw new \LorisException('Forbidden Access');
        }

        $name = rawurldecode($filename);

        return (new \LORIS\Http\Response())
            ->withHeader('Content-Type', $mime_type)
            ->withHeader(
                'Content-Disposition',
                'attachment; filename=' . basename($name)
            )
            ->withStatus(200)
            ->withBody(new \LORIS\Http\FileStream($fileToDownload));
    }

    /**
     * Handle POST requests for attachment
     * and used for uploading attachment file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handlePOST(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse POST request body.
        $values     = $request->getQueryParams();
        $user       = \NDB_Factory::singleton()->user();
        $attachment = new \LORIS\issue_tracker\UploadHelper();
        $response   = $attachment->setupUploading(
            $user,
            $_FILES,
            $values
        );
        return new \LORIS\Http\Response\JsonResponse(
            $response
        );
    }

    /**
     * Handle DELETE requests for attachment
     * and marks attachment as deleted from issue_tracker.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleDELETE(ServerRequestInterface $request)
    : ResponseInterface
    {
        // Verify User can delete file.
        if ($this->_deletePermission($request)) {
            // Parse request body.
            $values    = $request->getQueryParams();
            $file_hash = $values['file_hash'];
            $factory   = \NDB_Factory::singleton();
            $DB        = $factory->database();
            $query     = 'UPDATE
                             issues_attachments
                          SET
                             deleted = 1
                          WHERE
                             file_hash = :file_hash;';
            $stmt      = $DB->prepare($query);
            $stmt->execute(array('file_hash' => $file_hash));

            return new \LORIS\Http\Response\JsonResponse(
                array('success' => true)
            );
        }
        return new \LORIS\Http\Response\JsonResponse(
            array('error' => 'invalid permission')
        );
    }

    /**
     * Check if user is able to delete the attachment
     * from the issue_tracker module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return bool The permission to delete attachment.
     */
    private function _deletePermission(ServerRequestInterface $request)
    : bool
    {
        // Parse request body.
        $values   = $request->getQueryParams();
        $user     = \NDB_Factory::singleton()->user();
        $username = $user->getUsername();
        $ID       = $values['ID'];
        $DB       = \NDB_Factory::singleton()->database();
        $query    = 'SELECT
                        USER
                    FROM
                        issues_attachments
                    WHERE
                        ID = :ID
                        AND USER = :user;';
        $result   = $DB->pselectOne(
            $query,
            array('ID' => $ID, 'user' => $username)
        );
        // Check if User shouldn't be able to Delete.
        if ($user->hasPermission('superuser')) {
            return true;
        }
        else if (empty($result)
            && !$user->hasPermission(
                'issue_tracker_developer'
            )
        ) {
            return false;
        }
        return true;
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
        if ($request->getMethod() === 'POST'
            || $request->getMethod() === 'DELETE'
            || $request->getMethod() === 'GET'
        ) {
            return 'Etag not calculated for POST, Delete, and Get request';
        }
    }

    /**
     * Return an array of valid HTTP methods for this endpoint.
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return array(
            'GET',
            'POST',
            'DELETE'
        );
    }

    /**
     * Returns true if the user has permission to access
     * the issue_tracker module.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if user has permission
     */
    function _hasAccess(\User $user) : bool
    {
        return true;
    }

    /**
     * Return a list of LORIS API versions
     * which this endpoint supports.
     *
     * @return string[] LORIS API Versions
     */
    protected function supportedVersions(): array
    {
        return array('unknown');
    }
}
