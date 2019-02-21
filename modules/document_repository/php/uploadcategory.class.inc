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
            $this->uploadDocCategory($request);
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
                ->withStatus(405)
                ->withHeader("Allow", "POST");  
        }
    }
    /**
 * Handles the upload category process
 *
 * @return void
 */
    function uploadDocCategory($request): void
    {
        $DB            = \Database::singleton();
        $req          = $request->getParsedBody(); 
        $category_name = $req['categoryName']; // required
        $parent_id     = $req['parentId']  !== '' ? $req['parentId'] : null;
        $comment       = $req['comments']    !== '' ? $req['comments'] : null;
        // todo check duplicate name category
        $DB->insert(
            "document_repository_categories",
            array(
             "category_name" => $category_name,
             "parent_id"     => $parent_id,
             "comments"      => $comments,
            )
        );
    }
}
