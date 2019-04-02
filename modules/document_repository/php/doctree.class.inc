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
          if ($request->getMethod()=='GET'){
          $data= $this->getTreeData();

       echo '<pre>';

//           $tree = $this->getTree($data, 0);
//          var_dump($tree);
   //      var_dump($data);
  //        echo '---------';
   
         var_dump($this->getAllNodesID($data,0));

            return (new \LORIS\Http\Response())
              ->withHeader("Content-Type", "text/plain")
              ->withStatus(200)
              ->withBody(
                  new \LORIS\Http\StringStream(
                      json_encode($tree)
                  )
              );
            }
    }


    public function getTreeData() {

          $DB   = \Database::singleton();
          $category  = $DB->pselect(
            "SELECT * FROM document_repository_categories",
            array()
          );
     return $category;
        //  echo '<pre>';
        //  var_dump($res);
          
    }
   public function getTree($data, $pId)
   {
   $tree = array();
   foreach($data as $k => $v)
         {
            if($v['parent_id'] == $pId){
            $v['nodes'] = $this->getTree($data, $v['id']);
            $tree[] = $v;
            }
         }
      return $tree;
   }
   public function getAllNodesID($data, $parent_id = '0',$is_first_time = true)
{
    static $arr = [];
    if ($is_first_time) {
        $arr = [];
    }
    foreach ($data as $key => $val) {
        if ($val['parent_id'] == $parent_id) {
            $arr[]           = $val['id'];
            $this->getAllNodesID($data, $val['id'], false);
        }
    }
    return $arr;

}

}
