<?php declare(strict_types=1);
/**
 * The module to display study statistics
 *
 * PHP Version 7
 *
 * @category Loris
 * @package  Main
 * @author   Wang Shen <wangshen.mcin@gmail.com>
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
 * @author   Wang Shen <wangshen.mcin@gmail.com>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class Statistics_Site extends \NDB_Menu
{

    var $instruments    = [];
    var $issues         = [];
    var $query_criteria = '';
    var $query_vars     = [];

    /**
     * Checking user's permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        //TODO: Create a permission specific to statistics
        $hasAccessToAllProfiles = $user->hasAllPermissions(
            [
                'access_all_profiles',
                'data_entry',
            ]
        );

        $hasCenterPermission = false;

        // TODO: There are no means of set permissions per site
        // for a given user right now: (e.g.) The user X can have
        // the permission data_entry on site Y but not on site Z.
        // Currently, hasCenterPermission() function is only checking
        // if the user have a given center AND a given permission
        // not if it have the permission for this specific center.
        // This logic will be implemented in hasCenterPermission()
        // in near versions when the permission framework allow it.

        // If a CenterID is passed in the request, check if the user has the
        // data_entry permission at the site/center specified by CenterID.
        if (!empty($_REQUEST['CenterID'])) {
            $hasCenterPermission = $user->hasCenterPermission(
                'data_entry',
                \CenterID::singleton(intval($_REQUEST['CenterID']))
            );
        } else {
            // For the short term the user we'll be granted access
            // if at least have permission AND one of the centers
            // The filter _checkCriteria() (please see bellow)
            // takes care of restricting access to sites the user belongs to.
            // When logic reimplemented on hasCenterPermission(),
            // _checkCriteria() will take care of retriving information
            // only for those centers the user has the specific permission.
            // (please see notes about hasCenterPermission() above)
            foreach ($user->getCenterIDs() as $centerID) {
                if ($user->hasCenterPermission('data_entry', $centerID)) {
                    $hasCenterPermission = true;
                    break;
                }
            }
        }

        return $hasAccessToAllProfiles || $hasCenterPermission;
    }

    /**
     * CheckCriteria function
     *
     * @param ?\CenterID  $centerID  the value of centerID
     * @param ?\ProjectID $projectID the value of projectID
     *
     * @return void
     */
    function _checkCriteria(?\CenterID $centerID, ?\ProjectID $projectID)
    {

        //SITES
        $factory = \NDB_Factory::singleton();
        $user    = $factory->user();

        if ($centerID !== null && $user->hasCenter($centerID)) {
            $this->query_criteria   .= " AND s.CenterID =:cid ";
            $this->query_vars['cid'] = $centerID;
        } else {
            if ($user->hasPermission('access_all_profiles')) {
                $list_of_permitted_sites = array_keys(\Utility::getSiteList());
            } else {
                $list_of_permitted_sites = array_keys($user->getStudySites());
            }

            if (!empty($list_of_permitted_sites)) {
                $paramCenters = [];
                $centerIDs    = [];
                foreach ($list_of_permitted_sites as $key => $siteID) {
                    $paramCenters[] = ":paramSiteID$key";
                    $centerIDs["paramSiteID$key"] = $siteID;
                }
                $this->query_criteria .= "AND (s.CenterID IS NULL
                                          OR s.CenterID IN
                                              (" . implode(',', $paramCenters) . ")
                                          )";
                $this->query_vars     += $centerIDs;
            } else {
                $this->query_criteria .= "AND (s.CenterID IS NULL)";
            }
        }

        // PROJECTS

        if ($projectID !== null && $user->hasProject($projectID)) {
            $this->query_criteria   .= " AND s.ProjectID =:pid ";
            $this->query_vars['pid'] = $projectID;
        } else {
            $userProjectsIDs = $user->getProjectIDs();
            if (!empty($userProjectsIDs)) {
                $paramProjects = [];
                $projectsIDs   = [];
                foreach ($userProjectsIDs as $key => $projectID) {
                    $paramProjects[] = ":paramProjectID$key";
                    $projectsIDs["paramProjectID$key"] = $projectID;
                }
                $this->query_criteria .= "AND (s.ProjectID IS NULL
                                          OR s.ProjectID IN
                                              (" . implode(',', $paramProjects) . ")
                                          )";
                $this->query_vars     += $projectsIDs;
            } else {
                $this->query_criteria .= "AND (s.ProjectID IS NULL)";
            }
        }
    }

    /**
     * SetInstrumentName function
     *
     * @return void
     */
    function _setInstrumentName()
    {
        $this->instruments = \Utility::getAllInstruments();
    }

    /**
     * GetInstrumentName function
     *
     * @param string $instrument the value of instrument
     *
     * @return string
     */
    function _getInstrumentName($instrument)
    {
        return $this->instruments[$instrument];
    }
    /**
     * CompleteCount function
     *
     * @param ?\CenterID  $centerID   the value of centerID
     * @param ?\ProjectID $projectID  the value of projectID
     * @param string      $instrument the value of instrument
     *
     * @return ?string
     */
    function _completeCount(
        ?\CenterID $centerID,
        ?\ProjectID $projectID,
        string $instrument
    ): ?string {

        $this->_checkCriteria($centerID, $projectID);
        $DB    = $this->loris->getDatabaseConnection();
        $count = $DB->pselectOne(
            "SELECT count(s.CandID)  FROM session s,
                candidate c, flag f, {$instrument} i
                WHERE s.ID=f.SessionID AND f.CommentID=i.CommentID
                AND s.CandID=c.CandID
                AND s.Active='Y'
                AND s.CenterID <> '1'
                $this->query_criteria
                AND f.Data_entry='Complete'
                AND s.Current_stage <> 'Recycling Bin'
                AND f.Administration='All'
                AND i.CommentID NOT LIKE 'DDE%'",
            $this->query_vars
        );
        return $count;
    }

    /**
     * GetResults function
     *
     * @param ?\CenterID  $centerID   the value of centerID
     * @param ?\ProjectID $projectID  the value of projectID
     * @param string      $instrument the value of instrument
     *
     * @return array
     */
    function _getResults(?\CenterID $centerID, ?\ProjectID $projectID, $instrument)
    {
        $this->_checkCriteria($centerID, $projectID);
        $DB     = $this->loris->getDatabaseConnection();
        $result = $DB->pselect(
            "SELECT s.CandID, f.SessionID, i.CommentID, c.PSCID,
                s.Visit_label
                FROM session s, candidate c, flag  f,
                {$instrument} i
                WHERE s.ID=f.SessionID AND f.CommentID=i.CommentID
                AND s.CandID=c.CandID
                AND s.Active='Y'
                AND s.CenterID <> '1'
                AND s.Current_stage <> 'Recycling Bin'
                $this->query_criteria
                AND (f.Data_entry is NULL OR f.Data_entry<>'Complete')
                AND i.CommentID NOT LIKE 'DDE%' ORDER BY s.Visit_label, c.PSCID",
            $this->query_vars
        );
        return iterator_to_array($result);
    }
    /**
     * Setup function
     *
     * @return void
     */
    function setup()
    {
        $DB     = $this->loris->getDatabaseConnection();
        $sqlRow = "SELECT CenterID as ID, PSCArea as Name".
                  " FROM psc WHERE CenterID =:cid";
        if (!empty($_REQUEST['CenterID'])) {
            $center = $DB->pselectRow(
                $sqlRow,
                ['cid' => $_REQUEST['CenterID']]
            );

            $centerID = \CenterID::singleton(intval($_REQUEST['CenterID']));
            $name     = $center['Name'] ?? '';
        } else {
            $name     = 'All';
            $centerID = null;
        }
        if (!empty($_REQUEST['ProjectID'])) {
            $projectID = \ProjectID::singleton(intval($_REQUEST['ProjectID']));
        } else {
            $projectID = null;
        }
        // List of all visits. Add to it any time a new one is seen, so
        // that we can iterate over it to display later, and leave blank
        // cells for ones that are missing for a given instrument in the
        // template
        $visits = [];

        $this->_setInstrumentName();
        $data = [];
        foreach ($this->instruments as $instrument=>$label) {

            if ($DB->tableExists($instrument)) {
                $complete_count = $this->_completeCount(
                    $centerID,
                    $projectID,
                    $instrument
                );

                $results = $this->_getResults(
                    $centerID,
                    $projectID,
                    $instrument
                );

                $test_url = $instrument;

                foreach ($results as $row) {
                    if (!in_array($row['Visit_label'] ?? [], $visits)) {
                        $visits[] = $row['Visit_label'];
                    }
                    $arrayVar = [
                        'test_url'  => $test_url,
                        'CandID'    => $row['CandID'],
                        'SessionID' => $row['SessionID'],
                        'CommentID' => $row['CommentID'],
                        'PSCID'     => $row['PSCID'],
                    ];
                    $results[$row['Visit_label']][] = $arrayVar;
                }
                $data[] = [
                    'name'        => $label,
                    'count'       => $complete_count,
                    'incompletes' => $results,
                ];
            }
        }

        $this->tpl_data["data"]     = $data;
        $this->tpl_data["SiteName"] = $name;
        sort($visits);
        $this->tpl_data['AllVisits']      = $visits;
        $this->tpl_data['NumVisitLabels'] = count($visits);
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

