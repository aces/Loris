<?php
/**
 * This class features the code for the Menu Filter.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

require_once 'Pager/Pager.php';
require_once 'NDB_Menu.class.inc';
require_once "HTML/QuickForm.php";
require_once 'HTML/QuickForm/Renderer/ArraySmarty.php';
require_once 'HTML/QuickForm/text.php';
require_once 'HTML/QuickForm/select.php';
/**
 * Menu class, with filtering
 *
 * Used in the likes of access profile, user accounts, certification, etc.
 * 
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  Loris license
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Menu_Filter extends NDB_Menu
{
    var $TotalItems;
    /**
     * The columns to SELECT
     * @var    array
     * @access private
     */
    var $columns;

    /**
     * The base select query, starts at FROM
     * @var    string 
     * @access private
     */
    var $query;

    /**
     * The default GROUP BY column
     * @var    string 
     * @access private
     */
    var $group_by;

    /**
     * The default ORDER BY column
     * @var    string 
     * @access private
     */
    var $order_by = '1';

    /**
     * Stores the filter form data, or other form data
     * @var    HTML_QuickForm 
     * @access private
     */
    var $form;

    /**
     * Items selected from the GUI selection form
     * @var    array
     * @access private
     */
    var $filter;

    /**
     * An array of all valid filters to use
     * @var    array 
     * @access private
     */
    var $validFilters = array();

    /**
     * Items selected from the GUI to filter, where the underlying 
     * SQL uses an an aggregate function. This is determined by checking
     * if the filter is in the validHavingFilters array, and if so
     * appending it to $having instead of $filter
     */
    var $having;
    /**
     * Filters that the 
     */
    var $validHavingFilters = array();
    /**
     * Associates the form element to the appropriate filter
     * @var    array 
     * @access private
     */
    var $formToFilter = array();

    /**
     * An array of all the table headers (optional)
     *
     * The array will automatically be built based on the column array
     *
     * @var    array 
     * @access private
     */
    var $headers = array();

    /**
     * The list of candidates, users, etc
     * @var    array
     * @access private
     */
    var $list;

    /**
     * Calls other member functions to do all the work necessary to create the menu
     *
     * @return void
     * @throws PEAR_Error
     * @access public
     */
    function setup()
    {
        // setup the menu's variables
        $success = $this->_setupVariables();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "NDB_Menu_Filter::setup() setup: ".$success->getMessage()
            );
        }

        // set the headers if necessary
        if (!is_array($this->headers) || count($this->headers) == 0) {
            foreach ($this->columns as $value) {
                preg_match('/[0-9A-Za-z_]+$/', $value, $match);
                $this->headers[] = $match[0];
            }
        }
        
        // start the filter form
        $this->_setupPage(null, null, null, null, 'filter');
        // $this->form = new HTML_QuickForm('filter');

        // set the filters
        $this->_setupFilters();
        
        // build the menu
        $success = $this->_build();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "NDB_Menu_Filter::setup() build: ".$success->getMessage()
            );
        }

        return true;
    }

    /**
     * Sets up the menu
     *
     * Sets filter, query, group_by, order_by, headers, filters for subtests
     *
     * Usage: 'query' is the base query to which filters are appended in getList().
     * 'group_by' defaults to null (no grouping), and 'order_by' defaults to 1.
     * Set 'headers' to the titles you want for the columns in the data table.
     * 'filters' must be an array of valid filters for your menu.
     *
     * @note   overloaded function
     * @return void
     * @access private
     */
    function _setupVariables()
    {
        return true;
    }


    /**
     * Builds the filter array to be used in this filter menu
     *
     * To reset the filter form, the reset button must not be part of the form.
     * It must be a button that appends 'reset=true' to the URI. Otherwise,
     * the submitted values in the other form elements will reappear, although
     * the filter itself will have been reset.
     *
     * @return void
     * @access private
     */
    function _setupFilters()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // manipulate the filters
        if (isset($_REQUEST['reset'])) {
            // erase filter data from the session
            $_SESSION['State']->setProperty('filter', null);
            $_SESSION['State']->setProperty('keyword', null);
           
        } elseif (isset($_REQUEST['filter'])) {
            // get the form's filters
            foreach ($this->formToFilter as $key => $val) {
                if (is_array($val)) {
                    foreach ($val as $key2 => $val2) {
                        if (isset($_REQUEST[$key][$key2])) {
                            $formFilters[$val2] = $_REQUEST[$key][$key2];
                        }
                    }
                } else {
                    if (isset($_REQUEST[$key])) {
                        $formFilters[$val] = $_REQUEST[$key];
                    }
                }
            }

            // get the ordering
            if (is_array($_REQUEST['filter']) && in_array(
                $_REQUEST['filter']['order']['field'], $this->headers
            )) {
                $formFilters['order'] = $_REQUEST['filter']['order'];
            }

            // save filter data in the session
            $oldFormFilters = $_SESSION['State']->getProperty('filter');
            if (is_array($oldFormFilters)) {
                foreach ($oldFormFilters as $key => $val) {
                    if (in_array($key, $this->CheckboxFilters)) {
                        unset($oldFormFilters[$key]);
                    }
                }
                $formFilters = array_merge($oldFormFilters, $formFilters);
            }
            $_SESSION['State']->setProperty('filter', $formFilters);
        }
        if(isset($_REQUEST['keyword'])) {
           $search['keyword'] = $_REQUEST['keyword'];
           $oldSearch = $_SESSION['State']->getProperty('keyword');
           if(is_array($oldSearch)) {
               $search = array_merge($oldSearch, $search);
           }
           $_SESSION['State']->setProperty('keyword', $search);


        }

        $filter = $_SESSION['State']->getProperty('filter');
        /**
         * TODO: I don't know why this is written this way.
         *       It should be rewritten both to fix references
         *       to undefined indexes and because it definitely
         *       shouldn't be using eval for security reasons.
         *       - Dave
         */
        // build the array of defaults
        foreach ($this->formToFilter as $key => $val) {
            if (is_array($filter) && count($filter) > 0) {
                if (is_array($val)) {
                    foreach ($val as $key2 => $val2) {
                        $sub[] = "'".$filter[$val2]."'";
                    }
                    $defaults[] = "'$key' => array(".implode(', ', $sub).")";
                    unset($sub);
                } else {
                    if (isset($filter[$val])) {
                        $defaults[] = "'$key' => '".$filter[$val]."'";
                    } else {
                        $defaults[] = "'$key' => ''";
                    }
                }
            } else {
                if (strtolower(substr($val, -8)) == 'centerid') {
                    $defaults[] = "'$key' => '".$user->getData('CenterID')."'";
                }
            }
           
            // set the filter form's defaults
            if (!empty($defaults)) {
                eval("\$this->form->setDefaults(
                    array(".implode(', ', $defaults).")
                );");
            }
        }
        $keyword = $_SESSION['State']->getProperty('keyword');
        foreach($keyword as $key=>$val) {
           // $defaults[] = "'$key'=>'$val'";
            $defaults[$key] = $val;
            $this->searchKey[$key] = $val;
        }
        // set the filter form's defaults
        $this->form->setDefaults($defaults);

      
        // set only the valid filters
        foreach ($this->validFilters as $value) {
            // if no filter was defined (i.e. first hit) 
            // limit listing to the user's site
            if (is_array($filter) && count($filter) > 0) {
                // If it's an aggregate, don't add it 
                // to the where clause filters. Add it to the
                // having clause filters
                if (isset($filter[$value])) {
                    if (in_array($value, $this->validHavingFilters)) {
                        $this->having[$value] = $filter[$value];
                    } else {
                        $this->filter[$value] = $filter[$value];
                    }
                }
            } else {
                if (strtolower(substr($value, -8)) == 'centerid') {
                    $this->filter[$value] = $user->getData('CenterID');
                }
            }
        }

        // set the ordering
        if (isset($filter['order']) && in_array(
            $filter['order']['field'], $this->headers
        )) {
            $this->filter['order'] = $filter['order'];
        }
    }

    /**
     * Contructs the menu
     *
     * @return void
     * @throws PEAR_Error
     * @access private
     */
    function _build()
    {
        // show selection form table
        $success = $this->_setFilterForm();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "NDB_Menu_Filter::_build() filter: ".$success->getMessage()
            );
        }

        // get the list
        $this->list = $this->_getList();
        if (Utility::isErrorX($this->list)) {
            return PEAR::raiseError(
                "NDB_Menu_Filter::_build() list: ".$this->list->getMessage()
            );
        }

        // show data table with user information and access URLs
        $success = $this->_setDataTable();
        if (Utility::isErrorX($success)) {
            return PEAR::raiseError(
                "NDB_Menu_Filter::_build() table: ".$success->getMessage()
            );
        }
    }


    /**
     * Sets the template data for the filter form
     *
     * @note   overloaded function
     * @return void
     * @access private
     */
    function _setFilterForm()
    {
        return true;
    }
    /**
    * Gets the base query
    *
    * @return $query
    */
    function _getBaseQuery()
    {
        $query = "SELECT ";
        if (is_array($this->columns) && count($this->columns) > 0) {
            $query .= implode(', ', $this->columns);
        } else {
            $query .= "*";
        }
        $query .= $this->query;
        return $query; 

    }
    /**
    * Adds filters
    *
    * @param string $prepared_key filter key
    * @param string $field        filter field
    * @param string $val          filter value
    *
    * @return $query
    */ 
    function _addValidFilters($prepared_key, $field, $val)
    {
        $query = '';
        if ((!empty($val) || $val === '0') && $field != 'order') {

            if (in_array($field, $this->CheckboxFilters) && $val) {
                $query .= " AND $field";
            } elseif (strtolower(substr($field, -8)) == 'centerid'
                // special rule for dropdowns where value is numeric
                        || strtolower(substr($field, -10)) == 'categoryid'
                        || strtolower(substr($field, -6)) == 'gender'
                        || (isset($this->EqualityFilters) 
                        && in_array($field, $this->EqualityFilters))
            ) {
                $query .= " AND $field = :v_$prepared_key";
                // $qparams["v_$prepared_key"] = $val;
            } else {
                 $query 
                     .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
                     //$qparams["v_$prepared_key"] = $val;
            }
        }
        return $query; 
    }

    /**
     * Returns a list of candidates, users, etc.
     *
     * @return array
     * @throws PEAR_Error
     * @access private
     */
    function _getList()
    {
        // create DB object
        $DB =& Database::singleton();
        if (Utility::isErrorX($DB)) {
            return PEAR::raiseError(
                "Could not connect to database: ".$DB->getMessage()
            );
        }

        $qparams = array();
        // add the base query
        $query = '';
        $query .= $this->_getBaseQuery();

        $filterdetails = $this->_getBaseFilter();
        $query .= $filterdetails['clause'];
        $qparams = $filterdetails['params'];
        // apply ORDER BY filters
        $query .= " ORDER BY ";
        if (!empty($this->filter['order'])) {
            $query .= $this->filter['order']['field']
                ." ".$this->filter['order']['fieldOrder'].", ";
        }
        $query .= $this->order_by;
        // get the list
        
        $pageNum = 1;
        if(isset($_REQUEST['pageID'])) {
            $pageNum = $_REQUEST['pageID'];
        }





        $this->_getNumberPages($query);

        $config =& NDB_Config::singleton();
        $resultsPerPage = $config->getSetting('rowsPerPage');
        $limit = " LIMIT $resultsPerPage OFFSET " . (($pageNum-1)*$resultsPerPage);
        $result = $DB->pselect($query . $limit, $qparams);
        
        if (Utility::isErrorX($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
        return $result;
    }

    function _getBaseFilter() {
        $qparams = array();
        $WhereClause = '';
        // add filters to query
        if (is_array($this->filter) && count($this->filter) > 0) {
            foreach ($this->filter as $field => $val) {
                $prepared_key = Utility::getCleanString($field);
                $query_piece = $this->_addValidFilters($prepared_key, $field, $val); 
                if (!empty($query_piece)) {
                    $WhereClause .= $query_piece;

                    if (in_array($field, $this->CheckboxFilters)) {
                        continue;
                    }
                    if ($prepared_key != 'pending') {
                        $qparams["v_$prepared_key"] = $val;
                    }
                }
            }
        }
       
         if(is_array($this->searchKey) && count($this->searchKey) > 0 && $this->searchKey['keyword'] !== '') {
            $WhereClause .= " AND (";
            $fields = array();
            foreach ($this->searchKeyword as $field) {
                //  $fields[] =" $field LIKE :v_SearchValue";
                $fields[] =" $field LIKE CONCAT('%', :v_searchkey, '%')"; 
            }
            $WhereClause .= join(" OR ", $fields);

            $qparams['v_searchkey'] = $this->searchKey['keyword'];
            $WhereClause .= ")";

          }
           
        // add GROUP BY if applicable
        if (!empty($this->group_by)) {
            $WhereClause .= " GROUP BY $this->group_by ";
        }
        // add HAVING clause (for restricting aggregates)
        if (!empty($this->having)) {
            // Can't use Database::_implodeWithKeys, because the function
            // puts `` around the fieldname, causing it to treat the
            // aggregate function as a fieldname instead of a function
            $first = true;
            foreach ($this->having as $key => $val) {
                if ($val !== '' and $val != null) {
                    $prepared_key = Utility::getCleanString($key);
                    if ($first == false) {
                        $WhereClause .= ' AND ';
                    } else { 
                        $WhereClause .= ' HAVING ';
                    }
                    $first = false;

                    $WhereClause .= "$key LIKE CONCAT(:v_$prepared_key, '%')";
                    $qparams["v_$prepared_key"] = $val;
                }
            }
        }

        return array('clause' => $WhereClause, 'params' => $qparams);
    }


    function _getNumberPages($query) {
        $wheredetails = $this->_getBaseFilter();
        $query = "SELECT COUNT(*) " . $this->query . $wheredetails['clause'];

        $db = Database::singleton();

        $this->TotalItems = $db->pselectOne($query, $wheredetails['params']);
    }

    /**
     * Sets the template data for the list of candidates, users, etc.
     *
     * @return void
     * @throws PEAR_Error
     * @access private
     */
    function _setDataTable()
    {
        // create instance of config object
        $config =& NDB_Config::singleton();
        // configure the page pagination
            $params = array(
            'mode'       => 'Sliding',
                'perPage'    => $config->getSetting('rowsPerPage'),
                'delta'      => 3,
                'totalItems' => $this->TotalItems
            );
        $pager = Pager::factory($params);
        $links = $pager->getLinks();
        $this->tpl_data['page_links'] = $links['all'];

        // print out column headings
        $i = 0;
        foreach ($this->headers as $header) {
            $this->tpl_data['headers'][$i]['name'] = $header;
            // format header
            $this->tpl_data['headers'][$i]['displayName'] 
                = ucwords(str_replace('_', ' ', $header));
            // set field ordering
            if (isset($this->filter['order'])) {
                $this->tpl_data['headers'][$i]['fieldOrder'] 
                    = ($this->filter['order']['fieldOrder'] 
                        == 'ASC') ? 'DESC' : 'ASC';
            }
            $i++;
        }

        // get the template data for the table rows
        if (is_array($this->list) && !empty($this->list)) {
            // print out data rows
            $count = $pager->getOffsetByPageId();
            $success = $this->_setDataTableRows($count[0]);
            if (Utility::isErrorX($success)) {
                return PEAR::raiseError(
                    "NDB_Filter::_setDataTable(): ".$success->getMessage()
                );
            }
        }
    }


    /**
     * Sets the template data for the data table's rows
     *
     * @param int $count Page offset
     *     
     * @note             Can be overloaded
     *
     * @return void
     * @access private
     */
    function _setDataTableRows($count)
    {
        // print out
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                $this->tpl_data['items'][$x][$i]['name'] = $key;
                $this->tpl_data['items'][$x][$i]['value'] = $val;
                $i++;
            }
            $x++;
        }

        return true;
    }

    /**
     * Displays the menu page
     *
     * @return void
     * @access public
     */
    function display()
    {
        // dump the html for the menu
        $smarty = new Smarty_neurodb($this->menu);
        $renderer = new HTML_QuickForm_Renderer_ArraySmarty($smarty);
        $this->form->accept($renderer);
        $smarty->assign('mode', $this->mode);
        $smarty->assign('form', $renderer->toArray());
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("menu_$this->menu.tpl");
        return $html;
    }
}
?>
