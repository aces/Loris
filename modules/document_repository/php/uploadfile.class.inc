<?php
/**
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
 * PHP Version 7
 *
 * @category Main
 * @package  Document_Repository
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Uploadfile extends \NDB_Page
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
        return (
            $user->hasPermission('document_repository_delete')
            || $user->hasPermission('document_repository_view')

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
        if ($request->getMethod() == "POST") {
            $this->uploadDocFile();            
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withHeader("Allow", "POST")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("uploaded successfully"))
                );
        }
    }
/**
 * Handles the document upload process
 *
 * @throws DatabaseException
 *
 * @return void
 */
function uploadDocFile()
{
    $editNotifier   = new \NDB_Notifier(
        "document_repository",
        "edit"
    );
    $uploadNotifier = new \NDB_Notifier(
        "document_repository",
        "upload"
    );
    $factory = \NDB_Factory::singleton();
    $baseURL = $factory->settings()->getBaseURL();
    $config  = $factory->config();
    $base    = $config->getSetting('base');
    $name    = \User::singleton()->getUsername();
    $DB = \Database::singleton();
        $category   = $_POST['category']; // required
        $site       = $_POST['forSite']       !== '' ? $_POST['forSite'] : null;
        
        $site  = $DB->pselectOne("SELECT CenterID FROM psc WHERE Name=:name",
                 array('name'=>$site));
        $instrument = $_POST['instrument'] !== '' ? $_POST['instrument'] : null;
        $pscid      = $_POST['pscid']      !== '' ? $_POST['pscid'] : null;
        $visit      = $_POST['visitLabel']      !== '' ? $_POST['visitLabel'] : null;
        $comments   = $_POST['comments']   !== '' ? $_POST['comments'] : null;
        $version    = $_POST['version']    !== '' ? $_POST['version'] : null;
        $fileSize   = $_FILES["file"]["size"];
        $fileName   = $_FILES["file"]["name"];
        $fileType   = pathinfo($_FILES['file']['name'], PATHINFO_EXTENSION);
        $uploadPath = "$base/modules/document_repository/user_uploads/$name/";
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
        mkdir($uploadPath, 0770);
    }
        // Copy the uploaded file to the user's upload folder if possible.
        // Insert a record of the file into the document_repository table
    if (!move_uploaded_file(
        $_FILES['file']['tmp_name'],
        $uploadPath . $fileName
    )) {
        throw new LorisException(
            'ERROR: Could not upload file. Contact your administrator.'
        );
    } else {
        $success = $DB->insert(
            'document_repository',
            array(
             'File_category' => $category,
             'For_site'      => $site,
             'comments'      => $comments,
             'version'       => $version,
             'File_name'     => $fileName,
             'File_size'     => $fileSize,
             'Data_dir'      => "$name/$fileName", // e.g. 'admin/file.png'
             'uploaded_by'   => $name,
             'Instrument'    => $instrument,
             'PSCID'         => $pscid,
             'visitLabel'    => $visit,
             'File_type'     => $fileType,
            )
        );
        $msg_data['newDocument']
            = $baseURL . "/document_repository/";
        $msg_data['document']    = $fileName;
        $uploadNotifier->notify($msg_data);
    }
}

/**
 * Returns a list of fields from database
 *
 * @return array
 * @throws DatabaseException
 */
  function getUploadDocFields(): array
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
    if (isset($_GET['idDocFile'])) {
        $idDocFile = $_GET['idDocFile'];
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
                            " where id=$parent_id";
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
}

