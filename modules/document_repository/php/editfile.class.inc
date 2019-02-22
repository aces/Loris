<?php
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
class EditFile extends \NDB_Page
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
        switch ($request->getMethod()) {
        case "POST":
            $this->editDocFile($request);
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("update")
                    )
                );
          break;
        case "DELETE":
            $path = $request->getQueryParams();
            $id   = basename($path['lorispath']);
            $this->deleteFile($id);
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(200)
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode("delete")
                    )
                );
          break;
        default:
            return (new \LORIS\Http\Response())
                ->withHeader("Content-Type", "text/plain")
                ->withStatus(405)
                ->withHeader("Allow", "POST and DELETE");
        }
    }
    /**
 * Handles the document editing process
 *
 * @param ServerRequestInterface $request The incoming PSR7 request
 *
 * @throws \DatabaseException
 *
 * @return void
 */
    function editDocFile($request): void
    {
        $db           = \Database::singleton();
        $user         = \User::singleton();
        $req          = $request->getParsedBody();
        $updateValues = [
                         'File_category' => isset($req['category']) ?
                              $req['category'] : null,
                         'For_site'      => isset($req['forSite']) ?
                              $req['forSite'] : null,
                         'Instrument'    => isset($req['instrument']) ?
                              $req['instrument'] : null,
                         'comments'      => isset($req['comments']) ?
                              $req['comments'] : null,
                         'version'       => isset($req['version']) ?
                              $req['version'] : null,
                         'visitLabel'    => isset($req['visitLabel']) ?
                              $req['visitLabel'] : null,
                         'pscid'         => isset($req['pscid']) ?
                              $req['pscid'] : null,
                        ];
        try {
            $db->update(
                'document_repository',
                $updateValues,
                ['record_id' => $req['id']]
            );
        } catch (\DatabaseException $e) {
            showError("Could not update the file. Please try again!");
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
        // create Database object
        $DB       = \Database::singleton();
        $user     = \User::singleton();
        $Notifier = new \NDB_Notifier(
            "document_repository",
            "delete"
        );

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
            $msg_data['deleteDocument'] = $baseURL. "/document_repository/";
            $msg_data['document']       = $fileName;

            $Notifier->notify($msg_data);
        }

        $path = __DIR__ . "/../user_uploads/$dataDir";

        if (file_exists($path)) {
            unlink($path);
        }

    }
}
