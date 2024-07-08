<?php declare(strict_types=1);
namespace LORIS\document_repository;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * Post method handles updating a file.
 * Delete method handles deleting a file.
 * Get method handles getting a file.
 * Put method handles editing a file.
 * This class contains functions providing upload and edit functionality for
 * files in the document_repository.
 *
 * @license http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 */
class Files extends \NDB_Page
{
    const FILE_EXISTS_IN_DB = 'A file with this name already exists in the ' .
        'database. If the file does not appear in the document repository, ' .
        'please contact your administrator.';
    const BAD_CATEGORY      = "'Category' parameter must not be negative.";
    const FORBIDDEN         = 'User does not have permission to edit document '
        . 'repository files.';

    public $skipTemplate = true;

    /**
     * Same as the permissions for the main menu filter page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true only if the user has access to this page.
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'document_repository_view',
                'document_repository_delete',
                'document_repository_upload_edit'
            ]
        );
    }

    /**
     * Handle how to operate all the files.
     * PUT method updates a file's info.
     * DELETE method deletes a file.
     * POST method uploads a file.
     * GET method gets a file.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $config       = \NDB_Factory::singleton()->config();
        $downloadpath = \Utility::appendForwardSlash(
            $config->getSetting("documentRepositoryPath")
        );
        switch ($request->getMethod()) {
        case "POST":
            return $this->uploadDocFile($request);
        case "PUT":
            return $this->editDocFile($request);
        case "DELETE":
            $id = basename($request->getUri()->getPath());
            $this->deleteFile($id);
            return (new \LORIS\Http\Response\JSON\OK(
                ['message' => 'File deleted.']
            ));
        case "GET":
            $route = explode('/', $request->getUri()->getPath());
            if ($route[2] == 'meta') {
                $id = urldecode(basename($request->getUri()->getPath()));
                return (new \LORIS\Http\Response())
                    ->withHeader("Content-Type", "text/plain")
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode($this->getUploadDocFields($id))
                        )
                    );
            }

            $filename = explode(
                'Files',
                urldecode($request->getUri()->getPath())
            )[1];

            $downloader = new \LORIS\FilesDownloadHandler(
                new \SPLFileInfo(
                    $downloadpath
                )
            );
            return $downloader->handle(
                $request->withAttribute('filename', $filename)
            );
        default:
            return (new \LORIS\Http\Response\JSON\MethodNotAllowed(
                ["GET,POST,PUT,DELETE"]
            ));
        }
    }
    /**
     * Handles the document editing process
     *
     * @param ServerRequestInterface $req The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    function editDocFile(ServerRequestInterface $req): ResponseInterface
    {
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        $db      = $factory->database();
        if (! $user->hasPermission('document_repository_upload_edit')) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                self::FORBIDDEN
            );
        }
        $req          = json_decode((string)$req->getBody(), true);
        $updateValues = [
            'File_category' => $req['category'] ?? null,
            'hidden_file'   => !empty($req['hiddenFile']) ?
                $req['hiddenFile'] : null,
            'instrument'    => $req['instrument'] ?? null,
            'comments'      => $req['comments'] ?? null,
            'version'       => $req['version'] ?? null,
            'visitLabel'    => $req['visitLabel'] ?? null,
            'pscid'         => $req['pscid'] ?? null,
        ];
        $fileName     = $req['fileName'] ?? null;
        $Notifier     = new \NDB_Notifier(
            "document_repository",
            "edit"
        );
        try {
            $db->update(
                'document_repository',
                $updateValues,
                ['record_id' => $req['id'] ?? null]
            );
            $factory  = \NDB_Factory::singleton();
            $baseURL  = $factory->settings()->getBaseURL();
            $msg_data = [
                'updatedDocument' => $baseURL . "/document_repository/",
                'document'        => $fileName,
            ];
            $Notifier->notify($msg_data);
            return (new \LORIS\Http\Response\JSON\OK(
                ['message' => 'File updated.']
            ));
        } catch (\Exception $e) {
            return new \LORIS\Http\Response\JSON\InternalServerError(
                "Could not update the file: {$e->getMessage()}"
            );
        }
    }
    /**
     * Handles the document deleting process
     *
     * @param string $rid the file id
     *
     * @throws \DatabaseException
     *
     * @return void
     */
    function deleteFile($rid): void
    {
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $user    = $factory->user();
        $config  = $factory->config();
        if (! $user->hasPermission('document_repository_delete')) {
            return;
        }
        $path = \Utility::appendForwardSlash(
            $config->getSetting("documentRepositoryPath")
        );
        // create Database object
        $Notifier = new \NDB_Notifier(
            "document_repository",
            "delete"
        );
        $baseURL  = $factory->settings()->getBaseURL();
        $fileName = $DB->pselectOne(
            "SELECT File_name FROM document_repository
             WHERE record_id =:identifier",
            [':identifier' => $rid]
        );
        $dataDir  = $DB->pselectOne(
            "SELECT Data_dir FROM document_repository WHERE record_id =:identifier",
            [':identifier' => $rid]
        );

        $DB->delete("document_repository", ["record_id" => $rid]);
        $msg_data = [
            'deleteDocument' => $baseURL. "/document_repository/",
            'document'       => $fileName,
        ];
        $Notifier->notify($msg_data);
        $path = $path.$dataDir;

        if (file_exists($path)) {
            unlink($path);
        }
    }
    /**
     * Returns a list of categories fields from database
     *
     * @param String $id id of the Doc file
     *
     * @return array
     */
    function getUploadDocFields(string $id): array
    {
        $db    = $this->loris->getDatabaseConnection();
        $query = $db->pselect(
            "SELECT * FROM document_repository_categories",
            []
        );
        //categories
        $categoriesList = [];
        foreach ($query as $value) {
             $arr = $this->parseCategory($value);
             $categoriesList[$arr['id']] =$arr['name'];
        }
        //site
        $siteList = \Utility::getSiteList(false);
        //instrument
        $instruments     = $db->pselectCol(
            "SELECT Test_name FROM test_names ORDER BY Test_name",
            []
        );
        $instrumentsList = array_combine($instruments, $instruments);
        //docFile
        $query   ="SELECT " .
                "record_id as id, " .
                "PSCID as pscid, " .
                "File_category as category," .
                "visitLabel, " .
                "Instrument as instrument, " .
                "comments, " .
                "hidden_file as hiddenFile," .
                "File_Name as fileName, " .
                "version " .
                "FROM document_repository " .
                " WHERE record_id = :record_id";
        $where   = ['record_id' => $id];
        $docData = $db->pselectRow($query, $where);

        $result = [
            'categories'  => $categoriesList,
            'sites'       => $siteList,
            'instruments' => $instrumentsList,
            'docData'     => $docData,
            'hiddenFile'  => ['yes' => "Yes", 'no' => "No"],
        ];

        return $result;
    }
    /**
     * Handler of parsing category
     *
     * @param array $value the value
     *
     * @return array An array containing the category name and ID for file
     *               categories in the document repository.
     */
    function parseCategory(array $value): array
    {
        $id           = $value['id'];
        $DB           = $this->loris->getDatabaseConnection();
        $categoryName = $value['category_name'];
        do {
            if ($value['parent_id'] != 0) {
                $parent_id = $value['parent_id'];
                $query     = "SELECT * FROM document_repository_categories".
                            " WHERE id=:parent_id";
                $where     = ['parent_id' => $parent_id];
                $value     = $DB->pselectRow($query, $where);
                if (is_null($value)) {
                    throw new \LorisException(
                        'No parent category found for specified parentID. '
                        . 'Cannot parse categories.'
                    );
                }
                $categoryName = $value['category_name'] . ">" . $categoryName;
            }
        } while ($value['parent_id'] != 0);
        return [
            "name" => $categoryName,
            "id"   => $id,
        ];
    }

    /**
     * Handles the document upload process
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    function uploadDocFile($request): ResponseInterface
    {
        $instance = $request->getAttribute('loris');
        $DB       = $instance->getDatabaseConnection();
        $config   = $instance->getConfiguration();
        $user     = $request->getAttribute('user');
        $name     = $user->getUsername();

        if (! $user->hasPermission('document_repository_upload_edit')) {
            header("HTTP/1.1 403 Forbidden");
            exit;
        }

        // Do some validation and fail early on bad inputs.
        $body = $request->getParsedBody();
        if (!is_array($body)) {
            throw new \LorisException("Expected parsed body to be an array");
        }
        $uploadedFiles = $request->getUploadedFiles()['files'] ?? null;

        if (is_null($uploadedFiles)) {
            header("HTTP/1.1 413 Too_large");
            exit;
        }
        $category = $body['category']; // required
        if (!\Utility::valueIsPositiveInteger(strval($category))) {
            // $category is a string representation of an ID, and so should be
            // at least equal to zero.
            return new \LORIS\Http\Response\JSON\BadRequest(self::BAD_CATEGORY);
        }

        $uploadedFiles = is_array($uploadedFiles)
            ? $uploadedFiles : [$uploadedFiles];

        $responseMessages = [];
        $errorCounter     = 0;
        $addedFiles       = [];

        foreach ($uploadedFiles as $uploadedFile) {
            $filename = urldecode($uploadedFile->getClientFilename());

            if ($this->existFilename($filename)) {
                // If a record of this a file with the same name already exists
                // in the database, don't proceed with upload.
                $responseMessages[] = "$filename: " . self::FILE_EXISTS_IN_DB;
                $errorCounter      += 1;
                continue;
            }

            // Initialize FilesUploadHandler
            $path = \Utility::pathJoin(
                $config->getSetting("documentRepositoryPath"),
                $name
            );
            if (!is_dir($path)) {
                mkdir($path, 0770);
            }

            $targetdir = new \SplFileInfo($path);

            try {
                $uploader = (new \LORIS\FilesUploadHandler($targetdir))
                    ->withPermittedMIMETypes(
                        'application/pdf',
                        'image/jpeg',
                        'image/png',
                        'image/gif',
                        'image/svg+xml',
                        'text/plain'
                    );
            } catch (\ConfigurationException $e) {
                $responseMessages[] = "$filename: {$e->getMessage()}";
                $errorCounter      += 1;
                continue;
            }

            $response = $uploader->handle(
                $request->withUploadedFiles([$uploadedFile])
            );

            if (!in_array($response->getStatusCode(), [200, 201], true)) {
                $errorResponse      = json_decode(
                    $response->getBody()->getContents()
                );
                $responseMessages[] = "$filename: $errorResponse->error";
                $errorCounter      += 1;
                continue;
            }

            // Prepare fields for database entry once upload has completed.
            $site = $body['forSite']       !== '' ? $body['forSite'] : null;
            $site = $DB->pselectOne(
                "SELECT CenterID FROM psc WHERE Name=:name",
                ['name' => $site]
            );

            // Set empty values equal to NULL for insertion into the database.
            $instrument = !empty($body['instrument']) ? $body['instrument'] : null;
            $pscid      = !empty($body['pscid'])      ? $body['pscid']      : null;
            $visit      = !empty($body['visitLabel']) ? $body['visitLabel'] : null;
            $comments   = !empty($body['comments'])   ? $body['comments']   : null;
            $version    = !empty($body['version'])    ? $body['version']    : null;
            $hidden     = !empty($body['hiddenFile']) ? $body['hiddenFile'] : null;

            $fileSize = $uploadedFile->getSize();
            $fileType = pathinfo($filename, PATHINFO_EXTENSION);

            // Insert record of this file into the `document_repository` table.
            $DB->unsafeInsertOnDuplicateUpdate(
                'document_repository',
                [
                    'File_category' => $category,
                    'For_site'      => $site,
                    'comments'      => $comments,
                    'version'       => $version,
                    'hidden_file'   => $hidden,
                    'File_name'     => $filename,
                    'File_size'     => $fileSize,
                    'Data_dir'      => "$name/$filename",
                    'uploaded_by'   => $name,
                    'Instrument'    => $instrument,
                    'PSCID'         => $pscid,
                    'visitLabel'    => $visit,
                    'File_type'     => $fileType,
                ]
            );

            $addedFiles[]       = $filename;
            $responseMessages[] = "$filename: Success";
        }

        if (count($addedFiles) > 0) {
            $uploadNotifier = new \NDB_Notifier(
                "document_repository",
                "upload"
            );
            $msg_data       = [
                'newDocument' => 'Document Repository',
                'documents'   => $addedFiles,
            ];
            $uploadNotifier->notify($msg_data);
        }

        $uploadResponse  = '<div class="upload-response">';
        $uploadResponse .= join("<br/><br/>", $responseMessages);
        $uploadResponse .= '</div>';

        return (new \LORIS\Http\Response\JSON\OK(
            [
                'message'     => $uploadResponse,
                'error_count' => $errorCounter
            ]
        ));
    }
    /**
     * Check the find name in the database, if exists return false
     *
     * @param string $filename file name
     *
     * @return bool
     */
    function existFilename(string $filename): bool
    {
        $DB        = $this->loris->getDatabaseConnection();
        $fileCount =  $DB->pselectOne(
            "SELECT COUNT(*) FROM document_repository
             WHERE File_Name=:name",
            ['name' => $filename]
        );
        if ((int)$fileCount > 0) {
            return true;
        }
        return false;
    }
}
