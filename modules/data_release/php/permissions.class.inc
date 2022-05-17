<?php declare(strict_types=1);
namespace LORIS\data_release;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Handles the /files endpoint of the module to upload or
 * retrieve specific files.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

class Permissions extends \NDB_Page
{
    public $AjaxModule   = true;
    public $skipTemplate = true;

    private $filesdir;
    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('data_release_edit_file_access');
    }

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The PSR15 response to the request.
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGet($request);
        case 'POST':
            return $this->_handlePost($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET']);
        }
    }

    /**
     * Handle an income HTTP GET request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The PSR15 response to the request.
     */
    private function _handleGet(ServerRequestInterface $request) : ResponseInterface
    {
        $loris       = $request->getAttribute("loris");
        $DB          = $loris->getDatabaseConnection();
        $releasePage = $this->Module->loadPage(
            $loris,
            'data_release',
        );
        assert($releasePage instanceof Data_Release);

        return new \LORIS\Http\Response\JSON\OK(
            $releasePage->getUserVersionFiles($DB)
        );

    }

    /**
     * Handle an income HTTP post request by delegating to an appropriate helper
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The PSR15 response to the request.
     */
    private function _handlePost(ServerRequestInterface $request) : ResponseInterface
    {
        $action = $request->getQueryParams()['action'];
        if (empty($action)) {
            return new \LORIS\Http\Response\JSON\BadRequest("Missing action");
        }
        switch ($action) {
        case 'add':
            return $this->_addPermission($request);
        case 'manage':
            return $this->_managePermissions($request);
        default:
            return new \LORIS\Http\Response\JSON\BadRequest("Invalid action");
        }
    }

    /**
     * Handle an income HTTP post request from the Add Permission modal window
     * in the module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The PSR15 response to the request.
     */
    private function _addPermission(
        ServerRequestInterface $request
    ) : ResponseInterface {
        $posted = $request->getParsedBody();

        if (empty($posted)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "No data was sent in the POST request"
            );
        }
        if (empty($posted['userid'])) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Missing user to grant access to"
            );
        }

        $releaseid = $posted['data_release_id'];
        if ($releaseid === "null") {
            $releaseid = null;
        }

        $version = $posted['data_release_version'];
        if ($version === "null") {
            $version = null;
        }

        $DB = $request->getAttribute("loris")->getDatabaseConnection();

        // This code handles the "Add Permissions" popup. The user selects
        // a user and either a specific file *or* a version to grant access to.
        if (!empty($releaseid) && empty($version)) {
            // If there is a data release but no version, just give the user access
            // to that data release.
            $DB->insertIgnore(
                'data_release_permissions',
                [
                    'userid'          => $posted['userid'],
                    'data_release_id' => $releaseid,
                ]
            );
        } elseif (empty($releaseid) && !empty($version)) {
            // If there is no release id but there is a version, give
            // access to every file with that version AND every file
            // where there is no version.
            if ($version == 'Unversioned') {
                $IDs = $DB->pselectCol(
                    "SELECT id FROM data_release WHERE
                        version IS NULL OR version=''",
                    []
                );
            } else {
                $IDs = $DB->pselectCol(
                    "SELECT id FROM data_release WHERE
                        version IS NULL OR version=:drv",
                    ['drv' => $posted['data_release_version']],
                );
            }

            foreach ($IDs as $ID) {
                $DB->insertIgnore(
                    'data_release_permissions',
                    [
                        'userid'          => $posted['userid'],
                        'data_release_id' => $ID,
                    ]
                );
            }
        } else {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "Must select either specific file OR version to grant access to",
            );
        }

        $baseURL = \NDB_Factory::singleton()->settings()->getBaseURL();
        return (new \LORIS\Http\Response())
            ->withStatus(204)
            ->withHeader(
                "Location",
                "{$baseURL}/data_release/?addpermissionSuccess=true"
            );
    }

    /**
     * Handle an income HTTP post request from the Manage Permissions modal window
     * in the module.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The PSR15 response to the request.
     */
    private function _managePermissions(
        ServerRequestInterface $request
    ) : ResponseInterface {
        // Ensure that there is valid JSON data in the request.
        $body = $request->getParsedBody();
        if ($body === null || !is_array($body)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                "No valid data was sent in the request"
            );
        }

        $data = json_decode($body['data'], true);

        $loris = $request->getAttribute("loris");
        $DB    = $loris->getDatabaseConnection();

        // Get current user version files and list of files for each version.
        $dataRelease = $this->Module->loadPage($loris, 'data_release');
        assert($dataRelease instanceof Data_Release);
        $userVersionFiles = $dataRelease->getUserVersionFiles($DB);
        $versionFiles     = $dataRelease->getVersionFiles($DB);

        // NOTE: It is important that only the user file permissions for versions
        // that have been altered be saved to the database.
        foreach ($data as $userId => $user) {
            $addedVersions   = array_diff(
                $user['versions'],
                $userVersionFiles[$userId]['versions']
            );
            $removedVersions = array_diff(
                $userVersionFiles[$userId]['versions'],
                $user['versions']
            );

            var_dump($userId);
            var_dump($addedVersions);
            var_dump($removedVersions);
            // Add file permissions to user for each file of the added versions.
            foreach ($addedVersions as $version) {
                foreach ($versionFiles[$version] as $fileId) {
                    $DB->insertOnDuplicateUpdate(
                        'data_release_permissions',
                        [
                            'userid'          => $userId,
                            'data_release_id' => $fileId,
                        ]
                    );
                }
            }

            // Remove file permissions from user for each file of the removed
            // versions.
            foreach ($removedVersions as $version) {
                foreach ($versionFiles[$version] as $fileId) {
                    $DB->delete(
                        'data_release_permissions',
                        [
                            'userid'          => $userId,
                            'data_release_id' => $fileId,
                        ]
                    );
                }
            }
        }

        //addpermissionSuccess=true/false
        //does not currently do anything on the front-end
        //just a placeholder displaying if the operation succeeded or not
        $baseURL = \NDB_Factory::singleton()->settings()->getBaseURL();
        return (new \LORIS\Http\Response())
            ->withStatus(204)
            ->withHeader(
                "Location",
                "{$baseURL}/data_release/?addpermissionSuccess=true"
            );
    }
}
