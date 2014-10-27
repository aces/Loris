<?php
/**
 * This implements a menu filter to be used for viewing the Loris survey
 * keys that have been created
 *
 * PHP Version 5
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
require_once 'NDB_Menu_Filter.class.inc';

/**
 * Implements menu filter class for survey module.
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  GPLv3
 * @link     https://www.github.com/aces/Loris-Trunk/
 */
class NDB_Menu_Filter_survey_accounts extends NDB_Menu_Filter
{
    /**
     * Determine if user has permission to access this page
     *
     * @return boolean true if access is permitted
     */
    function _hasAccess()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        return $user->hasPermission('user_accounts');
    }

    /**
     * Setup internal class variables which are required by NDB_Meny_Filter
     * for generating the query which the table data is based on
     *
     * @return none
     */
    function _setupVariables()
    {
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        // the base query
        $query = " FROM participant_accounts p 
            JOIN session s ON (p.SessionID=s.ID)
            JOIN candidate c ON (c.CandID=s.CandID)";

        // set the class variables
        $this->columns = array(
            'c.PSCID AS PSCID',
            's.Visit_label AS Visit',
            'p.Email as Email',
            'p.Test_name as SurveyName',
            'p.OneTimePassword as URL',
            'p.Status'
        );
        $this->query = $query;
        $this->order_by = 'PSCID';
        $this->validFilters = array(
            'c.PSCID',
            's.Visit_label',
            'p.Email',
            'p.Test_name',
            'p.OneTimePassword',
            'p.Status',
            'p.Test_name'
        );
        $this->formToFilter = array(
            'PSCID' => 'c.PSCID',
            'VisitLabel' => 's.Visit_label',
            'Email' => 'p.Email',
            'key' => 'p.OneTimePassword',
            'Instrument' => 'p.Test_name'
        );
        return true;
    }


    /**
     * Setup the QuickForm elements for the filter form on this page
     *
     * @return none
     */
    function _setFilterForm()
    {
        // create user object
        $user =& User::singleton();
        if (Utility::isErrorX($user)) {
            return PEAR::raiseError("User Error: ".$user->getMessage());
        }

        $this->addBasicText('PSCID', 'PSCID');
        // add form elements
        $this->addSelect(
            'VisitLabel',
            'Visit:',
            array_merge(array('' => 'All'), Utility::getVisitList())
        );
        $this->addSelect(
            'Instrument',
            'Instrument:',
            array_merge(array('' => 'All'), Utility::getDirectInstruments())
        );
        $this->addBasicText('Email', 'Email:');
        $this->addBasicText('key', 'Key:');

        return true;
    }
}
?>
