<?php declare(strict_types=1);

namespace LORIS\issue_tracker;

use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \LORIS\Middleware\ETagCalculator;

/**
 * The Attachment class for requests from issue_trackers.
 *
 * @category Loris
 * @package  Issue_Tracker
 * @author   Alizée Wickenheiser <alizee.wickenheiser@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Attachment extends \NDB_Page implements ETagCalculator
{
    /**
     * Return a json response for the specific attachment request
     * or thrown an error.
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
     * Handle GET requests for attachment.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request.
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    private function _handleGET(ServerRequestInterface $request) : ResponseInterface
    {
        // Parse GET query params.
        $values = $request->getQueryParams();
        // DB Query begins.
        $ID      = intval($values['ID']);
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $query   = 'SELECT
                        file_hash,
                        file_name,
                        mime_type
                    FROM
                        issues_attachments
                    WHERE
                        ID = :ID';
        $result  = $DB->pselectRow($query, ['ID' => $ID]);
        if ($result === null) {
            return (new \LORIS\Http\Response())
                ->withStatus(404)
                ->withHeader('Content-Type', 'text/plain')
                ->withBody(new \LORIS\Http\StringStream("Not found"));

        }

        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();
        $attachment_data_dir = rtrim(
            $config->getSetting('IssueTrackerDataPath'),
            '/'
        );

        $fileToDownload = trim($attachment_data_dir) .
            '/attachments/' .
            $result['file_hash'];

        if (!is_readable($fileToDownload)) {
            throw new \LorisException('Forbidden Access');
        }

        $name = rawurldecode($result['file_name']);

        return (new \LORIS\Http\Response())
            ->withStatus(200)
            ->withHeader('Content-Type', $result['mime_type'])
            ->withHeader(
                'Content-Disposition',
                'attachment; filename=' . basename($name)
            )
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
        $values        = $request->getQueryParams();
        $user          = \NDB_Factory::singleton()->user();
        $attachment    = new \LORIS\issue_tracker\UploadHelper();
        $uploadedFiles = $request->getUploadedFiles();
        $response      = $attachment->setupUploading(
            $user,
            $uploadedFiles,
            $values
        );
        return new \LORIS\Http\Response\JsonResponse(
            $response
                ? ['success' => 'upload succeeded']
                : ['error' => $attachment->errorMessage]
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
            $values  = $request->getQueryParams();
            $ID      = $values['ID'];
            $factory = \NDB_Factory::singleton();
            $DB      = $factory->database();
            $DB->update(
                'issues_attachments',
                ['deleted' => 1],
                ['ID' => $ID]
            );
            return new \LORIS\Http\Response\JsonResponse(
                ['success' => true]
            );
        }
        return new \LORIS\Http\Response\JSON\Forbidden(
            'Invalid Permissions'
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
            ['ID' => $ID, 'user' => $username]
        );
        // Check if User shouldn't be able to Delete.
        if (empty($result)
            && !$user->hasPermission(
                'issue_tracker_all_issue'
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
        if ($request->getMethod() === 'GET') {
            return $_GET['file_hash'];
        }
        return '';
    }

    /**
     * Return an array of valid HTTP methods for this endpoint.
     *
     * @return string[] Valid versions
     */
    protected function allowedMethods(): array
    {
        return [
            'GET',
            'POST',
            'DELETE'
        ];
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
        return $user->hasAnyPermission(
            [
                'issue_tracker_all_issue',
                'issue_tracker_own_issue',
                'issue_tracker_site_issue',
            ]
        );
    }

}
