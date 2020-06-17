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
class Statistics_DD_Site extends statistics_site
{
    var $query_criteria = '';
    var $query_vars     = array();
    /**
     * Checking user's permission
     *
     * @param \User $user The user whose access is being checked
     *
     * @return bool
     */
    function _hasAccess(\User $user) : bool
    {
        // TODO (#6742): Create a permission specific to statistics
        $hasAccessToAllProfiles = $user->hasAllPermissions(
            array(
                'access_all_profiles',
                'data_entry',
            )
        );

        $hasCenterPermission = false;

        // TODO (#6742): There are no means of setting permissions per site
        // for a given user right now (see #6742 for more info)

        // If a CenterID is passed in the request, check if the user has the
        // data_entry permission at the site/center specified by CenterID.
        if (!empty($_REQUEST['CenterID'])) {
            $hasCenterPermission = $user->hasCenterPermission(
                'data_entry',
                intval($_REQUEST['CenterID'])
            );
        } else {
            // FIXME (#6742): For the short term the user will be granted access
            // if they have permission for a minimum of one of the centers
            foreach ($user->getCenterIDs() as $centerID) {
                if ($user->hasCenterPermission('data_entry', intval($centerID))) {
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
     * @param string $centerID  the value of centerID
     * @param string $projectID the value of projectID
     *
     * @return void
     */
    function _checkCriteria($centerID, $projectID)
    {
        // TODO (#6743): _checkCriteria takes care of restricting data access
        // to sites the user belongs to.
        // When logic reimplemented on hasCenterPermission(),
        // _checkCriteria() will take care of retrieving information
        // only for those centers the user has the specific permission.

        // TODO (#6743): There are no means of setting permissions per site
        // for a given user right now (see #6743 for more info)
        if (!empty($centerID)) {
            $this->query_criteria   .= " AND s.CenterID =:cid ";
            $this->query_vars['cid'] = $centerID;
        } else {
            $list_of_permitted_sites = (array) null;
            $currentUser = \User::singleton();
            if ($currentUser->hasPermission('access_all_profiles')) {
                $list_of_permitted_sites = array_keys(\Utility::getSiteList());
            } else {
                foreach ($currentUser->getCenterIDs() as $centerID) {
                    if ($currentUser->hasCenterPermission(
                        'data_entry',
                        intval($centerID)
                    )
                    ) {
                        array_push($list_of_permitted_sites, $centerID);
                    }
                }
            }
            $params    = array();
            $centerIDs = array();
            foreach ($list_of_permitted_sites as $key => $siteID) {
                $params[]            = ":id$key";
                $centerIDs["id$key"] = $siteID;
            }
            $this->query_criteria .=
                " AND s.CenterID IN (" . implode(',', $params) . ")";
            $this->query_vars     += $centerIDs;
        }
        if (!empty($projectID)) {
            $this->query_criteria   .= " AND s.ProjectID =:pid ";
            $this->query_vars['pid'] = $projectID;
        }
    }

    /**
     * Notexcluded function
     *
     * @param string $var the value of var
     *
     * @return bool
     */
    function notexcluded($var)
    {
        $config            =& \NDB_Config::singleton();
        $excluded_measures = $config->getSetting('excludedMeasures');

        return !in_array($var, $excluded_measures);
    }

    /**
     * Construct function
     *
     * @return void
     */
    function _setInstrumentName()
    {
        $this->instruments = \Utility::getAllInstruments();
        foreach (array_keys($this->instruments) as $k) {
            $this->instruments[$k] = $k;
        }

        $this->instruments = array_filter(
            $this->instruments,
            array(
                &$this,
                'notexcluded',
            )
        );
    }

    /**
     * CompleteCount function
     *
     * @param string $centerID   the value of centerID
     * @param string $projectID  the value of projectID
     * @param string $instrument the value of instrument
     *
     * @return ?string
     */
    function _completeCount($centerID, $projectID, $instrument): ?string
    {
        $this->_checkCriteria($centerID, $projectID);
        $DB =& \Database::singleton();

        $safe_instrument = $DB->escape($instrument);

        return $DB->pselectOne(
            "SELECT count(s.CandID)  FROM session s, candidate c,
                flag f, $safe_instrument i
             WHERE
                s.ID=f.SessionID AND f.CommentID=i.CommentID 
                AND s.CandID=c.CandID  
                AND s.Active='Y' 
                AND s.CenterID <> '1'
                AND s.Current_stage <> 'Recycling Bin'
                $this->query_criteria
                AND f.Data_entry='Complete' AND f.Administration='All' 
                AND i.CommentID LIKE 'DDE%' ORDER BY c.PSCID",
            $this->query_vars
        );
    }
    /**
     * GetResults function
     *
     * @param string $centerID   the value of centerID
     * @param string $projectID  the value of projectID
     * @param string $instrument the value of instrument
     *
     * @return array
     */
    function _getResults($centerID, $projectID, $instrument)
    {
        $this->_checkCriteria($centerID, $projectID);
        $DB =& \Database::singleton();
        $safe_instrument = $DB->escape($instrument);
        $result          = $DB->pselect(
            "SELECT s.CandID, f.SessionID, i.CommentID, c.PSCID,
                lower(s.Visit_label) as Visit_label 
                FROM session s, candidate c, flag f, $safe_instrument i
                WHERE s.ID=f.SessionID AND f.CommentID=i.CommentID AND 
                s.CandID=c.CandID  AND s.Active='Y' 
                AND s.CenterID <> '1'
                $this->query_criteria
                AND s.Current_stage <> 'Recycling Bin'
                AND (f.Data_entry is NULL OR f.Data_entry<>'Complete')
                AND i.CommentID LIKE 'DDE%' ORDER BY c.PSCID",
            $this->query_vars
        );
        return $result;
    }
}

