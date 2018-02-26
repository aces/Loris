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
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
namespace LORIS\survey_accounts;

/**
 * Implements menu filter class for survey module.
 *
 * @category Survey
 * @package  Loris
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://www.github.com/aces/Loris/
 */
class Survey_Accounts extends \NDB_Menu_Filter
{
    /**
     * Determine if user has permission to access this page
     *
     * @return boolean true if access is permitted
     */
    function _hasAccess()
    {
        // create user object
        $user =& \User::singleton();

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
        $user =& \User::singleton();

        // the base query
        $query = " FROM participant_accounts p 
            JOIN session s ON (p.SessionID=s.ID)
            JOIN candidate c ON (c.CandID=s.CandID)";

        // set the class variables
        $this->columns      = array(
                               'c.PSCID AS PSCID',
                               's.Visit_label AS Visit',
                               'p.Email as Email',
                               'p.Test_name as SurveyName',
                               'p.OneTimePassword as URL',
                               'p.Status',
                              );
        $this->query        = $query;
        $this->order_by     = 'PSCID';
        $this->validFilters = array(
                               'c.PSCID',
                               's.Visit_label',
                               'p.Email',
                               'p.Test_name',
                               'p.OneTimePassword',
                               'p.Status',
                               'p.Test_name',
                              );
        $this->formToFilter = array(
                               'PSCID'      => 'c.PSCID',
                               'VisitLabel' => 's.Visit_label',
                               'Email'      => 'p.Email',
                               'key'        => 'p.OneTimePassword',
                               'Instrument' => 'p.Test_name',
                              );
        return true;
    }


    /**
     * Does the setup required for this page. By default, sets up elements
     * that are common to every type of page. May be overridden by a specific
     * page or specific page type.
     *
     * @return none
     */
    function setup()
    {
        parent::setup();

        // create user object
        $user =& \User::singleton();
        $this->addBasicText('PSCID', 'PSCID');
        // add form elements
        $this->addSelect(
            'VisitLabel',
            'Visit:',
            array_merge(array('' => 'All'), \Utility::getVisitList())
        );
        $this->addSelect(
            'Instrument',
            'Instrument:',
            array_merge(array('' => 'All'), \Utility::getDirectInstruments())
        );
        $this->addBasicText('Email', 'Email:');
        $this->addBasicText('key', 'Key:');

        return true;
    }

    /**
     * Gathers JS dependecies and merge them with the parent
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
             $baseURL . "/survey_accounts/js/survey_accounts_helper.js",
             $baseURL . "/survey_accounts/js/columnFormatter.js",
            )
        );
    }
}
?>
