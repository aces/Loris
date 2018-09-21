<?php
/**
 * This file handles the Document Repository for LORIS
 *
 * PHP Version 5
 *
 * @category Documentation
 * @package  Main
 * @author   Mia Petkova <mia.petkova@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/Jkat/Loris-Trunk/
 */
namespace LORIS\document_repository;
/**
 * Document Repository Class
 *
 * This class is for the Document Repository
 *
 * @category Documentation
 * @package  Main
 * @author   Justin Kat <justinkat@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/Jkat/Loris-Trunk/
*/
class Document_Repository extends \NDB_Menu_Filter_Form
{
    var $AjaxModule      = true;
    public $skipTemplate = true;

    /**
     * Checking user permissions
     *
     * @return bool
     */
    function _hasAccess()
    {
        //create user object
        $user =& \User::singleton();

        return $user->hasPermission('document_repository_view')
               || $user->hasPermission('document_repository_delete');

    }

    /**
     * Function _setupVariables
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        $user =& \User::singleton();
        $db   = \Database::singleton();

        $fileTypeList  = [];
        $fileTypeQuery = $db->pselect("SELECT File_type FROM document_repository", []);
        foreach ($fileTypeQuery as $filetype) {
            $fileTypeList[$filetype['File_type']] = $filetype['File_type'];
        }
//        print_r($fileTypeList);
        $siteList  = array();
        // allow to view all sites data through filter
        if ($user->hasPermission('access_all_profiles')) {
            $siteList = \Utility::getSiteList(false);
            // Index sites using their names (used to filter react tables)
            foreach ($siteList as $key => $site) {
                unset($siteList[$key]);
                $siteList[$site] = $site;
            }
        } else {
            // allow only to view own site data
            $siteIDs = $user->getData('CenterIDs');
            foreach ($siteIDs as $val) {
                $site =& \Site::singleton($val);
                if ($site->isStudySite()) {
                    $siteList[$site->getCenterName()] = $site->getCenterName();
                }
            }
        }
//todo get the list
$result = $db->pselect(
    "SELECT * FROM document_repository_categories",
    array()
);

$data = array();
foreach ($result as $value) {
       $item = $this->parseCategory($value);
       $id   = $item['id'];
       $name = $item['name'];
       $data[$id]=$name;
}
        $categoryList = $data;
        // Form Elements
        
        $this->addBasicText('fileName', 'File Name');
        $this->addBasicText('version', 'Version');
        $this->addSelect('fileType', 'File type', $fileTypeList);
        $this->addSelect('site', 'For Site', $siteList);
        $this->addBasicText('uploadedBy', 'Uploaded By');
        $this->addSelect('category','File category',$categoryList);

        return true;
}
  public  function parseCategory($value)
    {
        $id = $value['id'];
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
//try to return array{{name:"ddd",id:'1'}{}}
//        return $categoryName;
//          return $id;
         return array("name"=>$categoryName,"id"=>$id);
    }
    /**
     * Build a list of media to display in Data Table
     *
     * @return void
     * @throws \DatabaseException
     */
    function _setupVariables()
    {
        $user =& \User::singleton();
        // the base query
        $query  = " FROM document_repository v";
        $query .= " WHERE COALESCE(v.hide_video, false)=false";
        // set the class variables
        $this->columns =[
                          'v.File_name',
                          'v.version',
                          'v.File_type',
                          'v.Instrument',
                          'v.uploaded_by',
                          '(SELECT name FROM psc WHERE CenterID=v.For_site) as site',
                          'v.comments',
                          'v.Date_uploaded',
                          'v.File_category as category',
                          'v.Data_dir',
                        ];
        $this->query = $query;
        if (!$user->hasPermission('access_all_profiles')) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND v.For_site IN (" . $site_arr . ")";
        }
        $this->group_by = '';
        $this->order_by = 'v.File_name';
        $this->headers  = [
                               'File_name',
                               'version',
                               'File_type',
                               'Instrument',
                               'uploaded_by',
                               'Site',
                               'comments',
                               'Date_uploaded',
                               'category',
                               'Data_dir',
                               'Edit',
                               'Delete',
                          ];
        return true;
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        $result         = $this->toArray();
        $result['form'] = $this->form->form;
        return json_encode($result);
    }

    /**
     * Include additional CSS files:
     *  1. jQuery UI
     *  2. document_repository.css
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            [
             $baseURL . "/document_repository/css/document_repository.css",
            ]
        );
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/document_repository/js/docIndex.js",
            )
        );
    }

}

