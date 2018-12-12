<?php
/**
 * This file handles the Document Repository for LORIS
 *
 * PHP Version 7
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
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/Jkat/Loris-Trunk/
*/
class Document_Repository extends \NDB_Menu_Filter
{
    var $AjaxModule      = true;
    public $skipTemplate = true;

    /**
     * Checking user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
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
        $user = \User::singleton();
        $db   = \Database::singleton();

        $fileTypeList  = [];
        $fileTypeQuery = $db->pselect(
            "SELECT File_type FROM document_repository",
            []
        );
        foreach ($fileTypeQuery as $filetype) {
            $fileTypeList[$filetype['File_type']] = $filetype['File_type'];
        }
        //        print_r($fileTypeList);
        $siteList = array();
        // allow to view all sites data through filter

        $query  = " FROM document_repository v";
        $query .= " WHERE COALESCE(v.hide_video, false)=false";

        // set the class variables
        $this->columns = array(
                          'v.record_id',
                          'v.File_name',
                          'v.version',
                          'v.File_size',
                          'v.File_category',
                          'v.File_type',
                          'v.Instrument',
                          'v.uploaded_by',
                          'v.For_site',
                          'v.comments',
                          'v.Data_dir',
                          'v.Date_uploaded',
                         );

        $openAccordion = !empty($_GET['openAccordion']);
        $this->tpl_data['openAccordion'] = $openAccordion;
        $filtered = !empty($_GET['filtered']);
        $this->tpl_data['filtered'] = $filtered;
        $this->query        = $query;
        $this->group_by     = '';
        $this->order_by     = 'v.File_name';
        $this->headers      = array(
                               'File_name',
                               'version',
                               'File_type',
                               'Instrument',
                               'uploaded_by',
                               'For_site',
                               'comments',
                               'Date_uploaded',
                               'Edit',
                               'Delete',
                              );
        $this->validFilters = array(
                               'v.For_site',
                               'v.File_name',
                               'v.File_category',
                               'v.File_type',
                               'v.version',
                               'v.uploaded_by',
                              );

        $this->formToFilter = array(
                               'File_name'     => 'v.File_name',
                               'File_type'     => 'v.File_type',
                               'File_category' => 'v.File_category',
                               'version'       => 'v.version',
                               'Data_dir'      => 'v.Data_dir',
                               'For_site'      => 'v.For_site',
                               'uploaded_by'   => 'v.uploaded_by',
                               'Date_uploaded' => 'v.Date_uploaded',
                              );

        $this->_setFilterForm();
        return true;
    }

    /**
     * Set filter form function
     *
     * @return void
     */
    function _setFilterForm()
    {
        // create user object
        $user =& \User::singleton();

        $list_of_sites = \Utility::getSiteList(true);
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
               $item      = $this->parseCategory($value);
               $id        = $item['id'];
               $name      = $item['name'];
               $data[$id] =$name;
        }
        $categoryList = $data;
        $fileTypes = array_merge(array(null => 'Any') + $fileTypes);

        $sqlSelect      = "SELECT DISTINCT File_category".
            " FROM document_repository ORDER BY File_category";
        $fileCategories = $DB->pselectCol($sqlSelect, array());
        // Form Elements

        $this->addSelect('fileType', 'File type', $fileTypeList);
        $this->addSelect('site', 'For Site', $siteList);
        $this->addSelect('category', 'File category', $categoryList);
        $this->fieldOptions = [
                               'fileTypes'   => $fileTypeList,
                               'fileCategories'  => $categoryList,
                               'sites'       => $siteList,
                              ];

        return true;
    }
    /**
     * Return the category list array
     *
     * @param string $value value
     *
     * @return array
     */
    public  function parseCategory($value)
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
     * Build a list of media to display in Data Table
     *
     * @return void
     * @throws \DatabaseException
     */
    function _setupVariables()
    {
        $user = \User::singleton();
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
                         'v.record_id as editID',
                         'v.record_id as deleteID',
                         'v.File_category as category',
                         'v.Data_dir',
                        ];
        $this->query   = $query;
        if (!$user->hasPermission('access_all_profiles')) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND v.For_site IN (" . $site_arr . ")";
        }
        $this->group_by = '';
        $this->order_by = 'v.File_name';
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

