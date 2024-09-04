<?php
/**
 * This class handles a post request to delete a category.
 * PHP Version 7
 *
 * @category Main
 * @package  Document_Repository
 * @author   Rolando Acosta <rolando.acosta@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\document_repository;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * This class handles a post request to delete a category.
 * PHP Version 7
 *
 * @category Main
 * @package  Document_Repository
 * @author   Rolando Acosta <rolando.acosta@mcin.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class DeleteCategory extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Checking user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true if the user has access to this page.
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('document_repository_categories');
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
            return $this->deleteDocCategory($request);
        } else {
            return new \LORIS\Http\Response\JSON\MethodNotAllowed(['POST']);
        }
    }
    /**
     * Handles the delete category process
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface
     */
    function deleteDocCategory($request): ResponseInterface
    {
        $DB          = \NDB_Factory::singleton()->database();
        $req         = $request->getParsedBody();
        $category_id = isset($req['categoryID']) ? $req['categoryID'] : null;

        if (!$this->categoryHasFiles($request)
            && !$this->categoryHasSubcategory($request)
        ) {
            $DB->delete(
                'document_repository_categories',
                ['id' => $category_id]
            );

            return new \LORIS\Http\Response\JSON\OK();
        } else {
            return new \LORIS\Http\Response\JSON\Conflict(
                'Can not delete non-empty category'
            );
        }
    }

    /**
     * Checks if there are files in the category.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return bool
     */
    function categoryHasFiles($request): bool
    {
        $req         = $request->getParsedBody();
        $DB          = \NDB_Factory::singleton()->database();
        $category_id = isset($req['categoryID']) ? $req['categoryID'] : null;

        $result = $DB->pselectOne(
            "SELECT COUNT(record_id)
                    FROM document_repository
                    WHERE File_category=:id",
            ["id" => $category_id]
        );
        return !empty($result);
    }

    /**
     * Checks if there are subcaterories in the category.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return bool
     */
    function categoryHasSubcategory($request): bool
    {
        $req         = $request->getParsedBody();
        $DB          = \NDB_Factory::singleton()->database();
        $category_id = isset($req['categoryID']) ? $req['categoryID'] : null;

        $result = $DB->pselectOne(
            "SELECT COUNT(id)
                    FROM document_repository_categories
                    WHERE parent_id=:id",
            ["id" => $category_id]
        );
        return !empty($result);
    }
}
