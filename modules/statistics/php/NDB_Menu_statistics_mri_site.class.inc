<?php
require_once 'NDB_Menu_statistics_site.class.inc';

/**
 * The welcome menu
 *
 * @package main
 */
class NDB_Menu_statistics_mri_site extends NDB_Menu_statistics_site
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

    function _getIssueName($issue)
    {
        switch($issue) {
        case "Tarchive_Missing":
            return "MRI Parameter Form Completed but Missing tarchive entry";
        case "PF_Missing":
            return "MRI Browser Populated, but no MRI parameter form completed";
        case "Files_Missing":
            return "MRI Parameter Form Completed but nothing in MRI Browser";
        }
        return parent::_getIssueName($issue);
    }

    function _CompleteCount($centerID, $projectID, $issue)
    {
        return null;
    }

    function _GetResults($centerID, $projectID, $issue)
    {
        $this->_checkCriteria($centerID, $projectID);
        $DB =& Database::singleton();

        $scan_types = $DB->pselect("SELECT Scan_type from mri_scan_type");
        $where      = "WHERE (";
        $counter    = 1;
        foreach ($scan_types as $index=>$scan) {
            foreach ($scan as $type=>$label) {
                if ($counter < sizeof($scan_types)) {
                    $where .= "m.$label <> 'No' OR m.$label IS NULL OR ";
                }
                else {
                    $where .= "m.$label <> 'No' OR m.$label IS NULL )";
                }
                $counter++;
            }
        }
        switch($issue) {
        case 'Tarchive_Missing':
            $query = "SELECT DISTINCT f.CommentID as CommentID, 
                            c.PSCID, s.ID as SessionID, s.CandID as CandID,
                            s.Visit_label
                    FROM flag f JOIN session s ON (f.SessionID=s.ID)
                        LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
                        LEFT JOIN tarchive t ON (s.CandID=MID(t.PatientName, 9, 6) AND MID(t.PatientName, 16, 7)=s.Visit_label)
                        LEFT JOIN candidate c ON (s.CandID=c.CandID)
                        $where
                            AND f.CommentID NOT LIKE 'DDE%'
                            AND f.Test_name='mri_parameter_form'
                            AND f.Administration <> 'None'
                            AND t.TarchiveID IS NULL
                            AND s.Active='Y'
                            AND s.CenterID <> '1'
                            AND f.Data_entry='Complete'
                            $this->query_criteria
                        ORDER BY c.PSCID";
            break;
        case 'Files_Missing':
            $where   = "WHERE (";
            $counter = 1;
            foreach ($scan_types as $index=>$scan) {
                foreach ($scan as $type=>$label) {
                    if ($counter < sizeof($scan_types)) {
                        $where .= "m.$label <> 'No' OR ";
                    }
                    else {
                        $where .= "m.$label <> 'No')";
                    }
                    $counter++;
                }
            }

            $query = "SELECT DISTINCT f.CommentID as CommentID, s.ID as SessionID, c.PSCID, s.CandID, s.Visit_label
                    FROM mri_parameter_form m LEFT JOIN flag f ON
                                        (f.CommentID=m.CommentID)
                    LEFT JOIN session s ON (s.ID=f.SessionID)
                    LEFT JOIN files fi ON (fi.SessionID=f.SessionID)
                    LEFT JOIN candidate c ON (c.CandID=s.CandID)
                    $where
                        AND fi.FileID IS NULL
                        AND f.Data_entry= 'Complete'
                        AND s.Active='Y'
                        AND s.CenterID <> '1'
                        $this->query_criteria
                    ORDER BY c.PSCID";
            break;
        case 'PF_Missing': $query =
            "SELECT DISTINCT c.PSCID, s.ID as SessionID,
                        s.Visit_label
                    FROM files LEFT JOIN session s ON (files.SessionID=s.ID)
                        LEFT JOIN flag f on (f.SessionID=s.ID AND f.Test_name='mri_parameter_form' AND f.CommentID NOT LIKE 'DDE%')
                        LEFT JOIN mri_parameter_form mpf ON (mpf.CommentID=f.CommentID)
                        LEFT JOIN candidate c ON (c.CandID=s.CandID)
                        WHERE s.Active='Y' 
                           AND c.PSCID <> 'scanner'
                           AND (f.ID IS NULL OR
                           f.Data_entry <> 'Complete' OR
                           f.Data_entry IS NULL)
                           AND s.CenterID <> '1'
                           $this->query_criteria
                           ORDER BY c.PSCID";
            break;

        }
        if($query) { $result = $DB->pselect($query, $this->query_vars);
        }
        return $result;
    }

    function setup()
    {
        $this->issues = array(
                         "Tarchive_Missing",
                         "Files_Missing",
                         "PF_Missing",
                        );
        if(isset($_GET['subtest'])) {
            header("Location: ?test_name=statistics#data_entry");
        }
        $DB     =& Database::singleton();
        $center = $DB->pselectRow("SELECT CenterID as ID, PSCArea as Name FROM psc WHERE CenterID=:cid", array('cid' => $_REQUEST['CenterID']));
        $id     = $center['ID'];
        $name   = $center['Name'];
        // List of all visits. Add to it any time a new one is seen, so
        // that we can iterate over it to display later, and leave blank
        // cells for ones that are missing for a given issue in the
        // template
        $visits = array();

        //$this->_setIssueName();
        $data = array();
        foreach($this->issues as $issue){
            $complete_count = $this->_CompleteCount($centerID, $projectID, $issue);

            $results = $this->_GetResults($centerID, $projectID, $issue);

            $test_url = $issue;
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
                       'name'        => $this->_getIssueName($issue),
                       'count'       => $complete_count,
                       'incompletes' => $results,
                      );
        }

        $this->tpl_data["data"]     = $data;
        $this->tpl_data["SiteName"] = $name;
        sort($visits);
        $this->tpl_data['AllVisits']      = $visits;
        $this->tpl_data['NumVisitLabels'] = count($visits);

        //        return parent::setup();

    }

} // End class
?>
