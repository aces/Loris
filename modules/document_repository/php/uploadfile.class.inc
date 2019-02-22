<?php
/**
 * This class handles upload a file function,
 * also includs the duplicate file name check.
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
 * This class handles upload a file function,
 * also includs the duplicate file name check.
 * PHP Version 7
 *
 * @category Main
 * @package  Document_Repository
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UploadFile extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Same as the permissions for the page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true iff the user has access to this page.
     */
    function _hasAccess(\User $user) : bool
    {
        return (
            $user->hasPermission('document_repository_delete')
            || $user->hasPermission('document_repository_view')

        );
    }

    /**
     * Handle a form, check the depulicate file name
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
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
            } else {
                return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("duplicate file name")
                    )
                );
            }
            break;
        case "GET":
            $path = $request->getQueryParams();
            $id   = basename($path['lorispath']);
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($this->getUploadDocFields($id))
                    )
                );
          break;
        default:
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "GET and POST");
        }
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
        $name           = \User::singleton()->getUsername();
        $DB       = \Database::singleton();
        $category = $req['category']; // required
        $site     = $req['forSite']       !== '' ? $req['forSite'] : null;

        $site       = $DB->pselectOne(
            "SELECT CenterID FROM psc WHERE Name=:name",
            array('name' => $site)
        );
        $instrument = $req['instrument'] !== '' ? $req['instrument'] : null;
        $pscid      = $req['pscid']      !== '' ? $req['pscid'] : null;
        $visit      = $req['visitLabel'] !== '' ? $req['visitLabel'] : null;
        $comments   = $req['comments']   !== '' ? $req['comments'] : null;
        $version    = $req['version']    !== '' ? $req['version'] : null;

        $uploadedFile = $uploadedFiles['file'];
        $fileSize     = $uploadedFile->getSize();
        $fileName     = $uploadedFile->getClientFileName();
        $fileType     = pathinfo($fileName, PATHINFO_EXTENSION);
        $uploadPath   = "$base/modules/document_repository/user_uploads/";
        // $category is a string representation of an ID, and so should be at
        // least equal to zero.
        if (intval($category) < 0) {
            throw new \LorisException(
                "'Category' parameter must be a positive integer."
            );
        }
        // Check to see if $fullPath is writable. If not, throw an error. If it
        // doesn't exist, create an uploads folder for the logged-in user.
        if (!is_writable($uploadPath)) {
            if (file_exists($uploadPath)) {
                throw new \LorisException(
                    "User uploads path in Document Repository is not writable."
                );
            }
            if (!mkdir($uploadPath, 0770)) {
                throw new \LorisException(
                    "User can't make a directory."
                );
            }
        }

        if ($uploadedFile->getError() === UPLOAD_ERR_OK
            && !$this->existFilename($fileName)
        ) {
                $uploadedFile->moveTo($uploadPath.$fileName);

                $success = $DB->insert(
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
                $msg_data['newDocument'] = $baseURL . "/document_repository/";
                $msg_data['document']    = $fileName;
                $uploadNotifier->notify($msg_data);
                $uploadOK = true;
        }
        return $uploadOK;
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
        $docData = null;
        if (isset($id)) {
            $idDocFile = $id;
            $docData   = $db->pselectRow(
                "SELECT " .
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
                " WHERE record_id = $idDocFile",
                array()
            );
        }
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
 * @param string $value the value
 *
 * @return array
 */
    function parseCategory($value): array
    {
        $id    = $value['id'];
        $depth = 0;
        $DB    = \Database::singleton();
            $categoryName = $value['category_name'];
        do {
            if ($value['parent_id'] != 0) {
                $depth       += 1;
                $parent_id    = $value['parent_id'];
                $query        = "SELECT * FROM document_repository_categories".
                            " WHERE id=$parent_id";
                $value        = $DB->pselectRow($query, array());
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

