<?php
/**
 * The module to display study statistics
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
namespace LORIS\statistics;

/**
 * The module to display study statistics
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Stats_Behavioural extends \NDB_Form
{
    /**
     * Checking user's permission
     *
     * @return bool
     */
    function _hasAccess()
    {
        $user =& \User::singleton();
        return $user->hasPermission('data_entry');
    }
    /**
     * InCenter function
     *
     * @param string $centerID the value of centerID
     * @param array  $Centers  a complex object storing ID, NumericID,
     *                         LongName and Shortname for each center
     *
     * @return bool
     */
    function _inCenter($centerID, $Centers)
    {
        if (is_null($centerID)) {
            error_log("CenterID is null");
            return false;
        }
        foreach ($Centers as $Center) {
            if ($Center['NumericID'] == $centerID) {
                return true;
            }
        }
        return false;
    }

    /**
     * Stats_behavioural function
     *
     * @param string $name       The test name being accessed
     * @param string $page       The subtest being accessed (may be null)
     * @param string $identifier The identifier for the data to load on this     page
     * @param string $commentID  The CommentID to load the data for
     * @param string $formname   The name to give this form
     *
     * @return void
     */
    function _setupPage($name, $page, $identifier, $commentID, $formname)
    {
        parent::_setupPage($name, $page, $identifier, $commentID, $formname);

        $DB          =& \Database::singleton();
        $config      = \NDB_Config::singleton();
        $useProjects = $config->getSetting("useProjects");
        $this->tpl_data['useProjects'] = $useProjects;
        $subprojList ='';

        // Get project data
        $projects[null] = 'All Projects';
        foreach (\Utility::getProjectList() as $key=>$value) {
            $projects[$key] = $value;
        }
        $this->tpl_data['Projects'] = $projects;

        // SITES
        $site = $_REQUEST['site'] ?? '';
        if (empty($site)) {
            error_log('No site data specified in request');
        }
        $site = htmlspecialchars($site);
        // Get center data
        $centers = $DB->pselect(
            "SELECT CONCAT('C', CenterID) as ID,
            CenterID as NumericID,
            IFNULL(PSCArea,Name) as LongName,
            Name as ShortName
            FROM psc
            WHERE CenterID <> '1'
            AND Study_site = 'Y'",
            array()
        );
        if (empty($centers)) {
            error_log('No center data could be retrieved from the database!');
        } else {
            foreach ($centers as $row) {
                $id        = $row['NumericID'] ?? '';
                $shortName = $row['ShortName'] ?? '';
                $longName  = $row['LongName'] ?? '';
                $this->tpl_data['Sites'][$id]
                    = $longName;
                if ($site == $id) {
                    $this->tpl_data['CurrentSite'] = array(
                                                      'ID'   => $id,
                                                      'Name' => $longName,
                                                     );
                }
            }
            $this->tpl_data['Centers'] = $centers;
        }

        $Param_Project      = '';
        $subproject_query   = '';
        $behaviouralProject = $_REQUEST['BehaviouralProject'] ?? '';
        if (empty($behaviouralProject)) {
            error_log('No behavioural project specified in request');
        } else {
            $behaviouralProject = htmlspecialchars($behaviouralProject);
            $this->tpl_data['CurrentProject']
                = array(
                   'ID'   => $behaviouralProject,
                   'Name' => $projects[$behaviouralProject],
                  );
            $Param_Project       ='AND (c.ProjectID IS NULL OR c.ProjectID=:pid) ';
            $this->params['pid'] = $behaviouralProject;
            $subprojects         = \Utility::getSubprojectsForProject(
                $behaviouralProject
            );

            $this->tpl_data['Subprojects'] = $subprojects;
            $subprojList = implode(",", array_keys($subprojects));
            if (!empty($subprojList)) {
                $subproject_query ="AND s.SubprojectID IN ($subprojList)";
            }
            $Visits = \Utility::getExistingVisitLabels($behaviouralProject);
            $this->tpl_data['Visits'] = $Visits;
        }

        //---- BEHAVIORAL STATS -----
        $result = $DB->pselect(
            "SELECT s.CenterID,
            f.Data_Entry as Data_Entry,
            s.visit_label as VLabel,
            COUNT(s.CandID) as val
            FROM session s JOIN candidate c ON (s.CandID=c.CandID)
            JOIN flag f ON (f.SessionID=s.ID)
            WHERE 
            s.Active='Y' AND c.Active='Y'
            AND s.Current_stage <> 'Recycling Bin'
            AND f.CommentID NOT LIKE 'DDE%'
            AND s.CenterID <> '1'
            $subproject_query
            $Param_Project
            GROUP by s.ID, s.CenterID, VLabel, f.Data_Entry",
            $this->params
        );

        foreach ($result as $row) {
            // Put some things into variables to make the lines shorter
            // so that they don't wrap. Note that "c"(enter array) needs to
            // be a reference since we'll be modifying it.
            $center = $row['CenterID'];
            $vl     = $row['VLabel'];
            $c      =& $this->tpl_data['behaviour']['C' . $center];

            if (is_null($c)) {
                error_log(
                    "No tpl_data for C$center in behavioural statistics"
                );
                continue;
            }

            $c[$vl]['total']   += $row['val'];
            $c['all']['total'] += $row['val'];
            if ($row['Data_Entry'] == 'Complete') {
                $c[$vl]['complete']   += $row['val'];
                $c['all']['complete'] += $row['val'];
            }
            if ($c[$vl]['total'] != 0) {
                $c[$vl]['percent']
                    = floor($c[$vl]['complete'] / $c[$vl]['total']*100);
            }
            if ($c['all']['total'] != 0) {
                $c['all']['percent']
                    = floor($c['all']['complete'] / $c['all']['total']*100);
            }
        }

        // DDE STATS
        $result = $DB->pselect(
            "SELECT s.CenterID, 
            f.Data_Entry as Data_Entry, 
            s.visit_label as VLabel,
            COUNT(s.CandID) as val
            FROM session as s
            JOIN candidate as c ON (s.CandID=c.CandID)
            JOIN flag as f ON (f.SessionID=s.ID)
            WHERE s.Active='Y' 
            AND s.Current_stage <> 'Recycling Bin'
            AND f.CommentID LIKE 'DDE%' 
            AND c.Active='Y'
            AND s.CenterID <> '1'
            $subproject_query
            $Param_Project
            GROUP BY s.CenterID, VLabel, f.Data_Entry",
            $this->params
        );

        foreach ($result as $row) {
            $center = $row['CenterID'];
            $vl     = $row['VLabel'];
            $c      =& $this->tpl_data['dde']['C' . $center];

            if (is_null($c)) {
                error_log(
                    "No tpl_data for C$center in behavioural statistics"
                );
                continue;
            }

            $c[$vl]['total']   += $row['val'];
            $c['all']['total'] += $row['val'];
            if ($row['Data_Entry'] == 'Complete') {
                $c[$vl]['complete']   += $row['val'];
                $c['all']['complete'] += $row['val'];
            }
            if ($c[$vl]['total'] != 0) {
                $c[$vl]['percent']
                    = floor($c[$vl]['complete'] / $c[$vl]['total']*100);
            }
            if ($c['all']['total'] != 0) {
                $c['all']['percent']
                    = floor($c['all']['complete'] / $c['all']['total']*100);
            }
        }
    }

    /**
     * Include the column formatter required to display the feedback link colours
     * in the statistics menu
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
             $baseURL . "/statistics/js/form_stats_behavioural.js",
            )
        );
    }

    /**
     * Include additional CSS files:
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = \NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/statistics/css/statistics.css")
        );
    }
}

