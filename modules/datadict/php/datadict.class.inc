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
        $this->query        = " FROM parameter_type pt LEFT JOIN 
                                parameter_type_override pto USING (Name)
                 		WHERE pt.Queryable=1";

        $this->formToFilter = array(
                               'sourceFrom'  => 'pt.sourceFrom',
                               'Description' => 'pt.Description',
                              );

        $this->searchKeyword = array(
                                'pt.Name',
                                'pt.sourceField',
                                'pto.description',
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
                $query .= " AND $key = '$val' ";
            } else {
                if ($val == 'empty') {
                    $query .= " AND COALESCE(pto.description,pt.description) = ''";
                } elseif ($val=='modified') {
                    $query .= " AND pto.name IS NOT NULL";
                } elseif ($val=='unmodified') {
                    $query .= " AND pto.name IS NULL";
                } else {
                    $query .= " AND $key LIKE '$val%' ";
                }
            }
        }
        return $query;

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
             $baseURL . "/datadict/js/columnFormatter.js",
             $baseURL . "/datadict/js/datadict_helper.js",
            )
        );
    }


}
?>
