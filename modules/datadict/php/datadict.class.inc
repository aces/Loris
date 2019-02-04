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
    var $AjaxModule   = true;
    var $skipTemplate = true;

    /**
    * Overloading this method to allow access to site users (their own site
    * only) and users w/ multisite privs
    *
    * @param \User $user The user whose access is being checked
    *
    * @return bool
    */
    function _hasAccess(\User $user) : bool
    {
        return ($user->hasPermission('data_dict_view') ||
                $user->hasPermission('data_dict_edit'));
    }

    /**
    * Setup variables function
    *
    * @note   Setup variables function
    * @return string
    */
    function _buildQuery(): string
    {
        $select = " SELECT DISTINCT
         pt.sourceFrom as source_from,
         pt.name as name,
         pt.sourceField as source_field,
         coalesce(pto.description,pt.description) as description,
         CASE
           WHEN COALESCE(pto.description,pt.description) = '' THEN 'Empty'
           WHEN pto.name IS NOT NULL THEN 'Modified'
           WHEN pto.name IS NULL THEN 'Unchanged'
         END as description_status ";

        $joins = " FROM parameter_type pt
        LEFT JOIN parameter_type_override pto USING (Name)
        WHERE pt.Queryable=1 ";
        $query = $select . $joins;
        return $query;
    }

    /**
     * Setup variables function
     *
     * @return void
     */
    function _setupVariables()
    {
        $query       = $this->_buildQuery();
        $this->query = " FROM (" . $query . ") as tmp";

        $this->formToFilter = array(
                               'sourceFrom'  => 'pt.sourceFrom',
                               'description' => 'pt.Description',
                              );

        $this->searchKeyword = array(
                                'pt.Name',
                                'pt.sourceField',
                                'pto.description',
                               );
        // set the class variables

        $this->columns = array(
                          'source_from',
                          'name',
                          'source_field',
                          'description',
                          'description_status',
                         );

        $this->headers = array(
                          'Source From',
                          'Name',
                          'Source Field',
                          'Description',
                          'Description Status',
                         );
    }

    /**
    * Set Filter Form
    *
    * @return void
    */
    function setup()
    {
        parent::setup();

        // list of feedback statuses
        $instruments = \Utility::getAllInstruments();
        $this->addSelect(
            'sourceFrom',
            'Instruments',
            $instruments,
            array('multiple')
        );
        $this->addSelect(
            'descriptionStatus',
            'Description Status',
            array(
             'empty'     => 'Empty',
             'modified'  => 'Modified',
             'unchanged' => 'Unchanged',
            )
        );
        $this->addBasicText('keyword', "Search keyword");
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
                || strtolower(substr($key, -6)) == 'sex'
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
     * Converts the results of this menu filter to a JSON format to be retrieved
     * with ?format=json
     *
     * @return string a json encoded string of the headers and data from this table
     */
    function toJSON() : string
    {
        $result         = $this->toArray();
        $result['form'] = $this->form->form;
        return json_encode($result);
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
             $baseURL . "/datadict/js/dataDictIndex.js",
            )
        );
    }

    /**
     * Generate a breadcrumb trail for this page.
     *
     * @return \LORIS\BreadcrumbTrail
     */
    public function getBreadcrumbs(): \LORIS\BreadcrumbTrail
    {
        return new \LORIS\BreadcrumbTrail(
            new \LORIS\Breadcrumb('Data Dictionary', "/$this->name")
        );
    }
}
