<?php
require_once 'NDB_Menu_statistics_site.class.inc';

/**
 * The welcome menu
 *
 * @package main
 */
class NDB_Menu_statistics_dd_site extends NDB_Menu_statistics_site
{

    var $query_criteria = '';
    var $query_vars     = array();

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

    function __construct()
    {
        $this->instruments = Utility::getAllInstruments();
        foreach($this->instruments as $k=>$v) {
            $this->instruments[$k] = $k;
        }

        $this->instruments = array_filter($this->instruments, array(&$this, 'notexcluded'));
    }

    function _CompleteCount($centerID, $projectID, $instrument)
    {
        $this->_checkCriteria($centerID, $projectID);
        $DB =& Database::singleton();

        $safe_instrument = $DB->escape($instrument);

        return $DB->pselectOne(
            "SELECT count(s.CandID)  FROM session s, candidate c, flag f, $safe_instrument i WHERE
                s.ID=f.SessionID AND f.CommentID=i.CommentID 
                AND s.CandID=c.CandID  
                AND s.Active='Y' 
                AND s.Current_stage <> 'Recycling Bin'
                $this->query_criteria
                AND f.Data_entry='Complete' AND f.Administration='All' 
                AND i.CommentID LIKE 'DDE%' ORDER BY c.PSCID",
            $this->query_vars
        );
    }

    function _GetResults($centerID, $projectID, $instrument)
    {
        $this->_checkCriteria($centerID, $projectID);
        $DB     =& Database::singleton();
        $safe_instrument = $DB->escape($instrument);
        $result = $DB->pselect(
            "SELECT s.CandID, f.SessionID, i.CommentID, c.PSCID, lower(s.Visit_label) as Visit_label  FROM session s, candidate c, flag f, $safe_instrument i
                WHERE s.ID=f.SessionID AND f.CommentID=i.CommentID AND 
                s.CandID=c.CandID  AND s.Active='Y' 
                $this->query_criteria
                AND s.Current_stage <> 'Recycling Bin'
                AND (f.Data_entry is NULL OR f.Data_entry<>'Complete') AND i.CommentID LIKE 'DDE%' ORDER BY c.PSCID",
            $this->query_vars
        );
            return $result;
    }

} // End class
?>
