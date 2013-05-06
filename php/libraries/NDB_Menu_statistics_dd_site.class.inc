<?php
require_once 'NDB_Menu_statistics_site.class.inc';

/**
 * The welcome menu
 * @package main
 */
class NDB_Menu_statistics_dd_site extends NDB_Menu_statistics_site
{

    function notexcluded($var) {
        $config =& NDB_Config::singleton();
        $statisticsConfig = $config->getSetting('statistics');
        $excluded_measures = array($statisticsConfig['excludedMeasures']);

        $key = array_search($var, $excluded_measures); 
        foreach ($excluded_measures as $key=>$val) {
            if (in_array($var, $val) || $var == $val) {
                return false;
            }
        }
        return true;
    }

    function __construct() {
        $this->instruments = Utility::getAllInstruments();
        foreach($this->instruments as $k=>$v) {
            $this->instruments[$k] = $k;
        }
       
        $this->instruments = array_filter($this->instruments, array(&$this, 'notexcluded'));
    }

    function _CompleteCount($centerID, $projectID, $instrument) {
        $DB =& Database::singleton();
        if ($centerID == '<>1')
            $center = "AND s.CenterID {$centerID} ";
        else
            $center = "AND s.CenterID={$centerID} ";
        if (!empty($projectID))
            $project = " AND c.ProjectID = {$projectID} ";
        else
            $project = "";

        return $DB->pselectOne("SELECT count(s.CandID)  FROM session s, candidate c, flag f, {$instrument} i WHERE 
                s.ID=f.SessionID AND f.CommentID=i.CommentID 
                AND s.CandID=c.CandID  
                AND s.Active='Y' 
                AND s.Current_stage <> 'Recycling Bin'
                $center $project
                AND f.Data_entry='Complete' AND f.Administration='All' 
                AND i.CommentID LIKE 'DDE%' ORDER BY c.PSCID");
    }

    function _GetResults($centerID, $projectID, $instrument) {
        $DB =& Database::singleton();
        if ($centerID == '<>1')
            $center = "AND s.CenterID {$centerID} ";
        else
            $center = "AND s.CenterID={$centerID} ";
        if (!empty($projectID))
            $project = " AND c.ProjectID = {$projectID} ";
        else
            $project = "";

        $result = $DB->pselect("SELECT s.CandID, f.SessionID, i.CommentID, c.PSCID, lower(s.Visit_label) as Visit_label  FROM session s, candidate c, flag f, {$instrument} i 
                WHERE s.ID=f.SessionID AND f.CommentID=i.CommentID AND 
                s.CandID=c.CandID  AND s.Active='Y' 
                $center $project
                AND s.Current_stage <> 'Recycling Bin'
                AND (f.Data_entry is NULL OR f.Data_entry<>'Complete') AND i.CommentID LIKE 'DDE%' ORDER BY c.PSCID"); 
            return $result;
    }

} // End class
?>
