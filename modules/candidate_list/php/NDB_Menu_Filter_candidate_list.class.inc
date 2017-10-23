<?php
/**
* The candidate list menu
*
* PHP Version 5
*
* @category Main
* @package  Candidate_List
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
*/

/**
 * Implements the candidate_list menu
 *
* @category Main
* @package  Candidate_List
* @author   Loris Team <loris.mni@bic.mni.mcgill.ca>
* @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
* @link     https://www.github.com/aces/Loris/
 */
class NDB_Menu_Filter_Candidate_List extends NDB_Menu_Filter
{
    var $AjaxModule = true;
    /**
     * Overloading this method to allow access to site users (their own site only)
     * and users w/ multisite privs
     *
     * @return true if user has access, false otherwise
     */
    function _hasAccess()
    {
        // create user object
        $user     =& User::singleton();
        $site_arr = $user->getData('CenterIDs');
        foreach ($site_arr as $key=>$val) {
            $site[$key]        = & Site::singleton($val);
            $isStudySite[$key] = $site[$key]->isStudySite();
        }
        $oneIsStudySite = in_array("1", $isStudySite);
        $aap            = $user->hasPermission('access_all_profiles');
        $this->tpl_data['access_all_profiles'] = $aap;
        return (
            $user->hasPermission('access_all_profiles')
            || ($oneIsStudySite && $user->hasPermission('data_entry'))

        );
    }

    /**
     * Sets up all the class variables needed for the candidate_list menu
     * filter
     *
     * @return true on success
     */
    function _setupVariables()
    {
        $this->skipTemplate = true;
        $user   =& User::singleton();
        $config =& NDB_Config::singleton();

        $this->tpl_data['toggled_visible'] =false;

        // set the class variables
        $useProjects = $config->getSetting("useProjects");
        if ($useProjects === "false") {
            $useProjects = false;
        }

        // set the class variables
        $this->columns = array(
                          'psc.Name AS Site',
                          'c.CandID AS DCCID',
                          'c.PSCID',
                          'c.Gender',
                          'c.Entity_type',
                          "COALESCE(pso.Description,'Active') "
                          . " AS Participant_Status",
                         );
        if ($useProjects) {
            $this->columns[] = 'p.Name as Project';
        }
        $this->columns =array_merge(
            $this->columns,
            array(
             'GROUP_CONCAT(DISTINCT sp.title) as Subproject',
             'DATE_FORMAT(c.DoB,\'%Y-%m-%d\') AS DoB',
             "CASE MAX(s.Scan_done) 
                WHEN 'Y' THEN 'Yes'
                WHEN 'N' THEN 'No'
                END as scan_Done",
            )
        );

        if ($config->getSetting("useEDC")==="true") {
            $this->columns[]           ='DATE_FORMAT((c.EDC),\'%Y-%m-%d\') AS EDC';
        }

        // Need distinct because of joining with feedback_bvl_thread
        $VisitCountSQL = 'COUNT(DISTINCT s.Visit_label)';
        $FeedbackSQL   = 'IFNULL(MIN(feedback_bvl_thread.Status+0),0)';

        $this->columns = array_merge(
            $this->columns,
            array(
             "$VisitCountSQL as Visit_count",
             'max(s.Current_stage) as Latest_visit_status',
             "$FeedbackSQL as Feedback",
            'GROUP_CONCAT(DISTINCT s.Visit_label) as Visits',
            )
        );

        $this->query = " FROM candidate c
            LEFT JOIN psc ON (c.CenterID=psc.CenterID)
            LEFT JOIN session s ON (c.CandID = s.CandID AND s.Active = 'Y')
            LEFT JOIN feedback_bvl_thread
                ON (c.CandID=feedback_bvl_thread.CandID)
            LEFT JOIN participant_status ps ON (ps.CandID=c.CandID)
            LEFT JOIN participant_status_options pso
                ON (ps.participant_status=pso.ID)
            LEFT JOIN Project p ON (c.ProjectID=p.ProjectID)
            LEFT JOIN subproject sp ON (s.SubprojectID=sp.SubprojectID)
            WHERE c.Active = 'Y'";

        if (!$user->hasPermission('access_all_profiles')) {
            $site_arr     = implode(",", $user->getCenterIDs());
            $this->query .= " AND c.CenterID IN (" . $site_arr . ")";
        }

        $this->group_by = 'c.CandID, psc.Name, c.PSCID, c.Gender';
        $this->order_by = 'c.PSCID ASC';

        if ($useProjects) {
            $this->validFilters[] = 'c.ProjectID';
        }
        $this->validFilters = array_merge(
            $this->validFilters,
            array(
             's.SubprojectID',
             'c.DoB',
             $VisitCountSQL,
             'max(s.Current_stage)',
             $FeedbackSQL,
             's.Scan_done',
             's.Visit_label',
             'c.Entity_type',
             'COALESCE(pso.ID, 1)',
            )
        );
        return true;
    }

    /**
     * Overrides the default setDataTableRows to assign the background colour
     * to the feedback thread column
     *
     * @param integer $count The number of rows in the table
     *
     * @return true on success
     */
    function _setDataTableRows($count)
    {
        // create user object
        $user =& User::singleton();

        $subprojectlist = Utility::getSubprojectList();
        $projectlist    = Utility::getProjectList();

        $pOptions = Candidate::getParticipantStatusOptions();
        // print out
        $x = 0;
        foreach ($this->list as $item) {
            //count column
            $this->tpl_data['items'][$x][0]['value'] = $x + $count;

            //print out data rows
            $i = 1;
            foreach ($item as $key => $val) {
                $itemi =& $this->tpl_data['items'][$x][$i];
                // if it's a non-PSC user show the URL to the timepoint list on
                // PSCID field
                if ($key == 'PSCID' && $user->hasPermission('access_all_profiles')) {
                    $itemi['DCCID'] = $item['DCCID'];
                }
                $itemi['PSCID'] = $item['PSCID'];
                $itemi['name']  = $key;
                $itemi['value'] = $val;
                // get feedback information for each displayed candidate record
                if ($key == 'Feedback' && !empty($val)) {
                    // overwrite value
                    $verbose = NDB_BVL_Feedback::getFeedbackStatusVerbose($val);

                    $itemi['value']   = $verbose;
                    $itemi['bgcolor'] = NDB_BVL_Feedback::getThreadColor(
                        $itemi['value']
                    );
                } else if ($key=='Feedback' && empty($val)) {
                    $itemi['value'] = "None";
                } else if ($key=='Project') {
                    if (isset($projectlist[$val])) {
                        $itemi['value'] = $projectlist[$val];
                    } else {
                        $itemi['value'] = '';
                    }
                } else if ($key=='Subproject') {
                    if (isset($subprojectlist[$val])) {
                        $itemi['value'] = $subprojectlist[$val];
                    } else {
                        $itemi['value'] = '';
                    }
                } else if ($key == 'Participant_Status' && !empty($val)) {
                    $itemi['value'] = $pOptions[$val];
                } else if ($key=='scan_done') {
                    $itemi['value'] = $val;
                }

                $i++;
            }

            $x++;
        }
        $this->tpl_data['numCandidates'] = $this->TotalItems;
        return true;
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the candidate_list menu
     *
     * @return array of javascript to be inserted
     */
    function getJSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getJSDependencies();
        return array_merge(
            $deps,
            array(
             $baseURL . "/js/advancedMenu.js",
             $baseURL . "/candidate_list/js/columnFormatter.js",
             $baseURL . "/candidate_list/js/candidate_list_helper.js",
             $baseURL . "/js/components/Form.js",
             $baseURL . "/candidate_list/js/onLoad.js",
            )
        );
    }
}
?>
