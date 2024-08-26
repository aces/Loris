<?php
/**
 * This class handles a post request to upload a new category.
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
 * This class handles a post request to upload a new category.
 * PHP Version 7
 *
 * @category Main
 * @package  Document_Repository
 * @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class UploadCategory extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Same as the permissions for the main menu filter page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if the user has access to this page.
     */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('document_repository_categories')
            && $user->hasAnyPermission(
                [
                    'document_repository_upload_edit',
                    'document_repository_delete',
                ]
            )
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
            if ($this->uploadDocCategory($request)) {
                return (new \LORIS\Http\Response())
                    ->withStatus(200)
                    ->withHeader("Content-Type", "text/plain")
                    ->withBody(
                        new \LORIS\Http\StringStream(
                            json_encode("uploaded successfully")
                        )
                    );
            }
            return new \LORIS\Http\Response\JSON\Conflict(
                "Duplicate category name under same parent folder."
            );
        } else {
            return (new \LORIS\Http\Response())
                ->withStatus(405)
                ->withHeader("Content-Type", "text/plain")
                ->withHeader("Allow", "POST");
        }
    }
    /**
     * Handles the upload category process
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return bool
     */
    function uploadDocCategory($request): bool
    {
        $DB  = $this->loris->getDatabaseConnection();
        $req = $request->getParsedBody();
        if (!is_array($req)) {
            throw new \LorisException("Invalid JSON");
        }
        $category_name = $req['categoryName']; // required
        $parent_id     = isset($req['parentId']) ? $req['parentId'] : '0';
        $comments      = isset($req['comments']) ? $req['comments'] : null;
        //check duplicate name category
        if ($this->existCategoryName($category_name, $parent_id)) {
            return false;
        }
        $DB->insert(
            "document_repository_categories",
            [
                "category_name" => $category_name,
                "parent_id"     => $parent_id,
                "comments"      => $comments,
            ]
        );
        $Notifier = new \NDB_Notifier(
            "document_repository",
            "new_category"
        );
        $factory  = \NDB_Factory::singleton();
        $baseURL  = $factory->settings()->getBaseURL();
        $msg_data = [
            'newCategory' => $baseURL . "/document_repository/",
            'category'    => $category_name,
        ];
        $Notifier->notify($msg_data);
        return true;
    }
    /**
     * Check the category name under the same parent folder in the database,
     * if exists return true
     *
     * @param string $categoryName file name
     * @param int    $parent_id    parent folder id
     *
     * @return bool
     */
    function existCategoryName(string $categoryName, int $parent_id): bool
    {
        $DB            = \NDB_Factory::singleton()->database();
        $categoryCount =  $DB->pselectOne(
            "SELECT COUNT(*) FROM document_repository_categories
             WHERE category_name=:name and parent_id=:id ",
            ['name' => $categoryName, 'id' => $parent_id]
        );
        if ((int)$categoryCount > 0) {
            return true;
        }
        return false;
    }
}
