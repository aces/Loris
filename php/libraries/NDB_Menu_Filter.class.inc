<?php
/**
 * This class features the code for the Menu Filter.
 *
 * PHP Version 5
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Menu class, with filtering
 *
 * Used in the likes of access profile, user accounts, certification, etc.
 *
 * @category Behavioural
 * @package  Main
 * @author   Loris team <info-loris.mni@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Menu_Filter extends NDB_Menu
{
    var $AjaxModule = false;
    var $TotalItems;
    /**
     * The columns to SELECT
     *
     * @var    array
     * @access private
     */
    var $columns;

    /**
     * The base select query, starts at FROM
     *
     * @var    string
     * @access private
     */
    var $query;

    /**
     * The default GROUP BY column
     *
     * @var    string
     * @access private
     */
    var $group_by;

    /**
     * The default ORDER BY column
     *
     * @var    string
     * @access private
     */
    var $order_by = '1';

    /**
     * Items selected from the GUI selection form
     *
     * @var    array
     * @access private
     */
    var $filter;

    /**
     * An array of all valid filters to use
     *
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
     *
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
     *
     * @var    array
     * @access private
     */
    var $list;

    /**
     * List of filters which are checkboxes so that
     * it can be determined if it was checked or not.
     * (Note that HTTP sends nothing if a checkbox is
     * unchecked.)
     */
    var $CheckboxFilters = array();

    /**
     * A list of fields which are to be searched if the
     * search keyword is used.
     */
    var $searchKey = array();

    /**
     * Calls other member functions to do all the work necessary to create the menu
     *
     * @return void
     * @access public
     */
    function setup()
    {
        // setup the menu's variables
        $success = $this->_setupVariables();

        // set the headers if necessary
        if (!is_array($this->headers) || count($this->headers) == 0) {
            foreach ($this->columns as $value) {
                preg_match('/[0-9A-Za-z_]+$/', $value, $match);
                $this->headers[] = $match[0];
            }
        }

        // start the filter form
        $this->_setupPage($this->menu, null, null, null, 'filter');
        $this->registerDefaultFilter();

        // $this->form = new HTML_QuickForm('filter');

        // set the filters
        $this->_setupFilters();

        // build the menu
        $success = $this->_build();

        return true;
    }

    /**
     * By default, trim all fields on the form before any processing/validation
     * is done. Derived classes can override this behavior if needed.
     *
     * @return void
     * @access public
     */
    function registerDefaultFilter()
    {
        $this->form->applyFilter('__ALL__', 'trim');
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
     * This method will reset any saved filters that are associated with
     * the session back to its default state.
     *
     * @return none
     */
    function _resetFilters()
    {
        $_SESSION['State']->setProperty('filter', null);
        $_SESSION['State']->setProperty('keyword', null);
    }

    /**
     * This will populate the $this->filter and $this->having attributes
     * with the proper values based on the parameter based, so that the
     * query for this NDB_Menu_Filter can be constructed. It will go through
     * each formToFilter variable and ensure that only validFilters are
     * set.
     *
     * @param array $values An array of the form
     *                             [FormFieldName => Value,
     *                             FormFieldName2 => Value2,
     *                             ...
     *                             ]
     *                      to retrieve the values from.
     *
     * @return An array of filters in the same form as the $values parameter
     *         that can be saved for future use.
     */
    function _setFilters($values)
    {
        $filters = $this->formToFilter;

        $newFormFilters = array();

        // Go through the form's fields and set the valid ones.
        foreach ($this->formToFilter as $formKey => $dbField) {
            if (isset($values[$formKey])) {
                // Call to form->getValue will apply all the form filters that
                // will modify the submitted data
                $filteredValue = $values[$formKey];
                if ($filteredValue !== '') {
                    if (in_array($dbField, $this->validFilters)) {
                        $newFormFilters[$dbField] = $filteredValue;

                        if (in_array($dbField, $this->validHavingFilters)) {
                            $this->having[$dbField] = $filteredValue;
                        } else {
                            $this->filter[$dbField] = $filteredValue;
                        }
                    }
                }
            }
        }

        return $values;
    }

    /**
     * Set the sort column for the current query page and saves
     * it into the current filter.
     *
     * @param array $order An array of the form
     *                      [
     *                          'field' => Form Field Name
     *                          'fieldOrder' => "ASC|DESC"
     *                      ]
     *
     * @return none, modifies both $_SESSION and $this->filter as
     *         a side-effect.
     */
    function _setFilterSortOrder($order)
    {
        // Get the existing filter. It's already been saved into
        // the session previously in $this->_setupFilters.
        $savedFilters = $_SESSION['State']->getProperty('filter');
        if (!is_array($savedFilters)) {
            $savedFilters = array();
        }
        if (is_array($order) && in_array($order['field'], $this->headers)) {
            $savedFilters['order'] = $order;
            $this->filter['order'] = $order;
        }

        $_SESSION['State']->setProperty('filter', $savedFilters);
    }

    /**
     * Sets the class variables required for a search key to be used.
     * A search key is like a filter that searches through multiple
     * columns.
     *
     * @param string $keyword The keyword to search through columns for.
     *
     * @return none, but side-effect modifies $this->searchKey
     */
    function _setSearchKeyword($keyword)
    {
        $this->searchKey = array('keyword' => $keyword);
    }

    /**
     * Builds the filter array to be used in this filter menu. The end result
     * should be that all the NDB_Menu_Filter attributes required for the query
     * to work are set up.
     *
     * Generally, it does the following:
     *   1. Reset filters (if applicable)
     *   2. Set up the (new) filters
     *   3. Set up the search keyword
     *   4. Set the search order (if applicable)
     *
     * The end result should be that $this->filter and $this->having are setup
     * properly so that the query can be constructed by $this->_getList()
     *
     * @return none
     */
    function _setupFilters()
    {
        // 1. Reset filters
        if (isset($_REQUEST['reset'])) {
            // erase filter data from the session
            $this->_resetFilters(true);
        }

        // 2. After resetting filters (if applicable), set the new
        // filters using the appropriate method.
        if ($_SERVER['REQUEST_METHOD'] === 'GET'
            || ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['filter']))
        ) {
            // If it's a GET request (ie just reloading the page with
            // previous filters or clicking on a sort column, use
            // the filters that were saved into the session.
            // OR a post request with no new defined filters (ie a second
            // form on the page)
            $savedFilters = $_SESSION['State']->getProperty('filter');
            $this->_setFilters($savedFilters);

            // Also set the form defaults based on the saved query, so that
            // the filters values remain populated correctly in the front-end,
            // not just in the query..
            $defaults = $this->_getDefaults();
            if (is_array($savedFilters)) {
                $this->_setDefaults(array_merge($defaults, $savedFilters));
            } else {
                $this->_setDefaults($defaults);
            }
        } else if ($_SERVER['REQUEST_METHOD'] === 'POST'
            && isset($_POST['filter'])
        ) {
            // If it's a POST, set the filters based on the
            // request and save them into the session so that future
            // GET requests have access to them.
            $newFilters = $this->_setFilters($_POST);
            if (!empty($newFilters)) {
                $_SESSION['State']->setProperty('filter', $newFilters);
            }
        }

        // 3. Set the search keyword (if applicable)
        $key = null;
        if (isset($_REQUEST['keyword'])) {
            // It was included in the request, so save it.
            $key = $_REQUEST['keyword'];
            $_SESSION['State']->setProperty('keyword', $key);
        } else {
            // It was not included, so get the keyword from the session
            $key = $_SESSION['State']->getProperty('keyword');
        }

        // Set the keyword after getting it from the appropriate place
        if (!empty($key)) {
            $this->_setSearchKeyword($key);

        }

        // 4. If the user clicked on a sort column, set the order.
        //    It's likely a GET request even though it modifies the data,
        //    so just use $_REQUEST.
        if (isset($_REQUEST['filter']['order'])) {
            $this->_setFilterSortOrder($_REQUEST['filter']['order']);
        }
    }

    /**
     * Contructs the menu
     *
     * @return void
     * @access private
     */
    function _build()
    {
        // show selection form table
        $success = $this->_setFilterForm();

        if ($this->AjaxModule) {
            return;
        }
        // get the list
        $this->list = $this->_getList();

        // show data table with user information and access URLs
        $success = $this->_setDataTable();
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
     * @access private
     */
    function _getList()
    {
        // create DB object
        $DB =& Database::singleton();

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
        // get the list

        $pageNum = 1;
        if (isset($_REQUEST['pageID'])) {
            $pageNum = $_REQUEST['pageID'];
        }

        $this->_getNumberPages($query);

        $config         =& NDB_Config::singleton();
        $resultsPerPage = $config->getSetting('rowsPerPage');
        $limit          = " LIMIT $resultsPerPage"
                          ." OFFSET " . (($pageNum-1)*$resultsPerPage);
        $result         = $DB->pselect($query . $limit, $qparams);

        return $result;
    }

    /**
     * Constructs the base filter (WHERE clause) to use for this
     * menu.
     *
     * @return array contains a 'clause' key which contains the text
     *               for the SQL query and 'params' which contains the
     *               parameters to use bind for a prepared query.
     */
    function _getBaseFilter()
    {
        $qparams     = array();
        $WhereClause = '';
        // add filters to query
        if (is_array($this->filter) && count($this->filter) > 0) {
            foreach ($this->filter as $field => $val) {
                $prepared_key = Utility::getCleanString($field);
                $query_piece  = $this->_addValidFilters($prepared_key, $field, $val);
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

        if (isset($this->searchKeyword)
            && is_array($this->searchKeyword)
            && count($this->searchKeyword) > 0
            && !empty($this->searchKey['keyword'])
        ) {
            $WhereClause .= " AND (";
            $fields       = array();
            foreach ($this->searchKeyword as $field) {
                $fields[] = " $field LIKE CONCAT('%', :v_searchkey, '%')";
            }
            $WhereClause .= join(" OR ", $fields);

            $qparams['v_searchkey'] = $this->searchKey['keyword'];
            $WhereClause           .= ")";

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

        return array(
                'clause' => $WhereClause,
                'params' => $qparams,
               );
    }


    /**
     * Returns the number of pages that this menu has.
     *
     * @param string $query The query used to build the data in the table.
     *
     * @return integer The number of pages that the query returns
     */
    function _getNumberPages($query)
    {
        $wheredetails = $this->_getBaseFilter();
        $db           = Database::singleton();
        if (empty($this->group_by)) {
            $query = "SELECT COUNT(*)" . $this->query . $wheredetails['clause'];
        } else if (!empty($this->group_by)) {
            $query = "SELECT COUNT(*) FROM ($query) as tmptable";

        }
        $this->TotalItems = $db->pselectOne($query, $wheredetails['params']);

    }

    /**
     * Sets the template data for the list of candidates, users, etc.
     *
     * @return void
     * @access private
     */
    function _setDataTable()
    {
        // create instance of config object
        $config =& NDB_Config::singleton();
        // configure the page pagination
        $rowsPerPage = $config->getSetting('rowsPerPage');

        $pageID = isset($_GET['pageID']) ? $_GET['pageID'] : 1;

        $this->tpl_data['rowsPerPage']      = $rowsPerPage;
        $this->tpl_data['pageID']           = $pageID;
        $this->tpl_data['filterfield']      = $_GET['filter'][order][field];
        $this->tpl_data['filterfieldOrder'] = $_GET['filter'][order][fieldOrder];

        $this->tpl_data['TotalItems'] = $this->TotalItems;
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
                    == 'DESC') ? 'ASC' : 'DESC';
            }
            $i++;
        }

        // get the template data for the table rows
        if (is_array($this->list) && !empty($this->list)) {
            // print out data rows
            $this->_setDataTableRows($rowsPerPage*($pageID-1)+1);
        }
    }


    /**
     * Sets the template data for the data table's rows
     *
     * @param int $count Page offset
     *
     * @note Can be overloaded
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
                $this->tpl_data['items'][$x][$i]['name']  = $key;
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
        // Set the csvFile links
        $uri    = ltrim($_SERVER['REQUEST_URI'], "/");
        $suffix = strpos($uri, '?') ? '&format=csv' : '?&format=csv';
        $this->tpl_data['csvUrl']  = $uri . $suffix;
        $this->tpl_data['csvFile'] = $_REQUEST['test_name'];
        if (isset($_REQUEST['subtest'])) {
            $this->tpl_data['csvFile'] .= '-' . $_REQUEST['subtest'];
        } elseif (isset($_REQUEST['submenu'])) {
            $this->tpl_data['csvFile'] .= '-' . $_REQUEST['submenu'];
        }
        $this->tpl_data['csvFile'] .= date('-Y_m_d');

        // dump the html for the menu
        $smarty = new Smarty_neurodb($this->Module);
        $smarty->assign('mode', $this->mode);
        $smarty->assign('form', $this->form->toArray());
        $smarty->assign($this->tpl_data);
        $html = $smarty->fetch("menu_$this->menu.tpl");
        return $html;
    }

    /**
     * Controls access to a module's SQL tables, transforming the table into a csv
     * string. This script should ensure that only files relative to module's path
     * specified are accessible.
     *
     * @return string  csv formated string
     */
    function getCSVData()
    {
        $list['data']    = $this->_getFullList();
        $list['headers'] = $this->headers;

        return Utility::arrayToCSV($list);
    }

    /**
     * Converts this menu filter to an array of the form
     *
     * Headers => (string array)
     * Data => (array of arrays of row data)
     *
     * Suitable for serializing to JSON, CSV, etc..
     *
     * @return associative array
     */
    function toArray()
    {
        $data = $this->_getFullList();

        $headers = array_map(
            function ($header) {
                return ucwords(str_replace('_', ' ', $header));
            },
            $this->headers
        );

        $MappedData = array();
        foreach ($data as $row) {
            $MappedData[] = array_values($row);
        }

        return array(
                'Headers' => $headers,
                'Data'    => $MappedData,
               );
    }

    /**
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return a json encoded string of the headers and data from this table
     */
    function toJSON()
    {
        return json_encode($this->toArray());
    }
    /**
     * Returns the full list of candidates, users, etc.
     *
     * @return array
     * @access private
     */
    function _getFullList()
    {
        // create DB object
        $factory = NDB_Factory::singleton();
        $DB      = $factory->database();

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
        // get the list

        $this->_getNumberPages($query);

        $config         =& NDB_Config::singleton();
        $resultsPerPage = $config->getSetting('rowsPerPage');
        $result         = $DB->pselect($query, $qparams);

        return $result;
    }

    /**
     * Returns an array of filters that are currently set for this
     * menu filter
     *
     * @return array of filters that are set
     */
    function _getFilterValues()
    {
        $FilterValues = array();
        foreach ($this->formToFilter as $formName => $field) {
            if (isset($_REQUEST[$formName])) {
                $FilterValues[$formName] = $_REQUEST[$formName];
            } else {
                $FilterValues[$formName] = null;
            }
        }
        return $FilterValues;
    }

    /**
     * Adds React table related dependencies to menu filters, since forms don't
     * usually have tables or pagination
     *
     * @return array of javascript files to be sourced
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $depends = parent::getJSDependencies();
        $baseURL = $factory->settings()->getBaseURL();
        return array_merge(
            $depends,
            array(
             $baseURL . '/js/components/PaginationLinks.js',
             $baseURL . '/js/components/FilterTable.js',
             $baseURL . '/js/components/StaticDataTable.js',
             $baseURL . '/js/components/DynamicDataTable.js',
            )
        );
    }
}
?>
