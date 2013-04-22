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
        $not_excluded = array("radiology_review");

        $key = array_search($var, $excluded_measures); 
        foreach ($excluded_measures as $key=>$val) {
            if (in_array($var, $val)) {
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

    function _CompleteCount($id, $instrument) {
        $DB =& Database::singleton();
        return $DB->pselectOne("SELECT count(s.CandID)  FROM session as s, candidate as c, flag as f, {$instrument} as i WHERE 
                s.ID=f.SessionID AND f.CommentID=i.CommentID 
                AND s.CandID=c.CandID  
                AND s.Active='Y' 
                AND s.Current_stage <> 'Recycling Bin'
                AND s.CenterID={$id} AND f.Data_entry='Complete' AND f.Administration='All' 
                AND i.CommentID LIKE 'DDE%' ORDER BY c.PSCID;");
    }
    function _GetResults($id, $instrument) {
        $DB =& Database::singleton();
        $result = $DB->pselect("SELECT s.CandID, f.SessionID, i.CommentID, c.PSCID, lower(s.Visit_label) as Visit_label  FROM session as s, candidate as c, flag as f, {$instrument} as i 
                WHERE s.ID=f.SessionID AND f.CommentID=i.CommentID AND 
                s.CandID=c.CandID  AND s.Active='Y' 
                AND s.CenterID={$id} 
                AND s.Current_stage <> 'Recycling Bin'
                AND (f.Data_entry is NULL OR f.Data_entry<>'Complete') AND i.CommentID LIKE 'DDE%' ORDER BY c.PSCID;"); 
            return $result;
    }

} // End class
?>
