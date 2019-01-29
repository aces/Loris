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
class Editfile extends \NDB_Page
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
            $this->editDocFile();
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withHeader("Allow", "POST")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("update")
                    )
                );
        }
        if ($request->getMethod() == "DELETE") {
            $this->deleteFile();
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withHeader("Allow", "DELETE")
                ->withBody(
                    new \LORIS\Http\StringStream(
                       json_encode("delete")
                    )
                );
        }
    }
    /**
 * Handles the document edit process
 *
 * @throws \DatabaseException
 *
 * @return void
 */
    function editDocFile(): void
    {
        $db           = \Database::singleton();
        $user         = \User::singleton();
        var_dump($_POST);
        $updateValues = [
                         'File_category' => $_POST['category'],
                         'For_site'      => $_POST['forSite'],
                         'Instrument'    => $_POST['instrument'],
                         'comments'      => ($_POST['comments']==null) ? NULL : $_POST['comments'],
                         'version'       => $_POST['version'],
                         'visitLabel'    => $_POST['visitLabel'],
                         'pscid'         => $_POST['pscid'],
                        ];
        try {
            $db->update(
                'document_repository',
                $updateValues,
                ['record_id' => $_POST['id']]
            );
        } catch (\DatabaseException $e) {
            showError("Could not update the file. Please try again!");
        }
    }
    /**
 * Handles the document edit process
 *
 * @throws \DatabaseException
 *
 * @return void
 */
    function deleteFile(): void
    {
      $user = \User::singleton();
if (!$user->hasPermission('document_repository_delete')) {
    header("HTTP/1.1 403 Forbidden");
    exit;
}

// create Database object
$DB = \Database::singleton();

$Notifier = new \NDB_Notifier(
    "document_repository",
    "delete"
);

$rid = basename($_SERVER['REQUEST_URI']);

$fileName = $DB->pselectOne(
    "Select File_name from document_repository where record_id =:identifier",
    array(':identifier' => $rid)
);
$userName = $DB->pselectOne(
    "Select uploaded_by from document_repository where record_id =:identifier",
    array(':identifier' => $rid)
);
$dataDir  = $DB->pselectOne(
    "Select Data_dir from document_repository where record_id =:identifier",
    array(':identifier' => $rid)
);


//if user has document repository delete permission
if ($user->hasPermission('document_repository_delete')) {
    $DB->delete("document_repository", array("record_id" => $rid));
    $msg_data['deleteDocument'] = $baseURL. "/document_repository/";
    $msg_data['document']       = $fileName;

    $Notifier->notify($msg_data);
}

$path = __DIR__ . "/../user_uploads/$dataDir";

//if (file_exists($path)) {
//    unlink($path);
//}

    }
}
