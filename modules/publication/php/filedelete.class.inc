<?php declare(strict_types=1);

// @phan-file-suppress PhanUnusedProtectedMethodParameter
// Suppressed due to false-positive for doDownloadNotification function
// Unused parameter $file required to match parent signature

namespace LORIS\publication;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles managing files through the /files/* endpoint of the publication
 * module.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class FileDelete extends \NDB_Page
{
    /**
     * {@inheritDoc}
     *
     * @param \User $user The user accessing the file.
     *
     * @return bool
     */
    function _hasAccess(\User $user): bool
    {
        return $user->hasAnyPermission(
            [
                'publication_view',
                'publication_propose',
                'publication_approve',
            ]
        );
    }
    /**
     * Handle a post form
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
public function handle(ServerRequestInterface $request) : ResponseInterface
{
    // Check if the request method is GET
    if ($request->getMethod() !== 'Delete') {
        // Return a 405 Method Not Allowed response for non-GET requests
        return (new LORIS\Http\Response())
            ->withStatus(405)
            ->withHeader("Content-Type", "application/json")
            ->withBody(new \LORIS\Http\StringStream(json_encode([
                'message' => 'Method Not Allowed'
            ])));
    }

    // Handle the GET request, process data, and return a response
    $queryParams = $request->getQueryParams();
    $uploadID = $queryParams['uploadID'] ?? null;

    $factory  = \NDB_Factory::singleton();
    $db       = $factory->database();
    $user     = $factory->user();
    $config   = \NDB_Config::singleton();

    $query      = "SELECT PublicationID, Filename ".
        "FROM publication_upload ".
        "WHERE PublicationUploadID=:upid";
    $uploadData = $db->pselectRow($query, ['upid' => $uploadID]);

    $message = ['message' => null];

    if (empty($uploadData)) {
        http_response_code(400);
        $message['message'] = 'Invalid Upload ID';
        return (new LORIS\Http\Response())
            ->withStatus(400)
            ->withHeader("Content-Type", "application/json")
            ->withBody(new \LORIS\Http\StringStream(json_encode($message)));
    }

    if ($this->userCanDelete($uploadData, $db, $user)) {
        $uploaddir = $config->getSetting('publication_uploads');
        $deletedir = $config->getSetting('publication_deletions');

        if (empty($uploaddir) || empty($deletedir)) {
            throw new \Exception("Invalid config setting");
        }
        if (empty($uploadData['Filename'])) {
            throw new \Exception("Invalid filename");
        }

        $db->delete(
            'publication_upload',
            ['PublicationUploadID' => $uploadID]
        );

        $src  = \Utility::pathJoin($uploaddir, $uploadData['Filename']);
        $dest = \Utility::pathJoin($deletedir, $uploadData['Filename']);
        rename($src, $dest);

        // Success response
        $message['message'] = 'File deleted successfully';
        return (new LORIS\Http\Response())
            ->withStatus(200)
            ->withHeader("Content-Type", "application/json")
            ->withBody(new \LORIS\Http\StringStream(json_encode($message)));
    } else {
        http_response_code(403);
        $message['message'] = 'You do not have permission to delete this file.';
        return (new LORIS\Http\Response())
            ->withStatus(403)
            ->withHeader("Content-Type", "application/json")
            ->withBody(new \LORIS\Http\StringStream(json_encode($message)));
    }
}

/**
 * Gets publication and parameter_type data from database
 *
 * @param Database $db Database instance
 *
 * @return array Array of general publication data
 */

function userCanDelete($uploadData, $db, $user) : bool
{
    $retVal   = false;
    $origUser = $db->pselectOne(
        'SELECT UserID FROM publication WHERE PublicationID=:pid',
        ['pid' => $uploadData['PublicationID']]
    );

    $editors = $db->pselectCol(
        'SELECT UserID 
        FROM publication_users_edit_perm_rel 
        WHERE PublicationID=:pid',
        ['pid' => $uploadData['PublicationID']]
    );

    // Allow user to delete if they are original uploader
    // or is user with edit permission
    if ($user->getId() === $origUser || in_array($user->getId(), $editors)) {
        $retVal = true;
    }

    return $retVal;
}

}
