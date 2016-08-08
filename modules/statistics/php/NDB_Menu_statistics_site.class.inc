<?php
/**
 * The welcome menu
 *
 * @package main
 */
class NDB_Menu_statistics_site extends NDB_Menu
{

    var $instruments    = array();
    var $issues         = array();
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

    function _setInstrumentName()
    {
        $this->instruments = Utility::getAllInstruments();
    }

    // Helper function to get a friendlier version of the instrument name.
    // This is mostly used for the MRI site statistics, which uses
    // names like "Tarchive_Missing" for "MRI Parameter Form Completed but Missing Tarchive Entry"

    function _getIssueName($issue)
    {
        return $issue;
    }

    function _getInstrumentName($instrument)
    {
        return $this->instruments[$instrument];
    }

    function _CompleteCount($centerID, $projectID, $instrument)
    {
        $this->_checkCriteria($centerID, $projectID);
        $DB    =& Database::singleton();
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

    function _GetResults($centerID, $projectID, $instrument)
    {
        $this->_checkCriteria($centerID, $projectID);
        $DB     =& Database::singleton();
        $result = $DB->pselect(
            "SELECT s.CandID, f.SessionID, i.CommentID, c.PSCID, 
                s.Visit_label 
                FROM session s, candidate c, flag  f, 
                {$instrument} i 
                WHERE s.ID=f.SessionID AND f.CommentID=i.CommentID 
                AND s.CandID=c.CandID  
                AND s.Active='Y' 
                AND s.Current_stage <> 'Recycling Bin'
                $this->query_criteria
                AND (f.Data_entry is NULL OR f.Data_entry<>'Complete') 
                AND i.CommentID NOT LIKE 'DDE%' ORDER BY s.Visit_label, c.PSCID",
            $this->query_vars
        );
        return $result;
    }

    function setup()
    {
        // If following a breadcrumb, redirect to the original statistics page
        // since the test_name/subtest don't work the same for the site specific
        // pages as for non-site specific
        if(isset($_GET['subtest'])) {
            header("Location: ?test_name=statistics#data_entry");
        }
        $DB =& Database::singleton();
        if (!empty($_REQUEST['CenterID'])) {
            $center   = $DB->pselectRow("SELECT CenterID as ID, PSCArea as Name FROM psc WHERE CenterID =:cid", array('cid' => $_REQUEST['CenterID']));
            $centerID = $center['ID'];
            $name     = $center['Name'];
        }
        else
        {
            $name = 'All';
        }
        if (!empty($_REQUEST['ProjectID'])) {
            $projectID = $_REQUEST['ProjectID'];
        }
        else {
            $projectID = '';
        }
        // List of all visits. Add to it any time a new one is seen, so
        // that we can iterate over it to display later, and leave blank
        // cells for ones that are missing for a given instrument in the
        // template
        $visits = array();

        $this->_setInstrumentName();
        $data = array();
        foreach($this->instruments as $instrument=>$label){
            $complete_count = $this->_CompleteCount($centerID, $projectID, $instrument);

            $results = $this->_GetResults($centerID, $projectID, $instrument);

            $test_url = $instrument;

            foreach($results as $row) {
                if(!in_array($row['Visit_label'], $visits)) {
                    $visits[] = $row['Visit_label'];
                }
                $results[$row['Visit_label']][] = array(
                                                   'test_url'  => $test_url,
                                                   'CandID'    => $row['CandID'],
                                                   'SessionID' => $row['SessionID'],
                                                   'CommentID' => $row['CommentID'],
                                                   'PSCID'     => $row['PSCID'],
                                                  );
            }
            $data[] = array(
                       'name'        => $label,
                       'count'       => $complete_count,
                       'incompletes' => $results,
                      );
        }

        $this->tpl_data["data"]     = $data;
        $this->tpl_data["SiteName"] = $name;
        sort($visits);
        $this->tpl_data['AllVisits']      = $visits;
        $this->tpl_data['NumVisitLabels'] = count($visits);

    } // End function
} // End class
?>
