<?php
/**
 * This file handles the Document Repository for LORIS
 *
 * PHP Version 7
 *
 * @category Documentation
 * @package  Main
 * @author   Shen Wang <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris
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
 * @link     https://www.github.com/aces/Loris
 */
class Document_Repository extends \NDB_Menu_Filter_Form implements \JsonSerializable
{
    private const PERMISSIONS = [
        'document_repository_view',
        'document_repository_edit',
        'document_repository_delete',
    ];

    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @param Module $module     The test name being accessed
     * @param string $page       The subtest being accessed (may be an empty string)
     * @param string $identifier The identifier for the data to load on this page
     * @param string $commentID  The CommentID to load the data for
     */
    function __construct(
        \Module $module,
        string $page,
        string $identifier,
        string $commentID
    ) {
        parent::__construct($module, $page, $identifier, $commentID);
        $this->skipTemplate = true;
        $this->AjaxModule   = true;
    }

    /**
     * Checking user permissions
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasAnyPermission(self::PERMISSIONS);
    }
    /**
     * Function _setupVariables
     *
     * @return void
     */
    function setup()
    {
        parent::setup();
        $user  = \User::singleton();
        $db    = \Database::singleton();
        $query = $db->pselect(
            "SELECT * FROM document_repository_categories",
            []
        );
        //categories
        $categoriesList = [];
        foreach ($query as $value) {
               $arr = $this->parseCategory($value);
               $categoriesList[$arr['id']] =$arr['name'];
        }
        //site
        $siteList = [];

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
        //instrument
        $instruments     = $db->pselectCol(
            "SELECT Test_name FROM test_names ORDER BY Test_name",
            []
        );
        $instrumentsList = array_combine($instruments, $instruments);

        //file types
        $fileTypeList  = [];
        $fileTypeQuery = $db->pselect(
            "SELECT File_type FROM document_repository group by File_type",
            []
        );
        foreach ($fileTypeQuery as $filetype) {
            $fileTypeList[$filetype['File_type']] = $filetype['File_type'];
        }
        $this->fieldOptions = [
            'fileCategories' => $categoriesList,
            'sites'          => $siteList,
            'instruments'    => $instrumentsList,
            'fileTypes'      => $fileTypeList,
        ];
        return;
    }
    /**
     * Handler of parsing category
     *
     * @param array $value the value
     *
     * @return array
     */
    function parseCategory($value): array
    {
        $id    = $value['id'];
        $depth = 0;
        $DB    = \Database::singleton();
            $categoryName = $value['category_name'];
        do {
            if ($value['parent_id'] != 0) {
                $depth    += 1;
                $parent_id = $value['parent_id'];
                $query     = "SELECT * FROM document_repository_categories".
                            " where id=$parent_id";
                $value     = $DB->pselectRow($query, []);
                if (is_null($value)) {
                    throw new \LorisException(
                        'Could not find data for specified parent ID. '
                        . 'Cannot parse category.'
                    );
                }
                $categoryName = $value['category_name'] . ">" . $categoryName;
            }
        } while ($value['parent_id'] != 0);
         return [
             "name" => $categoryName,
             "id"   => $id,
         ];
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
            'v.record_id as Edit',
            'v.record_id as Delete_File',
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
    }

    /**
     * Converts the results of this menu filter
     * to be retrieved with ?format=json
     *
     * @return array which can be serialized by json_encode()
     */
    public function jsonSerialize() : array
    {
        $result = $this->toArray();
        $result['maxUploadSize'] = \Utility::getMaxUploadSize();
        return $result;
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
            [
                $baseURL . "/document_repository/js/docIndex.js",
            ]
        );
    }

}


