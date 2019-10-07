<?php
/**
 * It includes one main function.
 * Get method handles getting the parent's categroies and
 * the children's categories of one category.
 *
 * PHP Version 7
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
 * PHP Version 7
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
            ->withHeader("Content-Type", "text/plain")
            ->withStatus(200)
            ->withBody(
                new \LORIS\Http\StringStream(
                    json_encode($this->fileTree($id))
                )
            );
        }
    }
    /**
     * This method will return an array of document_repository_categories
     *
     * @return array All the data from the document_repository_categories table
     */
    public function getTreeData()
    {
        return \Database::singleton()->pselect(
            "SELECT * FROM document_repository_categories",
            array()
        );
    }
    /**
     * This method will return an array of all children's categories
     *
     * @param array  $data          an array of document_repository_categories
     * @param string $parent_id     default parent_id
     * @param bool   $is_first_time it is the first time to run the function
     *
     * @return array the result
     */
    public function getAllNodesID($data, $parent_id = '0',$is_first_time = true)
    {
        static $arr = [];
        if ($is_first_time) {
            $arr = [];
        }
        foreach ($data as $key => $val) {
            if ($val['parent_id'] == $parent_id) {
                $arr[] = $val['id'];
                $this->getAllNodesID($data, $val['id'], false);
            }
        }
        return $arr;

    }

    /**
     * This method will return an array of all parents' categories
     *
     * @param array  $data an array of document_repository_categories
     * @param string $id   the id of the current category
     *
     * @return array the result
     */
    public function getParents($data, $id)
    {
        $arr = array();
        foreach ($data as $v) {
            if ($v['id'] == $id) {
                $arr[] = $v;
                if ($v['parent_id'] != 0) {
                     $arr = array_merge(
                         $this->getParents($data, $v['parent_id']),
                         $arr
                     );
                }
            }
        }
        return $arr;
    }
    /**
     * This method will return a json of the parent's categroies and
     * the children's categories of one category.
     *
     * @param string $id the id of current category
     *
     * @return array the result
     */
    public function fileTree($id)
    {
        $result           = array();
        $allsubcategories = array();
        $user = \User::singleton();
        $db   = \Database::singleton();

        $tree = $this->getTreeData();
        $pids = $this->getAllNodesID($tree, $id);

        $currentcategory    = $db->pselect(
            "SELECT id,category_name,comments
             FROM document_repository_categories WHERE id=$id",
            array()
        );
        $allsubcategories[] = array('id' => $id);
        foreach ($pids as $k=>$v) {
            $category           = $db->pselectRow(
                "SELECT id FROM document_repository_categories WHERE id=$v",
                array()
            );
            $allsubcategories[] = $category;
        }

        $subcategories    = $db->pselect(
            "SELECT id,category_name,comments 
             FROM document_repository_categories WHERE parent_id=$id",
            array()
        );
        $parentcategories =   $this->getParents($tree, $id);
        $result['allsubcategories'] = $allsubcategories;
        $result['currentcategory']  = $currentcategory;
        $result['parentcategory']   = $parentcategories;
        $result['subcategories']    = $subcategories;

        return $result;
    }

}
