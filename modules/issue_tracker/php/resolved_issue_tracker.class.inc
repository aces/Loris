<?php

/**
 * This class features the code for the menu portion of the Loris issue
 * tracker.
 *
 * PHP Version 5
 *
 * @category   Loris
 * @package    Main
 * @subpackage Tools
 * @author     Caitrin Armstrong <caitrin.armstrong@mail.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
namespace LORIS\issue_tracker;

/**
 * Provides the PHP code for the menu filter for the issue tracker
 *
 * @category   Loris
 * @package    Main
 * @subpackage Tools
 * @author     Caitrin Armstrong <caitrin.armstrong@mail.mcgill.ca>
 * @license    http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class Resolved_Issue_Tracker extends \NDB_Menu_Filter
{
    //aka building-table-using-react
    var $AjaxModule = true;

    /**
     * Set up the variables required by NDB_Menu_Filter class for constructing
     * a query
     *
     * @return null
     */
    function _setupVariables()
    {
        $user =& \User::singleton();
        $db   = \Database::singleton();

        $this->query = " FROM issues as i " .
            "LEFT JOIN candidate c ON (i.candID=c.CandID) " .
            "LEFT JOIN psc p ON (i.centerID=p.CenterID) " .
            "LEFT JOIN LorisMenu l on (i.module=l.ID) " .
            "LEFT JOIN session s ON (i.sessionID = s.ID) " .
            "LEFT JOIN issues_watching w ON (i.issueID = w.issueID) " .
            "LEFT JOIN issues_comments ic ON(i.issueID = ic.issueID) ".
            "WHERE i.status = 'closed'";

        if (!$user->hasPermission('access_all_profiles')) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND i.CenterID IN (" . $site_arr . ")";
        }

        //note that this needs to be in the same order as the headers array
        $this->columns = array(
                          'i.issueID as Issue_ID',
                          'i.title as Title',
                          'l.Label as Module',
                          'i.category as Category',
                          'i.reporter as Reporter',
                          'i.assignee as Assignee',
                          'i.status as Status',
                          'i.priority as Priority',
                          'p.Name as Site',
                          'c.PSCID as PSCID',
                          's.Visit_label as Visit_Label',
                          'i.lastUpdate as Last_Update',
                          's.ID as SessionID',
                          'c.CandID as CandID',
                         );

        $this->order_by = 'i.issueID DESC';
        $this->group_by = 'i.issueID';

        //NDB filter will remove underscores
        $this->headers = array(
                          'Issue_ID',
                          'Title',
                          'Module',
                          'Category',
                          'Reporter',
                          'Assignee',
                          'Status',
                          'Priority',
                          'Site',
                          'PSCID',
                          'Visit_Label',
                          'Last_Update',
                          'SessionID',
                          'CandID',
                         );
        $this->tpl_data['hiddenHeaders'] = json_encode(
            [
             'SessionID',
             'CandID',
            ]
        );

        $this->validFilters = array(
                               'i.issueID',
                               'l.Label',
                               'i.category',
                               'c.PSCID',
                               's.Visit_label',
                               'i.reporter',
                               'i.assignee',
                               'i.centerID',
                               'w.userID',
                               'i.projectID',
                               'i.priority',
                               'keyword',
                               'minDate',
                               'maxDate',
                              );

        $this->formToFilter = array(
                               'issueID'                => 'i.issueID',
                               'category'               => 'i.category',
                               'module'                 => 'l.Label',
                               'PSCID'                  => 'c.PSCID',
                               'visitLabel'             => 's.Visit_label',
                               'reporter'               => 'i.reporter',
                               'assignee'               => 'i.assignee',
                               'site'                   => 'i.centerID',
                               'watching'               => 'w.userID',
                               'projectID'              => 'i.projectID',
                               'priority'               => 'i.priority',
                               'keyword'                => 'ic.issueComment',
                               'minDate'                => 'minDate',
                               'maxDate'                => 'maxDate',
                               $user->getData('UserID') => 'watching',
                              );

        $this->EqualityFilters = array(
                                  'i.issueID',
                                  'i.centerID',
                                 );
        $this->searchKeyword   = array(
                                  'ic.issueComment',
                                  'i.title',
                                 );
    }

    /**
     * Overwrites the function to add a customized filter
     * for watching and include closed
     *
     * @param string $prepared_key filter key
     * @param string $field        filter field
     * @param string $val          filter value
     *
     * @return null
     */
    function _addValidFilters($prepared_key, $field, $val)
    {
        $user  =& \User::singleton();
        $query = '';
        if ((!empty($val) || $val === '0') && $field != 'order') {
            if (($field != 'w.userID')
                && ($field != 'minDate')
                && ($field != 'maxDate')
            ) {
                if (in_array($field, $this->CheckboxFilters) && $val) {
                    $query .= " AND $field";
                } elseif (isset($this->EqualityFilters)
                    && in_array($field, $this->EqualityFilters)
                ) {
                    $query .= " AND $field = :v_$prepared_key";
                } else {
                    $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%')";
                }
            } else if ($field = "w.userID" && ($val == 1)) {
                $query .= " AND w.userID = :v_$prepared_key";
            } else if ($field == "w.userID" && ($val == 0)) {
                    $query .= " AND w.userID <> :v_$prepared_key";
            } else if ($field === 'minDate') {
                $query .= " AND i.dateCreated > " . ":v_$prepared_key";
            } else if ($field === "maxDate") {
                $query .= " AND i.dateCreated < " . ":v_$prepared_key";
            }
        }
        return $query;
    }


    /**
     * Converts this menu filter to an array of the form
     *
     * Headers => (string array)
     * Data => (array of arrays of row data)
     *
     * @note overloaded function
     *         Overloading this method to create a list of sessionID that
     *         will be used for the Navigation Links in  the viewSession
     *         page.
     *
     * @return associative array
     */
    function toArray()
    {
        $data  = parent::toArray();
        $index = array_search('Issue ID', $data['Headers']);
        if ($index !== false) {
            $_SESSION['State']->setProperty(
                'issuesListed',
                array_column($data['Data'], $index)
            );
        }
        return $data;
    }


    /**
     * Utility function to re-organize query results for selects.
     * Key and value are equal.
     *
     * @param array  $queryResult query result
     * @param string $key         key needed to extract appropriate result column
     *
     * @return array
     */
    function reorganizeQueryResults($queryResult, $key)
    {
        $result = array('' => "All");
        foreach ($queryResult as $r_row) {
            $resultValue = $r_row[$key];
            if ($resultValue) {
                $result[$resultValue] = $resultValue;
            }
        }
        return $result;
    }
}
