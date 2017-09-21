<?php
/**
 * The welcome menu
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
require_once 'NDB_Menu_statistics_site.class.inc';
/**
 * The welcome menu
 *
 * PHP Version 5
 *
 * @category Loris
 * @package  Main
 * @author   Dave MacFarlane <driusan@bic.mni.mcgill.ca>
 * @license  http://www.gnu.org/licenses/gpl-3.0.txt GPLv3
 * @link     https://github.com/aces/Loris
 */
class NDB_Menu_Statistics_DD_Site extends NDB_Menu_statistics_site
{

    var $query_criteria = '';
    var $query_vars     = array();
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
        if (!empty($centerID)) {
            $this->query_criteria   .= " AND s.CenterID =:cid ";
            $this->query_vars['cid'] = $centerID;
        }
        if (!empty($projectID)) {
            $this->query_criteria   .= " AND c.ProjectID =:pid ";
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
        $config            =& NDB_Config::singleton();
        $statisticsConfig  = $config->getSetting('statistics');
        $excluded_measures = array($statisticsConfig['excludedMeasures']);

        $key = array_search($var, $excluded_measures);
        foreach ($excluded_measures as $key=>$val) {
            if (in_array($var, $val) || $var == $val) {
                return false;
            }
        }
        return true;
    }
    /**
     * Construct function
     *
     * @return void
     */
    function __construct()
    {
        $this->instruments = Utility::getAllInstruments();
        foreach ($this->instruments as $k=>$v) {
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
     * @return void
     */
    function _completeCount($centerID, $projectID, $instrument)
    {
        $this->_checkCriteria($centerID, $projectID);
        $DB =& Database::singleton();

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
     * @return string
     */
    function _getResults($centerID, $projectID, $instrument)
    {
        $this->_checkCriteria($centerID, $projectID);
        $DB =& Database::singleton();
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

    /**
     * Include additional CSS files:
     *
     * @return array of javascript to be inserted
     */
    function getCSSDependencies()
    {
        $factory = NDB_Factory::singleton();
        $baseURL = $factory->settings()->getBaseURL();
        $deps    = parent::getCSSDependencies();
        return array_merge(
            $deps,
            array($baseURL . "/statistics/css/statistics.css")
        );
    }
} // End class
?>
