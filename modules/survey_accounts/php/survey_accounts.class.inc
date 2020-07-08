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
    public $skipTemplate = true;

    /**
     * Determine if user has permission to access this page
     *
     * @param \User $user The user whose access is being checked
     *
     * @return boolean true if access is permitted
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('user_accounts');
    }

    /**
     * Setup internal class variables which are required by NDB_Meny_Filter
     * for generating the query which the table data is based on
     *
     * @return void
     */
    function _setupVariables()
    {
        // the base query
        $query = " FROM participant_accounts p 
            JOIN session s ON (p.SessionID=s.ID)
            JOIN candidate c ON (c.CandID=s.CandID)
            WHERE c.Active = 'Y'
            AND   s.Active = 'Y'";

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
        $this->fieldOptions = [
            'visits'      => \Utility::getVisitList(),
            'instruments' => \Utility::getDirectInstruments(),
        ];
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
                $baseURL . "/survey_accounts/js/surveyAccountsIndex.js",
            )
        );
    }
}
