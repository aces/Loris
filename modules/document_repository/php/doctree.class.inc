<?php declare(strict_types=1);

/**
 * It includes one main function.
 * Get method handles getting the parent's categroies and
 * the children's categories of one category.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Document_Repository
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\document_repository;
use \Psr\Http\Message\ServerRequestInterface;
use \Psr\Http\Message\ResponseInterface;

/**
 * It includes one main function.
 * Get method handles getting the parent's categroies and
 * the children's categories of one category.
 *
 * PHP Version 8
 *
 * @category Main
 * @package  Document_Repository
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class DocTree extends \NDB_Page
{
    public $skipTemplate = true;

    /**
     * Same as the permissions for the main menu filter page.
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool true only if the user has access to this page.
     */
    #[\Override]
    public function isAccessibleBy(\User $user) : bool
    {
        return $user->hasAnyPermission(
            [
                'document_repository_view',
                'document_repository_delete',
                'document_repository_categories',
                'document_repository_upload_edit'
            ]
        );
    }

    /**
     * GET method gets a list of parent's categroies and
     * the children's categories.
     *
     * @param ServerRequestInterface $request The incoming PSR7 request
     *
     * @return ResponseInterface The outgoing PSR7 response
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        if ($request->getMethod()=='GET') {
            $id = basename($request->getUri()->getPath());
            return (new \LORIS\Http\Response())
                ->withStatus(200)
                ->withHeader("Content-Type", "text/plain")
                ->withBody(
                    new \LORIS\Http\StringStream(
                        json_encode($this->fileTree($id))
                    )
                );
        }
    }

    /**
     * Returns the selected category, its ancestors, and its descendants.
     *
     * @param string|int $id The selected category ID
     *
     * @return array
     */
    public function fileTree(string|int $id): array
    {
        $db   = $this->loris->getDatabaseConnection();
        $tree = new CategoryTree(
            $db->pselect("SELECT * FROM document_repository_categories", [])
        );
        return $tree->getBranch($id);
    }
}
