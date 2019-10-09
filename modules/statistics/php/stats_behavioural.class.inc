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
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        return $user->hasPermission('data_entry');
    }
    /**
     * InCenter function
     *
     * @param string $centerID the value of centerID
     * @param array  $Centers  the value of centers
     *
     * @return bool
     */
    function _inCenter($centerID, $Centers)
    {
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
     * @return void
     */
    function setup()
    {
        parent::setup();

        $DB =& \Database::singleton();

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

        $this->tpl_data['Centers'] = $centers;

        $projects     = \Utility::getProjectList();
        $projects[''] = 'All Projects';

        $this->tpl_data['Projects'] = $projects;
        foreach ($centers as $row) {
            $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
            if (isset($_REQUEST['site'])
                && $_REQUEST['site'] == $row['NumericID']
            ) {
                $this->tpl_data['CurrentSite'] = array(
                                                  'ID'   => $row['NumericID'],
                                                  'Name' => $row['LongName'],
                                                 );
            }

        }

        if ($_REQUEST['BehaviouralProject'] ?? ''
        ) {
            $currentProject = htmlspecialchars($_REQUEST['BehaviouralProject']);
            $this->tpl_data['CurrentProject']
                = array(
                   'ID'   => $currentProject,
                   'Name' => $projects[$currentProject],
                  );
            $Param_Project       ='AND (s.ProjectID IS NULL OR s.ProjectID=:pid) ';
            $this->params['pid'] = htmlspecialchars($_REQUEST['BehaviouralProject']);
        } else {
            $currentProject = '';
            $Param_Project  = '';
        }
        //
        //SUBPROJECTS
        $suproject_query = '';
        // Only search for subprojects if $currentProject is a positive int.
        if (is_numeric($currentProject) && intval($currentProject) >= 0) {
            $subprojList ="";
            $subprojects = \Utility::getSubprojectsForProject($currentProject);
            foreach ($subprojects as $key=>$val) {
                $subprojList .= $key.",";
            }
            $subprojList = substr($subprojList, 0, -1);
            if (!empty($subprojList)) {
                $suproject_query ="AND s.SubprojectID IN ($subprojList)";
            }
            $Visits = \Utility::getExistingVisitLabels($currentProject);
        }

        $this->tpl_data['Visits'] = $Visits ?? '';

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
                    $suproject_query
                    $Param_Project
                GROUP by s.ID, s.CenterID, VLabel, f.Data_Entry",
            $this->params ?? array()
        );

        foreach ($result as $row) {
            // Put some things into variables to make the lines shorter
            // so that they don't wrap. Note that "c"(enter array) needs to
            // be a reference since we'll be modifying it.
            $center = $row['CenterID'];
            $vl     = intval($row['VLabel']);
            $c      =& $this->tpl_data['behaviour']['C' . $center];

            if (isset($c[$vl]['total'])) {
                $c[$vl]['total'] += intval($row['val']);
            } else {
                $c[$vl]['total'] = intval($row['val']);
            }
            if (isset($c['all']['total'])) {
                $c['all']['total'] += $row['val'];
            } else {
                $c['all']['total'] = $row['val'];
            }
            if ($row['Data_Entry'] == 'Complete') {
                if (isset($c[$vl]['complete'])) {
                    $c[$vl]['complete'] += $row['val'];
                } else {
                    $c[$vl]['complete'] = $row['val'];
                }
                if (isset($c['all']['complete'])) {
                    $c['all']['complete'] += $row['val'];
                } else {
                    $c['all']['complete'] = $row['val'];
                }
            }
            if (!empty($c) && is_array($c)) {
                if ($c[$vl]['total'] != 0) {
                    if (isset($c[$vl]['complete'])) {
                        $c[$vl]['percent']
                            = floor($c[$vl]['complete'] / $c[$vl]['total']*100);
                    } else {
                        $c[$vl]['percent'] = 0;
                    }
                }
                if ($c['all']['total'] != 0) {
                    if (isset($c['all']['complete'])) {
                        $c['all']['percent']
                            = floor($c['all']['complete'] / $c['all']['total']*100);
                    } else {
                        $c['all']['percent'] = 0;
                    }
                }
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
                $suproject_query
                $Param_Project
                GROUP BY s.CenterID, VLabel, f.Data_Entry",
            $this->params ?? array()
        );

        foreach ($result as $row) {
            $center = $row['CenterID'];
            $vl     = intval($row['VLabel']);
            $c      =& $this->tpl_data['dde']['C' . $center];

            if (isset($c[$vl]['total'])) {
                $c[$vl]['total'] += $row['val'];
            } else {
                $c[$vl]['total'] = $row['val'];
            }
            if (isset($c['all']['total'])) {
                $c['all']['total'] += $row['val'];
            } else {
                $c['all']['total'] = $row['val'];
            }
            if ($row['Data_Entry'] == 'Complete') {
                if (isset($c[$vl]['complete'])) {
                    $c[$vl]['complete'] += $row['val'];
                } else {
                    $c[$vl]['complete'] = $row['val'];
                }
                if (isset($c['all']['complete'])) {
                    $c['all']['complete'] += $row['val'];
                } else {
                    $c['all']['complete'] = $row['val'];
                }
            }
            if (!empty($c) && is_array($c)) {
                if ($c[$vl]['total'] != 0 && !is_null($c[$vl])) {
                    if (isset($c[$vl]['complete'])) {
                        $c[$vl]['percent']
                            = floor($c[$vl]['complete'] / $c[$vl]['total']*100);
                    } else {
                        $c[$vl]['percent'] = 0;
                    }
                }
                if ($c['all']['total'] != 0) {
                    if (isset($c['all']['complete'])) {
                        $c['all']['percent']
                            = floor($c['all']['complete'] / $c['all']['total']*100);
                    } else {
                        $c['all']['percent'] = 0;
                    }
                }
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

