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

class Files extends \NDB_Page
{
    public $AjaxModule   = true;
    public $skipTemplate = true;

    private $filesDir;
    /**
     * Check user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
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

    /**
     * {@inheritDoc}
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $factory = \NDB_Factory::singleton();
        $config  = $factory->config();

        $this->filesDir = \Utility::appendForwardSlash(
            $config->getSetting('dataReleasePath')
        );
        if (empty($this->filesDir) || $this->filesDir === '/') {
            // Whether you're uploading or downloading, it's going to be an error
            // if the dataReleasePath is misconfigured..
            return new \LORIS\Http\Response\JSON\InternalServerError();
        }

        switch ($request->getMethod()) {
        case 'GET':
            return $this->_handleGet($request);
        case 'POST':
            return $this->_handleUpload($request);
        default:
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['GET', 'POST']);
        }
    }

    /**
     * Handles an incoming POST request to validate and upload the file
     *
     * @param ServerRequestInterface $request The incoming request
     *
     * @return ResponseInterface
     */
    private function _handleUpload(
        ServerRequestInterface $request
    ) : ResponseInterface {
        $overwrite = !empty($request->getQueryParams()['overwrite']);

        try {
            // Constructor handles dir exists/is_writable
            $uploadhandler = new \LORIS\FilesUploadHandler(
                new \SplFileInfo($this->filesDir)
            );
            $uploadhandler = $uploadhandler->withOverwrite($overwrite);
        } catch (\ConfigurationException $e) {
            // FilesUploadHandler throws an exception if there's a problem with
            // the uploaddir.
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

        $file     = $request->getUploadedFiles()['file'];
        $fileName = $file->getClientFilename();

        $user = $request->getAttribute("user");

        $validateError = $this->_validateUserCanUpload(
            $user,
            $fileName,
            $overwrite
        );
        if ($validateError !== null) {
            return $validateError;
        }

        $posted = $request->getParsedBody();
        assert(is_array($posted));
        return $this->_moveFile(
            $uploadhandler,
            $user,
            $fileName,
            $request,
            $posted['version'],
            $overwrite,
        );
    }

    /**
     * Validate whether a user can upload a file. Returns null
     * if there are no errors, or an error response if something
     * is wrong.
     *
     * @param \User  $user      The user attempting to upload
     * @param string $fileName  The filename being uploaded
     * @param bool   $overwrite Whether the overwrite flag is set
     *
     * @return ?ResponseInterface
     */
    private function _validateUserCanUpload(
        \User $user,
        string $fileName,
        bool $overwrite
    ) : ?ResponseInterface {
        // Check if file is duplicate
        $DB            = $this->loris->getDatabaseConnection();
        $duplicateFile = $DB->pselectRow(
            "SELECT id, file_name FROM data_release WHERE file_name=:f",
            ['f' => $fileName]
        );

        if (!isset($duplicateFile)) {
            // File doesn't exist, user can upload as long as they have
            // permission.
            if (!$user->hasPermission("data_release_upload")) {
                return new \LORIS\Http\Response\JSON\Forbidden(
                    "Permission denied."
                );

            }
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
                    "Overwrite failed. A file of this name already exists which "
                    . " you do not have permission to overwrite."
                );
            }
        } else {
            // File is duplicate and overwrite not declared
            return new \LORIS\Http\Response\JSON\Conflict(
                'Can not upload duplicate file.'
            );
        }
        return null;
    }

    /**
     * Moves a to the appropriate place on the filesystem and inserts into
     * the database, returning an appropriate HTTP response.
     *
     * @param \LORIS\FilesUploadHandler $files     The FilesUploadHandler which moves
     *                                             the file and generates the
     *                                             response.
     * @param \User                     $user      The user uploading the file.
     * @param string                    $fileName  The file name being uploaded.
     * @param ServerRequestInterface    $request   The incoming request.
     * @param ?string                   $version   The user submitted file version.
     * @param bool                      $overwrite Flag to indicate if existing file
     *                                             should be overwritten.
     *
     * @return ResponseInterface
     */
    private function _moveFile(
        \LORIS\FilesUploadHandler $files,
        \User $user,
        string $fileName,
        ServerRequestInterface $request,
        ?string $version,
        bool $overwrite
    ) : ResponseInterface {
        $DB = $this->loris->getDatabaseConnection();
        if ($version !== null) {
            $version = strtolower($version);
        }

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

    /**
     * Handle an incoming HTTP GET request
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    private function _handleGet(ServerRequestInterface $request) : ResponseInterface
    {
        $matches    = [];
        $regexmatch = preg_match(
            "#files(/\d+)?(/)?$#",
            $request->getURI()->getPath(),
            $matches
        );

        if (!$regexmatch) {
            return new \LORIS\Http\Response\JSON\NotFound("Not found");
        }

        $DB = $this->loris->getDatabaseConnection();
        if (isset($matches[1])) {
            $fileID   = substr($matches[1], 1);
            $filename = $DB->pselectOne(
                "SELECT file_name FROM data_release WHERE id=:fileid",
                ['fileid' => $fileID]
            );
            if ($filename === null) {
                return new \LORIS\Http\Response\JSON\NotFound("Not found");
            }

            $user = $request->getAttribute("user");
            if (!$user->hasPermission("data_release_view")) {
                return new \LORIS\Http\Response\JSON\Forbidden("Permission denied");
            }

            $hasFilePerm = $DB->pselectOne(
                "SELECT 'x' FROM data_release_permissions WHERE
                    data_release_id=:fileid AND userid = :user",
                ['fileid' => $fileID,
                    'user'   => $user->getId()
                ]
            );
            if ($hasFilePerm === null) {
                return new \LORIS\Http\Response\JSON\Forbidden("Permission denied");
            }

            try {
                $downloadhandler = new \LORIS\FilesDownloadHandler(
                    new \SplFileInfo($this->filesDir)
                );
                $request         = $request->withAttribute("filename", $filename);
                return $downloadhandler->handle($request);
            } catch (\LorisException $e) {
                // FilesUploadHandler throws an exception if there's a problem with
                // the downloaddir.
                return new \LORIS\Http\Response\JSON\InternalServerError(
                    $e->getMessage()
                );
            }
        }

        $filesList = $DB->pselect(
            "SELECT id, file_name FROM data_release",
            []
        );

        $dataReleaseFiles = array_column(iterator_to_array($filesList), 'file_name');

        $results = [
            'files'         => $dataReleaseFiles,
            'maxUploadSize' => \Utility::getMaxUploadSize(),
        ];

        return new \LORIS\Http\Response\JSON\OK($results);
    }
}
