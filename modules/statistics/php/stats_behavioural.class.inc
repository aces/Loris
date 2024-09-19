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
     * The default params
     */
    protected $siteParams    = [];
    protected $projectParams = [];

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

        $factory = \NDB_Factory::singleton();
        $DB      = $factory->database();
        $user    = $factory->user();

        // SITES
        if ($user->hasPermission('access_all_profiles')) {
            $list_of_sites = \Utility::getSiteList();
        } else {
            $list_of_sites = $user->getStudySites();
        }
        $sitesString = implode(",", array_keys($list_of_sites));

        $centers = $DB->pselect(
            "SELECT CONCAT('C', CenterID) as ID,
                    CenterID as NumericID,
                    IFNULL(PSCArea,Name) as LongName,
                    Name as ShortName
              FROM psc
              WHERE CenterID <> '1'
                    AND Study_site = 'Y'
	            AND CenterID IN (" . $sitesString . ")",
            []
        );

        $this->tpl_data['Centers'] = $centers;

        // PROJECTS
        $allProjectList = \Utility::getProjectList();
        $projects       = [];
        $projects['']   = 'All Projects';

        $userProjectsIDs = $user->getProjectIDs();
        foreach ($userProjectsIDs as $ProjectID) {
            $projects[$ProjectID->__toString()]
                = $allProjectList[$ProjectID->__toString()];
        }

        $this->tpl_data['Projects'] = $projects;
        foreach ($centers as $row) {
            $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
            if (isset($_REQUEST['site'])
                && $_REQUEST['site'] == $row['NumericID']
            ) {
                $this->tpl_data['CurrentSite'] = [
                    'ID'   => $row['NumericID'],
                    'Name' => $row['LongName'],
                ];
            }

        }

        if ($_REQUEST['BehaviouralProject'] ?? '') {
            $currentProject = \ProjectID::singleton(
                intval($_REQUEST['BehaviouralProject'])
            );
            $this->tpl_data['CurrentProject']
                = [
                    'ID'   => $currentProject,
                    'Name' => $projects["$currentProject"],
                ];
            $Param_Project ='AND (s.ProjectID IS NULL
                               OR c.RegistrationProjectID=:pid)';
            $this->projectParams['pid']
                = htmlspecialchars($_REQUEST['BehaviouralProject']);
        } elseif (!empty($userProjectsIDs)) {
            $currentProject = null;
            $paramProjects  = [];
            foreach ($userProjectsIDs as $key => $projectID) {
                $paramProjects[] = ":paramProjectID$key";
                $this->projectParams["paramProjectID$key"] = $projectID;
            }
            $Param_Project ="AND (s.ProjectID IS NULL
                                   OR s.ProjectID IN
                                       (" . implode(',', $paramProjects) . ")
                                 )";
        } else {
            $currentProject = null;
            $Param_Project  ="AND (s.ProjectID IS NULL)";
        }

        //
        //COHORTS
        $suproject_query = '';
        if ($currentProject !== null) {
            $cohorts     = \Utility::getCohortsForProject($currentProject);
            $subprojList = implode(',', array_keys($cohorts));
            if (!empty($subprojList)) {
                $suproject_query ="AND s.CohortID IN ($subprojList)";
            }
            $Visits = \Utility::getVisitList($currentProject);
        } else {
            $Visits = \Utility::getVisitList();
        }

        $this->tpl_data['Visits'] = $Visits ?? '';

        //SITES

        if ($user->hasPermission('access_all_profiles')) {
            $list_of_sites = \Utility::getSiteList();
        } else {
            $list_of_sites = $user->getStudySites();
        }

        if (!empty($list_of_sites)) {
            $paramCenters      = [];
            $list_of_sites_ids = array_keys($list_of_sites);
            foreach ($list_of_sites_ids as $key => $siteID) {
                $paramCenters[] = ":paramSiteID$key";
                $this->siteParams["paramSiteID$key"] = $siteID;
            }
            $Param_Centers = "AND (s.CenterID IS NULL
                              OR s.CenterID IN
                                  (" . implode(',', $paramCenters) . ")
                            )";
        } else {
            $Param_Centers = "AND (s.CenterID IS NULL)";
        }

        $centers = $DB->pselect(
            "SELECT CONCAT('C', CenterID) as ID,
                    CenterID as NumericID,
                    IFNULL(PSCArea,Name) as LongName,
                    Name as ShortName
              FROM psc as s
              WHERE s.CenterID <> '1'
                    AND s.Study_site = 'Y'
                    $Param_Centers",
            $this->siteParams ?? []
        );

        $this->tpl_data['Centers'] = $centers;

        foreach ($centers as $row) {
            $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
            if (isset($_REQUEST['site'])
                && $_REQUEST['site'] == $row['NumericID']
            ) {
                $this->tpl_data['CurrentSite'] = [
                    'ID'   => $row['NumericID'],
                    'Name' => $row['LongName'],
                ];
            }

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
                    $Param_Project
                    $suproject_query
                    $Param_Centers
                GROUP by s.ID, s.CenterID, VLabel, f.Data_Entry",
            array_merge($this->projectParams, $this->siteParams) ?? []
        );

        foreach ($result as $row) {
            // Put some things into variables to make the lines shorter
            // so that they don't wrap. Note that "c"(enter array) needs to
            // be a reference since we'll be modifying it.
            $center = $row['CenterID'];
            $vl     = $row['VLabel'];
            $value  = intval($row['val']);

            $this->tpl_data['behaviour']['C' . $center][$vl]
                = $this->tpl_data['behaviour']['C' . $center][$vl] ?? [];
            $c =& $this->tpl_data['behaviour']['C' . $center];

            if (array_key_exists('total', $c[$vl])) {
                $c[$vl]['total'] += $value;
            } else {
                $c[$vl]['total'] = $value;
            }

            if (isset($c['all']['total'])) {
                $c['all']['total'] += $value;
            } else {
                $c['all']['total'] = $value;
            }

            if ($row['Data_Entry'] == 'Complete') {
                if (isset($c[$vl]['complete'])) {
                    $c[$vl]['complete'] += $value;
                } else {
                    $c[$vl]['complete'] = $value;
                }
                if (isset($c['all']['complete'])) {
                    $c['all']['complete'] += $value;
                } else {
                    $c['all']['complete'] = $value;
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

                if (array_key_exists('total', $c['all'])
                    && $c['all']['total'] != 0
                ) {
                    if (isset($c['all']['complete'])) {
                        $c['all']['percent']
                            = floor(
                                intval($c['all']['complete'] ?? 0)
                                / $c['all']['total']*100
                            );
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
                    JOIN candidate as c ON(s.CandID=c.CandID)
                    JOIN flag as f ON(f.SessionID=s.ID)
                WHERE s.Active = 'Y'
                    AND s.Current_stage <> 'Recycling Bin'
                    AND f.CommentID LIKE 'DDE%'
                    AND c.Active = 'Y'
                    AND s.CenterID <> '1'
                    $Param_Project
                    $suproject_query
                    $Param_Centers
                GROUP BY s.CenterID, VLabel, f.Data_Entry",
            array_merge($this->projectParams, $this->siteParams) ?? []
        );

        foreach ($result as $row) {
            $center = $row['CenterID'];
            $vl     = $row['VLabel'];
            $value  = intval($row['val']);

            $this->tpl_data['dde']['C' . $center][$vl]
                = $this->tpl_data['dde']['C' . $center][$vl] ?? [];
            $c =& $this->tpl_data['dde']['C' . $center];

            if (array_key_exists('total', $c[$vl])) {
                $c[$vl]['total'] += $value;
            } else {
                $c[$vl]['total'] = $value;
            }

            if (isset($c['all']['total'])) {
                $c['all']['total'] += $value;
            } else {
                $c['all']['total'] = $value;
            }

            if ($row['Data_Entry'] == 'Complete') {
                if (isset($c[$vl]['complete'])) {
                    $c[$vl]['complete'] += $value;
                } else {
                    $c[$vl]['complete'] = $value;
                }
                if (isset($c['all']['complete'])) {
                    $c['all']['complete'] += $value;
                } else {
                    $c['all']['complete'] = $value;
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
                if (array_key_exists('total', $c['all'])
                    && $c['all']['total'] != 0
                ) {
                    if (isset($c['all']['complete'])) {
                        $c['all']['percent']
                            = floor(
                                intval($c['all']['complete'] ?? 0)
                                / $c['all']['total'] * 100
                            );
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
            [
                $baseURL . "/statistics/js/form_stats_behavioural.js",
            ]
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
            [$baseURL . "/statistics/css/statistics.css"]
        );
    }
}

