<?php
require_once 'NDB_Menu.class.inc';
//require_once 'NDB_Menu_Filter_reliability.class.inc';

/**
 * The welcome menu
 * @package main
 */
class NDB_Menu_statistics extends NDB_Menu
{
    function _inCenter($centerID, $Centres) {
        foreach ($Centres as $Centre) {
            if($Centre['NumericID'] == $centerID) {
                return TRUE;
            }
        }
        return FALSE;
    }

    function array_find($needle, $haystack) {
        if(!is_array($haystack)) return false;
        foreach ($haystack as $key=>$item) {
            $item = '/' . $item . '/i';
            if (preg_match($item, $needle)) {
                return $key;
            }
        }
        return false;
    }

    function render_stats_table($header, $subcats, $visits, $dropdown_name, $dropdown_opt, $dropdown_selected, $centres, $data, $Subsection="") {
        $tpl_data = array();
        $tpl_data['test_name'] = $_REQUEST['test_name'];
        $tpl_data['Subsection'] = $Subsection;
        $tpl_data['Visits'] = $visits;
        $smarty = new Smarty_neurodb();
        $tpl_data['Header'] = $header;
        $tpl_data['Subcategories'] = $subcats;
        $tpl_data['Subprojects'] = Utility::getSubprojectList(); 
        $tpl_data['DropdownName'] = $dropdown_name;
        $tpl_data['DropdownOptions'] = $dropdown_opt;
        $tpl_data['DropdownSelected'] = $dropdown_selected;
        $tpl_data['Centers'] = $centres;
        foreach($data as $row) {
            $subproj = $row['SubprojectID'];
            $vl = $row['VLabel'];
            $subcat = $row['Subcat'];
            $center = $row['CenterID'];

            $matches = $this->array_find($vl, $visits);

            //            if(array_search($vl, $visits) !== FALSE && array_search($subcat, $subcats) !== FALSE && $this->_inCenter($center, $centres) !== FALSE) {
            if($matches !==FALSE && array_search($subcat, $subcats) !== FALSE && $this->_inCenter($center, $centres) !== FALSE) {
                $tpl_data['data'][$subproj][$vl][$subcat] += $row['val'];
                $tpl_data['data'][$subproj][$vl]['total'] += $row['val'];
                $tpl_data['data'][$subproj][$subcat] += $row['val'];
                $tpl_data['data'][$vl][$subcat] += $row['val'];
                $tpl_data['data'][$vl]['total'] += $row['val'];
                $tpl_data['data'][$subproj]['C' . $center][$vl][$subcat] = $row['val'];
                $tpl_data['data']['Cat' . $subcat] += $row['val'];
                $tpl_data['data'][$subproj]['C' . $center][$subcat] += $row['val'];
                $tpl_data['data']['C' . $center][$vl][$subcat] += $row['val'];
                $tpl_data['data'][$subproj]['total'] += $row['val'];
                $tpl_data['data']['C' . $center][$subcat] += $row['val'];
                $tpl_data['data']['total'] += $row['val'];
            }

        }
        $smarty->assign($tpl_data);
        $html = $smarty->fetch("table_statistics.tpl");
        return $html;

        }


        function setup()
        {
            $DB =& Database::singleton();
            if (Utility::isErrorX($DB)) {
                return PEAR::raiseError("Could not connect to database: ".$DB->getMessage());
            }

            $subprojects = Utility::getSubprojectList(); 
            if(isset($_REQUEST['site']) && $_REQUEST['site'] != '') {
                $ExtraSite_Criteria = 'AND (c.CenterID IS NULL OR c.CenterID=' . $_REQUEST['site'] . ')';
                        }
                        else {
                        $ExtraSite_Criteria = '';
                        }


                        $this->tpl_data['Subprojects'] = $subprojects;

                        //***Requires Visit_Windows table to be populated with all study visits***
                        $visits = Utility::getVisitList(); 


                        // NUMBER OF CANDIDATES STATS TABLE

                        //***Set the visit to one where you want to check # of candidates with a visit (i.e. the first visit in the study) - get from config file***
                        $config =& NDB_Config::singleton();
                        $statisticsConfig = $config->getSetting('statistics');
                        $visit_to_check = $statisticsConfig['visitStats'];


                        $registered_candidates = $DB->pselectOne("SELECT count(DISTINCT(c.PSCID)) as val from candidate as c WHERE c.CenterID <> '1' and c.PSCID <> 'scanner' AND c.Active='Y' " . $ExtraSite_Criteria); 
                        if (Utility::isErrorX($registered_candidates)) {
                            return PEAR::raiseError("DB Error: ".$registered_candidates->getMessage());
                        }


                        $this->tpl_data['registered_candidates'] = $registered_candidates;
                        $total_visit = 0;

                        //Candidates with visit marked as In Progress                        
                        $result_progress = $DB->pselect("SELECT s.subprojectid as rowid, count(DISTINCT(c.PSCID)) as val from candidate as c left join session s ON (s.CandID=c.CandID) WHERE coalesce(s.active, 'Y')='Y' AND c.CenterID <> '1' and c.PSCID <> 'scanner' AND c.Active='Y' AND s.Visit = 'In Progress' AND s.Visit_label LIKE '%$visit_to_check%' $ExtraSite_Criteria group by s.subprojectid");

                        foreach($result_progress as $row) {
                            $this->tpl_data['registered'][$row['rowid']]['progress'] = $row['val'];
                            $this->tpl_data['registered'][$row['rowid']]['visit_total'] += $row['val'];
                            $total_visit += $row['val'];
                        }

                        //Candidates with visit marked as Pass                        
                        $result_pass = $DB->pselect("SELECT s.subprojectid as rowid, count(DISTINCT(c.PSCID)) as val from candidate as c left join session s ON (s.CandID=c.CandID) WHERE coalesce(s.active, 'Y')='Y' AND c.CenterID <> '1' and c.PSCID <> 'scanner' AND c.Active='Y' AND s.Visit = 'Pass' AND s.Visit_label LIKE $visit_to_check $ExtraSite_Criteria group by s.subprojectid"); 

                        foreach($result_pass as $row) {
                            $this->tpl_data['registered'][$row['rowid']]['pass'] = $row['val'];
                            $this->tpl_data['registered'][$row['rowid']]['visit_total'] += $row['val'];
                            $total_visit += $row['val'];
                        }

                        //Candidates with visit marked as Fail                        
                        $result_fail = $DB->pselect("SELECT s.subprojectid as rowid, count(DISTINCT(c.PSCID)) as val from candidate as c left join session s ON (s.CandID=c.CandID) WHERE coalesce(s.active, 'Y')='Y' AND c.CenterID <> '1' and c.PSCID <> 'scanner' AND c.Active='Y' AND s.Visit = 'Failure' AND s.Visit_label LIKE $visit_to_check $ExtraSite_Criteria group by s.subprojectid"); 

                        foreach($result_fail as $row) {
                            $this->tpl_data['registered'][$row['rowid']]['fail'] = $row['val'];
                            $this->tpl_data['registered'][$row['rowid']]['visit_total'] += $row['val'];
                            $total_visit += $row['val'];
                        }

                        //Candidates with visit marked as Withdraw                        
                        $result_withdrawal = $DB->pselect("SELECT s.subprojectid as rowid, count(DISTINCT(c.PSCID)) as val from candidate as c left join session s ON (s.CandID=c.CandID) WHERE coalesce(s.active, 'Y')='Y' AND c.CenterID <> '1' and c.PSCID <> 'scanner' AND c.Active='Y' AND s.Visit = 'Withdrawal' AND s.Visit_label LIKE $visit_to_check $ExtraSite_Criteria group by s.subprojectid"); 

                        foreach($result_withdrawal as $row) {
                            $this->tpl_data['registered'][$row['rowid']]['withdraw'] = $row['val'];
                            $this->tpl_data['registered'][$row['rowid']]['visit_total'] += $row['val'];
                            $total_visit += $row['val'];
                        }

                        $this->tpl_data['registered']['total_visit'] = $total_visit;


                        //COUNT OF CANDIDATES WITH AN MRI SESSION

                        $total_scan = 0; 

                        //Scans for visits marked as Pass
                        $result = $DB->pselect("SELECT count(DISTINCT c.PSCID) as val, s.SubprojectID as rowid FROM session s join candidate c ON (c.CandID=s.CandID) WHERE s.Scan_done='Y'
                                AND s.Visit = 'Pass'
                                AND s.Active='Y' 
                                AND c.Active='Y' 
                                AND c.PSCID<>'scanner'
                                AND s.Current_stage <> 'Recycling Bin'
                                $ExtraSite_Criteria
                                GROUP BY s.SubprojectID"); 
                            foreach($result as $row) {
                                $this->tpl_data['scanned'][$row['rowid']]['pass'] = $row['val'];
                                $this->tpl_data['scanned'][$row['rowid']]['total'] += $row['val'];
                                $total_scan += $row['val'];
                            }

                        //Scans for visits marked as In Progress
                        $result = $DB->pselect("SELECT count(DISTINCT c.PSCID) as val, s.SubprojectID as rowid FROM session s join candidate c ON (c.CandID=s.CandID) WHERE s.Scan_done='Y'
                                AND s.Visit = 'In Progress'
                                AND s.Active='Y' 
                                AND c.Active='Y' 
                                AND c.PSCID<>'scanner'
                                AND s.Current_stage <> 'Recycling Bin'
                                $ExtraSite_Criteria
                                GROUP BY s.SubprojectID"); 
                            foreach($result as $row) {
                                $this->tpl_data['scanned'][$row['rowid']]['progress'] = $row['val'];
                                $this->tpl_data['scanned'][$row['rowid']]['total'] += $row['val'];
                                $total_scan += $row['val'];
                            }

                        //Scans for visits marked as Fail
                        $result = $DB->pselect("SELECT count(DISTINCT c.PSCID) as val, s.SubprojectID as rowid FROM session s join candidate c ON (c.CandID=s.CandID) WHERE s.Scan_done='Y'
                                AND s.Visit = 'Failure'
                                AND s.Active='Y' 
                                AND c.Active='Y' 
                                AND c.PSCID<>'scanner'
                                AND s.Current_stage <> 'Recycling Bin'
                                $ExtraSite_Criteria
                                GROUP BY s.SubprojectID"); 
                            foreach($result as $row) {
                                $this->tpl_data['scanned'][$row['rowid']]['fail'] = $row['val'];
                                $this->tpl_data['scanned'][$row['rowid']]['total'] += $row['val'];
                                $total_scan += $row['val'];
                            }

                        //Scans for visits marked as Withdraw
                        $result = $DB->pselect("SELECT count(DISTINCT c.PSCID) as val, s.SubprojectID as rowid FROM session s join candidate c ON (c.CandID=s.CandID) WHERE s.Scan_done='Y'
                                AND s.Visit = 'Withdrawal'
                                AND s.Active='Y' 
                                AND c.Active='Y' 
                                AND c.PSCID<>'scanner'
                                AND s.Current_stage <> 'Recycling Bin'
                                $ExtraSite_Criteria
                                GROUP BY s.SubprojectID"); 
                            foreach($result as $row) {
                                $this->tpl_data['scanned'][$row['rowid']]['withdraw'] = $row['val'];
                                $this->tpl_data['scanned'][$row['rowid']]['total'] += $row['val'];
                                $total_scan += $row['val'];
                            }

                        $this->tpl_data['scanned']['total'] = $total_scan;

                        // Adds a C to the start of the centerid, because that's how the
                        // template is looking for it. Exclude DCC 
                        $s = Utility::getSiteList();

                        $centers = $DB->pselect("SELECT CONCAT('C', CenterID) as ID, CenterID as NumericID, PSCArea as LongName, Name as ShortName FROM psc WHERE CenterID != '1'"); 
                        if(Utility::isErrorX($centers)) {
                            return PEAR::raiseError("DB Error: ".$centers->getMessage());
                        }
                        $this->tpl_data['Centers'] = $centers;
                        $this->tpl_data['Sites'] = array('' => 'All Sites');
                        foreach ($centers as $row) {
                            $this->tpl_data['Sites'][$row['NumericID']] = $row['LongName'];
                            if($_REQUEST['site'] == $row['NumericID']) {
                                $this->tpl_data['CurrentSite'] = array('ID' => $row['NumericID'], 'Name' => $row['LongName']);
                            }
                        }

                        $this->tpl_data['Subprojects'] = Utility::getSubprojectList(); 
                        $Visits = Utility::getVisitList();
                        $this->tpl_data['Visits'] = $Visits;

                        $instruments  = 
                            array( '' => 'Recruit Gender Breakdown');


                        $this->tpl_data['scored_instruments'] = Utility::getScoredInstruments(); 
                        $this->tpl_data['all_instruments'] = Utility::getAllInstruments();
                        $instr = Utility::getAllInstruments();
                        /*$full_names = array();
                        foreach ($instr as $i=>$j) {
                            $full_name = $DB->pselectOne("SELECT Full_name from test_names where test_name = '$i'");
                            $full_names[$i] = $full_name;
                        }*/

                        $instruments2  = array_merge(
                                array( null=> 'Please select an instrument' ),
                                $instr
                             //   $full_names
                                );

                        if(isset($_REQUEST['instrument2']) && $_REQUEST['instrument2'] != '') {
                            $Subcategories = array('Complete', 'Incomplete'); 
                            $result = $DB->pselect("SELECT count(*) as val, 
                                    f.Data_entry as Subcat, 
                                    c.CenterID as CenterID, 
                                    s.SubprojectID as SubprojectID,
                                    s.Visit_label as VLabel   
                                    FROM session s JOIN candidate c ON (s.CandID=c.CandID)
                                    JOIN flag f ON (f.SessionID=s.ID)
                                    JOIN $_REQUEST[instrument2] i USING(CommentID)
                                    WHERE s.Active='Y' AND
                                    c.CenterID <> '1' AND f.Data_entry='Complete' AND
                                    f.Administration='All' AND
                                    f.CommentID NOT LIKE 'DDE%'
                                    GROUP BY c.CenterID, SubprojectID, VLabel, Subcat
                                    UNION
                                    SELECT count(*) as val, 'Incomplete' as Subcat, 
                                    c.CenterID as CenterID, 
                                    s.SubprojectID as SubprojectID,
                                    s.Visit_label as VLabel 
                                    FROM session s JOIN candidate c USING(CandID) 
                                    JOIN flag f ON (f.SessionID=s.ID) 
                                    JOIN $_REQUEST[instrument2] i USING(CommentID)
                                    WHERE s.Active='Y' and s.CenterID <> 1
                                    AND f.CommentID NOT LIKE 'DDE%' AND (f.Data_entry IS NULL OR f.Data_entry <> 'Complete')
                                    GROUP BY c.CenterID, SubprojectID, VLabel, Subcat"); 
                                    $this->tpl_data['InstrumentsTable'] = $this->render_stats_table("Data Entry Completion Status for $_REQUEST[instrument2]", $Subcategories, $Visits, "instrument2", $instruments2, $_REQUEST['instrument2'], $centers, $result, "data_entry");
                        }

                        $Subcategories = array('Male', 'Female');
                        $result = $DB->pselect("SELECT c.CenterID as CenterID,    
                                s.SubprojectID as SubprojectID,  
                                s.Visit_label as VLabel,     
                                c.gender as Subcat,      
                                count(s.CandID) as val                  
                                FROM session s JOIN candidate c ON (s.CandID=c.CandID)                   
                                WHERE s.active='Y' AND s.CenterID > '1' AND c.CenterID > '1'                     
                                AND ((s.Current_stage IN ('Visit', 'Screening')))              
                                AND COALESCE(s.Visit,'') NOT IN ('Failure', 'Withdrawal')            
                                GROUP BY c.CenterID, SubprojectID, VLabel, Subcat"); 
                            //ORDER BY SubprojectID;

                            if (Utility::isErrorX($result)) {
                                return PEAR::raiseError("DB Error: ".$result->getMessage());
                            }
                        $this->tpl_data['RecruitsTable'] = $this->render_stats_table("Breakdown of Registered Candidates", $Subcategories, $Visits, "instrument", $instruments, '', $centers, $result, "demographics");



                        //---- BEHAVIORAL STATS -----
                        $sites = Utility::getSiteList(true, false); 
                        $mri_data = array();

                        $result = $DB->pselect("SELECT s.CenterID,
                                f.Data_Entry as Data_Entry,
                                s.Visit_label as VLabel,   
                                COUNT(s.CandID) as val
                                FROM session s JOIN candidate c ON (s.CandID=c.CandID)
                                JOIN flag f ON (f.SessionID=s.ID)
                                WHERE 
                                s.Active='Y' 
                                AND c.Active='Y' 
                                AND s.Current_stage <> 'Recycling Bin'
                                AND f.CommentID NOT LIKE 'DDE%' 
                                GROUP by s.CenterID, VLabel, f.Data_Entry"); 

                            foreach($result as $row) {
                                // Put some things into variables to make the lines shorter
                                // so that they don't wrap. Note that "c"(enter array) needs to 
                                // be a reference since we'll be modifying it.
                                $center = $row['CenterID'];
                                $vl = $row['VLabel'];
                                $c =& $this->tpl_data['behaviour']['C' . $center];

                                $c[$vl]['total'] += $row['val'];
                                $c['all']['total'] += $row['val'];
                                if($row['Data_Entry'] == 'Complete') {
                                    $c[$vl]['complete'] += $row['val'];
                                    $c['all']['complete'] += $row['val'];
                                }
                                if($c[$vl]['total'] != 0) {
                                    $c[$vl]['percent'] = 
                                        floor($c[$vl]['complete'] / $c[$vl]['total']*100);
                                }
                                if($c['all']['total'] != 0) {
                                    $c['all']['percent'] = 
                                        floor($c['all']['complete'] / $c['all']['total']*100);
                                }
                            }

                        $sites = Utility::getSiteList(true, false); 
                        $this->tpl_data['DataEntryTable'] = $this->render_stats_table("Data Entry Statistics", $Subcategories, $Visits, "site", $sites, '', $centers, $result, "demographics");

                        // DDE STATS

                        $result = $DB->pselect("SELECT s.CenterID, 
                                f.Data_Entry as Data_Entry, 
                                s.Visit_label as VLabel,   
                                COUNT(s.CandID) as val
                                FROM session as s JOIN candidate as c ON (s.CandID=c.CandID) JOIN flag as f ON (f.SessionID=s.ID) 
                                WHERE s.Active='Y' 
                                AND c.Active='Y' 
                                AND s.Current_stage <> 'Recycling Bin'
                                AND f.CommentID LIKE 'DDE%' 
                                AND f.Data_Entry IS NOT NULL
                                GROUP BY s.CenterID, VLabel, f.Data_Entry ORDER BY c.PSCID"); 
                            foreach($result as $row) {
                                $center = $row['CenterID'];
                                $vl = $row['VLabel'];
                                $c =& $this->tpl_data['dde']['C' . $center];

                                $c[$vl]['total'] += $row['val'];
                                $c['all']['total'] += $row['val'];
                                if($row['Data_Entry'] == 'Complete') {
                                    $c[$vl]['complete'] += $row['val'];
                                    $c['all']['complete'] += $row['val'];
                                }
                                if($c[$vl]['total'] != 0) {
                                    $c[$vl]['percent'] = 
                                        floor($c[$vl]['complete'] / $c[$vl]['total']*100);
                                }
                                if($c['all']['total'] != 0) {
                                    $c['all']['percent'] = 
                                        floor($c['all']['complete'] / $c['all']['total']*100);
                                }
                            }

                        $MRISubcategories = array('Complete', 'Partial Run', 'No Scan'); 
                        $MRIOptions = array();

                        //The MRI scans as coded in the MRI parameter form 
                        $MRI_db_categories = $DB->pselect("SELECT distinct Scan_type from mri_scan_type m right join files f on f.AcquisitionProtocolID = m.ID");  
                        foreach($MRI_db_categories as $key=>$type) {
                            foreach ($type as $scan=>$label){
                                if (!empty($label))
                                    $MRIOptions[$label] =  $label;
                            }
                        }
                        if($_REQUEST['mri_type']) {
                            $MRI_Type = $_REQUEST['mri_type'];
                            //field name should match the field name in the MRI parameter form
                            $MRI_Type_Field = $_REQUEST['mri_type'];
                            $MRIHeader = "$MRI_Type Breakdown";
                            $CaseStatement = "
                                CASE($MRI_Type_Field)
                                WHEN 'Partial' THEN 'Partial Run'
                                WHEN 'No' THEN 'No Scan'
                                ELSE $MRI_Type_Field
                                END";
                        } else {
                            //By default, T1 statistics load
                            $MRI_Type_Field = 'T1';
                            $MRI_Type = 'T1';
                            $MRIHeader = "T1 Scan Done Breakdown";
                            $CaseStatement = "
                                CASE($MRI_Type_Field)
                                WHEN 'Partial' THEN 'Partial Run'
                                WHEN 'No' THEN 'No Scan'
                                ELSE $MRI_Type_Field
                                END";
                        }
                        $scan_done = 'T1';
                        $result = $DB->pselect("SELECT s.SubprojectID, 
                                c.CenterID, 
                                s.Visit_label as VLabel, 
                                $CaseStatement as Subcat,
                                COUNT(*) as val 
                                FROM mri_parameter_form m JOIN flag f USING (CommentID) 
                                JOIN session s ON (f.SessionID=s.ID) 
                                JOIN candidate c ON (c.CandID=s.CandID) 
                                WHERE s.Current_stage <> 'Recycling Bin' 
                                AND s.Active='Y'
                                AND c.Active='Y'
                                AND m.CommentID NOT LIKE 'DDE%'
                                AND f.Administration <> 'None'
                                AND m.Administration = 'All'
                                GROUP BY Subcat, s.SubprojectID, c.CenterID, VLabel"); 
                            // lower(s.Visit_label) as VLabel,
                            //AND m.$scan_done = 'Complete' OR m.$scan_done = 'Partial'
                            $M_Visits = Utility::getVisitList(); 
                        $this->tpl_data['MRI_Done_Table'] = $this->render_stats_table($MRIHeader, $MRISubcategories, $M_Visits, "mri_type", $MRIOptions, $MRI_Type, $centers, $result, "mri");
                        foreach($result as $row) {
                            $center = $row['CenterID'];
                            $cohort = $row['SubprojectID'];
                            $vl = $row['VLabel'];
                            $c =& $this->tpl_data['mri_total'][$cohort]['C' . $center];

                            $c[$vl] += $row['val'];
                            $this->tpl_data['mri_total']['C' . $center][$vl]['total'] += $row['val'];
                            $this->tpl_data['mri_total'][$cohort]['total'] += $row['val'];
                            $this->tpl_data['mri_total']['total'] += $row['val'];

                        }



                        // MRI INTEGRITY STATS 
                        // MRI parameter form is completed, but nothing in tarchive
                        $result = $DB->pselect("SELECT COUNT(distinct f.CommentID) as val, 
                                s.CenterID as CenterID
                                FROM flag f JOIN session s ON (f.SessionID=s.ID) 
                                LEFT JOIN mri_parameter_form m ON (m.CommentID=f.CommentID)
                                LEFT JOIN tarchive t ON (s.CandID=MID(t.PatientName, 9, 6) AND MID(t.PatientName, 16, 3)=s.Visit_label)
                                LEFT JOIN candidate c ON (s.CandID=c.CandID)
                                WHERE f.CommentID NOT LIKE 'DDE%' 
                                AND f.Test_name='mri_parameter_form' 
                                and t.TarchiveID IS NULL
                                AND s.Active='Y' 
                                AND t.TarchiveID IS NULL 
                                AND (m.T1_Scan_done IS NULL OR m.T1_Scan_done <> 'No')
                                AND s.CenterID <> 1
                                AND f.Administration <> 'None'
                                AND f.Data_entry='Complete'
                                GROUP BY s.CenterID"); //, $result);
                        foreach($result as $row) {
                            $this->tpl_data['mri_errors'][$row['CenterID']]['no_tarchive'] = $row['val'];
                        }

                        // MRI parameter form completed, but nothing in browser
                        $result = $DB->pselect("SELECT s.CenterID as CenterID, 
                                COUNT(distinct f.CommentID) as val
                                FROM mri_parameter_form m LEFT JOIN flag f ON (f.CommentID=m.CommentID)
                                LEFT JOIN session s ON (s.ID=f.SessionID) 
                                LEFT JOIN files fi ON (fi.SessionID=f.SessionID) 
                                WHERE (m.DTI64_Scan_done <> 'No' 
                                    OR m.T1_Scan_done <> 'No') 
                                AND fi.FileID IS NULL 
                                AND s.Active='Y' 
                                AND s.CenterID <> 1
                                AND f.Data_entry = 'Complete'
                                GROUP by s.CenterID"); 
                            foreach($result as $row) {
                                $this->tpl_data['mri_errors'][$row['CenterID']]['no_browser'] = $row['val'];
                            }

                        // MRI Browser populated, but no MRI parameter form completed.
                        $result = $DB->pselect("SELECT s.CenterID as CenterID, COUNT(distinct s.ID) as val
                                FROM files LEFT JOIN session s ON (files.SessionID=s.ID)
                                LEFT JOIN flag f on (f.SessionID=s.ID
                                    AND f.Test_name='mri_parameter_form' 
                                    AND f.CommentID NOT LIKE 'DDE%') 
                                LEFT JOIN mri_parameter_form mpf ON (mpf.CommentID=f.CommentID)
                                LEFT JOIN candidate c ON (c.CandID=s.CandID)
                                WHERE s.Active='Y' 
                                AND (f.ID IS NULL OR f.Data_entry <> 'Complete' OR f.Data_entry IS NULL) 
                                AND c.Active = 'Y'
                                AND c.PSCID <> 'scanner'
                                AND s.CenterID <> 1
                                GROUP BY s.CenterID"); 
                            foreach($result as $row) {
                                $this->tpl_data['mri_errors'][$row['CenterID']]['no_parameter'] = $row['val'];
                            }


                        // TOP MRI TABLE

                        // Below this has not been optimized. It's kind of ugly.
                        foreach($centers as $center) {
                            $id = $center['NumericID'];
                            $name = $center['ShortName'];
                            //$name = $center['LongName'];

                            // -------- MRI STATS---------------

                            $claimed = $DB->pselect("SELECT COUNT(s.CandID) FROM session as s, psc as p, candidate as c WHERE c.CandID=s.CandID AND s.Active='Y' AND s.CenterID=p.CenterID  AND s.Scan_done='Y' AND s.CenterID={$id} ORDER BY s.CandID"); 
                            if (Utility::isErrorX($claimed)) {
                                return PEAR::raiseError("DB Error: ".$claimed->getMessage());
                            }
                            list(,$claimed)=each($claimed[0]);
                            $claimed_count = $claimed;

                            $forms = $DB->pselect("SELECT COUNT(s.CandID) FROM mri_parameter_form as pf, session as s, flag as f, psc as p, candidate as c WHERE f.CommentID=pf.CommentID AND s.ID=f.SessionID AND c.CandID=s.CandID AND s.Active='Y' AND s.CenterID=p.CenterID AND pf.Data_entry_completion_status='Complete' AND s.CenterID={$id} ORDER BY p.Name"); 
                            if (Utility::isErrorX($forms)) {
                                return PEAR::raiseError("DB Error: ".$forms->getMessage());
                            }
                            list(,$forms)=each($forms[0]);
                            $forms_count = $forms;

                            $mri_data[] = array('name' => $name,  'claimed_count' => $claimed_count, 'forms_count' => $forms_count);

                        }


                        //$scans = array('T1_Scan_done', 'FLAIR_Scan_done', 'DTI64_Scan_done', 'Fieldmap_DTI_Scan_done', 'Fieldmap_BOLD_Scan_done', 'BOLD_Resting_Scan_done', 'GRE_T2_star_Scan_done', 'ASL_Scan_done');
                        $sum = 0;
                        $sum_files = 0;
                        $count = array();
                        $total = array('Name' => 'Total');
                        foreach ($MRIOptions as $key=>$scan) {
                            $total[$key] = 0;
                        }
                        $total['All'] = 0; 
                        $scans_inserted = $total; //array('Name' => 'Total', 'T1' => '0', 'FLAIR' => 0, 'DTI64' => 0, 'Fieldmap_DTI'=>0, 'Fieldmap_BOLD'=>0, 'BOLD_Resting'=>0, 'GRE_T2_star'=>0, 'ASL'=>0, 'All' => 0);
                        $count_pass = $total; //array('Name' => 'Total', 'T1' => '0', 'FLAIR' => 0, 'DTI64' => 0, 'Fieldmap_DTI'=>0, 'Fieldmap_BOLD'=>0, 'BOLD_Resting'=>0, 'GRE_T2_star'=>0, 'ASL'=>0, 'All' => 0);
                        $total_files = $total; //array('Name' => 'Total', 'T1' => '0', 'FLAIR' => 0, 'DTI64' => 0, 'Fieldmap_DTI'=>0, 'Fieldmap_BOLD'=>0, 'BOLD_Resting'=>0, 'GRE_T2_star'=>0, 'ASL'=>0, 'All' => 0);
                        $total_pass = $total; //array('Name' => 'Total', 'T1' => '0', 'FLAIR' => 0, 'DTI64' => 0, 'Fieldmap_DTI'=>0, 'Fieldmap_BOLD'=>0, 'BOLD_Resting'=>0, 'GRE_T2_star'=>0, 'ASL'=>0, 'All' => 0);

                        foreach (Utility::getSiteList() as $site) {
                            $row = array(null=>"");
                            if ($site != 'DCC') {
                                $row['Center'] = $site;
                                $sum = 0;
                                $sum_files = 0;
                                foreach ($MRIOptions as $key=>$scan) {
                                    $count = $DB->pselectRow("SELECT $scan,  psc.Name as Center, COUNT(DISTINCT c.CandID) as count FROM candidate c 
                                            JOIN session s ON (c.CandID=s.CandID and s.Active='Y' and s.Current_stage <> 'Recycling Bin') 
                                            JOIN flag f ON (f.SessionID=s.ID and f.Test_name='mri_parameter_form' AND f.CommentID NOT LIKE 'DDE%') 
                                            JOIN mri_parameter_form m ON (f.CommentID=m.CommentID)  
                                            JOIN psc on c.CenterID = psc.CenterID
                                            WHERE     c.Active='Y' AND c.PSCID  not like 'dcc%'  
                                            AND c.PSCID <> 'scanner' 
                                            AND psc.Name = '$site' 
                                            AND m.$scan = 'Complete' 
                                            GROUP BY c.CenterID ORDER BY c.CenterID");
                                    if (empty($count))
                                        $count['count'] = 0;
                                    $row[$type] = $count['count'];
                                    $sum += $row[$type];
                                    //print_r($count);
                                }
                                // 

                                //foreach ($MultiTimepoint as $row) 
                                $this->tpl_data['mri_all_scans_done'][] = array('Name' => $row['Center']); 
                                foreach ($MRIOptions as $key=>$scan) {
                                    $this->tpl_data['mri_all_scans_done'][$key] = $row[$key];
                                    $total[$key] += $row[$key];
                                }
                                $this->tpl_data['All'] = $sum;
                                $total['All'] += $sum;
                                //'T1' => $row['T1'],
                                //$total['T1'] += $row['T1'];

                                $files = $DB->pselect("SELECT m.Scan_type as type, count(*) as c, 
                                        s.Visit_label as VLabel
                                        FROM files f 
                                        JOIN mri_scan_type m on m.ID = f.AcquisitionProtocolID 
                                        JOIN session s on f.sessionID = s.ID 
                                        JOIN psc on s.CenterID = psc.CenterID 
                                        WHERE s.Active = 'Y' and psc.Name = '$site' 
                                        GROUP BY m.Scan_type, VLabel");
                                $pass = $DB->pselect("SELECT count(mriQCStatus) as count_pass, scan_type as type, 
                                        s.Visit_label as VLabel
                                        FROM psc p join session s using(CenterID) 
                                        JOIN files f on s.ID = f.SessionID 
                                        JOIN mri_scan_type m on f.AcquisitionProtocolID=m.ID 
                                        WHERE mriQCStatus = 'Pass' and p.Name = '$site' 
                                        GROUP BY scan_type, VLabel");

                                //                                $mappings = array('T1'=>'adniT1', 'FLAIR'=>'FLAIR', 'DTI64'=>'DTI', 'Fieldmap_BOLD'=>'Fieldmap', 'Fieldmap_DTI'=>'Fieldmap', 'BOLD_Resting'=>'Resting', 'GRE_T2_star'=>'greT2star', 'ASL'=>'ASL');

                                foreach ($files as $file) {
                                    $scans_inserted['Name'] = $site;
                                    $scans_inserted[$file['type']] += $file['c'];
                                    $total_files[$file['type']] += $file['c'];
                                    $sum_files += $file['c'];
                                }

                                $sum_pass = 0;
                                foreach ($pass as $p) {
                                    $count_pass['Name'] = $site;
                                    $count_pass[$p['type']] += $p['count_pass'];
                                    $total_pass[$p['type']] += $p['count_pass'];
                                    $sum_pass += $p['count_pass'];
                                }
                            }
                        }
                        $scans_inserted['All'] = $sum_files; 
                        $count_pass['All'] = $sum_pass; 
                        $total_files['All'] = $sum_files; 
                        $total_pass['All'] = $sum_pass; 

                        //                        $this->tpl_data['mri_all_scans_done'][] = $total;
                        $this->tpl_data['mri_all_scans_inserted'][] = $scans_inserted;
                        $this->tpl_data['count_pass'][] = $count_pass;

                        $this->tpl_data['mri_total_scans_done'][] = $total;
                        $this->tpl_data['mri_total_scans_inserted'] = $total_files;
                        $this->tpl_data['total_pass'] = $total_pass;

                        $this->tpl_data['mri_data'] = $mri_data;


                        $feedback_comments = $DB->pselect("SELECT m.scan_type, fp.Comment, count(f.PredefinedCommentID) as count, 
                                s.Visit_label as VLabel
                                FROM mri_scan_type m join files fi on m.ID = fi.AcquisitionProtocolID 
                                JOIN session s on fi.sessionID = s.ID
                                JOIN feedback_mri_comments f on fi.FileID=f.FileID 
                                JOIN feedback_mri_predefined_comments fp on f.PredefinedCommentID = fp.PredefinedCommentID 
                                WHERE f.SessionID IS NULL 
                                AND f.PredefinedCommentID = '4' OR f.PredefinedCommentID = '6' OR f.PredefinedCommentID = '8' OR f.PredefinedCommentID = '9' OR f.PredefinedCommentID = '36' 
                                GROUP BY f.PredefinedCommentID, m.scan_type, VLabel");

                        $comments = array();
                        foreach ($feedback_comments as $key=>$data)
                        {
                            if (!array_key_exists($data['Comment'], $comments)) {
                                $comments[$data['Comment']] = $total; //array('T1'=>0, 'FLAIR'=>0, '64 DTI'=>0, 'DTI Fieldmap'=>0, 'BOLD Fieldmap'=>0, 'Resting BOLD'=>0, 'GRE T2*'=>0, 'ASL'=>0, 'All'=>0);
                            }

                            $comments[$data['Comment']][$data['scan_type']] += $data['count']; 
                            $comments[$data['Comment']]['All'] += $data['count'];


                            //                            if ($g['scan_type'] == 'adniT1') 
                            $new_feedback[$data['scan_type']][$data['Comment']] = $data['count'];
                            //foreach($g as $comment=>$count) {
                            //$new_feedback[$g['Comment']] = $g['count'];
                            //$this->tpl_data['mri_all_scans_done'][] = array(    
                            //}
                            foreach($MRIOptions as $label=>$field) {
                                if (!array_key_exists($new_feedback, $label))
                                    $new_feedback[$label] = 0;
                            }

                        }
                        $this->tpl_data['feedback_mri_comments'] = $comments;

        } // End function

    } // End class
    ?>
