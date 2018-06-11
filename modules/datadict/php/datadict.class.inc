<?php
/**
 * Datadict module
 *
 * PHP version 5
 *
 * @category Datadict
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */
namespace LORIS\datadict;
/**
 * Datadict module
 *
 * PHP version 5
 *
 * @category Datadict
 * @package  Main
 * @author   Ted Strauss <ted.strauss@mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris-Trunk
 */

class Datadict extends \NDB_Menu_Filter
{
    var $AjaxModule = true;
    /**
     * Overloading this method to allow access to site users (their own site
     * only) and users w/ multisite privs
     *
     * @note   overloaded function
     * @return bool
     * @access private
     */
    function _hasAccess()
    {
        // create user object
        $user =& \User::singleton();

        return ($user->hasPermission('data_dict_view') ||
            $user->hasPermission('data_dict_edit'));
    }
    /**
     * Setup variables function
     *
     * @note   Setup variables function
     * @return bool
     * @access private
     */
    function _setupVariables()
    {
        // set the class variables
        $this->columns = array(
                          'pt.sourceFrom',
                          'pt.Name',
                          'pt.sourceField',
                          'coalesce(pto.description,pt.description)'.
                          ' as description',
                         );

        $this->validFilters = array(
                               'pt.sourceFrom',
                               'pt.Description',
                              );
        $this->query        = ' FROM parameter_type pt LEFT JOIN 
                                parameter_type_override pto USING (Name)
                 		        WHERE pt.Queryable=1';

        $this->formToFilter = array(
                               'sourceFrom'  => 'pt.sourceFrom',
                               'Description' => 'pt.Description',
                              );

        $this->searchKeyword = array(
                                'pt.Name',
                                'pt.sourceField',
                                'coalesce(pto.description,pt.description)',
                               );
        return true;
    }

    /**
     * Set Filter Form
     *
     * @return none
     */
    function setup()
    {
        parent::setup();

        // list of feedback statuses
        $instruments = \Utility::getAllInstruments();
        $instruments = array_merge(
            array('' => 'All Instruments'),
            $instruments
        );
        $this->addSelect('sourceFrom', 'Instruments', $instruments);
        $this->addSelect(
            'Description',
            'Description',
            array(
             ''           => 'All',
             'empty'      => 'Empty',
             'modified'   => 'Modified',
             'unmodified' => 'Unmodified',
            )
        );
        $this->addBasicText('keyword', 'Search keyword');

        return true;
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
            $key      = $_REQUEST['keyword'];
            $keyword  = null;
            $keywords = null;
            if (preg_match_all(
                '/\".[^"]+\"|[^"]+/m',
                $key,
                $keywords
            )
            ) {
                // Any Quoted keyword.
                $keywords = array_filter(
                    array_map(
                        function ($item) {
                            return trim($item, ' ');
                        },
                        $keywords[0]
                    )
                );
            }
            if (is_array($keywords)) {
                // Quoted keyword(s) exist.
                $keywords_extra = array();
                foreach ($keywords as &$keyword) {
                    if (preg_match('/\"[^"]+\"/m', $keyword)) {
                        // Handle the quoted keyword.
                        $keyword = str_replace('"', "", $keyword);
                    } else {
                        // Handle multiple keywords.
                        $split_keywords = explode(' ', $keyword);
                        foreach ($split_keywords as &$split_keyword) {
                            $split_keyword = '.*'.$split_keyword;
                        }
                        $keyword = null;
                        unset($split_keyword);
                        $keywords_extra = array_merge(
                            $keywords_extra,
                            $split_keywords
                        );
                    }
                }
                $keywords = array_filter($keywords);
                $keywords = is_array($keywords)
                    ? array_merge($keywords, $keywords_extra)
                    : array_merge([$keyword], $keywords_extra);
            } else if (preg_match('/\\s/', $key)
            ) {
                // Multiple keyword search.
                $keywords = explode(' ', $key);
                foreach ($keywords as &$k) {
                    $k = '.*'.$k;
                }
                unset($k);
            } else {
                $keywords = $key;
            }
            $key = $keywords;
            $_SESSION['State']->setProperty('keyword', $keywords);
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
     * Add query filters
     *
     * @param string $prepared_key the query string
     * @param string $key          the key of filter
     * @param string $val          the value of filter
     *
     * @note   Get base query
     * @return string
     * @access private
     */
    function _addValidFilters($prepared_key, $key, $val)
    {
        $query = '';
        if ((!empty($val) || $val === '0') && $key != 'order') {

            // special rule for dropdowns where value is numeric
            if (strtolower(substr($key, -8)) == 'centerid'
                || strtolower(substr($key, -10)) == 'categoryid'
                || strtolower(substr($key, -6)) == 'gender'
            ) {
                $query .= ' AND ' . $key . ' = \'' . $val . '\' ';
            } else {
                if ($val == 'empty') {
                    $query .= ' AND COALESCE(pto.description,pt.description) = \'\'';
                } elseif ($val=='modified') {
                    $query .= ' AND pto.name IS NOT NULL';
                } elseif ($val=='unmodified') {
                    $query .= ' AND pto.name IS NULL';
                } else {
                    $query .= ' AND '.$key.' LIKE \'' . $val . '%\' ';
                }
            }
        }
        return $query;

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
                        $qparams['v_'.$prepared_key] = $val;
                    }
                }
            }
        }

        if (isset($this->searchKeyword)
            && is_array($this->searchKeyword)
            && count($this->searchKeyword) > 0
            && !empty($this->searchKey['keyword'])
        ) {
            $WhereClause .= ' AND (';
            $fields       = array();

            $qparams['v_searchkey'] = $this->searchKey['keyword'];

            foreach ($this->searchKeyword as $field) {
                foreach ($qparams['v_searchkey'] as $i => $value) {
                    if (isset($qparams['v_searchkey'])
                        && is_array(($qparams['v_searchkey']))
                    ) {
                        if (strpos($qparams['v_searchkey'][$i], '.*') !== false) {
                            $fields[] = ' ' . $field . ' REGEXP :v_searchkey_' .$i;
                        } else {
                            $fields[] = ' ' . $field . ' = :v_searchkey_' . $i;
                        }
                    } else {
                        $fields[] = ' ' . $field
                            . ' LIKE CONCAT(\'%\', :v_searchkey_' . $i . ', \'%\')';
                    }
                }
            }
            $WhereClause .= join(' OR ', $fields);
            $WhereClause .= ')';

        }

        // add GROUP BY if applicable
        if (!empty($this->group_by)) {
            $WhereClause .= ' GROUP BY ' . $this->group_by;
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

                    if (isset($qparams['v_searchkey'])
                        && is_array(($qparams['v_searchkey']))
                    ) {
                        // Multiple keyword search
                        $WhereClause .= $key . ' REGEXP :v_' . $prepared_key;
                    } else {
                        // Single keyword search
                        $WhereClause .= $key
                            . ' LIKE CONCAT(:v_' . $prepared_key . ', \'%\')';
                    }
                    $qparams['v_'.$prepared_key] = $val;
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
        $db           = \Database::singleton();
        if (empty($this->group_by) && empty($this->having)) {
            $query = 'SELECT COUNT(*)' . $this->query . $wheredetails['clause'];
        } else {
            $query = 'SELECT COUNT(*) FROM ('.$query.') as tmptable';
        }
        $params =  $wheredetails['params'];
        if (isset($params['v_searchkey'])
            && is_array(($params['v_searchkey']))
        ) {
            // Multiple keyword search
            if (count($params['v_searchkey']) > 0) {
                $params_searchkeys = array();
                foreach ($params['v_searchkey'] as $i => $value) {
                    $params_searchkeys['v_searchkey_'.$i] = $value;
                }
            }
            if (isset($params_searchkeys)) {
                $params = $params_searchkeys;
            } else {
                $params = array('v_searchkey' => $params['v_searchkey']);
            }

            $this->TotalItems = $db->pselectOne($query, $params);
        } else {
            // Single keyword search
            $this->TotalItems = $db->pselectOne($query, $wheredetails['params']);
        }
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
        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();

        $qparams = array();
        // add the base query
        $query  = '';
        $query .= $this->_getBaseQuery();

        $filterdetails = $this->_getBaseFilter();
        $query        .= $filterdetails['clause'];
        $qparams       = $filterdetails['params'];
        // apply ORDER BY filters
        $query .= ' ORDER BY ';
        if (!empty($this->filter['order'])) {
            $query .= $this->filter['order']['field']
                .' '.$this->filter['order']['fieldOrder'].', ';
        }
        $query .= $this->order_by;

        if (!empty($this->limit)) {
            $query .= ' LIMIT '.$this->limit;
        }

        // get the list
        $this->_getNumberPages($query);

        if (isset($qparams['v_searchkey'])
            && is_array(($qparams['v_searchkey']))
        ) {
            // Multiple keyword search
            if (count($qparams['v_searchkey']) > 0) {
                $params_searchkeys = array();
                foreach ($qparams['v_searchkey'] as $i => $value) {
                    $params_searchkeys['v_searchkey_'.$i] = $value;
                }
            }
            if (isset($params_searchkeys)) {
                $params = $params_searchkeys;
            } else {
                $params = array('v_searchkey' => $qparams['v_searchkey']);
            }
            $result = $DB->pselect($query, $params);
        } else {
            // Single keyword search
            $result = $DB->pselect($query, $qparams);
        }

        return $result;
    }

    /**
     * Include the column formatter required to make the content editable in
     * the datadict menu
     *
     * @return array of javascript to be inserted
     **/
    function getJSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . '/datadict/js/columnFormatter.js',
             $baseURL . '/datadict/js/datadict_helper.js',
            )
        );
    }


}
?>
