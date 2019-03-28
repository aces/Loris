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
class Document_Repository extends \NDB_Menu_Filter
{

    var $centerIDMap;
    var $treeToArray = array();

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
    function _setupVariables()
    {

        $user =& \User::singleton();

        // create the centerID map
        $db      =& \Database::singleton();
        $pscRows = $db->pselect("SELECT CenterID, Name FROM psc", array());
        foreach ($pscRows AS $row) {
            $this->centerIDMap[$row['CenterID']] = $row['Name'];
        }

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
            // get the list of study sites - to be replaced by the Site object
            if (is_array($list_of_sites)) {
                $list_of_sites = array(null => 'Any') + $list_of_sites;
            }
        } else {
            // allow only to view own site data
            $list_of_sites = $user->getStudySites();
            $list_of_sites = array('' => 'All User Sites') + $list_of_sites;
        }

        $list_of_instruments = \Utility::getAllInstruments();

        $list_of_visit_labels = array_merge(
            array(null => "Any") + \Utility::getVisitList()
        );
        $subproject_options   = \Utility::getSubprojectList();
        $subproject_options   = array(null => 'Any') + $subproject_options;

        $DB = \Database::singleton();

        //There's no dropdown filter for file names?
        //$fileNames = $DB->pselect(
        //"Select File_name from document_repository", array());
        $fileTypes = array();
        $sqlSelect = "SELECT DISTINCT File_type".
                     " FROM document_repository ORDER BY File_type";
        $fileT     = $DB->pselect($sqlSelect, array());
        foreach ($fileT as $fileType) {
            $fileTypes[$fileType['File_type']] = $fileType['File_type'];
        }
        $fileTypes = array_merge(array(null => 'Any') + $fileTypes);

        $sqlSelect      = "SELECT DISTINCT File_category".
            " FROM document_repository ORDER BY File_category";
        $fileCategories = $DB->pselectCol($sqlSelect, array());
        // Form Elements
        $this->addBasicText('File_name', 'File name:');
        $this->addBasicText('version', 'Version:');

        $this->addSelect('File_type', 'File type:', $fileTypes);
        $this->addSelect('File_category', 'File category:', $fileCategories);
        $this->tpl_data['Sites']       = $list_of_sites;
        $this->tpl_data['Instruments'] = $list_of_instruments;
        $user   =& \User::singleton();
        $userID = $user->getData('UserID');
        $this->tpl_data['User'] = $userID;
        $this->addSelect('For_site', 'For Site:', $list_of_sites);
        $this->addBasicText('uploaded_by', 'Uploaded By:');

        return true;
    }

    /**
     * GetBetween function
     *
     * @param string $string the value of this string
     * @param string $delim  the value of delim
     *
     * @return array
     */
    function getBetween($string,$delim)
    {
        $string = explode($delim, $string);
        return isset($string[0]) ? $string[0] : '';
    }

    /**
     * WalkTree function
     *
     * @param string $item the value of item
     * @param string $key  the value of key
     *
     * @return void
     */
    function walkTree($item,$key)
    {
        if ($key == 'id') {
            $this->treeToArray[] = $item;
        }
    }

    /**
     * ParseTree function
     *
     * @param array $treeToParse the value of treeToParse
     *
     * @return array
     */
    function parseTree($treeToParse)
    {
        foreach ($treeToParse as $theTree) {
            array_walk_recursive($theTree, array($this, 'walkTree'));
        }
        return $this->treeToArray;
    }

    /**
     * ParseCategory function
     *
     * @param string $value the value
     *
     * @return array
     */
    function parseCategory($value)
    {
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
        return $categoryName;
    }

    /**
     * Works the same as NDB_Menu_Filter but doesn't include limit.
     * The document_repository is not paginated
     *
     * @return array
     */
    function _getPreparedQuery()
    {
        $DB = \Database::singleton();

        $qparams = array();
        // add the base query
        $query  = '';
        $query .= $this->_getBaseQuery();

        $filterdetails = $this->_getBaseFilter();
        $query        .= $filterdetails['clause'];
        $qparams       = $filterdetails['params'];
        // apply ORDER BY filters
        $query .= " ORDER BY ";
        if (!empty($this->filter['order'])) {
            $query .= $this->filter['order']['field']
                ." ".$this->filter['order']['fieldOrder'].", ";
        }
        $query .= $this->order_by;

        return array(
                'query'  => $query,
                'params' => $qparams,
               );
    }

    /**
     * Overwritten because the document repository isn't really a menu
     * filter table, it doesn't
     * use pagination
     *
     * @return array
     */
    function _getList()
    {
        return array();
    }

    /**
     * Sets the template data for the list of candidates, users, etc.
     *
     * @return void
     * @access private
     */
    function _setDataTable()
    {
        $DB       = \Database::singleton();
        $user     = \User::singleton();
        $results  = array();
        $query    = "SELECT * FROM document_repository_categories".
                    " ORDER BY parent_id ASC";
        $dbresult = $DB->pselect($query, array());

        // FIXME: the for-loop below is needlessly confusing. It appears
        // to be trying to group the categories from the database into a
        // tree by abusing undeclared properities on anonymous objects.
        // (Most likely because references are required for the tree
        // structure, so an associative array would work poorly.)
        //
        // This would probably be easier to understand and more
        // robust with named classes and unit tests..
        $refs = new \stdClass();
        foreach ($dbresult as $row) {
            $results[] =$row;
            $tree      = null;
            foreach ($results as $result) {
                $thisref = &$refs->{$result['id']};
                if (empty($thisref)) {
                    $thisref = new \stdClass();
                    $refs->{$result['id']} =& $thisref;
                }
                foreach ($result as $k => $v) {
                        $thisref->{$k} = utf8_encode($v);
                }
                if ($result['parent_id'] == 0) {
                    $tree->{$result['id']} = &$thisref;
                } else {
                    $refs->{$result['parent_id']}->children->{$result['id']}
                        = &$thisref;
                }
            }
        }
        $query           ="SELECT id,category_name,parent_id,comments".
                         " FROM document_repository_categories ORDER BY parent_id";
        $IDCategories    = $DB->pselect($query, array());
        $tmpIDCategories = $IDCategories;

        //$tree is an object with references, so here we are encoding it
        // as json and then decoding it into a php associative array
        $tmpIDCategories  = json_decode(json_encode($tree), true);
        $categoryOrdering = $this->parseTree($tmpIDCategories);

        foreach ($categoryOrdering as $order) {
            foreach ($IDCategories as $key=>$value) {
                $CategoryID = $value['id'];
                if ($CategoryID == $order) {
                    $fileCategories[$CategoryID]
                        = array(
                           'CategoryName' => $this->parseCategory($value),
                           'Comment'      => $value['comments'],
                           'Files'        => array(),
                           'ParentID'     => $value['parent_id'],
                          );
                }
            }
        }

        $this->tpl_data['File_categories'] = $fileCategories;

        // create instance of config object
        $config =& \NDB_Config::singleton();

        // overriding pagination
        $DB = \Database::singleton();

        // print out column headings
        if (!$user->hasPermission('document_repository_delete')) {
            unset($this->headers[array_search('Delete', $this->headers)]);
        }
        $i = 0;
        foreach ($this->headers as $header) {
            $this->tpl_data['headers'][$i]['name'] = $header;
            // format header
            $this->tpl_data['headers'][$i]['displayName']
                = ucwords(str_replace('_', ' ', $header));
            // set field ordering
            if (isset($this->filter['order'])) {
                $this->tpl_data['headers'][$i]['fieldOrder']
                    = ($this->filter['order']['fieldOrder'] == 'ASC')
                       ? 'DESC' : 'ASC';
            }
            $i++;
        }

        // get the template data for the table rows

        $this->_setDataTableRows(-1);
    }

    /**
     * SetDataTableRows function
     *
     * @param int $count the number of data rows
     *
     * @return void
     */
    function _setDataTableRows($count)
    {
        $DB       = \Database::singleton();
        $query    = $this->_getPreparedQuery();
        $prepared = $DB->prepare($query['query']);
        $prepared->execute($query['params']);

        $site_names = \Utility::getSiteList(true);
        // print out
        $x = 0;
        while ($item = $prepared->fetch(\PDO::FETCH_ASSOC)) {
            $FileCategory
                =& $this->tpl_data['File_categories'][$item['File_category']];
            $DisplayItem  = $item;
            $DisplayItem['File_name'] = utf8_encode($item['File_name']);
            /* Note: The function "rawurlencode" handles character(s)
             * needed to be converted and the function "strtr" uses
             * the array supplied to replace the character(s)
             * to match the output from the javascript function
             * encodeURIComponent.
             */
            $DisplayItem['Data_dir']  = strtr(
                rawurlencode($DisplayItem['Data_dir']),
                array(
                 '%21' => '!',
                 '%2A' => '*',
                 '%27' => "'",
                 '%28' => '(',
                 '%29' => ')',
                )
            );
            $DisplayItem['File_size'] = $this->formatSize($item['File_size']);
            $DisplayItem['For_site']  = $site_names[$item['For_site']];

            if (is_array($FileCategory['Files'])) {
                array_push($FileCategory['Files'], $DisplayItem);
            }

        }

        return true;
    }

    /**
     * FormatSize function
     *
     * @param string $value the value
     *
     * @return string
     */
    function formatSize($value)
    {
        if (is_null($value)) {
            return null;
        }

        if ($value >= 1000000000) {
            $value = floor($value/1000000000);
            return "{$value} GB";
        }
        if ($value >= 1000000) {
            $value = floor($value/1000000);
            return "{$value} MB";
        }
        if ($value >= 1000) {
            $value = floor($value/1000);
            return "{$value} KB";
        }

        return "{$value} bytes";

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
             $baseURL . "/css/loris-jquery/jquery-ui-1.10.4.custom.min.css",
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
             $baseURL . "/document_repository/js/document_repository_helper.js",
            )
        );
    }

}

