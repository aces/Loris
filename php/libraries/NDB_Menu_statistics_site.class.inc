<?php
require_once "Utility.class.inc";
require_once 'NDB_Menu.class.inc';

/**
 * The welcome menu
 * @package main
 */
class NDB_Menu_statistics_site extends NDB_Menu
{


//    var $instruments = $DB->selectRow("SELECT Test_name FROM test_names");
    //var $instruments = array();
    var $instruments = array(); 
    var $issues = array();
    
    /*array(
      "ace_medical_history",
      "adi_r_proband",
    );*/


    function _setInstrumentName() {
                        $instr = Utility::getAllInstruments();
                        $DB =& Database::singleton();
                        $full_names = array();
                        foreach ($instr as $i=>$j) {
                            $full_name = $DB->pselectOne("SELECT Full_name from test_names where test_name = '$i'");
                            $full_names[$i] = $full_name;
                        }
        $this->instruments = $full_names; //Utility::getAllInstruments();
    }

    // Helper function to get a friendlier version of the instrument name.
    // This is mostly used for the MRI site statistics, which uses 
    // names like "Tarchive_Missing" for "MRI Parameter Form Completed but Missing Tarchive Entry"

    function _getIssueName($issue) {
        return $issue;
    }
    function _getInstrumentName($instrument) {
        return $this->instruments[$instrument];
        //return $instrument;
    }
    function _CompleteCount($id, $instrument) {
        $DB =& Database::singleton();
        $count = $DB->pselectOne(
                "SELECT count(s.CandID)  FROM session as s, 
                candidate as c, flag as f, {$instrument} as i 
                WHERE s.ID=f.SessionID AND f.CommentID=i.CommentID 
                AND s.CandID=c.CandID  
                AND s.Active='Y' 
                AND s.CenterID={$id} AND f.Data_entry='Complete' 
                AND s.Current_stage <> 'Recycling Bin'
                AND f.Administration='All' 
                AND i.CommentID NOT LIKE 'DDE%';");
        if (PEAR::isError($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
        return $count;

    }
    function _GetResults($id, $instrument) {
        $DB =& Database::singleton();
        $result = $DB->pselect("SELECT s.CandID, f.SessionID, i.CommentID, c.PSCID, 
                s.Visit_label 
                FROM session as s, candidate as c, flag as f, 
                {$instrument} as i 
                WHERE s.ID=f.SessionID AND f.CommentID=i.CommentID 
                AND s.CandID=c.CandID  
                AND s.Active='Y' 
                AND s.Current_stage <> 'Recycling Bin'
                AND s.CenterID={$id} 
                AND (f.Data_entry is NULL OR f.Data_entry<>'Complete') 
                AND i.CommentID NOT LIKE 'DDE%' ORDER BY s.Visit_label, c.PSCID;"); //, $result);
                //s.Visit_label as Visit_label
        if (PEAR::isError($result)) {
            return PEAR::raiseError("DB Error: ".$result->getMessage());
        }
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
        if(PEAR::isError($DB)) {
            return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
        }
        $center = $DB->pselectRow("SELECT CenterID as ID, PSCArea as Name FROM psc WHERE CenterID=" . $_REQUEST['CenterID']); //, $center);
        $id = $center['ID'];
        $name = $center['Name'];
        // List of all visits. Add to it any time a new one is seen, so
        // that we can iterate over it to display later, and leave blank
        // cells for ones that are missing for a given instrument in the 
        // template
        $visits = array();

        $this->_setInstrumentName();
        $data = array();
        foreach($this->instruments as $instrument=>$label){           
            $complete_count = $this->_CompleteCount($id, $instrument); 

            $results = $this->_GetResults($id, $instrument);

            $test_url = $instrument;
         /*   if(substr($test_url, 0, 10) == "figs_year3"){
                $test_url = "figs_year3";
            }*/
            foreach($results as $row) {
                if(!in_array($row['Visit_label'], $visits)) {
                    $visits[] = $row['Visit_label'];
                }
                $results[$row['Visit_label']][] = array(
                        'test_url' => $test_url,
                        'CandID' => $row['CandID'],
                        'SessionID' => $row['SessionID'],
                        'CommentID' => $row['CommentID'],
                        'PSCID' => $row['PSCID']
                        );
            }
            $data[] = array('name' => $this->_getInstrumentName($instrument), 'count' => $complete_count, 'incompletes' => $results);
        }

        $this->tpl_data["data"] = $data;
        $this->tpl_data["SiteName"] = $name;
        sort($visits);
        $this->tpl_data['AllVisits'] = $visits;
        $this->tpl_data['NumVisitLabels'] = count($visits);

    } // End function
} // End class
    ?>
