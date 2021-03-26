<?php declare(strict_types=1);
namespace LORIS\data_release;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;
use \Psr\Http\Message\UploadedFileInterface;

/**
 * Handles the /files endpoint of the module to upload or
 * retrieve specific files.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */

class Files extends \NDB_Page
{
    public $AjaxModule   = true;
    public $skipTemplate = true;

    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    public function _hasAccess(\User $user) : bool
    {
        // check user permissions
        return $user->hasAnyPermission(
            [
                'data_release_view',
                'data_release_upload',
                'data_release_edit_file_access'
            ]
        );
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface {
        // Get -> if /files -> list all files in ajax
        //           /files/id - specific file content
        // Post -> upload file, return id
        switch ($request->getMethod()) {
        case 'GET':
            return $this->handleGet($request);
        case 'POST':
            return $this->handleUpload($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET', 'POST']);
        }
    }

    public function handleUpload(ServerRequestInterface $request) {
        // FIXME: Validate no extra stuff, only a request to /files should be handled.
        // Constructor handles dir exists/is_writable
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();

        $uploaddir = \Utility::appendForwardSlash($config->getSetting('dataReleasePath'));
        if (empty($uploaddir)) {
            return new \LORIS\Http\Response\JSON\InternalServerError();
        }

        $overwrite = !empty($request->getQueryParams()['overwrite']);

        try {
            $uploadhandler = new \LORIS\FilesUploadHandler(new \SplFileInfo($uploaddir));
            $uploadhandler = $uploadhandler->withOverwrite($overwrite);
        } catch (\ConfigurationException $e) {
            // FilesUploadHandler throws an exception if there's a problem with
            // the uploaddir.
            return new \LORIS\Http\Response\JSON\InternalServerError($e->getMessage());
        }

        $file = $request->getUploadedFiles()['file'];
        $fileName = $file->getClientFilename();

        $user = $request->getAttribute("user");

        $validateError = $this->validateUserCanUpload(
            $user,
            $fileName,
            $overwrite
        );
        if($validateError !== null) {
            return $validateError;
        }

        $posted = $request->getParsedBody();
        return $this->moveFile(
            $uploadhandler,
            $user,
            $fileName,
            $request,
            $posted['version'],
            $overwrite,
        );
    }

    private function validateUserCanUpload(
        \User $user,
        string $fileName,
        bool $overwrite
    ) : ?ResponseInterface {
        // Check if file is duplicate
        $DB = \Database::singleton();
        $duplicateFile = $DB->pselectRow(
            "SELECT id, file_name FROM data_release WHERE file_name=:f",
            ['f' => $fileName]
        );

        if (!isset($duplicateFile)) {
            // File doesn't exist, user can upload.
            // XXX: Check permission?
            return null;
        }
        
        if ($overwrite) {
            // File is duplicate and overwrite is set, verify permission
            $userPermission = $DB->pselectRow(
                "SELECT userid FROM data_release_permissions
                    WHERE userid=:u AND data_release_id=:d",
                ['u' => $user->getId(), 'd' => $duplicateFile['id']]
            );
            if (!isset($userPermission) && !$user->hasPermission('superuser')) {
                return new \LORIS\Http\Response\JSON\Forbidden(
                    "File overwrite failed. You do not have permission for this file."
                );
            }
        } else {
            // File is duplicate and overwrite not declared
            return new \LORIS\Http\Response\JSON\Conflict('Can not upload duplicate file.');
        }
        return null;
    }

    private function moveFile(
        \LORIS\FilesUploadHandler $files,
        \User $user,
        string $fileName,
        ServerRequestInterface $request,
        ?string $version,
        bool $overwrite) : ResponseInterface {
        $DB = \Database::singleton();
        if ($version !== null) {
            $version = strtolower($version);
        }

        // FIXME: Add to transaction and roll back if anything goes wrong
        $upload_date = date('Y-m-d');
        if ($overwrite) {
            // update file in data_release table.
            $DB->update(
                'data_release',
                [
                    'version'     => $version,
                    'upload_date' => $upload_date,
                ],
                ['file_name' => $fileName]
            );
        } else {
            // insert the file into the data_release table
                $DB->insert(
                    'data_release',
                    [
                        'file_name'   => $fileName,
                        'version'     => $version,
                        'upload_date' => $upload_date,
                    ]
                );

        }

        $fileID = $DB->pselectOne(
            "SELECT ID FROM data_release WHERE file_name=:filename",
            ['filename' => $fileName]
        );
        $DB->insertIgnore(
            "data_release_permissions",
            [
                'userid'          => $user->getId(),
                'data_release_id' => $fileID,
            ]
        );
        return $files->handle($request);
    }
 
    public function handleGet(ServerRequestInterface $request) : ResponseInterface {
        // FIXME: Check if it's /files/ID, this assumes /files
        $DB = \Database::singleton();
        $filesList = $DB->pselect(
            "SELECT id, file_name FROM data_release",
            []
        );

        $dataReleaseFiles = array_column($filesList, 'file_name');

        $results = [
            'files'         => $dataReleaseFiles,
            'maxUploadSize' => \Utility::getMaxUploadSize(),
        ];

        return new \LORIS\Http\Response\JSON\OK($results);
    }
}
