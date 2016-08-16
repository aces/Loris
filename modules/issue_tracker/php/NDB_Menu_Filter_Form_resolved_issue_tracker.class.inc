<?php

/**
 * This class features the code for the menu portion of the Loris issue
 * tracker.
 *
 * PHP Version 5
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Caitrin Armstrong <caitrin.armstrong@mail.mcgill.ca
 * @license    @GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */

/**
 * Provides the PHP code for the menu filter for the issue tracker
 *
 * @category   Behavioural
 * @package    Main
 * @subpackage Tools
 * @author     Caitrin Armstrong <caitrin.armstrong@mail.mcgill.ca>
 * @license    @GPLv3
 * @link       https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Menu_Filter_Form_Resolved_Issue_Tracker extends NDB_Menu_Filter_Form
{
    //aka building-table-using-react module
    var $AjaxModule = true;


    /**
     * Set up the variables required by NDB_Menu_Filter class for constructing
     * a query
     *
     * @return null
     */
    function _setupVariables()
    {

        $this->query = " FROM issues as i LEFT JOIN candidate c ON (i.candID=c.CandID) LEFT JOIN psc p ON (i.centerID=p.CenterID) LEFT JOIN LorisMenu l on (i.module=l.ID) WHERE i.status = 'closed'";

        $user =& User::singleton();
        $DB = Database::singleton();

        if (!$user->hasPermission('access_all_profiles')) {
            $this->query .= " AND i.centerID=" . $DB->quote($user->getCenterID());
        }

        //note that this needs to be in the same order as the headers array
        $this->columns = array(
            'i.issueID as Issue_ID',
            'i.title as Title',
            'i.module as Module',
            'i.category as Category',
            'i.reporter as Reporter',
            'i.assignee as Assignee',
            'i.priority as Priority',
            'p.Name as Site',
            'c.PSCID as PSCID',
            'i.visitLabel as Visit_Label',
            'i.lastUpdate as Last_Update'
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
            'Priority',
            'Site',
            'PSCID',
            'Visit_Label',
            'Last_Update'
        );

        $this->validFilters = array(
            'i.issueID',
            'i.module',
            'i.category',
            'c.PSCID',
            'i.visitLabel',
            'i.reporter',
            'i.assignee',
            'i.centerID',
            'watching',
            'i.projectID',
            'i.priority',
            'keyword'
        );

        $this->formToFilter = array(
            'issueID' => 'i.issueID',
            'category' => 'i.category',
            'module' => 'i.module',
            'PSCID' => 'c.PSCID',
            'visitLabel' => 'i.visitLabel',
            'reporter' => 'i.reporter',
            'assignee' => 'i.assignee',
            'site' => 'i.centerID',
            'watching' => 'watching',
            'projectID' => 'i.projectID',
            'priority' => 'i.priority',
            'keyword' => 'i.comment'
        );

        $this->EqualityFilters = array('i.issueID', 'i.centerID');
        $this->searchKeyword = array('i.comment');

    }

    /**
     * Setup $this->tpl_data for use by Smarty
     *
     * @return null
     */
    function _setFilterForm()
    {
        $user =& User::singleton();
        $DB = Database::singleton();

        //sites
        if ($user->hasPermission('access_all_profiles')) {
            $list_of_sites = Utility::getSiteList();
            if (is_array($list_of_sites)) $list_of_sites = array('' => 'All') + $list_of_sites;
        } else {// allow only to view own site data
            $site =& Site::singleton($user->getData('CenterID'));
            if ($site->isStudySite()) {
                $list_of_sites = array($user->getData('CenterID') => $user->getData('Site'));
            }
        }

        //reporters
        $reporter_expanded = $DB->pselect(
            "SELECT u.Real_name FROM issues i LEFT JOIN users u ON(i.reporter=u.UserID)",
            array()
        );
        $reporters = $this->reorganizeQueryResults($reporter_expanded, 'Real_name');


        //assignees
        $assignee_expanded = $DB->pselect(
            "SELECT u.Real_name FROM issues i LEFT JOIN users u ON(i.assignee=u.UserID)",
            array()
        );
        $assignees = $this->reorganizeQueryResults($assignee_expanded, 'Real_name');

        //modules
        $modules_expanded = $DB->pselect(
            "SELECT DISTINCT Label FROM LorisMenu ORDER BY Label",
            []
        );
        $modules = $this->reorganizeQueryResults($modules_expanded, 'Label');


        $priorities = array(
            '' => 'All',
            'low' => 'Low',
            'normal' => 'Normal',
            'high' => 'High',
            'urgent' => 'Urgent',
            'immediate' => 'Immediate'
        );

        $categories = array(
            '' => 'All',
            'Behavioural Instruments' => 'Behavioural Instruments',
            'Behavioural Battery' => 'Behavioural Battery',
            'Data Entry' => 'Data Entry',
            'Database Problems' => 'Database Problems',
            'Examiners' => 'Examiners',
            'SubprojectID/Project/Plan Changes' => 'SubprojectID/Project/Plan Changes'
        );


        $this->addBasicText('keyword', 'Keyword', array("size" => 10, "maxlength" => 50));
        $this->addBasicText('issueID', 'Issue ID', array("size" => 10, "maxlength" => 25));
        $this->addSelect('module', 'Module', $modules);
        $this->addSelect('category', 'Category', $categories);
        $this->addBasicText('PSCID', 'PSCID', array("size" => 10, "maxlength" => 25));
        $this->addBasicText(
            'DCCID', 'DCCID', array('size' => 10, "maxlength" => 25)
        );
        $this->addBasicText(
            'visitLabel', 'Visit Label', array('size' => "5", "maxlength" => "15")
        );
        $this->addSelect('site', 'Site', $list_of_sites);
        $this->addSelect('reporter', 'Reporter', $reporters);
        $this->addSelect('assignee', 'Assignee', $assignees);
        $this->addSelect('priority', 'Priority', $priorities);

        //TODO: $this->addDualDate();

        //TODO: fix the dual checkbox thing in the backend.
        $this->addCheckbox('watching', 'Watching', array('value' => '1'));

        $this->tpl_data['backURL'] = $_SERVER['REQUEST_URI'];
    }


    /**
     * Overwrites the function to add a customized filter
     * for watching and include closed
     *
     * @param string $prepared_key filter key
     * @param string $field filter field
     * @param string $val filter value
     *
     * @return null
     */
    function _addValidFilters($prepared_key, $field, $val)
    {
        $user =& User::singleton();
        $query = '';
        if ((!empty($val) || $val === '0') && $field != 'order') {
            if ($field != 'watching') {
                if (in_array($field, $this->CheckboxFilters) && $val) {
                    $query .= " AND $field";
                } elseif (strtolower(substr($field, -8)) == 'centerid'
                    || strtolower(substr($field, -10)) == 'categoryid'
                    || strtolower(substr($field, -6)) == 'gender'
                    || (isset($this->EqualityFilters)
                        && in_array($field, $this->EqualityFilters))
                ) {
                    $query .= " AND $field = :v_$prepared_key";
                } else {
                    $query .= " AND $field LIKE CONCAT('%', :v_$prepared_key, '%') ";
                }
            } else if ($field == 'watching' && $val == 1) { //double check this
                $query .= " AND i.issueID in (SELECT issueID FROM issues_watching WHERE userID=" . $user->getData('CenterID') . ")";
            }
            return $query;
        }
    }


    /**
     * Utility function to re-organize query results for selects.
     *
     * @param array $queryResult query result
     * @param string $key key needed to extract appropriate result column
     *
     * @return array
     */
    function reorganizeQueryResults($queryResult, $key)
    {
        $result = array('' => 'All');
        foreach ($queryResult as $r_row) {
            $resultValue = $r_row[$key];
            $result[$resultValue] = $resultValue;
        }

        return $result;
    }


    /**
     * Include the column formatter
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseurl = $factory->settings()->getBaseURL();
        return array_merge(
            parent::getJSDependencies(),
            array(
                $baseurl . "/issue_tracker/js/columnFormatter.js"
            )
        );
    }
}
