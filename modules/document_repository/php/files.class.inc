<?php
/**
 * It includes two functions.
 * Post method handles updating a file.
 * Delete method handles deleting a file.
 * Get method handles getting a file.
 *            (Files/id) will return file's infomation
 *            (Files/name) will download this file
 * Put method handles editing a file.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Document_Repository
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\document_repository;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * It includes two functions.
 * Post method handles updating a file.
 * Delete method handles deleting a file.
 *
 * PHP Version 7
 *
 * @category Main
 * @package  Document_Repository
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Files extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Same as the permissions for the main menu filter page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true iff the user has access to this page.
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(
            array(
                'document_repository_view',
                'document_repository_delete',
            )
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
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $config = \NDB_Factory::singleton()->config();
        $path   = $config->getSetting("documentRepositoryPath");
        switch ($request->getMethod()) {
        case "POST":
            if ($this->uploadDocFile($request)) {
                return (new \LORIS\Http\Response())
                    ->withHeader("Content-Type", "text/plain")
                    ->withStatus(200)
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode("uploaded successfully")
                        )
                    );
            }
            return new \LORIS\Http\Response\JSON\Conflict("duplicate file name");
        case "PUT":
            $tmp = $request->getBody();
            $arr = (array)json_decode($tmp);
            $this->editDocFile($arr);
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("file updated")
                    )
                );
        case "DELETE":
            $id = basename($request->getUri()->getPath());
            $this->deleteFile($id);
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("file deleted")
                    )
                );
        case "GET":
            $name   = \User::singleton()->getUsername();
            $record = urldecode(basename($request->getUri()->getPath()));
            if (!is_numeric($record)) {
                $file = $path. "$name/$record";
                return (new \LORIS\Http\Response())
                    ->withHeader('Content-Type', 'application/octet-stream')
                    ->withHeader(
                        'Content-Disposition',
                        'attachment; filename=' . basename($file)
                    )
                    ->withStatus(200)
                    ->withBody(new \LORIS\Http\FileStream($file));
            }
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($this->getUploadDocFields($record))
                    )
                );
        default:
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "GET,POST,PUT,DELETE");
        }
    }
    /**
     * Handles the document editing process
     *
     * @param array $req the request
     *
     * @return void
     */
    function editDocFile(array $req): void
    {
        $db           = \Database::singleton();
        $user         = \User::singleton();
        $updateValues = [
            'instrument' => $req['instrument'] ?? null,
            'comments'   => $req['comments'] ?? null,
            'version'    => $req['version'] ?? null,
            'visitLabel' => $req['visitLabel'] ?? null,
            'pscid'      => $req['pscid'] ?? null,
        ];
        try {
            $db->update(
                'document_repository',
                $updateValues,
                ['record_id' => $req['id']]
            );
        } catch (\Exception $e) {
            echo 'Could not update the file.',  $e->getMessage(), "\n";
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
        $config = \NDB_Factory::singleton()->config();
        $path   = $config->getSetting("documentRepositoryPath");
        // create Database object
        $DB       = \Database::singleton();
        $user     = \User::singleton();
        $Notifier = new \NDB_Notifier(
            "document_repository",
            "delete"
        );
        $factory  = \NDB_Factory::singleton();
        $baseURL  = $factory->settings()->getBaseURL();
        $fileName = $DB->pselectOne(
            "SELECT File_name FROM document_repository
             WHERE record_id =:identifier",
            array(':identifier' => $rid)
        );
        $userName = $DB->pselectOne(
            "SELECT uploaded_by FROM document_repository
             WHERE record_id =:identifier",
            array(':identifier' => $rid)
        );
        $dataDir  = $DB->pselectOne(
            "SELECT Data_dir FROM document_repository WHERE record_id =:identifier",
            array(':identifier' => $rid)
        );

        //if user has document repository delete permission
        if ($user->hasPermission('document_repository_delete')) {
            $DB->delete("document_repository", array("record_id" => $rid));
            $msg_data = array(
                'deleteDocument' => $baseURL. "/document_repository/",
                'document'       => $fileName,
            );
            $Notifier->notify($msg_data);
        }

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
            array()
        );
        //categories
        $categoriesList = array();
        foreach ($query as $value) {
             $arr = $this->parseCategory($value);
             $categoriesList[$arr['id']] =$arr['name'];
        }
        //site
        $siteList = \Utility::getSiteList(false);
        //instrument
        $instruments     = $db->pselect(
            "SELECT Test_name FROM test_names ORDER BY Test_name",
            array()
        );
        $instrumentsList = $this->toDocSelect($instruments, "Test_name", null);
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
        $where   = array('record_id' => $id);
        $docData = $db->pselectRow($query, $where);

        $result = array(
            'categories'  => $categoriesList,
            'sites'       => $siteList,
            'instruments' => $instrumentsList,
            'docData'     => $docData,
        );

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
        $depth        = 0;
        $DB           = \Database::singleton();
        $categoryName = $value['category_name'];
        do {
            if ($value['parent_id'] != 0) {
                $depth    += 1;
                $parent_id = $value['parent_id'];
                $query     = "SELECT * FROM document_repository_categories".
                            " WHERE id=:parent_id";
                $where     = array('parent_id' => $parent_id);
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
        return array(
            "name" => $categoryName,
            "id"   => $id,
        );
    }
    /**
     * Utility function to convert data from database to a
     * (select) dropdown friendly format
     *
     * @param array  $options array of options
     * @param string $item    key
     * @param string $item2   value
     *
     * @return array
     */
    function toDocSelect($options, $item, $item2): array
    {
        $selectOptions = array();

        $optionsValue = $item;
        if (isset($item2)) {
            $optionsValue = $item2;
        }

        foreach ($options as $key => $value) {
            $selectOptions[$options[$key][$optionsValue]] = $options[$key][$item];
        }

        return $selectOptions;
    }
    /**
     * Handles the document upload process
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return bool
     */
    function uploadDocFile($request): bool
    {
        $req            = $request->getParsedBody();
        $uploadedFiles  = $request->getUploadedFiles();
        $uploadOK       = false;
        $editNotifier   = new \NDB_Notifier(
            "document_repository",
            "edit"
        );
        $uploadNotifier = new \NDB_Notifier(
            "document_repository",
            "upload"
        );
        $factory        = \NDB_Factory::singleton();
        $baseURL        = $factory->settings()->getBaseURL();
        $config         = $factory->config();
        $base           = $config->getSetting('base');
        $path           = $config->getSetting("documentRepositoryPath");
        $name           = \User::singleton()->getUsername();
        $DB       = \Database::singleton();
        $category = $req['category']; // required
        $site     = $req['forSite']       !== '' ? $req['forSite'] : null;

        $site       = $DB->pselectOne(
            "SELECT CenterID FROM psc WHERE Name=:name",
            array('name' => $site)
        );
        $instrument = !empty($req['instrument']) ? $req['instrument'] : null;
        $pscid      = !empty($req['pscid'])      ? $req['pscid']      : null;
        $visit      = !empty($req['visitLabel']) ? $req['visitLabel'] : null;
        $comments   = !empty($req['comments'])   ? $req['comments']   : null;
        $version    = !empty($req['version'])    ? $req['version']    : null;

        $uploadedFile = $uploadedFiles['file'];
        $fileSize     = $uploadedFile->getSize();
        $fileName     = $uploadedFile->getClientFileName();
        $fileType     = pathinfo($fileName, PATHINFO_EXTENSION);
        $uploadPath   = $path.$name."/";
        // $category is a string representation of an ID, and so should be at
        // least equal to zero.
        if (intval($category) < 0) {
            throw new \LorisException(
                "'Category' parameter must be a positive integer."
            );
        }
        // Check to see if $uploadPath is writable. If not, throw an error. If it
        // doesn't exist, create an uploads folder for the logged-in user.
        if (!is_writable($uploadPath)) {
            if (file_exists($uploadPath)) {
                throw new \LorisException(
                    "User uploads path in Document Repository is not writable."
                );
            }
            if (!mkdir($uploadPath, 0770)) {
                throw new \LorisException(
                    "Cannot create directory $uploadPath."
                );
            }
        }

        if ($uploadedFile->getError() === UPLOAD_ERR_OK
            && !$this->existFilename($fileName)
        ) {
                $uploadedFile->moveTo($uploadPath.$fileName);

                $DB->insert(
                    'document_repository',
                    array(
                        'File_category' => $category,
                        'For_site'      => $site,
                        'comments'      => $comments,
                        'version'       => $version,
                        'File_name'     => $fileName,
                        'File_size'     => $fileSize,
                        'Data_dir'      => $fileName,
                        'uploaded_by'   => $name,
                        'Instrument'    => $instrument,
                        'PSCID'         => $pscid,
                        'visitLabel'    => $visit,
                        'File_type'     => $fileType,
                    )
                );
                $msg_data = array(
                    'newDocument' => $baseURL . "/document_repository/",
                    'document'    => $fileName,
                );
                $uploadNotifier->notify($msg_data);
                $uploadOK = true;
        }
        return $uploadOK;
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
            array('name' => $filename)
        );
        if ((int)$fileCount > 0) {
            return true;
        }
        return false;
    }
}
