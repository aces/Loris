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
            $tmp = $request->getBody();
            $arr = (array)json_decode($tmp);
            return $this->editDocFile($arr);
        case "DELETE":
            $id = basename($request->getUri()->getPath());
            $this->deleteFile($id);
            return (new \LORIS\Http\Response\JSON\OK(
                ['message' => 'File deleted.']
            ));
        case "GET":
            $filename   = urldecode(basename($request->getUri()->getPath()));
            $downloader = new \LORIS\FilesDownloadHandler(
                new \SPLFileInfo(
                    $downloadpath . $request->getAttribute('user')->getUsername()
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
     * @param array $req the request
     *
     * @return ResponseInterface
     */
    function editDocFile(array $req): ResponseInterface
    {
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();
        $db      = $factory->database();
        if (! $user->hasPermission('document_repository_edit')) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                self::FORBIDDEN
            );
        }
        $updateValues = [
            'instrument' => $req['instrument'] ?? null,
            'comments'   => $req['comments'] ?? null,
            'version'    => $req['version'] ?? null,
            'visitLabel' => $req['visitLabel'] ?? null,
            'pscid'      => $req['pscid'] ?? null,
        ];
        $fileName     = $req['fileName'];
        $Notifier     = new \NDB_Notifier(
            "document_repository",
            "edit"
        );
        try {
            $db->update(
                'document_repository',
                $updateValues,
                ['record_id' => $req['id']]
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
        $db    = \Database::singleton();
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
                "For_site as forSite, " .
                "comments, " .
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
        // $depth        = 0;
        $id           = $value['id'];
        $DB           = \Database::singleton();
        $categoryName = $value['category_name'];
        do {
            if ($value['parent_id'] != 0) {
<<<<<<< 0286be42564bff033a2332200c923dcde02b220e
=======
                // $depth    += 1;
>>>>>>> modifs
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

        if (! $user->hasPermission('document_repository_edit')) {
            return new \LORIS\Http\Response\JSON\Forbidden(
                self::FORBIDDEN
            );
        }

        // Do some validation and fail early on bad inputs.
        $body         = $request->getParsedBody();
        $uploadedFile = $request->getUploadedFiles()['file'] ?? null;
        if (is_null($uploadedFile)) {
            return new \LORIS\Http\Response\JSON\BadRequest(
                'No file uploaded'
            );
        }
        $filename = $uploadedFile->getClientFilename();

        $category = $body['category']; // required
        if (!\Utility::valueIsPositiveInteger($category)) {
            // $category is a string representation of an ID, and so should be
            // at least equal to zero.
            return new \LORIS\Http\Response\JSON\BadRequest(self::BAD_CATEGORY);
        }

        if ($this->existFilename($filename)) {
            // If a record of this a file with the same name already exists
            // in the database, don't proceed with upload.
            return new \LORIS\Http\Response\JSON\Conflict(
                self::FILE_EXISTS_IN_DB
            );
        }

        // Initialize FilesUploadHandler
        $path = \Utility::pathJoin(
            $config->getSetting("documentRepositoryPath"),
            $name
        );
        mkdir($path, 0600);

        $targetdir = new \SplFileInfo($path);

        $fileSize = $uploadedFile->getSize();
        $fileName = $uploadedFile->getClientFileName();
        $fileType = pathinfo($fileName, PATHINFO_EXTENSION);
        try{
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
            return new \LORIS\Http\Response\JSON\InternalServerError(
                $e->getMessage()
            );
        }

        $response = $uploader->handle($request);
        if (!in_array($response->getStatusCode(), [200, 201], true)) {
            // Something went wrong. Return early to skip further processing.
            return $response;
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

        $fileSize = $uploadedFile->getSize();
        $fileType = pathinfo($filename, PATHINFO_EXTENSION);

        // Insert record of this file into the `document_repository` table.
        $DB->insert(
            'document_repository',
            [
                'File_category' => $category,
                'For_site'      => $site,
                'comments'      => $comments,
                'version'       => $version,
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

        $uploadNotifier = new \NDB_Notifier(
            "document_repository",
            "upload"
        );
        $msg_data       = [
            'newDocument' => 'Document Repository',
            'document'    => $filename,
        ];
        $uploadNotifier->notify($msg_data);

        return $response;
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
        $DB        = \Database::singleton();
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
